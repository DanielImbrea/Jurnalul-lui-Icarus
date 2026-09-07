#!/usr/bin/env node
/**
 * Instalează Stripe CLI local în tools/stripe/ (fără Homebrew).
 * Rulează: yarn setup:stripe-cli
 */
import { createWriteStream, existsSync, mkdirSync, chmodSync } from "node:fs";
import { execSync } from "node:child_process";
import { pipeline } from "node:stream/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const toolsDir = resolve(root, "tools", "stripe");
const binaryPath = resolve(toolsDir, "stripe");
const VERSION = "1.50.10";

function platformAsset() {
  const { platform, arch } = process;
  if (platform === "darwin" && arch === "arm64") {
    return `stripe_${VERSION}_mac-os_arm64.tar.gz`;
  }
  if (platform === "darwin" && arch === "x64") {
    return `stripe_${VERSION}_mac-os_x86_64.tar.gz`;
  }
  if (platform === "linux" && arch === "x64") {
    return `stripe_${VERSION}_linux_x86_64.tar.gz`;
  }
  if (platform === "linux" && arch === "arm64") {
    return `stripe_${VERSION}_linux_arm64.tar.gz`;
  }
  throw new Error(`Platformă nesuportată: ${platform} ${arch}`);
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Download eșuat (${res.status}): ${url}`);
  }
  await pipeline(res.body, createWriteStream(dest));
}

if (existsSync(binaryPath)) {
  const version = execSync(`"${binaryPath}" version`, { encoding: "utf8" }).trim();
  console.log(`✅ Stripe CLI deja instalat: ${version}`);
  console.log(`   ${binaryPath}`);
  process.exit(0);
}

mkdirSync(toolsDir, { recursive: true });
const asset = platformAsset();
const url = `https://github.com/stripe/stripe-cli/releases/download/v${VERSION}/${asset}`;
const archivePath = resolve(toolsDir, asset);

console.log(`→ Descarc Stripe CLI v${VERSION} (${asset})...`);
await download(url, archivePath);

console.log("→ Extrag binarul...");
execSync(`tar -xzf "${archivePath}" -C "${toolsDir}"`, { stdio: "inherit" });
chmodSync(binaryPath, 0o755);

console.log(`✅ Stripe CLI instalat: ${binaryPath}`);
console.log(`
Următorii pași:
  yarn stripe:login     # o singură dată — deschide browserul
  yarn stripe:listen    # într-un terminal separat, lângă yarn dev
`);
