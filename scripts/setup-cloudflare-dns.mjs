#!/usr/bin/env node
/**
 * Configurează DNS Cloudflare pentru Vercel (www + apex).
 *
 * Necesită în .env sau environment:
 *   CLOUDFLARE_API_TOKEN=...   (Cloudflare → My Profile → API Tokens)
 *   CLOUDFLARE_ZONE_ID=...     (opțional — se detectează automat după domeniu)
 *   CLOUDFLARE_DOMAIN=jurnalulluiicarus.com
 *   VERCEL_CNAME_TARGET=2e162f3564413017.vercel-dns-017.com
 *
 * Rulează: node scripts/setup-cloudflare-dns.mjs
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

const token = process.env.CLOUDFLARE_API_TOKEN;
const domain = process.env.CLOUDFLARE_DOMAIN ?? "jurnalulluiicarus.com";
const zoneIdFromEnv = process.env.CLOUDFLARE_ZONE_ID;
const vercelCname =
  process.env.VERCEL_CNAME_TARGET ?? "2e162f3564413017.vercel-dns-017.com";
const vercelApexIp = process.env.VERCEL_APEX_IP ?? "76.76.21.21";

if (!token) {
  console.error(`
❌ CLOUDFLARE_API_TOKEN lipsește.

1. Cloudflare → My Profile → API Tokens → Create Token
2. Template: "Edit zone DNS" (sau permisiuni: Zone → DNS → Edit)
3. Zone Resources: Include → Specific zone → ${domain}
4. Adaugă în .env:
   CLOUDFLARE_API_TOKEN=...
`);
  process.exit(1);
}

async function cf(path, options = {}) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers ?? {})
    }
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(
      data.errors?.map((e) => e.message).join("; ") || res.statusText
    );
  }
  return data.result;
}

async function getZoneId() {
  if (zoneIdFromEnv) return zoneIdFromEnv;
  const zones = await cf(`/zones?name=${domain}`);
  if (!zones?.length) {
    throw new Error(
      `Nu am găsit zona DNS pentru ${domain}. Verifică că domeniul e pe Cloudflare.`
    );
  }
  return zones[0].id;
}

async function listRecords(zoneId) {
  return cf(`/zones/${zoneId}/dns_records?per_page=100`);
}

async function upsertRecord(zoneId, record) {
  const existing = await listRecords(zoneId);
  const match = existing.find(
    (r) =>
      r.type === record.type &&
      r.name === record.name &&
      (record.type !== "CNAME" || r.content !== record.content)
  );

  const same = existing.find(
    (r) =>
      r.type === record.type &&
      r.name === record.name &&
      r.content === record.content &&
      r.proxied === record.proxied
  );

  if (same) {
    console.log(`⏭  ${record.type} ${record.name} — deja corect`);
    return same;
  }

  if (match) {
    const updated = await cf(`/zones/${zoneId}/dns_records/${match.id}`, {
      method: "PATCH",
      body: JSON.stringify(record)
    });
    console.log(`✏️  ${record.type} ${record.name} → ${record.content}`);
    return updated;
  }

  const created = await cf(`/zones/${zoneId}/dns_records`, {
    method: "POST",
    body: JSON.stringify(record)
  });
  console.log(`✅ ${record.type} ${record.name} → ${record.content}`);
  return created;
}

console.log(`→ Configurez DNS Cloudflare pentru ${domain}\n`);

try {
  const zoneId = await getZoneId();
  console.log(`Zonă: ${zoneId}\n`);

  // www → Vercel (proxy OFF la început, ca SSL să se verifice)
  await upsertRecord(zoneId, {
    type: "CNAME",
    name: `www.${domain}`,
    content: vercelCname,
    proxied: false,
    ttl: 1
  });

  // apex → Vercel IP
  await upsertRecord(zoneId, {
    type: "A",
    name: domain,
    content: vercelApexIp,
    proxied: false,
    ttl: 1
  });

  console.log(`
Gata. DNS-ul ar trebui să se propage în câteva minute.

Următorii pași:
1. Vercel → Domains → Refresh / Verify pentru www.${domain}
2. După ce e verificat, poți activa proxy Cloudflare (nor portocaliu) dacă vrei
3. Asigură-te că ai un deploy production pe Vercel (push pe main sau Deploy)
4. Setează variabilele de mediu în Vercel (Settings → Environment Variables)
`);
} catch (err) {
  console.error(`❌ ${err.message}`);
  process.exit(1);
}
