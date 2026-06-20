import { useRef, useEffect } from "react";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  DrawSVGPlugin,
  BREAKPOINTS,
  EASINGS,
  scrollVelocity,
} from "../../utils/gsapConfig";
import { applyMagneticEffect } from "../../hooks/useMagnetic";

const EMERALD = "#10b981";

// The statement, as editorial lines. Emphasis words (e:true) render emerald and
// get their own choreographed wipe/scale "cut" on top of the line reveal.
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
 * Manifesto — a cinematic editorial statement (position 02 / 07).
 *
 * Rich, layered GSAP, engineered to be bulletproof:
 *  - SplitText (char + line level) masked reveals, driven by a SINGLE scrub
 *    timeline as the section passes the viewport center.
 *  - Emphasis words wipe + scale in with the hard "cut" ease.
 *  - DrawSVG underline sweeps beneath a key phrase; a DrawSVG corner bracket
 *    and the bottom rule draw in too.
 *  - Multi-layer parallax DEPTH (eyebrow row, the statement, the mono readout
 *    and the index each scrub at different speeds + small rotateX/perspective).
 *  - ScrambleText mono progress readout tied to the same scrub (always resolves
 *    to "100 / READY").
 *  - scrollVelocity singleton -> velocity-reactive skew on the whole block.
 *  - Magnetic hover on the emphasis words.
 *
 * RELIABILITY: opaque white background. NOT pinned (it sits between Hero and
 * Skills, so a non-pin scrub cannot break page order or overlap a neighbor).
 * The reveal timeline is anchored so that by the time the section is centered
 * EVERYTHING has resolved to opacity 1 / no clip / drawSVG 100% / no transform,
 * and a hard onLeave/onEnterBack "settle" force-clears every final state so a
 * fast scroll or a refresh can never strand a line hidden. Reduced-motion sets
 * clean final visible states with no animation.
 */
