import { ImageResponse } from "next/og";
import { loadReport } from "@/lib/site-check/store";
import { site } from "../../lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Schnellcheck-Bericht";

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/**
 * Preview card for a shared report.
 *
 * This is the whole point of sharing: the link gets pasted into a chat and
 * the person who decides sees the score and the count of open findings
 * before clicking anything. A plain link would show nothing.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stored = await loadReport(id);

  const name = stored ? host(stored.report.finalUrl) : "Schnellcheck";
  const score = stored?.report.score ?? null;
  const open = stored
    ? stored.report.items.filter((item) => item.status !== "gut").length
    : 0;

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
        <div
          style={{
            position: "absolute",
            top: -180,
            left: -140,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(236,47,18,0.42) 0%, rgba(236,47,18,0.10) 45%, rgba(33,31,31,0) 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 40, height: 4, background: "#ec2f12" }} />
          <div style={{ color: "#f5f2f2", fontSize: 28, fontWeight: 600 }}>
            {site.name} Schnellcheck
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#b3adad",
              fontSize: 34,
              marginBottom: 10,
            }}
          >
            {name}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <div
              style={{
                color: "#f5f2f2",
                fontSize: 132,
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: "-0.04em",
              }}
            >
              {score ?? "?"}
            </div>
            <div style={{ color: "#b3adad", fontSize: 44, fontWeight: 600 }}>
              / 100
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ color: score === null ? "#b3adad" : "#ff7a5e", fontSize: 28 }}>
            {score === null
              ? "Bericht nicht gefunden"
              : open > 0
                ? `${open} ${open === 1 ? "Punkt" : "Punkte"} mit Handlungsbedarf`
                : "Technisch sauber aufgestellt"}
          </div>
          <div style={{ color: "#b3adad", fontSize: 28 }}>
            {site.url.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
