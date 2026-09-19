import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons.tsx';
import { useScrambleText } from '../hooks/useScrambleText.ts';
import { Leader, LeaderModal } from './LeaderModal.tsx';

const DEFAULT_LEADERS: Leader[] = [
  {
    id: 'nazmin',
    name: 'Nazmin Ziya',
    role: 'TREASURER',
    image: '/assets/leaders/nazmin.jpg',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'jeslin',
    name: 'Jeslin Ninora',
    role: 'JOINT TREASURER',
    image: '/assets/leaders/jeslin.jpg',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'elston',
    name: 'Elston Herold Pereira',
    role: 'PRESIDENT',
    image: '/assets/leaders/elston.jpg',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'raynell',
    name: 'Raynell Lewis',
    role: 'VICE PRESIDENT',
    image: '/assets/leaders/raynell.jpg',
    modalImage: '/assets/leaders/raynell_modal.jpg',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'chaitra',
    name: 'Chaitra R M',
    role: 'SECRETARY',
    image: '/assets/leaders/chaitra.jpg',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  }
];

export const Leadership: React.FC = () => {
  const { displayText, ref } = useScrambleText("Leadership Structure");
  const [leaders, setLeaders] = useState<Leader[]>(DEFAULT_LEADERS);
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const res = await fetch('/api/public/members');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            const mapped: Leader[] = json.data.map((m: any) => ({
              id: m.id,
              name: m.name,
              role: m.role,
              image: m.photoUrl,
              modalImage: m.modalPhotoUrl || m.photoUrl,
              github: m.github || 'https://github.com',
              linkedin: m.linkedin || 'https://linkedin.com',
            }));
            setLeaders(mapped);
          }
        }
      } catch {
        // Fall back to DEFAULT_LEADERS
      }
    }
    fetchLeaders();
  }, []);

  // Duplicating leaders array for an infinite-like scroll feel
  const displayLeaders = [...leaders, ...leaders];

  return (
    <section id="leadership" className="relative py-28 md:py-36 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="mb-14">
          <div className="font-mono text-sm tracking-widest text-[#00ff66] mb-3">
            // GOVERNANCE
          </div>
          <h2
            ref={ref}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white text-glow"
          >
            {displayText}
          </h2>
        </div>

        {/* Horizontal Carousel Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 scrollbar-none snap-x cursor-grab active:cursor-grabbing select-none"
        >
          {displayLeaders.map((leader, idx) => (
            <div
              key={`${leader.id}-${idx}`}
              onClick={() => setSelectedLeader(leader)}
              data-cursor="search"
              className="clickable-card flex-shrink-0 w-72 sm:w-80 rounded-xl overflow-hidden bg-[#061209]/80 backdrop-blur-md border border-[#00ff66]/20 hover:border-[#00ff66] transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,255,102,0.25)] hover:-translate-y-2 group snap-start"
            >
              {/* Photo Area with Digital Rain Background */}
              <div className="relative h-96 w-full overflow-hidden bg-black/90 flex items-end justify-center">
                {/* Simulated Matrix Rain in card */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,102,0.05)_1px,transparent_1px)] bg-[size:14px_14px] opacity-40 group-hover:opacity-70 transition-opacity" />
                
                {/* Grayscale Cutout Image */}
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="relative z-10 w-full h-full object-cover object-top filter grayscale contrast-125 group-hover:filter-none group-hover:contrast-100 transition-all duration-500"
                />

                {/* Hover Lens Indicator */}
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="w-12 h-12 rounded-full border border-[#00ff66] bg-[#00ff66]/20 backdrop-blur-sm flex items-center justify-center shadow-[0_0_15px_#00ff66]">
                    <Search className="w-5 h-5 text-[#00ff66]" />
                  </div>
                </div>

                {/* Bottom Fade Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#061209] to-transparent z-15" />
              </div>

              {/* Card Meta Content */}
              <div className="p-6 text-center border-t border-[#00ff66]/15">
                <div className="font-mono text-xs tracking-widest text-[#00ff66] font-semibold mb-1">
                  {leader.role}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#00ff66] transition-colors">
                  {leader.name}
                </h3>

                {/* Socials */}
                <div className="flex items-center justify-center gap-3 text-[#88aa90]" onClick={e => e.stopPropagation()}>
                  <a
                    href={leader.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded border border-[#00ff66]/20 hover:border-[#00ff66] hover:text-[#00ff66] transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={leader.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded border border-[#00ff66]/20 hover:border-[#00ff66] hover:text-[#00ff66] transition-colors"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Spotlight Modal */}
      <LeaderModal
        leader={selectedLeader}
        onClose={() => setSelectedLeader(null)}
      />
    </section>
  );
};