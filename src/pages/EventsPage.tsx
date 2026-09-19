import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Images, Sparkles, Filter, Clock, ArrowRight, Trophy, BookOpen, Layers } from "lucide-react";
import { EventData, EventModal } from "../components/EventModal.tsx";

const DEFAULT_EVENTS: EventData[] = [
  {
    id: "promptops",
    tag: "COMPETITION",
    dateTag: "25 MAR 2026",
    title: "PROMPT OPS-2K26",
    subTitle: "25 MARCH 2026 · PROMPT ENGINEERING COMPETITION",
    slug: "PROMPT_OPS",
    cardSub: "AgentBlazer Club × Cipher",
    description:
      "A technical competition on prompt engineering and AI tools by the AgentBlazer Club and Cipher. Track 1 covered invitation, logo and image recreation; Track 2 tested JSON conversion, Python debugging and a Gemini AI security prompt challenge.",
    fullDescription: [
      "Organized by the AgentBlazer Club and Cipher under the guidance of Ms. Nisha J Roche, Ms. Jaishma K, and HOD Dr. Melwyn D'Souza, this technical competition focused on prompt engineering and AI tools (mapped to PO4, PO5, PO8, PO11).",
      "Track 1 (1st Year) featured invitation generation, logo recreation, and image recreation rounds, with Chinmayee, Chris Royston Monteiro, and Deeksha Ravi Moger taking top honors.",
      "Track 2 (2nd Year) tested students in JSON conversion, Python code debugging, and a Gemini AI security prompt extraction challenge, with Harimurali KS, Venus Suhani D'Lima, and Venisha Snehal D'Souza securing top positions.",
    ],
    slides: [
      "/assets/promptops/slide_01.jpg",
      "/assets/promptops/slide_02.jpg",
      "/assets/promptops/slide_03.jpg",
      "/assets/promptops/slide_04.jpg",
      "/assets/promptops/slide_05.jpg",
      "/assets/promptops/slide_06.jpg",
      "/assets/promptops/slide_07.jpg",
      "/assets/promptops/slide_08.jpg",
    ],
  },
  {
    id: "lumiere",
    tag: "BRANCH GALA",
    dateTag: "29 OCT 2025",
    title: "Lumière — The Gala",
    subTitle: "29 OCTOBER 2025 · KALAM AUDITORIUM",
    slug: "LUMIERE_GALA",
    cardSub: "CSE Branch Entry · Kalam Auditorium",
    description:
      "The CSE branch entry programme at Kalam Auditorium, themed 'Where Glam Meets Glow.' Organised by the Cipher Association with coordinated red, gold and black décor, it welcomed students into the department and reinforced a shared sense of collective identity.",
    fullDescription: [
      "The Department of Computer Science and Engineering (CSE) held its branch entry programme, 'Lumière – The Gala,' on 29 October 2025 at the Kalam Auditorium. Organised by the Cipher Association, the event welcomed students into the department through a formal gathering centred on the theme 'Where Glam Meets Glow.'",
      "The programme gave students an opportunity to interact with peers and take part in a shared departmental event beyond academics, highlighting the role of the Cipher Association in organising student-led activities. It concluded as a formal branch entry that marked the students' transition into the department and reinforced a sense of collective identity.",
    ],
    slides: [
      "/assets/lumiere/slide_01.jpg",
      "/assets/lumiere/slide_02.jpg",
      "/assets/lumiere/slide_03.jpg",
      "/assets/lumiere/slide_04.jpg",
      "/assets/lumiere/slide_05.jpg",
      "/assets/lumiere/slide_06.jpg",
      "/assets/lumiere/slide_07.jpg",
      "/assets/lumiere/slide_08.jpg",
    ],
  },
  {
    id: "solidity-workshop",
    tag: "WORKSHOP",
    dateTag: "14 FEB 2026",
    title: "Smart Contract Dev Bootcamp",
    subTitle: "14 FEBRUARY 2026 · TECHNICAL SESSION",
    slug: "SOLIDITY_WORKSHOP",
    cardSub: "Cipher Technical Domain",
    description:
      "A hands-on workshop covering Solidity fundamentals, EVM architecture, gas optimization, and deploying ERC-20 token contracts on the Sepolia testnet. Beginner to intermediate track.",
    fullDescription: [
      "Cipher's Technical Domain track hosted an intensive Solidity and Web3 developer crash course for CSE students.",
      "We started with the Ethereum Virtual Machine (EVM) stack model, memory vs storage vs calldata, and why gas optimization matters when deploying production code.",
      "Students created their own ERC-20 token contract, wrote automated test suites with Hardhat, and successfully broadcasted deployment transactions to the Sepolia testnet.",
    ],
    slides: [
      "/assets/promptops/slide_01.jpg",
      "/assets/promptops/slide_02.jpg",
      "/assets/promptops/slide_03.jpg",
    ],
  },
  {
    id: "udaan-mock",
    tag: "CAREER",
    dateTag: "05 JAN 2026",
    title: "UDAAN Mock Interview Drive",
    subTitle: "05 JANUARY 2026 · PLACEMENT PREP",
    slug: "UDAAN_MOCK",
    cardSub: "Cipher Senior Council",
    description:
      "A three-round mock interview program simulating campus and off-campus technical evaluations. Conducted by Cipher alumni placed in top product companies, covering DSA, system design, and HR rounds.",
    fullDescription: [
      "The UDAAN Mock Interview initiative was established to simulate real-world campus recruitment and off-campus tech evaluations.",
      "Through three rigorous rounds—DSA problem solving, system architecture discussions, and HR behavioral screenings—candidates received real-time constructive feedback from seniors placed in top product companies.",
      "Key takeaway: Communicate thought processes before writing code. Deep fundamentals in OS, DBMS indexing, and networking protocols matter far more than buzzwords on resumes.",
    ],
    slides: [
      "/assets/lumiere/slide_01.jpg",
      "/assets/lumiere/slide_02.jpg",
    ],
  },
];

