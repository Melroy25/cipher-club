import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useScrambleText } from '../hooks/useScrambleText.ts';

const ACTIVITIES_LIST = [
  { id: '01', title: 'Applied Machine Learning' },
  { id: '02', title: 'Industrial Visit' },
  { id: '03', title: 'LaTeX Tool' },
  { id: '04', title: 'Robotic Process Automation using UiPath' },
  { id: '05', title: 'HackTO Future 20' },
  { id: '06', title: 'How to Win at the Sport of Programming' },
  { id: '07', title: 'Introduction to Google Crowdsource' },
  { id: '08', title: 'Educational Session on GitHub' },
  { id: '09', title: 'Industrial Visit' },
  { id: '10', title: 'UDAAN Mock Interview' },
  { id: '11', title: 'Freshers Onboarding Programme' },
  { id: '12', title: 'Projects Funded by KSCST' },
  { id: '13', title: 'Generative AI Tools for Research' },
  { id: '14', title: 'Introduction to Blockchain: Solidity Workshop' },
  { id: '15', title: 'Star UML' },
  { id: '16', title: 'Generative AI: Custom Solutions using OpenAI' },
  { id: '17', title: 'React.js and Node.js Workshop' },
];

export const Activities: React.FC = () => {
  const { displayText, ref } = useScrambleText("Activities");

  return (
    <section id="archive" className="relative py-28 md:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="mb-12">
          <div className="font-mono text-sm tracking-widest text-[#00ff66] mb-3">
            // ARCHIVE
          </div>
          <h2
            ref={ref}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-4 text-glow"
          >
            {displayText}
          </h2>
          <p className="font-mono text-base text-[#a0c0a8] max-w-2xl leading-relaxed">
            Hands-on workshops, industrial visits, and technical sessions run by the Cipher Association — spanning AI, blockchain, research tooling, and career prep.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {ACTIVITIES_LIST.map((act) => (
            <div
              key={act.id}
              className="clickable-card group relative rounded-xl px-5 py-4 bg-[#08170c]/70 backdrop-blur-md border border-[#00ff66]/15 hover:border-[#00ff66]/60 transition-all duration-200 hover:shadow-[0_0_18px_rgba(0,255,102,0.18)] hover:-translate-y-0.5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5 pr-2">
                <span className="font-mono text-xs text-[#00ff66] font-semibold opacity-80 group-hover:opacity-100">
                  {act.id}
                </span>
                <span className="font-mono text-sm sm:text-base font-medium text-white/90 group-hover:text-[#00ff66] transition-colors leading-snug">
                  {act.title}
                </span>
              </div>

              <ArrowUpRight className="w-4 h-4 text-[#88aa90] group-hover:text-[#00ff66] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
