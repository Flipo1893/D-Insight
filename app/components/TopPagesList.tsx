import type { TopPage } from "@/lib/analytics/types";

export default function TopPagesList({
  pages,
  title = "Meistgesehene Seiten",
}: {
  pages: TopPage[];
  title?: string;
}) {
  const maxViews = Math.max(...pages.map((p) => p.views));

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <h3 className="text-sm font-medium text-muted">{title}</h3>
      <div className="mt-4 flex flex-col gap-3">
        {pages.map((page, index) => (
          <div key={page.path} className="flex items-center gap-4">
            <span className="w-28 shrink-0 truncate font-mono text-sm text-muted">
              {page.path}
            </span>
            <div className="relative h-2 flex-1 rounded-full bg-background">
              <div
                className="animate-grow-width absolute inset-y-0 left-0 rounded-full bg-accent"
                style={{
                  width: `${(page.views / maxViews) * 100}%`,
                  animationDelay: `${index * 70}ms`,
                }}
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
