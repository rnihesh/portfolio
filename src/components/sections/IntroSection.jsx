import React from "react";
import Section from "../layout/Section";
import BlurText from "../../TextAnimations/BlurText/BlurText";

function IntroSection({id, isVisible, animationProps }) {

  return (
    <Section
      // ref={firstScreenRef}
      id={id}
      isVisible={isVisible}
      animationProps={animationProps}
    >
      <div className="flex gap-4 items-center flex-wrap">
        <BlurText
          text="Hi,"
          className="text-9xl font-bold text-black dark:text-white"
          direction="top"
          animateBy="words"
          stepDuration={0.5}
        />
        <BlurText
          text="Peep"
          className="text-9xl font-bold text-green-500 italic"
          direction="top"
          animateBy="words"
          stepDuration={1}
        />
      </div>
    </Section>
  );
}

export default IntroSection;
