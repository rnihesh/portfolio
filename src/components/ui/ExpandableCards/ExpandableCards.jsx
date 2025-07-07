import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent } from "framer-motion";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import { isResourceLoaded } from "../../../utils/resourcePreloader";
import ReactDOM from "react-dom";

const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.05 }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-white dark:text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

export default function ExpandableCard({ cards }) {
  const [active, setActive] = useState(null);
  const id = useId();
  const ref = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setActive(false);
      }
    };

    if (active) {
      document.body.style.overflow = "hidden";
      // Fix for iOS: prevent scrolling on the background content
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.body.style.overflow = "auto";
      document.documentElement.classList.remove("overflow-hidden");
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  // Create a Portal component to render outside the containing div
  const ActiveCardPortal = ({ children }) => {
    // Use portal to render at document root to avoid iOS issues
    return ReactDOM.createPortal(children, document.body);
  };

  return (
    <>
      <AnimatePresence>
        {active && (
          <ActiveCardPortal>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 dark:bg-black/30 h-full w-full z-[1000]" // Added dark mode color
              style={{
                position: "fixed",
                height: "100vh",
                width: "100vw",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: "hidden",
              }}
            />
          </ActiveCardPortal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <ActiveCardPortal>
            <div
              className="fixed inset-0 grid place-items-center z-[1999]"
              style={{
                position: "fixed",
                height: "100%",
                width: "100%",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "grid",
                placeItems: "center",
              }}
            >
              {/* Then modify the close button to only show on mobile */}
              <motion.button
                key={`button-${active.title}-${id}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                className="md:hidden flex absolute top-6 right-6 items-center justify-center
                bg-black dark:bg-white hover:bg-gray-100 transition-colors rounded-full h-8 w-8 z-[2000]"
                onClick={() => setActive(null)}
              >
                <CloseIcon />
              </motion.button>
              <motion.div
                layoutId={`card-${active.title}-${id}`}
                ref={ref}
                className="w-[95%] md:max-w-[50vw] max-h-[95vh] flex flex-col bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden backdrop-blur-sm"
                style={{
                  maxHeight: "calc(100% - 32px)",
                  margin: "16px",
                }}
              >
                <motion.div layoutId={`image-${active.title}-${id}`}>
                  <img
                    width={200}
                    height={200}
                    src={active.src}
                    alt={active.title}
                    className="w-full h-60 sm:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                  />
                </motion.div>

                <div>
                  <div className="flex justify-between items-start p-4">
                    <div>
                      <motion.h3
                        layoutId={`title-${active.title}-${id}`}
                        className="font-medium text-neutral-700 dark:text-neutral-200 
                        text-base flex flex-row mb-0.5 items-center "
                        style={{ fontFamily: "Bodoni Moda" }}
                      >
                        <img
                          src={`${active.logo}`}
                          alt=""
                          className={`w-[30px] pr-2 ${active.logoClassName}`}
                        />
                        {active.title}
                      </motion.h3>
                      <motion.p
                        layoutId={`description-${active.description}-${id}`}
                        className="text-neutral-600 dark:text-neutral-400 text-base"
                        style={{ fontFamily: "Funnel Display" }}
                      >
                        {active.description}
                      </motion.p>
                    </div>
                    <div className="flex flex-row items-center">
                      <motion.a
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        href={active.github}
                        target="_blank"
                        className="mx-2"
                      >
                        <img
                          src="/github/github-mark.svg"
                          alt="GitHub"
                          className={`w-[30px] dark:invert ${
                            !isResourceLoaded("/github/github-mark.svg")
                              ? "opacity-0"
                              : "opacity-100"
                          }`}
                        />
                      </motion.a>
                      <motion.a
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        href={active.ctaLink}
                        target="_blank"
                        className="px-3 py-2 text-sm rounded-full font-bold bg-green-500 text-white"
                      >
                        {active.ctaText}
                      </motion.a>
                    </div>
                  </div>
                  <div className="pt-4 relative px-4">
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-neutral-600 text-xs md:text-sm lg:text-base max-h-[40vh] overflow-auto pb-10 flex flex-col items-start gap-4 dark:text-neutral-400"
                      style={{
                        fontFamily: "Funnel Display",
                        WebkitOverflowScrolling: "touch",
                      }}
                    >
                      {typeof active.content === "function"
                        ? active.content()
                        : active.content}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </ActiveCardPortal>
        ) : null}
      </AnimatePresence>
      <motion.div className="">
        <ul className=" mx-auto  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {cards.map((card) => (
            <motion.div
              layoutId={`card-${card.title}-${id}`}
              key={card.title}
              onClick={() => setActive(card)}
              className="flex flex-row md:flex-col items-center gap-4 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-xl cursor-pointer border border-neutral-100 dark:border-neutral-800 "
            >
              <motion.div
                layoutId={`image-${card.title}-${id}`}
                className="flex-shrink-0 w-16 md:w-full"
              >
                <img
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-16 w-16 md:h-60 md:w-full rounded-lg object-cover object-top"
                />
              </motion.div>

              <div className="flex flex-1 md:flex-none flex-col md:text-center">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-base"
                  style={{ fontFamily: "Bodoni Moda" }}
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base"
                  style={{ fontFamily: "Funnel Display" }}
                >
                  {card.description}
                </motion.p>
              </div>

              <motion.div
                layoutId={`button-${card.title}-${id}`}
                className="flex-shrink-0 md:mt-2"
              >
                <span className="px-4 py-2 text-sm rounded-full bg-neutral-100 dark:text-white dark:bg-neutral-800 hover:bg-green-500 hover:text-white transition-colors">
                  {card.ctaText}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </ul>
      </motion.div>
    </>
  );
}
