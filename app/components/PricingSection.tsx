import AnimatedText from "./AnimatedText";

/** The two pricing tiers. `included` flags drive the check/cross icons. */
const PLANS = [
  {
    name: "Free",
    price: "$0",
    featured: false,
    features: [
      { label: "Smart invoicing & tracking", included: true },
      { label: "Lead & deal tracking", included: true },
      { label: "Sales pipeline management", included: false },
    ],
  },
  {
    name: "Pro Plan",
    price: "$59",
    featured: true,
    features: [
      { label: "Smart invoicing & tracking", included: true },
      { label: "Lead & deal tracking", included: true },
      { label: "Sales pipeline management", included: true },
    ],
  },
];

function Check({ ok }: { ok: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      className="mt-0.5 shrink-0 text-blue-600"
      aria-hidden="true"
    >
      {ok ? (
        <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
      )}
    </svg>
  );
}

function PlanCard({ name, price, featured, features }: (typeof PLANS)[number]) {
  return (
    <div className="rounded-md border border-zinc-200/70 bg-white p-8">
      <h3 className="text-lg font-semibold text-zinc-900">{name}</h3>
      <p className="mt-1 text-sm text-zinc-500">
        Perfect for individuals and small teams
      </p>

      <p className="mt-6 text-4xl font-semibold text-zinc-900">{price}</p>
      <p className="mt-2 text-sm text-zinc-500">Per month, per user</p>
      <p className="text-xs text-zinc-400">*billed monthly</p>

      <button
        type="button"
        className={`group mt-6 w-full rounded-md py-3 text-sm font-medium transition-colors ${
          featured
            ? "bg-zinc-900 text-white hover:bg-zinc-800"
            : "border border-zinc-300 text-zinc-900 hover:bg-zinc-50"
        }`}
      >
        <AnimatedText text="Get Started" />
      </button>

      <hr className="my-6 border-zinc-200" />

      <p className="text-sm font-semibold text-zinc-900">What's included:</p>
      <ul className="mt-4 space-y-3">
        {features.map((f) => (
          <li
            key={f.label}
            className="flex items-start gap-2 text-sm text-zinc-600"
          >
            <Check ok={f.included} />
            {f.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * PricingSection — "Choose the Perfect Plan": badge, heading, two plan cards,
 * and a full-width "specific needs?" contact banner.
 */
export default function PricingSection() {
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
          <span className="text-sm font-medium text-zinc-700">Pricing</span>
        </div>

        <h2 className="text-balance text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Choose the Perfect Plan
        </h2>
        <p className="mt-5 text-lg text-zinc-500">
          Sales made simple with AI means smarter decisions, faster results
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
        {PLANS.map((p) => (
          <PlanCard key={p.name} {...p} />
        ))}
      </div>

      {/* Contact banner */}
      <div className="mx-auto mt-6 flex max-w-4xl flex-col items-start justify-between gap-6 rounded-md border border-zinc-200/70 bg-white p-8 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-semibold text-zinc-900">
            Do you have specific needs?
          </h3>
          <p className="mt-2 max-w-md text-zinc-500">
            You have more than 10 users or you want to complete your offer with
            complementary modules?
          </p>
        </div>
        <button
          type="button"
          className="group shrink-0 rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          <AnimatedText text="Contact us" />
        </button>
      </div>
    </section>
  );
}
