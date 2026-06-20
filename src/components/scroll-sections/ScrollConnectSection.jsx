import { useRef, useEffect } from "react";
import {
  gsap,
  ScrollTrigger,
  BREAKPOINTS,
  EASINGS,
} from "../../utils/gsapConfig";
import { applyMagneticEffect } from "../../hooks/useMagnetic";
import { LuGithub, LuLinkedin, LuMail, LuPhone } from "react-icons/lu";
import { FaXTwitter } from "react-icons/fa6";

const EMERALD = "#10b981";

function ScrollConnectSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const linksRef = useRef(null);
  const headingRef = useRef(null);
  const orbitRef = useRef(null);
  const kickerRef = useRef(null);
  const emailRef = useRef(null);
  const indexRef = useRef(null);
  const statusRef = useRef(null);
  const drawLineRef = useRef(null);
  const drawSpineRef = useRef(null);
  const signRef = useRef(null);

  const socialLinks = [
    { icon: LuGithub, href: "https://github.com/rnihesh", label: "GitHub", color: "#333" },
    { icon: LuLinkedin, href: "https://linkedin.com/in/rachakonda-nihesh", label: "LinkedIn", color: "#0077B5" },
    { icon: FaXTwitter, href: "https://x.com/niheshr03", label: "X", color: "#000" },
    { icon: LuMail, href: "mailto:niheshr03@gmail.com", label: "Email", color: "#EA4335" },
    { icon: LuPhone, href: "tel:+918328094810", label: "Call", color: "#34A853" },
  ];

  useEffect(() => {
    const mm = gsap.matchMedia();
    let magneticCleanups = [];

    // ---------------------------------------------------------------
    // Reduced motion — clean, fully visible final states, no transforms
    // ---------------------------------------------------------------
    mm.add(BREAKPOINTS.reducedMotion, () => {
      gsap.set([contentRef.current, headingRef.current, kickerRef.current, emailRef.current], {
        opacity: 1,
        x: 0,
        y: 0,
        clearProps: "clipPath,filter,letterSpacing",
      });
      const maskLines = sectionRef.current?.querySelectorAll(".credit-line");
      if (maskLines) gsap.set(maskLines, { yPercent: 0, opacity: 1 });
      const socialItems = sectionRef.current?.querySelectorAll(".social-card");
      if (socialItems) gsap.set(socialItems, { opacity: 1, y: 0, scale: 1, x: 0, rotation: 0 });
      const draws = sectionRef.current?.querySelectorAll(".draw-path");
      if (draws) gsap.set(draws, { drawSVG: "100%", opacity: 1 });
      return () => {};
    });

    // ---------------------------------------------------------------
    // Mobile — lighter version (no pin, simple staggered reveals)
    // ---------------------------------------------------------------
    mm.add(BREAKPOINTS.mobile, () => {
      const ctx = gsap.context(() => {
        const socialCards = gsap.utils.toArray(".social-card");
        const maskLines = gsap.utils.toArray(".credit-line");

        // Masked line reveal for the closing line
        gsap.set(maskLines, { yPercent: 110 });
        gsap.to(maskLines, {
          yPercent: 0,
          duration: 0.9,
          ease: EASINGS.cineOut,
          stagger: 0.08,
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.fromTo(
          ".connect-stagger",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: EASINGS.cineOut,
            stagger: 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // DrawSVG flourish under the heading
        const draws = gsap.utils.toArray(".draw-path");
        gsap.set(draws, { drawSVG: "0%" });
        gsap.to(draws, {
          drawSVG: "100%",
          duration: 1,
          ease: EASINGS.cine,
          stagger: 0.12,
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.fromTo(
          socialCards,
          { y: 40, opacity: 0, scale: 0.85 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.5)",
            stagger: 0.08,
            scrollTrigger: {
              trigger: linksRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }, sectionRef);
      return () => ctx.revert();
    });

    // ---------------------------------------------------------------
    // Tablet — mid cinematic, orbital cards + masked reveals
    // ---------------------------------------------------------------
    mm.add(BREAKPOINTS.tablet, () => {
      const ctx = gsap.context(() => {
        const socialCards = gsap.utils.toArray(".social-card");
        const maskLines = gsap.utils.toArray(".credit-line");

        gsap.set(maskLines, { yPercent: 110 });
        gsap.to(maskLines, {
          yPercent: 0,
          duration: 1,
          ease: EASINGS.cineOut,
          stagger: 0.1,
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
        });

        gsap.fromTo(
          ".connect-stagger",
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: EASINGS.cineOut,
            stagger: 0.12,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 65%",
              toggleActions: "play none none reverse",
            },
          }
        );

        const draws = gsap.utils.toArray(".draw-path");
        gsap.set(draws, { drawSVG: "0%" });
        gsap.to(draws, {
          drawSVG: "100%",
          duration: 1.1,
          ease: EASINGS.cine,
          stagger: 0.14,
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 68%",
            toggleActions: "play none none reverse",
          },
        });

        socialCards.forEach((card, i) => {
          const angle = (i / socialCards.length) * Math.PI * 2 - Math.PI / 2;
          const radius = 200;
          const startX = Math.cos(angle) * radius;
          const startY = Math.sin(angle) * radius;

          gsap.fromTo(
            card,
            { x: startX, y: startY, opacity: 0, scale: 0.5, rotation: gsap.utils.random(-30, 30) },
            {
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.8,
              ease: "back.out(1.5)",
              delay: i * 0.1,
              scrollTrigger: {
                trigger: linksRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      }, sectionRef);
      return () => ctx.revert();
    });

    // ---------------------------------------------------------------
    // Desktop — full cinematic "end credits" close
    // ---------------------------------------------------------------
    mm.add(BREAKPOINTS.desktop, () => {
      const ctx = gsap.context(() => {
        const socialCards = gsap.utils.toArray(".social-card");

        // ---- Entrance reveal (NOT scrubbed, NOT pinned) ----
        // The primary copy (kicker, heading, underline, email, status) reveals
        // as the section enters the viewport. Decoupling this from the pin means
        // the section is never a blank white screen during its approach — the
        // content is already settling in before the pin engages. This removes
        // the blank gap that appeared between the Timeline section and Connect.
        const headingLines = gsap.utils.toArray(".credit-line.heading-line");
        gsap.set(headingLines, { yPercent: 110 });
        if (drawLineRef.current) gsap.set(drawLineRef.current, { drawSVG: "0%" });
        if (signRef.current) gsap.set(signRef.current, { drawSVG: "0%" });
        if (emailRef.current)
          gsap.set(emailRef.current, { clipPath: "inset(0 100% 0 0)", opacity: 1 });

        const introTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });

        if (kickerRef.current) {
          introTl.fromTo(
            kickerRef.current,
            { opacity: 0, letterSpacing: "0.6em" },
            {
              opacity: 1,
              letterSpacing: "0.3em",
              duration: 0.6,
              ease: EASINGS.cineOut,
              scrambleText: {
                text: "07 / Connect",
                chars: "upperCase",
                speed: 0.5,
                revealDelay: 0.1,
              },
            },
            0
          );
        }

        introTl.to(
          headingLines,
          { yPercent: 0, duration: 0.9, ease: EASINGS.cineOut, stagger: 0.1 },
          0.1
        );

        if (drawLineRef.current) {
          introTl.to(
            drawLineRef.current,
            { drawSVG: "100%", duration: 0.7, ease: EASINGS.cine },
            0.5
          );
        }

        if (emailRef.current) {
          introTl.to(
            emailRef.current,
            { clipPath: "inset(0 0% 0 0)", duration: 0.6, ease: EASINGS.cut },
            0.55
          );
        }

        if (signRef.current) {
          introTl.to(
            signRef.current,
            { drawSVG: "100%", duration: 0.7, ease: EASINGS.cine },
            0.75
          );
        }

        if (statusRef.current) {
          introTl.fromTo(
            statusRef.current,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: EASINGS.cineOut,
              scrambleText: { text: "OPEN TO WORK", chars: "upperCase", speed: 0.6 },
            },
            0.7
          );
        }

        // ---- Pinned closing scene: a deliberate, scrubbed settle ----
        // Pin the section once it is fully in frame and play the orbital-card
        // convergence plus the end-credits flourish as the user scrolls through.
        //
        // pinSpacing stays true (default) so the pin reserves its own scroll
        // length and the previous (Timeline) section cannot slide underneath
        // (no bleed). end is kept modest (+=70%) so the closing scene resolves to
        // its final frame without leaving a long, empty scrub tail.
        const sceneTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=70%",
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
          },
        });

        // Social cards — orbit converge into the grid (filmic settle)
        const orbitRadius = Math.min(window.innerWidth * 0.32, 420);
        socialCards.forEach((card, i) => {
          const totalCards = socialCards.length;
          const angle = (i / totalCards) * Math.PI * 2 - Math.PI / 2;
          const startX = Math.cos(angle) * orbitRadius;
          const startY = Math.sin(angle) * orbitRadius;
          const startRotation = (angle * 180) / Math.PI + gsap.utils.random(-18, 18);

          gsap.set(card, { x: startX, y: startY, scale: 0.3, opacity: 0, rotation: startRotation });

          sceneTl.to(
            card,
            {
              x: 0,
              y: 0,
              scale: 1,
              opacity: 1,
              rotation: 0,
              ease: EASINGS.cineOut,
              duration: 0.4,
            },
            0.04 + i * 0.05
          );
        });

        // Credits spine + final credit line settle in last
        if (drawSpineRef.current) {
          gsap.set(drawSpineRef.current, { drawSVG: "0%" });
          sceneTl.to(
            drawSpineRef.current,
            { drawSVG: "100%", duration: 0.35, ease: EASINGS.cine },
            0.5
          );
        }

        const creditLines = gsap.utils.toArray(".credit-line.outro-line");
        gsap.set(creditLines, { yPercent: 110 });
        sceneTl.to(
          creditLines,
          { yPercent: 0, duration: 0.35, ease: EASINGS.cineOut, stagger: 0.06 },
          0.6
        );

        // Section index scrambles to the final frame number
        if (indexRef.current) {
          sceneTl.fromTo(
            indexRef.current,
            { opacity: 0.2 },
            {
              opacity: 1,
              duration: 0.3,
              ease: EASINGS.cineOut,
              scrambleText: { text: "07 / 07", chars: "0123456789/", speed: 0.7 },
            },
            0.75
          );
        }

        // ---- Magnetic CTAs + hover micro-interactions (emerald accent) ----
        socialCards.forEach((card) => {
          const cleanup = applyMagneticEffect(card, {
            strength: 0.35,
            ease: 0.3,
            resetEase: 0.6,
            resetEaseType: "elastic.out(1, 0.4)",
          });
          magneticCleanups.push(cleanup);

          const icon = card.querySelector(".social-icon");
          const label = card.querySelector(".social-label");
          const circle = card.querySelector(".social-circle");

          card.addEventListener("mouseenter", () => {
            gsap.to(icon, { scale: 1.18, y: -3, color: EMERALD, duration: 0.3, ease: EASINGS.snappy });
            gsap.to(label, { y: 2, color: "#000", opacity: 1, duration: 0.2 });
            if (circle) gsap.to(circle, { scale: 1.12, borderColor: EMERALD, duration: 0.3, ease: EASINGS.cineOut });
            gsap.to(card, { y: -4, borderColor: EMERALD, duration: 0.3, ease: EASINGS.cineOut });
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(icon, { scale: 1, y: 0, color: "", duration: 0.4, ease: "elastic.out(1, 0.5)" });
            gsap.to(label, { y: 0, color: "", duration: 0.2 });
            if (circle) gsap.to(circle, { scale: 1, borderColor: "#e5e5e5", duration: 0.3 });
            gsap.to(card, { y: 0, borderColor: "#e5e5e5", duration: 0.3 });
          });
        });

        // Email hover — emerald underline grows, letter-spacing breathes
        if (emailRef.current) {
          const underline = signRef.current;
          emailRef.current.addEventListener("mouseenter", () => {
            gsap.to(emailRef.current, { letterSpacing: "0.06em", color: EMERALD, duration: 0.3, ease: EASINGS.snappy });
            if (underline) gsap.to(underline, { attr: { stroke: EMERALD }, duration: 0.3 });
          });
          emailRef.current.addEventListener("mouseleave", () => {
            gsap.to(emailRef.current, { letterSpacing: "0em", color: "#000", duration: 0.3 });
            if (underline) gsap.to(underline, { attr: { stroke: "#000000" }, duration: 0.3 });
          });
        }
      }, sectionRef);

      return () => {
        ctx.revert();
        magneticCleanups.forEach((cleanup) => cleanup());
        magneticCleanups = [];
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full bg-white flex items-center justify-center relative z-30 overflow-hidden py-16 md:py-0"
    >
      {/* Vertical grid lines */}
      <div className="hidden md:block absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-neutral-200 to-transparent" />
      <div className="hidden md:block absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-neutral-200 to-transparent" />

      {/* Main content */}
      <div ref={contentRef} className="relative z-10 text-center px-4 md:px-6">
        {/* Kicker (scramble readout) */}
        <span
          ref={kickerRef}
          className="connect-stagger font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] text-neutral-400 mb-6 md:mb-8 block"
        >
          07 / Connect
        </span>

        {/* Heading with masked line reveal */}
        <div className="overflow-hidden inline-block">
          <h2
            ref={headingRef}
            className="credit-line heading-line text-3xl md:text-5xl lg:text-8xl font-bold tracking-tight text-black mb-3 md:mb-4 will-change-transform"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Let's Connect
          </h2>
        </div>

        {/* DrawSVG flourish under heading (emerald accent) */}
        <div className="flex justify-center mb-6 md:mb-8">
          <svg
            width="220"
            height="14"
            viewBox="0 0 220 14"
            fill="none"
            className="overflow-visible"
            aria-hidden="true"
          >
            <path
              ref={drawLineRef}
              className="draw-path"
              d="M2 9 C 50 2, 90 2, 110 7 S 180 12, 218 5"
              stroke={EMERALD}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Email with clip-path wipe + signature underline draw */}
        <div className="relative inline-block mb-10 md:mb-14">
          <a
            ref={emailRef}
            href="mailto:niheshr03@gmail.com"
            className="connect-stagger email-link inline-block text-sm md:text-xl lg:text-3xl font-mono text-black break-all will-change-transform"
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

        {/* Status readout (scramble, emerald) */}
        <div className="connect-stagger flex items-center justify-center gap-2 mb-10 md:mb-12">
          <span className="block w-2 h-2 rounded-full" style={{ backgroundColor: EMERALD }} />
          <span
            ref={statusRef}
            className="font-mono text-[10px] md:text-xs uppercase tracking-[0.25em]"
            style={{ color: EMERALD }}
          >
            OPEN TO WORK
          </span>
        </div>

        {/* Social cards (orbital convergence) */}
        <div ref={linksRef} className="connect-stagger relative">
          <div ref={orbitRef} className="flex flex-wrap justify-center gap-4 md:gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                data-color={link.color}
                className="social-card magnetic-area group flex flex-col items-center gap-3 p-5 md:p-6 bg-white border border-neutral-200 rounded-2xl cursor-pointer will-change-transform"
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

        {/* Credits spine + outro line (masked reveals) */}
        <div className="mt-12 md:mt-16 flex flex-col items-center gap-4">
          <svg width="2" height="44" viewBox="0 0 2 44" className="hidden md:block" aria-hidden="true">
            <line
              ref={drawSpineRef}
              className="draw-path"
              x1="1"
              y1="0"
              x2="1"
              y2="44"
              stroke="#d4d4d4"
              strokeWidth="1.5"
            />
          </svg>
          <div className="overflow-hidden">
            <p className="credit-line outro-line font-mono text-[10px] md:text-xs text-neutral-400 uppercase tracking-wider md:tracking-widest will-change-transform">
              Built with React, GSAP, and attention to detail
            </p>
          </div>
          <div className="overflow-hidden">
            <p className="credit-line outro-line font-mono text-[10px] md:text-xs text-neutral-300 tracking-[0.3em] will-change-transform">
              FIN
            </p>
          </div>
        </div>
      </div>

      {/* Corner brackets */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 w-8 h-8 md:w-12 md:h-12 border-l border-t border-neutral-300" />
      <div className="absolute top-4 right-4 md:top-8 md:right-8 w-8 h-8 md:w-12 md:h-12 border-r border-t border-neutral-300" />
      <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 w-8 h-8 md:w-12 md:h-12 border-l border-b border-neutral-300" />
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-8 h-8 md:w-12 md:h-12 border-r border-b border-neutral-300" />

      {/* Section index (scramble readout) */}
      <div
        ref={indexRef}
        className="absolute bottom-4 right-12 md:bottom-8 md:right-16 font-mono text-[10px] md:text-xs text-neutral-400 tracking-widest"
      >
        07 / 07
      </div>
    </section>
  );
}

export default ScrollConnectSection;
