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
    <div className="relative mx-auto min-h-screen w-full max-w-7xl">
      {children}
      {/* Guide lines drawn as an overlay so they stay ON TOP of full-bleed
          sections (e.g. the dark platform block) instead of being covered. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 border-x border-zinc-200/80"
      />
    </div>
  );
}
