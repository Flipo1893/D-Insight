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
    <div className="rounded-brand border border-border bg-surface p-6">
      <h3 className="text-sm font-medium text-muted">{title}</h3>
      <ol className="mt-4 flex flex-col gap-3">
        {pages.map((page, index) => (
          <li key={page.path} className="flex items-center gap-4">
            <span className="w-32 shrink-0 truncate font-mono text-sm text-muted-strong">
              {page.path}
            </span>
            <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-background">
              <span
                className="bar-grow absolute inset-y-0 left-0 rounded-full bg-accent"
                style={{
                  width: `${(page.views / maxViews) * 100}%`,
                  animationDelay: `${index * 70}ms`,
                }}
              />
            </span>
            <span className="w-16 shrink-0 text-right text-sm tabular-nums">
              {page.views.toLocaleString("de-CH")}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
