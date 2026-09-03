import Skeleton from "../components/Skeleton";

export default function DashboardOverviewLoading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-5 w-full max-w-xl" />

      <div className="grid gap-6 sm:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-brand border border-border bg-surface p-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-3 h-6 w-48" />
            <Skeleton className="mt-3 h-4 w-56" />
          </div>
        ))}
      </div>
    </div>
  );
}
