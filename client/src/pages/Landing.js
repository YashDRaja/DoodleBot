import React from "react";
import Hero from "../components/sections/Hero";
import LandingLayout from "../components/layouts/LandingLayout";

export default function Landing() {
  return (
    <LandingLayout>
      <Hero
        title="Welcome to DoodleBot"
        subtitle="A machine learning powered drawing game!"
        image="https://raw.githubusercontent.com/YashDRaja/DoodleBot/main/client/src/LandingImage.png"
        ctaText="Play Against AI"
        ctaLink="/vs-ai"
      />
    </LandingLayout>
  );
}
