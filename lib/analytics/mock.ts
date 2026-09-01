import type { DailyVisitors, TrafficSummary } from "./types";

/*
 * Deterministic placeholder data. No analytics provider is connected yet,
 * because that depends on where the customer site ends up being hosted. The
 * TrafficSummary shape is what a real provider adapter would return, so
 * swapping this module for a real fetch will not touch the UI.
 */
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
      date: date.toLocaleDateString("de-CH", {
        day: "2-digit",
        month: "2-digit",
      }),
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
    { path: "/#leistungen", views: Math.round(visitors30d * 0.21) },
    { path: "/#beispiele", views: Math.round(visitors30d * 0.14) },
    { path: "/#prozess", views: Math.round(visitors30d * 0.11) },
    { path: "/#kontakt", views: Math.round(visitors30d * 0.08) },
  ],
};

/** Swap for a real provider call once one is chosen. */
export async function getTrafficSummary(): Promise<TrafficSummary> {
  return mockTrafficSummary;
}
