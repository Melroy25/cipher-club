import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useScrambleText } from '../hooks/useScrambleText.ts';
import { useTheme } from '../context/ThemeContext.tsx';

interface ActivityItem {
  id: string;
  title: string;
}

const DEFAULT_ACTIVITIES_LIST: ActivityItem[] = [
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
  const { theme } = useTheme();
  const { displayText, ref } = useScrambleText("Activities");
  const [activities, setActivities] = useState<ActivityItem[]>(DEFAULT_ACTIVITIES_LIST);
  const [introDesc, setIntroDesc] = useState(
    "Hands-on workshops, industrial visits, and technical sessions run by the Cipher Association — spanning AI, blockchain, research tooling, and career prep."
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/public/activities');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const mapped: ActivityItem[] = json.data.map((a: any, idx: number) => ({
              id: a.numberId || String(idx + 1).padStart(2, '0'),
              title: a.title,
            }));
            setActivities(mapped);
          }
        }
      } catch {}

      try {
        const cRes = await fetch('/api/public/content');
        if (cRes.ok) {
          const cJson = await cRes.json();
          if (cJson.map?.activities_desc) {
            setIntroDesc(cJson.map.activities_desc);
          }
        }
      } catch {}
    }

    fetchData();
  }, []);

  return (
    <section id="archive" className="relative py-28 md:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="mb-12">
          <div className="font-mono text-sm tracking-widest text-emerald-600 dark:text-[#00ff66] mb-3 font-bold">
            // ARCHIVE
          </div>
          <h2
            ref={ref}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 font-sans dark:text-glow text-black dark:text-white"
            style={{ color: theme === "dark" ? "#ffffff" : "#000000" }}
          >
            {displayText}
          </h2>
          <p
            className="font-sans text-base leading-relaxed max-w-2xl text-gray-800 dark:text-[#c4ded0]"
            style={{ color: theme === "dark" ? "#c4ded0" : "#2d3748" }}
          >
            {introDesc}
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {activities.map((act) => (
            <div
              key={act.id}
              className="clickable-card group relative rounded-xl px-5 py-4 bg-white dark:bg-[#08170c]/70 backdrop-blur-md border border-gray-200 dark:border-[#00ff66]/15 hover:border-emerald-500 dark:hover:border-[#00ff66]/60 transition-all duration-200 shadow-sm hover:shadow-md dark:shadow-none dark:hover:shadow-[0_0_18px_rgba(0,255,102,0.18)] hover:-translate-y-0.5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5 pr-2">
                <span className="font-mono text-xs text-emerald-600 dark:text-[#00ff66] font-bold opacity-80 group-hover:opacity-100">
                  {act.id}
                </span>
                <span
                  className="font-sans text-sm sm:text-base font-semibold group-hover:text-emerald-600 dark:group-hover:text-[#00ff66] transition-colors leading-snug text-black dark:text-white/90"
                  style={{ color: theme === "dark" ? "rgba(255,255,255,0.9)" : "#000000" }}
                >
                  {act.title}
                </span>
              </div>

              <ArrowUpRight className="w-4 h-4 text-gray-400 dark:text-[#88aa90] group-hover:text-emerald-600 dark:group-hover:text-[#00ff66] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};