import React from "react";
import { Link } from "react-router-dom";
import {
  Shield, Code2, Users, Rocket, Award, GraduationCap,
  Calendar, CheckCircle2, ChevronRight, Terminal, Heart,
} from "lucide-react";

export const AboutPage: React.FC = () => {
  const domains = [
    {
      title: "Technical & Innovation",
      icon: Code2,
      tag: "CORE TRACK",
      desc: "Hands-on workshops, algorithmic problem solving, Web3 bootcamps, and adversarial AI prompt engineering challenges.",
    },
    {
      title: "Leadership & Governance",
      icon: Shield,
      tag: "COUNCIL",
      desc: "Annual elections, strategic student council initiatives, departmental communication, and university-wide hackathons.",
    },
    {
      title: "Events & Hackathons",
      icon: Calendar,
      tag: "COMMUNITY",
      desc: "Flagship competitions like PROMPT OPS-2K26, departmental entry galas like Lumière, and inter-college tech summits.",
    },
    {
      title: "Industry Readiness",
      icon: Rocket,
      tag: "CAREERS",
      desc: "UDAAN mock interviews, resume reviews, placement preparatory drives, and mentorship from senior alumni engineers.",
    },
  ];

  const milestones = [
    {
      year: "2026",
      title: "PROMPT OPS-2K26 & AI Security Testbeds",
      desc: "Pioneered prompt engineering hackathons treating LLMs as adversarial runtime environments with over 120 participants.",
    },
    {
      year: "2025",
      title: "Lumière Gala & Solidity Bootcamp",
      desc: "Welcomed 150+ CSE students in the Kalam Auditorium and launched hands-on smart contract deployment workshops.",
    },
    {
      year: "2024",
      title: "UDAAN Placement Simulation Drives",
      desc: "Conducted multi-round technical interviews bridging alumni mentors in tier-1 product firms with undergraduate candidates.",
    },
    {
      year: "2023",
      title: "KSCST Project Sponsorships",
      desc: "Guided undergraduate research projects securing state-level funding and publication recognition across regional symposiums.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 font-mono select-none">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] text-xs tracking-wider uppercase mb-5">
          <Terminal className="w-3.5 h-3.5" />
          <span>Association Architecture</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          About <span className="text-[#00ff66] text-glow">CIPHER</span>
        </h1>
        <p className="text-sm text-[#88aa90] leading-relaxed">
          The premier student association of the Department of Computer Science &amp; Engineering at St Joseph Engineering College (SJEC), Vamanjoor, Mangaluru.
        </p>

        {/* Vital Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          {[
            { label: "Founded Under", val: "CSE Dept" },
            { label: "Active Members", val: "250+" },
            { label: "Events Hosted", val: "17+" },
            { label: "Campus Chapter", val: "SJEC" },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-xl bg-[#040e06] border border-[#00ff66]/20 text-center">
              <p className="text-xl md:text-2xl font-bold text-[#00ff66] text-glow">{s.val}</p>
              <p className="text-[11px] text-[#88aa90] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mission & Vision ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="p-8 rounded-2xl bg-[#040e06] border border-[#00ff66]/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-2 right-3 text-6xl text-[#00ff66]/5 font-black">01</div>
          <div>
            <div className="inline-flex items-center gap-2 text-xs text-[#00ff66] font-bold uppercase tracking-widest mb-3">
              <Shield className="w-4 h-4" /> Our Mission
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Empowering Engineers Through Creation</h3>
            <p className="text-xs md:text-sm text-[#88aa90] leading-relaxed">
              CIPHER serves as the catalytic platform for Computer Science &amp; Engineering students to transform theoretical computer science concepts into scalable software products, competitive programming acumen, and impactful community initiatives.
            </p>
          </div>
          <ul className="space-y-2.5 mt-6 text-xs text-[#a0c0a8] border-t border-[#00ff66]/15 pt-5">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] flex-shrink-0" />
              <span>Bridge classroom academics with production-ready software development</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] flex-shrink-0" />
              <span>Foster an inclusive culture of open-source contributions and peer mentorship</span>
            </li>
          </ul>
        </div>

        <div className="p-8 rounded-2xl bg-[#040e06] border border-[#00ff66]/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-2 right-3 text-6xl text-[#00ff66]/5 font-black">02</div>
          <div>
            <div className="inline-flex items-center gap-2 text-xs text-[#00ff66] font-bold uppercase tracking-widest mb-3">
              <Rocket className="w-4 h-4" /> Our Vision
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">A Legacy of Technical Excellence</h3>
            <p className="text-xs md:text-sm text-[#88aa90] leading-relaxed">
              To be recognized across technological universities as a beacon of student-driven innovation, producing ethical technologists, visionary startup founders, and research pioneers equipped to solve computing's next grand challenges.
            </p>
          </div>
          <ul className="space-y-2.5 mt-6 text-xs text-[#a0c0a8] border-t border-[#00ff66]/15 pt-5">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] flex-shrink-0" />
              <span>Incubate state-of-the-art AI, Blockchain, and System Design tracks</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66] flex-shrink-0" />
              <span>Elevate regional campus talent into global engineering opportunities</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Core Domains ─────────────────────────────────────────── */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs text-[#00ff66] uppercase tracking-widest mb-2 font-bold">
            <Users className="w-3.5 h-3.5" /> Department Pillars
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">How We Operate</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {domains.map((d) => {
            const Icon = d.icon;
            return (
              <div
                key={d.title}
                className="p-6 rounded-2xl bg-[#040e06] border border-[#00ff66]/20 hover:border-[#00ff66] transition-all hover:shadow-[0_0_25px_rgba(0,255,102,0.15)] flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#00ff66]/10 border border-[#00ff66]/30 flex items-center justify-center text-[#00ff66] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-[#00ff66] font-bold tracking-widest uppercase block mb-1">
                    {d.tag}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2">{d.title}</h3>
                  <p className="text-xs text-[#88aa90] leading-relaxed">{d.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Faculty Advisory & Department Affiliation ───────────── */}
      <div className="p-8 md:p-12 rounded-2xl bg-[#040e06] border border-[#00ff66]/25 mb-20 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 rounded-2xl bg-[#020703] border-2 border-[#00ff66]/40 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-12 h-12 text-[#00ff66]" />
          </div>
          <div>
            <div className="text-xs text-[#00ff66] font-bold uppercase tracking-widest mb-1">
              Institutional Mentorship
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Department of Computer Science &amp; Engineering</h3>
            <p className="text-xs md:text-sm text-[#88aa90] leading-relaxed mb-4">
              Cipher operates under the leadership of HOD Dr. Melwyn D’Souza, faculty coordinators Ms. Nisha J Roche and Ms. Jaishma K, and the senior academic council of St Joseph Engineering College.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#00ff66]">
              <span className="px-3 py-1 rounded bg-[#00ff66]/10 border border-[#00ff66]/20">NBA Accredited Department</span>
              <span className="px-3 py-1 rounded bg-[#00ff66]/10 border border-[#00ff66]/20">Kalam Auditorium Chapter</span>
              <span className="px-3 py-1 rounded bg-[#00ff66]/10 border border-[#00ff66]/20">Autonomous Institution</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Journey & Milestones ─────────────────────────────────── */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs text-[#00ff66] uppercase tracking-widest mb-2 font-bold">
            <Award className="w-3.5 h-3.5" /> Historical Timeline
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Milestones &amp; Impact</h2>
        </div>

        <div className="space-y-4">
          {milestones.map((m) => (
            <div
              key={m.title}
              className="p-6 rounded-xl bg-[#040e06] border border-[#00ff66]/15 hover:border-[#00ff66]/35 transition-all flex flex-col md:flex-row md:items-center gap-6"
            >
              <div className="text-2xl font-black text-[#00ff66] text-glow w-20 flex-shrink-0">
                {m.year}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-white mb-1">{m.title}</h3>
                <p className="text-xs text-[#88aa90] leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <div className="p-8 md:p-10 rounded-2xl bg-gradient-to-r from-[#00ff66]/15 to-[#00f0ff]/10 border border-[#00ff66]/30 text-center flex flex-col items-center justify-center">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Want to shape what comes next?</h3>
        <p className="text-xs md:text-sm text-[#88aa90] max-w-xl mb-6">
          Whether you are an aspiring coder, competitive programmer, or event organizer, Cipher is your launchpad at SJEC.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/contact"
            className="px-6 py-3 rounded-xl bg-[#00ff66] text-black font-bold text-xs tracking-wider uppercase hover:bg-[#00ff66]/90 transition-all shadow-[0_0_20px_rgba(0,255,102,0.35)] flex items-center gap-2"
          >
            <span>JOIN THE ASSOCIATION</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            to="/team"
            className="px-6 py-3 rounded-xl bg-[#041006] text-[#00ff66] border border-[#00ff66]/30 font-bold text-xs tracking-wider uppercase hover:bg-[#00ff66]/10 transition-all"
          >
            MEET THE COUNCIL
          </Link>
        </div>
      </div>
    </div>
  );
};
