import Skeleton from "../../components/Skeleton";

export default function MonitoringLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-3 h-5 w-full max-w-xl" />
      </div>

      {/* One card per customer site. This page fans out over every site, so
          it is the slowest in the dashboard and benefits most from this. */}
      <div className="grid gap-5 md:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-brand border border-border bg-surface p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-7 w-16" />
            </div>
            <Skeleton className="mt-3 h-4 w-56" />
            <Skeleton className="mt-4 h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
