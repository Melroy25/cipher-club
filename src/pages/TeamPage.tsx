import React, { useState, useEffect } from "react";
import { Search, Shield, Sparkles, ExternalLink, Users, ChevronRight } from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "../components/Icons.tsx";
import { Leader, LeaderModal } from "../components/LeaderModal.tsx";

const DEFAULT_LEADERS: Leader[] = [
  {
    id: "elston",
    name: "Elston Herold Pereira",
    role: "PRESIDENT",
    image: "/assets/leaders/elston.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    bio: "Guiding the Cipher Club's strategic direction, student initiatives, and university-wide hackathons. Leads the executive council with a focus on technical innovation and community building.",
  },
  {
    id: "raynell",
    name: "Raynell Lewis",
    role: "VICE PRESIDENT",
    image: "/assets/leaders/raynell.jpg",
    modalImage: "/assets/leaders/raynell_modal.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    bio: "Overseeing technical projects, workshop logistics, and collaboration with regional tech chapters. Spearheads inter-college event coordination and campus outreach.",
  },
  {
    id: "chaitra",
    name: "Chaitra R M",
    role: "SECRETARY",
    image: "/assets/leaders/chaitra.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    bio: "Managing club operations, official records, departmental communication, and event scheduling. Ensures every club initiative runs smoothly from planning to execution.",
  },
  {
    id: "nazmin",
    name: "Nazmin Ziya",
    role: "TREASURER",
    image: "/assets/leaders/nazmin.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    bio: "Handling financial planning, event allocations, and resource procurement for competitions. Manages sponsorships and ensures fiscal transparency for all club activities.",
  },
  {
    id: "jeslin",
    name: "Jeslin Ninora",
    role: "JOINT TREASURER",
    image: "/assets/leaders/jeslin.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    bio: "Assisting financial administration, accounts reconciliation, and club funding sponsorships. Co-manages budget tracking and vendor coordination for all club events.",
  },
  {
    id: "melroy",
    name: "Melroy Almeida",
    role: "TECHNICAL LEAD",
    image: "/assets/leaders/elston.jpg",
    github: "https://github.com/Melroy25",
    linkedin: "https://linkedin.com",
    bio: "Leading technical workshops, hackathon mentoring, and the club's web infrastructure. Full-stack developer and open-source contributor passionate about developer tooling.",
  },
  {
    id: "ananya",
    name: "Ananya Hegde",
    role: "DESIGN LEAD",
    image: "/assets/leaders/chaitra.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    bio: "Heading all design initiatives, branding assets, and visual identity for Cipher. Creates UI/UX prototypes and manages the club's creative direction.",
  },
  {
    id: "rohan",
    name: "Rohan D'Souza",
    role: "EVENTS COORDINATOR",
    image: "/assets/leaders/raynell.jpg",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    bio: "Coordinating all workshops, guest lectures, and inter-college events. Manages logistics, speaker relations, and participant experience end-to-end.",
  },
];

const ROLE_PRIORITY: Record<string, number> = {
  PRESIDENT: 1,
  "VICE PRESIDENT": 2,
  SECRETARY: 3,
  TREASURER: 4,
  "JOINT TREASURER": 5,
};

const ROLE_COLORS: Record<string, string> = {
  PRESIDENT: "from-[#00ff66] to-[#00c44d]",
  "VICE PRESIDENT": "from-[#00f0ff] to-[#0099cc]",
  SECRETARY: "from-[#a78bfa] to-[#7c3aed]",
  TREASURER: "from-[#fbbf24] to-[#d97706]",
  "JOINT TREASURER": "from-[#fb923c] to-[#ea580c]",
};

const ALL_ROLES = ["ALL", "PRESIDENT", "VICE PRESIDENT", "SECRETARY", "TREASURER", "JOINT TREASURER", "TECHNICAL LEAD", "DESIGN LEAD", "EVENTS COORDINATOR"];

