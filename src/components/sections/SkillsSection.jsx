import React from "react";
import { motion } from "framer-motion";
import Section from "../layout/Section";
import DotGrid from "../../Backgrounds/DotGrid/DotGrid";
import { skills } from "../../data/skills";

function SkillsSection({ id, isVisible, animationProps }) {
  // staggered animation for children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.03,
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
        damping: 20,
        duration: 0.4,
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
        stiffness: 400,
        damping: 25,
        duration: 0.3,
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
    },
  };

  return (
    <Section
      id={id}
      isVisible={isVisible}
      animationProps={animationProps}
      background={
        <DotGrid
          dotSize={4}
          gap={32}
          baseColor="#adacac"
          activeColor="#10b981"
          proximity={150}
          className="w-full h-full overflow-hidden"
        />
      }
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        exit="exit"
        className="flex flex-col items-center max-w-4xl"
      >
        <motion.h2
          variants={item}
          className="text-4xl md:text-5xl font-bold mb-10 text-black dark:text-white"
          style={{ fontFamily: "'Red Rose', cursive" }}
        >
          My Skills
        </motion.h2>

        <motion.div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 max-w-full">
          {skills.map((skill) => (
            <motion.div
              key={skill.name}
              variants={skillItem}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-gray-50 rounded-xl p-2 flex items-center justify-center mb-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <img
                  src={skill.image}
                  alt={`${skill.name} logo`}
                  className="w-10 h-10 md:w-12 md:h-12 object-contain"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/100x100/10b981/ffffff?text=${skill.name[0]}`;
                  }}
                />
              </div>
              <p
                className="text-xs md:text-sm font-medium text-black dark:text-white text-center"
                style={{ fontFamily: "'Cascadia Code', monospace" }}
              >
                {skill.name}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </Section>
  );
}

export default SkillsSection;
