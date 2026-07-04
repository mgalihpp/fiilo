/**
 * A "+" registration mark. It carries a small background "mask" (page colour)
 * with horizontal padding, so the divider line running behind it is hidden
 * right around the mark — leaving a little gap between the line and the "+".
 */
function CrossMark({ side }: { side: "left" | "right" }) {
  // Center the mark exactly on the frame's left / right guide line.
  const pos =
    side === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2";
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute top-1/2 z-20 -translate-y-1/2 bg-[#faf9f8] px-1.5 text-zinc-400 ${pos}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        role="presentation"
        className="block"
      >
        <path
          d="M9 2v14M2 9h14"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

/**
 * SectionDivider — a horizontal separator between page sections.
 *
 * The line bleeds the FULL viewport width (via `w-screen` centered on the
 * frame) so it runs out into the left/right gutters. Each "+" mark sits on a
 * Frame guide line and masks the line around itself, so there's a small gap
 * between the line and the "+".
 *
 * Render as a direct child of <Frame>. Use it to divide content sections —
 * not around the navbar or the hero image.
 */
export default function SectionDivider() {
  return (
    // Height = the "+" icon height so the line and marks share one center axis
    <div className="relative flex h-[18px] w-full items-center">
      {/* Full-viewport-width line, centered vertically, bleeding into gutters */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-px w-screen -translate-x-1/2 -translate-y-1/2 bg-zinc-200/70"
      />
      <CrossMark side="left" />
      <CrossMark side="right" />
    </div>
  );
}
