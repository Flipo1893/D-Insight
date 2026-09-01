import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Browser tab icon. Replaces the default Next triangle that shipped with
 * create-next-app. At 16px nothing survives but a single shape, so this is
 * one letter on the brand red at full contrast rather than the wordmark.
 */
export default function Icon() {
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
          borderRadius: 7,
          color: "#ffffff",
          fontSize: 23,
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
