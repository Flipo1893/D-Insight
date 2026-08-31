export type DailyVisitors = { date: string; visitors: number };
export type TopPage = { path: string; views: number };

export type TrafficSummary = {
  visitors30d: number;
  pageviews30d: number;
  avgSessionSeconds: number;
  daily: DailyVisitors[];
  topPages: TopPage[];
};
