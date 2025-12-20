import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Section from "../layout/Section";
import rough from "roughjs/bundled/rough.esm";
import { annotate } from "rough-notation";

function VibeSection({ id, isVisible, animationProps, modern }) {
  const svgRef = useRef(null);
  const battrixRef = useRef(null);
  const myftpRef = useRef(null);

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

  // Apply rough notation to headings when component becomes visible
  useEffect(() => {
    if (!isVisible || !battrixRef.current || !myftpRef.current) return;

    // Check if dark mode is active
    const isDarkMode = document.documentElement.classList.contains("dark");
    const annotationColor = isDarkMode ? "#fff" : "#000";

    // Create annotations
    const battrixAnnotation = annotate(battrixRef.current, {
      type: "highlight",
      color: "rgba(255,200,0,0.7)",
      strokeWidth: 3,
      iterations: 2,
    });

    const myftpAnnotation = annotate(myftpRef.current, {
      type: "box",
      color: "rgba(255,0,200,0.7)",
      strokeWidth: 3,
      padding: 5,
    });

    // Show annotations with a slight delay between them
    battrixAnnotation.show();

    setTimeout(() => {
      myftpAnnotation.show();
    }, 300);

    // Clean up
    return () => {
      battrixAnnotation.hide();
      myftpAnnotation.hide();
    };
  }, [isVisible]);

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
    <Section
      id={id}
      isVisible={isVisible}
      animationProps={animationProps}
      modern={modern}
      className="flex flex-col"
      innerClassName="flex-col g-10"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        exit="exit"
        className="flex flex-row items-center justify-center flex-wrap"
      >
        <div className="border-2 border-black dark:border-white rounded-xl border-dashed p-10 w-[80vw] md:w-sm  flex flex-col justify-center items-center bg-gray-200 dark:bg-gray-400">
          <h2
            ref={battrixRef}
            className="text-black text-3xl mb-2"
            style={{ fontFamily: "Red Rose" }}
          >
            Battrix
          </h2>

          <img
            src="vibe/battrix.png"
            alt="battrix"
            className="rounded object-cover object-top h-40 w-50  hidden lg:block"
          />

          <p
            className="text-md mt-2 hidden md:block"
            style={{ fontFamily: "JetBrains Mono", textAlign: "center" }}
          >
            Battrix is a lightweight, smart battery companion app I built to
            provide mac users with real-time insights into their device’s
            battery health, usage, and charging behavior.
          </p>

          <div className="flex flex-row gap-1 items-center mt-3">
            <p
              className="bg-gray-500 px-2 py-1 rounded-[15px] mt-2"
              style={{ fontFamily: "Fira Code" }}
            >
              Swift
            </p>
            <a href="https://github.com/rnihesh/battrix" className="ml-3">
              <img
                src="github/github-mark-white.svg"
                alt=""
                width="40px"
                className="invert  hover:scale-110 transition"
              />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center scale-55 md:scale-75 lg:scale-100 my-[-40px] md:my-0">
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
            className="scale-55 md:scale-75 lg:scale-100"
          />
        </div>

        <div className="border-2 border-black dark:border-white rounded-xl border-dashed p-10 w-[80vw] md:w-sm  flex flex-col justify-center items-center bg-gray-200 dark:bg-gray-400">
          <h2
            ref={myftpRef}
            className="text-black text-3xl mb-2"
            style={{ fontFamily: "Red Rose" }}
          >
            MyFTP Server
          </h2>

          <img
            src="vibe/myftpserver.jpg"
            alt="battrix"
            className="rounded object-cover object-top h-40 w-50 hidden lg:block"
          />

          <p
            className="text-md mt-2 hidden md:block"
            style={{ fontFamily: "JetBrains Mono", textAlign: "center" }}
          >
            MyFTPServer is a custom Android FTP server app I developed to enable
            seamless file transfer between Android devices and other systems
            over Wi-Fi. Supports Anonymous Sign In.
          </p>

          <div className="flex flex-row gap-1 items-center mt-3">
            <p
              className="bg-gray-500 px-2 py-1 rounded-[15px] mt-2"
              style={{ fontFamily: "Fira Code" }}
            >
              Kotlin
            </p>
            <a href="https://github.com/rnihesh/MyFtpServer" className="ml-3">
              <img
                src="github/github-mark-white.svg"
                alt=""
                width="40px"
                className="invert  hover:scale-110 transition"
              />
            </a>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

export default VibeSection;
