

type CardData = {
  title: string;
  body: string;
  img: string;
  w: number;
  h: number;
  imageFirst: boolean;
};

/** "Real-Time Insights" cards. Visuals in /public/features. */
const SALES_OVERVIEW: CardData = {
  title: "Sales Overview",
  body: "Get a clear snapshot of your sales performance in one place",
  img: "/features/insights1.avif",
  w: 506,
  h: 704,
  imageFirst: false,
};

const PERFORMANCE: CardData = {
  title: "Performance Summary",
  body: "It's provides a quick snapshot of your company's key financial metrics",
  img: "/features/insights3.avif",
  w: 903,
  h: 1128,
  imageFirst: false,
};

const MIDDLE: CardData[] = [
  {
    title: "Schedule payment",
    body: "Gain clear insights into your revenue with monthly",
    img: "/features/insights2.avif",
    w: 759,
    h: 297,
    imageFirst: true,
  },
  {
    title: "Total revenue",
    body: "Gain clear insights into your revenue with monthly",
    img: "/features/insights4.avif",
    w: 759,
    h: 297,
    imageFirst: true,
  },
];

function Card({ title, body, img, w, h, imageFirst }: CardData) {
  const text = (
    <div className={imageFirst ? "px-7 pb-7" : "px-7 pt-7"}>
      <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500">{body}</p>
    </div>
  );
  const visual = (
    <div className={imageFirst ? "px-7 pt-7" : "px-7 pb-7"}>
      <img
        src={img}
        alt={title}
        loading="lazy"
        className="h-auto w-full"
      />
    </div>
  );
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md border border-zinc-200/70 bg-white">
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
 * InsightsSection — "Real-Time Insights for Smarter Decisions": PRO badge,
 * heading, then a 3-column grid. The middle column stacks two cards.
 */
export default function InsightsSection() {
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
          Real-Time Insights for Smarter Decisions
        </h2>
      </div>

      <div className="mx-auto mt-14 grid max-w-6xl items-start gap-6 md:grid-cols-3">
        <Card {...SALES_OVERVIEW} />
        <div className="flex flex-col gap-6">
          {MIDDLE.map((c) => (
            <Card key={c.title} {...c} />
          ))}
        </div>
        <Card {...PERFORMANCE} />
      </div>
    </section>
  );
}
