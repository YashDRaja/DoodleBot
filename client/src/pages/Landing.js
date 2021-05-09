import React from "react";
import Hero from "../components/sections/Hero";
import LandingLayout from "../components/layouts/LandingLayout";

export default function Landing() {
  return (
    <LandingLayout>
      <Hero
        title="Landing Page Title"
        subtitle="This is the subheader section for the landing page"
        image="LandingImage.png"
        ctaText="Join now"
        ctaLink="/createAccount"
      />
    </LandingLayout>
  );
}
