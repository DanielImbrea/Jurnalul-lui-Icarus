import { ImageResponse } from "next/og";
import { getPublicImageDataUrl } from "@/lib/brand-assets";

export const alt = "Jurnalul lui Icarus — Daniel Imbrea";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

const dust = [
  { x: 80, y: 90, s: 3, o: 0.45 },
  { x: 220, y: 140, s: 2, o: 0.3 },
  { x: 340, y: 55, s: 2, o: 0.35 },
  { x: 520, y: 110, s: 3, o: 0.25 },
  { x: 680, y: 80, s: 2, o: 0.4 },
  { x: 890, y: 130, s: 3, o: 0.35 },
  { x: 1050, y: 70, s: 2, o: 0.3 },
  { x: 150, y: 480, s: 2, o: 0.28 },
  { x: 420, y: 520, s: 3, o: 0.22 },
  { x: 760, y: 540, s: 2, o: 0.32 },
  { x: 980, y: 490, s: 3, o: 0.38 },
  { x: 1120, y: 420, s: 2, o: 0.25 },
  { x: 600, y: 580, s: 2, o: 0.2 },
  { x: 860, y: 560, s: 2, o: 0.28 }
];

export default async function OpenGraphImage() {
  const [blakeCover, durereCover, logoSrc] = await Promise.all([
    getPublicImageDataUrl("/og/blake-cover.png"),
    getPublicImageDataUrl("/og/durere-cover.png"),
    getPublicImageDataUrl("/jurnalulluiicarus-logo.png")
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(165deg, #3a0f1a 0%, #1a060c 35%, #0a0205 65%, #000000 100%)"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 60% at 18% 20%, rgba(90,30,42,0.55) 0%, transparent 55%), radial-gradient(ellipse 70% 80% at 82% 45%, rgba(169,135,93,0.22) 0%, transparent 50%), radial-gradient(ellipse 100% 100% at 50% 100%, rgba(0,0,0,0.85) 0%, transparent 60%)"
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background:
              "linear-gradient(180deg, transparent 0%, rgba(169,135,93,0.7) 30%, rgba(169,135,93,0.35) 70%, transparent 100%)"
          }}
        />

        {dust.map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: d.x,
              top: d.y,
              width: d.s,
              height: d.s,
              borderRadius: "50%",
              background: `rgba(212,180,120,${d.o})`
            }}
          />
        ))}

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            width: "100%",
            height: "100%",
            padding: "48px 64px 56px 72px",
            alignItems: "flex-start",
            justifyContent: "space-between"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 28,
              maxWidth: 560
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt=""
              width={96}
              height={96}
              style={{ borderRadius: "50%" }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color: "#CDB56E",
                  marginBottom: 14
                }}
              >
                Univers literar
              </div>

              <div
                style={{
                  fontSize: 68,
                  lineHeight: 0.98,
                  color: "#EFEAE1",
                  letterSpacing: "-0.025em",
                  marginBottom: 24
                }}
              >
                Jurnalul lui Icarus
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 24
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 2,
                    background: "#CDB56E"
                  }}
                />
                <div
                  style={{
                    width: 120,
                    height: 1,
                    background:
                      "linear-gradient(90deg, rgba(169,135,93,0.6), transparent)"
                  }}
                />
              </div>

              <div
                style={{
                  fontSize: 32,
                  lineHeight: 1.22,
                  color: "#E8E2D8",
                  fontStyle: "italic"
                }}
              >
                Unele povești nu se citesc. Se simt.
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 520,
              height: "100%",
              justifyContent: "flex-start",
              paddingTop: 24,
              position: "relative"
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 480,
                height: 480,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(169,135,93,0.18) 0%, rgba(90,30,42,0.1) 35%, transparent 68%)"
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                width: 500,
                height: 400
              }}
            >
              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  left: 20,
                  top: 30,
                  border: "2px solid rgba(169,135,93,0.35)",
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow:
                    "0 40px 90px rgba(0,0,0,0.75), 0 0 60px rgba(169,135,93,0.12)"
                }}
              >
                <img src={blakeCover} width={230} height={345} alt="" />
              </div>

              <div
                style={{
                  display: "flex",
                  position: "absolute",
                  right: 10,
                  top: 0,
                  border: "2px solid rgba(169,135,93,0.45)",
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow:
                    "0 48px 100px rgba(0,0,0,0.8), 0 0 80px rgba(169,135,93,0.18)"
                }}
              >
                <img src={durereCover} width={230} height={345} alt="" />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 20,
                gap: 16,
                fontSize: 15,
                color: "#C4BCB0",
                letterSpacing: "0.06em"
              }}
            >
              <span>Sub Umbrele lui Blake</span>
              <span style={{ color: "#CDB56E" }}>·</span>
              <span>Îmbrățișarea Durerii</span>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.45) 100%)",
            pointerEvents: "none"
          }}
        />
      </div>
    ),
    { ...size }
  );
}
