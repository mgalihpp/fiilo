"use client";

import { useState } from "react";
import AnimatedText from "./AnimatedText";

const FAQS = [
  {
    q: "How can Filo help my sales team?",
    a: "Fiilo boosts productivity by automating routine sales tasks providing smart lead tracking, AI chat assistance",
  },
  {
    q: "Does Filo integrate with other tools?",
    a: "Fiilo helps sales teams work faster by handling routine activities with smart lead management and AI chat assistance.",
  },
  {
    q: "Is my data secure with Filo?",
    a: "Fiilo empowers sales teams by reducing manual work with automated tasks, intelligent lead insights, and AI chat support.",
  },
  {
    q: "Can I try Filo before purchasing?",
    a: "Fiilo simplifies sales operations using automation, advanced lead tracking, and AI-driven chat assistance.",
  },
];

/**
 * FaqSection — two-column: heading block on the left, an accordion of
 * questions on the right (all open by default, click to toggle).
 */
export default function FaqSection() {
  const [open, setOpen] = useState<number[]>([0, 1, 2, 3]);
  const toggle = (i: number) =>
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));

  return (
    <section className="px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.3fr]">
        {/* Heading */}
        <div>
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
            <span className="text-sm font-medium text-zinc-700">FAQ</span>
          </div>
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-5 text-lg text-zinc-500">
            Get answers to common questions here
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {FAQS.map((f, i) => {
            const isOpen = open.includes(i);
            return (
              <div
                key={f.q}
                className="rounded-md border border-zinc-200/70 bg-white px-6 py-5"
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="group flex w-full items-center justify-between gap-4 text-left"
                >
                  <span className="text-lg font-semibold text-zinc-900">
                    <AnimatedText text={f.q} />
                  </span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`shrink-0 text-zinc-500 transition-transform ${
                      isOpen ? "" : "rotate-180"
                    }`}
                    aria-hidden="true"
                  >
                    <path
                      d="m6 15 6-6 6 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {isOpen && (
                  <p className="mt-3 max-w-lg leading-relaxed text-zinc-500">
                    {f.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
