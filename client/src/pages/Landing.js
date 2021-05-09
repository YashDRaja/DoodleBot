import React from "react";
import Hero from "../components/sections/Hero";
import LandingLayout from "../components/layouts/LandingLayout";

export default function Landing() {
  return (
    <LandingLayout>
      <Hero
        title="Landing Page Title"
        subtitle="A machine learning powered drawing game!"
        image="https://raw.githubusercontent.com/YashDRaja/predictive-whiteboard/main/client/src/LandingImage.png"
        ctaText="Play Against AI"
        ctaLink="/vs-ai"
      />
    </LandingLayout>
  );
}
