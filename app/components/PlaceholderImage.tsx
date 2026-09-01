type PlaceholderImageProps = {
  label: string;
  hint: string;
  /**
   * Where the caption sits. In the compare slider the two panels overlap and
   * the drag handle sits dead centre, so those captions move to opposite
   * sides and drop to the bottom edge to stay clear of it.
   */
  align?: "center" | "left" | "right";
  className?: string;
};

const alignment = {
  center: "items-center justify-center",
  left: "items-start justify-end pl-[7%] pb-5",
  right: "items-end justify-end pr-[7%] pb-5",
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
      className={`flex h-full w-full flex-col gap-1 border border-dashed border-border bg-surface p-4 text-center ${alignment[align]} ${className}`}
    >
      <span className="font-mono text-xs uppercase tracking-wider text-muted-strong">
        {label}
      </span>
      <span className="text-xs text-muted">{hint}</span>
    </div>
  );
}
