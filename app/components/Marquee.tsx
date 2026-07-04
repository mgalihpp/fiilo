import type { ReactNode } from "react";

/**
 * Marquee — an infinite, horizontally-scrolling track. The children are
 * rendered twice back-to-back and the track animates by -50%, so the loop is
 * seamless. Scrolling pauses on hover. Pure CSS (see `--animate-marquee` and
 * the `marquee` keyframes in globals.css), so it can render on the server.
 *
 * @param children - the items to scroll (one set; it is duplicated internally)
 * @param className - extra classes for the outer (clipping) container
 */
export default function Marquee({
  children,
  className = "",
  reverse = false,
  gap = "gap-16 pr-16",
  spread = true,
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  /** Gap between items + matching trailing space (e.g. "gap-3 pr-3"). */
  gap?: string;
  /** Spread items across the full width (few items) vs. pack them (many). */
  spread?: boolean;
}) {
  return (
    <div className={`group flex overflow-hidden ${className}`}>
      {/* Two identical tracks so -50% translation lands on a seamless copy */}
      {[0, 1].map((track) => (
        <div
          key={track}
          aria-hidden={track === 1}
          className={`flex w-max shrink-0 animate-marquee items-center ${gap} group-hover:[animation-play-state:paused] ${spread ? "min-w-full justify-around" : ""} ${reverse ? "[animation-direction:reverse]" : ""}`}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
