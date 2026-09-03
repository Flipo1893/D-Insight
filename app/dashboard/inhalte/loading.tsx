import Skeleton from "../../components/Skeleton";

export default function InhalteLoading() {
  return (
    <div className="max-w-xl">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-3 h-5 w-full" />

      <div className="mt-8 flex flex-col gap-6">
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <Skeleton className="h-4 w-32" />
            <Skeleton className={`mt-2 w-full ${i === 0 ? "h-12" : "h-24"}`} />
          </div>
        ))}
        <Skeleton className="h-12 w-32" />
      </div>

      <div className="mt-10 rounded-brand border border-border bg-surface p-4">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="mt-3 h-9 w-full" />
      </div>
    </div>
  );
}
