import { useRef, useEffect, useState, useMemo } from "react";
import {
  gsap,
  ScrollTrigger,
  SplitText,
  DrawSVGPlugin,
  ScrambleTextPlugin,
  BREAKPOINTS,
  EASINGS,
  scrollVelocity,
} from "../../utils/gsapConfig";
import { photoItems as photos } from "../../data/photos";

// Plugins are registered in gsapConfig; reference here keeps tree-shakers honest.
void DrawSVGPlugin;
void ScrambleTextPlugin;

function ScrollPhotosSection() {
  const sectionRef = useRef(null);
  const pinnedRef = useRef(null);
  // Hero overlay — absolute within pinnedRef, OUTSIDE the masonry perspective container
  const heroContainerRef = useRef(null);
  const heroPhotoRef = useRef(null);
  const heroGradientRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroKickerRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroRuleRef = useRef(null);
  // Grid
  const headerRef = useRef(null);
  const headerTitleRef = useRef(null);
  const headerLineRef = useRef(null);
  const headerIndexRef = useRef(null);
  const gridRef = useRef(null);
  const gridContainerRef = useRef(null);
  const counterRef = useRef(null);
  // Slot in the masonry that the hero "lands" on
  const heroSlotRef = useRef(null);
  const heroSlotImgRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const heroIdx = useMemo(() => Math.floor(Math.random() * photos.length), []);
  const heroPhoto = useMemo(() => photos[heroIdx], [heroIdx]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // ----------------------------------------------------------------------
    // Reduced motion — clean, fully visible final state, no transforms
    // ----------------------------------------------------------------------
    mm.add(BREAKPOINTS.reducedMotion, () => {
      if (heroContainerRef.current) gsap.set(heroContainerRef.current, { opacity: 0 });
      const items = sectionRef.current?.querySelectorAll(".photo-item");
      if (items) gsap.set(items, { opacity: 1, clipPath: "none", filter: "none" });
      const imgs = sectionRef.current?.querySelectorAll(".photo-item img");
      if (imgs) gsap.set(imgs, { filter: "none", scale: 1, y: 0 });
      if (gridContainerRef.current) gsap.set(gridContainerRef.current, { opacity: 1 });
      if (headerRef.current) gsap.set(headerRef.current, { opacity: 1, y: 0 });
      if (headerLineRef.current) gsap.set(headerLineRef.current, { drawSVG: "100%" });
      if (counterRef.current) counterRef.current.textContent = "05 / 07";
      if (headerIndexRef.current) headerIndexRef.current.textContent = "05";
      return () => {};
    });

    // ----------------------------------------------------------------------
    // Mobile — lighter: directional clip wipes, gentle parallax. No pin.
    // ----------------------------------------------------------------------
    mm.add(BREAKPOINTS.mobile, () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray(".photo-item").forEach((photo, i) => {
          const dirs = [
            { from: "inset(100% 0 0 0)", to: "inset(0% 0 0 0)" },
            { from: "inset(0 100% 0 0)", to: "inset(0 0% 0 0)" },
            { from: "inset(0 0 100% 0)", to: "inset(0 0 0% 0)" },
            { from: "inset(0 0 0 100%)", to: "inset(0 0 0 0%)" },
          ];
          const dir = dirs[i % 4];
          gsap.fromTo(
            photo,
            { opacity: 0, clipPath: dir.from },
            {
              opacity: 1,
              clipPath: dir.to,
              ease: "cineOut",
              scrollTrigger: { trigger: photo, start: "top 92%", end: "top 65%", scrub: 1 },
            }
          );
          const img = photo.querySelector("img");
          if (img)
            gsap.fromTo(
              img,
              { scale: 1.12, yPercent: -4 },
              {
                scale: 1,
                yPercent: 4,
                ease: "none",
                scrollTrigger: { trigger: photo, start: "top bottom", end: "bottom top", scrub: 1.5 },
              }
            );
        });
      }, sectionRef);
      return () => ctx.revert();
    });

    // ----------------------------------------------------------------------
    // Tablet — assembling grid + parallax, no pin
    // ----------------------------------------------------------------------
    mm.add(BREAKPOINTS.tablet, () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray(".photo-item").forEach((photo) => {
          const img = photo.querySelector("img");
          gsap.fromTo(
            photo,
            { y: 80, opacity: 0, scale: 0.9 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              ease: "cineOut",
              scrollTrigger: { trigger: photo, start: "top 90%", end: "top 60%", scrub: 1 },
            }
          );
          if (img) {
            // Ken Burns scale-on-scrub + parallax drift
            gsap.fromTo(
              img,
              { scale: 1.16, yPercent: -8 },
              {
                scale: 1.02,
                yPercent: 8,
                ease: "none",
                scrollTrigger: { trigger: photo, start: "top bottom", end: "bottom top", scrub: 2 },
              }
            );
          }
        });
      }, sectionRef);
      return () => ctx.revert();
    });

    // ----------------------------------------------------------------------
    // Desktop — full cinematic: hero flies fullscreen → exact slot rect (Flip-style
    //   measured handoff), masked SplitText header reveal, DrawSVG rule, ScrambleText
    //   readouts, Ken Burns scale-on-scrub, layered parallax depth, velocity skew.
    // ----------------------------------------------------------------------
    mm.add(BREAKPOINTS.desktop, () => {
      let rafId;
      let headerSplit = null;
      let heroSplit = null;
      let velocityUnsub = null;
      let counterScrambled = false;

      const ctx = gsap.context((self) => {
        const photoItems = gsap.utils.toArray(".photo-item");

        // Dim grid and hide header until the hero "moment" completes
        gsap.set(gridContainerRef.current, { opacity: 0.15 });
        gsap.set(headerRef.current, { opacity: 0, y: 80, willChange: "transform, opacity" });
        // Slot img hidden while hero overlay covers it
        if (heroSlotImgRef.current) gsap.set(heroSlotImgRef.current, { visibility: "hidden" });
        // DrawSVG rule starts undrawn
        if (headerLineRef.current) gsap.set(headerLineRef.current, { drawSVG: "0%" });

        // --- Hero overlay intro: masked line reveal of "Through My Lens" ---
        if (heroTitleRef.current) {
          heroSplit = new SplitText(heroTitleRef.current, {
            type: "lines",
            linesClass: "hero-line",
          });
          // overflow-hidden masks so lines rise from below
          heroSplit.lines.forEach((line) => {
            const wrap = document.createElement("span");
            wrap.style.display = "block";
            wrap.style.overflow = "hidden";
            line.parentNode.insertBefore(wrap, line);
            wrap.appendChild(line);
          });
          gsap.set(heroSplit.lines, { yPercent: 110, willChange: "transform" });
          const introTl = gsap.timeline({
            scrollTrigger: { trigger: pinnedRef.current, start: "top 85%", once: true },
          });
          if (heroKickerRef.current)
            introTl.from(heroKickerRef.current, { opacity: 0, y: 14, duration: 0.5, ease: "cineOut" }, 0);
          introTl.to(
            heroSplit.lines,
            { yPercent: 0, duration: 0.9, stagger: 0.08, ease: "cine" },
            0.12
          );
          if (heroRuleRef.current)
            introTl.fromTo(
              heroRuleRef.current,
              { scaleX: 0, transformOrigin: "center center" },
              { scaleX: 1, duration: 0.7, ease: "cineOut" },
              0.5
            );
        }

        // Double RAF so the masonry columns have reflowed after the first paint
        rafId = requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            const runSetup = () => {
              self.add(() => {
                const heroEl = heroContainerRef.current;
                const pinnedEl = pinnedRef.current;
                const slotEl = heroSlotRef.current;
                if (!heroEl || !pinnedEl || !slotEl) return;

                // Measure positions AFTER all images have loaded (masonry settled)
                const pinnedRect = pinnedEl.getBoundingClientRect();
                const slotRect = slotEl.getBoundingClientRect();

                // Lock hero at exact viewport dimensions (px, not %)
                gsap.set(heroEl, {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: window.innerWidth,
                  height: window.innerHeight,
                  overflow: "hidden",
                  willChange: "transform, width, height, opacity",
                });

                // Slot position relative to the pinned container
                const targetTop = slotRect.top - pinnedRect.top;
                const targetLeft = slotRect.left - pinnedRect.left;

                // --- Header SplitText (masked char reveal), built lazily so layout is settled ---
                if (headerTitleRef.current && !headerSplit) {
                  headerSplit = new SplitText(headerTitleRef.current, {
                    type: "chars,lines",
                    linesClass: "ph-line",
                  });
                  headerSplit.lines.forEach((line) => {
                    line.style.overflow = "hidden";
                  });
                  gsap.set(headerSplit.chars, { yPercent: 120 });
                }

                const heroTl = gsap.timeline({
                  scrollTrigger: {
                    trigger: pinnedEl,
                    start: "top top",
                    end: "+=220%",
                    scrub: 1.5,
                    pin: true,
                    // Default pin spacing reserves the pin's own scroll length so the
                    // next section cannot slide underneath (no bleed).
                    pinSpacing: true,
                    anticipatePin: 1,
                  },
                });

                // 0–0.25: kicker/text fades and drifts up (the gallery "moment" releases)
                heroTl.to(heroTextRef.current, { opacity: 0, y: -30, duration: 0.25, ease: "cine" }, 0);
                // 0–0.3: gradient fades (grid reveals behind)
                heroTl.to(heroGradientRef.current, { opacity: 0, duration: 0.3 }, 0);
                // 0–0.25: grid brightens from dim to full opacity
                heroTl.to(gridContainerRef.current, { opacity: 1, duration: 0.25 }, 0);

                // 0.05–0.4: section header block fades in
                heroTl.to(
                  headerRef.current,
                  { opacity: 1, y: 0, duration: 0.3, ease: EASINGS.smooth },
                  0.05
                );
                // 0.15–0.5: masked header chars rise (filmic typographic cut)
                if (headerSplit) {
                  heroTl.to(
                    headerSplit.chars,
                    { yPercent: 0, duration: 0.45, stagger: 0.012, ease: "cine" },
                    0.18
                  );
                }
                // 0.2–0.55: DrawSVG rule sweeps in beneath the heading
                if (headerLineRef.current) {
                  heroTl.fromTo(
                    headerLineRef.current,
                    { drawSVG: "0%" },
                    { drawSVG: "100%", duration: 0.4, ease: "cineOut" },
                    0.2
                  );
                }
                // 0.2–0.45: scramble the section index readout "05"
                if (headerIndexRef.current) {
                  heroTl.to(
                    headerIndexRef.current,
                    {
                      duration: 0.35,
                      scrambleText: { text: "05", chars: "0123456789", speed: 0.5 },
                      ease: "none",
                    },
                    0.22
                  );
                }

                // 0.2–1.0: hero container moves AND resizes to match the slot exactly.
                //   top/left/width/height keeps it pixel-perfect across any parent transform.
                heroTl.to(
                  heroEl,
                  {
                    top: targetTop,
                    left: targetLeft,
                    width: slotRect.width,
                    height: slotRect.height,
                    duration: 0.8,
                    ease: "cine",
                  },
                  0.2
                );
                // Ken Burns inside the flying hero: ease the cover image scale down as it lands
                if (heroPhotoRef.current) {
                  heroTl.fromTo(
                    heroPhotoRef.current,
                    { scale: 1.14 },
                    { scale: 1.0, duration: 0.8, ease: "cine" },
                    0.2
                  );
                }

                // 0.85–1.0: hero fades out as a hard "cut" into the grid slot
                heroTl.to(heroEl, { opacity: 0, duration: 0.15, ease: "cut" }, 0.85);
                // hand off to the real slot image underneath
                if (heroSlotImgRef.current) {
                  heroTl.set(heroSlotImgRef.current, { visibility: "visible" }, 0.95);
                }
                // release will-change once the moment is over
                heroTl.set(heroEl, { willChange: "auto" }, 0.99);
                heroTl.set(headerRef.current, { willChange: "auto" }, 0.99);
              });
            };

            // Wait for ALL grid images to load — masonry layout depends on heights
            const allImgs = Array.from(gridRef.current?.querySelectorAll("img") ?? []);
            const pending = allImgs.filter((img) => !img.complete || img.naturalHeight === 0);
            if (pending.length === 0) {
              runSetup();
            } else {
              let done = 0;
              const onSettled = () => {
                if (++done === pending.length) {
                  ScrollTrigger.refresh();
                  runSetup();
                }
              };
              pending.forEach((img) => {
                img.addEventListener("load", onSettled, { once: true });
                img.addEventListener("error", onSettled, { once: true });
              });
            }
          })
        );

        // --- ScrambleText counter readout, fires once when grid enters ---
        if (counterRef.current) {
          ScrollTrigger.create({
            trigger: gridRef.current,
            start: "top 80%",
            once: true,
            onEnter: () => {
              if (counterScrambled) return;
              counterScrambled = true;
              gsap.to(counterRef.current, {
                duration: 1.1,
                scrambleText: { text: "05 / 07", chars: "0123456789 /", speed: 0.4 },
                ease: "none",
              });
            },
          });
        }

        // --- Grid photo items — clip wipes + Ken Burns + layered parallax + hover ---
        photoItems.forEach((photo, index) => {
          const img = photo.querySelector("img");
          const overlay = photo.querySelector(".photo-overlay");
          const number = photo.querySelector(".photo-number");

          const clipPatterns = [
            { from: "inset(0 100% 0 0)", to: "inset(0 0% 0 0%)" },
            { from: "inset(100% 0 0 0)", to: "inset(0% 0 0 0)" },
            { from: "inset(0 0 0 100%)", to: "inset(0 0 0 0%)" },
            { from: "inset(0 0 100% 0)", to: "inset(0 0 0% 0)" },
            { from: "circle(0% at 50% 50%)", to: "circle(75% at 50% 50%)" },
            {
              from: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
              to: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            },
          ];
          const clip = clipPatterns[index % clipPatterns.length];

          // Cinematic clip-path mask wipe as it scrolls into view
          gsap.fromTo(
            photo,
            { clipPath: clip.from, opacity: 0.3 },
            {
              clipPath: clip.to,
              opacity: 1,
              ease: "cine",
              scrollTrigger: { trigger: photo, start: "top 92%", end: "top 55%", scrub: 1 },
            }
          );

          if (img) {
            // Desaturated to full color on scrub
            gsap.fromTo(
              img,
              { filter: "grayscale(100%) brightness(0.7)" },
              {
                filter: "grayscale(0%) brightness(1)",
                ease: "none",
                scrollTrigger: { trigger: photo, start: "top 85%", end: "top 40%", scrub: 1 },
              }
            );
            // Ken Burns: slow scale settle across the whole pass (layered depth)
            gsap.fromTo(
              img,
              { scale: 1.18 },
              {
                scale: 1.04,
                ease: "none",
                scrollTrigger: { trigger: photo, start: "top bottom", end: "bottom top", scrub: 2.5 },
              }
            );
            // Parallax drift: alternating depths so neighbours separate
            const depth = 14 + (index % 3) * 14;
            gsap.fromTo(
              img,
              { y: depth },
              {
                y: -depth,
                ease: "none",
                scrollTrigger: { trigger: photo, start: "top bottom", end: "bottom top", scrub: 2 },
              }
            );
          }

          if (number)
            gsap.fromTo(
              number,
              { y: 20, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.4,
                ease: EASINGS.smooth,
                scrollTrigger: {
                  trigger: photo,
                  start: "top 70%",
                  toggleActions: "play none none reverse",
                },
              }
            );

          photo.addEventListener("mouseenter", () => {
            setHoveredIndex(index);
            if (img)
              gsap.to(img, {
                scale: 1.2,
                filter: "grayscale(0%) brightness(1.05)",
                duration: 0.6,
                ease: "cineOut",
                overwrite: "auto",
              });
            gsap.to(photo, { zIndex: 10, duration: 0 });
            if (overlay) gsap.to(overlay, { opacity: 1, duration: 0.3 });
            photoItems.forEach((other, oi) => {
              if (oi !== index)
                gsap.to(other, { opacity: 0.35, scale: 0.97, duration: 0.4, ease: EASINGS.smooth });
            });
          });

          photo.addEventListener("mousemove", (e) => {
            const rect = photo.getBoundingClientRect();
            const x = e.clientX - rect.left,
              y = e.clientY - rect.top;
            const cX = rect.width / 2,
              cY = rect.height / 2;
            gsap.to(photo, {
              rotateX: ((y - cY) / cY) * -6,
              rotateY: ((x - cX) / cX) * 6,
              duration: 0.3,
              ease: "power2.out",
            });
            if (img)
              gsap.to(img, {
                x: ((x - cX) / cX) * -12,
                y: ((y - cY) / cY) * -12,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto",
              });
          });

          photo.addEventListener("mouseleave", () => {
            setHoveredIndex(null);
            if (img)
              gsap.to(img, { scale: 1.05, x: 0, y: 0, duration: 0.6, ease: "power3.out", overwrite: "auto" });
            gsap.to(photo, { rotateX: 0, rotateY: 0, zIndex: 1, duration: 0.5, ease: EASINGS.smooth });
            if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
            photoItems.forEach((other) =>
              gsap.to(other, { opacity: 1, scale: 1, duration: 0.4, ease: EASINGS.smooth })
            );
          });
        });

        // --- Velocity-reactive skew on the grid: filmic motion smear on fast scroll ---
        scrollVelocity.start();
        velocityUnsub = scrollVelocity.subscribe(() => {
          if (!gridRef.current) return;
          const n = scrollVelocity.getNormalizedVelocity(2200);
          const skew = n * 1.6 * Math.sign(scrollVelocity.velocity);
          gsap.to(gridRef.current, { skewY: skew, duration: 0.2, overwrite: "auto" });
        });
      }, sectionRef);

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        if (velocityUnsub) velocityUnsub();
        scrollVelocity.stop();
        if (heroSplit) heroSplit.revert();
        if (headerSplit) headerSplit.revert();
        ctx.revert();
      };
    });

    return () => {
      mm.revert();
      scrollVelocity.stop();
    };
  }, [heroPhoto]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-neutral-950"
      data-hovered={hoveredIndex == null ? undefined : hoveredIndex}
    >
      <div ref={pinnedRef} className="relative bg-neutral-950 overflow-hidden">
        {/* LAYER 1: Masonry grid — always in DOM, dimmed until hero lands */}
        <div
          ref={gridContainerRef}
          className="min-h-screen w-full bg-neutral-950 py-16 md:py-24 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-neutral-900 pointer-events-none" />

          <div ref={headerRef} className="max-w-7xl mx-auto px-4 md:px-6 mb-8 md:mb-16 relative z-10">
            <div className="flex items-center gap-4 md:gap-6 mb-4">
              <span
                ref={headerIndexRef}
                className="font-mono text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] text-neutral-500"
              >
                05
              </span>
              {/* DrawSVG rule (replaces the static divider) */}
              <svg
                className="flex-1 h-px overflow-visible"
                viewBox="0 0 100 1"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <line
                  ref={headerLineRef}
                  x1="0"
                  y1="0.5"
                  x2="100"
                  y2="0.5"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-neutral-800"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            <h2
              ref={headerTitleRef}
              className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Photography
            </h2>
            <p className="mt-3 md:mt-4 text-neutral-400 font-mono text-xs md:text-sm max-w-xl">
              Capturing moments through a monochromatic lens. Each frame tells a story.
            </p>
          </div>

          <div ref={gridRef} className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
            {/* Mobile */}
            <div className="flex flex-col gap-4 md:hidden">
              {photos.map((photo, i) => (
                <a
                  key={photo.id}
                  href={photo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="photo-item block relative overflow-hidden group"
                  style={{ perspective: "1000px" }}
                >
                  <div className="relative">
                    <img
                      src={photo.img}
                      alt={`Photography ${i + 1}`}
                      className="w-full h-auto object-contain transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-active:opacity-100 transition-opacity" />
                    <span className="photo-number absolute bottom-3 right-3 font-mono text-xs text-white/70 bg-black/60 px-2 py-1 backdrop-blur-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </a>
              ))}
            </div>

            {/* Desktop masonry */}
            <div
              className="hidden md:block md:columns-3 lg:columns-4 gap-4"
              style={{ perspective: "1500px" }}
            >
              {photos.map((photo, i) => (
                <a
                  key={photo.id}
                  href={photo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="photo-item block mb-4 break-inside-avoid relative overflow-hidden group cursor-pointer"
                  style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
                  ref={i === heroIdx ? heroSlotRef : null}
                >
                  <div className="relative">
                    <img
                      ref={i === heroIdx ? heroSlotImgRef : null}
                      src={photo.img}
                      alt={`Photography ${i + 1}`}
                      className="w-full h-auto transition-all duration-500"
                      style={{ transform: "scale(1.05)" }}
                    />
                    <div className="photo-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 flex flex-col items-center justify-end pb-8">
                      <span className="font-mono text-xs uppercase tracking-widest text-white mb-2">
                        View Full
                      </span>
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                        />
                      </svg>
                    </div>
                    <div className="absolute inset-2 border border-white/0 group-hover:border-white/40 transition-all duration-500 pointer-events-none" />
                  </div>
                  <span className="photo-number absolute bottom-3 left-3 font-mono text-xs text-white/50 group-hover:text-white/90 transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div
            ref={counterRef}
            className="absolute bottom-4 md:bottom-16 right-4 md:right-8 font-mono text-xs text-neutral-600 tracking-widest z-10"
          >
            05 / 07
          </div>
        </div>

        {/* LAYER 2: Hero photo overlay — positioned OUTSIDE the masonry perspective
            container so top/left/width/height animates pixel-perfectly.
            Desktop only; hidden on mobile via CSS. */}
        <div
          ref={heroContainerRef}
          className="hidden lg:block absolute top-0 left-0 pointer-events-none z-20"
          style={{ width: "100%", height: "100vh", overflow: "hidden" }}
        >
          <img
            ref={heroPhotoRef}
            src={heroPhoto.img}
            alt="Featured photography"
            className="w-full h-full object-cover"
          />
          <div
            ref={heroGradientRef}
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
          />
          <div ref={heroTextRef} className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center">
            <span
              ref={heroKickerRef}
              className="font-mono text-xs uppercase tracking-[0.3em] text-white/70 block mb-3"
            >
              Photography
            </span>
            <h3
              ref={heroTitleRef}
              className="text-4xl md:text-6xl font-bold text-white tracking-tight"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Through My Lens
            </h3>
            <div ref={heroRuleRef} className="w-16 h-px bg-white/40 mx-auto mt-6" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ScrollPhotosSection;
