import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Hero } from "../components/Hero.tsx";
import { About } from "../components/About.tsx";
import { Domains } from "../components/Domains.tsx";
import { Activities } from "../components/Activities.tsx";
import { JoinSection } from "../components/JoinSection.tsx";
import { IntroBoot } from "../components/IntroBoot.tsx";

interface OutletContextType {
  onOpenJoinModal: () => void;
}

export const HomePage: React.FC = () => {
  const [isBooting, setIsBooting] = useState(() => {
    // Only boot intro once per session
    return !sessionStorage.getItem("cipher_booted");
  });

  const { onOpenJoinModal } = useOutletContext<OutletContextType>();

  const handleBootComplete = () => {
    setIsBooting(false);
    sessionStorage.setItem("cipher_booted", "true");
  };

  return (
    <>
      {isBooting && <IntroBoot onComplete={handleBootComplete} />}

      <div
        className={`transition-opacity duration-700 ${
          isBooting ? "opacity-0" : "opacity-100"
        }`}
      >
        <Hero onOpenJoinModal={onOpenJoinModal} />
        <About />
        <Domains />
        <Activities />
        <JoinSection onOpenJoinModal={onOpenJoinModal} />
      </div>
    </>
  );
};
