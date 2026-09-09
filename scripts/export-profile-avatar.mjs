#!/usr/bin/env node
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const svgPath = resolve(root, "public/brand/jurnalul-lui-icarus-profile.svg");

async function main() {
  if (!existsSync(svgPath)) {
    console.error("❌ SVG lipsește:", svgPath);
    process.exit(1);
  }

  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.error("❌ Instalează sharp: yarn add -D sharp --ignore-engines");
    process.exit(1);
  }

  const svg = readFileSync(svgPath);
  const sizes = [1024, 512];

  for (const size of sizes) {
    const suffix = size === 1024 ? "" : `-${size}`;
    const pngPath = resolve(
      root,
      `public/brand/jurnalul-lui-icarus-profile${suffix}.png`
    );

    await sharp(svg).resize(size, size).png({ compressionLevel: 9 }).toFile(pngPath);
    console.log(`✅ ${pngPath}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
