import Skeleton from "../../components/Skeleton";

export default function AboLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-3 h-5 w-full max-w-xl" />
      </div>

      <div className="rounded-brand border border-border bg-surface p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-7 w-28" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="mt-6 h-11 w-40" />
      </div>
    </div>
  );
}
