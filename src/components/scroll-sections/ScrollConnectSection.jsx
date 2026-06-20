import { useRef, useEffect } from "react";
import {
  gsap,
  SplitText,
  ScrambleTextPlugin,
  BREAKPOINTS,
  EASINGS,
  scrollVelocity,
} from "../../utils/gsapConfig";
import { applyMagneticEffect } from "../../hooks/useMagnetic";
import { LuGithub, LuLinkedin, LuMail } from "react-icons/lu";
import { FaXTwitter } from "react-icons/fa6";

// Keep the plugin reference alive through tree-shaking (registered in gsapConfig)
void ScrambleTextPlugin;

const EMERALD = "#10b981";

/**
 * Connect — the closing screen and the LAST section.
 *
 * RELIABILITY CONTRACT (non-negotiable):
 *  - Opaque white background on the section root; it never overlays a neighbor.
 *  - NOT pinned, NOT scrubbed-with-pin: this section must keep flowing so it
 *    can never overlap the section before it and must always remain last.
 *  - A single cinematic entrance timeline plays once on enter and RESOLVES every
 *    element to its clean, fully visible, in-frame state (opacity 1, no clip,
 *    no residual transform, DrawSVG 100%). toggleActions reverse only rewinds
 *    that same timeline back to its safe initial mask, never past it.
 *  - A few LIGHT parallax-on-scrub layers add depth as the section passes, but
 *    they are pure translateY drift that returns to neutral, so they can never
 *    push content off-screen or hide it.
 *  - Reduced-motion branch sets clean final visible states with no transforms.
 *
 * GSAP arsenal layered here:
 *  SplitText (heading char masked reveal + outro line masked reveal),
 *  DrawSVGPlugin (heading underline, email signature underline, the converging
 *  connector arcs that "draw" toward the card row), a choreographed 3D flip-in
 *  for the social cards (perspective + rotateX/rotateY + arc converge + scale),
 *  magnetic hover (applyMagneticEffect), ScrambleTextPlugin for the final index
 *  readout, multi-layer parallax depth on scrub, and the velocity singleton for
 *  a subtle filmic skew. Eases: cine / cineOut / cut.
 */
function ScrollConnectSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const linksRef = useRef(null);
  const headingRef = useRef(null);
  const kickerRef = useRef(null);
  const emailRef = useRef(null);
  const statusRef = useRef(null);
  const drawLineRef = useRef(null);
  const signRef = useRef(null);
  const indexRef = useRef(null);
  const auraRef = useRef(null);
  const fieldRef = useRef(null);

  const socialLinks = [
    { icon: LuGithub, href: "https://github.com/rnihesh", label: "GitHub" },
    {
      icon: LuLinkedin,
      href: "https://linkedin.com/in/rachakonda-nihesh",
      label: "LinkedIn",
    },
    { icon: FaXTwitter, href: "https://x.com/niheshr03", label: "X" },
    { icon: LuMail, href: "mailto:niheshr03@gmail.com", label: "Email" },
  ];

  useEffect(() => {
    const mm = gsap.matchMedia();

    // ---------------------------------------------------------------
    // Reduced motion — clean, fully visible final states, no transforms
    // ---------------------------------------------------------------
    mm.add(BREAKPOINTS.reducedMotion, () => {
      const root = sectionRef.current;
      gsap.set(
        [kickerRef.current, statusRef.current, contentRef.current, indexRef.current],
        { opacity: 1, x: 0, y: 0, clearProps: "transform" }
      );
      if (emailRef.current)
        gsap.set(emailRef.current, {
          opacity: 1,
          clearProps: "clipPath,letterSpacing,color,transform",
        });
      if (auraRef.current) gsap.set(auraRef.current, { opacity: 1, clearProps: "transform" });
      const headingChars = root?.querySelectorAll(".heading-line");
      if (headingChars) gsap.set(headingChars, { yPercent: 0, opacity: 1 });
      const cards = root?.querySelectorAll(".social-card");
      if (cards)
        gsap.set(cards, {
          opacity: 1,
          x: 0,
          y: 0,
          z: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          clearProps: "transform",
        });
      const draws = root?.querySelectorAll(".draw-path");
      if (draws) gsap.set(draws, { drawSVG: "100%", opacity: 1 });
      const outro = root?.querySelectorAll(".outro-line");
      if (outro) gsap.set(outro, { yPercent: 0, opacity: 1 });
      return () => {};
    });

    // ---------------------------------------------------------------
    // Motion — rich, choreographed, but flowing (no pin / no pin-scrub).
    // ---------------------------------------------------------------
    const buildEntrance = (isDesktop) => {
      let splitHeading = null;
      let splitOutro = [];
      let velocityUnsub = null;
      const magneticCleanups = [];

      const ctx = gsap.context(() => {
        const root = sectionRef.current;
        const cards = gsap.utils.toArray(".social-card");
        const connectors = gsap.utils.toArray(".connector-path");

        // -----------------------------------------------------------
        // SplitText — heading into masked characters that rise + roll
        // -----------------------------------------------------------
        let headingChars = [];
        if (headingRef.current) {
          splitHeading = new SplitText(headingRef.current, {
            type: "chars,lines",
            linesClass: "heading-line",
          });
          // overflow-hidden mask per line so chars rise out of nothing
          splitHeading.lines.forEach((line) => {
            line.style.overflow = "hidden";
            line.style.display = "block";
            line.style.paddingBottom = "0.08em";
          });
          headingChars = splitHeading.chars;
        }

        // -----------------------------------------------------------
        // SplitText — outro credit lines into masked lines
        // -----------------------------------------------------------
        const outroEls = gsap.utils.toArray(".outro-source");
        let outroLines = [];
        outroEls.forEach((el) => {
          const s = new SplitText(el, { type: "lines", linesClass: "outro-line" });
          s.lines.forEach((line) => {
            line.style.overflow = "hidden";
            line.style.display = "block";
          });
          splitOutro.push(s);
          outroLines = outroLines.concat(s.lines);
        });

        // -----------------------------------------------------------
        // Initial (pre-reveal) states — masked, ready to settle in.
        // Cards start scattered on an arc, rotated in 3D, ready to
        // converge into a clean centered row.
        // -----------------------------------------------------------
        gsap.set(headingChars, { yPercent: 115, rotateX: -55, opacity: 0 });
        gsap.set(outroLines, { yPercent: 115 });
        if (kickerRef.current) gsap.set(kickerRef.current, { opacity: 0, y: 14 });
        if (statusRef.current) gsap.set(statusRef.current, { opacity: 0, y: 12 });
        if (auraRef.current) gsap.set(auraRef.current, { opacity: 0, scale: 0.6 });
        if (drawLineRef.current) gsap.set(drawLineRef.current, { drawSVG: "0%" });
        if (signRef.current) gsap.set(signRef.current, { drawSVG: "0%" });
        if (connectors.length) gsap.set(connectors, { drawSVG: "0%", opacity: 1 });
        if (emailRef.current)
          gsap.set(emailRef.current, {
            clipPath: "inset(0 100% 0 0)",
            opacity: 1,
          });

        // perspective container for the 3D card flip-in
        if (linksRef.current)
          gsap.set(linksRef.current, { perspective: 1100, transformStyle: "preserve-3d" });

        const count = cards.length;
        cards.forEach((card, i) => {
          // fan the cards out on a shallow arc above their resting spot
          const mid = (count - 1) / 2;
          const offset = i - mid;
          gsap.set(card, {
            opacity: 0,
            x: offset * (isDesktop ? 60 : 30),
            y: 70,
            z: -260,
            rotateX: 62,
            rotateY: offset * -9,
            scale: 0.82,
            transformOrigin: "50% 100% -40px",
            transformPerspective: 1100,
          });
        });

        // -----------------------------------------------------------
        // The entrance timeline — plays once on enter, reverses on exit
        // back to the masked start. Everything RESOLVES to visible.
        // -----------------------------------------------------------
        const tl = gsap.timeline({
          defaults: { ease: EASINGS.cineOut },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            toggleActions: "play none none reverse",
            onEnter: () => {
              // emerald aura behind heading blooms once, settles, no ghost word
              if (auraRef.current)
                gsap.fromTo(
                  auraRef.current,
                  { opacity: 0, scale: 0.6 },
                  {
                    opacity: 0.14,
                    scale: 1,
                    duration: 1.4,
                    ease: EASINGS.cineOut,
                  }
                );
            },
          },
        });

        // Kicker drifts up
        if (kickerRef.current)
          tl.to(kickerRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0);

        // Heading characters rise + un-roll out of their mask (cinematic)
        tl.to(
          headingChars,
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: 0.9,
            ease: EASINGS.cine,
            stagger: { each: 0.028, from: "center" },
          },
          0.05
        );

        // Emerald underline draws beneath the heading
        if (drawLineRef.current)
          tl.to(
            drawLineRef.current,
            { drawSVG: "100%", duration: 0.7, ease: EASINGS.cine },
            0.4
          );

        // Email wipes in, then its signature underline draws
        if (emailRef.current)
          tl.to(
            emailRef.current,
            { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: EASINGS.cine },
            0.5
          );
        if (signRef.current)
          tl.to(
            signRef.current,
            { drawSVG: "100%", duration: 0.6, ease: EASINGS.cine },
            0.72
          );

        // Status readout settles
        if (statusRef.current)
          tl.to(statusRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.72);

        // Connector arcs draw downward toward the card row (DrawSVG depth)
        if (connectors.length)
          tl.to(
            connectors,
            { drawSVG: "100%", duration: 0.6, stagger: 0.05, ease: EASINGS.cine },
            0.82
          );

        // -----------------------------------------------------------
        // Social cards: choreographed 3D flip-in + arc converge into a
        // clean, readable, centered row. Ends at full opacity, no skew,
        // no residual rotation. clearProps wipes the 3D transform so the
        // resting row is pixel-clean and magnetic hover starts from zero.
        // -----------------------------------------------------------
        tl.to(
          cards,
          {
            opacity: 1,
            x: 0,
            y: 0,
            z: 0,
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.85,
            ease: EASINGS.cineOut,
            stagger: { each: 0.08, from: "center" },
          },
          0.92
        );
        tl.add(() => {
          // resolve to a transform-free resting state (only when fully shown)
          if (tl.progress() > 0.95) gsap.set(cards, { clearProps: "transform" });
        });

        // ScrambleText — the final section index resolves with a mono scramble
        if (indexRef.current)
          tl.to(
            indexRef.current,
            {
              duration: 1.1,
              ease: "none",
              scrambleText: {
                text: "07 / 07",
                chars: "0123456789/ ",
                speed: 0.5,
                revealDelay: 0.2,
              },
            },
            1.0
          );

        // Outro credit lines rise out of their masks, last beat
        tl.to(outroLines, { yPercent: 0, duration: 0.6, stagger: 0.08 }, 1.15);

        // -----------------------------------------------------------
        // SAFETY NET: when the timeline finishes (or if the user lands
        // here fast), force every element to its visible resting state.
        // This guarantees nothing is ever stuck hidden.
        // -----------------------------------------------------------
        tl.eventCallback("onComplete", () => {
          gsap.set(headingChars, { yPercent: 0, rotateX: 0, opacity: 1 });
          gsap.set(outroLines, { yPercent: 0, opacity: 1 });
          gsap.set(cards, {
            opacity: 1,
            clearProps: "transform",
          });
          if (kickerRef.current) gsap.set(kickerRef.current, { opacity: 1, y: 0 });
          if (statusRef.current) gsap.set(statusRef.current, { opacity: 1, y: 0 });
          if (drawLineRef.current) gsap.set(drawLineRef.current, { drawSVG: "100%" });
          if (signRef.current) gsap.set(signRef.current, { drawSVG: "100%" });
          if (connectors.length) gsap.set(connectors, { drawSVG: "100%" });
          if (emailRef.current)
            gsap.set(emailRef.current, { clipPath: "inset(0 0% 0 0)", opacity: 1 });
          if (indexRef.current) indexRef.current.textContent = "07 / 07";
        });

        // -----------------------------------------------------------
        // PARALLAX DEPTH — light multi-layer translateY drift on scrub
        // as the section passes through. Pure transform, returns to
        // neutral, never hides or displaces content beyond a few px.
        // -----------------------------------------------------------
        const depthTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
        if (auraRef.current)
          depthTl.fromTo(
            auraRef.current,
            { yPercent: -8 },
            { yPercent: 8, ease: "none" },
            0
          );
        if (kickerRef.current)
          depthTl.fromTo(
            kickerRef.current,
            { yPercent: -14 },
            { yPercent: 14, ease: "none" },
            0
          );
        // corner field drifts the opposite way for layered depth
        if (fieldRef.current)
          depthTl.fromTo(
            fieldRef.current,
            { yPercent: 6 },
            { yPercent: -6, ease: "none" },
            0
          );

        // -----------------------------------------------------------
        // VELOCITY SKEW — subtle filmic smear on fast scroll, settles
        // back to zero. Applied to the content wrapper, clamped small.
        // -----------------------------------------------------------
        if (contentRef.current) {
          scrollVelocity.start();
          const quickSkew = gsap.quickTo(contentRef.current, "skewY", {
            duration: 0.3,
            ease: "power3.out",
          });
          velocityUnsub = scrollVelocity.subscribe(() => {
            const n = scrollVelocity.getNormalizedVelocity(2200);
            const skew = n * 1.4 * Math.sign(scrollVelocity.velocity);
            quickSkew(skew);
          });
        }

        // -----------------------------------------------------------
        // Magnetic + emerald hover micro-interactions on each card
        // -----------------------------------------------------------
        cards.forEach((card) => {
          if (isDesktop) {
            const cleanup = applyMagneticEffect(card, {
              strength: 0.24,
              ease: 0.35,
              resetEase: 0.6,
              resetEaseType: "elastic.out(1, 0.5)",
            });
            magneticCleanups.push(cleanup);
          }

          const icon = card.querySelector(".social-icon");
          const label = card.querySelector(".social-label");
          const circle = card.querySelector(".social-circle");

          const onEnter = () => {
            gsap.to(icon, {
              scale: 1.14,
              color: EMERALD,
              duration: 0.3,
              ease: EASINGS.cineOut,
            });
            gsap.to(label, { color: "#000", duration: 0.25 });
            if (circle)
              gsap.to(circle, {
                borderColor: EMERALD,
                duration: 0.3,
                ease: EASINGS.cineOut,
              });
            gsap.to(card, {
              borderColor: EMERALD,
              duration: 0.3,
              ease: EASINGS.cineOut,
              overwrite: "auto",
            });
          };

          const onLeave = () => {
            gsap.to(icon, {
              scale: 1,
              color: "",
              duration: 0.35,
              ease: EASINGS.cineOut,
            });
            gsap.to(label, { color: "", duration: 0.25 });
            if (circle)
              gsap.to(circle, { borderColor: "#e5e5e5", duration: 0.3 });
            gsap.to(card, {
              borderColor: "#e5e5e5",
              duration: 0.35,
              ease: EASINGS.cineOut,
              overwrite: "auto",
            });
          };

          card.addEventListener("mouseenter", onEnter);
          card.addEventListener("mouseleave", onLeave);
          magneticCleanups.push(() => {
            card.removeEventListener("mouseenter", onEnter);
            card.removeEventListener("mouseleave", onLeave);
          });
        });

        // Email hover — emerald tint, signature underline turns emerald
        if (emailRef.current) {
          const underline = signRef.current;
          const onEnter = () => {
            gsap.to(emailRef.current, {
              color: EMERALD,
              duration: 0.3,
              ease: EASINGS.cineOut,
            });
            if (underline)
              gsap.to(underline, { attr: { stroke: EMERALD }, duration: 0.3 });
          };
          const onLeave = () => {
            gsap.to(emailRef.current, { color: "#000", duration: 0.3 });
            if (underline)
              gsap.to(underline, { attr: { stroke: "#000000" }, duration: 0.3 });
          };
          const el = emailRef.current;
          el.addEventListener("mouseenter", onEnter);
          el.addEventListener("mouseleave", onLeave);
          magneticCleanups.push(() => {
            el.removeEventListener("mouseenter", onEnter);
            el.removeEventListener("mouseleave", onLeave);
          });
        }

        void root;
      }, sectionRef);

      return () => {
        ctx.revert();
        if (velocityUnsub) velocityUnsub();
        scrollVelocity.stop();
        if (splitHeading) splitHeading.revert();
        splitOutro.forEach((s) => s.revert());
        splitOutro = [];
        magneticCleanups.forEach((cleanup) => cleanup());
      };
    };

    mm.add(BREAKPOINTS.mobile, () => buildEntrance(false));
    mm.add(BREAKPOINTS.tablet, () => buildEntrance(false));
    mm.add(BREAKPOINTS.desktop, () => buildEntrance(true));

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full bg-white text-black flex items-center justify-center sticky top-0 z-30 overflow-hidden py-20 md:py-0"
    >
      {/* Emerald aura behind the heading (soft, restrained, not a ghost word) */}
      <div
        ref={auraRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] md:w-[680px] md:h-[680px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(16,185,129,0.5) 0%, rgba(16,185,129,0) 68%)",
          filter: "blur(40px)",
          opacity: 0,
        }}
      />

      {/* Main content */}
      <div
        ref={contentRef}
        className="relative z-10 text-center px-6 md:px-8 max-w-3xl mx-auto will-change-transform"
      >
        {/* Kicker */}
        <span
          ref={kickerRef}
          className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-neutral-400 mb-7 md:mb-9 block will-change-transform"
        >
          07 / Connect
        </span>

        {/* Heading — SplitText char masked reveal */}
        <h2
          ref={headingRef}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Let's Connect
        </h2>

        {/* Emerald DrawSVG underline under heading */}
        <div className="flex justify-center mt-4 mb-8 md:mb-10">
          <svg
            width="180"
            height="12"
            viewBox="0 0 180 12"
            fill="none"
            className="overflow-visible"
            aria-hidden="true"
          >
            <path
              ref={drawLineRef}
              className="draw-path"
              d="M2 8 C 45 3, 80 3, 90 6 S 150 10, 178 5"
              stroke={EMERALD}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Email with clip-path wipe + signature underline draw */}
        <div className="relative inline-block mb-9 md:mb-11">
          <a
            ref={emailRef}
            href="mailto:niheshr03@gmail.com"
            className="email-link inline-block text-base md:text-2xl lg:text-3xl font-mono text-black break-all will-change-[clip-path]"
          >
            niheshr03@gmail.com
          </a>
          <svg
            className="absolute left-0 -bottom-2 w-full overflow-visible pointer-events-none"
            height="6"
            viewBox="0 0 300 6"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              ref={signRef}
              className="draw-path"
              d="M2 4 C 80 1, 150 6, 298 3"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Status readout (emerald, available) */}
        <div
          ref={statusRef}
          className="flex items-center justify-center gap-2.5 mb-9 md:mb-12 will-change-transform"
        >
          <span
            className="block w-2 h-2 rounded-full"
            style={{ backgroundColor: EMERALD }}
          />
          <span
            className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em]"
            style={{ color: EMERALD }}
          >
            OPEN TO WORK
          </span>
        </div>

        {/* Connector arcs that draw down toward the card row (depth) */}
        <div className="flex justify-center mb-2 md:mb-3" aria-hidden="true">
          <svg
            width="220"
            height="34"
            viewBox="0 0 220 34"
            fill="none"
            className="overflow-visible opacity-60"
          >
            <path
              className="connector-path draw-path"
              d="M110 0 C 110 14, 60 16, 30 32"
              stroke={EMERALD}
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              className="connector-path draw-path"
              d="M110 0 C 110 16, 110 18, 110 32"
              stroke={EMERALD}
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              className="connector-path draw-path"
              d="M110 0 C 110 14, 160 16, 190 32"
              stroke={EMERALD}
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Social cards (3D flip-in converge + magnetic hover) */}
        <div ref={linksRef} className="relative">
          <div className="flex flex-wrap justify-center gap-3.5 md:gap-5">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-card group flex flex-col items-center gap-3 p-5 md:p-6 bg-white border border-neutral-200 rounded-2xl cursor-pointer will-change-transform"
              >
                <div className="social-circle w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-neutral-200 flex items-center justify-center transition-colors">
                  <div className="social-icon text-neutral-700">
                    <link.icon size={22} className="md:w-6 md:h-6" />
                  </div>
                </div>
                <span className="social-label font-mono text-[10px] md:text-xs uppercase tracking-wider text-neutral-500">
                  {link.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Outro credit lines (SplitText masked line reveals) */}
        <div className="mt-14 md:mt-16 flex flex-col items-center gap-3">
          <p className="outro-source font-mono text-[10px] md:text-xs text-neutral-400 uppercase tracking-wider md:tracking-widest will-change-transform">
            Built with React, GSAP, and attention to detail
          </p>
          <p className="outro-source font-mono text-[10px] md:text-xs text-neutral-300 tracking-[0.3em] will-change-transform">
            FIN
          </p>
        </div>
      </div>

      {/* Corner brackets + parallax field layer */}
      <div ref={fieldRef} className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-5 left-5 md:top-8 md:left-8 w-8 h-8 md:w-12 md:h-12 border-l border-t border-neutral-200" />
        <div className="absolute top-5 right-5 md:top-8 md:right-8 w-8 h-8 md:w-12 md:h-12 border-r border-t border-neutral-200" />
        <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8 w-8 h-8 md:w-12 md:h-12 border-l border-b border-neutral-200" />
        <div className="absolute bottom-5 right-5 md:bottom-8 md:right-8 w-8 h-8 md:w-12 md:h-12 border-r border-b border-neutral-200" />
      </div>

      {/* Section index — resolves via ScrambleText */}
      <div
        ref={indexRef}
        className="absolute bottom-5 right-14 md:bottom-8 md:right-20 font-mono text-[10px] md:text-xs text-neutral-400 tracking-widest"
      >
        07 / 07
      </div>
    </section>
  );
}

export default ScrollConnectSection;
