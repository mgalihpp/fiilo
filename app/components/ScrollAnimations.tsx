"use client";

import { useEffect } from "react";

/** Big standalone visuals that get a scrub-driven parallax (desktop only). */
const PARALLAX = ['img[src="/dashboard.png"]', 'img[src*="platform"]'];

/**
 * ScrollAnimations — the entire page's GSAP layer, in one DOM-driven file.
 *
 * It edits no section component: it hooks onto structure already in the markup
 * so the animation concern lives in a single place. GSAP + ScrollTrigger are
 * dynamically imported after hydration, so they never weigh down first paint.
 *
 * Coverage — every section gets motion:
 *   • headings (`h1`/`h2`) rise as they scroll in;
 *   • every content block (cards, FAQ rows, banners, images) reveals with a
 *     staggered rise, de-duplicated so a card and its inner image don't fight;
 *   • the hero dashboard and platform shots get a subtle scrub parallax;
 *   • cards lift on hover.
 *
 * Responsive: reveals run on all viewports; the scrub parallax is desktop-only
 * (≥768px) — pointless and janky on touch. Accessibility: the whole thing is
 * gated on `prefers-reduced-motion`; reduced-motion users keep the static,
 * server-rendered page untouched.
 */
export default function ScrollAnimations() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          motion: "(prefers-reduced-motion: no-preference)",
          desktop:
            "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
        },
        (context) => {
          const { reduce, desktop } = context.conditions as {
            reduce: boolean;
            motion: boolean;
            desktop: boolean;
          };
          // Reduced motion: leave the server-rendered page exactly as is.
          if (reduce) return;

          const q = gsap.utils.selector(document);

          // The images we parallax get opacity-only reveals (below), so their
          // transform stays free for the scrub tween — no fighting over `y`.
          const parallaxEls = new Set<Element>(
            PARALLAX.flatMap((sel) => q(sel)),
          );

          // 1) Hero entrance on load — headline then its buttons pop up in
          //    sequence with a springy overshoot to set a lively pace.
          gsap.from("main h1", {
            y: 40,
            opacity: 0,
            scale: 0.96,
            filter: "blur(10px)",
            duration: 1,
            ease: "expo.out",
          });
          gsap.from("main h1 ~ *", {
            y: 24,
            opacity: 0,
            duration: 0.7,
            ease: "back.out(1.6)",
            stagger: 0.08,
            delay: 0.25,
          });

          // 2) Every section heading reveals as it enters — rise + de-blur for a
          //    crisp "focus-in" feel. `once` self-kills the trigger afterwards.
          for (const el of gsap.utils.toArray<HTMLElement>("main h2")) {
            gsap.from(el, {
              y: 48,
              opacity: 0,
              filter: "blur(8px)",
              duration: 0.9,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            });
          }

          // 3) Every content block reveals. We gather cards, FAQ rows, banners
          //    and images, then keep only the OUTERMOST of any nested pair so a
          //    grid card and the <img> inside it don't animate twice.
          const raw = gsap.utils.toArray<HTMLElement>(
            "main .grid > *, main .space-y-4 > *, main .justify-between, main img",
          );
          const rawSet = new Set(raw);
          const blocks = raw.filter((el) => {
            for (let p = el.parentElement; p; p = p.parentElement) {
              if (rawSet.has(p)) return false; // an ancestor already reveals it
            }
            return true;
          });

          // Split: parallaxed images fade only; everything else rises + fades.
          const risers = blocks.filter((el) => !parallaxEls.has(el));
          const faders = blocks.filter((el) => parallaxEls.has(el));

          // Pre-hide up front so nothing flashes visible before its trigger.
          // (batch only creates the tween on enter, unlike `from()`, so the
          //  hidden state must be set explicitly or cards pop in already shown.)
          gsap.set(risers, {
            opacity: 0,
            y: 56,
            scale: 0.92,
            filter: "blur(6px)",
          });
          ScrollTrigger.batch(risers, {
            start: "top 88%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 0.8,
                ease: "back.out(1.4)",
                stagger: { each: 0.09, from: "start" },
                overwrite: true,
              }),
          });

          for (const el of faders) {
            gsap.from(el, {
              opacity: 0,
              duration: 0.9,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            });
          }

          // 4) Parallax (desktop only): scrub the big visuals against scroll for
          //    depth. `yPercent` keeps it transform-only and GPU-friendly.
          if (desktop) {
            for (const el of faders) {
              gsap.fromTo(
                el,
                { yPercent: -8 },
                {
                  yPercent: 8,
                  ease: "none",
                  scrollTrigger: {
                    trigger: el,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                  },
                },
              );
            }
          }

          // 5) Hover lift on cards — rise + a touch of scale, driven by `quickTo`
          //    so each hover reuses one tween instead of allocating per event.
          const hoverCleanups: Array<() => void> = [];
          for (const card of gsap.utils.toArray<HTMLElement>(
            "main .grid > *",
          )) {
            const y = gsap.quickTo(card, "y", {
              duration: 0.4,
              ease: "power3",
            });
            const s = gsap.quickTo(card, "scale", {
              duration: 0.4,
              ease: "power3",
            });
            const enter = () => {
              y(-8);
              s(1.02);
            };
            const leave = () => {
              y(0);
              s(1);
            };
            card.addEventListener("mouseenter", enter);
            card.addEventListener("mouseleave", leave);
            hoverCleanups.push(() => {
              card.removeEventListener("mouseenter", enter);
              card.removeEventListener("mouseleave", leave);
            });
          }

          // 6) Magnetic buttons (desktop) — the button eases toward the cursor
          //    while hovered and springs back on exit. Small, tactile, premium.
          if (desktop) {
            for (const btn of gsap.utils.toArray<HTMLElement>("main button")) {
              // Only compact buttons feel good magnetic; skip full-width ones
              // (FAQ accordion headers, tabs) where a shift looks off.
              if (btn.offsetWidth > 260) continue;
              const xTo = gsap.quickTo(btn, "x", {
                duration: 0.5,
                ease: "power3",
              });
              const yTo = gsap.quickTo(btn, "y", {
                duration: 0.5,
                ease: "power3",
              });
              const move = (e: MouseEvent) => {
                const r = btn.getBoundingClientRect();
                xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
                yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
              };
              const reset = () => {
                xTo(0);
                yTo(0);
              };
              btn.addEventListener("mousemove", move);
              btn.addEventListener("mouseleave", reset);
              hoverCleanups.push(() => {
                btn.removeEventListener("mousemove", move);
                btn.removeEventListener("mouseleave", reset);
              });
            }
          }

          // Recompute trigger offsets once layout has settled.
          ScrollTrigger.refresh();

          return () => {
            for (const fn of hoverCleanups) fn();
          };
        },
      );

      cleanup = () => mm.revert();
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
