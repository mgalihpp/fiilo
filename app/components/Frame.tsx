import type { ReactNode } from "react";

/**
 * Frame — centers page content in a fixed-width column and draws the faint
 * vertical guide lines on the left/right edges (via `border-x`).
 *
 * The border spans the full height of whatever children it wraps, so place
 * the entire page (header → hero → preview) inside a single Frame. Section
 * boundaries are marked with <SectionDivider /> children, not corner marks.
 */
export default function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto min-h-screen w-full max-w-7xl border-x border-zinc-200/70">
      {children}
    </div>
  );
}
