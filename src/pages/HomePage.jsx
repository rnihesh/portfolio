import React from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import LandingChoiceSection from "../components/sections/LandingChoiceSection";

function HomePage() {
  const navigate = useNavigate();
  usePageTitle("Nihesh Rachakonda - Portfolio");

  const handleChoice = (choice) => {
    if (choice === "minimal") {
      navigate("/minimal");
    } else if (choice === "gooey") {
      navigate("/gooey");
    }
  };

  return <LandingChoiceSection onChoice={handleChoice} />;
}

export default HomePage;
