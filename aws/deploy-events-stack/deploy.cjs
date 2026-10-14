/**
 * Hotel Poinisuk — deploy all AWS resources for the events (karaoke) API.
 *
 * Prerequisites:
 *   - Node.js 18+
 *   - AWS credentials (env AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY,
 *     or profile, or SSO) with permission to create DynamoDB, S3, IAM,
 *     Lambda, API Gateway in the target region.
 *
 * Usage (from this directory, after npm install):
 *   node deploy.cjs --bucket YOUR-GLOBALLY-UNIQUE-BUCKET --admin-password "StrongPass!"
 *
 * Options:
 *   --region ap-south-1          AWS region (default: ap-south-1)
 *   --table hotel-poinisuk-events
 *   --function hotel-poinisuk-events-api
 *   --api-name hotel-poinisuk-events
 *   --bucket REQUIRED            S3 bucket for event images (globally unique)
 *   --admin-password REQUIRED    Plain password; hashed and stored only on Lambda
 *   --jwt-secret OPTIONAL        Defaults to random 64 hex chars
 *   --site-origin URL            Repeatable. CORS + ALLOWED_ORIGIN (default: hotel site + localhost)
 *
 * After success, set in your Next.js env:
 *   NEXT_PUBLIC_EVENTS_API_BASE=<printed ApiEndpoint>
 *
 * State file `.events-stack-state.json` remembers the API id between runs.
 */

/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const crypto = require("crypto");
const archiver = require("archiver");
const bcrypt = require("bcryptjs");

const {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
  ResourceNotFoundException,
} = require("@aws-sdk/client-dynamodb");
const {
  S3Client,
  CreateBucketCommand,
  PutBucketPolicyCommand,
  PutPublicAccessBlockCommand,
  PutBucketCorsCommand,
} = require("@aws-sdk/client-s3");
const {
  IAMClient,
  CreateRoleCommand,
  GetRoleCommand,
  PutRolePolicyCommand,
  EntityAlreadyExistsException,
} = require("@aws-sdk/client-iam");
const {
  LambdaClient,
  CreateFunctionCommand,
  GetFunctionCommand,
  GetFunctionConfigurationCommand,
  UpdateFunctionCodeCommand,
  UpdateFunctionConfigurationCommand,
  AddPermissionCommand,
  ResourceConflictException,
} = require("@aws-sdk/client-lambda");
const {
  ApiGatewayV2Client,
  CreateApiCommand,
  CreateIntegrationCommand,
  CreateRouteCommand,
  CreateStageCommand,
  GetApisCommand,
  GetRoutesCommand,
} = require("@aws-sdk/client-apigatewayv2");
const { STSClient, GetCallerIdentityCommand } = require("@aws-sdk/client-sts");

// -----------------------------------------------------------------------------
// Args
// -----------------------------------------------------------------------------

function parseArgs(argv) {
  const out = {
    region: "ap-south-1",
    table: "hotel-poinisuk-events",
    functionName: "hotel-poinisuk-events-api",
    apiName: "hotel-poinisuk-events",
    roleName: "hotel-poinisuk-events-lambda-role",
    bucket: null,
    adminPassword: null,
    jwtSecret: null,
    siteOrigins: [
      "https://www.hotelpoinisuk.com",
      "https://hotelpoinisuk.com",
      "http://localhost:3000",
    ],
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--region") out.region = argv[++i];
    else if (a === "--table") out.table = argv[++i];
    else if (a === "--function") out.functionName = argv[++i];
    else if (a === "--api-name") out.apiName = argv[++i];
    else if (a === "--role") out.roleName = argv[++i];
    else if (a === "--bucket") out.bucket = argv[++i];
    else if (a === "--admin-password") out.adminPassword = argv[++i];
    else if (a === "--jwt-secret") out.jwtSecret = argv[++i];
    else if (a === "--site-origin") {
      const o = argv[++i];
      if (o) out.siteOrigins.push(o);
    } else if (a === "--help" || a === "-h") {
      out.help = true;
    }
  }
  return out;
}