export const TeamPage: React.FC = () => {
  const [leaders, setLeaders] = useState<Leader[]>(DEFAULT_LEADERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [selectedLeader, setSelectedLeader] = useState<Leader | null>(null);
  const [loading, setLoading] = useState(true);

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
                instagram: m.instagram,
                bio: m.bio,
              }))
            );
          }
        }
      } catch {
        // use fallback
      } finally {
        setLoading(false);
      }
    }
    fetchLeaders();
  }, []);

  // Determine unique roles from current data for filter chips
  const availableRoles = ["ALL", ...Array.from(new Set(leaders.map((l) => l.role)))];

  const filteredLeaders = leaders.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.bio || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "ALL" || l.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Sort: priority roles first, then alphabetical
  const sortedLeaders = [...filteredLeaders].sort((a, b) => {
    const pa = ROLE_PRIORITY[a.role] ?? 99;
    const pb = ROLE_PRIORITY[b.role] ?? 99;
    return pa !== pb ? pa - pb : a.name.localeCompare(b.name);
  });

  // Split into featured (exec council) + committee
  const execRoles = ["PRESIDENT", "VICE PRESIDENT", "SECRETARY", "TREASURER", "JOINT TREASURER"];
  const execLeaders = sortedLeaders.filter((l) => execRoles.includes(l.role));
  const committeeLeaders = sortedLeaders.filter((l) => !execRoles.includes(l.role));

  const roleColor = (role: string) => ROLE_COLORS[role] || "from-[#00ff66] to-[#00c44d]";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center font-mono text-[#88aa90] text-xs space-y-3">
          <div className="w-8 h-8 border-2 border-[#00ff66]/30 border-t-[#00ff66] rounded-full animate-spin mx-auto" />
          <p>Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] font-mono text-xs tracking-wider uppercase mb-5">
          <Shield className="w-3.5 h-3.5" />
          <span>Governance & Leadership</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-mono font-bold text-white mb-4 tracking-tight">
          Meet the{" "}
          <span className="text-[#00ff66]" style={{ textShadow: "0 0 20px rgba(0,255,102,0.5)" }}>
            Team
          </span>
        </h1>
        <p className="font-mono text-sm text-[#88aa90] leading-relaxed">
          The elected office bearers and departmental coordinators driving technical excellence, hackathons, and workshops for Computer Science &amp; Engineering students at SJEC.
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-8 mt-8">
          {[
            { label: "Members", value: leaders.length },
            { label: "Events Hosted", value: "12+" },
            { label: "Active Domains", value: "4" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-mono text-2xl font-bold text-[#00ff66]">{stat.value}</p>
              <p className="font-mono text-xs text-[#88aa90] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filter & Search ──────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-12 pb-6 border-b border-[#00ff66]/15">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {availableRoles.slice(0, 7).map((role) => (
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
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#88aa90] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or role..."
            className="w-full pl-9 pr-4 py-2 bg-[#041006] border border-[#00ff66]/25 rounded-xl font-mono text-xs text-white placeholder-[#88aa90]/60 focus:outline-none focus:border-[#00ff66] transition-colors"
          />
        </div>
      </div>

      {/* ── Executive Council ────────────────────────────────────── */}
      {(selectedRole === "ALL" || execRoles.includes(selectedRole)) && execLeaders.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00ff66]/30" />
            <span className="font-mono text-xs tracking-widest text-[#00ff66] uppercase px-3 py-1 rounded-full border border-[#00ff66]/30 bg-[#00ff66]/5">
              Executive Council
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00ff66]/30" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {execLeaders.map((leader) => (
              <MemberCard key={leader.id} leader={leader} roleColor={roleColor(leader.role)} onSelect={setSelectedLeader} featured />
            ))}
          </div>
        </section>
      )}

      {/* ── Committee / Other Leads ──────────────────────────────── */}
      {(selectedRole === "ALL" || !execRoles.includes(selectedRole)) && committeeLeaders.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00ff66]/20" />
            <span className="font-mono text-xs tracking-widest text-[#88aa90] uppercase px-3 py-1 rounded-full border border-[#88aa90]/20 bg-[#88aa90]/5">
              <Users className="w-3 h-3 inline mr-1.5 text-[#00ff66]" />
              Domain Leads & Coordinators
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00ff66]/20" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {committeeLeaders.map((leader) => (
              <MemberCard key={leader.id} leader={leader} roleColor={roleColor(leader.role)} onSelect={setSelectedLeader} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {sortedLeaders.length === 0 && (
        <div className="text-center py-20 font-mono">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-[#88aa90] text-sm">No members found matching your search.</p>
          <button onClick={() => { setSearchQuery(""); setSelectedRole("ALL"); }} className="mt-4 text-[#00ff66] text-xs underline">
            Clear filters
          </button>
        </div>
      )}

      {/* Leader Detail Modal */}
      <LeaderModal leader={selectedLeader} onClose={() => setSelectedLeader(null)} />
    </div>
  );
};

