/**
 * Publish the viewer-request CloudFront Function that rewrites extensionless
 * paths to *.html (fixes static export refresh on /klong, /dine, etc.),
 * then attach it to your **default** cache behavior.
 *
 * Prerequisites:
 *   - AWS credentials (CLI profile or env) with cloudfront:* on the function
 *     and distribution, and sts:GetCallerIdentity.
 *
 * From repo root:
 *   npm run cloudfront:html-rewrite -- --distribution-id E1234567890ABC
 *
 * List distribution IDs in the current account (find the right one):
 *   npm run cloudfront:html-rewrite -- --list-distributions
 *
 * Options:
 *   --distribution-id ID   (required unless --list-distributions) CloudFront ID
 *   --function-name NAME   default: hotel-poinisuk-append-html
 *   --list-distributions   print Id, domain, aliases; exit (no changes)
 *   --dry-run              print steps only, no AWS calls
 */

/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");
const {
  CloudFrontClient,
  CreateFunctionCommand,
  DescribeFunctionCommand,
  UpdateFunctionCommand,
  PublishFunctionCommand,
  GetDistributionCommand,
  UpdateDistributionCommand,
  ListDistributionsCommand,
} = require("@aws-sdk/client-cloudfront");
const { STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-sts");

const CLOUDFRONT_REGION = "us-east-1";
const FUNCTION_SOURCE_FILE = path.join(
  __dirname,
  "..",
  "cloudfront-function-append-html.js"
);

function parseArgs(argv) {
  const out = {
    distributionId: null,
    functionName: "hotel-poinisuk-append-html",
    dryRun: false,
    listDistributions: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--distribution-id") out.distributionId = argv[++i];
    else if (a === "--function-name") out.functionName = argv[++i];
    else if (a === "--dry-run") out.dryRun = true;
    else if (a === "--list-distributions" || a === "--list") out.listDistributions = true;
    else if (a === "--help" || a === "-h") out.help = true;
  }
  return out;
}

function usage() {
  console.log(`Usage:
  node attach.cjs --distribution-id E1234567890ABC [--function-name hotel-poinisuk-append-html]

List CloudFront distributions in the current AWS account / credentials:
  node attach.cjs --list-distributions

Or from repo root:
  npm run cloudfront:html-rewrite -- --distribution-id E1234567890ABC
  npm run cloudfront:html-rewrite -- --list-distributions
`);
}

/** Remove leading block comment; CloudFront rejects large/odd payloads. */
function prepareFunctionCode(raw) {
  const withoutBlock = raw.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, "");
  return Buffer.from(withoutBlock.trim(), "utf8");
}

function isFunctionNotFound(err) {
  return (
    err?.name === "NoSuchFunctionExists" ||
    err?.Code === "NoSuchFunctionExists" ||
    String(err?.message || "").includes("NoSuchFunctionExists")
  );
}

async function ensureFunctionPublished(client, name, codeBytes) {
  let etag;
  try {
    const desc = await client.send(new DescribeFunctionCommand({ Name: name }));
    etag = desc.ETag;
    console.log(`[cloudfront] Updating function "${name}"…`);
    const up = await client.send(
      new UpdateFunctionCommand({
        Name: name,
        IfMatch: etag,
        FunctionCode: codeBytes,
        FunctionConfig: {
          Comment:
            "Rewrite clean URLs to Next static export *.html (viewer-request)",
          Runtime: "cloudfront-js-2.0",
        },
      })
    );
    etag = up.ETag;
  } catch (err) {
    if (!isFunctionNotFound(err)) throw err;
    console.log(`[cloudfront] Creating function "${name}"…`);
    const created = await client.send(
      new CreateFunctionCommand({
        Name: name,
        FunctionCode: codeBytes,
        FunctionConfig: {
          Comment:
            "Rewrite clean URLs to Next static export *.html (viewer-request)",
          Runtime: "cloudfront-js-2.0",
        },
      })
    );
    etag = created.ETag;
  }

  console.log(`[cloudfront] Publishing "${name}"…`);
  await client.send(
    new PublishFunctionCommand({
      Name: name,
      IfMatch: etag,
    })
  );
}

async function listAllDistributions(client) {
  const rows = [];
  let marker;
  do {
    const out = await client.send(new ListDistributionsCommand({ Marker: marker }));
    const list = out.DistributionList;
    const items = list?.Items ?? [];
    for (const d of items) {
      rows.push({
        Id: d.Id,
        DomainName: d.DomainName,
        Aliases: d.Aliases?.Items?.length ? d.Aliases.Items.join(", ") : "—",
        Status: d.Status,
        Comment: d.Comment && String(d.Comment).trim() ? d.Comment : "—",
      });
    }
    marker = list?.IsTruncated ? list.NextMarker : undefined;
  } while (marker);
  return rows;
}

