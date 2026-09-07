import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 50% 20%, #2d0a14 0%, #080204 55%, #000000 100%)"
        }}
      >
        <svg
          width="132"
          height="132"
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M48 10c-14 6-26 20-30 36-2 8-1 17 3 24 8-6 17-10 27-12V10Z"
            fill="#5A1E2A"
          />
          <path
            d="M48 10c14 6 26 20 30 36 2 8 1 17-3 24-8-6-17-10-27-12V10Z"
            fill="#A9875D"
          />
          <path
            d="M48 10v58"
            stroke="#EFEAE1"
            strokeWidth="1.25"
            strokeLinecap="round"
            opacity="0.4"
          />
          <path
            d="M48 10 38 4M48 10 58 4"
            stroke="#EFEAE1"
            strokeWidth="1.1"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
