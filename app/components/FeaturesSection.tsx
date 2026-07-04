import Image from "next/image";
import type { ReactNode } from "react";

/** The three feature cards. Visuals live in /public/features. */
const FEATURES = [
  {
    title: "Task & Activity Management",
    body: "Assign, schedule, and track daily sales tasks effortlessly.",
    img: "/features/1.png",
    w: 506,
    h: 424,
    icon: (
      <path
        d="M7 3h6l4 4v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm6 0v4h4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Connect tools",
    body: "Assign, schedule, and track daily sales tasks effortlessly.",
    img: "/features/2.png",
    w: 675,
    h: 675,
    icon: (
      <path
        d="M4 4v5h5M20 20v-5h-5M18.4 9A7 7 0 0 0 6.3 6.3L4 9m16 6-2.3 2.7A7 7 0 0 1 5.6 15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: "Role-Based Access Control",
    body: "Assign, schedule, and track daily sales tasks effortlessly.",
    img: "/features/3.png",
    w: 759,
    h: 636,
    icon: (
      <path
        d="M8 4h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm1-2v2m6-2v2M9 20v2m6-2v2M4 9H2m2 6H2m20-6h-2m2 6h-2M9 9h6v6H9z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

function Card({
  title,
  body,
  img,
  w,
  h,
  icon,
}: (typeof FEATURES)[number] & { icon: ReactNode }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-zinc-200/70 bg-white">
      <div className="p-7">
        <span className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-md bg-zinc-100 text-zinc-700">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            {icon}
          </svg>
        </span>
        <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
        <p className="mt-2 max-w-56 text-sm leading-relaxed text-zinc-500">
          {body}
        </p>
      </div>
      {/* Feature visual, anchored to the bottom of the card */}
      <div className="mt-auto px-7 pb-7">
        <Image
          src={img}
          alt={title}
          width={w}
          height={h}
          className="h-auto w-full rounded-md"
        />
      </div>
    </div>
  );
}

/**
 * FeaturesSection — "Sales Made Simple with AI": an announcement pill, heading,
 * subcopy, and a 3-up grid of feature cards (stacks on small screens).
 */
export default function FeaturesSection() {
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
          <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
            FREE
          </span>
        </div>

        <h2 className="text-balance text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Sales Made Simple with AI
        </h2>
        <p className="mt-5 text-lg text-zinc-500">
          Sales made simple with AI means smarter decisions, faster results
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3">
        {FEATURES.map((f) => (
          <Card key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}
