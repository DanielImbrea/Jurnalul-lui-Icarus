#!/usr/bin/env node
/**
 * Aplică schema Prisma pe Supabase Postgres.
 * Necesită DATABASE_URL (pooler :6543) și DIRECT_URL (direct :5432) în .env.
 *
 * Rulează: node scripts/setup-supabase-db.mjs
 */
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  const envPath = resolve(root, ".env");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const { DATABASE_URL, DIRECT_URL } = process.env;

if (!DATABASE_URL?.startsWith("postgresql")) {
  console.error(`
❌ DATABASE_URL lipsește sau nu e PostgreSQL.

Adaugă în .env (Supabase → Settings → Database → Connection string):

DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

Înlocuiește [PROJECT-REF] cu bxjivmxxwrirwynokctc și [PASSWORD] cu parola bazei de date.
`);
  process.exit(1);
}

if (!DIRECT_URL?.startsWith("postgresql")) {
  console.error("❌ DIRECT_URL lipsește — necesar pentru migrări Prisma pe Supabase.");
  process.exit(1);
}

console.log("→ Aplic schema Prisma pe Supabase Postgres...\n");

try {
  execSync("npx prisma migrate deploy", {
    cwd: root,
    stdio: "inherit",
    env: process.env
  });
  execSync("npx prisma generate", {
    cwd: root,
    stdio: "inherit",
    env: process.env
  });
  console.log("\n✅ Schema aplicată cu succes pe Supabase.");
} catch {
  process.exit(1);
}
