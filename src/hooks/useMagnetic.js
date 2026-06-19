import { useRef, useEffect, useCallback } from "react";
import { gsap } from "../utils/gsapConfig";

/**
 * Creates a magnetic pull effect on hover
 * Elements follow cursor within bounds, snap back on leave
 *
 * @param {Object} options - Configuration options
 * @param {number} options.strength - Magnetic pull strength (0-1, default: 0.3)
 * @param {number} options.ease - GSAP ease duration for movement (default: 0.3)
 * @param {number} options.resetEase - GSAP ease duration for reset (default: 0.5)
 * @param {string} options.resetEaseType - GSAP ease type for reset (default: 'elastic.out(1, 0.3)')
 * @param {boolean} options.disabled - Whether to disable the effect (default: false)
 * @returns {Object} Object with ref to attach to element and event handlers
 */
export function useMagnetic(options = {}) {
  const {
    strength = 0.3,
    ease = 0.3,
    resetEase = 0.5,
    resetEaseType = "elastic.out(1, 0.3)",
    disabled = false,
  } = options;

  const elementRef = useRef(null);
  const boundingRef = useRef(null);

  const handleMouseMove = useCallback(
    (e) => {
      if (disabled || !elementRef.current) return;

      const element = elementRef.current;
      const bounding = boundingRef.current;

      if (!bounding) return;

      // Calculate cursor position relative to element center
      const centerX = bounding.left + bounding.width / 2;
      const centerY = bounding.top + bounding.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      // Apply magnetic effect with strength multiplier
      gsap.to(element, {
        x: deltaX * strength,
        y: deltaY * strength,
        duration: ease,
        ease: "power2.out",
      });
    },
    [strength, ease, disabled],
  );

  const handleMouseEnter = useCallback(() => {
    if (disabled || !elementRef.current) return;
    boundingRef.current = elementRef.current.getBoundingClientRect();
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    if (disabled || !elementRef.current) return;

    // Reset position with elastic snap
    gsap.to(elementRef.current, {
      x: 0,
      y: 0,
      duration: resetEase,
      ease: resetEaseType,
    });

    boundingRef.current = null;
  }, [resetEase, resetEaseType, disabled]);

  // Attach event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element || disabled) return;

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseEnter, handleMouseMove, handleMouseLeave, disabled]);

  return {
    ref: elementRef,
    // Manual handlers for cases where ref attachment isn't ideal
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}

/**
 * Apply magnetic effect to multiple elements via refs
 *
 * @param {Object} options - Same options as useMagnetic
 * @returns {Function} Function that returns props to spread on elements
 */
export function useMagneticGroup(options = {}) {
  const {
    strength = 0.3,
    ease = 0.3,
    resetEase = 0.5,
    resetEaseType = "elastic.out(1, 0.3)",
    disabled = false,
  } = options;

  const getMagneticProps = useCallback(
    (element) => {
      if (disabled) return {};

      let bounding = null;

      const handleMouseEnter = () => {
        if (element) {
          bounding = element.getBoundingClientRect();
        }
      };

      const handleMouseMove = (e) => {
        if (!element || !bounding) return;

        const centerX = bounding.left + bounding.width / 2;
        const centerY = bounding.top + bounding.height / 2;

        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;

        gsap.to(element, {
          x: deltaX * strength,
          y: deltaY * strength,
          duration: ease,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        if (!element) return;

        gsap.to(element, {
          x: 0,
          y: 0,
          duration: resetEase,
          ease: resetEaseType,
        });

        bounding = null;
      };

      return {
        onMouseEnter: handleMouseEnter,
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
      };
    },
    [strength, ease, resetEase, resetEaseType, disabled],
  );

  return getMagneticProps;
}

/**
 * Apply magnetic effect imperatively (for use with GSAP context)
 *
 * @param {HTMLElement} element - Element to apply magnetic effect to
 * @param {Object} options - Configuration options
 * @returns {Function} Cleanup function to remove listeners
 */
export function applyMagneticEffect(element, options = {}) {
  if (!element) return () => {};

  const {
    strength = 0.3,
    ease = 0.3,
    resetEase = 0.5,
    resetEaseType = "elastic.out(1, 0.3)",
  } = options;

  let bounding = null;

  const handleMouseEnter = () => {
    bounding = element.getBoundingClientRect();
    // Add will-change for better performance
    gsap.set(element, { willChange: "transform" });
  };

  const handleMouseMove = (e) => {
    if (!bounding) return;

    const centerX = bounding.left + bounding.width / 2;
    const centerY = bounding.top + bounding.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    gsap.to(element, {
      x: deltaX * strength,
      y: deltaY * strength,
      duration: ease,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: resetEase,
      ease: resetEaseType,
      onComplete: () => {
        gsap.set(element, { willChange: "auto" });
      },
    });

    bounding = null;
  };

  element.addEventListener("mouseenter", handleMouseEnter);
  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  // Return cleanup function
  return () => {
    element.removeEventListener("mouseenter", handleMouseEnter);
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
}

export default useMagnetic;
