/**
 * Hotel Poinisuk — Events API (single Lambda function)
 *
 * One Lambda handles every route — keeps deployment simple and the cold
 * start cost low. The function inspects `event.routeKey` (or `event.requestContext.http.method` + `event.requestContext.http.path`) and dispatches to the right handler.
 *
 * Routes:
 *   GET    /events                  — public list of events
 *   POST   /admin/login             — exchange password for JWT
 *   POST   /admin/events            — create event
 *   PUT    /admin/events/{id}       — update event
 *   DELETE /admin/events/{id}       — delete event
 *   POST   /admin/upload-url        — presigned S3 PUT URL
 *
 * Required environment variables (set in the Lambda console):
 *   EVENTS_TABLE          DynamoDB table name (default: hotel-poinisuk-events)
 *   IMAGES_BUCKET         S3 bucket for event images
 *   IMAGES_PUBLIC_BASE    Public CDN/S3 base URL (e.g. https://images.hotelpoinisuk.com)
 *   ADMIN_PASSWORD_HASH   bcrypt hash of the admin password
 *   JWT_SECRET            Long random string used to sign JWTs
 *   ALLOWED_ORIGIN        e.g. https://www.hotelpoinisuk.com (or "*" while developing)
 *
 * IAM permissions the Lambda's execution role needs:
 *   - dynamodb:GetItem, PutItem, UpdateItem, DeleteItem, Scan on EVENTS_TABLE
 *   - s3:PutObject, s3:GetObject on IMAGES_BUCKET/*
 *
 * See ../README.md for the step-by-step deployment guide.
 */

"use strict";

const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  DynamoDBClient,
} = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
  GetCommand,
} = require("@aws-sdk/lib-dynamodb");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// -----------------------------------------------------------------------------
// Config
// -----------------------------------------------------------------------------

const TABLE = process.env.EVENTS_TABLE || "hotel-poinisuk-events";
const BUCKET = process.env.IMAGES_BUCKET;
const IMAGES_PUBLIC_BASE = (process.env.IMAGES_PUBLIC_BASE || "").replace(
  /\/$/,
  ""
);
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";
const JWT_SECRET = process.env.JWT_SECRET || "change-me-immediately";
const JWT_TTL_SECONDS = 24 * 60 * 60; // 24 hours
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

const ALLOWED_CATEGORIES = new Set([
  "karaoke",
  "live-music",
  "dj-night",
  "festival",
  "private-event",
  "other",
]);

const REGION = process.env.AWS_REGION || "ap-south-1";

// Reuse SDK clients across invocations — small but real cold-start saver.
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));
const s3 = new S3Client({ region: REGION });

// -----------------------------------------------------------------------------
// CORS + response helpers
// -----------------------------------------------------------------------------

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Credentials": "false",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

function respond(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  };
}

// -----------------------------------------------------------------------------
// Auth helpers
// -----------------------------------------------------------------------------

function signToken() {
  const expiresAt = Math.floor(Date.now() / 1000) + JWT_TTL_SECONDS;
  const token = jwt.sign(
    { role: "admin", exp: expiresAt },
    JWT_SECRET,
    { algorithm: "HS256" }
  );
  return { token, expiresAt };
}

function requireAdmin(event) {
  const auth = event.headers?.authorization || event.headers?.Authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return { ok: false, response: respond(401, { message: "Unauthorized." }) };
  }
  const token = auth.slice("Bearer ".length).trim();
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded?.role !== "admin") {
      return { ok: false, response: respond(403, { message: "Forbidden." }) };
    }
    return { ok: true };
  } catch {
    return { ok: false, response: respond(401, { message: "Session expired. Please sign in again." }) };
  }
}

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

