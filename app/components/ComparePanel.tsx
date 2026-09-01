type ComparePanelProps = {
  variant: "before" | "after";
  headline: string;
  points: readonly string[];
  /** Pushes the content clear of the drag handle in the middle. */
  align: "left" | "right";
};

/**
 * One side of the before/after slider.
 *
 * This is a content panel, not a mock browser window. Faking a screenshot
 * out of divs is the most obvious tell there is, and a client who recognises
 * their own site is not in it stops trusting the rest of the page.
 *
 * The two sides are told apart by treatment rather than by a label alone:
 * the before side is flat, grey and tight, the after side has the brand
 * accent, more air and a lighter type colour.
 */
export default function ComparePanel({
  variant,
  headline,
  points,
  align,
}: ComparePanelProps) {
  const isAfter = variant === "after";

  return (
    <div
      className={`flex h-full w-full flex-col justify-center ${
        isAfter
          ? "bg-gradient-to-br from-surface via-surface to-[var(--accent-soft)]"
          : "bg-[#232020]"
      }`}
    >
      <div
        className={`w-full max-w-[46%] ${
          align === "left" ? "pl-[6%]" : "ml-auto pr-[6%] text-right"
        }`}
      >
        <p
          className={`text-lg font-semibold leading-tight tracking-tight sm:text-2xl ${
            isAfter ? "text-foreground" : "text-muted"
          }`}
        >
          {headline}
        </p>

        <ul
          className={`mt-4 flex flex-col gap-2 sm:mt-6 sm:gap-3 ${
            align === "right" ? "items-end" : ""
          }`}
        >
          {points.map((point) => (
            <li
              key={point}
              className={`flex items-start gap-2.5 text-[11px] leading-snug sm:text-sm ${
                align === "right" ? "flex-row-reverse text-right" : ""
              }`}
            >
              <span
                aria-hidden
                className={`mt-1.5 h-1 w-1 shrink-0 rounded-full sm:mt-2 ${
                  isAfter ? "bg-accent" : "bg-border-strong"
                }`}
              />
              <span className={isAfter ? "text-muted-strong" : "text-muted"}>
                {point}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
