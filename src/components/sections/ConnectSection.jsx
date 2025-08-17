import React from "react";
import Section from "../layout/Section";
import "./ConnectSection.css";
import { motion } from "framer-motion";
import TextPressure from "../../TextAnimations/TextPressure/TextPressure";
import { LuLinkedin } from "react-icons/lu";
import { LuGithub } from "react-icons/lu";
import { LuMail } from "react-icons/lu";
import { LuPhone } from "react-icons/lu";
import { FaXTwitter } from "react-icons/fa6";
import { TbBrandBluesky } from "react-icons/tb";

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
            src="memoji/memoji.png"
            alt=""
            className="w-[60px] md:w-[100px]"
          />
          Nihesh ‎ <span className="hidden md:block">Rachakonda</span>
        </motion.h2>

        <motion.div
          variants={item}
          className="w-[80vw] h-[75vh] border-1 border-r-6 border-b-6 border-black dark:border-white rounded-3xl flex"
        >
          <div
            className=" my-auto mx-auto border-2 border-gray-300 rounded-2xl w-[200px] h-[200px] text-center p-5 flex flex-col"
            style={{ backdropFilter: "blur(5px)" }}
          >
            <motion.a
              href="mailto:niheshr03+portfolio@gmail.com"
              className="rounded-3xl p-1 mt-1 block border-1 border-black dark:border-white dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black flex items-center justify-center relative"
              style={{ fontFamily: "Space Grotesk" }}
              whileHover="hover"
              initial="initial"
            >
              <div className="flex items-center justify-center w-full">
                <motion.span
                  variants={{
                    initial: { x: 0, opacity: 1 },
                    hover: {
                      x: -40,
                      opacity: 0,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      },
                    },
                  }}
                  className="inline-block"
                >
                  Say ‎
                </motion.span>

                <motion.span
                  className="flex items-center justify-center"
                  variants={{
                    initial: { x: 0, fontWeight: "normal" },
                    hover: {
                      x: -12,
                      fontWeight: "bold",
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                        fontWeight: {
                          type: "spring",
                          stiffness: 500,
                          damping: 10,
                        },
                      },
                    },
                  }}
                >
                  Hi <span className="inline-block mx-[1px]"></span>!{" "}
                  <motion.img
                    src="social/send.svg"
                    alt=""
                    className="w-[16px] inline-block invert rounded  ml-1"
                    variants={{
                      initial: {},
                      hover: {},
                    }}
                  />
                </motion.span>
              </div>
            </motion.a>
            <div className="grid grid-rows-2 grid-cols-2 gap-4 mt-auto pt-4 w-full">
              {[
                // {
                //   icon: LuMail,
                //   href: "mailto:niheshr03+portfolio@gmail.com",
                //   label: "Email",
                // },
                { icon: LuPhone, href: "tel:+918328094810", label: "Call" },
                // {
                  //   icon: TbBrandBluesky,
                  //   href: "https://bsky.app/profile/nihesh.codes",
                  //   label: "Bluesky",
                  // },
                  {
                    icon: FaXTwitter,
                    href: "https://x.com/niheshr03",
                    label: "X",
                  },
                  {
                    icon: LuGithub,
                    href: "https://github.com/rnihesh",
                    label: "Github",
                  },
                  
                  {
                    icon: LuLinkedin,
                    href: "https://www.linkedin.com/in/rachakonda-nihesh/",
                    label: "LinkedIn",
                  },
                ].map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-1 rounded-lg transition-all hover:bg-black/5 dark:hover:bg-white/10"
                  whileHover={{ scale: 1.05, fontWeight: "Bolder" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="text-xl md:text-xl text-black dark:text-gray-400"
                    whileHover={{
                      // color: ["#000000", "#10b981"],
                      transition: { duration: 0 },
                    }}
                  >
                    <item.icon />
                  </motion.div>
                  <span className="text-xs mt-1 opacity-70 dark:text-white" style={{fontFamily: "JetBrains Mono"}}>{item.label}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Section>
  );
}

export default ConnectSection;
