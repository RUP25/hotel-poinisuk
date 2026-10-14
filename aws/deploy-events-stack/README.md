# Deploy Hotel Poinisuk events stack to AWS (one command)

From this folder:

```bash
npm install
node deploy.cjs --bucket YOUR-GLOBALLY-UNIQUE-BUCKET --admin-password "YourStrongPassword"
```

Requires AWS credentials (e.g. `AWS_PROFILE` or `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`) with permission to create DynamoDB, S3, IAM, Lambda, and API Gateway in **`ap-south-1`** by default.

See comments at the top of `deploy.cjs` for all flags.

**Outputs**

- Prints `NEXT_PUBLIC_EVENTS_API_BASE=…` — add to `.env.local` and rebuild the Next.js site.
- Writes `.events-stack-state.json` (local only, gitignored) so a second run updates Lambda code instead of creating duplicate APIs.

**Re-deploy (code / password changes)**

```bash
node deploy.cjs --bucket SAME-BUCKET --admin-password "NewOrSamePassword"
```

`--jwt-secret` is optional on re-run; the script reuses the secret stored in `.events-stack-state.json` unless you pass a new one.
