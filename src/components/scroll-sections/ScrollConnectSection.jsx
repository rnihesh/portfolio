import { useRef, useEffect } from "react";
import {
  gsap,
  BREAKPOINTS,
  EASINGS,
} from "../../utils/gsapConfig";
import { applyMagneticEffect } from "../../hooks/useMagnetic";
import { LuGithub, LuLinkedin, LuMail, LuPhone } from "react-icons/lu";
import { FaXTwitter } from "react-icons/fa6";

const EMERALD = "#10b981";

/**
 * Connect — the closing screen.
 *
 * The LAST section: it simply flows in (NOT pinned, NOT scrubbed). One calm
 * entrance timeline plays once as the section scrolls into view: the kicker
 * fades, the heading rises out of its mask, an emerald underline draws, the
 * email wipes in, the status settles, and the social cards lift in with an
 * elegant stagger. Everything ends fully visible and readable. Opaque white
 * background, so it never overlays a neighbor. A reduced-motion branch sets
 * clean final states with no transforms.
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

  const socialLinks = [
    { icon: LuGithub, href: "https://github.com/rnihesh", label: "GitHub" },
    {
      icon: LuLinkedin,
      href: "https://linkedin.com/in/rachakonda-nihesh",
      label: "LinkedIn",
    },
    { icon: FaXTwitter, href: "https://x.com/niheshr03", label: "X" },
    { icon: LuMail, href: "mailto:niheshr03@gmail.com", label: "Email" },
    { icon: LuPhone, href: "tel:+918328094810", label: "Call" },
  ];

  useEffect(() => {
    const mm = gsap.matchMedia();
    let magneticCleanups = [];

    // ---------------------------------------------------------------
    // Reduced motion — clean, fully visible final states, no transforms
    // ---------------------------------------------------------------
    mm.add(BREAKPOINTS.reducedMotion, () => {
      const root = sectionRef.current;
      gsap.set(
        [kickerRef.current, statusRef.current, contentRef.current],
        { opacity: 1, x: 0, y: 0 }
      );
      if (emailRef.current)
        gsap.set(emailRef.current, {
          opacity: 1,
          clearProps: "clipPath,letterSpacing,color",
        });
      const headingLines = root?.querySelectorAll(".heading-line");
      if (headingLines) gsap.set(headingLines, { yPercent: 0, opacity: 1 });
      const cards = root?.querySelectorAll(".social-card");
      if (cards) gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
      const draws = root?.querySelectorAll(".draw-path");
      if (draws) gsap.set(draws, { drawSVG: "100%", opacity: 1 });
      const outro = root?.querySelectorAll(".outro-line");
      if (outro) gsap.set(outro, { yPercent: 0, opacity: 1 });
      return () => {};
    });

    // ---------------------------------------------------------------
    // Motion (all viewports) — one calm entrance, play once on enter.
    // No pin, no scrub: a single timeline keyed to "top 72%" with
    // toggleActions play/reverse. Tuned a touch lighter on small screens.
    // ---------------------------------------------------------------
    const buildEntrance = (isDesktop) => {
      const ctx = gsap.context(() => {
        const headingLines = gsap.utils.toArray(".heading-line");
        const cards = gsap.utils.toArray(".social-card");
        const outroLines = gsap.utils.toArray(".outro-line");

        // Initial (pre-reveal) states — content masked, ready to settle in.
        gsap.set(headingLines, { yPercent: 110 });
        gsap.set(outroLines, { yPercent: 110 });
        gsap.set(cards, { opacity: 0, y: 28, scale: 0.96 });
        if (kickerRef.current) gsap.set(kickerRef.current, { opacity: 0, y: 10 });
        if (statusRef.current) gsap.set(statusRef.current, { opacity: 0, y: 10 });
        if (drawLineRef.current) gsap.set(drawLineRef.current, { drawSVG: "0%" });
        if (signRef.current) gsap.set(signRef.current, { drawSVG: "0%" });
        if (emailRef.current)
          gsap.set(emailRef.current, {
            clipPath: "inset(0 100% 0 0)",
            opacity: 1,
          });

        const tl = gsap.timeline({
          defaults: { ease: EASINGS.cineOut },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        });

        // Kicker
        if (kickerRef.current) {
          tl.to(
            kickerRef.current,
            { opacity: 1, y: 0, duration: 0.6 },
            0
          );
        }

        // Heading rises out of its mask
        tl.to(
          headingLines,
          { yPercent: 0, duration: 0.9, stagger: 0.1 },
          0.05
        );

        // Emerald underline draws
        if (drawLineRef.current) {
          tl.to(
            drawLineRef.current,
            { drawSVG: "100%", duration: 0.7, ease: EASINGS.cine },
            0.45
          );
        }

        // Email wipes in, then its signature underline draws
        if (emailRef.current) {
          tl.to(
            emailRef.current,
            { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: EASINGS.cine },
            0.5
          );
        }
        if (signRef.current) {
          tl.to(
            signRef.current,
            { drawSVG: "100%", duration: 0.6, ease: EASINGS.cine },
            0.7
          );
        }

        // Status readout settles
        if (statusRef.current) {
          tl.to(
            statusRef.current,
            { opacity: 1, y: 0, duration: 0.5 },
            0.7
          );
        }

        // Social cards lift in with an elegant stagger (simple rise + fade)
        tl.to(
          cards,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.07,
            ease: EASINGS.snappy,
          },
          0.8
        );

        // Outro credit lines rise out of their masks, last
        tl.to(
          outroLines,
          { yPercent: 0, duration: 0.6, stagger: 0.08 },
          1.05
        );

        // ---- Hover micro-interactions (emerald accent) ----
        cards.forEach((card) => {
          if (isDesktop) {
            const cleanup = applyMagneticEffect(card, {
              strength: 0.22,
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
              scale: 1.12,
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
              y: -4,
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
              y: 0,
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
              gsap.to(underline, {
                attr: { stroke: "#000000" },
                duration: 0.3,
              });
          };
          emailRef.current.addEventListener("mouseenter", onEnter);
          emailRef.current.addEventListener("mouseleave", onLeave);
          const el = emailRef.current;
          magneticCleanups.push(() => {
            el.removeEventListener("mouseenter", onEnter);
            el.removeEventListener("mouseleave", onLeave);
          });
        }
      }, sectionRef);

      return () => {
        ctx.revert();
        magneticCleanups.forEach((cleanup) => cleanup());
        magneticCleanups = [];
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
      className="min-h-screen w-full bg-white text-black flex items-center justify-center relative z-30 overflow-hidden py-20 md:py-0"
    >
      {/* Main content */}
      <div ref={contentRef} className="relative z-10 text-center px-6 md:px-8 max-w-3xl mx-auto">
        {/* Kicker */}
        <span
          ref={kickerRef}
          className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-neutral-400 mb-7 md:mb-9 block"
        >
          07 / Connect
        </span>

        {/* Heading with masked line reveal */}
        <div className="overflow-hidden inline-block py-[0.05em]">
          <h2
            ref={headingRef}
            className="heading-line text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] will-change-transform"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Let's Connect
          </h2>
        </div>

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
          className="flex items-center justify-center gap-2.5 mb-11 md:mb-14"
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

        {/* Social cards (clean rise + fade stagger, magnetic hover) */}
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

        {/* Outro credit lines (masked reveals) */}
        <div className="mt-14 md:mt-16 flex flex-col items-center gap-3">
          <div className="overflow-hidden py-[0.05em]">
            <p className="outro-line font-mono text-[10px] md:text-xs text-neutral-400 uppercase tracking-wider md:tracking-widest will-change-transform">
              Built with React, GSAP, and attention to detail
            </p>
          </div>
          <div className="overflow-hidden py-[0.05em]">
            <p className="outro-line font-mono text-[10px] md:text-xs text-neutral-300 tracking-[0.3em] will-change-transform">
              FIN
            </p>
          </div>
        </div>
      </div>

      {/* Corner brackets */}
      <div className="absolute top-5 left-5 md:top-8 md:left-8 w-8 h-8 md:w-12 md:h-12 border-l border-t border-neutral-200" />
      <div className="absolute top-5 right-5 md:top-8 md:right-8 w-8 h-8 md:w-12 md:h-12 border-r border-t border-neutral-200" />
      <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8 w-8 h-8 md:w-12 md:h-12 border-l border-b border-neutral-200" />
      <div className="absolute bottom-5 right-5 md:bottom-8 md:right-8 w-8 h-8 md:w-12 md:h-12 border-r border-b border-neutral-200" />

      {/* Section index */}
      <div className="absolute bottom-5 right-14 md:bottom-8 md:right-20 font-mono text-[10px] md:text-xs text-neutral-400 tracking-widest">
        07 / 07
      </div>
    </section>
  );
}

export default ScrollConnectSection;
