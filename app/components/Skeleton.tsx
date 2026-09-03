/** Placeholder block with the shimmer animation from globals.css. */
export default function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`skeleton ${className}`} />;
}
