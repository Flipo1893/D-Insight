import { ImageResponse } from "next/og";
import { site } from "./lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name}: ${site.tagline}`;

/**
 * Link preview card. Without this, anything shared in WhatsApp, LinkedIn or
 * Slack falls back to a bare text link. Drawn with the page's own tokens so
 * the card matches the site; no webfont is loaded because ImageResponse
 * would have to fetch it, and a failed fetch breaks the whole image.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#211f1f",
          padding: "72px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Brand glow, mirroring the hero */}
        <div
          style={{
            position: "absolute",
            top: -180,
            left: -140,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(236,47,18,0.45) 0%, rgba(236,47,18,0.12) 45%, rgba(33,31,31,0) 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 4, background: "#ec2f12" }} />
          <div style={{ color: "#f5f2f2", fontSize: 30, fontWeight: 600 }}>
            {site.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#f5f2f2",
              fontSize: 82,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            Ihre Website.
          </div>
          <div
            style={{
              color: "#b3adad",
              fontSize: 82,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            Neu gedacht.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ color: "#b3adad", fontSize: 26 }}>
            Redesign, Refactoring und KI-SEO
          </div>
          <div style={{ color: "#ff7a5e", fontSize: 26 }}>d-insight.ch</div>
        </div>
      </div>
    ),
    size,
  );
}
