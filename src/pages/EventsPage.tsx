import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Images, Sparkles, Filter } from "lucide-react";
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
      "Organized by the AgentBlazer Club and Cipher under the guidance of Ms. Nisha J Roche, Ms. Jaishma K, and HOD Dr. Melwyn D’Souza, this technical competition focused on prompt engineering and AI tools (mapped to PO4, PO5, PO8, PO11).",
      "Track 1 (1st Year) featured invitation generation, logo recreation, and image recreation rounds, with Chinmayee, Chris Royston Monteiro, and Deeksha Ravi Moger taking top honors.",
      "Track 2 (2nd Year) tested students in JSON conversion, Python code debugging, and a Gemini AI security prompt extraction challenge, with Harimurali KS, Venus Suhani D’Lima, and Venisha Snehal D’Souza securing top positions.",
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
      "The CSE branch entry programme at Kalam Auditorium, themed “Where Glam Meets Glow.” Organised by the Cipher Association with coordinated red, gold and black décor, it welcomed students into the department and reinforced a shared sense of collective identity.",
    fullDescription: [
      "The Department of Computer Science and Engineering (CSE) held its branch entry programme, “Lumière – The Gala,” on 29 October 2025 at the Kalam Auditorium. Organised by the Cipher Association, the event welcomed students into the department through a formal gathering centred on the theme “Where Glam Meets Glow.” The venue featured coordinated red, gold and black décor, floral arrangements, illuminated panels and a central Lumière backdrop.",
      "The programme gave students an opportunity to interact with peers and take part in a shared departmental event beyond academics, highlighting the role of the Cipher Association in organising student-led activities. It concluded as a formal branch entry that marked the students’ transition into the department and reinforced a sense of collective identity.",
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
];

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>(DEFAULT_EVENTS);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

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
                  ? JSON.parse(e.fullDescription)
                  : [e.shortDesc || e.description || ""],
                slides: Array.isArray(e.slides) && e.slides.length > 0
                  ? e.slides.map((s: any) => (typeof s === "string" ? s : s.imageUrl))
                  : [e.coverImage || "/assets/promptops/slide_01.jpg"],
              }))
            );
          }
        }
      } catch (err) {
        console.warn("Using offline events fallback data");
      }
    }
    fetchEvents();
  }, []);

  const filters = ["ALL", "COMPETITION", "BRANCH GALA", "WORKSHOP"];

  const filteredEvents = events.filter((e) => {
    if (activeFilter === "ALL") return true;
    return e.tag.toUpperCase() === activeFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* Page Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] font-mono text-xs tracking-wider uppercase mb-4">
          <Calendar className="w-3.5 h-3.5" />
          <span>Workshops &amp; Contests</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-mono font-bold text-white mb-4 tracking-tight">
          Events &amp; <span className="text-[#00ff66] text-glow">Workshops</span>
        </h1>
        <p className="font-mono text-xs md:text-sm text-[#88aa90] leading-relaxed">
          From AI prompt engineering hackathons to formal department galas — explore the milestone gatherings hosted by the Cipher Student Association.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 mb-10 pb-4 border-b border-[#00ff66]/15 overflow-x-auto scrollbar-none">
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

      {/* Events Showcase List */}
      <div className="space-y-8">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            className="group relative rounded-2xl bg-[#040e06] border border-[#00ff66]/20 hover:border-[#00ff66] transition-all duration-300 p-6 md:p-8 cursor-pointer hover:shadow-[0_0_30px_rgba(0,255,102,0.2)] hover:-translate-y-0.5 flex flex-col lg:flex-row gap-6 md:gap-8 items-start"
          >
            {/* Event Preview Thumbnail / Slide Count */}
            <div className="relative w-full lg:w-96 h-60 rounded-xl overflow-hidden bg-[#020703] border border-[#00ff66]/25 flex-shrink-0">
              <img
                src={event.slides[0] || "/assets/promptops/slide_01.jpg"}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/promptops/slide_01.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Tag & Date Overlay */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#00ff66] text-black font-mono text-[10px] font-bold uppercase tracking-wider">
                {event.tag}
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-white">
                <span className="flex items-center gap-1.5 text-[#00ff66]">
                  <Calendar className="w-3.5 h-3.5" /> {event.dateTag}
                </span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/60 backdrop-blur border border-[#00ff66]/30 text-[11px]">
                  <Images className="w-3 h-3 text-[#00ff66]" /> {event.slides.length} Slides
                </span>
              </div>
            </div>

            {/* Event Content Details */}
            <div className="flex-1 flex flex-col justify-between self-stretch">
              <div>
                <span className="font-mono text-xs text-[#00ff66] tracking-widest uppercase block mb-1">
                  {event.cardSub}
                </span>
                <h3 className="text-xl md:text-2xl font-mono font-bold text-white group-hover:text-[#00ff66] transition-colors">
                  {event.title}
                </h3>
                <p className="font-mono text-xs text-[#88aa90] mt-3 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-[#00ff66]/15 flex items-center justify-between">
                <span className="font-mono text-xs text-[#88aa90] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#00ff66]" /> St Joseph Engineering College
                </span>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[#00ff66] px-4 py-2 rounded-lg bg-[#00ff66]/10 border border-[#00ff66]/30 group-hover:bg-[#00ff66] group-hover:text-black transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Open Gallery</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Modal Slider */}
      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};
