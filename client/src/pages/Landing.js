import React from "react";
import Hero from "../components/sections/Hero";
import LandingLayout from "../components/layouts/LandingLayout";

export default function Landing() {
  return (
    <LandingLayout>
      <Hero
        title="Landing Page Title"
        subtitle="This is the subheader section for the landing page"
        image="https://source.unsplash.com/collection/404339/800x600"
        ctaText="Join now"
        ctaLink="/createAccount"
      />
    </LandingLayout>
  );
}
