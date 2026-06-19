import { useCallback, useEffect, useState } from "react";

// Viewports of donated scroll room inserted AFTER the Skills section for its
// pinned horizontal scrub. MUST equal:
//   - PIN_VIEWPORTS in SkillsSection.jsx,
//   - the h-[600vh] spacer in GooeyPage.jsx,
//   - the +600vh added to the page container min-h (900vh -> 1500vh).
// Every section AFTER skills shifts down by this many viewports.
const SKILLS_PIN = 6;

export default function useVisibilityOnScroll() {
  const [showFirstScreen, setShowFirstScreen] = useState(true);
  const [showSecondScreen, setShowSecondScreen] = useState(false);
  const [showThirdScreen, setShowThirdScreen] = useState(false);
  const [showFourthScreen, setShowFourthScreen] = useState(false);
  const [showFifthScreen, setShowFifthScreen] = useState(false);
  const [showSixthScreen, setShowSixthScreen] = useState(false);
  const [showSeventhScreen, setShowSeventhScreen] = useState(false);
  const [showEighthScreen, setShowEighthScreen] = useState(false);
  const [showNinthScreen, setShowNinthScreen] = useState(false);
  const handleScroll = useCallback(() => {
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;

    // First screen visibility
    if (scrollPosition <= windowHeight * 0.3) {
      setShowFirstScreen(true);
    } else {
      setShowFirstScreen(false);
    }

    // Second screen visibility
    if (
      scrollPosition >= windowHeight * 0.7 &&
      scrollPosition <= windowHeight * 1.3
    ) {
      setShowSecondScreen(true);
    } else {
      setShowSecondScreen(false);
    }

    // Third screen visibility
    if (
      scrollPosition >= windowHeight * 1.7 &&
      scrollPosition <= windowHeight * 2.3
    ) {
      setShowThirdScreen(true);
    } else {
      setShowThirdScreen(false);
    }

    // Fourth screen (SKILLS) visibility — kept truthy across the ENTIRE pin
    // range [3vh..9vh] (+ margins). SkillsSection stays mounted regardless (it
    // ignores this flag for mount/unmount); this only satisfies the contract.
    if (
      scrollPosition >= windowHeight * 2.7 &&
      scrollPosition <= windowHeight * (3.3 + SKILLS_PIN)
    ) {
      setShowFourthScreen(true);
    } else {
      setShowFourthScreen(false);
    }

    // Fifth screen (model + photos) — shifted +SKILLS_PIN vh by the pin runway.
    if (
      scrollPosition >= windowHeight * (3.3 + SKILLS_PIN) &&
      scrollPosition <= windowHeight * (4.3 + SKILLS_PIN)
    ) {
      setShowFifthScreen(true);
    } else {
      setShowFifthScreen(false);
    }

    // Sixth (projects) +SKILLS_PIN
    if (
      scrollPosition >= windowHeight * (4.7 + SKILLS_PIN) &&
      scrollPosition <= windowHeight * (5.3 + SKILLS_PIN)
    ) {
      setShowSixthScreen(true);
    } else {
      setShowSixthScreen(false);
    }
    // Seventh (vibe) +SKILLS_PIN
    if (
      scrollPosition >= windowHeight * (5.7 + SKILLS_PIN) &&
      scrollPosition <= windowHeight * (6.3 + SKILLS_PIN)
    ) {
      setShowSeventhScreen(true);
    } else {
      setShowSeventhScreen(false);
    }
    // Eighth (acad-achie) +SKILLS_PIN
    if (
      scrollPosition >= windowHeight * (6.7 + SKILLS_PIN) &&
      scrollPosition <= windowHeight * (7.3 + SKILLS_PIN)
    ) {
      setShowEighthScreen(true);
    } else {
      setShowEighthScreen(false);
    }
    // Ninth (connect) +SKILLS_PIN
    if (
      scrollPosition >= windowHeight * (7.7 + SKILLS_PIN) &&
      scrollPosition <= windowHeight * (8.3 + SKILLS_PIN)
    ) {
      setShowNinthScreen(true);
    } else {
      setShowNinthScreen(false);
    }
  }, []);

  useEffect(() => {
    // throttled scroll handler for better performance
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener);
    // Run once on mount so the correct screen shows without an initial scroll.
    handleScroll();
    return () => window.removeEventListener("scroll", scrollListener);
  }, [handleScroll]);

  return {
    showFirstScreen,
    showSecondScreen,
    showThirdScreen,
    showFourthScreen,
    showFifthScreen,
    showSixthScreen,
    showSeventhScreen,
    showEighthScreen,
    showNinthScreen,
  };
}
