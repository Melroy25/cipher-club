import React, { useState, useEffect } from "react";
import { Users, Sparkles, Search, Filter, Award, Calendar, Heart, ArrowRight } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "../components/Icons.tsx";

export interface Contributor {
  id: string;
  name: string;
  role: string;
  eventName: string;
  department: string;
  batch?: string | null;
  photoUrl?: string | null;
  bio?: string | null;
  github?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  displayOrder: number;
}

const DEFAULT_CONTRIBUTORS: Contributor[] = [
  {
    id: "chinmayee",
    name: "Chinmayee",
    role: "Event Co-Lead & Track Winner",
    eventName: "Prompt Ops-2K26",
    department: "Computer Science & Engineering",
    batch: "1st Year CSE",
    photoUrl: "/assets/leaders/chaitra.jpg",
    bio: "Top honors in Track 1 of Prompt Ops-2K26; assisted in prompt engineering testbed documentation and peer mentoring.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    displayOrder: 1,
  },
  {
    id: "chris",
    name: "Chris Royston Monteiro",
    role: "Technical Evaluator",
    eventName: "Prompt Ops-2K26",
    department: "Computer Science & Engineering",
    batch: "2nd Year CSE",
    photoUrl: "/assets/leaders/elston.jpg",
    bio: "Designed evaluation criteria for image generation prompts and assisted in participant scoring automation.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    displayOrder: 2,
  },
  {
    id: "harimurali",
    name: "Harimurali K S",
    role: "API Security Challenge Lead",
    eventName: "Prompt Ops-2K26",
    department: "Computer Science & Engineering",
    batch: "3rd Year CSE",
    photoUrl: "/assets/leaders/raynell.jpg",
    bio: "Built the adversarial Gemini prompt extraction challenges for Track 2 and configured live rate limiting.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    displayOrder: 3,
  },
  {
    id: "venus",
    name: "Venus Suhani D’Lima",
    role: "Stage & Logistics Coordinator",
    eventName: "Lumière — The Gala",
    department: "Computer Science & Engineering",
    batch: "2nd Year CSE",
    photoUrl: "/assets/leaders/nazmin.jpg",
    bio: "Coordinated stage arrangements, entry pass management, and hospitality for faculty guests during the branch entry gala.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    displayOrder: 4,
  },
  {
    id: "deeksha",
    name: "Deeksha Ravi Moger",
    role: "Creative Media & Banner Lead",
    eventName: "Lumière — The Gala",
    department: "Computer Science & Engineering",
    batch: "2nd Year CSE",
    photoUrl: "/assets/leaders/jeslin.jpg",
    bio: "Designed main stage backdrop visual assets, social media flyers, and coordinated lighting aesthetics.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    displayOrder: 5,
  },
  {
    id: "venisha",
    name: "Venisha Snehal D’Souza",
    role: "Workshop Mentor",
    eventName: "Smart Contract Bootcamp",
    department: "Computer Science & Engineering",
    batch: "4th Year CSE",
    photoUrl: "/assets/leaders/chaitra.jpg",
    bio: "Helped 60+ junior students debug Hardhat smart contract deployments and Sepolia faucet transactions.",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    displayOrder: 6,
  },
];

