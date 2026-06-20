import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger, BREAKPOINTS } from "../../utils/gsapConfig";

const EMERALD = "#10b981";

// The statement, as editorial lines. Emphasis words (e:true) render emerald.
const LINES = [
  { parts: [{ t: "I build digital experiences" }] },
  {
    parts: [
      { t: "that merge " },
      { t: "form", e: true },
      { t: " and " },
      { t: "function", e: true },
      { t: "." },
    ],
  },
  {
    parts: [
      { t: "Clean", e: true },
      { t: " code. " },
      { t: "Bold", e: true },
      { t: " design." },
    ],
  },
  { parts: [{ t: "Pixel", e: true }, { t: " perfect execution." }] },
];

/**
 * Manifesto — a clean editorial statement (section 02 / 07).
 *
 * The reveal is SCROLL-COUPLED (scrub) but only the vertical MASK position is
 * animated: each line rises out of its own overflow-hidden mask as the section
 * scrolls into proper view. Text is ALWAYS full opacity (no dim ramp that can
 * strand mid-scrub). It resolves before the section is centred and a settle
 * hard-locks the final state so it can never stay half-revealed. No pin, no
 * giant ghost number. Opaque white background.
 */
function ScrollManifestoSection() {
  const sectionRef = useRef(null);
  const statementRef = useRef(null);
  const lineRefs = useRef([]);
  const ruleRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(BREAKPOINTS.reducedMotion, () => {
      gsap.set(lineRefs.current.filter(Boolean), { yPercent: 0 });
      if (ruleRef.current) gsap.set(ruleRef.current, { scaleX: 1 });
      return () => {};
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const lines = lineRefs.current.filter(Boolean);
        // Masked, full opacity. Only the mask position moves.
        gsap.set(lines, { yPercent: 115 });
        if (ruleRef.current)
          gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: "left" });

        // TIME-BASED entrance: plays over ~1.2s when the section enters view,
        // so the effect is clearly visible the moment you land (not a frozen
        // scrub). Reverses when scrolled back above.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        });
        tl.to(
          lines,
          { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.14 },
          0
        );
        if (ruleRef.current)
          tl.to(
            ruleRef.current,
            { scaleX: 1, duration: 0.7, ease: "power2.out" },
            0.45
          );

        // Settle: once the section is in view, hard-lock fully revealed so a
        // fast flick can never leave a line stuck behind its mask.
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 40%",
          end: "bottom top",
          onEnter: () => gsap.set(lines, { yPercent: 0 }),
          onEnterBack: () => gsap.set(lines, { yPercent: 0 }),
        });

        // Gentle parallax drift on the whole statement (no opacity change).
        if (statementRef.current) {
          gsap.to(statementRef.current, {
            yPercent: -7,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });
        }
      }, sectionRef);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full bg-white text-black flex flex-col justify-center px-6 md:px-16 py-24 sticky top-0 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-10 md:mb-14">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-500">
            02 / Manifesto
          </span>
          <div className="h-px flex-1 bg-neutral-200" />
        </div>

        <h2
          ref={statementRef}
          className="font-bold tracking-tight leading-[1.08] text-black"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "clamp(2rem, 6.2vw, 4.75rem)",
          }}
        >
          {LINES.map((line, i) => (
            <span key={i} className="block overflow-hidden py-[0.04em]">
              <span
                ref={(el) => (lineRefs.current[i] = el)}
                className="block will-change-transform"
              >
                {line.parts.map((p, j) =>
                  p.e ? (
                    <span key={j} style={{ color: EMERALD }}>
                      {p.t}
                    </span>
                  ) : (
                    <span key={j}>{p.t}</span>
                  )
                )}
              </span>
            </span>
          ))}
        </h2>

        <div
          ref={ruleRef}
          className="mt-12 md:mt-16 h-0.5 w-24 bg-emerald-500 origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <div className="absolute bottom-6 right-6 font-mono text-[10px] text-neutral-400 tracking-widest">
        02 / 07
      </div>
    </section>
  );
}

export default ScrollManifestoSection;
