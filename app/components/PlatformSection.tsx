import Image from "next/image";
import Marquee from "./Marquee";

/** Feature pills scrolled in three marquee rows. `c` is the dot colour. */
const ROWS = [
  [
    { label: "Lead Scoring", c: "bg-blue-400" },
    { label: "AI-Powered Deal Forecasting", c: "bg-orange-400" },
    { label: "Pipeline Management", c: "bg-pink-400" },
    { label: "Automated Follow-Ups", c: "bg-green-400" },
    { label: "Sales Assistant", c: "bg-blue-400" },
  ],
  [
    { label: "CRM Integration", c: "bg-green-400" },
    { label: "Performance Analytics", c: "bg-blue-400" },
    { label: "Custom Workflows", c: "bg-yellow-400" },
    { label: "Team Collaboration Tools", c: "bg-green-400" },
    { label: "Mobile App", c: "bg-orange-400" },
  ],
  [
    { label: "AI Assistant", c: "bg-pink-400" },
    { label: "Multi-Channel Outreach", c: "bg-blue-400" },
    { label: "Smart Contact Enrichment", c: "bg-orange-400" },
    { label: "Quote & Proposal Builder", c: "bg-green-400" },
    { label: "Sales Reporting", c: "bg-blue-400" },
  ],
];

function Pill({ label, c }: { label: string; c: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-zinc-100">
      <span className={`h-2.5 w-2.5 rounded-full ${c}`} />
      {label}
    </span>
  );
}

/**
 * PlatformSection — dark, rounded showcase: badge, heading, the platform
 * dashboard screenshot, then three marquee rows of feature pills (middle row
 * scrolls the opposite way).
 */
export default function PlatformSection() {
  return (
    <section className="relative left-1/2 z-30 w-screen -translate-x-1/2 px-4 py-16 sm:px-8">
      <div className="relative z-30 mx-auto max-w-[1600px] overflow-hidden rounded-3xl bg-[#0a0a0a] px-6 py-25 sm:px-10">
        {/* Coloured spotlights glowing up behind the dashboard */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -left-20 top-[20%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,_rgba(139,92,246,0.5),_transparent_65%)] blur-3xl" />
          <div className="absolute -right-20 top-[30%] h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,_rgba(56,130,246,0.45),_transparent_65%)] blur-3xl" />
          <div className="absolute left-1/2 top-[8%] h-72 w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,_rgba(255,255,255,0.12),_transparent_70%)] blur-2xl" />
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
          <div className="mb-7 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="text-zinc-300"
              aria-hidden="true"
            >
              <path
                d="M9 9h6v6H9zM8 4h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm1-2v2m6-2v2M9 20v2m6-2v2M4 9H2m2 6H2m20-6h-2m2 6h-2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-medium text-zinc-200">
              Sales AI Copilot
            </span>
          </div>

          <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            All in one platform to level up your sales process
          </h2>
        </div>

        {/* Dashboard screenshot, bleeding off the bottom edge */}
        <div className="relative mx-auto mt-12 max-w-4xl">
          <Image
            src="/features/platform.webp"
            alt="Fiilo platform dashboard"
            width={1436}
            height={1091}
            className="h-auto w-full rounded-xl"
          />
        </div>

        {/* Feature pill marquees */}
        <div className="relative pb-16 pt-14">
          <div className="space-y-4">
            <p className="text-center text-sm text-zinc-400">
              Never miss an opportunity
            </p>
            <div className="mx-auto flex max-w-4xl flex-col gap-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            {ROWS.map((row, i) => (
              <Marquee
                key={row[0].label}
                reverse={i === 1}
                spread={false}
                gap="gap-3 pr-3"
              >
                {/* Repeat so a single track is wider than the container */}
                {[...row, ...row].map((p, j) => (
                  <Pill key={`${p.label}-${j}`} {...p} />
                ))}
              </Marquee>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
