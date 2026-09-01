import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "HBM — Sites profissionais que geram resultado para sua empresa";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 64,
          background: "#000000",
          backgroundImage:
            "radial-gradient(ellipse 900px 600px at 20% 30%, rgba(51,74,130,0.35), transparent 60%)",
        }}
      >
        <svg width="180" height="150" viewBox="0 0 960 800">
          <polygon points="515,90 420,280 420,790 515,790" fill="#0D1642" />
          <path
            d="M 150,790 L 150,500 C 150,430 158,395 100,345 C 150,378 183,420 183,470 L 183,790 Z"
            fill="#0D1642"
          />
          <rect x="150" y="480" width="270" height="50" fill="#0D1642" />
          <path d="M 515,90 L 592,285 L 592,790 L 515,790 Z" fill="#2E58E0" />
          <path
            d="M 585,300 C 640,300 655,325 655,348 C 655,371 640,388 592,390 L 592,300 Z"
            fill="#2E58E0"
          />
          <path
            d="M 585,404 C 640,404 660,422 660,450 C 660,478 640,500 592,502 L 592,404 Z"
            fill="#2E58E0"
          />
          <rect x="585" y="390" width="55" height="14" fill="#fff" />
          <path
            d="M 592,790 L 592,700 L 715,495 L 800,655 L 895,495 L 960,695 L 960,790 Z"
            fill="#2E58E0"
          />
        </svg>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#93a6d6", marginBottom: 12 }}>
            HBM
          </div>
          <div
            style={{
              fontSize: 54,
              fontWeight: 700,
              color: "#f5f5f7",
              lineHeight: 1.1,
              letterSpacing: -1,
            }}
          >
            Sites que trazem clientes, não só existem.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
