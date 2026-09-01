import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Home screen icon on iOS. Apple puts its own rounded mask over this, so the
 * artwork fills the square edge to edge and keeps the letter well inside.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ec2f12",
          color: "#ffffff",
          fontSize: 118,
          fontWeight: 700,
          fontFamily: "sans-serif",
          letterSpacing: "-0.04em",
        }}
      >
        D
      </div>
    ),
    size,
  );
}
