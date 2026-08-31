import type { TopPage } from "@/lib/analytics/types";

export default function TopPagesList({ pages }: { pages: TopPage[] }) {
  const maxViews = Math.max(...pages.map((p) => p.views));

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <h3 className="text-sm font-medium text-muted">Meistgesehene Seiten</h3>
      <div className="mt-4 flex flex-col gap-3">
        {pages.map((page) => (
          <div key={page.path} className="flex items-center gap-4">
            <span className="w-28 shrink-0 truncate font-mono text-sm text-muted">
              {page.path}
            </span>
            <div className="relative h-2 flex-1 rounded-full bg-background">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-accent"
                style={{ width: `${(page.views / maxViews) * 100}%` }}
              />
            </div>
            <span className="w-14 shrink-0 text-right text-sm">
              {page.views.toLocaleString("de-DE")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
