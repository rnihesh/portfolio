import React, { memo } from "react";
import HalfHeightSection from "../layout/HalfHeightSection";
import Masonry from "../ui/Masonry/Masonry";
import { photoItems } from "../../data/photos";

function PhotoSection({ isVisible, animationProps }) {
  return (
    <HalfHeightSection
      isVisible={isVisible}
      animationProps={animationProps}
      className=""
    >
      <Masonry
        items={photoItems}
        ease="power3.out"
        duration={0.6}
        stagger={0.05}
        animateFrom="bottom"
        scaleOnHover={true}
        hoverScale={0.95}
        blurToFocus={true}
        colorShiftOnHover={false}
      />
    </HalfHeightSection>
  );
}

export default memo(PhotoSection);
