import Skeleton from "../../components/Skeleton";

export default function KundenLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-3 h-5 w-full max-w-xl" />

      <div className="mt-8 divide-y divide-border border-y border-border">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="grid gap-2 py-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center sm:gap-6"
          >
            <div>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-2 h-4 w-56" />
            </div>
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
