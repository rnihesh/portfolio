import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger, BREAKPOINTS, EASINGS } from "../../utils/gsapConfig";
import { applyMagneticEffect } from "../../hooks/useMagnetic";
import { splitText, revertSplit } from "../../utils/textSplit";
import { LuGithub, LuLinkedin, LuMail, LuPhone } from "react-icons/lu";
import { FaXTwitter } from "react-icons/fa6";

function ScrollConnectSection() {
  const sectionRef = useRef(null);
  const bgTextRef = useRef(null);
  const contentRef = useRef(null);
  const linksRef = useRef(null);
  const headingRef = useRef(null);
  const orbitRef = useRef(null);

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
    let headingSplit = null;

    // Reduced motion
    mm.add(BREAKPOINTS.reducedMotion, () => {
      gsap.set(contentRef.current, { opacity: 1, y: 0 });
      const socialItems = sectionRef.current?.querySelectorAll(".social-card");
      if (socialItems) gsap.set(socialItems, { opacity: 1, y: 0, scale: 1, x: 0, rotation: 0 });
      return () => {};
    });

    // Mobile
    mm.add(BREAKPOINTS.mobile, () => {
      const ctx = gsap.context(() => {
        const socialCards = gsap.utils.toArray(".social-card");

        gsap.fromTo(contentRef.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: EASINGS.smooth,
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none reverse" },
          }
        );

        // Stagger in from bottom with slight scale
        gsap.fromTo(socialCards,
          { y: 40, opacity: 0, scale: 0.85 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)", stagger: 0.08,
            scrollTrigger: { trigger: linksRef.current, start: "top 85%", toggleActions: "play none none reverse" },
          }
        );
      }, sectionRef);
      return () => ctx.revert();
    });

    // Tablet
    mm.add(BREAKPOINTS.tablet, () => {
      const ctx = gsap.context(() => {
        const socialCards = gsap.utils.toArray(".social-card");

        gsap.fromTo(contentRef.current,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: EASINGS.smooth,
            scrollTrigger: { trigger: sectionRef.current, start: "top 65%", toggleActions: "play none none reverse" },
          }
        );

        // Cards spiral in from their orbit positions 
        socialCards.forEach((card, i) => {
          const angle = (i / socialCards.length) * Math.PI * 2 - Math.PI / 2;
          const radius = 200;
          const startX = Math.cos(angle) * radius;
          const startY = Math.sin(angle) * radius;

          gsap.fromTo(card,
            { x: startX, y: startY, opacity: 0, scale: 0.5, rotation: gsap.utils.random(-30, 30) },
            { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0,
              duration: 0.8, ease: "back.out(1.5)", delay: i * 0.1,
              scrollTrigger: { trigger: linksRef.current, start: "top 80%", toggleActions: "play none none reverse" },
            }
          );
        });
      }, sectionRef);
      return () => ctx.revert();
    });

    // Desktop — orbital convergence entrance
    mm.add(BREAKPOINTS.desktop, () => {
      const ctx = gsap.context(() => {
        const socialCards = gsap.utils.toArray(".social-card");

        // Background text zoom
        if (bgTextRef.current) {
          gsap.fromTo(bgTextRef.current,
            { scale: 0.4, opacity: 0 },
            { scale: 1.1, opacity: 0.04, ease: "none",
              scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 },
            }
          );
        }

        // Heading — char animation
        if (headingRef.current) {
          headingSplit = splitText(headingRef.current, { type: "chars" });
          gsap.set(headingSplit.chars, { opacity: 0, y: 80, rotateX: -60, transformOrigin: "bottom center" });

          gsap.to(headingSplit.chars, {
            opacity: 1, y: 0, rotateX: 0,
            duration: 0.8, ease: EASINGS.snappy,
            stagger: { each: 0.04, from: "center" },
            scrollTrigger: { trigger: sectionRef.current, start: "top 55%", toggleActions: "play none none reverse" },
          });
        }

        // Content stagger
        const contentElements = contentRef.current?.querySelectorAll(".connect-stagger");
        if (contentElements) {
          gsap.fromTo(contentElements,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: EASINGS.smooth, stagger: 0.15,
              scrollTrigger: { trigger: sectionRef.current, start: "top 55%", toggleActions: "play none none reverse" },
            }
          );
        }

        // Social cards — orbit → converge to grid
        // Each card starts in a circular orbit position around the center, 
        // then spirals inward with decreasing rotation to settle into its final grid position.
        const orbitRadius = Math.min(window.innerWidth * 0.35, 450);

        socialCards.forEach((card, i) => {
          const totalCards = socialCards.length;
          const angle = (i / totalCards) * Math.PI * 2 - Math.PI / 2;
          const startX = Math.cos(angle) * orbitRadius;
          const startY = Math.sin(angle) * orbitRadius;
          const startRotation = (angle * 180 / Math.PI) + gsap.utils.random(-20, 20);

          gsap.set(card, {
            x: startX, y: startY,
            scale: 0.3, opacity: 0,
            rotation: startRotation,
          });

          // Scrub-driven convergence
          gsap.to(card, {
            x: 0, y: 0,
            scale: 1, opacity: 1,
            rotation: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: linksRef.current,
              start: "top 90%",
              end: "top 45%",
              scrub: 1,
            },
          });
        });

        // Magnetic effect + hover
        socialCards.forEach((card) => {
          const cleanup = applyMagneticEffect(card, {
            strength: 0.35, ease: 0.3,
            resetEase: 0.6, resetEaseType: "elastic.out(1, 0.4)",
          });
          magneticCleanups.push(cleanup);

          const icon = card.querySelector(".social-icon");
          const label = card.querySelector(".social-label");
          const circle = card.querySelector(".social-circle");
          const accentColor = card.dataset.color || "#000";

          card.addEventListener("mouseenter", () => {
            gsap.to(icon, { scale: 1.2, y: -3, duration: 0.3, ease: EASINGS.snappy });
            gsap.to(label, { y: 2, opacity: 1, duration: 0.2 });
            if (circle) gsap.to(circle, { scale: 1.15, borderColor: accentColor, duration: 0.3 });
            gsap.to(card, { boxShadow: `0 20px 45px -10px ${accentColor}33`, duration: 0.3 });
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(icon, { scale: 1, y: 0, duration: 0.4, ease: "elastic.out(1, 0.5)" });
            gsap.to(label, { y: 0, duration: 0.2 });
            if (circle) gsap.to(circle, { scale: 1, borderColor: "#e5e5e5", duration: 0.3 });
            gsap.to(card, { boxShadow: "0 4px 20px -4px rgba(0,0,0,0.06)", duration: 0.3 });
          });
        });

        // Email hover
        const emailLink = sectionRef.current.querySelector(".email-link");
        if (emailLink) {
          emailLink.addEventListener("mouseenter", () => {
            gsap.to(emailLink, { letterSpacing: "0.12em", duration: 0.3, ease: EASINGS.snappy });
          });
          emailLink.addEventListener("mouseleave", () => {
            gsap.to(emailLink, { letterSpacing: "0em", duration: 0.3 });
          });
        }
      }, sectionRef);

      return () => {
        ctx.revert();
        magneticCleanups.forEach((cleanup) => cleanup());
        if (headingRef.current) revertSplit(headingRef.current);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen w-full bg-white flex items-center justify-center relative overflow-hidden py-16 md:py-0">
      {/* Background text */}
      <div ref={bgTextRef}
        className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span className="text-[30vw] font-black text-black tracking-tighter whitespace-nowrap" style={{ opacity: 0.04 }}>
          SAY HI
        </span>
      </div>

      {/* Grid lines */}
      <div className="hidden md:block absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-neutral-200 to-transparent" />
      <div className="hidden md:block absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-neutral-200 to-transparent" />

      {/* Main content */}
      <div ref={contentRef} className="relative z-10 text-center px-4 md:px-6">
        <span className="connect-stagger font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] text-neutral-400 mb-6 md:mb-8 block">
          07 / Connect
        </span>

        <h2 ref={headingRef}
          className="text-3xl md:text-5xl lg:text-8xl font-bold tracking-tight text-black mb-6 md:mb-8"
          style={{ fontFamily: "Space Grotesk, sans-serif", perspective: "1000px" }}
        >
          Let's Connect
        </h2>

        <a href="mailto:niheshr03@gmail.com"
          className="connect-stagger email-link inline-block text-sm md:text-xl lg:text-3xl font-mono text-black mb-10 md:mb-14 border-b-2 border-black pb-1 md:pb-2 transition-all break-all"
        >
          niheshr03@gmail.com
        </a>

        {/* Social cards — orbit convergence */}
        <div ref={linksRef} className="connect-stagger relative">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                data-color={link.color}
                className="social-card magnetic-area group flex flex-col items-center gap-3 p-5 md:p-6 bg-white border border-neutral-200 rounded-2xl transition-all cursor-pointer"
                style={{ boxShadow: "0 4px 20px -4px rgba(0,0,0,0.06)" }}
              >
                <div className="social-circle w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-neutral-200 flex items-center justify-center transition-colors">
                  <div className="social-icon text-neutral-700 group-hover:text-black transition-colors">
                    <link.icon size={22} className="md:w-6 md:h-6" />
                  </div>
                </div>
                <span className="social-label font-mono text-[10px] md:text-xs uppercase tracking-wider text-neutral-500 group-hover:text-black transition-colors">
                  {link.label}
                </span>
              </a>
            ))}
          </div>
        </div>

        <p className="connect-stagger mt-12 md:mt-16 font-mono text-[10px] md:text-xs text-neutral-400 uppercase tracking-wider md:tracking-widest">
          Built with React, GSAP, and attention to detail
        </p>
      </div>

      {/* Corner brackets */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 w-8 h-8 md:w-12 md:h-12 border-l border-t border-neutral-300" />
      <div className="absolute top-4 right-4 md:top-8 md:right-8 w-8 h-8 md:w-12 md:h-12 border-r border-t border-neutral-300" />
      <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 w-8 h-8 md:w-12 md:h-12 border-l border-b border-neutral-300" />
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-8 h-8 md:w-12 md:h-12 border-r border-b border-neutral-300" />

      <div className="absolute bottom-4 right-12 md:bottom-8 md:right-16 font-mono text-[10px] md:text-xs text-neutral-400 tracking-widest">
        07 / 07
      </div>
    </section>
  );
}

export default ScrollConnectSection;
