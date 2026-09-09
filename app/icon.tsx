import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { FAVICON_SRC } from "@/lib/brand";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const buffer = await readFile(
    join(process.cwd(), "public", FAVICON_SRC.replace(/^\//, ""))
  );
  const src = `data:image/png;base64,${buffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={32} height={32} />
      </div>
    ),
    { ...size }
  );
}
