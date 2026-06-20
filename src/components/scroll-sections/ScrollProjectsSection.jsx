import React, { useRef, useEffect, useState } from "react";
import { gsap } from "../../utils/gsapConfig";
import { projects } from "../../data/projects";

/**
 * Selected Work — a pinned horizontal "reel".
 *
 * Desktop: the section pins and a horizontal track of project scenes scrubs
 * left as the page scrolls. Every scene is ALWAYS rendered (no hidden clip-path
 * states, which previously left blank frames mid-scrub); the scene nearest the
 * viewport center is brought into focus (full scale/opacity) while neighbors
 * shrink and dim, computed per frame from live geometry. The index readout and
 * progress bar are driven by the same scrub, so the count always matches the
 * real project that is centered.
 *
 * Mobile / reduced-motion: a simple vertical stack, all scenes visible.
 *
 * Opaque bg-black + pinSpacing (default true) means the reel fully completes
 * before the next section (Connect) can appear: no bleed.
 */
function ScrollProjectsSection() {
  const sectionRef = useRef(null);
  const deckRef = useRef(null); // pinned h-screen desktop wrapper
  const trackRef = useRef(null); // horizontal flex track
  const fillRef = useRef(null); // progress bar
  const idxRef = useRef(null); // "0N" index readout
  const scenesRef = useRef([]);
  const [reduced, setReduced] = useState(false);

  const total = projects.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const upd = () => setReduced(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);

  useEffect(() => {
    const deck = deckRef.current;
    const track = trackRef.current;
    if (!deck || !track) return;

    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const scenes = scenesRef.current.filter(Boolean);
        gsap.set(scenes, { transformOrigin: "center center" });

        const focus = () => {
          const cx = window.innerWidth / 2;
          const reach = window.innerWidth * 0.5;
          let active = 0;
          let best = Infinity;
          scenes.forEach((s, i) => {
            const r = s.getBoundingClientRect();
            const dist = Math.abs(r.left + r.width / 2 - cx);
            const d = Math.min(1, dist / reach);
            s.style.opacity = `${1 - d * 0.7}`;
            s.style.transform = `scale(${1 - d * 0.12})`;
            if (dist < best) {
              best = dist;
              active = i;
            }
          });
          if (idxRef.current) {
            idxRef.current.textContent = String(active + 1).padStart(2, "0");
          }
        };

        const travel = () => Math.max(0, track.scrollWidth - window.innerWidth);

        gsap.set(track, { x: 0 });
        const tween = gsap.to(track, {
          x: () => -travel(),
          ease: "none",
          scrollTrigger: {
            trigger: deck,
            start: "top top",
            end: () => "+=" + travel(),
            pin: true,
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
            onRefresh: focus,
            onUpdate: (self) => {
              if (fillRef.current) {
                fillRef.current.style.width = `${Math.max(
                  4,
                  self.progress * 100
                )}%`;
              }
              focus();
            },
          },
        });
        focus();

        return () => {
          tween.scrollTrigger && tween.scrollTrigger.kill();
          tween.kill();
          gsap.set(track, { clearProps: "transform" });
          scenes.forEach((s) => {
            s.style.opacity = "";
            s.style.transform = "";
          });
        };
      }
    );

    return () => mm.revert();
  }, [reduced]);

  const Scene = ({ p, i }) => (
    <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-14 w-full items-center">
      <div className="order-2 lg:order-1">
        <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/10 bg-neutral-900">
          <img
            src={p.src}
            alt={p.title}
            loading="lazy"
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "projects/_placeholder.svg";
            }}
          />
        </div>
      </div>
      <div className="order-1 lg:order-2">
        <div
          className="font-mono text-xs tracking-[0.25em] text-emerald-500"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
        <h3
          className="mt-4 text-4xl xl:text-6xl font-bold tracking-tight leading-[0.95]"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          {p.title}
        </h3>
        <p className="mt-4 text-base xl:text-lg text-neutral-400 max-w-md">
          {p.description}
        </p>
        <div
          className="mt-7 flex items-center gap-6 font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          {p.ctaLink && (
            <a
              href={p.ctaLink}
              target="_blank"
              rel="noreferrer"
              className="text-white hover:text-emerald-400 transition-colors border-b border-emerald-500/50 pb-1"
            >
              {p.ctaText || "Visit"}
            </a>
          )}
          {p.github && (
            <a
              href={p.github}
              target="_blank"
              rel="noreferrer"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Source
            </a>
          )}
        </div>
      </div>
    </article>
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative w-full bg-black text-white overflow-hidden"
    >
      {/* ===== Desktop: pinned horizontal reel ===== */}
      <div
        ref={deckRef}
        className="hidden lg:block h-screen w-full relative bg-black"
      >
        {/* Header overlay (stays during pin) */}
        <div className="absolute top-10 left-0 w-full px-[5vw] z-20 flex items-start justify-between pointer-events-none">
          <div>
            <div
              className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-500"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              04 / Selected Work
            </div>
            <h2
              className="mt-3 text-5xl xl:text-7xl font-bold tracking-tight"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              The Reel
            </h2>
          </div>
          <div
            className="font-mono text-sm tracking-[0.2em] text-neutral-500"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            <span ref={idxRef} className="text-white">
              01
            </span>{" "}
            / {String(total).padStart(2, "0")}
          </div>
        </div>

        {/* Horizontal track */}
        <div
          ref={trackRef}
          className="flex h-full items-center will-change-transform"
        >
          {/* leading pad */}
          <div className="shrink-0 w-[8vw]" aria-hidden="true" />
          {projects.map((p, i) => (
            <div
              key={p.title}
              ref={(el) => (scenesRef.current[i] = el)}
              className="project-scene shrink-0 w-[78vw] xl:w-[68vw] px-[3vw] will-change-transform"
            >
              <Scene p={p} i={i} />
            </div>
          ))}
          {/* trailing pad */}
          <div className="shrink-0 w-[8vw]" aria-hidden="true" />
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-10 left-[5vw] right-[5vw] h-px bg-white/10 z-20">
          <div
            ref={fillRef}
            className="absolute inset-y-0 left-0 bg-emerald-500"
            style={{ width: "4%" }}
          />
        </div>
      </div>

      {/* ===== Mobile / tablet: vertical stack ===== */}
      <div className="lg:hidden px-6 py-20">
        <div
          className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-500"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          04 / Selected Work
        </div>
        <h2
          className="mt-3 mb-12 text-4xl font-bold tracking-tight"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          The Reel
        </h2>
        <div className="space-y-16">
          {projects.map((p, i) => (
            <Scene key={p.title} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ScrollProjectsSection;
