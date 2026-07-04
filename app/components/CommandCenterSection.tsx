import Image from "next/image";

/** 4x2 grid of feature tiles. Visuals in /public/features (cc1-8.svg). */
const TILES = [
  { label: "AI Chat Assistant", img: "/features/cc1.svg" },
  { label: "Revenue Tracker", img: "/features/cc2.svg" },
  { label: "Expense Monitor", img: "/features/cc3.svg" },
  { label: "Real-time Reports", img: "/features/cc4.svg" },
  { label: "Profit Analyzer", img: "/features/cc5.svg" },
  { label: "Sales Summary", img: "/features/cc6.svg" },
  { label: "Deal Pipeline", img: "/features/cc7.svg" },
  { label: "Task Reminders", img: "/features/cc8.svg" },
];

/**
 * CommandCenterSection — "Your Complete Sales Command Center": PRO badge,
 * heading, then a 4-up grid of illustrated feature tiles with captions.
 */
export default function CommandCenterSection() {
  return (
    <section className="px-6 py-20 sm:px-10 lg:px-16">
      <div className="flex flex-col items-center text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-md border border-zinc-200/80 bg-white py-2 pl-3 pr-2 shadow-sm">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="text-zinc-600"
            aria-hidden="true"
          >
            <path
              d="M9 9h6v6H9zM8 4h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm1-2v2m6-2v2M9 20v2m6-2v2M4 9H2m2 6H2m20-6h-2m2 6h-2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm font-medium text-zinc-700">
            Sales AI Copilot
          </span>
          <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
            PRO
          </span>
        </div>

        <h2 className="text-balance text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Your Complete Sales Command Center
        </h2>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TILES.map((t) => (
          <div key={t.label} className="text-center">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md bg-zinc-100">
              <Image
                src={t.img}
                alt={t.label}
                width={400}
                height={400}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-4 font-medium text-zinc-900">{t.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
