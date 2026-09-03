import Skeleton from "../../components/Skeleton";

export default function VerlaufLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-3 h-5 w-full max-w-xl" />
      </div>

      {/* Headline card: site, current score, measured-at */}
      <div className="rounded-brand border border-border bg-surface p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <Skeleton className="h-4 w-56" />
            <Skeleton className="mt-3 h-10 w-28" />
          </div>
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-brand border border-border bg-surface p-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-3 h-7 w-20" />
          </div>
        ))}
      </div>

      <Skeleton className="h-4 w-full max-w-lg" />
    </div>
  );
}
