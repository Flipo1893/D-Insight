type PlaceholderImageProps = {
  label: string;
  hint: string;
  /**
   * Where the caption sits. In the compare slider the two panels overlap, so
   * their captions are pushed to opposite sides to stay readable.
   */
  align?: "center" | "left" | "right";
  className?: string;
};

const alignment = {
  center: "items-center",
  left: "items-start pl-[8%]",
  right: "items-end pr-[8%]",
} as const;

/**
 * Marks a slot where a real photo or screenshot goes once assets are
 * delivered. Kept deliberately typographic: no hand-drawn icon, no fake
 * product UI built out of divs. Swap for <Image src="..." /> on delivery.
 */
export default function PlaceholderImage({
  label,
  hint,
  align = "center",
  className = "",
}: PlaceholderImageProps) {
  return (
    <div
      className={`flex h-full w-full flex-col justify-center gap-1 border border-dashed border-border bg-surface p-4 ${alignment[align]} ${className}`}
    >
      <span className="font-mono text-xs uppercase tracking-wider text-muted-strong">
        {label}
      </span>
      <span className="text-xs text-muted">{hint}</span>
    </div>
  );
}
