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
          }
        }
      } catch {}
    }
    fetchContent();
  }, []);

  return (
    <section id="home" className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10">
        
        {/* Shimmering ASCII Banner */}
        <div className="w-full overflow-x-auto select-none py-4 scrollbar-none opacity-90 transition-opacity hover:opacity-100">
          <pre className="font-mono text-[9px] sm:text-[11px] md:text-[13px] lg:text-[14px] leading-[1.12] text-emerald-600 dark:text-[#00ff66] dark:text-glow font-bold tracking-tight">
            {shimmerLines.join("\n")}
          </pre>
        </div>

        {/* Hero Typography & Headings */}
        <div className="mt-8 md:mt-12 max-w-3xl">
          <h1
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight font-sans text-black dark:text-white"
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
            className="mt-6 text-base sm:text-lg md:text-xl font-sans leading-relaxed max-w-2xl text-gray-800 dark:text-[#a0c0a8]"
            style={{ color: theme === "dark" ? "#a0c0a8" : "#1f2937" }}
          >
            {subtitle}
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center gap-5">
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

      </div>
    </section>
  );
};