export const ContributorsPage: React.FC = () => {
  const [contributors, setContributors] = useState<Contributor[]>(DEFAULT_CONTRIBUTORS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContributors() {
      try {
        const res = await fetch("/api/public/contributors");
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data) && json.data.length > 0) {
            setContributors(json.data);
          }
        }
      } catch {
        // use fallback
      } finally {
        setLoading(false);
      }
    }
    fetchContributors();
  }, []);

  const eventList = ["ALL", ...Array.from(new Set(contributors.map((c) => c.eventName)))];

  const filtered = contributors.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.bio || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEvent = selectedEvent === "ALL" || c.eventName === selectedEvent;
    return matchesSearch && matchesEvent;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="mb-14 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] font-mono text-xs tracking-wider uppercase mb-5">
          <Heart className="w-3.5 h-3.5 text-[#00ff66]" />
          <span>Hall of Recognition</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-mono font-bold text-white mb-4 tracking-tight">
          Event <span className="text-[#00ff66] text-glow">Contributors</span>
        </h1>
        <p className="font-mono text-sm text-[#88aa90] leading-relaxed">
          The talented students, volunteer leads, technical coordinators, and creative minds whose relentless dedication turns Cipher initiatives into unforgettable experiences.
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-8">
          {[
            { label: "Contributors", value: contributors.length },
            { label: "Events Supported", value: eventList.length - 1 },
            { label: "Departments", value: "CSE" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-mono text-2xl font-bold text-[#00ff66]">{s.value}</p>
              <p className="font-mono text-xs text-[#88aa90] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filters & Search ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 pb-6 border-b border-[#00ff66]/15">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none flex-wrap">
          <span className="font-mono text-xs text-[#88aa90] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#00ff66]" /> Event:
          </span>
          {eventList.map((evt) => (
            <button
              key={evt}
              onClick={() => setSelectedEvent(evt)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all whitespace-nowrap ${
                selectedEvent === evt
                  ? "bg-[#00ff66] text-black font-bold shadow-[0_0_15px_rgba(0,255,102,0.4)]"
                  : "bg-[#041006] text-[#88aa90] hover:text-[#00ff66] border border-[#00ff66]/20"
              }`}
            >
              {evt}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#88aa90] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contributor or role..."
            className="w-full pl-9 pr-4 py-2 bg-[#041006] border border-[#00ff66]/25 rounded-xl font-mono text-xs text-white placeholder-[#88aa90]/60 focus:outline-none focus:border-[#00ff66] transition-colors"
          />
        </div>
      </div>

      {/* ── Contributors Grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl bg-[#040e06] border border-[#00ff66]/20 hover:border-[#00ff66] transition-all duration-300 p-6 flex flex-col justify-between hover:shadow-[0_0_30px_rgba(0,255,102,0.2)] hover:-translate-y-1"
          >
            <div>
              {/* Event Badge & Batch */}
              <div className="flex items-center justify-between gap-2 text-xs font-mono mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 font-semibold tracking-wider text-[11px] truncate">
                  <Calendar className="w-3 h-3 flex-shrink-0" /> {item.eventName}
                </span>
                {item.batch && (
                  <span className="text-[#88aa90] text-[11px] font-mono whitespace-nowrap">
                    {item.batch}
                  </span>
                )}
              </div>

              {/* Avatar + Name row */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#020703] border border-[#00ff66]/30 flex-shrink-0 relative group-hover:border-[#00ff66] transition-colors">
                  <img
                    src={item.photoUrl || "/assets/leaders/elston.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/assets/leaders/elston.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-[#00ff66]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <h3 className="font-mono text-base font-bold text-white group-hover:text-[#00ff66] transition-colors leading-tight">
                    {item.name}
                  </h3>
                  <p className="font-mono text-xs text-[#00ff66] font-semibold mt-0.5 flex items-center gap-1">
                    <Award className="w-3 h-3" /> {item.role}
                  </p>
                </div>
              </div>

              {/* Bio / Contribution Description */}
              {item.bio && (
                <p className="font-mono text-xs text-[#88aa90] leading-relaxed line-clamp-3 bg-[#020703]/60 p-3 rounded-lg border border-[#00ff66]/10">
                  {item.bio}
                </p>
              )}
            </div>

            {/* Footer with social and department */}
            <div className="pt-4 mt-5 border-t border-[#00ff66]/15 flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#88aa90]/70">
                {item.department}
              </span>
              <div className="flex items-center gap-3">
                {item.github && (
                  <a
                    href={item.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#88aa90] hover:text-[#00ff66] transition-colors"
                    aria-label={`${item.name} GitHub`}
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                {item.linkedin && (
                  <a
                    href={item.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#88aa90] hover:text-[#00ff66] transition-colors"
                    aria-label={`${item.name} LinkedIn`}
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                  </a>
                )}
                {item.instagram && (
                  <a
                    href={item.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#88aa90] hover:text-[#00ff66] transition-colors"
                    aria-label={`${item.name} Instagram`}
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 font-mono">
          <p className="text-4xl mb-4">🤝</p>
          <p className="text-[#88aa90] text-sm">No contributors found for this filter.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedEvent("ALL");
            }}
            className="mt-4 text-[#00ff66] text-xs underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};
