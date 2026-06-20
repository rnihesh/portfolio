import { useRef, useEffect } from "react";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  Flip,
  DrawSVGPlugin,
  ScrambleTextPlugin,
  BREAKPOINTS,
  EASINGS,
  scrollVelocity,
} from "../../utils/gsapConfig";
import { applyMagneticEffect } from "../../hooks/useMagnetic";
import { JOB_TITLE } from "../../data/identity";

const EMERALD = "#10b981";

/**
 * Hero — the opening showstopper, now a PINNED SCRUB scene.
 *
 * The owner's note was that the screens "looked static": entrance animations
 * fired once and then froze, so scrolling THROUGH the hero showed no motion.
 * This rebuild makes the hero scroll-COUPLED: you scroll THROUGH a held
 * cinematic moment and every layer moves continuously, tied to scroll progress.
 *
 * STRUCTURE
 *  - ENTER (one-shot, on first reveal): SplitText per-character MASKED rise on
 *    NIHESH (always plain white, no bg-clip), eyebrow tighten, emerald DrawSVG
 *    accent + connectors stroke in, subtitle masked rise, Flip settle on the
 *    readout row, ScrambleText on the mono readouts. This guarantees the
 *    content actually appears.
 *  - PINNED SCRUB (the "scroll through" moment): the section is PINNED and a
 *    multi-beat scrubbed timeline runs across +=190% of scroll. Bold, obvious,
 *    scroll-coupled motion:
 *      * NIHESH scales UP (1 -> ~1.34), letter-spacing WIDENS (-0.05em ->
 *        +0.06em), and drifts on a parallax x-path (about +90px) — clearly
 *        readable the whole time.
 *      * The emerald DrawSVG accent + connectors RE-DRAW on scroll (scrub) and
 *        slide on their own faster parallax layer (about -160px x split).
 *      * The subtitle + readout row counter-parallax at a different speed
 *        (yPercent about -70, x about +60).
 *      * The background grid parallaxes DEEP and SLOW (yPercent about +26,
 *        scale 1 -> 1.18) so the depth delta versus the heading is obvious.
 *      * The corner frame eases outward as you progress.
 *      * Near the end the wordmark DEPARTS in 3D (rotateX, z push, fade) so the
 *        held moment resolves cleanly into the next section.
 *    All of the above are SCRUBBED beats on one timeline => they progress as
 *    you scroll, never one-shot.
 *  - Velocity-reactive skew (scrollVelocity) shears the stage with scroll speed.
 *
 * RELIABILITY (non-negotiable):
 *  - OPAQUE full-viewport black background on the pinned section root.
 *  - pin: true, pinSpacing: true, anticipatePin: 1, invalidateOnRefresh: true.
 *  - Content is FULLY visible and readable for the whole held scene; the only
 *    fade-to-hidden happens in the final ~18% beat (the 3D depart), which
 *    resolves cleanly as the pin releases. A `settle` set guarantees the
 *    entrance never strands an element hidden.
 *  - reducedMotion branch: clean fully-visible final states, NO pin, NO motion.
 *  - Monochrome + single emerald (#10b981). No glass / purple / sparkle.
 *  - gsap.context/ctx.revert + mm.revert teardown; SplitText reverted; velocity
 *    unsubscribed. Magnetic hover lives on the inner <h1> (the scrub owns the
 *    OUTER wrapper transforms) so the two never fight over the same property.
 */
