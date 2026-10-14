/**
 * One-time helper: generate a bcrypt hash for the admin password.
 *
 * Run locally (NEVER on the server):
 *   cd aws/events-api
 *   npm install
 *   node hash-password.js "your-strong-password-here"
 *
 * Copy the printed hash into the Lambda env var ADMIN_PASSWORD_HASH.
 * The plain password should never be committed or stored anywhere on AWS.
 */

const bcrypt = require("bcryptjs");

const password = process.argv[2];
if (!password) {
  console.error("Usage: node hash-password.js <password>");
  process.exit(1);
}

const SALT_ROUNDS = 12;
const hash = bcrypt.hashSync(password, SALT_ROUNDS);
console.log("\nADMIN_PASSWORD_HASH:");
console.log(hash);
console.log(
  "\nSet this exact value as the Lambda env var `ADMIN_PASSWORD_HASH`. Do not store the plain password.\n"
);
