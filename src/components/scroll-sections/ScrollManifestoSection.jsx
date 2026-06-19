import { useRef, useEffect, useState } from "react";
import { gsap, ScrollTrigger, BREAKPOINTS, EASINGS } from "../../utils/gsapConfig";
import { splitText, revertSplit } from "../../utils/textSplit";

function ScrollManifestoSection() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const textRefs = useRef([]);
  const bgNumberRef = useRef(null);
  const dotsRef = useRef([]);
  const [layout, setLayout] = useState("desktop");

  const manifestoText = [
    "I build digital experiences",
    "that merge form and function.",
    "Clean code. Bold design.",
    "Pixel-perfect execution.",
  ];

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Reduced motion
    mm.add(BREAKPOINTS.reducedMotion, () => {
      const textElements = sectionRef.current?.querySelectorAll(".manifesto-line");
      if (textElements) gsap.set(textElements, { opacity: 1, y: 0 });
      return () => {};
    });

    // Mobile
    mm.add(BREAKPOINTS.mobile, () => {
      setLayout("mobile");
      const ctx = gsap.context(() => {
        requestAnimationFrame(() => {
          const textElements = gsap.utils.toArray(".manifesto-line");
          textElements.forEach((text) => {
            const words = text.querySelectorAll(".manifesto-word");
            if (words.length > 0) {
              gsap.set(words, { opacity: 0.15 });
              gsap.to(words, {
                opacity: 1, stagger: 0.15, ease: "none",
                scrollTrigger: { trigger: text, start: "top 80%", end: "bottom 50%", scrub: 1 },
              });
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
          const textElements = gsap.utils.toArray(".manifesto-line");
          textElements.forEach((text) => {
            const words = text.querySelectorAll(".manifesto-word");
            if (words.length > 0) {
              gsap.set(words, { opacity: 0.1, y: 15 });
              gsap.to(words, {
                opacity: 1, y: 0, stagger: 0.12, ease: "none",
                scrollTrigger: { trigger: text, start: "top 80%", end: "bottom 40%", scrub: 1 },
              });
            }
          });
        });
      }, sectionRef);
      return () => ctx.revert();
    });

    // Desktop — horizontal scroll with scrub word reveal + working dots
    mm.add(BREAKPOINTS.desktop, () => {
      setLayout("desktop");
      let splitResults = [];

      const ctx = gsap.context(() => {
        requestAnimationFrame(() => {
          const container = containerRef.current;
          if (!container) return;

          const totalWidth = container.scrollWidth - window.innerWidth;

          // Background number
          if (bgNumberRef.current) {
            gsap.set(bgNumberRef.current, { rotation: -15, scale: 0.8, opacity: 0 });
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
              onUpdate: (self) => {
                // Sync dots with scroll progress
                const numPanels = manifestoText.length;
                const activePanel = Math.min(
                  Math.floor(self.progress * numPanels),
                  numPanels - 1
                );

                dotsRef.current.forEach((dot, i) => {
                  if (!dot) return;
                  if (i === activePanel) {
                    gsap.to(dot, {
                      scale: 2.2,
                      backgroundColor: "#000",
                      boxShadow: "0 0 0 4px rgba(0,0,0,0.15)",
                      duration: 0.3,
                      ease: "back.out(2)",
                      overwrite: true,
                    });
                  } else if (i < activePanel) {
                    gsap.to(dot, {
                      scale: 1.2,
                      backgroundColor: "#000",
                      boxShadow: "none",
                      duration: 0.3,
                      overwrite: true,
                    });
                  } else {
                    gsap.to(dot, {
                      scale: 1,
                      backgroundColor: "#d4d4d4",
                      boxShadow: "none",
                      duration: 0.3,
                      overwrite: true,
                    });
                  }
                });
              },
            },
          });

          // Background number rotation
          if (bgNumberRef.current) {
            gsap.to(bgNumberRef.current, {
              rotation: 15, scale: 1.2, opacity: 0.04, ease: "none",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: () => `+=${totalWidth + window.innerWidth}`,
                scrub: 1.5,
              },
            });
          }

          // Text panels with word-by-word scrub reveal
          const textPanels = gsap.utils.toArray(".manifesto-panel");

          textPanels.forEach((panel, panelIndex) => {
            const textElement = panel.querySelector("h2");
            if (textElement) {
              const splitResult = splitText(textElement, { type: "words" });
              splitResults.push({ element: textElement, result: splitResult });

              gsap.set(splitResult.words, {
                opacity: 0.12, y: 0, color: "#d4d4d4",
                filter: "blur(2px)", transformOrigin: "bottom center",
              });

              splitResult.words.forEach((word, wordIndex) => {
                const progress = wordIndex / splitResult.words.length;
                gsap.to(word, {
                  opacity: 1, y: 0, color: "#000000",
                  filter: "blur(0px)",
                  textShadow: "0 0 30px rgba(0,0,0,0.15)",
                  duration: 0.3, ease: "power2.out",
                  scrollTrigger: {
                    trigger: panel,
                    containerAnimation: scrollTween,
                    start: `left ${85 - progress * 50}%`,
                    end: `left ${65 - progress * 50}%`,
                    scrub: 1,
                    onLeave: () => {
                      gsap.to(word, { textShadow: "none", duration: 0.5 });
                    },
                  },
                });
              });

              // Parallax depth
              const depthOffset = (panelIndex % 2 === 0) ? -40 : -80;
              gsap.to(textElement, {
                y: depthOffset, ease: "none",
                scrollTrigger: {
                  trigger: panel, containerAnimation: scrollTween,
                  start: "left 100%", end: "right 0%", scrub: 2,
                },
              });
            }

            // Panel exit
            const panelContent = panel.querySelector("h2");
            if (panelContent) {
              gsap.to(panelContent, {
                scale: 0.85, opacity: 0.3, filter: "blur(4px)",
                ease: "power2.in",
                scrollTrigger: {
                  trigger: panel, containerAnimation: scrollTween,
                  start: "right 40%", end: "right 0%", scrub: 1,
                },
              });
            }
          });
        });
      }, sectionRef);

      return () => {
        ctx.revert();
        splitResults.forEach(({ element }) => revertSplit(element));
      };
    });

    return () => mm.revert();
  }, []);

  const renderTextWithWords = (line, i) => (
    <h2
      key={i}
      ref={(el) => (textRefs.current[i] = el)}
      className="manifesto-line text-2xl md:text-3xl font-bold tracking-tight text-black leading-tight"
      style={{ fontFamily: "Space Grotesk, sans-serif" }}
    >
      {line.split(" ").map((word, wi) => (
        <span key={wi} className="manifesto-word inline-block mr-[0.3em]" style={{ opacity: 0.15 }}>
          {word}
        </span>
      ))}
    </h2>
  );

  if (layout === "mobile") {
    return (
      <section ref={sectionRef} className="min-h-screen w-full bg-white py-20 px-4 relative">
        <div className="grid-pattern absolute inset-0 opacity-30" />
        <div className="relative z-10 max-w-lg mx-auto">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-400 mb-8 block">02 / Manifesto</span>
          <div className="space-y-6" style={{ perspective: "800px" }}>
            {manifestoText.map((line, i) => renderTextWithWords(line, i))}
          </div>
          <div className="w-16 h-px bg-black mt-12" />
        </div>
        <div className="absolute bottom-4 right-4 font-mono text-[10px] text-neutral-400 tracking-widest">02 / 07</div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="h-screen w-full overflow-hidden bg-white relative">
      <div className="grid-pattern absolute inset-0 opacity-50" />

      <div ref={bgNumberRef} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ opacity: 0 }}>
        <span className="text-[40vw] font-black text-black tracking-tighter leading-none" style={{ opacity: 0.04 }}>02</span>
      </div>

      <div ref={containerRef} className="h-full flex items-center horizontal-scroll-container">
        <div className="w-screen h-full flex items-center justify-center shrink-0">
          <div className="text-center">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-400">02 / Manifesto</span>
          </div>
        </div>

        <div ref={textRef} className="flex items-center gap-0">
          {manifestoText.map((line, i) => (
            <div key={i} className="manifesto-panel w-screen h-full flex items-center justify-center shrink-0 px-8" style={{ perspective: "1200px" }}>
              <h2
                ref={(el) => (textRefs.current[i] = el)}
                className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight text-black text-center leading-tight"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {line}
              </h2>
            </div>
          ))}
        </div>

        <div className="w-screen h-full flex items-center justify-center shrink-0">
          <div className="text-center">
            <div className="w-24 h-px bg-black mx-auto mb-8" />
            <span className="font-mono text-sm uppercase tracking-[0.2em] text-neutral-600">Scroll to continue</span>
          </div>
        </div>
      </div>

      <div className="absolute top-8 left-8 font-mono text-xs text-neutral-400 tracking-widest">MANIFESTO</div>

      {/* Progress dots — synced via onUpdate */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {manifestoText.map((_, i) => (
          <div
            key={i}
            ref={(el) => (dotsRef.current[i] = el)}
            className="w-2.5 h-2.5 rounded-full bg-neutral-300 transition-none"
          />
        ))}
      </div>
    </section>
  );
}

export default ScrollManifestoSection;
