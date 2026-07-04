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
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`group flex overflow-hidden ${className}`}>
      {/* Two identical tracks so -50% translation lands on a seamless copy */}
      {[0, 1].map((track) => (
        <div
          key={track}
          aria-hidden={track === 1}
          className="flex w-max min-w-full shrink-0 animate-marquee items-center justify-around gap-16 pr-16 group-hover:[animation-play-state:paused]"
        >
          {children}
        </div>
      ))}
    </div>
  );
}
