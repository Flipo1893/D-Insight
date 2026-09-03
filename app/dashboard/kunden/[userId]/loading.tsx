import Skeleton from "../../../components/Skeleton";

export default function KundeDetailLoading() {
  return (
    <div>
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-6 h-8 w-56" />
      <Skeleton className="mt-3 h-5 w-64" />

      <div className="mt-6 rounded-brand border border-border bg-surface p-4">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="mt-3 h-9 w-full" />
      </div>

      <div className="mt-10 flex max-w-3xl flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i}>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-2 h-10 w-full" />
            </div>
          ))}
        </div>

        <div>
          <Skeleton className="h-4 w-40" />
          <div className="mt-4 flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-24 w-full sm:h-20" />
            ))}
          </div>
        </div>

        <Skeleton className="h-12 w-48" />
      </div>
    </div>
  );
}
