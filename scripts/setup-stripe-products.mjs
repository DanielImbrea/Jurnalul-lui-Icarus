#!/usr/bin/env node
/**
 * Creează produsele și prețurile în Stripe (mod test sau live, după cheie).
 * Scrie Price ID-urile în .env.
 *
 * Rulează: STRIPE_SECRET_KEY=sk_test_... node scripts/setup-stripe-products.mjs
 */
import Stripe from "stripe";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const envPath = resolve(root, ".env");

function loadEnv() {
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

function upsertEnvVar(content, key, value) {
  const line = `${key}=${value}`;
  const regex = new RegExp(`^${key}=.*$`, "m");
  if (regex.test(content)) {
    return content.replace(regex, line);
  }
  return content.trimEnd() + `\n${line}\n`;
}

function isPlaceholderPriceId(value) {
  if (!value) return true;
  const v = value.toLowerCase();
  return (
    v.includes("replace") ||
    v.includes("inlocuieste") ||
    v.includes("xxx") ||
    v === "price_"
  );
}

loadEnv();

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  console.error(`
❌ STRIPE_SECRET_KEY lipsește.

1. Mergi la https://dashboard.stripe.com/test/apikeys
2. Copiază Secret key (sk_test_...)
3. Adaugă în .env sau rulează:
   STRIPE_SECRET_KEY=sk_test_... node scripts/setup-stripe-products.mjs
`);
  process.exit(1);
}

const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });

const catalog = [
  {
    envKey: "STRIPE_PRICE_BLAKE",
    name: "Sub umbrele lui Blake",
    description: "Roman — Daniel Imbrea. Livrare separată (+19 RON la checkout).",
    amountRon: 59,
    metadata: { productId: "blake", site: "danielimbrea.ro" }
  },
  {
    envKey: "STRIPE_PRICE_DURERE",
    name: "Îmbrățișarea durerii și avantajele ei",
    description: "Carte — Daniel Imbrea. Livrare separată (+19 RON la checkout).",
    amountRon: 59,
    metadata: { productId: "durere", site: "danielimbrea.ro" }
  },
  {
    envKey: "STRIPE_PRICE_BUNDLE",
    name: "Pachet complet — ambele cărți",
    description: "Sub umbrele lui Blake + Îmbrățișarea durerii. Livrare separată (+19 RON).",
    amountRon: 98,
    metadata: { productId: "bundle", site: "danielimbrea.ro" }
  }
];

console.log(`→ Creez produse în Stripe (${secretKey.startsWith("sk_test") ? "TEST" : "LIVE"})...\n`);

const results = {};

for (const item of catalog) {
  const existing = process.env[item.envKey];
  if (existing && !isPlaceholderPriceId(existing)) {
    console.log(`⏭  ${item.name}: ${item.envKey} deja setat (${existing})`);
    results[item.envKey] = existing;
    continue;
  }

  const product = await stripe.products.create({
    name: item.name,
    description: item.description,
    metadata: item.metadata
  });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: item.amountRon * 100,
    currency: "ron"
  });

  results[item.envKey] = price.id;
  console.log(`✅ ${item.name}: ${price.id} (${item.amountRon} RON)`);
}

// Publishable key hint
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  console.log(`
⚠️  Adaugă și NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY în .env
   (Dashboard → Developers → API keys → Publishable key)
`);
}

// Write to .env
if (existsSync(envPath)) {
  let envContent = readFileSync(envPath, "utf8");
  for (const [key, value] of Object.entries(results)) {
    envContent = upsertEnvVar(envContent, key, value);
  }
  if (!process.env.STRIPE_SECRET_KEY && secretKey) {
    envContent = upsertEnvVar(envContent, "STRIPE_SECRET_KEY", secretKey);
  }
  writeFileSync(envPath, envContent);
  console.log("\n✅ Price ID-urile au fost scrise în .env");
} else {
  console.log("\nAdaugă manual în .env:");
  for (const [key, value] of Object.entries(results)) {
    console.log(`${key}=${value}`);
  }
}

console.log(`
Următorii pași Stripe:
1. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... în .env
2. Webhook: https://domeniul-tau/api/webhook → checkout.session.completed
3. Local: stripe listen --forward-to localhost:3020/api/webhook
4. Copiază whsec_... în STRIPE_WEBHOOK_SECRET
`);
