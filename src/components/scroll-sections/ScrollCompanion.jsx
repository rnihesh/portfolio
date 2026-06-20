import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../../utils/gsapConfig";

const EMERALD = "#10b981";

/**
 * ScrollCompanion — a refined line-art figure (a filled silhouette with real
 * proportions: head, tapered torso, shaped limbs and feet) that walks across
 * the page as you scroll. It fades in around the manifesto and travels left to
 * right; its limbs swing in a walk cycle coupled to scroll, it bobs as it
 * steps, and it throws a couple of gestures over the journey (a reach near the
 * middle, a wave near the end). Sits above the opaque sections so it is always
 * visible, pointer-events: none so it never blocks. Reduced motion = a static
 * figure.
 */
export default function ScrollCompanion() {
  const wrapRef = useRef(null);
  const figRef = useRef(null);
  const bodyRef = useRef(null);
  const armLRef = useRef(null);
  const armRRef = useRef(null);
  const legLRef = useRef(null);
  const legRRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const fig = figRef.current;
    if (!wrap || !fig) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(wrap, { opacity: 0.6 });
      gsap.set(fig, { x: window.innerWidth * 0.1 });
      return;
    }

    gsap.set(wrap, { opacity: 0 });

    const ctx = gsap.context(() => {
      gsap.to(wrap, {
        opacity: 0.9,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "9% top",
          end: "12% top",
          scrub: true,
        },
      });

      const STEPS = 22; // strides across the whole page
      const lerp = (a, b, t) => a + (b - a) * t;
      // ease a value to 1 inside [s,e], back to 0 outside (for gestures)
      const bump = (p, s, e) => {
        if (p < s || p > e) return 0;
        const t = (p - (s + e) / 2) / ((e - s) / 2); // -1..1
        return 1 - t * t; // smooth 0->1->0
      };

      const st = ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;
          const phase = p * STEPS * Math.PI * 2;
          const swing = Math.sin(phase) * 19;

          // gestures: a reach around the timeline, a wave near the end
          const reach = bump(p, 0.55, 0.66); // raise right arm forward
          const wave = bump(p, 0.9, 1.0); // raise + wave right arm up

          const armRBase = swing * 0.8;
          const armRGesture = lerp(armRBase, -118, Math.max(reach, wave));
          const waveWobble = wave * Math.sin(p * 80) * 16;

          gsap.set(legLRef.current, { rotation: swing });
          gsap.set(legRRef.current, { rotation: -swing });
          gsap.set(armLRef.current, { rotation: -swing * 0.8 });
          gsap.set(armRRef.current, { rotation: armRGesture + waveWobble });
          gsap.set(bodyRef.current, { y: -Math.abs(Math.cos(phase)) * 3 });

          gsap.set(fig, { x: (0.05 + p * 0.82) * window.innerWidth });
        },
      });

      return () => st.kill();
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed inset-0 z-[35]"
      aria-hidden="true"
      style={{ opacity: 0 }}
    >
      <svg
        ref={figRef}
        className="absolute bottom-6"
        style={{ left: 0, width: 78, height: 132, overflow: "visible" }}
        viewBox="0 0 100 170"
        fill={EMERALD}
      >
        <g ref={bodyRef}>
          {/* legs (behind torso) */}
          <g ref={legLRef} style={{ transformOrigin: "44px 96px" }}>
            <rect x="38.5" y="92" width="11" height="58" rx="5.5" />
            <ellipse cx="40" cy="150" rx="9" ry="5" />
          </g>
          <g ref={legRRef} style={{ transformOrigin: "56px 96px" }}>
            <rect x="50.5" y="92" width="11" height="58" rx="5.5" />
            <ellipse cx="60" cy="150" rx="9" ry="5" />
          </g>

          {/* arms */}
          <g ref={armLRef} style={{ transformOrigin: "39px 50px" }}>
            <rect x="34.5" y="48" width="9" height="48" rx="4.5" />
          </g>
          <g ref={armRRef} style={{ transformOrigin: "61px 50px" }}>
            <rect x="56.5" y="48" width="9" height="48" rx="4.5" />
          </g>

          {/* torso (tapered shoulders -> waist) */}
          <path d="M37,50 Q50,44 63,50 L59,96 Q50,100 41,96 Z" />
          {/* head */}
          <circle cx="50" cy="26" r="15" />
          <rect x="46" y="38" width="8" height="10" rx="3" />
        </g>
      </svg>
    </div>
  );
}
