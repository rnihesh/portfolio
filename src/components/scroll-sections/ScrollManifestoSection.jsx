import { useRef, useEffect } from "react";
import { gsap, BREAKPOINTS } from "../../utils/gsapConfig";

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
  {
    parts: [{ t: "Pixel", e: true }, { t: " perfect execution." }],
  },
];

/**
 * Manifesto — a clean editorial statement.
 *
 * Each line rises out of its own overflow-hidden mask once the section scrolls
 * into view (a single, reliable entrance, NOT a scrubbed per-line reveal that
 * can leave lines stuck hidden). The whole statement stays fully readable after.
 * Opaque white background, not pinned, so it never overlays a neighbor.
 */
function ScrollManifestoSection() {
  const sectionRef = useRef(null);
  const lineRefs = useRef([]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(BREAKPOINTS.reducedMotion, () => {
      gsap.set(lineRefs.current.filter(Boolean), { yPercent: 0, opacity: 1 });
      return () => {};
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const lines = lineRefs.current.filter(Boolean);
        gsap.set(lines, { yPercent: 115 });
        gsap.to(lines, {
          yPercent: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        });
      }, sectionRef);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full bg-white text-black flex flex-col justify-center px-6 md:px-16 py-24 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-10 md:mb-14">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-500">
            02 / Manifesto
          </span>
          <div className="h-px flex-1 bg-neutral-200" />
        </div>

        <h2
          className="font-bold tracking-tight leading-[1.08]"
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

        <div className="mt-12 md:mt-16 w-16 h-0.5 bg-emerald-500" />
      </div>

      <div className="absolute bottom-6 right-6 font-mono text-[10px] text-neutral-400 tracking-widest">
        02 / 07
      </div>
    </section>
  );
}

export default ScrollManifestoSection;
