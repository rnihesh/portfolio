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
import { experience } from "../../data/experience";

const EMERALD = "#10b981";

/**
 * The Journey — the experience timeline, SCROLL-COUPLED edition.
 *
 * The previous pass used one-shot entrance tweens that froze after playing, so
 * scrolling THROUGH the section felt static. This rewrite makes the motion
 * continuously tied to scroll progress (GSAP ScrollTrigger scrub) so layers keep
 * moving the whole time the section is on screen:
 *
 *  - MULTI-LAYER PARALLAX with OBVIOUS speed deltas across the section scroll
 *    (start "top bottom" -> end "bottom top"): the faint background rules drift
 *    ~220px, the soft emerald band drifts ~ -160px the OTHER way, the giant
 *    heading x-drifts ~ -180px + scales + tracks letter-spacing, the foreground
 *    index chip flies ~ +260px. The card's logo (depth 1) and details (depth
 *    0.4) parallax in opposite directions by tens of percent so the card itself
 *    visibly re-composes as it passes.
 *  - SPINE: the emerald DrawSVG line + glow strand FILL tied to scroll progress
 *    (scrub) across the whole list, so the chronology draws AS you scroll.
 *  - NODES: scale/pop (3D back-ease) scrubbed as each chapter is REACHED, halo
 *    ring + connector DrawSVG on scrub. The node group is anchored on the shared
 *    --spine-x axis and is NEVER vertically parallaxed, so markers stay exactly
 *    centered on the spine line at all times.
 *  - DATES scramble in on enter; the mono index scrambles too.
 *
 * NO PIN: this is section 06 of 07 and Connect (07) MUST stay last, so the whole
 * thing flows. We only use scrub + scroll-into-view triggers that can never
 * change document flow or overlap a neighbour.
 *
 * RELIABILITY:
 *  - Opaque bg-neutral-50 root (page behind is pure black; the opaque bg is
 *    load-bearing, nothing shows through).
 *  - Every scrub reveal RESOLVES to opacity 1 / clip cleared / no residual
 *    transform, finishing ABOVE the viewport centre, and each card carries an
 *    onEnter safety that hard-sets the final visible state so content can NEVER
 *    strand hidden once the user is on it.
 *  - reducedMotion branch sets clean final visible states (drawSVG 100%,
 *    opacity 1, no transforms, clip cleared).
 *  - gsap.context + ctx.revert, mm.revert, SplitText.revert, magnetic cleanup,
 *    velocity unsubscribe on teardown; parallax props cleared on revert.
 */
function ScrollTimelineSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const headingWrapRef = useRef(null);
  const eyebrowRef = useRef(null);
  const eyebrowRuleRef = useRef(null);
  const indexRef = useRef(null);
  const indexChipRef = useRef(null);
  const spinePathRef = useRef(null);
  const spineGlowRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const parallaxBackRef = useRef(null);
  const parallaxMidRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    let titleSplitLines = null;
    let titleSplitChars = null;
    const magneticCleanups = [];
    let velocityUnsubscribe = null;

    const FINAL_VISIBLE = ".exp-card, .exp-node, .exp-connector, .exp-reveal";

    // -----------------------------------------------------------------
    // Reduced motion: everything fully visible, no transforms, clip clear,
    // spine drawn complete so the chronology still reads.
    // -----------------------------------------------------------------
    mm.add(BREAKPOINTS.reducedMotion, () => {
      const root = sectionRef.current;
      if (!root) return () => {};
      gsap.set(root.querySelectorAll(FINAL_VISIBLE), {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        clipPath: "inset(0 0% 0 0%)",
      });
      gsap.set(root.querySelectorAll(".exp-parallax"), { x: 0, y: 0 });
      if (headingWrapRef.current)
        gsap.set(headingWrapRef.current, {
          x: 0,
          y: 0,
          scale: 1,
          letterSpacing: "0em",
          opacity: 1,
        });
      if (indexChipRef.current)
        gsap.set(indexChipRef.current, { x: 0, y: 0, opacity: 1 });
      if (parallaxBackRef.current) gsap.set(parallaxBackRef.current, { y: 0 });
      if (parallaxMidRef.current) gsap.set(parallaxMidRef.current, { y: 0 });
      if (spinePathRef.current)
        gsap.set(spinePathRef.current, { drawSVG: "100%" });
      if (spineGlowRef.current)
        gsap.set(spineGlowRef.current, { drawSVG: "100%", opacity: 0.25 });
      gsap.set(root.querySelectorAll(".exp-halo"), { drawSVG: "100%" });
      if (eyebrowRuleRef.current)
        gsap.set(eyebrowRuleRef.current, { drawSVG: "100%" });
      return () => {};
    });

    // -----------------------------------------------------------------
    // Motion (no-preference): rich, layered, SCROLL-COUPLED. No pin.
    // -----------------------------------------------------------------
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        // Scale parallax deltas down a touch on small screens so nothing drifts
        // off-canvas, but keep them clearly visible.
        const K = isMobile ? 0.55 : 1;

        // Wait a frame so layout (and SplitText measurement) is settled.
        requestAnimationFrame(() => {
          // ===========================================================
          // HEADER (one-shot reveal on enter) — eyebrow rule DrawSVG, mono
          // index scramble, masked line + character reveal of the title.
          // ===========================================================
          const headerTl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          });

          if (eyebrowRuleRef.current) {
            headerTl.fromTo(
              eyebrowRuleRef.current,
              { drawSVG: "0%" },
              { drawSVG: "100%", duration: 0.9, ease: EASINGS.cineOut },
              0,
            );
          }
          if (eyebrowRef.current) {
            headerTl.from(
              eyebrowRef.current,
              { opacity: 0, x: -14, duration: 0.6, ease: EASINGS.cineOut },
              0,
            );
          }

          // Title: split into lines (masked) AND characters for a layered
          // cinematic reveal — lines rise out of their mask, chars settle.
          if (titleRef.current) {
            titleSplitLines = new SplitText(titleRef.current, {
              type: "lines",
              linesClass: "exp-title-line",
              mask: "lines",
            });
            titleSplitChars = new SplitText(titleSplitLines.lines, {
              type: "chars",
              charsClass: "exp-title-char",
            });

            headerTl.from(
              titleSplitLines.lines,
              {
                yPercent: 115,
                duration: 1,
                stagger: 0.12,
                ease: EASINGS.cine,
              },
              0.1,
            );
            headerTl.from(
              titleSplitChars.chars,
              {
                opacity: 0,
                yPercent: 40,
                rotateX: -55,
                transformOrigin: "50% 100% -20px",
                duration: 0.7,
                stagger: 0.018,
                ease: EASINGS.cineOut,
              },
              0.25,
            );
            // Hard safety: when the header scroll-trigger fires, guarantee the
            // title resolves fully visible regardless of timeline state.
            ScrollTrigger.create({
              trigger: sectionRef.current,
              start: "top 60%",
              once: true,
              onEnter: () => {
                if (titleSplitChars)
                  gsap.set(titleSplitChars.chars, {
                    opacity: 1,
                    yPercent: 0,
                    rotateX: 0,
                  });
                if (titleSplitLines)
                  gsap.set(titleSplitLines.lines, { yPercent: 0 });
              },
            });
          }

          // Mono index readout scrambles in.
          if (indexRef.current) {
            const finalIndex = indexRef.current.textContent;
            ScrollTrigger.create({
              trigger: sectionRef.current,
              start: "top 82%",
              once: true,
              onEnter: () => {
                gsap.to(indexRef.current, {
                  duration: 1.1,
                  ease: "none",
                  scrambleText: {
                    text: finalIndex,
                    chars: "0123456789/JOURNEY",
                    speed: 0.5,
                  },
                });
              },
            });
          }

          // ===========================================================
          // BACKGROUND PARALLAX — two faint layers move at CLEARLY different
          // scrub speeds, and in OPPOSITE directions, across the whole section
          // scroll. Deltas are big enough to read at a glance.
          //   back rules:  +220px down  (barely-there, slow, large travel)
          //   emerald band: -160px up   (counter-drift -> obvious depth)
          // ===========================================================
          if (parallaxBackRef.current) {
            gsap.fromTo(
              parallaxBackRef.current,
              { y: -110 * K },
              {
                y: 110 * K,
                ease: "none",
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.1,
                  invalidateOnRefresh: true,
                },
              },
            );
          }
          if (parallaxMidRef.current) {
            gsap.fromTo(
              parallaxMidRef.current,
              { y: 90 * K },
              {
                y: -90 * K,
                ease: "none",
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.7,
                  invalidateOnRefresh: true,
                },
              },
            );
          }

          // ===========================================================
          // HEADING (foreground) — SCRUB-LINKED transforms as the section
          // passes: it x-drifts a lot, scales, tracks letter-spacing and ramps
          // opacity continuously (NOT a one-shot). This is the "scrolling"
          // motion the owner was missing on the heading.
          //   x:  -180px drift   scale: 1.06 -> 0.94   tracking: -0.02em
          // ===========================================================
          if (headingWrapRef.current) {
            gsap.fromTo(
              headingWrapRef.current,
              {
                x: 60 * K,
                scale: 1.06,
                letterSpacing: "0.01em",
              },
              {
                x: -120 * K,
                scale: 0.94,
                letterSpacing: "-0.02em",
                ease: "none",
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: "top bottom",
                  end: "center top",
                  scrub: 1,
                  invalidateOnRefresh: true,
                },
              },
            );
          }

          // Foreground index chip flies the OTHER way + fades, fastest layer.
          if (indexChipRef.current) {
            gsap.fromTo(
              indexChipRef.current,
              { x: -70 * K, y: 30 * K },
              {
                x: 190 * K,
                y: -40 * K,
                ease: "none",
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: "top bottom",
                  end: "center top",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                },
              },
            );
          }

          // ===========================================================
          // SPINE — emerald line DrawSVG FILLS scrub-linked to scroll progress
          // through the entire cards container (NOT one-shot). A soft glow
          // strand draws alongside it (slower scrub) for depth. The spine
          // visibly grows downward AS you scroll the chapters.
          // ===========================================================
          if (spinePathRef.current && cardsContainerRef.current) {
            gsap.set(spinePathRef.current, { drawSVG: "0%" });
            gsap.to(spinePathRef.current, {
              drawSVG: "100%",
              ease: "none",
              scrollTrigger: {
                trigger: cardsContainerRef.current,
                start: "top 85%",
                end: "bottom 55%",
                scrub: 0.8,
                invalidateOnRefresh: true,
                // Safety: once the list is mostly past, lock the spine full.
                onLeave: () =>
                  gsap.set(spinePathRef.current, { drawSVG: "100%" }),
              },
            });
          }
          if (spineGlowRef.current && cardsContainerRef.current) {
            gsap.set(spineGlowRef.current, { drawSVG: "0%", opacity: 0.22 });
            gsap.to(spineGlowRef.current, {
              drawSVG: "100%",
              ease: "none",
              scrollTrigger: {
                trigger: cardsContainerRef.current,
                start: "top 85%",
                end: "bottom 55%",
                scrub: 1.6,
                invalidateOnRefresh: true,
                onLeave: () =>
                  gsap.set(spineGlowRef.current, { drawSVG: "100%" }),
              },
            });
          }

          // ===========================================================
          // CARDS — per chapter: node 3D pop (SCRUBBED as reached), halo draw,
          // connector DrawSVG, masked clip-wipe panel reveal (scrubbed), and
          // STRONG opposing parallax on the inner depth layers so the card
          // re-composes as it travels. Date scrambles in.
          // ===========================================================
          const cards = gsap.utils.toArray(".exp-card");
          cards.forEach((card, i) => {
            const node = card.querySelector(".exp-node");
            const halo = card.querySelector(".exp-halo");
            const connector = card.querySelector(".exp-connector");
            const panel = card.querySelector(".exp-panel");
            const reveal = card.querySelectorAll(".exp-reveal");
            const date = card.querySelector(".exp-date");
            const fromLeft = i % 2 === 0;
            const wipe = fromLeft ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";

            // --- Node: 3D back-ease pop SCRUBBED as the chapter is reached.
            //     Scrubbing (not one-shot) means it visibly pops bigger/settles
            //     as you scroll onto it, then holds. Anchored on the spine; we
            //     only scale/rotate it, never move it off --spine-x. ---------
            if (node) {
              gsap.set(node, { transformPerspective: 600 });
              gsap.fromTo(
                node,
                { scale: 0.2, rotateY: 120, opacity: 0 },
                {
                  scale: 1,
                  rotateY: 0,
                  opacity: 1,
                  ease: EASINGS.snappyStrong,
                  scrollTrigger: {
                    trigger: card,
                    start: "top 90%",
                    end: "top 62%",
                    scrub: 0.6,
                    invalidateOnRefresh: true,
                    onLeave: () =>
                      gsap.set(node, { scale: 1, rotateY: 0, opacity: 1 }),
                  },
                },
              );
            }

            // --- Halo ring draws around the node (scrubbed) ----------------
            if (halo) {
              gsap.fromTo(
                halo,
                { drawSVG: "0%" },
                {
                  drawSVG: "100%",
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 90%",
                    end: "top 64%",
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                    onLeave: () => gsap.set(halo, { drawSVG: "100%" }),
                  },
                },
              );
            }

            // --- Connector draws from spine out to the panel (scrubbed) -----
            if (connector) {
              gsap.fromTo(
                connector,
                { drawSVG: "0%" },
                {
                  drawSVG: "100%",
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 84%",
                    end: "top 66%",
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                    onLeave: () => gsap.set(connector, { drawSVG: "100%" }),
                  },
                },
              );
            }

            // --- Panel: masked clip-wipe + 3D rotateY settle, SCRUBBED so the
            //     wipe tracks scroll. Finishes ABOVE centre and is hard-locked
            //     visible by the safety trigger below. ----------------------
            if (panel) {
              gsap.set(panel, {
                transformPerspective: 1100,
                transformOrigin: fromLeft ? "left center" : "right center",
              });
              gsap.fromTo(
                panel,
                {
                  clipPath: wipe,
                  opacity: 0,
                  y: 80 * K,
                  rotateY: fromLeft ? -14 : 14,
                  scale: 0.95,
                },
                {
                  clipPath: "inset(0 0% 0 0%)",
                  opacity: 1,
                  y: 0,
                  rotateY: 0,
                  scale: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 90%",
                    end: "top 56%",
                    scrub: 1,
                    invalidateOnRefresh: true,
                  },
                },
              );
            }

            // --- Inner depth layers parallax at OPPOSING, OBVIOUS speeds so
            //     the card visibly re-composes as it passes. Logo (depth 1)
            //     travels ~ +130 -> -130px; details (depth 0.4) the other way.
            //     This runs across the FULL pass (top bottom -> bottom top), so
            //     it keeps moving the whole time the card is on screen. -------
            const parallaxLayers = card.querySelectorAll(".exp-parallax");
            parallaxLayers.forEach((layer) => {
              const depth = parseFloat(layer.dataset.depth || "0.5");
              const dir = layer.dataset.dir === "down" ? 1 : -1;
              const travel = 130 * depth * K;
              gsap.fromTo(
                layer,
                { y: -travel * dir },
                {
                  y: travel * dir,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                    invalidateOnRefresh: true,
                  },
                },
              );
            });

            // --- Content cascade: staggered masked rise (one-shot on enter).
            //     Finishes above centre; safety trigger guarantees the final
            //     opacity 1 / y 0 state. -------------------------------------
            if (reveal.length) {
              gsap.fromTo(
                reveal,
                { y: 34, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.85,
                  stagger: 0.07,
                  ease: EASINGS.cineOut,
                  scrollTrigger: {
                    trigger: card,
                    start: "top 82%",
                    toggleActions: "play none none reverse",
                  },
                },
              );
            }

            // --- Date scrambles in as a mono readout -----------------------
            if (date) {
              const finalDate = date.dataset.full || date.textContent;
              ScrollTrigger.create({
                trigger: card,
                start: "top 80%",
                once: true,
                onEnter: () => {
                  gsap.to(date, {
                    duration: 0.9,
                    ease: "none",
                    scrambleText: {
                      text: finalDate,
                      chars: "0123456789-",
                      speed: 0.7,
                    },
                  });
                },
              });
            }

            // --- HARD VISIBILITY SAFETY ------------------------------------
            // The moment a card is centred, everything in it is forced to its
            // final readable state. Nothing can ever stay hidden. (Parallax
            // layers are intentionally left moving — they read as alive and
            // never hide content.)
            ScrollTrigger.create({
              trigger: card,
              start: "top 52%",
              once: true,
              onEnter: () => {
                if (panel)
                  gsap.set(panel, {
                    clipPath: "inset(0 0% 0 0%)",
                    opacity: 1,
                    y: 0,
                    rotateY: 0,
                    scale: 1,
                  });
                if (reveal.length) gsap.set(reveal, { opacity: 1, y: 0 });
                if (node)
                  gsap.set(node, { scale: 1, rotateY: 0, opacity: 1 });
                if (connector) gsap.set(connector, { drawSVG: "100%" });
                if (halo) gsap.set(halo, { drawSVG: "100%" });
              },
            });
          });

          // ===========================================================
          // VELOCITY-REACTIVE SKEW — the cards container skews with scroll
          // velocity for that "alive" inertial feel (desktop only; skip on
          // mobile to keep it calm + performant).
          // ===========================================================
          if (!isMobile && cardsContainerRef.current) {
            scrollVelocity.start();
            velocityUnsubscribe = scrollVelocity.subscribe(() => {
              const nv = scrollVelocity.getNormalizedVelocity(1600);
              const skew = nv * 3 * Math.sign(scrollVelocity.velocity);
              gsap.to(cardsContainerRef.current, {
                skewY: skew,
                duration: 0.3,
                ease: "power1.out",
                overwrite: "auto",
              });
            });
          }

          // ===========================================================
          // MAGNETIC HOVER — node markers + CTAs pull toward the cursor.
          // ===========================================================
          if (!isMobile) {
            cards.forEach((card) => {
              const node = card.querySelector(".exp-node");
              if (node) {
                magneticCleanups.push(
                  applyMagneticEffect(node, {
                    strength: 0.45,
                    ease: 0.3,
                    resetEase: 0.6,
                    resetEaseType: "elastic.out(1, 0.4)",
                  }),
                );
              }
              card.querySelectorAll(".exp-magnetic").forEach((el) => {
                magneticCleanups.push(
                  applyMagneticEffect(el, {
                    strength: 0.28,
                    ease: 0.3,
                    resetEase: 0.55,
                    resetEaseType: "elastic.out(1, 0.45)",
                  }),
                );
              });
            });
          }

          ScrollTrigger.refresh();
        });
      }, sectionRef);

      return () => {
        ctx.revert();
        magneticCleanups.forEach((fn) => fn());
        magneticCleanups.length = 0;
        if (velocityUnsubscribe) velocityUnsubscribe();
        velocityUnsubscribe = null;
        scrollVelocity.stop();
        // Reset any leftover transforms on persistent containers so a re-mount
        // (or breakpoint flip) starts from a clean visible state.
        if (cardsContainerRef.current)
          gsap.set(cardsContainerRef.current, { skewY: 0 });
        if (headingWrapRef.current)
          gsap.set(headingWrapRef.current, {
            clearProps: "transform,letterSpacing",
          });
        if (indexChipRef.current)
          gsap.set(indexChipRef.current, { clearProps: "transform" });
        if (titleSplitChars) {
          titleSplitChars.revert();
          titleSplitChars = null;
        }
        if (titleSplitLines) {
          titleSplitLines.revert();
          titleSplitLines = null;
        }
      };
    });

    return () => {
      mm.revert();
      if (titleSplitChars) titleSplitChars.revert();
      if (titleSplitLines) titleSplitLines.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full bg-neutral-50 text-neutral-900 py-24 md:py-32 px-6 md:px-12 lg:px-16 relative overflow-hidden"
    >
      {/* OPAQUE backdrop guarantee + faint multi-layer parallax depth.
          These are monochrome, low-contrast and sit BEHIND content (z-0).
          No giant ghost words/numbers — just a hairline grid + a soft band. */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-neutral-200" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-neutral-200" />
        {/* deepest layer: faint horizontal rules (large slow parallax) */}
        <div
          ref={parallaxBackRef}
          className="exp-parallax-bg absolute inset-x-0 -top-40 bottom-[-10rem] opacity-[0.5]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0 119px, #e5e5e5 119px 120px)",
            willChange: "transform",
          }}
        />
        {/* mid layer: a single soft emerald wash band (counter-parallax) */}
        <div
          ref={parallaxMidRef}
          className="exp-parallax-mid absolute left-1/2 top-1/3 h-[60vh] w-[80vw] -translate-x-1/2 rounded-full opacity-[0.06]"
          style={{
            background: `radial-gradient(closest-side, ${EMERALD}, transparent 70%)`,
            willChange: "transform",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 md:mb-24 relative">
          <div className="flex items-center gap-4 md:gap-6 mb-7">
            <span
              ref={indexRef}
              className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400 tabular-nums"
            >
              06 / Journey
            </span>
            {/* DrawSVG eyebrow rule */}
            <span ref={eyebrowRef} className="flex-1">
              <svg
                className="block w-full h-px overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 100 1"
                aria-hidden="true"
              >
                <line
                  ref={eyebrowRuleRef}
                  x1="0"
                  y1="0.5"
                  x2="100"
                  y2="0.5"
                  stroke="#d4d4d4"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </span>
          </div>

          {/* Heading wrapper is the SCRUB-DRIVEN foreground layer (x-drift,
              scale, letter-spacing tracked to scroll). will-change for GPU. */}
          <div ref={headingWrapRef} style={{ willChange: "transform" }}>
            <h2
              ref={titleRef}
              className="font-bold tracking-tight leading-[1.05] text-neutral-900"
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "clamp(2.5rem, 7vw, 5rem)",
                perspective: "800px",
              }}
            >
              The Journey
            </h2>
            <p className="mt-5 md:mt-6 font-mono text-xs md:text-sm text-neutral-500 max-w-lg leading-relaxed">
              Building real products with real teams. One chapter at a time.
            </p>
          </div>

          {/* Foreground floating index chip — the FASTEST parallax layer, flies
              across as the section passes. Decorative, monochrome + emerald. */}
          <div
            ref={indexChipRef}
            aria-hidden="true"
            className="pointer-events-none absolute -top-2 right-0 hidden md:block font-mono text-[10px] uppercase tracking-[0.35em] text-emerald-600/70"
            style={{ willChange: "transform" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1.5 tabular-nums">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: EMERALD }}
              />
              scrolling the timeline
            </span>
          </div>
        </div>

        {/*
          Timeline: one shared vertical axis (--spine-x) keeps the drawn spine
          and every node centered on the exact same line at all breakpoints.
        */}
        <div
          ref={cardsContainerRef}
          className="relative [--spine-x:13px] md:[--spine-x:17px]"
          style={{ willChange: "transform" }}
        >
          {/*
            The spine. The wrapper is offset left by half its width so its
            center lands exactly on --spine-x. Centering uses `left` (not a
            transform) so nothing fights the offset.
          */}
          <div
            className="pointer-events-none absolute top-0 bottom-0 w-[6px]"
            style={{ left: "calc(var(--spine-x) - 3px)" }}
          >
            <svg
              className="h-full w-[6px] overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 6 1000"
            >
              {/* faint full-length track */}
              <line
                x1="3"
                y1="0"
                x2="3"
                y2="1000"
                stroke="#e5e5e5"
                strokeWidth="2"
              />
              {/* soft emerald glow strand (drawn alongside, low alpha) */}
              <line
                ref={spineGlowRef}
                x1="3"
                y1="0"
                x2="3"
                y2="1000"
                stroke={EMERALD}
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.22"
              />
              {/* the crisp emerald spine that draws on scroll */}
              <line
                ref={spinePathRef}
                x1="3"
                y1="0"
                x2="3"
                y2="1000"
                stroke={EMERALD}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="space-y-12 md:space-y-16">
            {experience.map((job, i) => {
              // Mono date: keep the literal final string for scramble.
              const dateText = job.period;
              return (
                <div key={i} className="exp-card relative pl-10 md:pl-16">
                  {/*
                    Node + connector + halo, centered on the shared --spine-x
                    axis. The group is anchored at --spine-x and shifted left by
                    half the node width so the NODE center sits exactly on the
                    spine line, while the connector extends to the right of it.
                    Node width: 14px (mobile) / 18px (md) -> half = 7px / 9px.

                    IMPORTANT: this group is NEVER vertically parallaxed, so the
                    marker always stays centered on the spine line.
                  */}
                  <div
                    className="absolute top-1.5 md:top-2.5 flex items-center -translate-x-[7px] md:-translate-x-[9px]"
                    style={{ left: "var(--spine-x)" }}
                  >
                    <span className="relative flex items-center justify-center">
                      {/* halo ring — DrawSVG draws around the node */}
                      <svg
                        className="absolute inset-0 m-auto w-7 h-7 md:w-9 md:h-9 overflow-visible"
                        viewBox="0 0 36 36"
                        aria-hidden="true"
                      >
                        <circle
                          className="exp-halo"
                          cx="18"
                          cy="18"
                          r="17"
                          fill="none"
                          stroke={EMERALD}
                          strokeWidth="1.5"
                          strokeOpacity="0.45"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="exp-node relative w-3.5 h-3.5 md:w-[18px] md:h-[18px] rounded-full bg-neutral-50 ring-2 ring-emerald-500 flex items-center justify-center cursor-pointer shadow-[0_0_0_4px_rgb(249,250,251)]">
                        <span
                          className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
                          style={{ backgroundColor: EMERALD }}
                        />
                      </span>
                    </span>
                    {/* connector line drawn from spine to panel */}
                    <svg
                      className="hidden md:block h-px overflow-visible"
                      width="44"
                      height="2"
                      viewBox="0 0 44 2"
                      preserveAspectRatio="none"
                    >
                      <line
                        className="exp-connector"
                        x1="0"
                        y1="1"
                        x2="44"
                        y2="1"
                        stroke="#d4d4d4"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>

                  {/* Entry panel (opaque) — clip-wipe + 3D settle on scrub */}
                  <div
                    className="exp-panel relative bg-white rounded-2xl border border-neutral-200/80"
                    style={{
                      boxShadow: "0 4px 24px -8px rgba(0,0,0,0.08)",
                      willChange: "transform, clip-path, opacity",
                    }}
                  >
                    <div className="p-6 md:p-9 lg:p-10">
                      <div className="flex flex-col md:flex-row gap-5 md:gap-8">
                        {/* Logo — own parallax depth layer (drifts UP). The
                            reveal (outer) and parallax (inner) are SEPARATE
                            elements so their y-writes never fight. */}
                        {job.logo && (
                          <div className="exp-reveal shrink-0">
                            <div
                              className="exp-parallax"
                              data-depth="1"
                              data-dir="up"
                              style={{ willChange: "transform" }}
                            >
                              <div className="w-14 h-14 md:w-[72px] md:h-[72px] rounded-2xl bg-neutral-50 border border-neutral-200 p-3 flex items-center justify-center">
                                <img
                                  src={job.logo}
                                  alt={job.company}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Details — parallax layer drifting the OTHER way */}
                        <div
                          className="exp-parallax flex-1 min-w-0"
                          data-depth="0.4"
                          data-dir="down"
                        >
                          <div className="exp-reveal flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                            <h3
                              className="text-2xl md:text-3xl font-bold text-neutral-900 tracking-tight"
                              style={{
                                fontFamily: "Space Grotesk, sans-serif",
                              }}
                            >
                              {job.company}
                            </h3>
                            <span
                              className="exp-date font-mono text-[10px] md:text-xs uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-full w-fit tabular-nums"
                              data-full={dateText}
                            >
                              {dateText}
                            </span>
                          </div>

                          <p className="exp-reveal text-base md:text-lg text-neutral-600 font-medium mb-4 md:mb-5">
                            {job.role}
                          </p>

                          <div className="exp-reveal w-12 h-px bg-neutral-300 mb-4 md:mb-5" />

                          <p className="exp-reveal text-sm md:text-base text-neutral-500 leading-relaxed mb-6 max-w-2xl">
                            {job.description}
                          </p>

                          {job.skills?.length > 0 && (
                            <div className="exp-reveal flex flex-wrap gap-2">
                              {job.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-3 py-1.5 text-xs font-mono bg-neutral-900 text-white rounded-lg hover:bg-emerald-500 transition-colors cursor-default"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 font-mono text-[10px] text-neutral-400 tracking-widest z-10">
        06 / 07
      </div>
    </section>
  );
}

export default ScrollTimelineSection;