const TAG_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  COMPETITION: { color: "#00ff66", bg: "bg-[#00ff66]", icon: <Trophy className="w-3 h-3" /> },
  "BRANCH GALA": { color: "#f59e0b", bg: "bg-amber-500", icon: <Sparkles className="w-3 h-3" /> },
  WORKSHOP: { color: "#60a5fa", bg: "bg-blue-400", icon: <BookOpen className="w-3 h-3" /> },
  CAREER: { color: "#a78bfa", bg: "bg-violet-400", icon: <Layers className="w-3 h-3" /> },
  EVENT: { color: "#00ff66", bg: "bg-[#00ff66]", icon: <Calendar className="w-3 h-3" /> },
};

const tagCfg = (tag: string) => TAG_CONFIG[tag] || TAG_CONFIG["EVENT"];

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>(DEFAULT_EVENTS);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/public/events");
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data) && json.data.length > 0) {
            setEvents(
              json.data.map((e: any) => ({
                id: e.id,
                tag: e.tag || "EVENT",
                dateTag: e.dateTag || "UPCOMING",
                title: e.title,
                subTitle: e.subTitle || e.title,
                slug: e.slug || e.id,
                cardSub: e.cardSub || "Cipher Association",
                description: e.shortDesc || e.description || "",
                fullDescription: Array.isArray(e.fullDescription)
                  ? e.fullDescription
                  : typeof e.fullDescription === "string"
                  ? (() => { try { return JSON.parse(e.fullDescription); } catch { return [e.fullDescription]; } })()
                  : [e.shortDesc || e.description || ""],
                slides: Array.isArray(e.slides) && e.slides.length > 0
                  ? e.slides.map((s: any) => (typeof s === "string" ? s : s.imageUrl))
                  : [e.posterUrl || "/assets/promptops/slide_01.jpg"],
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
    fetchEvents();
  }, []);

  const allTags = Array.from(new Set(events.map((e) => e.tag)));
  const filters = ["ALL", ...allTags];

  const filteredEvents = events.filter((e) =>
    activeFilter === "ALL" ? true : e.tag.toUpperCase() === activeFilter
  );

  const [featuredEvent, ...restEvents] = filteredEvents;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center font-mono text-[#88aa90] text-xs space-y-3">
          <div className="w-8 h-8 border-2 border-[#00ff66]/30 border-t-[#00ff66] rounded-full animate-spin mx-auto" />
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="mb-14 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] font-mono text-xs tracking-wider uppercase mb-5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Workshops & Contests</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-mono font-bold text-white mb-4 tracking-tight">
          Events &amp;{" "}
          <span className="text-[#00ff66]" style={{ textShadow: "0 0 20px rgba(0,255,102,0.5)" }}>
            Workshops
          </span>
        </h1>
        <p className="font-mono text-sm text-[#88aa90] leading-relaxed">
          From AI prompt engineering hackathons to formal department galas — explore milestone gatherings hosted by the Cipher Student Association at SJEC.
        </p>

        {/* Quick stats */}
        <div className="flex items-center justify-center gap-8 mt-8">
          {[
            { label: "Total Events", value: events.length },
            { label: "Competitions", value: events.filter((e) => e.tag === "COMPETITION").length },
            { label: "Workshops", value: events.filter((e) => e.tag === "WORKSHOP").length },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-mono text-2xl font-bold text-[#00ff66]">{s.value}</p>
              <p className="font-mono text-xs text-[#88aa90] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filter Tabs ──────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 mb-12 pb-5 border-b border-[#00ff66]/15 overflow-x-auto scrollbar-none flex-wrap">
        <div className="flex items-center gap-1.5 mr-2 text-xs font-mono text-[#88aa90]">
          <Filter className="w-3.5 h-3.5 text-[#00ff66]" /> Filter:
        </div>
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all whitespace-nowrap ${
              activeFilter === filter
                ? "bg-[#00ff66] text-black font-bold shadow-[0_0_15px_rgba(0,255,102,0.4)]"
                : "bg-[#041006] text-[#88aa90] hover:text-[#00ff66] border border-[#00ff66]/20"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* ── Featured Event (top/first) ───────────────────────────── */}
      {featuredEvent && (
        <div
          onClick={() => setSelectedEvent(featuredEvent)}
          className="group relative rounded-2xl overflow-hidden border border-[#00ff66]/25 hover:border-[#00ff66] transition-all duration-300 cursor-pointer hover:shadow-[0_0_40px_rgba(0,255,102,0.2)] mb-8"
        >
          {/* Background image */}
          <div className="relative h-72 md:h-96 w-full overflow-hidden">
            <img
              src={featuredEvent.slides[0] || "/assets/promptops/slide_01.jpg"}
              alt={featuredEvent.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { (e.target as HTMLImageElement).src = "/assets/promptops/slide_01.jpg"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* FEATURED badge */}
            <div className="absolute top-5 left-5 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded font-mono text-[10px] font-bold uppercase tracking-widest text-black"
                style={{ background: tagCfg(featuredEvent.tag).color }}>
                {featuredEvent.tag}
              </span>
              <span className="px-2.5 py-1 rounded bg-white/10 backdrop-blur border border-white/20 font-mono text-[10px] text-white tracking-wider">
                FEATURED
              </span>
            </div>

            {/* Slide count */}
            <div className="absolute top-5 right-5 flex items-center gap-1 px-2.5 py-1 rounded bg-black/60 backdrop-blur border border-[#00ff66]/30 text-[11px] font-mono text-[#00ff66]">
              <Images className="w-3.5 h-3.5" /> {featuredEvent.slides.length} Slides
            </div>

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <p className="font-mono text-xs text-[#00ff66] tracking-widest uppercase mb-2">{featuredEvent.cardSub}</p>
              <h2 className="text-2xl md:text-4xl font-mono font-bold text-white group-hover:text-[#00ff66] transition-colors leading-tight mb-3">
                {featuredEvent.title}
              </h2>
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 text-xs font-mono text-[#88aa90]">
                <span className="flex items-center gap-1.5 text-[#00ff66]">
                  <Calendar className="w-3.5 h-3.5" /> {featuredEvent.dateTag}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#00ff66]" /> St Joseph Engineering College
                </span>
                <span className="hidden md:flex items-center gap-1.5 ml-auto text-[#00ff66] group-hover:translate-x-1 transition-transform">
                  Open Gallery <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Events Grid ──────────────────────────────────────────── */}
      {restEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {restEvents.map((event) => (
            <EventCard key={event.id} event={event} onSelect={setSelectedEvent} />
          ))}
        </div>
      )}

      {filteredEvents.length === 0 && (
        <div className="text-center py-20 font-mono">
          <p className="text-4xl mb-4">📅</p>
          <p className="text-[#88aa90] text-sm">No events found for this category.</p>
          <button onClick={() => setActiveFilter("ALL")} className="mt-4 text-[#00ff66] text-xs underline">
            Show all events
          </button>
        </div>
      )}

      {/* Modal */}
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
};

// ── Event Card ────────────────────────────────────────────────────────────
interface EventCardProps {
  event: EventData;
  onSelect: (e: EventData) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onSelect }) => {
  const cfg = tagCfg(event.tag);
  return (
    <div
      onClick={() => onSelect(event)}
      className="group relative rounded-2xl bg-[#040e06] border border-[#00ff66]/20 hover:border-[#00ff66] transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-[0_0_25px_rgba(0,255,102,0.2)] hover:-translate-y-1.5 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-44 overflow-hidden bg-[#020703]">
        <img
          src={event.slides[0] || "/assets/promptops/slide_01.jpg"}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = "/assets/promptops/slide_01.jpg"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040e06] via-transparent to-transparent opacity-70" />

        {/* Tag */}
        <div className={`absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded ${cfg.bg} text-black font-mono text-[9px] font-bold uppercase tracking-widest`}>
          {cfg.icon} {event.tag}
        </div>
        {/* Slides */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur border border-[#00ff66]/30 text-[10px] font-mono text-[#00ff66]">
          <Images className="w-3 h-3" /> {event.slides.length}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#00ff66] tracking-widest uppercase mb-2">
          <Calendar className="w-3 h-3" /> {event.dateTag}
        </div>
        <h3 className="font-mono text-base font-bold text-white group-hover:text-[#00ff66] transition-colors leading-snug mb-2">
          {event.title}
        </h3>
        <p className="font-mono text-[11px] text-[#88aa90] leading-relaxed line-clamp-2 flex-1">
          {event.description}
        </p>

        <div className="mt-4 pt-4 border-t border-[#00ff66]/10 flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#88aa90] flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#00ff66]" /> SJEC
          </span>
          <span className="flex items-center gap-1 text-[10px] font-mono text-[#00ff66] group-hover:translate-x-0.5 transition-transform">
            Gallery <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};
