#!/usr/bin/env node
/**
 * Verifică Supabase Storage + (opțional) conexiunea Postgres.
 * Rulează: node scripts/check-setup.mjs
 */
import { PrismaClient } from "@prisma/client";
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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecret = process.env.SUPABASE_SECRET_KEY;
const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "uploads";

console.log("=== Verificare setup ===\n");

// Supabase Storage (REST direct — evită dependența WebSocket din SDK)
if (!supabaseUrl || !supabaseSecret) {
  console.log("❌ Supabase: lipsesc NEXT_PUBLIC_SUPABASE_URL sau SUPABASE_SECRET_KEY");
} else {
  try {
    const res = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
      headers: {
        Authorization: `Bearer ${supabaseSecret}`,
        apikey: supabaseSecret
      }
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    const buckets = await res.json();
    const uploads = buckets?.find((b) => b.id === bucket || b.name === bucket);
    if (uploads) {
      console.log(`✅ Supabase Storage: bucket "${bucket}" există (public: ${uploads.public})`);
    } else {
      console.log(`⚠️  Supabase Storage: bucket "${bucket}" lipsește — rulează scripts/supabase-storage.sql`);
    }
  } catch (err) {
    console.log(`❌ Supabase Storage: ${err.message}`);
  }
}

// Postgres
if (!process.env.DATABASE_URL?.startsWith("postgresql")) {
  console.log("❌ Database: DATABASE_URL nu e setat (postgresql://...) — vezi .env.example");
} else if (!process.env.DIRECT_URL?.startsWith("postgresql")) {
  console.log("❌ Database: DIRECT_URL lipsește — necesar pentru migrări Prisma pe Supabase");
} else {
  try {
    const prisma = new PrismaClient();
    await prisma.$queryRaw`SELECT 1`;
    const tables = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;
    console.log(`✅ Database: conectat (${tables.length} tabele în public)`);
    await prisma.$disconnect();
  } catch (err) {
    console.log(`❌ Database: ${err.message}`);
  }
}

// Stripe
const stripeKey = process.env.STRIPE_SECRET_KEY;
const priceIds = [
  process.env.STRIPE_PRICE_BLAKE,
  process.env.STRIPE_PRICE_DURERE,
  process.env.STRIPE_PRICE_BUNDLE
];

if (!stripeKey) {
  console.log("❌ Stripe: STRIPE_SECRET_KEY lipsește");
} else {
  console.log(`✅ Stripe: secret key setat (${stripeKey.startsWith("sk_test") ? "test mode" : "live mode"})`);
}

if (priceIds.every(Boolean)) {
  console.log("✅ Stripe: toate Price ID-urile sunt setate");
} else {
  console.log("⚠️  Stripe: Price ID-uri lipsă — rulează yarn setup:stripe");
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.log("⚠️  Stripe: STRIPE_WEBHOOK_SECRET lipsește (necesar pentru comenzi în DB)");
} else {
  console.log("✅ Stripe: webhook secret setat");
}

// Resend (email confirmare comenzi)
const resendKey = process.env.RESEND_API_KEY;
const fromEmail =
  process.env.ORDER_FROM_EMAIL ?? process.env.NEXT_PUBLIC_CONTACT_EMAIL;

if (!resendKey) {
  console.log("⚠️  Resend: RESEND_API_KEY lipsește — emailurile de confirmare nu se trimit");
} else {
  console.log(`✅ Resend: API key setat (${resendKey.startsWith("re_") ? "format valid" : "verifică formatul"})`);
}

if (!fromEmail) {
  console.log("⚠️  Resend: ORDER_FROM_EMAIL lipsește");
} else if (!fromEmail.includes("@")) {
  console.log(`⚠️  Resend: ORDER_FROM_EMAIL invalid: ${fromEmail}`);
} else {
  const onVerifiedDomain = fromEmail.endsWith("@jurnalulluiicarus.com");
  console.log(
    `✅ Resend: expeditor ${fromEmail}${onVerifiedDomain ? "" : " (⚠️  nu e pe domeniul verificat jurnalulluiicarus.com)"}`
  );
}

console.log("");
