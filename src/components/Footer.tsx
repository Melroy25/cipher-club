import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Mail, ArrowUp, Copy, Check, Terminal, Shield, Sparkles,
  ExternalLink, ChevronRight, Heart, Users,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "./Icons.tsx";

interface FooterProps {
  onOpenRootAccess?: () => void;
  onOpenJoinModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRootAccess, onOpenJoinModal }) => {
  const [email, setEmail] = useState("cipher@sjec.ac.in");
  const [linkedin, setLinkedin] = useState("https://linkedin.com");
  const [github, setGithub] = useState("https://github.com");
  const [instagram, setInstagram] = useState("https://instagram.com");
  const [copyright, setCopyright] = useState("> © 2026 CIPHER SJEC.");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/public/content");
        if (res.ok) {
          const json = await res.json();
          if (json.map) {
            if (json.map.contact_email) setEmail(json.map.contact_email);
            if (json.map.linkedin_url) setLinkedin(json.map.linkedin_url);
            if (json.map.github_url) setGithub(json.map.github_url);
            if (json.map.instagram_url) setInstagram(json.map.instagram_url);
            if (json.map.footer_copyright) setCopyright(json.map.footer_copyright);
          }
        }
      } catch {}
    }
    fetchContent();
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-[#00ff66]/15 bg-[#020603] pt-16 pb-12 overflow-hidden select-none font-mono">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-[#00ff66]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* ── Top Hero Callout (Unique to Cipher) ──────────────── */}
        <div className="mb-16 p-8 md:p-12 rounded-2xl bg-gradient-to-br from-[#041006] via-[#020703] to-[#041508] border border-[#00ff66]/25 relative overflow-hidden shadow-[0_0_40px_rgba(0,255,102,0.08)]">
          {/* Accent corner reticles */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#00ff66]/40" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#00ff66]/40" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#00ff66]/40" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#00ff66]/40" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] text-xs tracking-widest uppercase mb-4">
                <Terminal className="w-3.5 h-3.5" />
                <span>COMMUNICATION CHANNEL</span>
              </div>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight mb-3">
                SHAPING TOMORROW'S ENGINEERS, HACKERS &amp; BUILDERS.
              </h2>
              <p className="text-xs md:text-sm text-[#88aa90] leading-relaxed">
                Have an initiative, workshop idea, or campus sponsorship in mind? Let's engineer something extraordinary together.
              </p>
            </div>

            {/* Email Contact Action Box */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#020703] border border-[#00ff66]/30 text-white text-xs">
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-[#00ff66] hover:underline font-bold"
                  title="Open mail client"
                >
                  <Mail className="w-4 h-4 text-[#00ff66]" />
                  <span>{email}</span>
                </a>
                <button
                  onClick={copyEmail}
                  className="p-1 rounded text-[#88aa90] hover:text-[#00ff66] transition-colors ml-2"
                  title="Copy email to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-[#00ff66]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <a
                href={`mailto:${email}?subject=CIPHER%20Collaboration%20Inquiry`}
                className="px-6 py-3 rounded-xl bg-[#00ff66] text-black font-bold text-xs tracking-wider uppercase hover:bg-[#00ff66]/90 transition-all shadow-[0_0_20px_rgba(0,255,102,0.35)] flex items-center justify-center gap-2 text-center"
              >
                <span>SEND MESSAGE</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* System status tag */}
          <div className="mt-6 pt-6 border-t border-[#00ff66]/15 flex flex-wrap items-center gap-4 text-[11px] text-[#88aa90]">
            <span className="flex items-center gap-1.5 text-[#00ff66]">
              <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
              SYSTEM ACTIVE
            </span>
            <span>•</span>
            <span>ST JOSEPH ENGINEERING COLLEGE</span>
            <span>•</span>
            <span>DEPARTMENT OF COMPUTER SCIENCE &amp; ENGINEERING</span>
          </div>
        </div>

        {/* ── Main Multi-Column Links Section ─────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img src="/assets/logo.png" alt="Cipher Logo" className="w-8 h-8 object-contain" />
              <h3 className="text-2xl font-extrabold tracking-wider text-[#00ff66] text-glow">
                CIPHER
              </h3>
            </div>
            <p className="text-xs text-[#88aa90] leading-relaxed max-w-md">
              The premier student association of the Department of Computer Science &amp; Engineering at St Joseph Engineering College, Vamanjoor, Mangaluru. Fostering technical excellence, hackathons, and collaborative software engineering.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`mailto:${email}`}
                aria-label="Email"
                className="w-9 h-9 rounded-lg border border-[#00ff66]/30 hover:border-[#00ff66] hover:bg-[#00ff66]/10 flex items-center justify-center text-[#00ff66] transition-all hover:shadow-[0_0_15px_rgba(0,255,102,0.3)]"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg border border-[#00ff66]/30 hover:border-[#00ff66] hover:bg-[#00ff66]/10 flex items-center justify-center text-[#00ff66] transition-all hover:shadow-[0_0_15px_rgba(0,255,102,0.3)]"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-lg border border-[#00ff66]/30 hover:border-[#00ff66] hover:bg-[#00ff66]/10 flex items-center justify-center text-[#00ff66] transition-all hover:shadow-[0_0_15px_rgba(0,255,102,0.3)]"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg border border-[#00ff66]/30 hover:border-[#00ff66] hover:bg-[#00ff66]/10 flex items-center justify-center text-[#00ff66] transition-all hover:shadow-[0_0_15px_rgba(0,255,102,0.3)]"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Menu */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-4 text-[#00ff66]">
              // NAVIGATION
            </h4>
            <ul className="space-y-2.5 text-xs text-[#88aa90]">
              <li>
                <Link to="/" className="hover:text-[#00ff66] transition-colors flex items-center gap-1.5">
                  <span className="text-[#00ff66]/60">&gt;</span> Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#00ff66] transition-colors flex items-center gap-1.5">
                  <span className="text-[#00ff66]/60">&gt;</span> Events &amp; Workshops
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-[#00ff66] transition-colors flex items-center gap-1.5">
                  <span className="text-[#00ff66]/60">&gt;</span> Leadership Team
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#00ff66] transition-colors flex items-center gap-1.5">
                  <span className="text-[#00ff66]/60">&gt;</span> Technical Blog
                </Link>
              </li>
              <li>
                <Link to="/contributors" className="hover:text-[#00ff66] transition-colors flex items-center gap-1.5 text-[#00ff66] font-semibold">
                  <Heart className="w-3 h-3 text-[#00ff66]" /> Event Contributors
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Access */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-4 text-[#00ff66]">
              // COMMUNITY &amp; ACCESS
            </h4>
            <ul className="space-y-2.5 text-xs text-[#88aa90]">
              <li>
                <button
                  onClick={onOpenJoinModal}
                  className="hover:text-[#00ff66] transition-colors flex items-center gap-1.5 text-left text-[#00ff66] font-semibold"
                >
                  <Sparkles className="w-3 h-3 text-[#00ff66]" /> Join CIPHER
                </button>
              </li>
              <li>
                <Link to="/contributors" className="hover:text-[#00ff66] transition-colors flex items-center gap-1.5">
                  <Users className="w-3 h-3" /> Hall of Recognition
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${email}?subject=CIPHER%20Contact`}
                  className="hover:text-[#00ff66] transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3 h-3" /> Contact Coordinators
                </a>
              </li>
              <li>
                <a
                  href="https://sjec.ac.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#00ff66] transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3" /> SJEC Official Portal
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenRootAccess}
                  className="hover:text-[#00ff66] transition-colors flex items-center gap-1.5 text-left"
                >
                  <Shield className="w-3 h-3 text-[#00ff66]" /> Root Admin Access
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ───────────────────────────────────────── */}
        <div className="pt-8 border-t border-[#00ff66]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#88aa90]">
          <div>{copyright}</div>

          <div className="flex items-center gap-6">
            <span className="text-[11px] text-[#88aa90]/60">
              ST JOSEPH ENGINEERING COLLEGE · MANGALURU
            </span>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#041006] border border-[#00ff66]/30 text-[#00ff66] hover:bg-[#00ff66] hover:text-black transition-colors"
              title="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>TOP</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};