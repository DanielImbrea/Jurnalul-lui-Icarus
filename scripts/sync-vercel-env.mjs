#!/usr/bin/env node
/**
 * Sincronizează DATABASE_URL și DIRECT_URL din .env pe Vercel (Production).
 * Necesită: vercel login + vercel link (sau --scope team-slug).
 *
 * Rulează: node scripts/sync-vercel-env.mjs
 */
import { execSync, spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const TEAM_SCOPE = "jurnalul-lui-icarus";

function loadEnv() {
  const envPath = resolve(root, ".env");
  if (!existsSync(envPath)) {
    console.error("❌ Lipsește .env — copiază din .env.example și completează.");
    process.exit(1);
  }

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
    process.env[key] = value;
  }
}

function runVercel(args, input) {
  const result = spawnSync("npx", ["vercel", ...args], {
    cwd: root,
    input,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"]
  });

  if (result.status !== 0) {
    const err = (result.stderr || result.stdout || "").trim();
    throw new Error(err || `vercel ${args.join(" ")} failed`);
  }

  return (result.stdout || "").trim();
}

function envExists(key, target) {
  try {
    const out = execSync(`npx vercel env ls ${target} --scope ${TEAM_SCOPE}`, {
      cwd: root,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"]
    });
    return out.includes(key);
  } catch {
    return false;
  }
}

function upsertEnv(key, value, target = "production") {
  const scopeArgs = ["--scope", TEAM_SCOPE];

  if (envExists(key, target)) {
    console.log(`→ Actualizez ${key} (${target})...`);
    runVercel(["env", "rm", key, target, "--yes", ...scopeArgs]);
  } else {
    console.log(`→ Adaug ${key} (${target})...`);
  }

  runVercel(["env", "add", key, target, ...scopeArgs], value);
  console.log(`✅ ${key}`);
}

loadEnv();

const { DATABASE_URL, DIRECT_URL } = process.env;

if (!DATABASE_URL?.startsWith("postgresql")) {
  console.error("❌ DATABASE_URL lipsește sau nu e PostgreSQL în .env");
  process.exit(1);
}

if (!DIRECT_URL?.startsWith("postgresql")) {
  console.error("❌ DIRECT_URL lipsește sau nu e PostgreSQL în .env");
  process.exit(1);
}

try {
  const whoami = execSync("npx vercel whoami", {
    cwd: root,
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"]
  }).trim();
  console.log(`Vercel: ${whoami}\n`);
} catch {
  console.error(`
❌ Nu ești autentificat pe Vercel.

Rulează întâi:
  npx vercel login

Apoi:
  yarn setup:vercel-env
`);
  process.exit(1);
}

console.log("Sincronizez variabilele DB pe Vercel (Production)...\n");

try {
  upsertEnv("DATABASE_URL", DATABASE_URL);
  upsertEnv("DIRECT_URL", DIRECT_URL);
} catch (error) {
  console.error(`\n❌ ${error.message}`);
  console.error(`
Dacă proiectul nu e legat, rulează:
  npx vercel link --scope ${TEAM_SCOPE}

Apoi reîncearcă:
  yarn setup:vercel-env
`);
  process.exit(1);
}

console.log(`
Gata. Redeploy recomandat:
  npx vercel --prod --scope ${TEAM_SCOPE}
`);
