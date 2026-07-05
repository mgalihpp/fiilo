

/** Four "AI-Powered Sales Overview" cards. Visuals in /public/features. */
const CARDS = [
  {
    title: "Track Your Sales Contacts",
    body: "Easily monitor and manage all your sales contacts in one place",
    img: "/features/overview1.avif",
    w: 988,
    h: 662,
    imageFirst: false,
  },
  {
    title: "Transaction Activity",
    body: "Stay up to date with the latest payments and contributions made by your members.",
    img: "/features/overview2.avif",
    w: 861,
    h: 600,
    imageFirst: true,
  },
  {
    title: "Bulk Payment",
    body: "Simplify your payment process by sending multiple transactions at once",
    img: "/features/overview3.avif",
    w: 1038,
    h: 783,
    imageFirst: false,
  },
  {
    title: "Track Monthly Sales",
    body: "Gain clear insights into your revenue trends with monthly sales tracking",
    img: "/features/overview4.avif",
    w: 1338,
    h: 783,
    imageFirst: true,
  },
];

function Card({ title, body, img, w, h, imageFirst }: (typeof CARDS)[number]) {
  const text = (
    <div className={imageFirst ? "px-8 pb-8" : "px-8 pt-8"}>
      <h3 className="text-xl font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-500">
        {body}
      </p>
    </div>
  );
  const visual = (
    <div className={imageFirst ? "px-8 pt-8" : "px-8 pb-8"}>
      <img
        src={img}
        alt={title}
        width={w}
        height={h}
        loading="lazy"
        className="h-auto w-full"
      />
    </div>
  );
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-zinc-200/70 bg-white">
      {imageFirst ? (
        <>
          {visual}
          <div className="mt-auto">{text}</div>
        </>
      ) : (
        <>
          {text}
          <div className="mt-auto">{visual}</div>
        </>
      )}
    </div>
  );
}

/**
 * OverviewSection — "AI-Powered Sales Overview": PRO badge, heading, subcopy,
 * and a 2-up grid of four feature cards (stacks on small screens).
 */
export default function OverviewSection() {
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
          AI-Powered Sales Overview
        </h2>
        <p className="mt-5 text-lg text-zinc-500">
          Sales made simple with AI means smarter decisions, faster results
        </p>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl items-start gap-6 md:grid-cols-2">
        {CARDS.map((c) => (
          <Card key={c.title} {...c} />
        ))}
      </div>
    </section>
  );
}