async function assertDistributionInAccount(client, distributionId, accountId) {
  try {
    const out = await client.send(
      new GetDistributionCommand({ Id: distributionId })
    );
    const dist = out.Distribution;
    const dc = dist?.DistributionConfig;
    if (!dc?.DefaultCacheBehavior) {
      throw new Error("Distribution has no DefaultCacheBehavior");
    }
    const aliases = dc?.Aliases?.Items?.length ? dc.Aliases.Items.join(", ") : "—";
    const comment = dc?.Comment && String(dc.Comment).trim() ? dc.Comment : "—";
    console.log("[cloudfront] Resolved distribution:", distributionId);
    console.log("[cloudfront]   Aliases:", aliases);
    console.log(
      "[cloudfront]   CloudFront domain:",
      dist?.DomainName ? `https://${dist.DomainName}` : "—"
    );
    console.log("[cloudfront]   Comment:", comment);
    return { ETag: out.ETag, DistributionConfig: dc };
  } catch (err) {
    const meta = err?.$metadata;
    const code = err?.name || err?.Code;
    console.error(
      `[cloudfront] AWS: ${code ?? "Error"}  HTTP=${meta?.httpStatusCode ?? "?"}  ${String(err?.message || err)}`
    );
    const msg = String(err?.message || err);
    const notFound =
      msg.includes("does not exist") ||
      code === "NoSuchDistribution" ||
      code === "NotFound";
    if (!notFound) {
      console.error(
        "\n[cloudfront] If you see AccessDenied, sign in with an IAM user that can read this distribution.\n"
      );
      process.exit(1);
    }
    console.error(
      `\n[cloudfront] CloudFront returned “not found” for id "${distributionId}" while using account ${accountId} (from sts:GetCallerIdentity).`
    );
    console.error(
      "[cloudfront] The id can be correct in the console and still fail here if the console is a *different* AWS account than your CLI."
    );
    console.error(
      "[cloudfront] In the console: click your name (top right) → copy the 12-digit Account id; it must match the account above."
    );
    console.error(
      "[cloudfront] Then:  aws sts get-caller-identity   and   npm run cloudfront:html-rewrite -- --list-distributions"
    );
    console.error(
      "[cloudfront] Also re-copy the Id from CloudFront → Distributions (avoid 0 vs O).\n"
    );
    process.exit(1);
  }
}

async function attachToDefaultBehavior(
  client,
  distributionId,
  functionArn,
  cachedConfig
) {
  if (!cachedConfig?.ETag || !cachedConfig?.DistributionConfig) {
    throw new Error("attachToDefaultBehavior: missing distribution config / ETag");
  }
  const conf = cachedConfig;
  const distEtag = conf.ETag;
  const dc = conf.DistributionConfig;
  if (!dc?.DefaultCacheBehavior) {
    throw new Error("DistributionConfig missing DefaultCacheBehavior");
  }

  const prev = dc.DefaultCacheBehavior.FunctionAssociations;
  const existingItems = prev?.Items?.length ? [...prev.Items] : [];
  const filtered = existingItems.filter(
    (item) => item.EventType !== "viewer-request"
  );
  filtered.push({
    FunctionARN: functionArn,
    EventType: "viewer-request",
  });

  dc.DefaultCacheBehavior = {
    ...dc.DefaultCacheBehavior,
    FunctionAssociations: {
      Quantity: filtered.length,
      Items: filtered,
    },
  };

  console.log(
    `[cloudfront] Updating distribution ${distributionId} (default behavior viewer-request)…`
  );
  await client.send(
    new UpdateDistributionCommand({
      Id: distributionId,
      DistributionConfig: dc,
      IfMatch: distEtag,
    })
  );
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    usage();
    process.exit(0);
  }

  const cf = new CloudFrontClient({ region: CLOUDFRONT_REGION });
  const sts = new STSClient({ region: CLOUDFRONT_REGION });

  if (args.listDistributions) {
    const identity = await sts.send(new GetCallerIdentityCommand({}));
    console.log("[cloudfront] Account:", identity.Account ?? "?");
    const rows = await listAllDistributions(cf);
    if (!rows.length) {
      console.log("[cloudfront] No distributions in this account.");
      return;
    }
    const wId = Math.max(16, ...rows.map((r) => String(r.Id).length));
    console.log("");
    for (const r of rows) {
      console.log(
        `${String(r.Id).padEnd(wId)}  ${r.Status?.padEnd(9) ?? ""}  ${r.DomainName}`
      );
      console.log(`${"".padEnd(wId)}  aliases: ${r.Aliases}`);
      console.log(`${"".padEnd(wId)}  comment: ${r.Comment}`);
      console.log("");
    }
    console.log(
      "Pass the Id for your static site to: --distribution-id <Id>"
    );
    return;
  }

  if (!args.distributionId) {
    usage();
    process.exit(1);
  }

  if (!fs.existsSync(FUNCTION_SOURCE_FILE)) {
    console.error(`Missing function source: ${FUNCTION_SOURCE_FILE}`);
    process.exit(1);
  }

  const rawSource = fs.readFileSync(FUNCTION_SOURCE_FILE, "utf8");
  const codeBytes = prepareFunctionCode(rawSource);

  if (args.dryRun) {
    console.log("[dry-run] Would publish function:", args.functionName);
    console.log("[dry-run] Would attach to distribution:", args.distributionId);
    console.log("[dry-run] Code bytes:", codeBytes.length);
    return;
  }

  const identity = await sts.send(new GetCallerIdentityCommand({}));
  const account = identity.Account;
  if (!account) {
    throw new Error("STS did not return an account ID (check AWS credentials).");
  }
  const functionArn = `arn:aws:cloudfront::${account}:function/${args.functionName}`;
  console.log("[cloudfront] Account:", account);
  console.log("[cloudfront] Function ARN:", functionArn);

  const distConfig = await assertDistributionInAccount(
    cf,
    args.distributionId,
    account
  );

  await ensureFunctionPublished(cf, args.functionName, codeBytes);
  await attachToDefaultBehavior(
    cf,
    args.distributionId,
    functionArn,
    distConfig
  );

  console.log(
    "\n[cloudfront] Done. Propagation can take several minutes; invalidate cache if needed."
  );
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
