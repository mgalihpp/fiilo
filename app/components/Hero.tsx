import AnimatedText from "./AnimatedText";

/**
 * Hero — centered marketing hero with an announcement pill, oversized
 * headline, supporting copy, and a primary CTA. Text is center-aligned
 * on all breakpoints to match the reference design.
 */
export default function Hero() {
  return (
    <section className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pb-10 pt-14 text-center sm:pt-20">
      {/* Announcement pill: "New" tag + message */}
      <div className="mb-8 inline-flex items-center gap-3 rounded-md border border-zinc-200/80 bg-white/70 py-1.5 pl-1.5 pr-4 shadow-sm backdrop-blur">
        <span className="rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-white">
          New
        </span>
        <span className="text-sm text-zinc-600">
          AI Search: Find leads your way
        </span>
      </div>

      {/* Headline — tight tracking, heavy weight, clamps down on small screens */}
      <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
        Let AI take your sales to the next level
      </h1>

      {/* Supporting copy */}
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-500">
        Unlock rapid growth by combining intelligent automation real time
        insights and streamlined workflows
      </p>

      {/* Primary CTA */}
      <a
        href="#trial"
        className="group mt-9 rounded-md bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition-colors hover:bg-zinc-800"
      >
        <AnimatedText text="Get 14 Days Free Trial" />
      </a>
      <p className="mt-5 text-sm text-zinc-500">No Credit Card Required</p>
    </section>
  );
}
