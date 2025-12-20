import React from "react";
import Section from "../layout/Section";
import { motion } from "framer-motion";
import { experience } from "../../data/experience";
import { TypeWrite } from "../ui/TypeWrite/TypeWrite";
import HandDrawnUnderline from "../my-creation/HandDrawnUnderline/HandDrawnUnderline";

function ExperienceSection({ id, isVisible, animationProps, modern }) {
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

  const itemVariant = {
    hidden: { x: -20, opacity: 0 },
    show: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
      },
    },
    exit: {
      x: -20,
      opacity: 0,
    },
  };

  const words = [
    { text: "My", className: "text-black-500" },
    { text: "Experience", className: "text-black-500" },
  ];

  return (
    <Section id={id} isVisible={isVisible} animationProps={animationProps} modern={modern}>
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4 h-[80vh] overflow-y-auto scrollbar-hide">
        <div className="mb-12 text-center sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10 py-4 w-full">
          <HandDrawnUnderline
            strokeColor="#27ae60"
            strokeWidth={1.5}
            wobbleIntensityX={0.2}
            wobbleIntensityY={1.5}
            style={{
              fontSize: "2.5em",
              fontWeight: "bold",
              color: "#34495e",
            }}
          >
            <TypeWrite words={words} />
          </HandDrawnUnderline>
          <p
            className="text-sm text-gray-500 dark:text-gray-400 mt-5"
            style={{ fontFamily: "JetBrains Mono" }}
          >
            Hit{" "}
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs font-semibold">
              R
            </kbd>{" "}
            to view resume
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          exit="exit"
          className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 md:ml-6 space-y-12 pb-20"
        >
          {experience.map((job, index) => (
            <motion.div
              key={index}
              variants={itemVariant}
              className="relative pl-8 md:pl-12"
            >
              {/* Timeline Dot */}
              <span className="absolute -left-[11px] top-2 h-5 w-5 rounded-full border-4 border-white dark:border-gray-900 bg-blue-500 dark:bg-blue-400" />

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-start group">
                {/* Logo */}
                <div
                  className="shrink-0 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer transition-transform hover:scale-105"
                  onClick={() => window.open(job.link, "_blank")}
                >
                  <img
                    src={job.logo}
                    alt={job.company}
                    className="w-16 h-16 object-contain"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex flex-wrap items-center gap-2">
                    <span style={{ fontFamily: "Cascadia Code" }}>
                      {job.company}
                    </span>
                    <span
                      className="text-sm font-normal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full"
                      style={{ fontFamily: "IBM Plex Mono" }}
                    >
                      {job.period}
                    </span>
                  </h3>
                  <p
                    className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-2"
                    style={{ fontFamily: "Bodoni Moda" }}
                  >
                    {job.role}
                  </p>
                  <p
                    className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed font-light"
                    style={{ fontFamily: "Space Grotesk" }}
                  >
                    {job.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800"
                        style={{ fontFamily: "JetBrains Mono" }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

export default ExperienceSection;
