import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar.tsx";
import { Footer } from "./Footer.tsx";
import { CustomCursor } from "./CustomCursor.tsx";
import { CRTOverlay } from "./CRTOverlay.tsx";
import { TopographicBackground } from "./TopographicBackground.tsx";
import { JoinModal } from "./JoinModal.tsx";
import { RootAccessModal } from "./RootAccessModal.tsx";

export const PublicLayout: React.FC = () => {
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isRootAccessOpen, setIsRootAccessOpen] = useState(false);

  return (
    <div className="public-site-cursor min-h-screen bg-[#030804] text-white selection:bg-[#00ff66] selection:text-black relative">
      {/* Custom Terminal Cursor */}
      <CustomCursor />

      {/* CRT Scanline & Vignette Effect */}
      <CRTOverlay />

      {/* Dynamic Topographic Wave Canvas */}
      <TopographicBackground />

      {/* Floating Cyber Navbar */}
      <Navbar />

      {/* Main Page Content */}
      <div className="relative z-10 pt-24 min-h-[calc(100vh-200px)]">
        <Outlet context={{ onOpenJoinModal: () => setIsJoinModalOpen(true) }} />
      </div>

      {/* Global Footer */}
      <Footer
        onOpenRootAccess={() => setIsRootAccessOpen(true)}
        onOpenJoinModal={() => setIsJoinModalOpen(true)}
      />

      {/* Modals */}
      <JoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
      />
      <RootAccessModal
        isOpen={isRootAccessOpen}
        onClose={() => setIsRootAccessOpen(false)}
      />
    </div>
  );
};