function validateEvent(input) {
  if (!input || typeof input !== "object") return "Invalid payload.";
  const required = ["title", "date", "startTime", "description", "category"];
  for (const k of required) {
    if (!input[k] || typeof input[k] !== "string" || !input[k].trim()) {
      return `Missing required field: ${k}.`;
    }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    return "date must be in YYYY-MM-DD format.";
  }
  if (!/^\d{2}:\d{2}$/.test(input.startTime)) {
    return "startTime must be in HH:mm format.";
  }
  if (input.endTime && !/^\d{2}:\d{2}$/.test(input.endTime)) {
    return "endTime must be in HH:mm format.";
  }
  if (!ALLOWED_CATEGORIES.has(input.category)) {
    return "category must be one of: " + [...ALLOWED_CATEGORIES].join(", ");
  }
  if (input.title.length > 200) return "title too long.";
  if (input.description.length > 5000) return "description too long.";
  return null;
}

// Strip a payload down to the fields we accept — defends against extra junk.
function pickEventFields(input) {
  return {
    title: input.title.trim(),
    subtitle: input.subtitle ? String(input.subtitle).trim() : undefined,
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime || undefined,
    description: input.description.trim(),
    imageUrl: input.imageUrl ? String(input.imageUrl).trim() : undefined,
    category: input.category,
    isHighlighted: Boolean(input.isHighlighted),
    showInPastHighlights: Boolean(input.showInPastHighlights),
    cover: input.cover ? String(input.cover).trim() : undefined,
  };
}

// -----------------------------------------------------------------------------
// Route handlers
// -----------------------------------------------------------------------------

async function listEvents() {
  // Scan is fine for an admin-managed catalog of dozens — not thousands —
  // of events. Switch to a Query with a GSI (PK=type=event, SK=date) if
  // the catalog ever exceeds 1MB scan cost.
  const out = await ddb.send(new ScanCommand({ TableName: TABLE }));
  const events = (out.Items || []).sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return (a.startTime || "").localeCompare(b.startTime || "");
  });
  return respond(200, { events });
}

async function adminLogin(body) {
  const password = body?.password;
  if (!password || typeof password !== "string") {
    return respond(400, { message: "Password is required." });
  }
  if (!ADMIN_PASSWORD_HASH) {
    return respond(500, {
      message:
        "Admin password is not configured. Set ADMIN_PASSWORD_HASH on the Lambda.",
    });
  }
  let valid = false;
  try {
    valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  } catch {
    valid = false;
  }
  if (!valid) {
    return respond(401, { message: "Incorrect password." });
  }
  const { token, expiresAt } = signToken();
  return respond(200, { token, expiresAt, message: "Signed in." });
}

async function createEvent(body) {
  const err = validateEvent(body);
  if (err) return respond(400, { message: err });
  const fields = pickEventFields(body);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const item = {
    id,
    ...fields,
    createdAt: now,
    updatedAt: now,
  };
  // Strip undefined values — DynamoDB rejects them.
  Object.keys(item).forEach((k) => item[k] === undefined && delete item[k]);

  await ddb.send(new PutCommand({ TableName: TABLE, Item: item }));
  return respond(201, item);
}

async function updateEvent(id, body) {
  if (!id) return respond(400, { message: "Missing event id." });
  const err = validateEvent(body);
  if (err) return respond(400, { message: err });

  const existing = await ddb.send(
    new GetCommand({ TableName: TABLE, Key: { id } })
  );
  if (!existing.Item) {
    return respond(404, { message: "Event not found." });
  }

  const fields = pickEventFields(body);
  const now = new Date().toISOString();

  // Build a SET expression that handles optional fields cleanly.
  const setParts = [];
  const removeParts = [];
  const attrNames = {};
  const attrValues = {};

  for (const [k, v] of Object.entries(fields)) {
    attrNames[`#${k}`] = k;
    if (v === undefined || v === "") {
      removeParts.push(`#${k}`);
    } else {
      setParts.push(`#${k} = :${k}`);
      attrValues[`:${k}`] = v;
    }
  }
  setParts.push("#updatedAt = :updatedAt");
  attrNames["#updatedAt"] = "updatedAt";
  attrValues[":updatedAt"] = now;

  let updateExpr = `SET ${setParts.join(", ")}`;
  if (removeParts.length) updateExpr += ` REMOVE ${removeParts.join(", ")}`;

  const out = await ddb.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { id },
      UpdateExpression: updateExpr,
      ExpressionAttributeNames: attrNames,
      ExpressionAttributeValues: attrValues,
      ReturnValues: "ALL_NEW",
    })
  );
  return respond(200, out.Attributes);
}

