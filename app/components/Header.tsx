"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import AnimatedText from "./AnimatedText";
import Logo from "./Logo";

/** Primary navigation links rendered in the desktop nav and mobile menu. */
const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

/**
 * Header — sticky top navigation with logo, centered links, and a CTA.
 * Collapses into a hamburger-triggered panel below the `md` breakpoint.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <header className="w-full">
      <nav className="mx-auto flex w-full items-center justify-between px-8 py-6 lg:px-12">
        {/* Left: brand */}
        <Logo />

        {/* Center: primary links (desktop only) */}
        <ul className="hidden items-center gap-8 md:flex">
          {/* "All Pages" is a dropdown trigger in the original design */}
          <li>
            <button
              type="button"
              className="group flex items-center gap-1 text-[15px] font-medium text-zinc-800 transition-colors hover:text-zinc-950"
            >
              <AnimatedText text="All Pages" />
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="m6 9 6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </li>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[15px] font-medium text-zinc-800 transition-colors hover:text-zinc-950"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: CTA (desktop) + menu toggle (mobile) */}
        <div className="flex items-center gap-3">
          {isLoaded && isSignedIn ? (
            <Link
              href="/dashboard"
              className="group hidden rounded-md bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 md:inline-block"
            >
              <AnimatedText text="Dashboard" />
            </Link>
          ) : (
            <Link
              href="/register"
              className="group hidden rounded-md bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 md:inline-block"
            >
              <AnimatedText text="Create Free Account" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="grid h-10 w-10 place-items-center rounded-md text-zinc-800 hover:bg-zinc-100 md:hidden"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {open && (
        <div className="border-t border-zinc-100 px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-1">
            <li>
              <button
                type="button"
                className="group w-full rounded-md px-2 py-2.5 text-left text-[15px] font-medium text-zinc-800 hover:bg-zinc-50"
              >
                <AnimatedText text="All Pages" />
              </button>
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-md px-2 py-2.5 text-[15px] font-medium text-zinc-800 hover:bg-zinc-50"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              {isLoaded && isSignedIn ? (
                <Link
                  href="/dashboard"
                  className="block rounded-md bg-zinc-900 px-5 py-3 text-center text-[15px] font-semibold text-white"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="block rounded-md bg-zinc-900 px-5 py-3 text-center text-[15px] font-semibold text-white"
                >
                  Create Free Account
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
