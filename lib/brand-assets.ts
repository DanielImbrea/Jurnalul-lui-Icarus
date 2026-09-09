import { readFile } from "fs/promises";
import { join } from "path";

export async function getLogoMarkDataUrl() {
  return getPublicImageDataUrl("/jurnalulluiicarus-logo.png");
}

function mimeFromBuffer(buffer: Buffer, ext?: string) {
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return "image/jpeg";
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return "image/png";
  if (buffer[0] === 0x47 && buffer[1] === 0x49) return "image/gif";
  if (buffer.slice(0, 4).toString() === "RIFF") return "image/webp";
  if (buffer.slice(0, 5).toString() === "<?xml" || buffer.slice(0, 4).toString().includes("svg"))
    return "image/svg+xml";

  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "webp") return "image/webp";
  if (ext === "svg") return "image/svg+xml";
  return "image/png";
}

export async function getPublicImageDataUrl(publicPath: string) {
  const filePath = join(process.cwd(), "public", publicPath.replace(/^\//, ""));
  const buffer = await readFile(filePath);
  const ext = publicPath.split(".").pop()?.toLowerCase();
  const mime = mimeFromBuffer(buffer, ext);

  return `data:${mime};base64,${buffer.toString("base64")}`;
}
