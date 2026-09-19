import React, { useState, useEffect } from "react";
import { Search, Shield, Sparkles } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../components/Icons.tsx";
import { Leader, LeaderModal } from "../components/LeaderModal.tsx";

const DEFAULT_LEADERS: Leader[] = [
  {
    id: "elston",
    name: "Elston Herold Pereira",
    role: "PRESIDENT",
    image: "/assets/leaders/elston.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    bio: "Guiding the Cipher Club's strategic direction, student initiatives, and university-wide hackathons.",
  },
  {
    id: "raynell",
    name: "Raynell Lewis",
    role: "VICE PRESIDENT",
    image: "/assets/leaders/raynell.jpg",
    modalImage: "/assets/leaders/raynell_modal.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    bio: "Overseeing technical projects, workshop logistics, and collaboration with regional tech chapters.",
  },
  {
    id: "chaitra",
    name: "Chaitra R M",
    role: "SECRETARY",
    image: "/assets/leaders/chaitra.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    bio: "Managing club operations, official records, departmental communication, and event scheduling.",
  },
  {
    id: "nazmin",
    name: "Nazmin Ziya",
    role: "TREASURER",
    image: "/assets/leaders/nazmin.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    bio: "Handling financial planning, event allocations, and resource procurement for competitions.",
  },
  {
    id: "jeslin",
    name: "Jeslin Ninora",
    role: "JOINT TREASURER",
    image: "/assets/leaders/jeslin.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    bio: "Assisting financial administration, accounts reconciliation, and club funding sponsorships.",
  },
];

export const TeamPage: React.FC = () => {
  const [leaders, setLeaders] = useState<Leader[]>(DEFAULT_LEADERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const res = await fetch("/api/public/members");
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data) && json.data.length > 0) {
            setLeaders(
              json.data.map((m: any) => ({
                id: m.id,
                name: m.name,
                role: m.role,
                image: m.photoUrl || "/assets/leaders/elston.jpg",
                modalImage: m.modalPhotoUrl,
                github: m.github,
                linkedin: m.linkedin,
                bio: m.bio,
              }))
            );
          }
        }
      } catch (err) {
        console.warn("Using offline leader fallback data");
      }
    }
    fetchLeaders();
  }, []);

  const roles = ["ALL", "PRESIDENT", "VICE PRESIDENT", "SECRETARY", "TREASURER", "JOINT TREASURER"];

  const filteredLeaders = leaders.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "ALL" || l.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* Page Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] font-mono text-xs tracking-wider uppercase mb-4">
          <Shield className="w-3.5 h-3.5" />
          <span>Governance &amp; Leadership</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-mono font-bold text-white mb-4 tracking-tight">
          Cipher Club <span className="text-[#00ff66] text-glow">Team</span>
        </h1>
        <p className="font-mono text-xs md:text-sm text-[#88aa90] leading-relaxed">
          The elected office bearers and departmental coordinators driving technical excellence, hackathons, and workshops for Computer Science &amp; Engineering students.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-[#00ff66]/15">
        {/* Role Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all whitespace-nowrap ${
                selectedRole === role
                  ? "bg-[#00ff66] text-black font-bold shadow-[0_0_15px_rgba(0,255,102,0.4)]"
                  : "bg-[#041006] text-[#88aa90] hover:text-[#00ff66] border border-[#00ff66]/20"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#88aa90] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leaders..."
            className="w-full pl-9 pr-4 py-2 bg-[#041006] border border-[#00ff66]/25 rounded-xl font-mono text-xs text-white placeholder-[#88aa90]/60 focus:outline-none focus:border-[#00ff66] transition-colors"
          />
        </div>
      </div>

      {/* Leaders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredLeaders.map((leader) => (
          <div
            key={leader.id}
            onClick={() => setSelectedLeader(leader)}
            className="group relative rounded-2xl bg-[#040e06] border border-[#00ff66]/20 hover:border-[#00ff66] transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-[0_0_25px_rgba(0,255,102,0.2)] hover:-translate-y-1 flex flex-col"
          >
            {/* Image Container with Cyber Corner Reticles */}
            <div className="relative w-full h-72 overflow-hidden bg-[#020703]">
              <img
                src={leader.image}
                alt={leader.name}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/leaders/elston.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040e06] via-transparent to-transparent opacity-80" />

              {/* Hover Badge */}
              <div className="absolute top-3 right-3 px-2 py-1 rounded bg-[#030904]/80 backdrop-blur border border-[#00ff66]/40 text-[10px] font-mono text-[#00ff66] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> View Profile
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[11px] text-[#00ff66] tracking-widest uppercase font-semibold">
                  {leader.role}
                </span>
                <h3 className="font-mono text-base font-bold text-white mt-1 group-hover:text-[#00ff66] transition-colors">
                  {leader.name}
                </h3>
                {leader.bio && (
                  <p className="font-mono text-xs text-[#88aa90] mt-2 line-clamp-2">
                    {leader.bio}
                  </p>
                )}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#00ff66]/15 mt-4">
                {leader.github && (
                  <a
                    href={leader.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#88aa90] hover:text-[#00ff66] transition-colors"
                    aria-label={`${leader.name} GitHub`}
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
                {leader.linkedin && (
                  <a
                    href={leader.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#88aa90] hover:text-[#00ff66] transition-colors"
                    aria-label={`${leader.name} LinkedIn`}
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}
                <span className="ml-auto font-mono text-[10px] text-[#88aa90]/60">
                  CSE DEPT
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leader Modal Popup */}
      <LeaderModal
        leader={selectedLeader}
        onClose={() => setSelectedLeader(null)}
      />
    </div>
  );
};
