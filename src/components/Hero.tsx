import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.tsx';

interface HeroProps {
  onOpenJoinModal: () => void;
  onOpenRootAccess: () => void;
}

// ASCII Art Template for "CIPHER"
const ASCII_CIPHER_TEMPLATE = [
  "   . - % # + : % I = -   C           C R       . =                H    I @    C    R           @ I % R % P P % - : + - P =       % * @ * C E @ C . + . - %           ",
  "   C C - - - = % # R E @         % E H  #    #   %              + R % . - %     %             C . # P P * H - I @ I @ * .       P . - H H - H R - # C @ * H         ",
  " # E : P H + * * C *           * = + @ %  E +     I % % R I   @ @ + @ @ . #       C E % # +   I % P @ % : @ # = = C . R I     % E I . : @ H % H . E : @ @ E P       ",
  " % + E % . : :                 P :        *     R           #   H *   C @ C @ E I @ - * K . *   C : % I R = P C E - C + I %     + : I H + .         R C % C + R #     ",
  " - P ; # : =                                              - E   I   H   R       @ @ @ @ % A E * @ C - . I :     C I             + P % # = @         + + R % + R       ",
  " H . I E =                     %                                                C     + % % %     # P @ R @ E I :   E               . + + : : C         P % % * * #       ",
  " + . # E -               @ C R             @                                    :     *   R   R   @ @ % R % Q = @ R P E E           + # % H @           P * H . : :       ",
  " : = * H @           % E                                                                          # R   @ @ % # @ * P % E @ .       @ + @ C + - @ + C * # P % : * +       ",
  " * + E @             P                                                                            : R         = * R % @ * R         @ @ @ E : - E I P @ @             ",
  " C : = %             * %                                                                                                  * +       :           I @ + H = * R         ",
  " E I E C %           C   C                                                                                                          @ - :       % @ R + @             ",
  " E E C I             % +                                                                                                            : - I       I @ @ C - % :         ",
  " = E @ P P           I #                   C                     I : %                                                              H   E       : # @ P * C H         ",
  " * @ @ # . %         % R               H P E % % + .   * C       C   I   C P                                                        : %         @ % P # - . P         ",
  " + @ # P = C # P     %                 C @ C * % % % @ P % . % - I                                                                  : E         % @ % E R @           ",
  " + * : % @ *         :                 @ @   @ P           % - I   H   H       I   = E - I   :               R   P E   +            P E         * % : R * H %         ",
  " R R + C #                             +                   @ @ @               -   R % R     :             *     : @ . -                H : R       @ R + + = +           ",
  " E @ - I                                                                       *   P :   I @ % @           *     = @ :                  :           %                     ",
  "                                                                                   : @ :     : @   E - H         : P   :                                                  ",
  "                                                                                   I         :     P             R R                                                      ",
  "                                                                                   +               %             %   @                                                    ",
  "                                                                                                   %             : I +                                                    ",
  "                                                                                                   +             I   P                                                    "
];

const RANDOM_CHARS = "@#%*+=:;.-+CRIPHE10_";

