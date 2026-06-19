import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger, BREAKPOINTS, EASINGS } from "../../utils/gsapConfig";
import { splitText, revertSplit } from "../../utils/textSplit";
import { experience } from "../../data/experience";

function ScrollTimelineSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsContainerRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    let titleSplit = null;

    // Reduced motion
    mm.add(BREAKPOINTS.reducedMotion, () => {
      const items = sectionRef.current?.querySelectorAll(".exp-card");
      if (items) gsap.set(items, { opacity: 1, y: 0 });
      return () => {};
    });

    // Mobile
    mm.add(BREAKPOINTS.mobile, () => {
      const ctx = gsap.context(() => {
        requestAnimationFrame(() => {
          const cards = gsap.utils.toArray(".exp-card");

          gsap.fromTo(titleRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: EASINGS.smooth,
              scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none reverse" },
            }
          );

          cards.forEach((card, i) => {
            const logo = card.querySelector(".exp-logo");
            const details = card.querySelector(".exp-details");
            const skills = card.querySelectorAll(".exp-skill");

            gsap.fromTo(card,
              { y: 60, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, ease: EASINGS.smooth,
                scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reverse" },
              }
            );

            if (logo) {
              gsap.fromTo(logo,
                { scale: 0, rotation: -180 },
                { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2)",
                  scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" },
                }
              );
            }

            if (skills.length > 0) {
              gsap.fromTo(skills,
                { y: 15, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.05, duration: 0.3, ease: EASINGS.snappy,
                  scrollTrigger: { trigger: card, start: "top 75%", toggleActions: "play none none reverse" },
                }
              );
            }
          });
        });
      }, sectionRef);
      return () => ctx.revert();
    });

    // Tablet
    mm.add(BREAKPOINTS.tablet, () => {
      const ctx = gsap.context(() => {
        requestAnimationFrame(() => {
          const cards = gsap.utils.toArray(".exp-card");

          gsap.fromTo(titleRef.current,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: EASINGS.smooth,
              scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none reverse" },
            }
          );

          cards.forEach((card, i) => {
            const logo = card.querySelector(".exp-logo");
            const skills = card.querySelectorAll(".exp-skill");
            const isEven = i % 2 === 0;

            gsap.fromTo(card,
              { x: isEven ? -80 : 80, opacity: 0, rotateY: isEven ? -8 : 8 },
              { x: 0, opacity: 1, rotateY: 0, duration: 1, ease: EASINGS.smooth,
                scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" },
              }
            );

            if (logo) {
              gsap.fromTo(logo, { scale: 0 }, { scale: 1, duration: 0.5, ease: "back.out(2)",
                scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none reverse" },
              });
            }

            if (skills.length > 0) {
              gsap.fromTo(skills,
                { y: 20, opacity: 0, scale: 0.8 },
                { y: 0, opacity: 1, scale: 1, stagger: 0.06, duration: 0.4, ease: "back.out(1.5)",
                  scrollTrigger: { trigger: card, start: "top 70%", toggleActions: "play none none reverse" },
                }
              );
            }
          });
        });
      }, sectionRef);
      return () => ctx.revert();
    });

    // Desktop — magazine-style layout
    mm.add(BREAKPOINTS.desktop, () => {
      const ctx = gsap.context(() => {
        requestAnimationFrame(() => {
          const cards = gsap.utils.toArray(".exp-card");

          // Title char animation
          if (titleRef.current) {
            titleSplit = splitText(titleRef.current, { type: "chars" });
            gsap.fromTo(titleSplit.chars,
              { opacity: 0, y: 80, rotateX: -60, transformOrigin: "bottom center" },
              { opacity: 1, y: 0, rotateX: 0, duration: 0.8, stagger: 0.04, ease: EASINGS.snappy,
                scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none reverse" },
              }
            );
          }

          // Cards — dramatic entrances
          cards.forEach((card, i) => {
            const logo = card.querySelector(".exp-logo");
            const period = card.querySelector(".exp-period");
            const company = card.querySelector(".exp-company");
            const role = card.querySelector(".exp-role");
            const description = card.querySelector(".exp-description");
            const skills = card.querySelectorAll(".exp-skill");
            const stripe = card.querySelector(".exp-stripe");
            const watermark = card.querySelector(".exp-watermark");

            // Card entrance — slide from left with 3D
            const tl = gsap.timeline({
              scrollTrigger: { trigger: card, start: "top 80%", toggleActions: "play none none reverse" },
            });

            tl.fromTo(card,
              { x: -150, opacity: 0, rotateY: -15, transformOrigin: "left center" },
              { x: 0, opacity: 1, rotateY: 0, duration: 1, ease: EASINGS.smooth }
            );

            // Stripe line draws in
            if (stripe) {
              tl.fromTo(stripe,
                { scaleX: 0, transformOrigin: "left" },
                { scaleX: 1, duration: 0.6, ease: "power3.out" },
                "-=0.6"
              );
            }

            // Logo spin-in
            if (logo) {
              tl.fromTo(logo,
                { scale: 0, rotation: -270, opacity: 0 },
                { scale: 1, rotation: 0, opacity: 1, duration: 0.7, ease: "back.out(2)" },
                "-=0.7"
              );
            }

            // Period badge drops in
            if (period) {
              tl.fromTo(period,
                { y: -40, opacity: 0, scale: 0.8 },
                { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" },
                "-=0.5"
              );
            }

            // Company name slides in
            if (company) {
              tl.fromTo(company,
                { x: -60, opacity: 0, skewX: -5 },
                { x: 0, opacity: 1, skewX: 0, duration: 0.6, ease: EASINGS.smooth },
                "-=0.4"
              );
            }

            // Role
            if (role) {
              tl.fromTo(role,
                { x: -30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.4, ease: EASINGS.smooth },
                "-=0.3"
              );
            }

            // Description
            if (description) {
              tl.fromTo(description,
                { y: 25, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: EASINGS.smooth },
                "-=0.2"
              );
            }

            // Skills — scatter from random positions
            if (skills.length > 0) {
              Array.from(skills).forEach((skill, si) => {
                const randX = gsap.utils.random(-60, 60);
                const randY = gsap.utils.random(20, 50);
                const randRot = gsap.utils.random(-15, 15);

                tl.fromTo(skill,
                  { x: randX, y: randY, scale: 0.5, opacity: 0, rotation: randRot },
                  { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: "back.out(1.8)" },
                  `-=${0.4 - si * 0.02}`
                );
              });
            }

            // Watermark
            if (watermark) {
              gsap.fromTo(watermark,
                { y: 80, opacity: 0 },
                { y: -40, opacity: 1, ease: "none",
                  scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 2 },
                }
              );
            }

            // Hover effect
            card.addEventListener("mouseenter", () => {
              gsap.to(card, { y: -8, scale: 1.02, boxShadow: "0 30px 60px -12px rgba(0,0,0,0.15)", duration: 0.4, ease: EASINGS.smooth });
              if (stripe) gsap.to(stripe, { height: "100%", duration: 0.4, ease: EASINGS.smooth });
            });
            card.addEventListener("mouseleave", () => {
              gsap.to(card, { y: 0, scale: 1, boxShadow: "0 4px 24px -4px rgba(0,0,0,0.06)", duration: 0.5, ease: EASINGS.smooth });
              if (stripe) gsap.to(stripe, { height: "4px", duration: 0.4, ease: EASINGS.smooth });
            });
          });
        });
      }, sectionRef);

      return () => {
        ctx.revert();
        if (titleRef.current) revertSplit(titleRef.current);
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen w-full bg-neutral-50 py-20 md:py-32 px-4 md:px-8 lg:px-16 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
        <div className="absolute top-1/3 right-0 w-40 h-40 bg-gradient-to-bl from-neutral-100 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-60 h-60 bg-gradient-to-tr from-neutral-100 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 md:mb-24">
          <div className="flex items-center gap-4 md:gap-6 mb-6">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">06</span>
            <div className="flex-1 h-px bg-neutral-300" />
          </div>
          <h2 ref={titleRef}
            className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight text-neutral-900"
            style={{ fontFamily: "Space Grotesk, sans-serif", perspective: "1000px" }}
          >
            Experience
          </h2>
          <p className="mt-4 md:mt-6 font-mono text-xs md:text-sm text-neutral-500 max-w-lg">
            Building real products with real teams. Here's what I've been up to.
          </p>
        </div>

        {/* Experience cards */}
        <div ref={cardsContainerRef} className="space-y-8 md:space-y-12">
          {experience.map((job, i) => (
            <div
              key={i}
              className="exp-card relative bg-white rounded-2xl overflow-hidden transition-shadow duration-500"
              style={{
                perspective: "1200px",
                boxShadow: "0 4px 24px -4px rgba(0,0,0,0.06)",
              }}
            >
              {/* Top accent stripe */}
              <div className="exp-stripe absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-400" />

              <div className="p-6 md:p-10 lg:p-12">
                <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                  {/* Logo column */}
                  <div className="shrink-0 flex items-start">
                    {job.logo && (
                      <div className="exp-logo w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-neutral-50 border border-neutral-200 p-3 flex items-center justify-center shadow-sm">
                        <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>

                  {/* Details column */}
                  <div className="exp-details flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                      <h3 className="exp-company text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight"
                        style={{ fontFamily: "Space Grotesk, sans-serif" }}
                      >
                        {job.company}
                      </h3>
                      <span className="exp-period font-mono text-[10px] md:text-xs uppercase tracking-widest text-neutral-400 bg-neutral-100 px-3 py-1.5 rounded-full w-fit">
                        {job.period}
                      </span>
                    </div>

                    <p className="exp-role text-base md:text-lg text-neutral-600 font-medium mb-4 md:mb-6">
                      {job.role}
                    </p>

                    <div className="w-12 h-px bg-neutral-200 mb-4 md:mb-6" />

                    <p className="exp-description text-sm md:text-base text-neutral-500 leading-relaxed mb-6 md:mb-8 max-w-2xl">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {job.skills?.map((skill) => (
                        <span
                          key={skill}
                          className="exp-skill px-3 py-1.5 text-xs font-mono bg-neutral-900 text-white rounded-lg hover:bg-neutral-700 transition-colors cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {job.link && (
                      <a href={job.link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-6 md:mt-8 px-5 py-2.5 bg-neutral-900 text-white text-xs font-mono uppercase tracking-wider rounded-lg hover:bg-neutral-700 transition-colors group"
                      >
                        <span>Visit Company</span>
                        <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Watermark */}
              <span className="exp-watermark hidden lg:block absolute -right-6 -bottom-8 text-[12rem] font-black text-neutral-50 leading-none pointer-events-none select-none">
                0{i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 font-mono text-xs text-neutral-400 tracking-widest">
        06 / 07
      </div>
    </section>
  );
}

export default ScrollTimelineSection;
