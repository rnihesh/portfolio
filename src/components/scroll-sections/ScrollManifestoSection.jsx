import { useRef, useEffect, useState } from "react";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  DrawSVGPlugin,
  ScrambleTextPlugin,
  BREAKPOINTS,
  EASINGS,
  scrollVelocity,
} from "../../utils/gsapConfig";

/**
 * ScrollManifestoSection
 *
 * A big editorial typographic statement. The manifesto is pinned and walked
 * through on a scrubbed timeline: lines reveal via masked (overflow-hidden)
 * SplitText line-rises, emphasis words wipe in with a clip-path inset() cut,
 * and a DrawSVG underline strokes under the key phrase. A giant background
 * index parallaxes at depth, and a monospace readout scrambles its progress.
 */
function ScrollManifestoSection() {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const containerRef = useRef(null);
  const statementRef = useRef(null);
  const lineRefs = useRef([]);
  const emphasisRefs = useRef([]);
  const bgNumberRef = useRef(null);
  const underlineRef = useRef(null);
  const readoutRef = useRef(null);
  const kickerRef = useRef(null);
  const ruleRef = useRef(null);
  const [layout, setLayout] = useState("desktop");

  // The statement, broken into editorial lines. `emphasis` words get the
  // clip-path cut + (on the key line) the DrawSVG underline.
  const manifestoLines = [
    { text: "I build digital experiences", emphasis: [] },
    { text: "that merge", emphasis: ["form", "function"], between: "and", key: true },
    { text: "Clean code.", emphasis: ["Clean"] },
    { text: "Bold design.", emphasis: ["Bold"] },
    { text: "Pixel-perfect execution.", emphasis: [] },
  ];

  useEffect(() => {
    const mm = gsap.matchMedia();

    // ---- REDUCED MOTION: clean, fully-visible final state, no transforms ----
    mm.add(BREAKPOINTS.reducedMotion, () => {
      setLayout("mobile");
      const ctx = gsap.context(() => {
        gsap.set(".manifesto-line, .manifesto-emph, .manifesto-static-word", {
          opacity: 1,
          y: 0,
          yPercent: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          filter: "blur(0px)",
        });
        if (underlineRef.current) gsap.set(underlineRef.current, { drawSVG: "100%", opacity: 1 });
        if (bgNumberRef.current) gsap.set(bgNumberRef.current, { opacity: 0.05 });
        if (readoutRef.current) readoutRef.current.textContent = "100%";
        if (kickerRef.current) gsap.set(kickerRef.current, { opacity: 1 });
        if (ruleRef.current) gsap.set(ruleRef.current, { scaleX: 1 });
      }, sectionRef);
      return () => ctx.revert();
    });

    // ---- MOBILE + TABLET: lighter, non-pinned line-by-line reveal ----
    const lightBranch = () => {
      setLayout("mobile");
      let split = null;

      const ctx = gsap.context(() => {
        if (kickerRef.current) {
          gsap.from(kickerRef.current, {
            opacity: 0,
            y: 12,
            duration: 0.6,
            ease: EASINGS.cineOut,
            scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
          });
        }
        if (ruleRef.current) {
          gsap.fromTo(
            ruleRef.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.9,
              ease: EASINGS.cine,
              scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
            }
          );
        }

        // Masked line reveal per line (lines already sit in overflow-hidden wrappers)
        if (statementRef.current) {
          split = new SplitText(".manifesto-line", { type: "lines", linesClass: "m-line" });
          gsap.set(split.lines, { yPercent: 110 });
          split.lines.forEach((line) => {
            gsap.to(line, {
              yPercent: 0,
              duration: 0.9,
              ease: EASINGS.cineOut,
              scrollTrigger: { trigger: line, start: "top 88%", end: "top 55%", scrub: 0.6 },
            });
          });
        }

        // Emphasis words get an accent color cut as they enter
        emphasisRefs.current.forEach((el) => {
          if (!el) return;
          gsap.fromTo(
            el,
            { color: "#171717" },
            {
              color: "#10b981",
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 85%", end: "top 60%", scrub: true },
            }
          );
        });

        // DrawSVG underline under the key phrase
        if (underlineRef.current) {
          gsap.set(underlineRef.current, { drawSVG: "0%" });
          gsap.to(underlineRef.current, {
            drawSVG: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: underlineRef.current,
              start: "top 80%",
              end: "top 55%",
              scrub: 0.8,
            },
          });
        }

        // Background index parallax (light)
        if (bgNumberRef.current) {
          gsap.fromTo(
            bgNumberRef.current,
            { yPercent: -8, opacity: 0.03 },
            {
              yPercent: 8,
              opacity: 0.06,
              ease: "none",
              scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
            }
          );
        }

        // Scramble readout tied to section progress
        if (readoutRef.current) {
          const proxy = { v: 0 };
          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 40%",
            scrub: 0.5,
            onUpdate: (self) => {
              const next = Math.round(self.progress * 100);
              if (next !== proxy.v) {
                proxy.v = next;
                gsap.to(readoutRef.current, {
                  duration: 0.25,
                  scrambleText: { text: `${next}%`, chars: "0123456789", speed: 0.6 },
                });
              }
            },
          });
        }
      }, sectionRef);

      return () => {
        ctx.revert();
        if (split) split.revert();
      };
    };

    mm.add(BREAKPOINTS.mobile, lightBranch);
    mm.add(BREAKPOINTS.tablet, lightBranch);

    // ---- DESKTOP: pinned scrub that walks through the statement ----
    mm.add(BREAKPOINTS.desktop, () => {
      setLayout("desktop");
      let split = null;
      let velocityUnsub = null;

      const ctx = gsap.context(() => {
        requestAnimationFrame(() => {
          if (!pinRef.current || !statementRef.current) return;

          // Masked line reveal: split each line into its own line element,
          // each already nested in an overflow-hidden wrapper.
          split = new SplitText(".manifesto-line", { type: "lines", linesClass: "m-line" });
          gsap.set(split.lines, {
            yPercent: 115,
            willChange: "transform",
          });

          // Emphasis words start hidden behind a clip mask (cut wipe in later)
          gsap.set(".manifesto-emph", {
            clipPath: "inset(0% 100% 0% 0%)",
            color: "#10b981",
          });

          // Underline hidden until the key line lands
          if (underlineRef.current) gsap.set(underlineRef.current, { drawSVG: "0%", opacity: 1 });

          // Background index sits rotated/dim
          if (bgNumberRef.current) {
            gsap.set(bgNumberRef.current, { rotation: -6, opacity: 0 });
          }

          // ===== PINNED SCRUB TIMELINE =====
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pinRef.current,
              start: "top top",
              end: "+=320%",
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onEnter: () => statementRef.current && gsap.set(statementRef.current, { willChange: "transform" }),
              onLeave: () => statementRef.current && gsap.set(statementRef.current, { willChange: "auto" }),
              onEnterBack: () => statementRef.current && gsap.set(statementRef.current, { willChange: "transform" }),
              onLeaveBack: () => {
                statementRef.current && gsap.set(statementRef.current, { willChange: "auto" });
              },
            },
          });

          // Kicker label + rule draw in first
          if (kickerRef.current) {
            tl.fromTo(
              kickerRef.current,
              { opacity: 0, yPercent: 60 },
              { opacity: 1, yPercent: 0, duration: 0.4, ease: EASINGS.cut },
              0
            );
          }
          if (ruleRef.current) {
            tl.fromTo(
              ruleRef.current,
              { scaleX: 0 },
              { scaleX: 1, duration: 0.6, ease: EASINGS.cine },
              0.05
            );
          }

          // Background index rises from depth and parallaxes across the scene
          if (bgNumberRef.current) {
            tl.to(
              bgNumberRef.current,
              { opacity: 0.05, rotation: 0, duration: 0.5, ease: EASINGS.cineOut },
              0
            );
            tl.to(
              bgNumberRef.current,
              { yPercent: -14, rotation: 4, duration: 2.4, ease: "none" },
              0.3
            );
          }

          // Walk the lines in, one filmic rise at a time
          const lineCount = split.lines.length || 1;
          split.lines.forEach((line, i) => {
            const at = 0.25 + (i / lineCount) * 1.7;
            tl.to(
              line,
              { yPercent: 0, duration: 0.55, ease: EASINGS.cineOut },
              at
            );

            // As the next line rises, gently recede the prior lines (depth)
            if (i > 0) {
              tl.to(
                split.lines[i - 1],
                { opacity: 0.32, filter: "blur(1.5px)", duration: 0.5, ease: "power2.out" },
                at
              );
            }
          });

          // Emphasis words: hard clip-path "cut" wipe to accent, staggered
          const emph = gsap.utils.toArray(".manifesto-emph");
          emph.forEach((el, i) => {
            tl.to(
              el,
              { clipPath: "inset(0% 0% 0% 0%)", duration: 0.4, ease: EASINGS.cut },
              0.9 + i * 0.22
            );
          });

          // DrawSVG underline strokes under the key phrase right after its words land
          if (underlineRef.current) {
            tl.to(
              underlineRef.current,
              { drawSVG: "100%", duration: 0.7, ease: EASINGS.cine },
              1.5
            );
          }

          // Scramble readout: monospace progress counter driven by the same scrub
          if (readoutRef.current) {
            const proxy = { v: -1 };
            tl.scrollTrigger.vars.onUpdate = (self) => {
              const next = Math.round(self.progress * 100);
              if (next !== proxy.v) {
                proxy.v = next;
                gsap.to(readoutRef.current, {
                  duration: 0.3,
                  scrambleText: {
                    text: `${String(next).padStart(2, "0")}%`,
                    chars: "0123456789",
                    speed: 0.7,
                  },
                });
              }
            };
          }

          // Final beat: whole statement settles + lifts slightly as we exit
          tl.to(
            statementRef.current,
            { yPercent: -6, duration: 0.5, ease: "power2.inOut" },
            2.2
          );

          // Velocity-reactive skew on the statement for filmic momentum
          scrollVelocity.start();
          velocityUnsub = scrollVelocity.subscribe(() => {
            if (!statementRef.current) return;
            const v = scrollVelocity.getNormalizedVelocity(2400);
            const skew = v * 1.6 * Math.sign(scrollVelocity.velocity);
            gsap.to(statementRef.current, {
              skewY: skew,
              duration: 0.2,
              overwrite: "auto",
            });
          });

          ScrollTrigger.refresh();
        });
      }, sectionRef);

      return () => {
        ctx.revert();
        if (split) split.revert();
        if (velocityUnsub) velocityUnsub();
        scrollVelocity.stop();
      };
    });

    return () => {
      mm.revert();
      scrollVelocity.stop();
    };
  }, []);

  // Reset ref arrays each render so stale nodes don't linger
  lineRefs.current = [];
  emphasisRefs.current = [];
  let emphIndex = 0;

  // Render a single editorial line, wrapping emphasis words in accent spans
  // and masking the whole line in an overflow-hidden wrapper for the line-rise.
  const renderLine = (line, i) => {
    const { text, emphasis, between, key } = line;
    const words = text.split(" ");

    return (
      <div
        key={i}
        className="overflow-hidden"
        style={{ lineHeight: 0.95 }}
      >
        <span
          ref={(el) => (lineRefs.current[i] = el)}
          className="manifesto-line inline-block"
        >
          {words.map((word, wi) => {
            const bare = word.replace(/[.,]/g, "");
            const isEmph = emphasis.includes(bare);
            if (isEmph) {
              const idx = emphIndex++;
              return (
                <span key={wi} className="relative inline-block mr-[0.28em]">
                  <span
                    ref={(el) => (emphasisRefs.current[idx] = el)}
                    className="manifesto-emph inline-block text-emerald-500"
                  >
                    {word}
                  </span>
                  {/* DrawSVG underline only under the key line's first emphasis word group */}
                  {key && bare === "function" && (
                    <svg
                      className="absolute left-0 -bottom-[0.12em] w-full overflow-visible pointer-events-none"
                      height="14"
                      viewBox="0 0 200 14"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <path
                        ref={underlineRef}
                        d="M2 9 C 50 3, 150 3, 198 9"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </span>
              );
            }
            return (
              <span key={wi} className="manifesto-static-word inline-block mr-[0.28em]">
                {word}
              </span>
            );
          })}
          {between && (
            <span className="manifesto-static-word inline-block mr-[0.28em] text-neutral-500">
              {between}
            </span>
          )}
        </span>
      </div>
    );
  };

  // ===== MOBILE / TABLET / REDUCED-MOTION LAYOUT =====
  if (layout === "mobile") {
    return (
      <section ref={sectionRef} className="min-h-screen w-full bg-white text-black py-24 px-6 relative overflow-hidden">
        <div className="grid-pattern absolute inset-0 opacity-30" />

        {/* (ghost "02" removed) keep ref valid for GSAP */}
        <div ref={bgNumberRef} aria-hidden="true" className="hidden" />

        <div className="relative z-10 max-w-xl mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <span ref={kickerRef} className="font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-500">
              02 / Manifesto
            </span>
            <span ref={readoutRef} className="font-mono text-[11px] tracking-[0.2em] text-emerald-500 ml-auto">
              00%
            </span>
          </div>

          <div
            ref={ruleRef}
            className="w-full h-px bg-black/80 mb-10 origin-left"
            style={{ transform: "scaleX(0)" }}
          />

          <h2
            ref={statementRef}
            className="font-bold tracking-tight text-black leading-[0.98]"
            style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: "clamp(2rem, 9vw, 3.5rem)" }}
          >
            {manifestoLines.map((line, i) => renderLine(line, i))}
          </h2>

          <div className="mt-14 w-16 h-px bg-emerald-500" />
        </div>

        <div className="absolute bottom-5 right-6 font-mono text-[10px] text-neutral-400 tracking-widest">02 / 07</div>
      </section>
    );
  }

  // ===== DESKTOP LAYOUT (pinned scrub) =====
  return (
    <section ref={sectionRef} className="w-full bg-white text-black relative">
      <div ref={pinRef} className="h-screen w-full relative overflow-hidden flex items-center">
        <div className="grid-pattern absolute inset-0 opacity-40" />

        {/* (ghost "02" removed) keep ref valid for GSAP */}
        <div ref={bgNumberRef} aria-hidden="true" className="hidden" />

        {/* Corner labels */}
        <div className="absolute top-8 left-8 font-mono text-xs text-neutral-400 tracking-[0.2em]">
          MANIFESTO
        </div>
        <div className="absolute top-8 right-8 font-mono text-xs tracking-[0.2em] text-emerald-500">
          <span ref={readoutRef}>00%</span>
        </div>

        {/* Statement */}
        <div ref={containerRef} className="relative z-10 w-full max-w-6xl mx-auto px-10 lg:px-16">
          <div className="flex items-center gap-5 mb-10">
            <span
              ref={kickerRef}
              className="font-mono text-xs uppercase tracking-[0.35em] text-neutral-500"
              style={{ opacity: 0 }}
            >
              02 / Manifesto
            </span>
            <div
              ref={ruleRef}
              className="h-px flex-1 bg-black/70 origin-left"
              style={{ transform: "scaleX(0)" }}
            />
          </div>

          <h2
            ref={statementRef}
            className="font-bold tracking-[-0.02em] text-black"
            style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontSize: "clamp(2.5rem, 6.5vw, 6.5rem)",
              lineHeight: 0.98,
            }}
          >
            {manifestoLines.map((line, i) => renderLine(line, i))}
          </h2>
        </div>

        {/* Section number */}
        <div className="absolute bottom-8 right-8 font-mono text-xs text-neutral-500 tracking-widest">
          02 / 07
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-8 flex items-center gap-3">
          <div className="w-10 h-px bg-emerald-500" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-500">
            Scroll to read
          </span>
        </div>
      </div>
    </section>
  );
}

export default ScrollManifestoSection;
