import type { DailyVisitors, TrafficSummary } from "./types";

// Deterministic placeholder data — no analytics provider is wired up yet
// (that decision depends on where the client ends up deploying). The shape
// here (TrafficSummary) is what a real provider adapter would return later,
// so swapping mockTrafficSummary for a real fetch won't touch the UI.
function generateDaily(): DailyVisitors[] {
  const days = 30;
  const points: DailyVisitors[] = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(Date.UTC(2026, 7, 1 + i));
    const trend = i * 1.8;
    const wave = Math.sin(i / 3) * 18;
    const isWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
    const visitors = Math.max(
      20,
      Math.round(120 + trend + wave + (isWeekend ? -15 : 0)),
    );

    points.push({
      date: date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }),
      visitors,
    });
  }

  return points;
}

const daily = generateDaily();
const visitors30d = daily.reduce((sum, d) => sum + d.visitors, 0);

export const mockTrafficSummary: TrafficSummary = {
  visitors30d,
  pageviews30d: Math.round(visitors30d * 2.3),
  avgSessionSeconds: 96,
  daily,
  topPages: [
    { path: "/", views: Math.round(visitors30d * 0.42) },
    { path: "/leistungen", views: Math.round(visitors30d * 0.21) },
    { path: "/ueber-uns", views: Math.round(visitors30d * 0.14) },
    { path: "/prozess", views: Math.round(visitors30d * 0.11) },
    { path: "/#kontakt", views: Math.round(visitors30d * 0.08) },
  ],
};

// Swap this for a real provider call once one is chosen (Vercel Analytics,
// Plausible, GA4, …) — callers only depend on the TrafficSummary shape.
export async function getTrafficSummary(): Promise<TrafficSummary> {
  return mockTrafficSummary;
}
