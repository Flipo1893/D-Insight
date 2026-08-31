type PlaceholderImageProps = {
  label: string;
  hint: string;
  className?: string;
};

/**
 * Marks a slot where a real photo or screenshot goes once assets are
 * delivered. Kept deliberately typographic: no hand-drawn icon, no fake
 * product UI built out of divs. Swap for <Image src="..." /> on delivery.
 */
export default function PlaceholderImage({
  label,
  hint,
  className = "",
}: PlaceholderImageProps) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-2 border border-dashed border-border bg-surface p-6 text-center ${className}`}
    >
      <span className="font-mono text-xs uppercase tracking-wider text-muted-strong">
        {label}
      </span>
      <span className="text-xs text-muted">{hint}</span>
    </div>
  );
}