// ── Member Card Component ──────────────────────────────────────────────────
interface CardProps {
  leader: Leader;
  roleColor: string;
  onSelect: (l: Leader) => void;
  featured?: boolean;
}

const MemberCard: React.FC<CardProps> = ({ leader, roleColor, onSelect, featured }) => (
  <div
    onClick={() => onSelect(leader)}
    className={`group relative rounded-2xl bg-[#040e06] border border-[#00ff66]/20 hover:border-[#00ff66] transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-[0_0_30px_rgba(0,255,102,0.2)] hover:-translate-y-1.5 flex flex-col ${featured ? "" : ""}`}
  >
    {/* Photo */}
    <div className={`relative w-full overflow-hidden bg-[#020703] ${featured ? "h-64" : "h-56"}`}>
      <img
        src={leader.image}
        alt={leader.name}
        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-108"
        style={{ transform: "scale(1)", transition: "transform 0.5s ease" }}
        onMouseEnter={(e) => ((e.target as HTMLElement).style.transform = "scale(1.08)")}
        onMouseLeave={(e) => ((e.target as HTMLElement).style.transform = "scale(1)")}
        onError={(e) => { (e.target as HTMLImageElement).src = "/assets/leaders/elston.jpg"; }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#040e06] via-[#040e06]/20 to-transparent" />

      {/* Role badge */}
      <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-gradient-to-r ${roleColor} text-black font-mono text-[9px] font-bold uppercase tracking-widest`}>
        {leader.role}
      </div>

      {/* View profile hint */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 px-2 py-1 rounded bg-black/70 backdrop-blur border border-[#00ff66]/30 text-[10px] font-mono text-[#00ff66]">
        <Sparkles className="w-3 h-3" /> Profile
      </div>
    </div>

    {/* Info */}
    <div className="p-4 flex-1 flex flex-col gap-2">
      <div>
        <h3 className="font-mono text-sm font-bold text-white group-hover:text-[#00ff66] transition-colors leading-tight">
          {leader.name}
        </h3>
        {leader.bio && (
          <p className="font-mono text-[11px] text-[#88aa90] mt-1.5 line-clamp-2 leading-relaxed">
            {leader.bio}
          </p>
        )}
      </div>

      {/* Social + CTA */}
      <div className="flex items-center justify-between pt-3 border-t border-[#00ff66]/10 mt-auto">
        <div className="flex items-center gap-2.5">
          {leader.github && (
            <a href={leader.github} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-[#88aa90] hover:text-[#00ff66] transition-colors" aria-label="GitHub">
              <GithubIcon className="w-3.5 h-3.5" />
            </a>
          )}
          {leader.linkedin && (
            <a href={leader.linkedin} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-[#88aa90] hover:text-[#00ff66] transition-colors" aria-label="LinkedIn">
              <LinkedinIcon className="w-3.5 h-3.5" />
            </a>
          )}
          {(leader as any).instagram && (
            <a href={(leader as any).instagram} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-[#88aa90] hover:text-[#00ff66] transition-colors" aria-label="Instagram">
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        <span className="flex items-center gap-1 text-[10px] font-mono text-[#00ff66]/60 group-hover:text-[#00ff66] transition-colors">
          View <ChevronRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  </div>
);
