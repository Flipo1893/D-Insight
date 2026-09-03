import Skeleton from "../../components/Skeleton";

export default function TrafficLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-3 h-5 w-full max-w-xl" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-brand border border-border bg-surface p-6">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="mt-3 h-9 w-24" />
          </div>
        ))}
      </div>

      <div className="rounded-brand border border-border bg-surface p-6">
        <div className="flex items-baseline justify-between gap-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="mt-4 h-48 w-full" />
      </div>

      <div className="rounded-brand border border-border bg-surface p-6">
        <Skeleton className="h-4 w-48" />
        <div className="mt-4 flex flex-col gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-28 shrink-0" />
              <Skeleton className="h-2 flex-1" />
              <Skeleton className="h-4 w-14 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