function ScrollManifestoSection() {
  const sectionRef = useRef(null);
  const eyebrowRowRef = useRef(null);
  const eyebrowRuleRef = useRef(null);
  const statementRef = useRef(null);
  const headingRef = useRef(null);
  const underlineRef = useRef(null);
  const bracketRef = useRef(null);
  const readoutRef = useRef(null);
  const bottomRuleRef = useRef(null);
  const indexRef = useRef(null);
  const emphasisRefs = useRef([]);

  useEffect(() => {
    const mm = gsap.matchMedia();
    let charSplit = null;
    let lineSplits = [];
    let magneticCleanups = [];
    let velocityUnsubscribe = null;

    const revertSplits = () => {
      lineSplits.forEach((s) => s && s.revert());
      lineSplits = [];
      if (charSplit) {
        charSplit.revert();
        charSplit = null;
      }
    };

    // -----------------------------------------------------------------
    // Reduced motion: clean, fully visible final states. No transforms,
    // no clip, drawSVG complete. (No SplitText so nothing can strand.)
    // -----------------------------------------------------------------
    mm.add(BREAKPOINTS.reducedMotion, () => {
      const lineEls = sectionRef.current?.querySelectorAll(".mf-line");
      gsap.set(
        [
          eyebrowRowRef.current,
          statementRef.current,
          readoutRef.current,
          indexRef.current,
        ].filter(Boolean),
        { opacity: 1, x: 0, y: 0, rotateX: 0, skewY: 0, clipPath: "none" },
      );
      if (lineEls)
        gsap.set(lineEls, { yPercent: 0, opacity: 1, clipPath: "none" });
      gsap.set(emphasisRefs.current.filter(Boolean), {
        opacity: 1,
        scaleX: 1,
        clipPath: "inset(0 0% 0 0%)",
      });
      if (eyebrowRuleRef.current)
        gsap.set(eyebrowRuleRef.current, { scaleX: 1, opacity: 1 });
      [underlineRef.current, bracketRef.current, bottomRuleRef.current]
        .filter(Boolean)
        .forEach((el) => gsap.set(el, { drawSVG: "100%", opacity: 1 }));
      if (readoutRef.current) readoutRef.current.textContent = "100 / READY";
      return () => {};
    });

    // -----------------------------------------------------------------
    // Motion (no-preference): one rich, scrubbed-without-pin scene.
    // -----------------------------------------------------------------
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        // Wait a frame so layout + fonts settle before SplitText measures.
        requestAnimationFrame(() => {
          const heading = headingRef.current;
          if (!heading) return;

          const lineEls = gsap.utils.toArray(".mf-line");
          const emphasis = emphasisRefs.current.filter(Boolean);

          // --- SplitText: per-line MASK (so lines rise out of overflow) + a
          //     per-character split of the FIRST line for a finer cut. Both
          //     resolve to fully visible; emphasis spans are excluded from the
          //     char split so their color/structure stays intact. ---
          lineSplits = lineEls.map(
            (el) =>
              new SplitText(el, {
                type: "lines",
                linesClass: "mf-line-inner",
                mask: "lines",
              }),
          );
          const firstInner = lineEls[0]?.querySelector(".mf-line-inner");
          if (firstInner) {
            charSplit = new SplitText(firstInner, {
              type: "chars",
              charsClass: "mf-char",
            });
          }

          // ---- Initial hidden states (everything ends visible below) ----
          lineSplits.forEach((s) => gsap.set(s.lines, { yPercent: 118 }));
          if (charSplit)
            gsap.set(charSplit.chars, { yPercent: 110, opacity: 0 });
          gsap.set(emphasis, {
            clipPath: "inset(0 100% 0 0)",
            scaleX: 1.18,
            opacity: 0,
            transformOrigin: "left center",
          });
          if (eyebrowRuleRef.current)
            gsap.set(eyebrowRuleRef.current, { scaleX: 0, opacity: 1 });
          [underlineRef.current, bracketRef.current, bottomRuleRef.current]
            .filter(Boolean)
            .forEach((el) => gsap.set(el, { drawSVG: "0%" }));
          gsap.set(eyebrowRowRef.current, { opacity: 0, y: 18 });
          gsap.set(indexRef.current, { opacity: 0, y: 16 });

          // ============================================================
          // ONE scrubbed timeline across the section (no pin). It is fully
          // resolved well before the section centers, then a settle handler
          // hard-locks final states so nothing can ever be stranded hidden.
          // ============================================================
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 82%",
              end: "top 30%",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          // 0) eyebrow row + its rule draw/scale in
          tl.to(eyebrowRowRef.current, { opacity: 1, y: 0 }, 0);
          if (eyebrowRuleRef.current)
            tl.to(eyebrowRuleRef.current, { scaleX: 1 }, 0);
          if (bracketRef.current)
            tl.to(bracketRef.current, { drawSVG: "100%" }, 0);

          // 1) first line: char cut, then the remaining lines mask up.
          if (charSplit) {
            tl.to(
              charSplit.chars,
              {
                yPercent: 0,
                opacity: 1,
                stagger: { each: 0.012, from: "start" },
              },
              0.05,
            );
          }
          tl.to(
            lineSplits[0].lines,
            { yPercent: 0, stagger: 0.04 },
            0.05,
          );
          for (let i = 1; i < lineSplits.length; i++) {
            tl.to(
              lineSplits[i].lines,
              { yPercent: 0, stagger: 0.05, ease: EASINGS.cineOut },
              0.18 + i * 0.12,
            );
          }

          // 2) emphasis words wipe + scale in on the hard "cut" ease.
          tl.to(
            emphasis,
            {
              clipPath: "inset(0 0% 0 0%)",
              scaleX: 1,
              opacity: 1,
              stagger: 0.06,
              ease: EASINGS.cut,
            },
            0.4,
          );

          // 3) DrawSVG underline sweeps under the key phrase.
          if (underlineRef.current)
            tl.to(underlineRef.current, { drawSVG: "100%" }, 0.62);

          // 4) mono progress readout scrambles up, index + bottom rule resolve.
          if (readoutRef.current)
            tl.to(
              readoutRef.current,
              {
                scrambleText: {
                  text: "100 / READY",
                  chars: "0123456789/ABCDEFREADY",
                  speed: 0.7,
                },
              },
              0.55,
            );
          tl.to(indexRef.current, { opacity: 1, y: 0 }, 0.7);
          if (bottomRuleRef.current)
            tl.to(bottomRuleRef.current, { drawSVG: "100%" }, 0.7);

          // ---- Multi-layer PARALLAX depth (separate scrub, slower, with a
          //      touch of rotateX so the block reads as physically layered).
          //      Each layer travels a different distance/speed. ----
          gsap.fromTo(
            statementRef.current,
            { yPercent: 7, rotateX: 4 },
            {
              yPercent: -6,
              rotateX: 0,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
          gsap.fromTo(
            eyebrowRowRef.current,
            { yPercent: 18 },
            {
              yPercent: -16,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.4,
              },
            },
          );
          gsap.fromTo(
            readoutRef.current,
            { yPercent: 28 },
            {
              yPercent: -22,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 2,
              },
            },
          );
          gsap.fromTo(
            indexRef.current,
            { yPercent: 40 },
            {
              yPercent: -30,
              ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 2.4,
              },
            },
          );

          // ---- SETTLE GUARD: the instant the reveal scrub completes (or the
          //      section leaves / re-enters), force EVERYTHING to its final,
          //      fully readable state. This is the safety net against a fast
          //      flick or a refresh stranding a masked line. ----
          const settle = () => {
            lineSplits.forEach((s) => gsap.set(s.lines, { yPercent: 0 }));
            if (charSplit)
              gsap.set(charSplit.chars, { yPercent: 0, opacity: 1 });
            gsap.set(emphasis, {
              clipPath: "inset(0 0% 0 0%)",
              scaleX: 1,
              opacity: 1,
            });
            gsap.set(
              [eyebrowRowRef.current, indexRef.current].filter(Boolean),
              { opacity: 1, y: 0 },
            );
            if (eyebrowRuleRef.current)
              gsap.set(eyebrowRuleRef.current, { scaleX: 1 });
            [
              underlineRef.current,
              bracketRef.current,
              bottomRuleRef.current,
            ]
              .filter(Boolean)
              .forEach((el) => gsap.set(el, { drawSVG: "100%" }));
            if (readoutRef.current)
              readoutRef.current.textContent = "100 / READY";
          };

          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 30%",
            end: "bottom top",
            onEnter: settle, // scrolled to / past the resolve point
            onEnterBack: settle, // scrolled back up into the section
          });

          // ---- Velocity-reactive skew on the whole statement block ----
          scrollVelocity.start();
          velocityUnsubscribe = scrollVelocity.subscribe(() => {
            const n = scrollVelocity.getNormalizedVelocity(1600);
            const skew = n * 2.2 * Math.sign(scrollVelocity.velocity);
            if (statementRef.current) {
              gsap.to(statementRef.current, {
                skewY: skew,
                duration: 0.25,
                ease: "power1.out",
                overwrite: "auto",
              });
            }
          });

          // ---- Magnetic hover on emphasis words (desktop pointers) ----
          if (window.matchMedia("(pointer: fine)").matches) {
            emphasis.forEach((el) => {
              el.style.display = "inline-block";
              el.style.willChange = "transform";
              const cleanup = applyMagneticEffect(el, {
                strength: 0.4,
                ease: 0.3,
                resetEase: 0.6,
                resetEaseType: "elastic.out(1, 0.4)",
              });
              magneticCleanups.push(cleanup);
            });
          }

          ScrollTrigger.refresh();
        });
      }, sectionRef);

      return () => {
        ctx.revert();
        magneticCleanups.forEach((fn) => fn());
        magneticCleanups = [];
        if (velocityUnsubscribe) velocityUnsubscribe();
        scrollVelocity.stop();
        revertSplits();
      };
    });

    return () => {
      mm.revert();
      revertSplits();
    };
  }, []);

  // Render the statement with emphasis-word refs collected in document order.
  let emphasisIndex = 0;

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full bg-white text-black flex flex-col justify-center px-6 md:px-16 py-24 relative overflow-hidden"
    >
      <div
        className="max-w-5xl mx-auto w-full relative"
        style={{ perspective: "1200px" }}
      >
        {/* Eyebrow row: index + DrawSVG corner bracket + drawn rule */}
        <div
          ref={eyebrowRowRef}
          className="flex items-center gap-4 mb-10 md:mb-14 will-change-transform"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            className="shrink-0 text-emerald-500"
            aria-hidden="true"
          >
            <path
              ref={bracketRef}
              d="M21 1 H1 V21"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neutral-500">
            02 / Manifesto
          </span>
          <div
            ref={eyebrowRuleRef}
            className="h-px flex-1 bg-neutral-200 origin-left"
          />
        </div>

        {/* The statement */}
        <div
          ref={statementRef}
          className="relative will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          <h2
            ref={headingRef}
            className="font-bold tracking-tight leading-[1.08]"
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "clamp(2rem, 6.2vw, 4.75rem)",
            }}
          >
            {LINES.map((line, i) => (
              <span key={i} className="mf-line block py-[0.04em]">
                {line.parts.map((p, j) => {
                  if (!p.e) return <span key={j}>{p.t}</span>;
                  const idx = emphasisIndex++;
                  return (
                    <span
                      key={j}
                      ref={(el) => (emphasisRefs.current[idx] = el)}
                      className="mf-emphasis"
                      style={{ color: EMERALD }}
                    >
                      {p.t}
                    </span>
                  );
                })}
              </span>
            ))}
          </h2>

          {/* DrawSVG underline under the key phrase (whole statement width). */}
          <svg
            className="absolute -bottom-3 left-0 w-full h-2 pointer-events-none overflow-visible"
            viewBox="0 0 600 8"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              ref={underlineRef}
              d="M2 5 C 150 1, 450 1, 598 5"
              fill="none"
              stroke={EMERALD}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Bottom row: mono readout + drawn rule + index */}
        <div className="mt-16 md:mt-20 flex items-center gap-5">
          <span
            ref={readoutRef}
            className="font-mono text-[11px] md:text-xs uppercase tracking-[0.22em] text-emerald-600 will-change-transform"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            000 / INIT
          </span>
          <svg
            className="flex-1 h-px overflow-visible"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              ref={bottomRuleRef}
              x1="0"
              y1="0.5"
              x2="100%"
              y2="0.5"
              stroke="currentColor"
              className="text-neutral-300"
              strokeWidth="1"
            />
          </svg>
          <span
            ref={indexRef}
            className="font-mono text-[10px] tracking-widest text-neutral-400 will-change-transform"
          >
            02 / 07
          </span>
        </div>
      </div>
    </section>
  );
}

export default ScrollManifestoSection;
