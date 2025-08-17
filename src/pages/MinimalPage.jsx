import React from "react";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import MinimalSection from "../components/sections/MinimalSection";

function MinimalPage() {
  const navigate = useNavigate();
  usePageTitle("", "minimal");

  const handleBackToChoice = () => {
    navigate("/");
  };

  return <MinimalSection onBackToChoice={handleBackToChoice} />;
}

export default MinimalPage;
