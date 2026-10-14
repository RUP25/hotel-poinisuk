# Hotel Poinisuk — Events API (AWS)

Backend that powers `/karaoke` (public events list) and `/admin/*` (event
management) on **hotelpoinisuk.com**. Mirrors the architecture you already
use for the contact form (API Gateway → Lambda) so there's nothing
fundamentally new to learn.

---

## One-command deploy (recommended)

From the **repository root** (Node.js 18+, AWS credentials configured):

```bash
npm run deploy:events-aws -- --bucket YOUR-GLOBALLY-UNIQUE-BUCKET-NAME --admin-password "YourStrongPassword"
```

Or from `aws/deploy-events-stack/`:

```bash
npm install
node deploy.cjs --bucket YOUR-GLOBALLY-UNIQUE-BUCKET-NAME --admin-password "YourStrongPassword"
```

The script creates or updates: **DynamoDB table**, **S3 bucket** (public read for
images), **IAM role**, **Lambda** (`events-api` zip), and **API Gateway HTTP
API** with all routes. It prints `NEXT_PUBLIC_EVENTS_API_BASE` for your
`.env.local`.

Details: [`deploy-events-stack/README.md`](deploy-events-stack/README.md) and
`deploy-events-stack/deploy.cjs` (options / flags).

---

## Manual deploy (Console / CLI)

```
┌────────────────────────────────────────────────────────────────────┐
│  hotelpoinisuk.com (S3 + CloudFront, static export)                │
│                                                                    │
│  /karaoke         ─────► GET  /events                              │
│  /admin/login     ─────► POST /admin/login                         │
│  /admin           ─────► (JWT) admin/events CRUD + upload-url      │
└──────────────────────────────┬─────────────────────────────────────┘
                               │ HTTPS (ap-south-1)
                               ▼
                        API Gateway (HTTP API)
                               │
                               ▼
                       Lambda (Node.js 20.x)
                          │            │
                ┌─────────┘            └─────────┐
                ▼                                ▼
         DynamoDB:                         S3:
         hotel-poinisuk-events             hotel-poinisuk-event-images
```

---

## What you need before starting

- An AWS account with admin access (the same one you use for the contact form).
- AWS CLI installed and configured locally **OR** access to the AWS Console in a browser.
- Node.js 18+ on your machine (to bundle the Lambda code and to hash the admin password).

If you don't have the AWS CLI, every step below can be done in the
console. The CLI is just faster.

---

## 1. Create the DynamoDB table

A single table with a string partition key. Pay-per-request billing keeps
it free for the volumes a hotel events page generates.

```bash
aws dynamodb create-table \
  --region ap-south-1 \
  --table-name hotel-poinisuk-events \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

**Console alternative:** DynamoDB → Create table → name `hotel-poinisuk-events`,
partition key `id` (String), capacity mode "On-demand".

---

## 2. Create the S3 image bucket

Public-read so `<img src="…">` works directly. We'll restrict object
uploads to authenticated Lambdas only (the bucket policy below allows
anonymous **GET** but no anonymous **PUT**).

```bash
# Pick a globally-unique name, e.g. hotel-poinisuk-event-images
aws s3api create-bucket \
  --bucket hotel-poinisuk-event-images \
  --region ap-south-1 \
  --create-bucket-configuration LocationConstraint=ap-south-1

# Allow public reads
aws s3api put-public-access-block \
  --bucket hotel-poinisuk-event-images \
  --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Bucket policy: anyone can GET, no one can PUT directly.
cat > bucket-policy.json <<'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::hotel-poinisuk-event-images/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket hotel-poinisuk-event-images \
  --policy file://bucket-policy.json

