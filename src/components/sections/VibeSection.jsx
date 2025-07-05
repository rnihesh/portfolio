import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Section from "../layout/Section";
import rough from "roughjs/bundled/rough.esm";

function VibeSection({ id, isVisible, animationProps }) {
  const svgRef = useRef(null);
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
      },
    },
    exit: {
      y: -20,
      opacity: 0,
    },
  };

  const skillItem = {
    hidden: { scale: 0.8, opacity: 0 },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
    },
  };

  // Only try to draw when the component becomes visible
  useEffect(() => {
    if (!isVisible || !svgRef.current) return;

    // Clear existing content first
    while (svgRef.current.firstChild) {
      svgRef.current.removeChild(svgRef.current.firstChild);
    }

    // Check if dark mode is active
    const isDarkMode = document.documentElement.classList.contains("dark");
    const strokeColor = isDarkMode ? "#fff" : "#000";

    // Draw shapes
    try {
      const rc = rough.svg(svgRef.current);

      // Rectangle at the top
      const rectangle = rc.rectangle(105, 10, 90, 90, {
        roughness: 2.8,
        stroke: strokeColor,
        strokeWidth: 2,
        fill: "rgba(255,200,0,0.5)",
        fillStyle: "solid",
      });

      // Triangle in the middle
      const triangle = rc.polygon(
        [
          [150, 100], // Top point
          [105, 160], // Bottom left
          [195, 160], // Bottom right
        ],
        {
          roughness: 2.5,
          stroke: strokeColor,
          strokeWidth: 2,
          fill: "rgba(255,0,200,0.5)",
          fillStyle: "solid",
        }
      );

      // Circle at the bottom
      const circle = rc.circle(150, 195, 70, {
        roughness: 2.2,
        stroke: strokeColor,
        strokeWidth: 2,
        fill: "rgba(0,255,200,0.5)",
        fillStyle: "solid",
      });

      // Add all shapes to the SVG
      svgRef.current.appendChild(rectangle);
      svgRef.current.appendChild(triangle);
      svgRef.current.appendChild(circle);
    } catch (error) {
      console.error("Failed to draw with RoughJS:", error);
    }
  }, [isVisible]); // Only re-run when visibility changes

  return (
    <Section id={id} isVisible={isVisible} animationProps={animationProps} className="flex flex-col" innerClassName="flex-col g-10">
      <h2 style={{fontFamily:"JetBrains Mono", fontWeight:"800", fontOpticalSizing:"auto"}} className="dark:text-white mb-5 text-xl underline underline-offset-2">Under Construction</h2>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        exit="exit"
        className="flex flex-col items-center justify-center blur-sm"
      >
        <motion.h2
          variants={item}
          style={{ fontFamily: "Red Rose", fontWeight: "900" }}
          className="text-4xl dark:text-white"
        >
          {" "}
          VIBE{" "}
        </motion.h2>
        <svg
          ref={svgRef}
          width="300"
          height="300"
          style={{ display: "relative", zIndex: -6 }}
        />
      </motion.div>
    </Section>
  );
}

export default VibeSection;
