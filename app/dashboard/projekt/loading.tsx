import Skeleton from "../../components/Skeleton";

export default function ProjektLoading() {
  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-3 h-5 w-full max-w-lg" />
      </div>

      {/* Timeline of project phases */}
      <div className="flex flex-col gap-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="mt-2 h-4 w-full max-w-md" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-brand border border-border bg-surface p-6">
        <Skeleton className="h-5 w-56" />
        <Skeleton className="mt-3 h-4 w-full max-w-md" />
        <div className="mt-4 flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-4 w-full max-w-sm" />
          ))}
        </div>
      </div>
    </div>
  );
}