export const Hero: React.FC<HeroProps> = ({ onOpenJoinModal, onOpenRootAccess }) => {
  const { theme } = useTheme();
  const [shimmerLines, setShimmerLines] = useState<string[]>(ASCII_CIPHER_TEMPLATE);
  const [subtitle, setSubtitle] = useState(
    "Bridging academic knowledge and practical application – a community of aspiring professionals in computing."
  );
  const [joinBtnText, setJoinBtnText] = useState("JOIN CIPHER");
  const [eventsBtnText, setEventsBtnText] = useState("EXPLORE EVENTS");

  // Dynamic Metrics state
  const [metrics, setMetrics] = useState({
    stat1Num: "500+",
    stat1Lbl: "Active Members",
    stat1Sub: "Dept. Community",
    stat2Num: "25+",
    stat2Lbl: "Sessions & Events",
    stat2Sub: "Hands-on Workshops",
    stat3Num: "04",
    stat3Lbl: "Core Domains",
    stat3Sub: "Tech & Leadership",
    stat4Num: "100%",
    stat4Lbl: "Student Driven",
    stat4Sub: "Innovation & Growth",
  });

  // Periodic ASCII matrix shimmer
  useEffect(() => {
    const interval = setInterval(() => {
      setShimmerLines(() =>
        ASCII_CIPHER_TEMPLATE.map(line =>
          line
            .split("")
            .map(char => {
              if (char === " ") return " ";
              if (Math.random() > 0.94) {
                return RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
              }
              return char;
            })
            .join("")
        )
      );
    }, 120);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch('/api/public/content');
        if (res.ok) {
          const json = await res.json();
          if (json.map) {
            if (json.map.hero_subtitle) setSubtitle(json.map.hero_subtitle);
            if (json.map.hero_join_btn) setJoinBtnText(json.map.hero_join_btn);
            if (json.map.hero_events_btn) setEventsBtnText(json.map.hero_events_btn);

            setMetrics(prev => ({
              stat1Num: json.map.hero_stat_1_num || prev.stat1Num,
              stat1Lbl: json.map.hero_stat_1_lbl || prev.stat1Lbl,
              stat1Sub: json.map.hero_stat_1_sub || prev.stat1Sub,
              stat2Num: json.map.hero_stat_2_num || prev.stat2Num,
              stat2Lbl: json.map.hero_stat_2_lbl || prev.stat2Lbl,
              stat2Sub: json.map.hero_stat_2_sub || prev.stat2Sub,
              stat3Num: json.map.hero_stat_3_num || prev.stat3Num,
              stat3Lbl: json.map.hero_stat_3_lbl || prev.stat3Lbl,
              stat3Sub: json.map.hero_stat_3_sub || prev.stat3Sub,
              stat4Num: json.map.hero_stat_4_num || prev.stat4Num,
              stat4Lbl: json.map.hero_stat_4_lbl || prev.stat4Lbl,
              stat4Sub: json.map.hero_stat_4_sub || prev.stat4Sub,
            }));
          }
        }
      } catch {}
    }
    fetchContent();
  }, []);

  return (
    <section id="home" className="relative pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 flex flex-col justify-center overflow-hidden">
      {/* Side margin sci-fi edge coordinates to frame empty space neatly */}
      <div className="hidden xl:flex flex-col items-center gap-3 absolute left-4 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-30">
        <div className="w-[1px] h-14 bg-gradient-to-b from-transparent via-emerald-500 dark:via-[#00ff66] to-transparent" />
        <span className="font-mono text-[8px] tracking-[0.25em] text-emerald-600 dark:text-[#00ff66] [writing-mode:vertical-rl] rotate-180 uppercase font-bold">
          CIPHER // NODE.01 · SJEC CSE
        </span>
        <div className="w-[1px] h-14 bg-gradient-to-b from-transparent via-emerald-500 dark:via-[#00ff66] to-transparent" />
      </div>

      <div className="hidden xl:flex flex-col items-center gap-3 absolute right-4 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-30">
        <div className="w-[1px] h-14 bg-gradient-to-b from-transparent via-emerald-500 dark:via-[#00ff66] to-transparent" />
        <span className="font-mono text-[8px] tracking-[0.25em] text-emerald-600 dark:text-[#00ff66] [writing-mode:vertical-rl] uppercase font-bold">
          TELEMETRY // VER 2025.26
        </span>
        <div className="w-[1px] h-14 bg-gradient-to-b from-transparent via-emerald-500 dark:via-[#00ff66] to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10">
        
        {/* Shimmering ASCII Banner */}
        <div className="w-full overflow-x-auto select-none py-3 scrollbar-none opacity-90 transition-opacity hover:opacity-100">
          <pre className="font-mono text-[9px] sm:text-[11px] md:text-[13px] lg:text-[14px] leading-[1.12] text-emerald-600 dark:text-[#00ff66] dark:text-glow font-bold tracking-tight">
            {shimmerLines.join("\n")}
          </pre>
        </div>

        {/* Hero Grid: Typography on Left & Metrics HUD on Right */}
        <div className="mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Subtitle & Action Buttons */}
          <div className="lg:col-span-7">
            <h1
              className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight font-sans text-black dark:text-white"
              style={{ color: theme === "dark" ? "#ffffff" : "#000000" }}
            >
              Student Association of Computer Science{' '}
              <span
                onClick={onOpenRootAccess}
                data-cursor="search"
                className="inline-block transition-all duration-300 relative group select-none cursor-pointer"
                style={{ color: "inherit" }}
                title="Click for backdoor access"
              >
                &amp;
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-600/0 dark:bg-[#00ff66]/0 group-hover:bg-emerald-600 dark:group-hover:bg-[#00ff66] transition-colors" />
              </span>{' '}
              Engineering
            </h1>

            <p
              className="mt-5 text-base sm:text-lg md:text-xl font-sans leading-relaxed max-w-2xl text-gray-800 dark:text-[#a0c0a8]"
              style={{ color: theme === "dark" ? "#a0c0a8" : "#1f2937" }}
            >
              {subtitle}
            </p>

            {/* Action Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
              <Link
                to="/contact"
                className="bg-emerald-600 hover:bg-emerald-500 dark:bg-[#00ff66] dark:hover:bg-[#00e65b] text-white dark:text-[#030804] font-sans font-bold text-sm tracking-wider px-7 py-3.5 rounded-lg transition-all duration-300 shadow-md dark:shadow-[0_0_20px_rgba(0,255,102,0.5)] hover:scale-[1.02] flex items-center gap-2"
              >
                {joinBtnText} <span className="text-base font-sans">&rarr;</span>
              </Link>

              <Link
                to="/events"
                className="border border-gray-300 dark:border-[#00ff66] text-gray-700 dark:text-[#00ff66] hover:bg-gray-100 dark:hover:bg-[#00ff66]/10 font-sans font-semibold text-sm tracking-wider px-7 py-3.5 rounded-lg transition-all duration-300 hover:scale-[1.02]"
              >
                {eventsBtnText}
              </Link>
            </div>
          </div>

          {/* Right Column: High-Tech Cyber Metrics HUD */}
          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-2xl border border-gray-200 dark:border-[#00ff66]/20 bg-white/80 dark:bg-[#07130a]/80 backdrop-blur-md p-5 sm:p-6 shadow-xl dark:shadow-[0_0_35px_rgba(0,255,102,0.07)] transition-all duration-300 hover:border-emerald-500/40 dark:hover:border-[#00ff66]/40">
              
              {/* Corner Reticles */}
              <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-500 dark:border-[#00ff66]/70 pointer-events-none" />
              <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-500 dark:border-[#00ff66]/70 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-500 dark:border-[#00ff66]/70 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-500 dark:border-[#00ff66]/70 pointer-events-none" />

              {/* HUD Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-[#00ff66]/10">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 dark:bg-[#00ff66] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-[#00ff66]" />
                  </span>
                  <span className="font-mono text-xs font-bold tracking-widest text-emerald-600 dark:text-[#00ff66] uppercase">
                    // KEY METRICS
                  </span>
                </div>
                <span className="font-mono text-[10px] tracking-wider font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-[#00ff66]/10 text-emerald-700 dark:text-[#00ff66] border border-emerald-200 dark:border-[#00ff66]/30 uppercase">
                  STATUS: LIVE
                </span>
              </div>

              {/* 2x2 Metric Cards Grid */}
              <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                {/* Metric 1 */}
                <div className="group rounded-xl p-3.5 sm:p-4 bg-gray-50/90 dark:bg-[#0c1e11]/70 border border-gray-200/60 dark:border-[#00ff66]/15 hover:border-emerald-500/40 dark:hover:border-[#00ff66]/50 transition-all duration-300">
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-emerald-600 dark:text-[#00ff66] dark:text-glow">
                      {metrics.stat1Num}
                    </div>
                    <span className="font-mono text-[9px] text-gray-400 dark:text-[#00ff66]/40">01</span>
                  </div>
                  <div className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white mt-1">
                    {metrics.stat1Lbl}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-[#7ba98c] mt-0.5 leading-snug truncate">
                    {metrics.stat1Sub}
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="group rounded-xl p-3.5 sm:p-4 bg-gray-50/90 dark:bg-[#0c1e11]/70 border border-gray-200/60 dark:border-[#00ff66]/15 hover:border-emerald-500/40 dark:hover:border-[#00ff66]/50 transition-all duration-300">
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-emerald-600 dark:text-[#00ff66] dark:text-glow">
                      {metrics.stat2Num}
                    </div>
                    <span className="font-mono text-[9px] text-gray-400 dark:text-[#00ff66]/40">02</span>
                  </div>
                  <div className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white mt-1">
                    {metrics.stat2Lbl}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-[#7ba98c] mt-0.5 leading-snug truncate">
                    {metrics.stat2Sub}
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="group rounded-xl p-3.5 sm:p-4 bg-gray-50/90 dark:bg-[#0c1e11]/70 border border-gray-200/60 dark:border-[#00ff66]/15 hover:border-emerald-500/40 dark:hover:border-[#00ff66]/50 transition-all duration-300">
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-emerald-600 dark:text-[#00ff66] dark:text-glow">
                      {metrics.stat3Num}
                    </div>
                    <span className="font-mono text-[9px] text-gray-400 dark:text-[#00ff66]/40">03</span>
                  </div>
                  <div className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white mt-1">
                    {metrics.stat3Lbl}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-[#7ba98c] mt-0.5 leading-snug truncate">
                    {metrics.stat3Sub}
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="group rounded-xl p-3.5 sm:p-4 bg-gray-50/90 dark:bg-[#0c1e11]/70 border border-gray-200/60 dark:border-[#00ff66]/15 hover:border-emerald-500/40 dark:hover:border-[#00ff66]/50 transition-all duration-300">
                  <div className="flex items-baseline justify-between">
                    <div className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-emerald-600 dark:text-[#00ff66] dark:text-glow">
                      {metrics.stat4Num}
                    </div>
                    <span className="font-mono text-[9px] text-gray-400 dark:text-[#00ff66]/40">04</span>
                  </div>
                  <div className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white mt-1">
                    {metrics.stat4Lbl}
                  </div>
                  <div className="text-[10px] text-gray-500 dark:text-[#7ba98c] mt-0.5 leading-snug truncate">
                    {metrics.stat4Sub}
                  </div>
                </div>
              </div>

              {/* HUD Footer Telemetry */}
              <div className="pt-3.5 mt-3.5 border-t border-gray-100 dark:border-[#00ff66]/10 flex items-center justify-between font-mono text-[10px] text-gray-500 dark:text-[#7ba98c]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-sm bg-emerald-500/60 dark:bg-[#00ff66]/60 inline-block" />
                  <span>DEPT. OF CSE // SJEC</span>
                </div>
                <span>NODE: CIPHER-SJEC</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};