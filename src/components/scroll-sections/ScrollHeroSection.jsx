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
 * Hero — the opening showstopper.
 *
 * A fully choreographed cinematic intro, layered with the GSAP arsenal:
 *
 *  - SplitText per-character MASKED rise on NIHESH (each glyph rises out of its
 *    own overflow-hidden mask, staggered, with a touch of 3D rotateX/z depth).
 *  - SplitText line+char masked reveal on the role subtitle.
 *  - DrawSVGPlugin: an emerald accent rule strokes in, plus two emerald
 *    connector lines draw out toward the frame, plus a hairline baseline.
 *  - ScrambleTextPlugin: the mono coordinate/status readouts scramble to value.
 *  - Flip: the eyebrow + readout row settles via a captured Flip state.
 *  - Velocity-reactive skew (scrollVelocity singleton) on the whole stage.
 *  - Multi-layer PARALLAX DEPTH on scroll-out: background grid, corner frame,
 *    and the title move at different scrub speeds; the title departs with a 3D
 *    rotateX + z + scale exit. Magnetic hover on the wordmark (desktop).
 *  - Registered cinematic eases (cine / cineOut / cut).
 *
 * RELIABILITY (non-negotiable):
 *  - Opaque black background on the section root.
 *  - NOT pinned. The entrance is a one-shot timeline that always resolves to
 *    opacity 1 / yPercent 0 / drawSVG 100%. The scroll-out is a reversible
 *    SCRUB that only engages once the section starts leaving the top of the
 *    viewport (start "center top"), so content is ALWAYS fully visible and
 *    readable while the hero occupies the screen, and it can never overlap the
 *    next (opaque white) section.
 *  - reducedMotion branch sets clean, fully visible final states (no transforms,
 *    opacity 1, drawSVG 100%) and runs no animation.
 *  - SplitText instances are reverted; gsap.context / ctx.revert + mm.revert
 *    handle teardown; the velocity subscription is unsubscribed.
 *
 * NIHESH is always plain white (no background-clip gradient on split text).
 */
