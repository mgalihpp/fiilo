import DashboardPreview from "./components/DashboardPreview";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";
import FoundersSection from "./components/FoundersSection";
import Frame from "./components/Frame";
import Header from "./components/Header";
import Hero from "./components/Hero";
import OverviewSection from "./components/OverviewSection";
import PlatformSection from "./components/PlatformSection";
import SectionDivider from "./components/SectionDivider";

/**
 * Landing page.
 *
 * Layout: everything lives inside a centered <Frame> that draws the faint
 * vertical guide lines + corner "+" separators seen in the design. Behind the
 * lower half, a colourful gradient (pink on the left, orange on the right)
 * glows out from *behind the dashboard preview*.
 */
export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#faf9f8]">
      {/*
        Gradient wash. It sits low on the page — roughly starting where the
        hero copy ends — so the top stays clean white and the colour blooms
        around the dashboard screenshot, exactly like the reference.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[360px] h-[720px]"
      >
        {/* Pink/magenta bloom — left side */}
        <div className="absolute -left-[8%] top-0 h-[560px] w-[60%] rounded-full bg-[radial-gradient(circle_at_center,_rgba(236,72,153,0.55),_rgba(168,85,247,0.32)_45%,_transparent_72%)] blur-3xl" />
        {/* Orange bloom — right side, dropped slightly lower */}
        <div className="absolute -right-[12%] top-[12%] h-[560px] w-[62%] rounded-full bg-[radial-gradient(circle_at_center,_rgba(251,146,60,0.6),_rgba(249,115,22,0.3)_45%,_transparent_72%)] blur-3xl" />
      </div>

      {/* Content column with guide lines / "+" corner separators */}
      <div className="relative z-10">
        <Frame>
          {/* No separator under the navbar or around the hero image */}
          <Header />
          <main>
            <Hero />
            <DashboardPreview />

            <SectionDivider />
            <FoundersSection />
            <SectionDivider />
            <FeaturesSection />
            <SectionDivider />
            <OverviewSection />
            <SectionDivider />
            <PlatformSection />
            <SectionDivider />
          </main>
          <Footer />
        </Frame>
      </div>
    </div>
  );
}