# CORS so images load on hotelpoinisuk.com
cat > cors.json <<'EOF'
{
  "CORSRules": [{
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedOrigins": ["https://www.hotelpoinisuk.com", "https://hotelpoinisuk.com", "http://localhost:3000"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }]
}
EOF

aws s3api put-bucket-cors \
  --bucket hotel-poinisuk-event-images \
  --cors-configuration file://cors.json
```

The "public base URL" of the bucket will be:

```
https://hotel-poinisuk-event-images.s3.ap-south-1.amazonaws.com
```

If you later put CloudFront in front (recommended for production), use the
CloudFront domain instead.

---

## 3. Hash the admin password

You'll set the **bcrypt hash** in a Lambda env var so the plain password
is never stored on AWS.

```bash
cd aws/events-api
npm install
node hash-password.js "MyStrongPasswordHere!"
```

Copy the printed hash — you'll paste it into `ADMIN_PASSWORD_HASH` below.

Pick a strong password. There is no "forgot password" flow — to change
it later you just re-run this script and update the Lambda env var.

---

## 4. Create the Lambda function

### Build the deployment zip

```bash
cd aws/events-api
npm install --omit=dev
zip -r function.zip index.js node_modules package.json
```

### Create the function

```bash
# Generate a 64-character random JWT secret
JWT_SECRET=$(openssl rand -hex 32)

# Adjust the role ARN to one with the IAM policy below attached.
aws lambda create-function \
  --region ap-south-1 \
  --function-name hotel-poinisuk-events-api \
  --runtime nodejs20.x \
  --handler index.handler \
  --timeout 15 \
  --memory-size 256 \
  --zip-file fileb://function.zip \
  --role arn:aws:iam::YOUR-ACCOUNT-ID:role/hotel-poinisuk-events-lambda-role \
  --environment "Variables={
    EVENTS_TABLE=hotel-poinisuk-events,
    IMAGES_BUCKET=hotel-poinisuk-event-images,
    IMAGES_PUBLIC_BASE=https://hotel-poinisuk-event-images.s3.ap-south-1.amazonaws.com,
    ADMIN_PASSWORD_HASH=$2a$12$...PASTE_HASH_HERE...,
    JWT_SECRET=$JWT_SECRET,
    ALLOWED_ORIGIN=https://www.hotelpoinisuk.com
  }"
```

### IAM policy for the Lambda execution role

Attach this inline policy to the role you used in `--role`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Scan"
      ],
      "Resource": "arn:aws:dynamodb:ap-south-1:YOUR-ACCOUNT-ID:table/hotel-poinisuk-events"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject"],
      "Resource": "arn:aws:s3:::hotel-poinisuk-event-images/*"
    }
  ]
}
```

---

## 5. Create the API Gateway HTTP API

This is the simplest API Gateway flavour and the cheapest at low volumes.

```bash
# Create the API
API_ID=$(aws apigatewayv2 create-api \
  --region ap-south-1 \
  --name hotel-poinisuk-events \
  --protocol-type HTTP \
  --cors-configuration "AllowOrigins=https://www.hotelpoinisuk.com,https://hotelpoinisuk.com,http://localhost:3000,AllowHeaders=Content-Type;Authorization,AllowMethods=GET;POST;PUT;DELETE;OPTIONS,MaxAge=300" \
  --query "ApiId" --output text)

# Create the Lambda integration
INT_ID=$(aws apigatewayv2 create-integration \
  --region ap-south-1 \
  --api-id $API_ID \
  --integration-type AWS_PROXY \
  --integration-uri arn:aws:lambda:ap-south-1:YOUR-ACCOUNT-ID:function:hotel-poinisuk-events-api \
  --payload-format-version 2.0 \
  --query "IntegrationId" --output text)

# Routes
for ROUTE in \
  "GET /events" \
  "POST /admin/login" \
  "POST /admin/events" \
  "PUT /admin/events/{id}" \
  "DELETE /admin/events/{id}" \
  "POST /admin/upload-url"
do
  aws apigatewayv2 create-route \
    --region ap-south-1 \
    --api-id $API_ID \
    --route-key "$ROUTE" \
    --target "integrations/$INT_ID"
done

# Default $default stage with auto-deploy
aws apigatewayv2 create-stage \
  --region ap-south-1 \
  --api-id $API_ID \
  --stage-name '$default' \
  --auto-deploy

# Allow API Gateway to invoke the Lambda
aws lambda add-permission \
  --region ap-south-1 \
  --function-name hotel-poinisuk-events-api \
  --statement-id apigateway-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:ap-south-1:YOUR-ACCOUNT-ID:$API_ID/*/*"

# Print the endpoint URL
aws apigatewayv2 get-api --api-id $API_ID --region ap-south-1 \
  --query "ApiEndpoint" --output text
```

The output will look like:

```
https://abc123xyz.execute-api.ap-south-1.amazonaws.com
```

That's your `EVENTS_API_BASE`.

---

## 6. Wire the frontend to the API

Add (or update) `.env.local` in the project root:

```env
NEXT_PUBLIC_EVENTS_API_BASE=https://abc123xyz.execute-api.ap-south-1.amazonaws.com
```

For production deploys (Vercel / Amplify / S3-CloudFront via CI), set the
same variable in the deploy environment.

Rebuild and deploy:

```bash
npm run build   # static export goes to /out
# upload /out to your S3+CloudFront origin (same as before)
```

---

## 7. Test it end-to-end

1. Visit `https://www.hotelpoinisuk.com/karaoke` — you should see the
   "Next show is being lined up" empty state. The dynamic events list is
   wired to the API; it just has nothing to show yet.

2. Visit `https://www.hotelpoinisuk.com/admin/login` and sign in with the
   password you hashed.

3. Click **New Event**, fill the form, upload an image, and publish.

4. Refresh `/karaoke` — the new event appears on the public page.

That's the entire workflow you'll repeat every week to keep the karaoke
page live.

---

## 8. Routine operations

- **Change the admin password.** Re-run `node hash-password.js "new-pw"`,
  paste the new hash into the Lambda env var, save. The next sign-in uses
  the new password; the old session token is still valid until it expires
  (24h) — clear `localStorage` if you want to invalidate it instantly.
- **Rotate the JWT secret.** Replace `JWT_SECRET` on the Lambda. All
  active admin sessions become invalid; sign in again to mint a new one.
- **Back up events.** DynamoDB → table → Backup → enable PITR. Costs
  cents/month for this volume.
- **CloudFront in front of S3 images.** Optional but recommended once
  traffic picks up — gives you a custom domain like `images.hotelpoinisuk.com`,
  HTTPS, and edge caching. Update `IMAGES_PUBLIC_BASE` afterwards.

---

## Cost expectation (rough)

At hotel-events volumes (≤ 50 events on the books, a few hundred views/day):

- DynamoDB: < ₹10/month (essentially free tier).
- Lambda: < ₹5/month (well under free tier).
- API Gateway: < ₹20/month.
- S3: < ₹20/month for ~1GB of event images.

Total: **under ₹100/month** for the entire dynamic-events system.