function ScrollHeroSection() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null); // velocity-skew + parallax wrapper
  const eyebrowRef = useRef(null);
  const readoutRowRef = useRef(null);
  const coordRef = useRef(null);
  const statusRef = useRef(null);
  const titleRef = useRef(null);
  const titleWrapRef = useRef(null);
  const accentPathRef = useRef(null);
  const baselinePathRef = useRef(null);
  const connectorLeftRef = useRef(null);
  const connectorRightRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const gridRef = useRef(null);
  const frameRef = useRef(null);
  const cornerRefs = useRef([]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // -----------------------------------------------------------------
    // Reduced motion — clean, fully visible final states. No animation.
    // -----------------------------------------------------------------
    mm.add(BREAKPOINTS.reducedMotion, () => {
      const corners = cornerRefs.current.filter(Boolean);
      gsap.set(
        [
          stageRef.current,
          titleRef.current,
          titleWrapRef.current,
          subtitleRef.current,
          eyebrowRef.current,
          readoutRowRef.current,
          gridRef.current,
          frameRef.current,
        ],
        {
          opacity: 1,
          x: 0,
          y: 0,
          yPercent: 0,
          z: 0,
          scale: 1,
          rotateX: 0,
          skewY: 0,
          clearProps: "filter",
        }
      );
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
    // Motion — split into desktop (full arsenal: magnetic + heavier
    // parallax/3D) and reduced-weight mobile/tablet. Both end fully
    // visible; both use scrub-WITHOUT-pin for the departure.
    // -----------------------------------------------------------------
    const build = (isDesktop) => {
      let splits = [];
      let magneticCleanup = () => {};
      let velocityUnsub = () => {};
      let velocityQuickTo = null;

      const ctx = gsap.context(() => {
        const corners = cornerRefs.current.filter(Boolean);

        // ---- SplitText: NIHESH per-character masked rise -------------
        // mask:"chars" wraps every glyph in an overflow-hidden box, so the
        // rise is a true cinematic curtain reveal. type stays chars-only.
        const titleSplit = new SplitText(titleRef.current, {
          type: "chars",
          mask: "chars",
          charsClass: "hero-char",
        });
        splits.push(titleSplit);

        // ---- SplitText: subtitle line + char masked reveal -----------
        const subSplit = new SplitText(subtitleRef.current, {
          type: "lines,chars",
          mask: "lines",
          linesClass: "hero-sub-line",
        });
        splits.push(subSplit);

        // ---- Initial hidden states (everything ready to resolve) -----
        gsap.set(titleSplit.chars, {
          yPercent: 120,
          rotateX: -55,
          z: -60,
          transformOrigin: "50% 100% -20px",
        });
        gsap.set(subSplit.chars, { yPercent: 110, opacity: 0 });
        gsap.set([eyebrowRef.current], { opacity: 0, y: 14, letterSpacing: "0.6em" });
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
        // then Flip back in for an organic settle. Tasteful + reliable
        // (always ends at the natural layout = fully visible). ---------
        const flipState = Flip.getState(readoutRowRef.current);
        gsap.set(readoutRowRef.current, { xPercent: -6 });

        // ============================================================
        // ENTRANCE — one-shot, plays on load, ALWAYS resolves visible.
        // ============================================================
        const tl = gsap.timeline({ delay: 0.12 });

        // Background grid breathes in (subtle depth plate).
        tl.to(
          gridRef.current,
          { opacity: 1, scale: 1, duration: 1.6, ease: EASINGS.cine },
          0
        );

        // Corner frame snaps in with a staggered cut.
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

        // Eyebrow tightens into place.
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

        // NIHESH — the headline moment: masked per-char rise with 3D depth.
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

        // Emerald accent rule strokes in beneath the wordmark.
        tl.to(
          accentPathRef.current,
          { drawSVG: "100%", duration: 0.8, ease: EASINGS.cine },
          0.78
        );

        // Connector lines draw out toward the frame edges.
        tl.to(
          [connectorLeftRef.current, connectorRightRef.current],
          { drawSVG: "100%", duration: 0.9, ease: EASINGS.cine },
          0.82
        );

        // Subtitle — line/char masked rise.
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

        // Hairline baseline draws full width.
        tl.to(
          baselinePathRef.current,
          { drawSVG: "100%", duration: 1.1, ease: EASINGS.cine },
          0.95
        );

        // Flip the readout row home (settles to natural layout) + fade.
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

        // ScrambleText: coordinate + status mono readouts resolve to value.
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

        // Scroll cue resolves last.
        tl.to(
          scrollIndicatorRef.current,
          { opacity: 1, y: 0, duration: 0.7, ease: EASINGS.cineOut },
          1.25
        );

        // Looping scroll-cue dot — purely decorative, never hides content.
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

        // ============================================================
        // VELOCITY-REACTIVE SKEW — the whole stage shears slightly with
        // scroll speed, then eases home. Reliable: skew only, no opacity.
        // ============================================================
        velocityQuickTo = gsap.quickTo(stageRef.current, "skewY", {
          duration: 0.4,
          ease: "power3.out",
        });
        scrollVelocity.start();
        velocityUnsub = scrollVelocity.subscribe((v) => {
          const skew = gsap.utils.clamp(-6, 6, v * 0.012);
          if (velocityQuickTo) velocityQuickTo(skew);
        });

        // ============================================================
        // SCROLL-OUT DEPARTURE — rich, multi-layer PARALLAX + 3D exit.
        // SCRUB, NO PIN. Engages only once the section starts leaving the
        // top ("center top"), so content stays FULLY visible while the
        // hero is on screen, and it physically cannot overlap the next
        // (opaque) section. Reversible: scroll back up and it restores.
        // ============================================================
        const out = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "center top",
            end: "bottom top",
            scrub: 1,
          },
        });

        // Title layer — leads the exit with a 3D depart (rotateX + z + scale).
        out.to(
          titleWrapRef.current,
          {
            yPercent: -28,
            z: isDesktop ? -260 : -120,
            rotateX: isDesktop ? 22 : 12,
            scale: 0.94,
            opacity: 0.18,
            ease: "none",
          },
          0
        );

        // Subtitle + readouts — slightly slower parallax layer.
        out.to(
          [subtitleRef.current, readoutRowRef.current, eyebrowRef.current],
          { yPercent: -60, opacity: 0, ease: "none" },
          0
        );

        // Accent SVG — mid layer.
        out.to(
          [accentPathRef.current?.parentNode],
          { yPercent: -45, opacity: 0, ease: "none" },
          0
        );

        // Background grid — deepest layer, drifts slowest (parallax depth).
        out.to(
          gridRef.current,
          { yPercent: 14, scale: 1.12, opacity: 0, ease: "none" },
          0
        );

        // Corner frame — pushes outward as the section leaves.
        out.to(frameRef.current, { yPercent: -10, opacity: 0, ease: "none" }, 0);

        // Scroll cue exits early.
        out.to(scrollIndicatorRef.current, { opacity: 0, ease: "none" }, 0);

        // ---- Magnetic hover on the wordmark (desktop only) ----------
        if (isDesktop && titleWrapRef.current) {
          magneticCleanup = applyMagneticEffect(titleWrapRef.current, {
            strength: 0.16,
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
        className="absolute inset-0 pointer-events-none"
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
      <div ref={frameRef} className="absolute inset-0 pointer-events-none">
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
      </div>

      {/* Velocity-skew + parallax stage */}
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

          {/* Title — SplitText masked per-char rise. Always plain white. */}
          <div
            ref={titleWrapRef}
            className="will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            <h1
              ref={titleRef}
              className="font-black tracking-[-0.05em] leading-none text-white"
              style={{
                fontSize: "clamp(3rem, 18vw, 16rem)",
                fontFamily: "Space Grotesk, sans-serif",
                paddingBottom: "0.06em",
              }}
            >
              NIHESH
            </h1>
          </div>

          {/* Emerald accent rule + connectors (DrawSVG) */}
          <div className="relative mt-6 md:mt-8 w-[min(80vw,640px)] h-6 flex items-center justify-center">
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
            className="mt-7 md:mt-9 flex items-center gap-4 md:gap-6 will-change-transform"
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
                style={{ color: EMERALD, fontFamily: "JetBrains Mono, monospace" }}
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

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
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
