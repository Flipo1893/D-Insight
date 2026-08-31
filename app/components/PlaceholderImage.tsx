type PlaceholderImageProps = {
  label: string;
  hint: string;
  className?: string;
};

/**
 * Marks a spot where a real photo/screenshot goes later.
 * Replace with <Image src="..." ... /> once assets are delivered.
 */
export default function PlaceholderImage({
  label,
  hint,
  className = "",
}: PlaceholderImageProps) {
  return (
    <div
      className={`flex aspect-4/3 flex-col items-center justify-center gap-2 border border-dashed border-border bg-surface text-center ${className}`}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-muted"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
      <span className="text-sm font-medium text-muted">{label}</span>
      <span className="text-xs text-muted/70">{hint}</span>
    </div>
  );
}
