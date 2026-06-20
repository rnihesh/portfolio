import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger, BREAKPOINTS } from "../../utils/gsapConfig";
import { JOB_TITLE } from "../../data/identity";

/**
 * Hero — the opening screen.
 *
 * A clean, confident entrance: NIHESH rises out of an overflow-hidden mask,
 * a single emerald accent rule draws in beneath it, and the role subtitle wipes
 * up. Corner brackets and the scroll cue fade in. Everything settles fully
 * visible and readable. A gentle, optional fade on scroll-out (toggleActions,
 * NOT a pin or a scrubbed timeline) lets the next section take over cleanly.
 *
 * Hard rules honored: opaque black background, NOT pinned, NIHESH is always
 * plain white text (no background-clip), reduced-motion branch sets clean final
 * visible states, single emerald accent (#10b981), no ghost backdrop words.
 */
function ScrollHeroSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const accentRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const cornerRefs = useRef([]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Reduced motion: clean final visible states, no animation.
    mm.add(BREAKPOINTS.reducedMotion, () => {
      gsap.set(titleRef.current, { yPercent: 0, opacity: 1 });
      gsap.set(accentRef.current, { scaleX: 1, opacity: 1 });
      gsap.set(subtitleRef.current, { yPercent: 0, opacity: 1 });
      gsap.set(scrollIndicatorRef.current, { opacity: 1, y: 0 });
      gsap.set(cornerRefs.current.filter(Boolean), { opacity: 0.45 });
      return () => {};
    });

    // No-preference: tasteful entrance + gentle scroll-out fade. No pin, no scrub.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const corners = cornerRefs.current.filter(Boolean);

        // Initial hidden states.
        gsap.set(titleRef.current, { yPercent: 118 });
        gsap.set(accentRef.current, { scaleX: 0, opacity: 1 });
        gsap.set(subtitleRef.current, { yPercent: 110, opacity: 0 });
        gsap.set(scrollIndicatorRef.current, { opacity: 0, y: 16 });
        gsap.set(corners, { opacity: 0 });

        // One-shot entrance on load — confident, smooth, fully readable at rest.
        const tl = gsap.timeline({ delay: 0.15 });

        tl.to(corners, {
          opacity: 0.45,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
        })
          .to(
            titleRef.current,
            { yPercent: 0, duration: 1, ease: "cineOut" },
            0.1
          )
          .to(
            accentRef.current,
            { scaleX: 1, duration: 0.8, ease: "power3.inOut" },
            0.55
          )
          .to(
            subtitleRef.current,
            { yPercent: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
            0.7
          )
          .to(
            scrollIndicatorRef.current,
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
            0.95
          );

        // Looping scroll cue — subtle, never hides content.
        gsap.to(scrollIndicatorRef.current?.querySelector(".scroll-dot"), {
          y: 14,
          opacity: 0.2,
          duration: 1.3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Gentle fade as the hero scrolls away. toggleActions reverses cleanly,
        // so scrolling back up restores full visibility. NOT pinned, NOT scrubbed.
        gsap.to(
          [titleRef.current, subtitleRef.current, accentRef.current],
          {
            opacity: 0,
            y: -40,
            duration: 0.6,
            ease: "power2.in",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "bottom 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => {
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black text-white"
    >
      {/* Corner brackets */}
      <div
        ref={(el) => (cornerRefs.current[0] = el)}
        className="absolute top-4 left-4 md:top-8 md:left-8 w-8 h-8 md:w-14 md:h-14 border-l border-t border-neutral-700"
      />
      <div
        ref={(el) => (cornerRefs.current[1] = el)}
        className="absolute top-4 right-4 md:top-8 md:right-8 w-8 h-8 md:w-14 md:h-14 border-r border-t border-neutral-700"
      />
      <div
        ref={(el) => (cornerRefs.current[2] = el)}
        className="absolute bottom-4 left-4 md:bottom-8 md:left-8 w-8 h-8 md:w-14 md:h-14 border-l border-b border-neutral-700"
      />
      <div
        ref={(el) => (cornerRefs.current[3] = el)}
        className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-8 h-8 md:w-14 md:h-14 border-r border-b border-neutral-700"
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 md:px-6 flex flex-col items-center">
        {/* Eyebrow */}
        <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-neutral-500 mb-5 md:mb-8">
          Portfolio
        </span>

        {/* Title — masked rise. Always plain white text. */}
        <h1
          className="font-black tracking-[-0.05em] leading-none overflow-hidden pb-[0.06em]"
          style={{
            fontSize: "clamp(3rem, 18vw, 16rem)",
            fontFamily: "Space Grotesk, sans-serif",
          }}
        >
          <span ref={titleRef} className="block text-white will-change-transform">
            NIHESH
          </span>
        </h1>

        {/* Emerald accent rule */}
        <div
          ref={accentRef}
          className="mt-6 md:mt-8 h-0.5 w-20 md:w-28 bg-emerald-500 origin-center"
        />

        {/* Subtitle — masked rise + fade. */}
        <div className="overflow-hidden mt-5 md:mt-7">
          <p
            ref={subtitleRef}
            className="font-mono text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.32em] text-neutral-400 will-change-transform"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            {JOB_TITLE}
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-neutral-500">
          Scroll
        </span>
        <div className="relative w-px h-10 md:h-12 bg-neutral-800 overflow-hidden">
          <div className="scroll-dot absolute top-0 left-0 w-px h-4 bg-emerald-500" />
        </div>
      </div>

      {/* Section number */}
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 font-mono text-[10px] md:text-xs text-neutral-600 tracking-widest">
        01 / 07
      </div>
    </section>
  );
}

export default ScrollHeroSection;
