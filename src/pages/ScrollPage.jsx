import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  gsap,
  ScrollTrigger,
  cleanupScrollTriggers,
} from "../utils/gsapConfig";
import { usePageTitle } from "../hooks/usePageTitle";
import useFullscreen from "../hooks/useFullscreen";
import Lenis from "lenis";

// Import custom styles
import "../styles/scroll.css";

// Section imports
import ScrollHeroSection from "../components/scroll-sections/ScrollHeroSection";
import ScrollManifestoSection from "../components/scroll-sections/ScrollManifestoSection";
import ScrollSkillsSection from "../components/scroll-sections/ScrollSkillsSection";
import ScrollProjectsSection from "../components/scroll-sections/ScrollProjectsSection";
import ScrollPhotosSection from "../components/scroll-sections/ScrollPhotosSection";
import ScrollTimelineSection from "../components/scroll-sections/ScrollTimelineSection";
import ScrollConnectSection from "../components/scroll-sections/ScrollConnectSection";

function ScrollPage() {
  const mainRef = useRef(null);
  const progressRef = useRef(null);
  const lenisRef = useRef(null);
  const navigate = useNavigate();

  usePageTitle("", "scroll");
  useFullscreen();

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Add Lenis to GSAP ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Cleanup
    return () => {
      lenis.destroy();
      cleanupScrollTriggers();
    };
  }, []);

  // Refresh ScrollTrigger after layout, fonts and images settle so every
  // section's pin start/end is measured against its REAL height. Without this,
  // pins (e.g. Connect) compute stale positions and overlap their neighbours.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const timers = [300, 800, 1500, 2500].map((ms) =>
      window.setTimeout(refresh, ms)
    );
    window.addEventListener("load", refresh);
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("load", refresh);
    };
  }, []);

  // Scroll progress indicator
  useEffect(() => {
    if (!progressRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (
        e.key === "Escape" ||
        e.key.toLowerCase() === "b" ||
        (e.key.toLowerCase() === "h" && e.ctrlKey)
      ) {
        navigate("/");
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate]);

  return (
    <div
      ref={mainRef}
      className="bg-black text-white overflow-x-hidden smooth-text"
    >
      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Scroll progress bar */}
      <div
        ref={progressRef}
        className="scroll-progress bg-white"
        style={{ transform: "scaleX(0)" }}
      />

      {/* Main content */}
      <main>
        <ScrollHeroSection />
        <ScrollManifestoSection />
        <ScrollSkillsSection />
        <ScrollProjectsSection />
        <ScrollPhotosSection />
        <ScrollTimelineSection />
        <ScrollConnectSection />
      </main>
    </div>
  );
}

export default ScrollPage;
