import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../utils/gsapConfig";

/**
 * Custom hook that creates a GSAP context for proper cleanup in React
 * @param {Function} animationCallback - Function containing GSAP animations
 * @param {any[]} dependencies - Dependencies array for useEffect
 * @param {React.RefObject} scopeRef - Optional ref to scope animations
 */
export const useGSAPContext = (
  animationCallback,
  dependencies = [],
  scopeRef = null,
) => {
  const contextRef = useRef(null);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Create context scoped to the ref element (or document if no ref)
      const ctx = gsap.context(() => {
        animationCallback();
      }, scopeRef?.current || document);

      contextRef.current = ctx;
    }, 100);

    // Cleanup: revert all GSAP animations created in this context
    return () => {
      clearTimeout(timer);
      if (contextRef.current) {
        contextRef.current.revert();
      }
    };
  }, dependencies);

  return contextRef;
};

/**
 * Hook for creating ScrollTrigger-controlled timelines with automatic cleanup
 * @param {Object} config - Configuration object with scrollTrigger and buildTimeline
 * @param {any[]} dependencies - Dependencies array
 */
export const useScrollTimeline = (config, dependencies = []) => {
  const timelineRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const tl = gsap.timeline({
        scrollTrigger: config.scrollTrigger,
      });

      // Execute animation builder
      if (config.buildTimeline) {
        config.buildTimeline(tl);
      }

      timelineRef.current = tl;
    }, 100);

    return () => {
      clearTimeout(timer);
      if (timelineRef.current) {
        timelineRef.current.scrollTrigger?.kill();
        timelineRef.current.kill();
      }
    };
  }, dependencies);

  return timelineRef;
};

/**
 * Hook for responsive GSAP animations using matchMedia
 * @param {Object} animationConfigs - Object with mobile, tablet, desktop callbacks
 */
export const useGSAPMatchMedia = (animationConfigs) => {
  useEffect(() => {
    const mm = gsap.matchMedia();

    // Desktop animations
    if (animationConfigs.desktop) {
      mm.add("(min-width: 1024px)", () => {
        animationConfigs.desktop();
        return () => {};
      });
    }

    // Tablet animations
    if (animationConfigs.tablet) {
      mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
        animationConfigs.tablet();
        return () => {};
      });
    }

    // Mobile animations
    if (animationConfigs.mobile) {
      mm.add("(max-width: 767px)", () => {
        animationConfigs.mobile();
        return () => {};
      });
    }

    // Reduced motion
    if (animationConfigs.reducedMotion) {
      mm.add("(prefers-reduced-motion: reduce)", () => {
        animationConfigs.reducedMotion();
        return () => {};
      });
    }

    return () => mm.revert();
  }, []);
};

export default useGSAPContext;
