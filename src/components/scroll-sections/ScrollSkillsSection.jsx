import { useRef, useEffect } from "react";
import {
  gsap,
  ScrollTrigger,
  BREAKPOINTS,
  EASINGS,
  scrollVelocity,
} from "../../utils/gsapConfig";
import { applyMagneticEffect } from "../../hooks/useMagnetic";
import { splitText, revertSplit } from "../../utils/textSplit";
import { skills } from "../../data/skills";

function ScrollSkillsSection() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const titleRef = useRef(null);
  const marqueeRef = useRef(null);

  // Group skills by category
  const categories = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  // Create marquee text from skill names
  const marqueeText = skills.map((s) => s.name).join(" • ");

  useEffect(() => {
    const mm = gsap.matchMedia();
    let magneticCleanups = [];
    let titleSplit = null;
    let velocityUnsubscribe = null;

    // Reduced motion
    mm.add(BREAKPOINTS.reducedMotion, () => {
      const skillItems = sectionRef.current?.querySelectorAll(".skill-item");
      const categoryHeaders = sectionRef.current?.querySelectorAll(".category-header");
      gsap.set(titleRef.current, { opacity: 1, y: 0 });
      if (skillItems) gsap.set(skillItems, { opacity: 1, scale: 1, rotation: 0 });
      if (categoryHeaders) gsap.set(categoryHeaders, { opacity: 1, x: 0 });
      return () => {};
    });

    // Mobile animations
    mm.add(BREAKPOINTS.mobile, () => {
      const ctx = gsap.context(() => {
        const skillItems = gsap.utils.toArray(".skill-item");
        const categoryHeaders = gsap.utils.toArray(".category-header");

        gsap.fromTo(
          titleRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, ease: EASINGS.smooth,
            scrollTrigger: {
              trigger: sectionRef.current, start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          categoryHeaders,
          { x: -30, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.6, ease: EASINGS.smooth,
            stagger: 0.1,
            scrollTrigger: {
              trigger: gridRef.current, start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Scrub-driven wave reveal for skill items
        skillItems.forEach((item, i) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 30, scale: 0.9 },
            {
              opacity: 1, y: 0, scale: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 92%",
                end: "top 70%",
                scrub: 1,
              },
            }
          );
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    // Tablet animations
    mm.add(BREAKPOINTS.tablet, () => {
      const ctx = gsap.context(() => {
        const skillItems = gsap.utils.toArray(".skill-item");
        const categoryHeaders = gsap.utils.toArray(".category-header");

        gsap.fromTo(
          titleRef.current,
          { y: 80, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: EASINGS.smooth,
            scrollTrigger: {
              trigger: sectionRef.current, start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          categoryHeaders,
          { x: -40, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.7, ease: EASINGS.smooth,
            stagger: 0.1,
            scrollTrigger: {
              trigger: gridRef.current, start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Scrub-driven wave with rotation
        skillItems.forEach((item, i) => {
          gsap.fromTo(
            item,
            { scale: 0.7, opacity: 0, rotateY: -25 },
            {
              scale: 1, opacity: 1, rotateY: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 90%",
                end: "top 65%",
                scrub: 1,
              },
            }
          );
        });

        gsap.to(gridRef.current, {
          yPercent: -4, ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current, start: "top bottom", end: "bottom top",
            scrub: 1.5,
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    // Desktop — full cinematic experience
    mm.add(BREAKPOINTS.desktop, () => {
      const ctx = gsap.context(() => {
        const skillItems = gsap.utils.toArray(".skill-item");
        const categoryBlocks = gsap.utils.toArray(".category-block");

        // Split title for character animation
        if (titleRef.current) {
          const titleElement = titleRef.current.querySelector("h2");
          if (titleElement) {
            titleSplit = splitText(titleElement, { type: "chars" });

            gsap.set(titleSplit.chars, {
              opacity: 0, y: 100, rotateX: -90,
              transformOrigin: "bottom center",
            });

            gsap.to(titleSplit.chars, {
              opacity: 1, y: 0, rotateX: 0, duration: 0.8,
              stagger: { each: 0.03, from: "start" },
              ease: EASINGS.snappy,
              scrollTrigger: {
                trigger: sectionRef.current, start: "top 80%",
                toggleActions: "play none none reverse",
              },
            });
          }
        }

        // Start velocity tracking for skew
        scrollVelocity.start();

        // Category blocks with scrub-driven wave stagger
        categoryBlocks.forEach((block, blockIndex) => {
          const header = block.querySelector(".category-header");
          const items = block.querySelectorAll(".skill-item");
          const line = block.querySelector(".category-line");

          // Line draw — scrub-driven
          if (line) {
            gsap.fromTo(
              line,
              { scaleX: 0, transformOrigin: "left" },
              {
                scaleX: 1, ease: "none",
                scrollTrigger: {
                  trigger: block, start: "top 80%", end: "top 60%",
                  scrub: 1,
                },
              }
            );
          }

          // Header slide
          if (header) {
            gsap.fromTo(
              header,
              { x: -60, opacity: 0 },
              {
                x: 0, opacity: 1, duration: 0.6, ease: EASINGS.smooth,
                scrollTrigger: {
                  trigger: block, start: "top 78%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }

          // Skill items — scrub-driven 3D flip entrance
          if (items.length > 0) {
            Array.from(items).forEach((item, i) => {
              gsap.fromTo(
                item,
                {
                  rotateY: -90,
                  scale: 0.6,
                  opacity: 0,
                  transformOrigin: "left center",
                },
                {
                  rotateY: 0,
                  scale: 1,
                  opacity: 1,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: item,
                    start: "top 90%",
                    end: "top 65%",
                    scrub: 1,
                  },
                }
              );

              // After entrance, continuous subtle float
              gsap.to(item, {
                y: gsap.utils.random(-4, 4),
                duration: gsap.utils.random(2, 4),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.15,
              });
            });
          }
        });

        // Magnetic hover + 3D tilt for each skill item
        skillItems.forEach((item) => {
          const cleanup = applyMagneticEffect(item, {
            strength: 0.25, ease: 0.25,
            resetEase: 0.5, resetEaseType: "power3.out",
          });
          magneticCleanups.push(cleanup);

          const icon = item.querySelector("img");
          const name = item.querySelector(".skill-name");

          item.addEventListener("mouseenter", () => {
            gsap.to(item, {
              scale: 1.12,
              boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
              borderColor: "rgba(255,255,255,0.4)",
              duration: 0.3, ease: EASINGS.smooth,
            });
            if (name) gsap.to(name, { color: "#fff", duration: 0.2 });
          });

          item.addEventListener("mousemove", (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((x - centerX) / centerX) * 15;

            gsap.to(item, {
              rotateX, rotateY,
              duration: 0.3, ease: "power2.out",
            });

            if (icon) {
              gsap.to(icon, {
                x: ((x - centerX) / centerX) * -12,
                y: ((y - centerY) / centerY) * -12,
                scale: 1.25,
                duration: 0.3, ease: "power2.out",
              });
            }
          });

          item.addEventListener("mouseleave", () => {
            gsap.to(item, {
              scale: 1, rotateX: 0, rotateY: 0,
              boxShadow: "none",
              borderColor: "rgba(64,64,64,1)",
              duration: 0.5, ease: "power3.out",
            });
            if (icon) {
              gsap.to(icon, { x: 0, y: 0, scale: 1, duration: 0.5, ease: "power3.out" });
            }
            if (name) gsap.to(name, { color: "rgb(212 212 212)", duration: 0.3 });
          });
        });

        // Velocity-reactive marquee speed
        let marqueeTween = null;
        if (marqueeRef.current) {
          marqueeTween = gsap.to(marqueeRef.current, {
            x: "-50%", ease: "none", duration: 40, repeat: -1,
          });
        }

        // Velocity-driven grid skew
        velocityUnsubscribe = scrollVelocity.subscribe(() => {
          const normalizedVelocity = scrollVelocity.getNormalizedVelocity(1500);
          const skewAmount = normalizedVelocity * 3 * Math.sign(scrollVelocity.velocity);

          if (gridRef.current) {
            gsap.to(gridRef.current, {
              skewY: skewAmount,
              duration: 0.2,
              ease: "power1.out",
              overwrite: "auto",
            });
          }

          // Marquee speed boost — use tween method, not property
          if (marqueeTween) {
            const speedMultiplier = 1 + normalizedVelocity * 3;
            marqueeTween.timeScale(speedMultiplier);
          }
        });

        // Parallax grid
        gsap.to(gridRef.current, {
          yPercent: -6, ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current, start: "top bottom", end: "bottom top",
            scrub: 1,
          },
        });
      }, sectionRef);

      return () => {
        ctx.revert();
        magneticCleanups.forEach((cleanup) => cleanup());
        magneticCleanups = [];
        if (velocityUnsubscribe) velocityUnsubscribe();
        scrollVelocity.stop();
        if (titleRef.current) {
          const titleElement = titleRef.current.querySelector("h2");
          if (titleElement) revertSplit(titleElement);
        }
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full bg-neutral-950 py-16 md:py-24 relative overflow-hidden"
    >
      {/* Background gradient mesh */}
      <div className="gradient-mesh absolute inset-0 pointer-events-none opacity-50" />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />

      {/* Large background text */}
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden">
        <span className="text-[20vw] font-black text-neutral-900 tracking-tighter opacity-40 stroke-text">
          SKILLS
        </span>
      </div>

      {/* Marquee */}
      <div className="hidden lg:block absolute top-16 left-0 w-full overflow-hidden opacity-10">
        <div
          ref={marqueeRef}
          className="whitespace-nowrap font-mono text-sm text-neutral-500 uppercase tracking-widest"
          style={{ width: "200%" }}
        >
          {marqueeText} • {marqueeText} •{" "}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Section header */}
        <div ref={titleRef} className="mb-8 md:mb-16" style={{ perspective: "1000px" }}>
          <div className="flex items-center gap-4 md:gap-6 mb-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] text-neutral-500">
              03
            </span>
            <div className="flex-1 h-px bg-neutral-800" />
          </div>
          <h2
            className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Skills
          </h2>
          <p className="mt-3 md:mt-4 text-neutral-400 font-mono text-xs md:text-sm max-w-xl">
            Technologies and tools I work with to bring ideas to life.
          </p>
        </div>

        {/* Skills grid by category */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          style={{ perspective: "1200px" }}
        >
          {Object.entries(categories).map(([category, categorySkills], catIndex) => (
            <div key={category} className="category-block space-y-4">
              <div className="category-line h-px w-full bg-gradient-to-r from-neutral-600 to-transparent mb-2" />

              <div className="category-header flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full pulse-glow" />
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400">
                  {category}
                </h3>
                <span className="font-mono text-[10px] text-neutral-600">
                  ({categorySkills.length})
                </span>
              </div>

              <div className="flex flex-wrap gap-2 md:grid md:grid-cols-2 md:gap-3">
                {categorySkills.map((skill, skillIndex) => (
                  <div
                    key={skill.name}
                    className="skill-item group relative p-2 md:p-4 border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800/80 transition-colors cursor-default"
                    style={{
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center relative">
                        <img
                          src={skill.image}
                          alt={skill.name}
                          className="w-4 h-4 md:w-6 md:h-6 object-contain invert opacity-70 group-hover:opacity-100 transition-opacity"
                          style={{ transform: "translateZ(20px)" }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                      <span className="skill-name text-xs md:text-sm text-neutral-300 group-hover:text-white transition-colors">
                        {skill.name}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-px bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                    <div className="hidden md:block absolute bottom-0 right-0 w-3 h-3 border-r border-b border-neutral-700 group-hover:border-neutral-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="hidden md:block absolute top-8 right-8 w-16 h-16 border-r border-t border-neutral-800" />
      <div className="hidden md:block absolute bottom-8 left-8 w-16 h-16 border-l border-b border-neutral-800" />

      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 font-mono text-[10px] md:text-xs text-neutral-600 tracking-widest">
        03 / 07
      </div>
    </section>
  );
}

export default ScrollSkillsSection;
