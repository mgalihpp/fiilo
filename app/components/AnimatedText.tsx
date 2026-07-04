const NBSP = " ";

/**
 * AnimatedText — a per-letter "text roll" hover effect (a.k.a. staggered text
 * swap). On hover of the nearest `.group` ancestor:
 *   - the current text rolls UP and out, letter by letter
 *   - a second copy rolls IN from below, letter by letter
 * Each letter gets an incrementing transition-delay, producing the wave feel.
 *
 * Only the TEXT is animated — drop it inside any button/link that has the
 * `group` class. It stays a pure-CSS effect (no JS/state), so it can render
 * on the server.
 *
 * @param text  - the label to animate (same string is used for both layers)
 * @param className - extra classes (e.g. font styling) for the wrapper
 * @param stagger  - ms of delay added per letter to tune the wave speed
 */
export default function AnimatedText({
  text,
  className = "",
  stagger = 15,
}: {
  text: string;
  className?: string;
  stagger?: number;
}) {
  // Split into characters; spaces become non-breaking so widths are preserved.
  const letters = [...text].map((c) => (c === " " ? NBSP : c));

  return (
    // overflow-hidden clips each layer as it slides in/out of view
    <span
      className={`relative inline-block overflow-hidden align-middle ${className}`}
    >
      {/* Layer 1 — visible at rest, rolls UP on hover */}
      <span aria-hidden="true" className="flex">
        {letters.map((char, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: static label, index is stable
            key={i}
            style={{ transitionDelay: `${i * stagger}ms` }}
            className="inline-block transition-transform duration-200 ease-out group-hover:-translate-y-full"
          >
            {char}
          </span>
        ))}
      </span>

      {/* Layer 2 — sits below, rolls UP into place on hover */}
      <span aria-hidden="true" className="absolute inset-0 flex">
        {letters.map((char, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: static label, index is stable
            key={i}
            style={{ transitionDelay: `${i * stagger}ms` }}
            className="inline-block translate-y-full transition-transform duration-200 ease-out group-hover:translate-y-0"
          >
            {char}
          </span>
        ))}
      </span>

      {/* Accessible label (the animated layers are aria-hidden) */}
      <span className="sr-only">{text}</span>
    </span>
  );
}