function ScrollHeroSection() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null); // velocity-skew wrapper
  const eyebrowRef = useRef(null);
  const readoutRowRef = useRef(null);
  const coordRef = useRef(null);
  const statusRef = useRef(null);
  const titleRef = useRef(null); // <h1> — magnetic hover target
  const titleWrapRef = useRef(null); // scrub parallax owner (scale/spacing/x)
  const titleDepthRef = useRef(null); // 3D depart owner (rotateX/z/opacity)
  const accentLayerRef = useRef(null); // emerald svg parallax layer
  const accentPathRef = useRef(null);
  const baselinePathRef = useRef(null);
  const connectorLeftRef = useRef(null);
  const connectorRightRef = useRef(null);
  const subtitleRef = useRef(null);
  const subLayerRef = useRef(null); // subtitle + readouts parallax layer
  const scrollIndicatorRef = useRef(null);
  const gridRef = useRef(null);
  const frameRef = useRef(null);
  const cornerRefs = useRef([]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // -----------------------------------------------------------------
    // Reduced motion — clean, fully visible final states. No pin, no anim.
    // -----------------------------------------------------------------
    mm.add(BREAKPOINTS.reducedMotion, () => {
      const corners = cornerRefs.current.filter(Boolean);
      gsap.set(
        [
          stageRef.current,
          titleRef.current,
          titleWrapRef.current,
          titleDepthRef.current,
          subtitleRef.current,
          subLayerRef.current,
          accentLayerRef.current,
          eyebrowRef.current,
          readoutRowRef.current,
          gridRef.current,
          frameRef.current,
        ],
        {
          opacity: 1,
          x: 0,
          y: 0,
          xPercent: 0,
          yPercent: 0,
          z: 0,
          scale: 1,
          rotateX: 0,
          skewY: 0,
          letterSpacing: "-0.05em",
          clearProps: "filter",
        }
      );
      gsap.set(titleRef.current, { letterSpacing: "-0.05em" });
      gsap.set(scrollIndicatorRef.current, { opacity: 1, y: 0 });
      gsap.set(corners, { opacity: 0.45, scale: 1, x: 0, y: 0 });
      gsap.set(
        [
          accentPathRef.current,
          baselinePathRef.current,
          connectorLeftRef.current,
          connectorRightRef.current,
        ],
        { drawSVG: "100%", opacity: 1 }
      );
      return () => {};
    });

    // -----------------------------------------------------------------
    // Motion — desktop = full arsenal (magnetic + heavier 3D depth),
    // mobile/tablet = reduced weight. BOTH pin + scrub the same scene.
    // -----------------------------------------------------------------
    const build = (isDesktop) => {
      let splits = [];
      let magneticCleanup = () => {};
      let velocityUnsub = () => {};
      let velocityQuickTo = null;

      const ctx = gsap.context(() => {
        const corners = cornerRefs.current.filter(Boolean);

        // ---- SplitText: NIHESH per-character masked rise ----------------
        const titleSplit = new SplitText(titleRef.current, {
          type: "chars",
          mask: "chars",
          charsClass: "hero-char",
        });
        splits.push(titleSplit);

        // ---- SplitText: subtitle line + char masked reveal --------------
        const subSplit = new SplitText(subtitleRef.current, {
          type: "lines,chars",
          mask: "lines",
          linesClass: "hero-sub-line",
        });
        splits.push(subSplit);

        // ---- Initial hidden states (everything ready to resolve) --------
        gsap.set(titleSplit.chars, {
          yPercent: 120,
          rotateX: -55,
          z: -60,
          transformOrigin: "50% 100% -20px",
        });
        gsap.set(subSplit.chars, { yPercent: 110, opacity: 0 });
        gsap.set(eyebrowRef.current, {
          opacity: 0,
          y: 14,
          letterSpacing: "0.6em",
        });
        gsap.set(readoutRowRef.current, { opacity: 0, y: 10 });
        gsap.set(scrollIndicatorRef.current, { opacity: 0, y: 18 });
        gsap.set(corners, { opacity: 0, scale: 0.85 });
        gsap.set(gridRef.current, { opacity: 0, scale: 1.08 });
        gsap.set(
          [
            accentPathRef.current,
            baselinePathRef.current,
            connectorLeftRef.current,
            connectorRightRef.current,
          ],
          { drawSVG: "0%" }
        );

        // ---- Flip: capture the readout row's resting state, nudge it,
        // then Flip back in for an organic settle (always ends at the
        // natural layout = fully visible). -------------------------------
        const flipState = Flip.getState(readoutRowRef.current);
        gsap.set(readoutRowRef.current, { xPercent: -6 });

        // ================================================================
        // ENTRANCE — one-shot, plays on first reveal, ALWAYS resolves.
        // ================================================================
        const tl = gsap.timeline({ delay: 0.12 });

        tl.to(
          gridRef.current,
          { opacity: 1, scale: 1, duration: 1.6, ease: EASINGS.cine },
          0
        );

        tl.to(
          corners,
          {
            opacity: 0.45,
            scale: 1,
            duration: 0.7,
            stagger: 0.07,
            ease: EASINGS.cineOut,
          },
          0.05
        );

        tl.to(
          eyebrowRef.current,
          {
            opacity: 1,
            y: 0,
            letterSpacing: "0.35em",
            duration: 0.9,
            ease: EASINGS.cineOut,
          },
          0.15
        );

        // NIHESH — masked per-char rise with 3D depth.
        tl.to(
          titleSplit.chars,
          {
            yPercent: 0,
            rotateX: 0,
            z: 0,
            duration: 1.15,
            ease: EASINGS.cineOut,
            stagger: { each: 0.055, from: "start" },
          },
          0.28
        );

        tl.to(
          accentPathRef.current,
          { drawSVG: "100%", duration: 0.8, ease: EASINGS.cine },
          0.78
        );

        tl.to(
          [connectorLeftRef.current, connectorRightRef.current],
          { drawSVG: "100%", duration: 0.9, ease: EASINGS.cine },
          0.82
        );

        tl.to(
          subSplit.chars,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            ease: EASINGS.cineOut,
            stagger: 0.018,
          },
          0.9
        );

        tl.to(
          baselinePathRef.current,
          { drawSVG: "100%", duration: 1.1, ease: EASINGS.cine },
          0.95
        );

        tl.add(() => {
          Flip.from(flipState, {
            duration: 0.7,
            ease: EASINGS.cineOut,
            absolute: false,
          });
        }, 1.0);
        tl.to(
          readoutRowRef.current,
          { opacity: 1, y: 0, duration: 0.6, ease: EASINGS.cineOut },
          1.0
        );

        tl.to(
          coordRef.current,
          {
            duration: 1.1,
            ease: "none",
            scrambleText: {
              text: "12.97N / 77.59E",
              chars: "upperAndLowerCase",
              speed: 0.9,
              revealDelay: 0.1,
            },
          },
          1.05
        );
        tl.to(
          statusRef.current,
          {
            duration: 1.0,
            ease: "none",
            scrambleText: {
              text: "AVAILABLE",
              chars: "01",
              speed: 1,
            },
          },
          1.15
        );

        tl.to(
          scrollIndicatorRef.current,
          { opacity: 1, y: 0, duration: 0.7, ease: EASINGS.cineOut },
          1.25
        );

        // SETTLE — guarantees nothing strands hidden if the entrance is
        // interrupted (e.g. fast scroll). Forces full, readable final state.
        tl.add(() => {
          gsap.set(
            [eyebrowRef.current, readoutRowRef.current, subtitleRef.current],
            { opacity: 1, y: 0 }
          );
          gsap.set(titleSplit.chars, { yPercent: 0, rotateX: 0, z: 0 });
          gsap.set(subSplit.chars, { yPercent: 0, opacity: 1 });
          gsap.set(
            [
              accentPathRef.current,
              baselinePathRef.current,
              connectorLeftRef.current,
              connectorRightRef.current,
            ],
            { drawSVG: "100%" }
          );
        }, ">-0.05");

        // Looping scroll-cue dot — decorative, never hides content.
        const dot = scrollIndicatorRef.current?.querySelector(".scroll-dot");
        if (dot) {
          gsap.fromTo(
            dot,
            { yPercent: -100, opacity: 0 },
            {
              yPercent: 250,
              opacity: 1,
              duration: 1.5,
              repeat: -1,
              ease: "power1.inOut",
              repeatDelay: 0.15,
            }
          );
        }

        // ================================================================
        // VELOCITY-REACTIVE SKEW — the stage shears slightly with scroll
        // speed, then eases home. Skew only, never opacity.
        // ================================================================
        velocityQuickTo = gsap.quickTo(stageRef.current, "skewY", {
          duration: 0.4,
          ease: "power3.out",
        });
        scrollVelocity.start();
        velocityUnsub = scrollVelocity.subscribe((v) => {
          const skew = gsap.utils.clamp(-5, 5, v * 0.01);
          if (velocityQuickTo) velocityQuickTo(skew);
        });

        // ================================================================
        // PINNED SCRUB SCENE — you scroll THROUGH the hero.
        // OPAQUE bg + pinSpacing:true + anticipatePin:1 + invalidateOnRefresh.
        // One scrubbed timeline; every beat progresses with scroll, so the
        // motion is continuously scroll-COUPLED, not one-shot.
        // ================================================================
        const scrub = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: isDesktop ? "+=190%" : "+=150%",
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // --- BACKGROUND GRID: deep + slow parallax (the slow reference) ---
        // Drifts DOWN while everything else lifts => obvious depth split.
        scrub.fromTo(
          gridRef.current,
          { yPercent: 0, scale: 1 },
          { yPercent: 26, scale: 1.18, ease: "none" },
          0
        );

        // --- CORNER FRAME: eases outward (mid-slow) ----------------------
        scrub.fromTo(
          frameRef.current,
          { yPercent: 0, scale: 1 },
          { yPercent: -8, scale: 1.06, ease: "none" },
          0
        );
        scrub.to(corners[0], { x: -34, y: -34 }, 0);
        scrub.to(corners[1], { x: 34, y: -34 }, 0);
        scrub.to(corners[2], { x: -34, y: 34 }, 0);
        scrub.to(corners[3], { x: 34, y: 34 }, 0);

        // --- NIHESH WORDMARK: the headline scrolls THROUGH a held grow ---
        // Big, obvious: scales up, letter-spacing widens, drifts right.
        scrub.fromTo(
          titleWrapRef.current,
          { scale: 1, xPercent: 0, yPercent: 0 },
          {
            scale: isDesktop ? 1.34 : 1.18,
            xPercent: isDesktop ? 6 : 3, // ~ +90px drift on desktop
            yPercent: -6,
            ease: "none",
          },
          0
        );
        // Letter-spacing widens on the inner <h1> as you scroll.
        scrub.fromTo(
          titleRef.current,
          { letterSpacing: "-0.05em" },
          { letterSpacing: "0.06em", ease: "none" },
          0
        );

        // --- EMERALD ACCENT LAYER: faster parallax + scrub RE-DRAW -------
        // Moves UP faster than the heading; the connectors re-draw as you go.
        scrub.fromTo(
          accentLayerRef.current,
          { yPercent: 0, xPercent: 0 },
          { yPercent: -56, xPercent: isDesktop ? -8 : -4, ease: "none" },
          0
        );
        // Connectors visibly redraw with scroll (tie DrawSVG to progress).
        scrub.fromTo(
          [connectorLeftRef.current, connectorRightRef.current],
          { drawSVG: "100%" },
          { drawSVG: "30% 70%", ease: "none" },
          0
        );

        // --- SUBTITLE + READOUTS: their own (different speed) parallax ----
        scrub.fromTo(
          subLayerRef.current,
          { yPercent: 0, xPercent: 0, opacity: 1 },
          { yPercent: -72, xPercent: isDesktop ? 5 : 2, ease: "none" },
          0
        );

        // --- BASELINE HAIRLINE: drains as you scroll past (scrub DrawSVG) -
        scrub.fromTo(
          baselinePathRef.current,
          { drawSVG: "0% 100%" },
          { drawSVG: "100% 100%", ease: "none" },
          0.2
        );

        // --- SCROLL CUE: exits early in the scrub --------------------------
        scrub.to(scrollIndicatorRef.current, { opacity: 0, y: -20 }, 0);

        // --- FINAL BEAT: 3D DEPART of the wordmark (last ~18%) ------------
        // Content stays fully visible until here; this resolves the held
        // moment cleanly as the pin releases into the next section.
        scrub.to(
          titleDepthRef.current,
          {
            rotateX: isDesktop ? 26 : 14,
            z: isDesktop ? -340 : -160,
            yPercent: -16,
            opacity: 0.12,
            ease: "power2.in",
          },
          0.82
        );
        scrub.to(
          subLayerRef.current,
          { opacity: 0, ease: "power2.in" },
          0.82
        );
        scrub.to(
          accentLayerRef.current,
          { opacity: 0, ease: "power2.in" },
          0.82
        );

        // ---- Magnetic hover on the INNER wordmark (desktop only) --------
        // Lives on <h1>; the scrub owns the OUTER wrapper => no conflict.
        if (isDesktop && titleRef.current) {
          magneticCleanup = applyMagneticEffect(titleRef.current, {
            strength: 0.12,
            ease: 0.4,
            resetEase: 0.7,
            resetEaseType: "elastic.out(1, 0.5)",
          });
        }
      }, sectionRef);

      return () => {
        ctx.revert();
        magneticCleanup();
        velocityUnsub();
        splits.forEach((s) => s.revert());
        splits = [];
      };
    };

    mm.add(BREAKPOINTS.mobile, () => build(false));
    mm.add(BREAKPOINTS.tablet, () => build(false));
    mm.add(BREAKPOINTS.desktop, () => build(true));

    return () => {
      mm.revert();
      scrollVelocity.stop();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black text-white"
      style={{ perspective: "1400px" }}
    >
      {/* Parallax background grid — deepest layer (opaque section sits on top) */}
      <div
        ref={gridRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none will-change-transform"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "clamp(48px, 6vw, 88px) clamp(48px, 6vw, 88px)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, #000 35%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 50%, #000 35%, transparent 78%)",
        }}
      />

      {/* Corner frame (its own parallax layer) */}
      <div
        ref={frameRef}
        className="absolute inset-0 pointer-events-none will-change-transform"
      >
        <div
          ref={(el) => (cornerRefs.current[0] = el)}
          className="absolute top-4 left-4 md:top-8 md:left-8 w-8 h-8 md:w-14 md:h-14 border-l border-t border-neutral-700 will-change-transform"
        />
        <div
          ref={(el) => (cornerRefs.current[1] = el)}
          className="absolute top-4 right-4 md:top-8 md:right-8 w-8 h-8 md:w-14 md:h-14 border-r border-t border-neutral-700 will-change-transform"
        />
        <div
          ref={(el) => (cornerRefs.current[2] = el)}
          className="absolute bottom-4 left-4 md:bottom-8 md:left-8 w-8 h-8 md:w-14 md:h-14 border-l border-b border-neutral-700 will-change-transform"
        />
        <div
          ref={(el) => (cornerRefs.current[3] = el)}
          className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-8 h-8 md:w-14 md:h-14 border-r border-b border-neutral-700 will-change-transform"
        />
      </div>

      {/* Velocity-skew stage */}
      <div
        ref={stageRef}
        className="relative z-10 w-full flex flex-col items-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Main content */}
        <div className="text-center px-4 md:px-6 flex flex-col items-center">
          {/* Eyebrow */}
          <span
            ref={eyebrowRef}
            className="font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-neutral-500 mb-5 md:mb-8 will-change-transform"
          >
            Portfolio
          </span>

          {/* Title — 3D depart owner wraps scrub-parallax wrapper wraps <h1> */}
          <div
            ref={titleDepthRef}
            className="will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              ref={titleWrapRef}
              className="will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              <h1
                ref={titleRef}
                className="font-black tracking-[-0.05em] leading-none text-white will-change-transform"
                style={{
                  fontSize: "clamp(3rem, 18vw, 16rem)",
                  fontFamily: "Space Grotesk, sans-serif",
                  paddingBottom: "0.06em",
                }}
              >
                NIHESH
              </h1>
            </div>
          </div>

          {/* Emerald accent rule + connectors (DrawSVG) — own parallax layer */}
          <div
            ref={accentLayerRef}
            className="relative mt-6 md:mt-8 w-[min(80vw,640px)] h-6 flex items-center justify-center will-change-transform"
          >
            <svg
              className="absolute inset-0 w-full h-full overflow-visible"
              viewBox="0 0 640 24"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
            >
              {/* left connector toward frame */}
              <path
                ref={connectorLeftRef}
                d="M260 12 L40 12"
                stroke={EMERALD}
                strokeWidth="1"
                strokeOpacity="0.55"
                strokeLinecap="round"
              />
              {/* right connector toward frame */}
              <path
                ref={connectorRightRef}
                d="M380 12 L600 12"
                stroke={EMERALD}
                strokeWidth="1"
                strokeOpacity="0.55"
                strokeLinecap="round"
              />
              {/* central emerald accent */}
              <path
                ref={accentPathRef}
                d="M280 12 L360 12"
                stroke={EMERALD}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Subtitle + readouts — shared parallax layer (different speed) */}
          <div ref={subLayerRef} className="will-change-transform">
            {/* Subtitle — SplitText line/char masked rise */}
            <div className="mt-5 md:mt-7">
              <p
                ref={subtitleRef}
                className="font-mono text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.32em] text-neutral-400 will-change-transform"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {JOB_TITLE}
              </p>
            </div>

            {/* Mono readout row (Flip settle + ScrambleText) */}
            <div
              ref={readoutRowRef}
              className="mt-7 md:mt-9 flex items-center justify-center gap-4 md:gap-6 will-change-transform"
            >
              <span
                ref={coordRef}
                className="font-mono text-[9px] md:text-[11px] tracking-[0.25em] text-neutral-600"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                ............ / ............
              </span>
              <span className="w-px h-3 bg-neutral-700" />
              <span className="flex items-center gap-2">
                <span
                  className="block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: EMERALD }}
                />
                <span
                  ref={statusRef}
                  className="font-mono text-[9px] md:text-[11px] tracking-[0.25em]"
                  style={{
                    color: EMERALD,
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  .........
                </span>
              </span>
            </div>

            {/* Hairline baseline (DrawSVG, full width under content) */}
            <div className="mt-9 md:mt-12 w-[min(86vw,760px)]">
              <svg
                className="w-full overflow-visible"
                height="2"
                viewBox="0 0 760 2"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
              >
                <path
                  ref={baselinePathRef}
                  d="M1 1 L759 1"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 will-change-transform"
      >
        <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-neutral-500">
          Scroll
        </span>
        <div className="relative w-px h-10 md:h-12 bg-neutral-800 overflow-hidden">
          <div className="scroll-dot absolute top-0 left-0 w-px h-4 bg-emerald-500" />
        </div>
      </div>

      {/* Section number */}
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-10 font-mono text-[10px] md:text-xs text-neutral-600 tracking-widest">
        01 / 07
      </div>
    </section>
  );
}

export default ScrollHeroSection;
