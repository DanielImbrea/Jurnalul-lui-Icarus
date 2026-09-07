#!/usr/bin/env node
/**
 * Trimite un email de test via Resend.
 * Rulează: node scripts/test-resend-email.mjs [destinatar@email.com]
 */
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

const apiKey = process.env.RESEND_API_KEY;
const from =
  process.env.ORDER_FROM_EMAIL ??
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ??
  "onboarding@resend.dev";
const to = process.argv[2] ?? process.env.NEXT_PUBLIC_CONTACT_EMAIL;

if (!apiKey) {
  console.error("❌ RESEND_API_KEY lipsește din .env");
  process.exit(1);
}

if (!to) {
  console.error("❌ Specifică destinatarul: node scripts/test-resend-email.mjs tu@email.com");
  process.exit(1);
}

console.log(`Trimit email de test de la ${from} către ${to}...`);

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    from: `Jurnalul lui Icarus <${from}>`,
    to,
    subject: "Test Resend — Jurnalul lui Icarus",
    html: `<p>Email de test trimis la ${new Date().toISOString()}.</p><p>Dacă îl vezi, Resend funcționează corect.</p>`
  })
});

const body = await res.text();

if (!res.ok) {
  console.error(`❌ Resend error ${res.status}:`, body);
  process.exit(1);
}

console.log("✅ Email trimis:", body);
