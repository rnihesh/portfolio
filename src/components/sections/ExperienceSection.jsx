import React from "react";
import Section from "../layout/Section";
import { motion } from "framer-motion";

function ExperienceSection({ id, isVisible, animationProps }) {
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
  return (
    <Section id={id} isVisible={isVisible} animationProps={animationProps}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        exit="exit"
        className="flex flex-col items-center max-w-4xl"
      >
        {/* Work Under Construction Code*/}
        {/* <motion.h2
          variants={item}
          className="text-3xl md:text-6xl font-bold 
        bg-[linear-gradient(to_bottom,grey_50%,black_50%)] 
        dark:bg-[linear-gradient(to_bottom,white_50%,grey_50%)] 
        bg-clip-text text-transparent"
          style={{
            fontFamily: "Cascadia Code",
            fontWeight: "100 900",
            textAlign: "center",
          }}
        >
          <span className="border-2 border-black rounded dark:border-white border-dashed bg-gray-400 z-100 text-white dark:text-black inline-block transform rotate-[-45deg] mr-[-20px] md:mr-[-50px]">
            Work
          </span>{" "}
          Under Construction
        </motion.h2> */}
        <motion.div
        // for mobile do flex col else row
        className="border-2 border-dotted border-gray-400 dark:border-gray-600 rounded-lg p-6 w-full flex flex-col md:flex-row justify-evenly gap-5 ">
          <motion.img
            src="work/dattam_in_logo_nobg.png"
            alt="Work in Progress"
            className="rounded-2xl border-[0.1px] dark:border-white w-200"
          />
          <motion.div className="flex flex-col justify-center dark:text-white">
            <motion.h1 className="font-extrabold text-5xl" style={{fontFamily: "Cascadia Code"}}>Dattam Labs</motion.h1>
            <motion.div className="" >
              <span style={{fontFamily: "Bodoni Moda"}} className="text-lg">Software Engineer Intern</span>
              <span> | </span>
              <span style={{fontFamily: "IBM Plex Mono"}} className="text-xs">Aug 2025 - Present</span>
            </motion.div>
            <motion.div>
              <p className="mt-2" style={{fontFamily: "Space Grotesk"}}>Worked on developing a mobile application using React Native Expo for the frontend, ensuring a seamless user experience across devices. On the backend, utilized Python and AWS services to create robust and scalable solutions.</p>
            </motion.div>
          </motion.div>
          
        </motion.div>
      </motion.div>
    </Section>
  );
}

export default ExperienceSection;
