import React, { useState, useEffect } from 'react';
import { useScrambleText } from '../hooks/useScrambleText.ts';

export const About: React.FC = () => {
  const { displayText, ref } = useScrambleText("Who we are");
  const [aboutText, setAboutText] = useState(
    "CIPHER is the student association of the Department of Computer Science & Engineering. It serves as a platform for students to nurture their technical and interpersonal skills through innovative and collaborative activities. The association strives to bridge the gap between academic knowledge and practical application, fostering a community of aspiring professionals dedicated to excellence in computing."
  );

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch('/api/public/content');
        if (res.ok) {
          const json = await res.json();
          if (json.map?.about_text) {
            setAboutText(json.map.about_text);
          }
        }
      } catch {}
    }
    fetchContent();
  }, []);

  return (
    <section id="about" className="relative py-28 md:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Narrative Content */}
          <div className="lg:col-span-7">
            <div className="font-mono text-sm tracking-widest text-[#00ff66] mb-3">
              // ABOUT
            </div>
            
            <h2
              ref={ref}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-8 text-glow"
            >
              {displayText}
            </h2>

            <p className="font-mono text-base sm:text-lg text-[#a0c0a8] leading-relaxed max-w-xl">
              {aboutText}
            </p>
          </div>

          {/* Right Column: Giant Glowing CIPHER with Floating Photo Collage */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] sm:min-h-[440px]">
            
            {/* Giant Background Wordmark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
              <span className="text-6xl sm:text-8xl md:text-9xl font-extrabold tracking-widest text-[#00ff66] text-glow-lg opacity-90 drop-shadow-[0_0_35px_rgba(0,255,102,0.8)]">
                CIPHER
              </span>
            </div>

            {/* Floating Photo Cards Stack */}
            <div className="relative z-10 w-full max-w-md h-[340px] flex items-center justify-center">
              
              {/* Photo 1: Top Left */}
              <div className="absolute top-2 left-2 w-48 sm:w-56 rounded-lg overflow-hidden border border-[#00ff66]/30 shadow-[0_10px_25px_rgba(0,0,0,0.8)] -rotate-6 hover:rotate-0 transition-transform duration-300 hover:scale-105 hover:z-30 hover:border-[#00ff66]">
                <img
                  src="/assets/about/about_1.jpg"
                  alt="Faculty & students in computer laboratory"
                  className="w-full h-32 sm:h-36 object-cover"
                />
              </div>

              {/* Photo 2: Bottom Right Students Team */}
              <div className="absolute bottom-2 right-0 w-52 sm:w-60 rounded-lg overflow-hidden border border-[#00ff66]/40 shadow-[0_10px_30px_rgba(0,0,0,0.9)] rotate-3 hover:rotate-0 transition-transform duration-300 hover:scale-105 hover:z-30 hover:border-[#00ff66]">
                <img
                  src="/assets/about/about_2.jpg"
                  alt="Students collaborating at computer"
                  className="w-full h-36 sm:h-40 object-cover"
                />
              </div>

              {/* Photo 3: Bottom Left Stage / Gala */}
              <div className="absolute bottom-0 left-6 w-44 sm:w-52 rounded-lg overflow-hidden border border-[#00ff66]/30 shadow-[0_10px_25px_rgba(0,0,0,0.8)] -rotate-3 hover:rotate-0 transition-transform duration-300 hover:scale-105 hover:z-30 hover:border-[#00ff66]">
                <img
                  src="/assets/about/about_3.jpg"
                  alt="Cipher stage gathering"
                  className="w-full h-24 sm:h-28 object-cover"
                />
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};