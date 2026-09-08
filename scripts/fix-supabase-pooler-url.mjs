#!/usr/bin/env node
/**
 * Convertește DATABASE_URL/DIRECT_URL la format Supavisor (compatibil Vercel).
 * Rulează: node scripts/fix-supabase-pooler-url.mjs
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const envPath = resolve(root, ".env");
const PROJECT_REF = "bxjivmxxwrirwynokctc";
const REGIONS = [
  "eu-central-1",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "eu-north-1",
  "us-east-1",
  "us-west-1",
  "us-west-2",
  "us-east-2",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-northeast-1",
  "ap-northeast-2",
  "ap-south-1",
  "sa-east-1",
  "ca-central-1"
];
const PREFIXES = ["aws-1-", "aws-0-", "aws-"];

function poolerHosts(region) {
  return PREFIXES.map((prefix) => `${prefix}${region}.pooler.supabase.com`);
}

function buildPoolerUrls(host, passwordEncoded, port) {
  const user = `postgres.${PROJECT_REF}`;
  const base = `postgresql://${user}:${passwordEncoded}@${host}:${port}/postgres`;
  const params =
    port === 6543
      ? "?pgbouncer=true&connection_limit=1&connect_timeout=30"
      : "?connect_timeout=30";

  return {
    DATABASE_URL: `${base}${params}`,
    DIRECT_URL: `postgresql://${user}:${passwordEncoded}@${host}:5432/postgres?connect_timeout=30`
  };
}

function loadEnvFile() {
  if (!existsSync(envPath)) {
    console.error("❌ Lipsește .env");
    process.exit(1);
  }
  return readFileSync(envPath, "utf8");
}

function alreadyPooler(content) {
  return content.includes("pooler.supabase.com");
}

function upsertEnvLines(content, updates) {
  let next = content;
  for (const [key, value] of Object.entries(updates)) {
    const line = `${key}="${value}"`;
    const pattern = new RegExp(`^${key}=.*$`, "m");
    if (pattern.test(next)) {
      next = next.replace(pattern, line);
    } else {
      next += `\n${line}\n`;
    }
  }
  return next;
}

async function testConnection(databaseUrl) {
  const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } }
  });

  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

const envContent = loadEnvFile();

if (alreadyPooler(envContent)) {
  console.log("✅ .env folosește deja pooler.supabase.com — nimic de schimbat.");
  process.exit(0);
}

const databaseMatch = envContent.match(
  /^DATABASE_URL="postgresql:\/\/postgres(?:\.[^:]*)?:([^@]+)@/m
);
if (!databaseMatch) {
  console.error("❌ DATABASE_URL lipsește din .env");
  process.exit(1);
}

const passwordEncoded = databaseMatch[1];

console.log("→ Testez Supavisor (transaction 6543, apoi session 5432)...\n");

let chosen = null;

for (const region of REGIONS) {
  for (const host of poolerHosts(region)) {
    for (const port of [6543, 5432]) {
      const urls = buildPoolerUrls(host, passwordEncoded, port);
      process.stdout.write(`  ${host}:${port}... `);

      if (await testConnection(urls.DATABASE_URL)) {
        console.log("OK");
        chosen = { host, port, ...urls };
        break;
      }

      console.log("—");
    }
    if (chosen) break;
  }
  if (chosen) break;
}

if (!chosen) {
  console.error(`
❌ Nu am găsit un pooler Supavisor funcțional.

În Supabase Dashboard → Connect → copiază **Transaction pooler** în .env:
  DATABASE_URL=...
  DIRECT_URL=... (Session pooler)

Apoi:
  yarn setup:vercel-env
`);
  process.exit(1);
}

const updated = upsertEnvLines(envContent, {
  DATABASE_URL: chosen.DATABASE_URL,
  DIRECT_URL: chosen.DIRECT_URL
});

writeFileSync(envPath, updated, "utf8");

console.log(`
✅ Actualizat .env cu Supavisor (${chosen.host}:${chosen.port})

Următorul pas:
  yarn setup:vercel-env
`);
