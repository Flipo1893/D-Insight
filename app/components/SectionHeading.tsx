import type { ReactNode } from "react";

/**
 * Shared section headline. Deliberately has no eyebrow slot: the taste-skill
 * eyebrow budget for this page is 3 and the page reads fine without any, so
 * the headline carries the hierarchy on its own.
 */
export default function SectionHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-3xl font-semibold leading-tight tracking-tight md:text-[2.75rem] ${className}`}
    >
      {children}
    </h2>
  );
}
