import { useRef, useEffect, useState } from "react";
import {
  gsap,
  ScrollTrigger,
  BREAKPOINTS,
  EASINGS,
  scrollVelocity,
} from "../../utils/gsapConfig";
import { splitText, revertSplit } from "../../utils/textSplit";
import { projects } from "../../data/projects";

function ScrollProjectsSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const galleryContainerRef = useRef(null);
  const titleRef = useRef(null);
  const counterRef = useRef(null);
  const [layout, setLayout] = useState("desktop");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Reduced motion
    mm.add(BREAKPOINTS.reducedMotion, () => {
      gsap.set(headerRef.current, { opacity: 1, y: 0 });
      const cards = sectionRef.current?.querySelectorAll(".project-card, .gallery-item");
      if (cards) gsap.set(cards, { opacity: 1, y: 0, x: 0, rotation: 0 });
      return () => {};
    });

    // Mobile
    mm.add(BREAKPOINTS.mobile, () => {
      setLayout("mobile");
      const ctx = gsap.context(() => {
        requestAnimationFrame(() => {
          const projectCards = gsap.utils.toArray(".project-card-mobile");

          gsap.fromTo(headerRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: EASINGS.smooth,
              scrollTrigger: { trigger: sectionRef.current, start: "top 85%", toggleActions: "play none none reverse" },
            }
          );

          projectCards.forEach((card, i) => {
            const isEven = i % 2 === 0;
            const imageContainer = card.querySelector(".project-image-container");
            const content = card.querySelector(".project-content-mobile");

            // Alternating side entrance
            gsap.fromTo(card,
              { x: isEven ? -80 : 80, opacity: 0, rotation: isEven ? -3 : 3 },
              {
                x: 0, opacity: 1, rotation: 0,
                duration: 0.8, ease: EASINGS.smooth,
                scrollTrigger: { trigger: card, start: "top 90%", toggleActions: "play none none reverse" },
              }
            );

            if (imageContainer) {
              gsap.fromTo(imageContainer,
                { clipPath: isEven ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" },
                { clipPath: "inset(0 0% 0 0%)", duration: 0.8, ease: "power3.inOut",
                  scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" },
                },
              );
            }
          });
        });
      }, sectionRef);
      return () => ctx.revert();
    });

    // Tablet
    mm.add(BREAKPOINTS.tablet, () => {
      setLayout("mobile");
      const ctx = gsap.context(() => {
        requestAnimationFrame(() => {
          const projectCards = gsap.utils.toArray(".project-card-mobile");

          gsap.fromTo(headerRef.current,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, ease: EASINGS.smooth,
              scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none reverse" },
            }
          );

          projectCards.forEach((card, i) => {
            const isEven = i % 2 === 0;

            gsap.fromTo(card,
              { x: isEven ? -120 : 120, opacity: 0, rotation: isEven ? -4 : 4 },
              {
                x: 0, opacity: 1, rotation: 0,
                duration: 1, ease: EASINGS.smooth,
                scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" },
              }
            );
          });
        });
      }, sectionRef);
      return () => ctx.revert();
    });

    // Desktop — horizontal gallery with alternating entrances + random fly-off
    mm.add(BREAKPOINTS.desktop, () => {
      setLayout("desktop");
      let titleSplit = null;
      let velocityUnsubscribe = null;

      const ctx = gsap.context(() => {
        requestAnimationFrame(() => {
          const container = galleryContainerRef.current;
          const galleryItems = gsap.utils.toArray(".gallery-item");
          if (!container) return;

          const totalWidth = container.scrollWidth - window.innerWidth;

          // Title split
          if (titleRef.current) {
            titleSplit = splitText(titleRef.current, { type: "chars" });
            gsap.set(titleSplit.chars, { opacity: 0, y: 80, rotateX: -90, transformOrigin: "bottom center" });
          }

          scrollVelocity.start();

          // Header
          const headerTl = gsap.timeline({
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none reverse" },
          });

          if (titleSplit?.chars.length > 0) {
            headerTl.to(titleSplit.chars, {
              opacity: 1, y: 0, rotateX: 0, duration: 0.8,
              stagger: { each: 0.04, from: "start" }, ease: EASINGS.snappy,
            });
          }

          // Horizontal scroll
          const scrollTween = gsap.to(container, {
            x: -totalWidth,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: () => `+=${totalWidth + window.innerWidth}`,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onEnter: () => gsap.set(container, { willChange: "transform" }),
              onLeave: () => gsap.set(container, { willChange: "auto" }),
              onUpdate: (self) => {
                const newIndex = Math.min(
                  Math.floor(self.progress * galleryItems.length),
                  galleryItems.length - 1,
                );
                setActiveIndex(newIndex);
                if (counterRef.current) {
                  counterRef.current.textContent = `${String(newIndex + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
                }
              },
            },
          });

          // Animate each gallery item with alternating side entrances + random fly-off
          galleryItems.forEach((item, i) => {
            const imageContainer = item.querySelector(".project-image-container");
            const image = item.querySelector(".project-image");
            const content = item.querySelector(".project-content");
            const title = item.querySelector(".project-title");
            const description = item.querySelector(".project-description");
            const techTags = item.querySelectorAll(".tech-tag");
            const links = item.querySelector(".project-links");
            const number = item.querySelector(".project-number-overlay");
            const isEven = i % 2 === 0;

            // ENTRANCE: Alternate from top/bottom with rotation
            const enterY = isEven ? -200 : 200;
            const enterRotation = isEven ? -8 : 8;
            const enterSkewX = isEven ? 5 : -5;

            gsap.fromTo(item,
              {
                y: enterY,
                opacity: 0,
                rotation: enterRotation,
                skewX: enterSkewX,
              },
              {
                y: 0,
                opacity: 1,
                rotation: 0,
                skewX: 0,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: item,
                  containerAnimation: scrollTween,
                  start: "left 95%",
                  end: "left 60%",
                  scrub: 1,
                },
              }
            );

            // EXIT: Random direction fly-off
            const exitDirections = [
              { y: -400, x: gsap.utils.random(-200, 200), rotation: gsap.utils.random(-25, 25) },
              { y: 400, x: gsap.utils.random(-200, 200), rotation: gsap.utils.random(-25, 25) },
              { y: gsap.utils.random(-300, 300), x: -300, rotation: gsap.utils.random(-20, 20) },
              { y: gsap.utils.random(-200, -400), x: gsap.utils.random(100, 300), rotation: 15 },
              { y: gsap.utils.random(200, 400), x: gsap.utils.random(-300, -100), rotation: -15 },
            ];
            const exit = exitDirections[i % exitDirections.length];

            gsap.to(item, {
              y: exit.y,
              x: exit.x,
              rotation: exit.rotation,
              opacity: 0,
              scale: 0.7,
              ease: "power2.in",
              scrollTrigger: {
                trigger: item,
                containerAnimation: scrollTween,
                start: "right 45%",
                end: "right 5%",
                scrub: 1,
              },
            });

            // Image reveal — alternating clip-path
            if (imageContainer) {
              const clipReveals = [
                { from: "inset(0 100% 0 0)", to: "inset(0 0% 0 0%)" },       // wipe from left
                { from: "inset(100% 0 0 0)", to: "inset(0% 0 0 0)" },         // curtain from top
                { from: "inset(0 0 0 100%)", to: "inset(0 0 0 0%)" },         // wipe from right
                { from: "circle(0% at 50% 50%)", to: "circle(75% at 50% 50%)" }, // circle
                { from: "inset(0 0 100% 0)", to: "inset(0 0 0% 0)" },         // curtain from bottom
                { from: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)", to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }, // diamond
              ];
              const clip = clipReveals[i % clipReveals.length];

              gsap.fromTo(imageContainer,
                { clipPath: clip.from },
                {
                  clipPath: clip.to, ease: "power3.inOut",
                  scrollTrigger: {
                    trigger: item, containerAnimation: scrollTween,
                    start: "left 85%", end: "left 50%", scrub: 1,
                  },
                }
              );
            }

            // Image parallax
            if (image) {
              gsap.to(image, {
                x: -70, ease: "none",
                scrollTrigger: {
                  trigger: item, containerAnimation: scrollTween,
                  start: "left 100%", end: "right 0%", scrub: 1,
                },
              });
            }

            // Content stagger
            if (content) {
              gsap.fromTo(content,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: EASINGS.smooth,
                  scrollTrigger: { trigger: item, containerAnimation: scrollTween, start: "left 65%", toggleActions: "play none none reverse" },
                }
              );
            }

            if (title) {
              gsap.fromTo(title,
                { x: isEven ? -50 : 50, opacity: 0, skewX: isEven ? -5 : 5 },
                { x: 0, opacity: 1, skewX: 0, duration: 0.7, ease: EASINGS.smooth,
                  scrollTrigger: { trigger: item, containerAnimation: scrollTween, start: "left 60%", toggleActions: "play none none reverse" },
                }
              );
            }

            if (description) {
              gsap.fromTo(description,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: EASINGS.smooth,
                  scrollTrigger: { trigger: item, containerAnimation: scrollTween, start: "left 55%", toggleActions: "play none none reverse" },
                }
              );
            }

            if (techTags.length > 0) {
              gsap.fromTo(techTags,
                { y: 25, opacity: 0, scale: 0.8 },
                { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: "back.out(1.5)",
                  scrollTrigger: { trigger: item, containerAnimation: scrollTween, start: "left 50%", toggleActions: "play none none reverse" },
                }
              );
            }

            if (links) {
              gsap.fromTo(links,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: EASINGS.smooth,
                  scrollTrigger: { trigger: item, containerAnimation: scrollTween, start: "left 45%", toggleActions: "play none none reverse" },
                }
              );
            }

            if (number) {
              gsap.fromTo(number,
                { x: 150, opacity: 0 },
                { x: -50, opacity: 0.06, ease: "none",
                  scrollTrigger: { trigger: item, containerAnimation: scrollTween, start: "left 80%", end: "right 20%", scrub: 1 },
                }
              );
            }

            // Hover effects
            if (imageContainer && image) {
              imageContainer.addEventListener("mouseenter", () => {
                gsap.to(image, { scale: 1.15, duration: 0.6, ease: EASINGS.smooth });
              });
              imageContainer.addEventListener("mousemove", (e) => {
                const rect = imageContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                gsap.to(image, {
                  x: ((x - centerX) / centerX) * -15 - 35,
                  y: ((y - centerY) / centerY) * -10,
                  duration: 0.4, ease: "power2.out",
                });
              });
              imageContainer.addEventListener("mouseleave", () => {
                gsap.to(image, { scale: 1, x: 0, y: 0, duration: 0.8, ease: "power3.out" });
              });
            }
          });

          // Velocity skew
          velocityUnsubscribe = scrollVelocity.subscribe((velocity) => {
            const normalizedVelocity = Math.min(Math.abs(velocity), 1500) / 1500;
            const skew = normalizedVelocity * 3 * Math.sign(velocity);
            gsap.to(container, { skewY: skew, duration: 0.2, ease: "power1.out", overwrite: "auto" });
          });
        });
      }, sectionRef);

      return () => {
        ctx.revert();
        if (velocityUnsubscribe) velocityUnsubscribe();
        scrollVelocity.stop();
        if (titleRef.current) revertSplit(titleRef.current);
      };
    });

    return () => mm.revert();
  }, []);

  // Mobile layout
  if (layout === "mobile") {
    return (
      <section ref={sectionRef} className="min-h-screen w-full bg-black py-16 md:py-24 relative overflow-hidden">
        <div className="dot-pattern absolute inset-0 pointer-events-none" />
        <div ref={headerRef} className="max-w-7xl mx-auto px-4 md:px-6 mb-12 md:mb-20">
          <div className="flex items-center gap-4 md:gap-6 mb-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] text-neutral-500">04</span>
            <div className="flex-1 h-px bg-neutral-800" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Projects</h2>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="space-y-12 md:space-y-20">
            {projects.map((project, i) => (
              <article key={project.title} className="project-card-mobile relative">
                <div className="project-image-container relative aspect-video overflow-hidden mb-4 md:mb-6">
                  <img src={project.src} alt={project.title} className="project-image w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 right-3 font-mono text-xs text-white/60">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="project-content-mobile">
                  <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.15em] text-neutral-500 mb-1 block">{project.description}</span>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{project.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.content && ["React", "Node.js", "TailwindCSS"].map((tech) => (
                      <span key={tech} className="tech-tag px-2 py-0.5 text-[10px] font-mono border border-neutral-700 text-neutral-400">{tech}</span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {project.ctaLink && (
                      <a href={project.ctaLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-xs font-mono uppercase tracking-wider border border-white text-white hover:bg-white hover:text-black transition-colors">View Live</a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="absolute bottom-4 right-4 font-mono text-[10px] text-neutral-600 tracking-widest">04 / 07</div>
      </section>
    );
  }

  // Desktop — horizontal gallery
  return (
    <section ref={sectionRef} className="h-screen w-full bg-black overflow-hidden relative">
      <div className="dot-pattern absolute inset-0 pointer-events-none" />

      <div className="absolute top-8 left-8 z-20">
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-500">04 / Projects</span>
        <h2 ref={titleRef} className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white" style={{ fontFamily: "Space Grotesk, sans-serif", perspective: "1000px" }}>Projects</h2>
      </div>

      <div ref={counterRef} className="absolute top-8 right-8 z-20 font-mono text-sm text-neutral-400">
        01 / {String(projects.length).padStart(2, "0")}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {projects.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeIndex ? "bg-white scale-150 shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "bg-neutral-600"}`} />
        ))}
      </div>

      <div ref={galleryContainerRef} className="h-full flex items-center horizontal-scroll-container" style={{ transformStyle: "preserve-3d" }}>
        <div className="w-[50vw] h-full shrink-0" />

        {projects.map((project, i) => (
          <article key={project.title} className="gallery-item shrink-0 h-full flex items-center px-8 relative" style={{ width: "80vw", maxWidth: "1400px" }}>
            <span className="project-number-overlay absolute -left-8 top-1/2 -translate-y-1/2 text-[25rem] font-black text-white leading-none pointer-events-none select-none" style={{ opacity: 0 }}>0{i + 1}</span>

            <div className="relative z-10 grid grid-cols-12 gap-8 items-center w-full">
              <div className="col-span-7">
                <div className="project-image-container relative aspect-[16/10] overflow-hidden group">
                  <img src={project.src} alt={project.title} className="project-image w-full h-full object-cover" style={{ transform: "scale(1.1)" }} />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-6 z-10">
                    {project.ctaLink && (
                      <a href={project.ctaLink} target="_blank" rel="noopener noreferrer" className="project-cta px-8 py-4 border border-white text-white text-sm font-mono uppercase tracking-wider"><span>View Live</span></a>
                    )}
                  </div>
                  <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-white/30" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-white/30" />
                </div>
              </div>

              <div className="col-span-5 project-content">
                <span className="project-description font-mono text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4 block">{project.description}</span>
                <h3 className="project-title text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{project.title}</h3>
                <div className="w-16 h-px bg-gradient-to-r from-white/60 to-transparent mb-6" />
                <div className="flex flex-wrap gap-2 mb-8">
                  {["React", "Node.js", "MongoDB", "TailwindCSS"].slice(0, 4).map((tech) => (
                    <span key={tech} className="tech-tag px-4 py-2 text-xs font-mono border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white transition-colors">{tech}</span>
                  ))}
                </div>
                <div className="project-links flex gap-4">
                  {project.ctaLink && (
                    <a href={project.ctaLink} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-white font-mono text-sm uppercase tracking-wider hover:text-neutral-300 transition-colors">
                      <span>Visit Project</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}

        <div className="w-screen h-full shrink-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-px bg-white/30 mx-auto mb-8" />
            <span className="font-mono text-sm uppercase tracking-[0.2em] text-neutral-500">Continue scrolling</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 font-mono text-xs text-neutral-600 tracking-widest">04 / 07</div>
    </section>
  );
}

export default ScrollProjectsSection;
