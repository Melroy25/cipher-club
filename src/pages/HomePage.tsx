import React from "react";
import { useOutletContext } from "react-router-dom";
import { Hero } from "../components/Hero.tsx";
import { About } from "../components/About.tsx";
import { Domains } from "../components/Domains.tsx";
import { Activities } from "../components/Activities.tsx";
import { JoinSection } from "../components/JoinSection.tsx";

interface OutletContextType {
  onOpenJoinModal: () => void;
}

export const HomePage: React.FC = () => {
  const { onOpenJoinModal } = useOutletContext<OutletContextType>();

  return (
    <div>
      <Hero onOpenJoinModal={onOpenJoinModal} />
      <About />
      <Domains />
      <Activities />
      <JoinSection onOpenJoinModal={onOpenJoinModal} />
    </div>
  );
};