async function deleteEventById(id) {
  if (!id) return respond(400, { message: "Missing event id." });
  await ddb.send(new DeleteCommand({ TableName: TABLE, Key: { id } }));
  return respond(200, { message: "Event deleted." });
}

async function getUploadUrl(body) {
  if (!BUCKET || !IMAGES_PUBLIC_BASE) {
    return respond(500, {
      message:
        "Image bucket is not configured. Set IMAGES_BUCKET and IMAGES_PUBLIC_BASE.",
    });
  }
  const filename = String(body?.filename || "");
  const contentType = String(body?.contentType || "application/octet-stream");
  const size = Number(body?.size || 0);

  if (size > 8 * 1024 * 1024) {
    return respond(400, { message: "Image too large (max 8 MB)." });
  }
  if (!/^image\//.test(contentType)) {
    return respond(400, { message: "Only image uploads are allowed." });
  }

  // Sanitise: keep extension, replace path-y parts with a uuid.
  const ext = (filename.split(".").pop() || "jpg")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 5) || "jpg";
  const key = `events/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;

  const cmd = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  });

  const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 * 5 });
  const publicUrl = `${IMAGES_PUBLIC_BASE}/${key}`;

  return respond(200, { uploadUrl, publicUrl, contentType });
}

// -----------------------------------------------------------------------------
// Dispatcher
// -----------------------------------------------------------------------------

function getMethodAndPath(event) {
  // Works for HTTP API v2 and REST API v1.
  const method =
    event.requestContext?.http?.method ||
    event.httpMethod ||
    event.method ||
    "GET";
  const path =
    event.requestContext?.http?.path ||
    event.rawPath ||
    event.path ||
    event.resource ||
    "/";
  return { method: method.toUpperCase(), path };
}

function parseBody(event) {
  if (!event.body) return {};
  try {
    return typeof event.body === "string"
      ? JSON.parse(event.body)
      : event.body;
  } catch {
    return null;
  }
}

exports.handler = async (event) => {
  const { method, path } = getMethodAndPath(event);

  // Preflight
  if (method === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  try {
    // Public route
    if (method === "GET" && path === "/events") {
      return await listEvents();
    }

    // Admin login
    if (method === "POST" && path === "/admin/login") {
      const body = parseBody(event);
      if (body === null) return respond(400, { message: "Invalid JSON." });
      return await adminLogin(body);
    }

    // Everything else under /admin requires a JWT.
    if (path.startsWith("/admin/")) {
      const auth = requireAdmin(event);
      if (!auth.ok) return auth.response;

      const body = parseBody(event);
      if (body === null) return respond(400, { message: "Invalid JSON." });

      if (method === "POST" && path === "/admin/upload-url") {
        return await getUploadUrl(body);
      }
      if (method === "POST" && path === "/admin/events") {
        return await createEvent(body);
      }

      // /admin/events/{id}
      const editMatch = path.match(/^\/admin\/events\/([^/]+)$/);
      if (editMatch) {
        const id = decodeURIComponent(editMatch[1]);
        if (method === "PUT") return await updateEvent(id, body);
        if (method === "DELETE") return await deleteEventById(id);
      }
    }

    return respond(404, { message: "Not found." });
  } catch (err) {
    console.error("Unhandled error:", err);
    return respond(500, { message: "Internal server error." });
  }
};
