import Image from "next/image";

/**
 * DashboardPreview — the product screenshot that overlaps the bottom of the
 * hero. Rendered in a rounded, shadowed card that "floats" over the gradient.
 * The image itself lives in /public/dashboard.png.
 */
export default function DashboardPreview() {
  return (
    <section className="relative mx-auto w-full px-6 pb-20 sm:px-10 lg:px-16">
      <div className="overflow-hidden rounded-3xl border border-zinc-200/70 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)]">
        <Image
          src="/dashboard.png"
          alt="Fiilo analytics dashboard preview"
          width={1600}
          height={1000}
          priority
          className="h-auto w-full"
        />
      </div>
    </section>
  );
}
