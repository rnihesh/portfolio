import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Configure global GSAP defaults
gsap.defaults({
  ease: "power3.out",
  duration: 1,
});

// ScrollTrigger defaults
ScrollTrigger.defaults({
  toggleActions: "play none none reverse",
  markers: false,
});

// Responsive breakpoints for gsap.matchMedia
export const BREAKPOINTS = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
  reducedMotion: "(prefers-reduced-motion: reduce)",
};

// Custom easing presets
export const EASINGS = {
  // Bouncy - great for playful entrance animations
  bouncy: "elastic.out(1, 0.5)",
  bouncyStrong: "elastic.out(1, 0.3)",

  // Sharp - for snappy, precise movements
  sharp: "power4.out",
  sharpIn: "power4.in",
  sharpInOut: "power4.inOut",

  // Snappy - quick with subtle overshoot
  snappy: "back.out(1.7)",
  snappyStrong: "back.out(2.5)",

  // Smooth - for subtle, elegant transitions
  smooth: "power2.out",
  smoothInOut: "power2.inOut",

  // Expo - dramatic acceleration/deceleration
  expo: "expo.out",
  expoIn: "expo.in",
  expoInOut: "expo.inOut",
};

/**
 * Scroll Velocity Tracker
 * Tracks scroll velocity for velocity-dependent animations
 */
class ScrollVelocityTracker {
  constructor() {
    this.velocity = 0;
    this.lastScrollY = 0;
    this.lastTime = Date.now();
    this.isTracking = false;
    this.listeners = new Set();
    this.rafId = null;
  }

  start() {
    if (this.isTracking) return;
    this.isTracking = true;
    this.lastScrollY = window.scrollY;
    this.lastTime = Date.now();
    this.update();
  }

  stop() {
    this.isTracking = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  update = () => {
    if (!this.isTracking) return;

    const currentScrollY = window.scrollY;
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastTime;

    if (deltaTime > 0) {
      const deltaY = currentScrollY - this.lastScrollY;
      // Calculate velocity in pixels per second
      const rawVelocity = (deltaY / deltaTime) * 1000;

      // Smooth the velocity with lerp
      this.velocity = gsap.utils.interpolate(this.velocity, rawVelocity, 0.3);

      // Notify listeners
      this.listeners.forEach((callback) => callback(this.velocity));
    }

    this.lastScrollY = currentScrollY;
    this.lastTime = currentTime;

    this.rafId = requestAnimationFrame(this.update);
  };

  // Get absolute velocity (direction-independent)
  getAbsoluteVelocity() {
    return Math.abs(this.velocity);
  }

  // Get normalized velocity (0-1 range based on maxVelocity)
  getNormalizedVelocity(maxVelocity = 2000) {
    return gsap.utils.clamp(0, 1, this.getAbsoluteVelocity() / maxVelocity);
  }

  // Subscribe to velocity changes
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
}

// Singleton instance
export const scrollVelocity = new ScrollVelocityTracker();

/**
 * Create a gsap.matchMedia instance with predefined breakpoints
 * @returns {gsap.matchMedia} Configured matchMedia instance
 */
export const createMatchMedia = () => gsap.matchMedia();

/**
 * Helper to add all standard breakpoint handlers to a matchMedia instance
 * @param {gsap.matchMedia} mm - matchMedia instance
 * @param {Object} handlers - Object with handlers for each breakpoint
 * @param {Function} handlers.reducedMotion - Handler for reduced motion preference
 * @param {Function} handlers.mobile - Handler for mobile breakpoint
 * @param {Function} handlers.tablet - Handler for tablet breakpoint
 * @param {Function} handlers.desktop - Handler for desktop breakpoint
 */
export const addResponsiveHandlers = (mm, handlers) => {
  if (handlers.reducedMotion) {
    mm.add(BREAKPOINTS.reducedMotion, handlers.reducedMotion);
  }
  if (handlers.mobile) {
    mm.add(BREAKPOINTS.mobile, handlers.mobile);
  }
  if (handlers.tablet) {
    mm.add(BREAKPOINTS.tablet, handlers.tablet);
  }
  if (handlers.desktop) {
    mm.add(BREAKPOINTS.desktop, handlers.desktop);
  }
};

/**
 * Create a ScrollTrigger with dynamic will-change management
 * @param {Object} config - ScrollTrigger config
 * @param {HTMLElement|string} element - Element to animate
 * @returns {ScrollTrigger} ScrollTrigger instance
 */
export const createOptimizedScrollTrigger = (config, element) => {
  const originalOnEnter = config.onEnter;
  const originalOnLeave = config.onLeave;
  const originalOnEnterBack = config.onEnterBack;
  const originalOnLeaveBack = config.onLeaveBack;

  return ScrollTrigger.create({
    ...config,
    onEnter: (...args) => {
      if (element) gsap.set(element, { willChange: "transform, opacity" });
      originalOnEnter?.(...args);
    },
    onLeave: (...args) => {
      if (element) gsap.set(element, { willChange: "auto" });
      originalOnLeave?.(...args);
    },
    onEnterBack: (...args) => {
      if (element) gsap.set(element, { willChange: "transform, opacity" });
      originalOnEnterBack?.(...args);
    },
    onLeaveBack: (...args) => {
      if (element) gsap.set(element, { willChange: "auto" });
      originalOnLeaveBack?.(...args);
    },
  });
};

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if reduced motion is preferred
 */
export const prefersReducedMotion = () => {
  return window.matchMedia(BREAKPOINTS.reducedMotion).matches;
};

// Kill all ScrollTriggers on route change
export const cleanupScrollTriggers = () => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  ScrollTrigger.clearScrollMemory();
  scrollVelocity.stop();
};

// Refresh ScrollTrigger calculations
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh();
};

export { gsap, ScrollTrigger };
