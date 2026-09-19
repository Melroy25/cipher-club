import React from 'react';
import { useScrambleText } from '../hooks/useScrambleText.ts';

interface JoinSectionProps {
  onOpenJoinModal: () => void;
}

export const JoinSection: React.FC<JoinSectionProps> = ({ onOpenJoinModal }) => {
  const { displayText, ref } = useScrambleText("Join the Team");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="join" className="relative py-28 md:py-36 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
        
        <div className="font-mono text-sm tracking-widest text-[#00ff66] mb-3">
          // ACCESS CLUB
        </div>

        <h2
          ref={ref}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 text-glow"
        >
          {displayText}
        </h2>

        <p className="font-mono text-base sm:text-lg text-[#a0c0a8] leading-relaxed max-w-2xl mx-auto mb-10">
          Whether you want to build, lead, or simply learn — CIPHER is where CSE students turn curiosity into capability. Join the community and help shape what comes next.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-5">
          <button
            onClick={onOpenJoinModal}
            className="bg-[#00ff66] hover:bg-[#00e65b] text-[#030804] font-mono font-bold text-sm tracking-widest px-8 py-3.5 rounded-lg shadow-[0_0_20px_rgba(0,255,102,0.4)] hover:shadow-[0_0_30px_rgba(0,255,102,0.7)] transition-all hover:scale-105"
          >
            JOIN &rarr;
          </button>

          <button
            onClick={scrollToTop}
            className="border border-[#00ff66]/60 text-[#00ff66] hover:bg-[#00ff66]/10 font-mono text-sm tracking-widest px-8 py-3.5 rounded-lg transition-all hover:shadow-[0_0_15px_rgba(0,255,102,0.3)] hover:scale-105"
          >
            BACK TO TOP
          </button>
        </div>

      </div>
    </section>
  );
};
