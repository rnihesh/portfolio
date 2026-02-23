import { useRef, useEffect } from "react";
import {
  gsap,
  ScrollTrigger,
  BREAKPOINTS,
  EASINGS,
  scrollVelocity,
} from "../../utils/gsapConfig";
import { splitText, revertSplit } from "../../utils/textSplit";

function ScrollHeroSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const cornerRefs = useRef([]);
  const lineRefs = useRef([]);
  const particlesRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    let splitResult = null;
    let velocityUnsubscribe = null;

    // Reduced motion - instant states, no animations
    mm.add(BREAKPOINTS.reducedMotion, () => {
      gsap.set(titleRef.current, { opacity: 1, scale: 1, filter: "blur(0px)" });
      gsap.set(subtitleRef.current, { opacity: 1, x: 0 });
      cornerRefs.current.forEach((corner) => {
        if (corner) gsap.set(corner, { opacity: 0.4, scale: 1 });
      });
      lineRefs.current.forEach((line) => {
        if (line) gsap.set(line, { scaleX: 1, scaleY: 1 });
      });
      return () => {};
    });

    // Mobile animations
    mm.add(BREAKPOINTS.mobile, () => {
      const ctx = gsap.context(() => {
        const pinDuration = "+=200%";

        // Immediate dramatic entrance — title visible on load
        const entranceTl = gsap.timeline({ delay: 0.2 });

        // Title entrance: scale down from massive with blur dissolve
        gsap.set(titleRef.current, {
          scale: 3,
          opacity: 0,
          filter: "blur(20px)",
        });

        entranceTl.to(titleRef.current, {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "expo.out",
        });

        // Subtitle wipe-in
        gsap.set(subtitleRef.current, {
          clipPath: "inset(0 100% 0 0)",
          opacity: 1,
        });

        entranceTl.to(
          subtitleRef.current,
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 0.8,
            ease: "power3.inOut",
          },
          "-=0.6"
        );

        // Corner brackets
        cornerRefs.current.forEach((corner, i) => {
          if (corner) {
            gsap.set(corner, { opacity: 0, scale: 0 });
            entranceTl.to(
              corner,
              {
                opacity: 0.4,
                scale: 1,
                duration: 0.4,
                ease: "back.out(2)",
              },
              0.3 + i * 0.08
            );
          }
        });

        // Scroll indicator bounce
        if (scrollIndicatorRef.current) {
          gsap.set(scrollIndicatorRef.current, { opacity: 0, y: 20 });
          entranceTl.to(
            scrollIndicatorRef.current,
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            "-=0.3"
          );
        }

        // Scrub-driven scroll timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: pinDuration,
            scrub: 0.8,
            pin: true,
            pinSpacing: true,
          },
        });

        // Phase 1: Title scales down and lifts
        tl.to(titleRef.current, {
          scale: 0.6,
          y: -60,
          filter: "blur(3px)",
          opacity: 0.3,
          duration: 1,
          ease: "power2.inOut",
        }, 0);

        // Subtitle fades
        tl.to(subtitleRef.current, {
          opacity: 0,
          y: -30,
          duration: 0.5,
        }, 0);

        // Background color invert
        tl.to(sectionRef.current, {
          backgroundColor: "#ffffff",
          color: "#000000",
          duration: 0.8,
          ease: "power2.inOut",
        }, 0.3);

        // Corners expand
        cornerRefs.current.forEach((corner, i) => {
          if (corner) {
            const dirs = [
              { x: -8, y: -8 }, { x: 8, y: -8 },
              { x: -8, y: 8 }, { x: 8, y: 8 },
            ];
            tl.to(corner, {
              x: dirs[i].x, y: dirs[i].y,
              opacity: 0.6, borderRadius: "50%",
              duration: 0.5, ease: "power2.out",
            }, 0.4);
          }
        });

        // Scroll indicator out
        if (scrollIndicatorRef.current) {
          tl.to(scrollIndicatorRef.current, {
            opacity: 0, y: -20, duration: 0.3,
          }, 0);
        }
      }, sectionRef);

      return () => ctx.revert();
    });

    // Tablet animations
    mm.add(BREAKPOINTS.tablet, () => {
      const ctx = gsap.context(() => {
        const pinDuration = "+=250%";

        // Immediate entrance
        const entranceTl = gsap.timeline({ delay: 0.2 });

        gsap.set(titleRef.current, {
          scale: 4,
          opacity: 0,
          filter: "blur(25px)",
          rotateX: 15,
        });

        entranceTl.to(titleRef.current, {
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          rotateX: 0,
          duration: 1.6,
          ease: "expo.out",
        });

        gsap.set(subtitleRef.current, {
          clipPath: "inset(0 100% 0 0)",
          opacity: 1,
        });

        entranceTl.to(
          subtitleRef.current,
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 0.8,
            ease: "power3.inOut",
          },
          "-=0.8"
        );

        // Lines draw in
        lineRefs.current.forEach((line, i) => {
          if (line) {
            const isVertical = line.classList.contains("h-full");
            gsap.set(line, {
              scaleY: isVertical ? 0 : 1,
              scaleX: isVertical ? 1 : 0,
            });
            entranceTl.to(
              line,
              { scaleY: 1, scaleX: 1, duration: 1, ease: "power2.inOut" },
              0.3 + i * 0.12
            );
          }
        });

        // Corner brackets
        cornerRefs.current.forEach((corner, i) => {
          if (corner) {
            gsap.set(corner, { opacity: 0, scale: 0, rotation: -15 });
            entranceTl.to(
              corner,
              {
                opacity: 0.4, scale: 1, rotation: 0,
                duration: 0.5, ease: "back.out(2)",
              },
              0.2 + i * 0.08
            );
          }
        });

        if (scrollIndicatorRef.current) {
          gsap.set(scrollIndicatorRef.current, { opacity: 0, y: 20 });
          entranceTl.to(
            scrollIndicatorRef.current,
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            "-=0.3"
          );
        }

        // Scrub timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: pinDuration,
            scrub: 0.8,
            pin: true,
            pinSpacing: true,
          },
        });

        tl.to(titleRef.current, {
          scale: 0.5,
          y: -80,
          rotateX: -10,
          filter: "blur(4px)",
          opacity: 0.2,
          duration: 1,
          ease: "power2.inOut",
        }, 0);

        tl.to(subtitleRef.current, {
          opacity: 0, y: -40, duration: 0.5,
        }, 0);

        tl.to(sectionRef.current, {
          backgroundColor: "#ffffff",
          color: "#000000",
          duration: 0.8,
          ease: "power2.inOut",
        }, 0.3);

        cornerRefs.current.forEach((corner, i) => {
          if (corner) {
            const dirs = [
              { x: -10, y: -10 }, { x: 10, y: -10 },
              { x: -10, y: 10 }, { x: 10, y: 10 },
            ];
            tl.to(corner, {
              x: dirs[i].x, y: dirs[i].y,
              opacity: 0.6, borderRadius: "50%",
              duration: 0.5,
            }, 0.4);
          }
        });

        if (scrollIndicatorRef.current) {
          tl.to(scrollIndicatorRef.current, {
            opacity: 0, y: -30, duration: 0.4,
          }, 0);
        }
      }, sectionRef);

      return () => ctx.revert();
    });

    // Desktop animations — full cinematic experience
    mm.add(BREAKPOINTS.desktop, () => {
      const ctx = gsap.context(() => {
        const pinDuration = "+=350%";

        // Split title into characters
        if (titleRef.current) {
          splitResult = splitText(titleRef.current, { type: "chars" });
        }

        // ====== PHASE 0: DRAMATIC ENTRANCE (on load) ======
        const entranceTl = gsap.timeline({ delay: 0.15 });

        // Each character flies in from random positions with 3D rotation
        if (splitResult && splitResult.chars.length > 0) {
          splitResult.chars.forEach((char, i) => {
            const randomX = gsap.utils.random(-300, 300);
            const randomY = gsap.utils.random(-200, 200);
            const randomRotZ = gsap.utils.random(-180, 180);
            const randomRotX = gsap.utils.random(-90, 90);

            gsap.set(char, {
              x: randomX,
              y: randomY,
              rotation: randomRotZ,
              rotateX: randomRotX,
              scale: gsap.utils.random(0.3, 2),
              opacity: 0,
              filter: "blur(15px)",
              transformOrigin: "center center",
            });

            entranceTl.to(
              char,
              {
                x: 0,
                y: 0,
                rotation: 0,
                rotateX: 0,
                scale: 1,
                opacity: 1,
                filter: "blur(0px)",
                duration: 1.2,
                ease: "expo.out",
              },
              i * 0.06
            );
          });
        } else {
          // Fallback
          gsap.set(titleRef.current, { scale: 5, opacity: 0, filter: "blur(30px)" });
          entranceTl.to(titleRef.current, {
            scale: 1, opacity: 1, filter: "blur(0px)",
            duration: 1.5, ease: "expo.out",
          });
        }

        // Subtitle clip-path wipe
        gsap.set(subtitleRef.current, {
          clipPath: "inset(0 100% 0 0)",
          opacity: 1,
          letterSpacing: "0.8em",
        });

        entranceTl.to(
          subtitleRef.current,
          {
            clipPath: "inset(0 0% 0 0)",
            letterSpacing: "0.3em",
            duration: 1,
            ease: "power3.inOut",
          },
          0.6
        );

        // Lines draw in
        lineRefs.current.forEach((line, i) => {
          if (line) {
            const isVertical = line.classList.contains("h-full");
            gsap.set(line, {
              scaleY: isVertical ? 0 : 1,
              scaleX: isVertical ? 1 : 0,
            });
            entranceTl.to(
              line,
              { scaleY: 1, scaleX: 1, duration: 1.2, ease: "power2.inOut" },
              0.3 + i * 0.15
            );
          }
        });

        // Corner brackets with spring
        cornerRefs.current.forEach((corner, i) => {
          if (corner) {
            gsap.set(corner, { opacity: 0, scale: 0, rotation: -20 });
            entranceTl.to(
              corner,
              {
                opacity: 0.5,
                scale: 1,
                rotation: 0,
                duration: 0.7,
                ease: "back.out(2.5)",
              },
              0.2 + i * 0.1
            );
          }
        });

        // Scroll indicator
        if (scrollIndicatorRef.current) {
          gsap.set(scrollIndicatorRef.current, { opacity: 0, y: 30 });
          entranceTl.to(
            scrollIndicatorRef.current,
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            "-=0.5"
          );
        }

        // Floating particles entrance
        if (particlesRef.current) {
          const particles = particlesRef.current.children;
          gsap.set(particles, { opacity: 0, scale: 0 });
          entranceTl.to(
            particles,
            {
              opacity: 1,
              scale: 1,
              duration: 0.6,
              stagger: 0.05,
              ease: "power2.out",
            },
            0.5
          );

          // Continuous floating
          Array.from(particles).forEach((p, i) => {
            gsap.to(p, {
              y: gsap.utils.random(-30, 30),
              x: gsap.utils.random(-20, 20),
              duration: gsap.utils.random(3, 6),
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.3,
            });
          });
        }

        // ====== SCRUB-DRIVEN SCROLL TIMELINE ======
        scrollVelocity.start();

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: pinDuration,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            onEnter: () => {
              gsap.set(titleRef.current, { willChange: "transform, opacity, filter" });
            },
            onLeave: () => {
              gsap.set(titleRef.current, { willChange: "auto" });
            },
            onEnterBack: () => {
              gsap.set(titleRef.current, { willChange: "transform, opacity, filter" });
            },
            onLeaveBack: () => {
              gsap.set(titleRef.current, { willChange: "auto" });
              scrollVelocity.stop();
            },
          },
        });

        // Phase 1 (0→0.35): Title dramatically scales up then down with rotation
        if (splitResult && splitResult.chars.length > 0) {
          // Characters spread apart then reconverge
          tl.to(splitResult.chars, {
            letterSpacing: "0.3em",
            duration: 0.3,
            ease: "power2.out",
          }, 0);

          tl.to(splitResult.chars, {
            scale: 1.3,
            textShadow: "0 0 80px rgba(255,255,255,0.6)",
            duration: 0.35,
            stagger: { each: 0.02, from: "center" },
            ease: "power2.out",
          }, 0);
        }

        // Phase 2 (0.35→0.65): Color invert + title scales down + moves up
        tl.to(sectionRef.current, {
          backgroundColor: "#ffffff",
          color: "#000000",
          duration: 0.3,
          ease: "power2.inOut",
        }, 0.35);

        if (splitResult && splitResult.chars.length > 0) {
          tl.to(splitResult.chars, {
            scale: 0.5,
            y: -100,
            opacity: 0.15,
            filter: "blur(8px)",
            textShadow: "none",
            duration: 0.35,
            stagger: { each: 0.02, from: "edges" },
            ease: "power3.inOut",
          }, 0.4);
        } else {
          tl.to(titleRef.current, {
            scale: 0.4,
            y: -100,
            opacity: 0.15,
            filter: "blur(8px)",
            duration: 0.3,
            ease: "power3.inOut",
          }, 0.4);
        }

        // Subtitle out
        tl.to(subtitleRef.current, {
          clipPath: "inset(0 0 0 100%)",
          opacity: 0,
          y: -40,
          duration: 0.3,
          ease: "power3.inOut",
        }, 0.35);

        // Corner brackets morph and expand
        cornerRefs.current.forEach((corner, i) => {
          if (corner) {
            const dirs = [
              { x: -25, y: -25 }, { x: 25, y: -25 },
              { x: -25, y: 25 }, { x: 25, y: 25 },
            ];
            tl.to(corner, {
              x: dirs[i].x,
              y: dirs[i].y,
              opacity: 0.7,
              borderRadius: "50%",
              scale: 1.5,
              duration: 0.35,
              ease: "power2.out",
            }, 0.35);
          }
        });

        // Phase 3 (0.65→1.0): Everything fades/flies away
        tl.to(sectionRef.current.querySelectorAll(".hero-line"), {
          opacity: 0,
          scaleX: 0,
          duration: 0.25,
        }, 0.7);

        if (scrollIndicatorRef.current) {
          tl.to(scrollIndicatorRef.current, {
            opacity: 0, y: -40, duration: 0.2,
          }, 0.3);
        }

        // Particles scatter on scroll
        if (particlesRef.current) {
          tl.to(particlesRef.current.children, {
            opacity: 0,
            scale: 0,
            y: gsap.utils.random(-100, -300),
            x: "random(-200, 200)",
            duration: 0.3,
            stagger: 0.02,
          }, 0.6);
        }

        // Velocity-reactive motion blur
        velocityUnsubscribe = scrollVelocity.subscribe(() => {
          const normalizedVelocity = scrollVelocity.getNormalizedVelocity(2000);
          const blurAmount = normalizedVelocity * 5;
          const skewAmount = normalizedVelocity * 2 * Math.sign(scrollVelocity.velocity);

          if (titleRef.current) {
            gsap.to(titleRef.current, {
              filter: `blur(${blurAmount}px)`,
              skewY: skewAmount,
              duration: 0.15,
              overwrite: "auto",
            });
          }
        });
      }, sectionRef);

      return () => {
        ctx.revert();
        if (titleRef.current) {
          revertSplit(titleRef.current);
        }
        if (velocityUnsubscribe) {
          velocityUnsubscribe();
        }
      };
    });

    return () => {
      mm.revert();
      scrollVelocity.stop();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black"
    >
      {/* Floating particles — desktop only */}
      <div
        ref={particlesRef}
        className="hidden lg:block absolute inset-0 pointer-events-none z-0"
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20"
            style={{
              width: `${gsap.utils.random(2, 6)}px`,
              height: `${gsap.utils.random(2, 6)}px`,
              top: `${gsap.utils.random(10, 90)}%`,
              left: `${gsap.utils.random(5, 95)}%`,
            }}
          />
        ))}
      </div>

      {/* Geometric accent lines */}
      <div
        ref={(el) => (lineRefs.current[0] = el)}
        className="hero-line hidden md:block absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-neutral-600 to-transparent opacity-30 origin-top"
      />
      <div
        ref={(el) => (lineRefs.current[1] = el)}
        className="hero-line hidden md:block absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-neutral-600 to-transparent opacity-20 origin-top"
      />
      <div
        ref={(el) => (lineRefs.current[2] = el)}
        className="hero-line hidden md:block absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent opacity-20 origin-left"
      />

      {/* Corner brackets */}
      <div
        ref={(el) => (cornerRefs.current[0] = el)}
        className="absolute top-4 left-4 md:top-8 md:left-8 w-8 h-8 md:w-16 md:h-16 border-l border-t border-neutral-600"
      />
      <div
        ref={(el) => (cornerRefs.current[1] = el)}
        className="absolute top-4 right-4 md:top-8 md:right-8 w-8 h-8 md:w-16 md:h-16 border-r border-t border-neutral-600"
      />
      <div
        ref={(el) => (cornerRefs.current[2] = el)}
        className="absolute bottom-4 left-4 md:bottom-8 md:left-8 w-8 h-8 md:w-16 md:h-16 border-l border-b border-neutral-600"
      />
      <div
        ref={(el) => (cornerRefs.current[3] = el)}
        className="absolute bottom-4 right-4 md:bottom-8 md:right-8 w-8 h-8 md:w-16 md:h-16 border-r border-b border-neutral-600"
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 md:px-6" style={{ perspective: "1200px" }}>
        <h1
          ref={titleRef}
          className="font-black tracking-[-0.05em] leading-none"
          style={{
            fontSize: "clamp(3rem, 18vw, 16rem)",
            fontFamily: "Space Grotesk, sans-serif",
          }}
        >
          NIHESH
        </h1>

        <p
          ref={subtitleRef}
          className="font-mono text-[10px] md:text-sm uppercase tracking-[0.15em] md:tracking-[0.3em] text-neutral-400 mt-4 md:mt-8 opacity-0"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          Full Stack Developer
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-neutral-500">
          Scroll
        </span>
        <div className="w-px h-8 md:h-12 bg-gradient-to-b from-neutral-400 to-transparent animate-pulse" />
      </div>

      {/* Section number */}
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 font-mono text-[10px] md:text-xs text-neutral-600 tracking-widest">
        01 / 07
      </div>
    </section>
  );
}

export default ScrollHeroSection;
