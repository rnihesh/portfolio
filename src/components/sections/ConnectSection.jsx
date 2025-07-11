import React from "react";
import Section from "../layout/Section";
import "./ConnectSection.css";
import { motion } from "framer-motion";
import TextPressure from "../../TextAnimations/TextPressure/TextPressure";

function ConnectSection({ id, isVisible, animationProps }) {
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
    <Section
      id={id}
      isVisible={isVisible}
      animationProps={animationProps}
      className="connect-back flex items-center justify-center w-full h-full "
      background={
        <motion.div
          variants={container}
          className="relative grid grid-cols-1 md:grid-cols-2 w-full h-full gap-8 overflow-hidden pt-[10vh]"
        >
          <div className="flex items-center justify-center h-full/2 w-full my-auto">
            <TextPressure
              text="#"
              flex={false}
              weight={true}
              width={true}
              italic={true}
              minFontSize="50vw"
              fontFamily="Fira Code"
              fontUrl="https://fonts.gstatic.com/s/firacode/v26/uU9NCBsR6Z2vfE9aq3bh3dSDqFGedA.woff2"
              className="text-black dark:text-white"
              span_class="dark:text-gray-400"
            />
          </div>
          <div className="flex items-center justify-center h-full/2 w-full my-auto">
            <TextPressure
              text="@"
              flex={false}
              weight={true}
              width={true}
              italic={true}
              minFontSize="40vw"
              fontFamily="Fira Code"
              fontUrl="https://fonts.gstatic.com/s/firacode/v26/uU9NCBsR6Z2vfE9aq3bh3dSDqFGedA.woff2"
              className="text-black dark:text-gray-200"
              span_class="text-gray-400 dark:text-white -mt-4"
            />
          </div>
        </motion.div>
      }
      back_class="flex items-center justify-center h-full w-[80vw] md:w-[90vw] mx-auto"
    >
      <motion.div className="flex flex-col items-center " variants={container}>
        <motion.h2
          className="h-[15vh] text-4xl md:text-6xl dark:text-white text-center flex flex-wrap justify-center items-center"
          variants={item}
          style={{ fontFamily: "Space Grotesk", fontWeight: "900" }}
        >
          {" "}
          <img
            src="memoji/memoji.PNG"
            alt=""
            className="w-[60px] md:w-[100px]"
          />
          Nihesh ‎ <span className="hidden md:block">Rachakonda</span>
        </motion.h2>

        <motion.div
          variants={item}
          className="w-[80vw] h-[75vh] border-1 border-r-6 border-b-6 border-black dark:border-white rounded-3xl flex"
        >
          {/* <div
            className=" my-auto mx-auto border-2 border-black rounded-2xl w-[200px] h-[200px] text-center"
            style={{ backdropFilter: "blur(5px)" }}
          >
            <a
              href="mailto:niheshr03+portfolio@gmail.com"
              className="rounded-3xl p-1 mt-1 block border-1 border-black dark:border-white dark:text-white"
            >
              {" "}
              Say Hi ! <img src="social/send.svg" alt="" className="w-[16px] inline-block bg-blue-300 rounded " />{" "}
            </a>
          </div> */}
        </motion.div>
      </motion.div>
    </Section>
  );
}

export default ConnectSection;
