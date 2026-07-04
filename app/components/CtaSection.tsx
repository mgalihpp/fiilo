/**
 * CtaSection — dark, full-bleed closing banner (same treatment as the platform
 * section): faint rounded squares behind a headline whose second line is a
 * warm-to-cool gradient, and a single CTA button.
 */
import AnimatedText from "./AnimatedText";

export default function CtaSection() {
  return (
    <section className="relative left-1/2 z-30 w-screen -translate-x-1/2 px-4 py-16 sm:px-8">
      <div className="relative z-30 mx-auto flex min-h-[28rem] max-w-[1600px] items-center justify-center overflow-hidden rounded-3xl bg-[#0a0a0a] px-6 py-24 sm:px-10">
        {/* Faint decorative rounded squares, off to the left */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute left-[12%] top-[24%] h-56 w-56 rounded-3xl border border-white/[0.06]" />
          <div className="absolute left-[18%] top-[38%] h-64 w-64 rounded-3xl border border-white/[0.05]" />
        </div>

        {/* Dark guide lines aligned to the frame edges, covering the light
            global lines so the border stays dark over the black box. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-[calc((100%_-_80rem)/2)] z-40 w-px bg-zinc-900/20"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-[calc((100%_-_80rem)/2)] z-40 w-px bg-zinc-900/20"
        />

        <div className="relative flex flex-col items-center text-center">
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Unlock your AI Sales{" "}
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Super Powers
            </span>
          </h2>
          <button
            type="button"
            className="group mt-10 rounded-md bg-white/10 px-7 py-3 text-sm font-medium text-white ring-1 ring-white/15 transition-colors hover:bg-white/15"
          >
            <AnimatedText text="Get Started Now" />
          </button>
        </div>
      </div>
    </section>
  );
}