function usage() {
  console.log(`
Hotel Poinisuk — AWS events stack deployer

  cd aws/deploy-events-stack
  npm install
  node deploy.cjs --bucket YOUR-UNIQUE-BUCKET-NAME --admin-password "YourStrongPassword"

Required:
  --bucket              Globally unique S3 bucket name for event images
  --admin-password      Admin login password (only stored as bcrypt hash on Lambda)

Optional:
  --region              Default: ap-south-1
  --table               Default: hotel-poinisuk-events
  --function            Default: hotel-poinisuk-events-api
  --api-name            Default: hotel-poinisuk-events
  --jwt-secret          Random if omitted
  --site-origin         Extra CORS origin (repeatable)
`);
}

// -----------------------------------------------------------------------------
// Small helpers
// -----------------------------------------------------------------------------

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitUntilLambdaIdle(lambda, functionName) {
  for (let i = 0; i < 90; i++) {
    const c = await lambda.send(
      new GetFunctionConfigurationCommand({ FunctionName: functionName })
    );
    if (c.LastUpdateStatus === "Failed") {
      throw new Error(
        `Lambda update failed: ${c.LastUpdateStatusReason || "unknown"}`
      );
    }
    const updating = c.LastUpdateStatus === "InProgress";
    if (!updating && c.State === "Active") return;
    await sleep(1500);
  }
  throw new Error("Lambda did not become Active in time.");
}

async function waitForTableActive(ddb, tableName) {
  for (let i = 0; i < 60; i++) {
    try {
      const d = await ddb.send(new DescribeTableCommand({ TableName: tableName }));
      if (d.Table?.TableStatus === "ACTIVE") return;
    } catch (e) {
      if (e instanceof ResourceNotFoundException) {
        /* still creating */
      } else throw e;
    }
    await sleep(2000);
  }
  throw new Error("DynamoDB table did not become ACTIVE in time.");
}

const STATE_FILE = path.join(__dirname, ".events-stack-state.json");

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveState(obj) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(obj, null, 2), "utf8");
}

