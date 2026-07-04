import Marquee from "./Marquee";

/** Founder/customer logos shown in the scrolling marquee (from /public/founder). */
const FOUNDER_LOGOS = [
  { src: "/founder/loopbit.svg", alt: "Loopbit" },
  { src: "/founder/nexivo.svg", alt: "Nexivo" },
  { src: "/founder/infera.svg", alt: "Infera" },
  { src: "/founder/braina.svg", alt: "Braina" },
  { src: "/founder/synthora.svg", alt: "Synthora" },
];

/**
 * FoundersSection — social-proof strip below the hero image. A heading plus an
 * infinite marquee of founder logos. The left/right edges fade into the page
 * background so logos scroll in and out smoothly.
 */
export default function FoundersSection() {
  return (
    <section className="py-16">
      <h2 className="mb-10 text-center text-lg font-normal text-zinc-800">
        Trusted by 25,000+ founders
      </h2>

      {/* Fade masks on both edges via a horizontal alpha gradient mask */}
      <div className="relative [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <Marquee>
          {FOUNDER_LOGOS.map((logo) => (
            // biome-ignore lint/performance/noImgElement: small static SVG, no optimization needed
            <img
              key={logo.src}
              src={logo.src}
              alt={logo.alt}
              className="h-8 w-auto shrink-0 select-none"
              draggable={false}
            />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
