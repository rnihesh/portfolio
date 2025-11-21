import React from "react";
import Section from "../layout/Section";
import TextPressure from "../../TextAnimations/TextPressure/TextPressure";

function NameSection({ id, isVisible, animationProps }) {
  return (
    <Section id={id} isVisible={isVisible} animationProps={animationProps}>
      <TextPressure
        text="I'm ‎  Nihesh"
        fontFamily="Figtree"
        flex={true}
        weight={true}
        width={true}
        italic={true}
        className="text-black dark:text-white"
        span_class="dark:text-white"
      />
    </Section>
  );
}

export default NameSection;
