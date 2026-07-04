"use client";

import Image from "next/image";
import { useState } from "react";
import AnimatedText from "./AnimatedText";

/**
 * Per-brand testimonials. Only the image differs conceptually; here every tab
 * reuses the same portrait with its own quote + metrics.
 * ponytail: reused one image across tabs — swap in per-brand assets when supplied.
 */
const TABS = [
  {
    name: "Synthora",
    quote:
      "With Fiilo's smart automation and real-time insights, we've improved deal closures by 35% in just two months.",
    author: "Jacob Jones",
    role: "Jacob Jones",
    stats: [
      { value: "$100K", label: "Increase sales revenue" },
      { value: "90%", label: "Boos team efficiency" },
    ],
  },
  {
    name: "Loopbit",
    quote:
      "Fiilo gave our team a single source of truth. Pipeline reviews that took hours now take minutes.",
    author: "Marcus Lee",
    role: "Head of Sales",
    stats: [
      { value: "$80K", label: "Increase sales revenue" },
      { value: "85%", label: "Boost team efficiency" },
    ],
  },
  {
    name: "Nexivo",
    quote:
      "The AI copilot surfaces the right deals at the right time. Our reps finally focus on selling.",
    author: "Priya Nair",
    role: "VP Revenue",
    stats: [
      { value: "$120K", label: "Increase sales revenue" },
      { value: "92%", label: "Boost team efficiency" },
    ],
  },
  {
    name: "Infera",
    quote:
      "Onboarding was effortless and the insights paid for themselves within the first quarter.",
    author: "David Kim",
    role: "Founder",
    stats: [
      { value: "$95K", label: "Increase sales revenue" },
      { value: "88%", label: "Boost team efficiency" },
    ],
  },
  {
    name: "Braina",
    quote:
      "Real-time forecasting changed how we plan. We hit targets three months running.",
    author: "Sara Lopez",
    role: "COO",
    stats: [
      { value: "$110K", label: "Increase sales revenue" },
      { value: "91%", label: "Boost team efficiency" },
    ],
  },
];

export default function UseCaseSection() {
  const [active, setActive] = useState(0);
  const tab = TABS[active];

  return (
    <section className="px-6 py-20 sm:px-10 lg:px-16">
      <div className="flex flex-col items-center text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-md border border-zinc-200/80 bg-white px-3 py-2 shadow-sm">
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
          <span className="text-sm font-medium text-zinc-700">Use Case</span>
        </div>

        <h2 className="text-balance text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          See why users love our fiilo.com
        </h2>

        {/* Brand tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {TABS.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onClick={() => setActive(i)}
              className={`group text-[15px] font-medium transition-colors ${
                i === active
                  ? "text-orange-500"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <AnimatedText text={t.name} />
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl items-stretch gap-6 md:grid-cols-2">
        {/* Portrait — the source image is a cut-out with a transparent
            background, so the orange wash comes from this gradient behind it. */}
        <div className="overflow-hidden rounded-md bg-gradient-to-br from-orange-500 to-red-600">
          <Image
            src="/features/usecase.avif"
            alt={tab.name}
            width={920}
            height={918}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Testimonial card */}
        <div className="flex flex-col rounded-md border border-zinc-200/70 bg-white p-8 sm:p-10">
          <span className="text-xl font-semibold tracking-tight text-zinc-900">
            {tab.name}
          </span>

          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mt-8 text-zinc-900"
            aria-hidden="true"
          >
            <path d="M7 7h4v6a4 4 0 0 1-4 4v-2a2 2 0 0 0 2-2H7V7Zm8 0h4v6a4 4 0 0 1-4 4v-2a2 2 0 0 0 2-2h-2V7Z" />
          </svg>
          <p className="mt-4 max-w-md text-xl leading-relaxed text-zinc-800">
            {tab.quote}
          </p>

          <p className="mt-8">
            <span className="font-semibold text-zinc-900">{tab.author}</span>{" "}
            <span className="text-zinc-500">{tab.role}</span>
          </p>

          <hr className="my-8 border-zinc-200" />

          <div className="grid grid-cols-2 gap-6">
            {tab.stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-semibold text-orange-500">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