function zipDirectory(srcDir, outZipPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outZipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });
    output.on("close", () => resolve(archive.pointer()));
    archive.on("error", reject);
    archive.pipe(output);
    archive.file(path.join(srcDir, "index.js"), { name: "index.js" });
    archive.file(path.join(srcDir, "package.json"), { name: "package.json" });
    archive.directory(path.join(srcDir, "node_modules"), "node_modules");
    archive.finalize();
  });
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  const opts = parseArgs(process.argv);
  if (opts.help) {
    usage();
    process.exit(0);
  }
  if (!opts.bucket || !opts.adminPassword) {
    console.error("Error: --bucket and --admin-password are required.\n");
    usage();
    process.exit(1);
  }

  /** @type {Record<string, any>} */
  let state = loadState();
  const hadStoredJwt = Boolean(state.jwtSecret);

  const region = opts.region;
  const jwtSecret =
    opts.jwtSecret || state.jwtSecret || crypto.randomBytes(32).toString("hex");
  const jwtAutoGenerated = !opts.jwtSecret && !hadStoredJwt;
  const adminHash = bcrypt.hashSync(opts.adminPassword, 12);
  const imagesPublicBase = `https://${opts.bucket}.s3.${region}.amazonaws.com`;
  const allowedOrigin =
    opts.siteOrigins[0] || "https://www.hotelpoinisuk.com";

  const ddb = new DynamoDBClient({ region });
  const s3 = new S3Client({ region });
  const iam = new IAMClient({ region });
  const lambda = new LambdaClient({ region });
  const apigw = new ApiGatewayV2Client({ region });
  const sts = new STSClient({ region });

  console.log("→ Fetching AWS account…");
  const iden = await sts.send(new GetCallerIdentityCommand({}));
  const accountId = iden.Account;
  if (!accountId) throw new Error("Could not resolve AWS account ID.");

  const tableArn = `arn:aws:dynamodb:${region}:${accountId}:table/${opts.table}`;
  const bucketArn = `arn:aws:s3:::${opts.bucket}`;
  const bucketObjectsArn = `${bucketArn}/*`;

  // ----- DynamoDB -----
  console.log(`→ DynamoDB table "${opts.table}"…`);
  try {
    await ddb.send(
      new CreateTableCommand({
        TableName: opts.table,
        BillingMode: "PAY_PER_REQUEST",
        KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
        AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
      })
    );
    console.log("  Created (new).");
  } catch (e) {
    if (e.name === "ResourceInUseException") {
      console.log("  Already exists, skipping create.");
    } else throw e;
  }
  await waitForTableActive(ddb, opts.table);

  // ----- S3 -----
  console.log(`→ S3 bucket "${opts.bucket}"…`);
  try {
    const createOpts = { Bucket: opts.bucket };
    if (region !== "us-east-1") {
      createOpts.CreateBucketConfiguration = {
        LocationConstraint: region,
      };
    }
    await s3.send(new CreateBucketCommand(createOpts));
    console.log("  Created (new).");
  } catch (e) {
    if (
      e.name === "BucketAlreadyOwnedByYou" ||
      e.name === "BucketAlreadyExists"
    ) {
      console.log("  Already exists, skipping create.");
    } else throw e;
  }

  await s3.send(
    new PutPublicAccessBlockCommand({
      Bucket: opts.bucket,
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        IgnorePublicAcls: false,
        BlockPublicPolicy: false,
        RestrictPublicBuckets: false,
      },
    })
  );

  const bucketPolicy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicReadGetObject",
        Effect: "Allow",
        Principal: "*",
        Action: "s3:GetObject",
        Resource: bucketObjectsArn,
      },
    ],
  };
  await s3.send(
    new PutBucketPolicyCommand({
      Bucket: opts.bucket,
      Policy: JSON.stringify(bucketPolicy),
    })
  );

  const cors = {
    CORSRules: [
      {
        AllowedHeaders: ["*"],
        AllowedMethods: ["GET", "PUT", "HEAD"],
        AllowedOrigins: [...new Set(opts.siteOrigins)],
        ExposeHeaders: ["ETag"],
        MaxAgeSeconds: 3000,
      },
    ],
  };
  await s3.send(
    new PutBucketCorsCommand({
      Bucket: opts.bucket,
      CORSConfiguration: cors,
    })
  );
  console.log("  Policy + CORS applied.");

  // ----- IAM role -----
  console.log(`→ IAM role "${opts.roleName}"…`);
  const trustPolicy = {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: { Service: "lambda.amazonaws.com" },
        Action: "sts:AssumeRole",
      },
    ],
  };

  let roleArn;
  try {
    const cr = await iam.send(
      new CreateRoleCommand({
        RoleName: opts.roleName,
        AssumeRolePolicyDocument: JSON.stringify(trustPolicy),
        Description: "Hotel Poinisuk events Lambda execution role",
      })
    );
    roleArn = cr.Role.Arn;
    console.log("  Created (new).");
  } catch (e) {
    if (e instanceof EntityAlreadyExistsException) {
      const gr = await iam.send(new GetRoleCommand({ RoleName: opts.roleName }));
      roleArn = gr.Role.Arn;
      console.log("  Already exists, reusing.");
    } else throw e;
  }

  const inlinePolicy = {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Action: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        Resource: "arn:aws:logs:*:*:*",
      },
      {
        Effect: "Allow",
        Action: [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan",
        ],
        Resource: tableArn,
      },
      {
        Effect: "Allow",
        Action: ["s3:PutObject", "s3:GetObject"],
        Resource: bucketObjectsArn,
      },
    ],
  };

  await iam.send(
    new PutRolePolicyCommand({
      RoleName: opts.roleName,
      PolicyName: "hotel-poinisuk-events-inline",
      PolicyDocument: JSON.stringify(inlinePolicy),
    })
  );

  console.log("  Inline policy updated.");

  // IAM eventual consistency
  console.log("→ Waiting 12s for IAM role propagation…");
  await sleep(12000);

  // ----- Lambda zip -----
  const eventsApiDir = path.resolve(__dirname, "../events-api");
  if (!fs.existsSync(path.join(eventsApiDir, "index.js"))) {
    throw new Error(`events-api not found at ${eventsApiDir}`);
  }

  console.log("→ npm install in events-api (production deps)…");
  // On Windows, `shell: true` is required so `npm` resolves correctly in PATH.
  const npmResult = spawnSync(
    process.platform === "win32" ? "npm.cmd" : "npm",
    ["install", "--omit=dev", "--no-fund", "--no-audit"],
    {
      cwd: eventsApiDir,
      stdio: "inherit",
      shell: true,
      env: process.env,
    }
  );
  if (npmResult.error) {
    throw new Error(
      `npm install in events-api failed: ${npmResult.error.message}\n` +
        `  cwd: ${eventsApiDir}\n` +
        `  Fix: ensure Node.js and npm are installed and on your PATH, then run:\n` +
        `  cd "${eventsApiDir}" && npm install --omit=dev`
    );
  }
  if (npmResult.signal) {
    throw new Error(
      `npm install was killed by signal ${npmResult.signal}.\n` +
        `  cwd: ${eventsApiDir}`
    );
  }
  if (npmResult.status !== 0) {
    throw new Error(
      `npm install in events-api exited with code ${npmResult.status}.\n` +
        `  cwd: ${eventsApiDir}\n` +
        `  Run manually to see the full error:\n` +
        `  cd "${eventsApiDir}" && npm install --omit=dev`
    );
  }

  const zipPath = path.join(__dirname, "function-deploy.zip");
  console.log("→ Building function-deploy.zip…");
  await zipDirectory(eventsApiDir, zipPath);
  const zipBuffer = fs.readFileSync(zipPath);

  const envVars = {
    EVENTS_TABLE: opts.table,
    IMAGES_BUCKET: opts.bucket,
    IMAGES_PUBLIC_BASE: imagesPublicBase,
    ADMIN_PASSWORD_HASH: adminHash,
    JWT_SECRET: jwtSecret,
    ALLOWED_ORIGIN: allowedOrigin,
  };

  let functionArn;
  console.log(`→ Lambda "${opts.functionName}"…`);
  try {
    await lambda.send(
      new GetFunctionCommand({ FunctionName: opts.functionName })
    );
    await lambda.send(
      new UpdateFunctionCodeCommand({
        FunctionName: opts.functionName,
        ZipFile: zipBuffer,
      })
    );
    await waitUntilLambdaIdle(lambda, opts.functionName);
    await lambda.send(
      new UpdateFunctionConfigurationCommand({
        FunctionName: opts.functionName,
        Runtime: "nodejs20.x",
        Handler: "index.handler",
        Role: roleArn,
        Timeout: 29,
        MemorySize: 256,
        Environment: { Variables: envVars },
      })
    );
    await waitUntilLambdaIdle(lambda, opts.functionName);
    const gf = await lambda.send(
      new GetFunctionCommand({ FunctionName: opts.functionName })
    );
    functionArn = gf.Configuration.FunctionArn;
    console.log("  Updated code + configuration.");
  } catch (e) {
    if (e.name === "ResourceNotFoundException") {
      const cf = await lambda.send(
        new CreateFunctionCommand({
          FunctionName: opts.functionName,
          Runtime: "nodejs20.x",
          Role: roleArn,
          Handler: "index.handler",
          Code: { ZipFile: zipBuffer },
          Timeout: 29,
          MemorySize: 256,
          Environment: { Variables: envVars },
          Description: "Hotel Poinisuk events API (karaoke admin + public list)",
        })
      );
      functionArn = cf.FunctionArn;
      console.log("  Created (new).");
      await waitUntilLambdaIdle(lambda, opts.functionName);
    } else throw e;
  }

  // ----- API Gateway HTTP API -----
  let apiId = state.apiId;
  let integrationId = state.integrationId;

  const corsOrigins = [...new Set(opts.siteOrigins)];

  if (!apiId) {
    console.log(`→ API Gateway HTTP API "${opts.apiName}"…`);
    let existingId = null;
    let nextToken;
    do {
      const list = await apigw.send(
        new GetApisCommand({ MaxResults: 100, NextToken: nextToken })
      );
      const hit = list.Items?.find((x) => x.Name === opts.apiName);
      if (hit?.ApiId) existingId = hit.ApiId;
      nextToken = list.NextToken;
    } while (nextToken && !existingId);

    if (existingId) {
      apiId = existingId;
      console.log("  Found existing API by name, reusing.");
    } else {
      const api = await apigw.send(
        new CreateApiCommand({
          Name: opts.apiName,
          ProtocolType: "HTTP",
          CorsConfiguration: {
            AllowCredentials: false,
            AllowHeaders: ["Content-Type", "Authorization"],
            AllowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            AllowOrigins: corsOrigins,
            MaxAge: 300,
          },
        })
      );
      apiId = api.ApiId;
      console.log("  Created (new).");
    }
    state.apiId = apiId;
    saveState(state);
  } else {
    console.log(`→ API Gateway (existing id ${apiId})…`);
  }

  if (!integrationId) {
    const integ = await apigw.send(
      new CreateIntegrationCommand({
        ApiId: apiId,
        IntegrationType: "AWS_PROXY",
        IntegrationUri: functionArn,
        PayloadFormatVersion: "2.0",
        IntegrationMethod: "POST",
      })
    );
    integrationId = integ.IntegrationId;
    state.integrationId = integrationId;
    saveState(state);
    console.log("  Created Lambda integration.");
  } else {
    console.log("  Reusing integration from state file.");
  }

  const routeKeys = [
    "GET /events",
    "POST /admin/login",
    "POST /admin/events",
    "PUT /admin/events/{id}",
    "DELETE /admin/events/{id}",
    "POST /admin/upload-url",
  ];

  const routes = await apigw.send(new GetRoutesCommand({ ApiId: apiId }));
  const have = new Set((routes.Items || []).map((r) => r.RouteKey));

  for (const routeKey of routeKeys) {
    if (have.has(routeKey)) continue;
    await apigw.send(
      new CreateRouteCommand({
        ApiId: apiId,
        RouteKey: routeKey,
        Target: `integrations/${integrationId}`,
      })
    );
    console.log(`  Route ${routeKey}`);
  }

  // Stage $default with auto-deploy
  try {
    await apigw.send(
      new CreateStageCommand({
        ApiId: apiId,
        StageName: "$default",
        AutoDeploy: true,
      })
    );
    console.log("  Stage $default created.");
  } catch (e) {
    if (e.name === "ConflictException") {
      console.log("  Stage $default already exists.");
    } else throw e;
  }

  const invokeArnPrefix = `arn:aws:execute-api:${region}:${accountId}:${apiId}`;

  console.log("→ Lambda invoke permission for API Gateway…");
  try {
    await lambda.send(
      new AddPermissionCommand({
        FunctionName: opts.functionName,
        StatementId: "apigateway-events-invoke",
        Action: "lambda:InvokeFunction",
        Principal: "apigateway.amazonaws.com",
        SourceArn: `${invokeArnPrefix}/*/*`,
      })
    );
    console.log("  Permission added.");
  } catch (e) {
    if (e instanceof ResourceConflictException) {
      console.log("  Permission already present.");
    } else throw e;
  }

  const apiEndpoint = `https://${apiId}.execute-api.${region}.amazonaws.com`;

  saveState({
    ...state,
    jwtSecret,
    apiId,
    integrationId,
    region,
    table: opts.table,
    bucket: opts.bucket,
    functionName: opts.functionName,
    apiEndpoint,
    updatedAt: new Date().toISOString(),
  });

  console.log("\n══════════════════════════════════════════════════════════");
  console.log("Done. Add this to your Next.js `.env.local` (and prod env):\n");
  console.log(`  NEXT_PUBLIC_EVENTS_API_BASE=${apiEndpoint}`);
  console.log("\nPublic image base (Lambda env, already set):");
  console.log(`  ${imagesPublicBase}`);
  console.log("\nTest:");
  console.log(`  curl -s "${apiEndpoint}/events"`);
  console.log("══════════════════════════════════════════════════════════\n");

  if (jwtAutoGenerated) {
    console.log(
      "Note: JWT_SECRET was generated and saved in `.events-stack-state.json`.\n" +
        "      Re-deploys reuse it so existing admin sessions keep working.\n"
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
