import React from "react";
import { motion } from "framer-motion";
import Section from "../layout/Section";
import { TypeWrite } from "../ui/TypeWrite/TypeWrite";
import HandDrawnUnderline from "../my-creation/HandDrawnUnderline/HandDrawnUnderline";
import ExpandableCard from "../ui/ExpandableCards/ExpandableCards";
import { projects } from "../../data/projects";

function ProjectsSection({ id, isVisible, animationProps, modern }) {
  // staggered animation for children
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
  const words = [
    {
      text: "My",
      className: "text-black-500",
    },
    {
      text: "Projects ",
      className: "text-black-500",
    },
  ];
  return (
    <Section
      id={id}
      isVisible={isVisible}
      animationProps={animationProps}
      modern={modern}
      className="overflow-hidden relative" // Added overflow-hidden
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        exit="exit"
        className="flex flex-col items-center w-full"
      >
        <div
          className="sticky top-0 w-full h-[20vh] flex items-center justify-center bg-white dark:bg-black z-[9]"
          style={{
            position: "sticky",
            top: 0,
          }}
        >
          <HandDrawnUnderline
            strokeColor="#27ae60"
            strokeWidth={1.5}
            wobbleIntensityX={0.2}
            wobbleIntensityY={1.5}
            // segmentLength={15}
            style={{
              fontSize: "2em",
              fontWeight: "normal",
              color: "#34495e",
            }}
          >
            <TypeWrite words={words} />
          </HandDrawnUnderline>
        </div>

        <div
          className="h-[80vh] w-full overflow-y-scroll scrollbar-hide"
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <ExpandableCard cards={projects} />
        </div>
      </motion.div>
    </Section>
  );
}

export default ProjectsSection;
