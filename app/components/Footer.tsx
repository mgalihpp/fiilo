import Logo from "./Logo";
import SectionDivider from "./SectionDivider";

/** Footer link columns. */
const COLUMNS = [
  {
    title: "Info",
    links: ["Home", "About Us", "Features", "Pricing"],
  },
  {
    title: "Resources",
    links: ["Blog & Article", "Contact Us", "Integrations"],
  },
  {
    title: "Company",
    links: ["Privacy policy", "Terms conditions", "Changelog", "License"],
  },
];

/** Social icons (24x24 path, currentColor). */
const SOCIALS = [
  {
    label: "Facebook",
    d: "M13 22v-8h2.7l.4-3H13V9.1c0-.9.3-1.5 1.6-1.5H16V5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.7 1.4-3.7 3.9V11H7.5v3H10v8h3Z",
  },
  {
    label: "LinkedIn",
    d: "M6.9 8.5H4V20h2.9V8.5ZM5.4 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 20h-2.9v-6c0-1.4-.5-2.3-1.7-2.3-.9 0-1.5.6-1.7 1.2-.1.2-.1.5-.1.8V20H9.7s.1-10.4 0-11.5h2.9v1.6c.4-.6 1.1-1.5 2.7-1.5 2 0 3.6 1.3 3.6 4.1V20Z",
  },
  {
    label: "Instagram",
    d: "M12 7.5A4.5 4.5 0 1 0 12 16.5 4.5 4.5 0 0 0 12 7.5Zm0 7.4a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8Zm4.7-7.6a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM12 4.6c-2 0-2.3 0-3 .1-.8 0-1.3.2-1.7.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3.9-.4 1.7 0 .8-.1 1-.1 3s0 2.3.1 3c0 .8.2 1.3.4 1.7.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2.9.3 1.7.4.8 0 1 .1 3 .1s2.3 0 3-.1c.8 0 1.3-.2 1.7-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-.9.4-1.7 0-.8.1-1 .1-3s0-2.3-.1-3c0-.8-.2-1.3-.4-1.7a3.5 3.5 0 0 0-.8-1.3 3.5 3.5 0 0 0-1.3-.8c-.4-.2-.9-.3-1.7-.4-.8 0-1-.1-3-.1Z",
  },
  {
    label: "Telegram",
    d: "M20.7 4.6 3.4 11.3c-.9.4-.9.9-.2 1.1l4.3 1.3 1.6 5c.2.5.1.7.6.7.4 0 .6-.2.8-.4l2.3-2.2 4.5 3.3c.8.5 1.4.2 1.6-.8L21 5.8c.3-1.2-.5-1.8-1.3-1.2Z",
  },
];

/**
 * Footer — brand block (logo, tagline, socials) beside three link columns,
 * a divider, then the copyright line.
 */
export default function Footer() {
  return (
    <footer className="px-6 pt-24 sm:px-10 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <Logo className="[&_img]:h-11" />
          <p className="mt-6 max-w-xs text-zinc-500">
            Fiilo is designed to revolutionize how sales teams operate
          </p>
          <div className="mt-8 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href="/"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-white transition-colors hover:bg-zinc-700"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d={s.d} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {COLUMNS.map((col) => (
          <nav key={col.title}>
            <h3 className="text-sm font-medium text-zinc-400">{col.title}</h3>
            <ul className="mt-5 space-y-4">
              {col.links.map((link, i) => (
                <li key={link}>
                  <a
                    href="/"
                    className={`text-[15px] transition-colors hover:text-zinc-900 ${
                      col.title === "Info" && i === 0
                        ? "text-orange-500"
                        : "text-zinc-700"
                    }`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mt-20">
        <SectionDivider />
      </div>

      <p className="py-10 text-center text-zinc-600">
        © 2025 Fiilo, Inc. All rights reserved.
        <span className="text-zinc-500">Powered by </span>
        <a
          href="/"
          className="font-medium text-zinc-900 underline-offset-2 hover:underline"
        >
          Webflow
        </a>
      </p>
    </footer>
  );
}
