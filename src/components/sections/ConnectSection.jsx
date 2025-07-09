import React from 'react'
import Section from "../layout/Section"
import "./ConnectSection.css"

function ConnectSection(id, isVisible, animationProps) {
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
    className="connect-back"
    >
      
    </Section>
  )
}

export default ConnectSection