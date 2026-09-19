import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from './Icons.tsx';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("cipher@sjec.ac.in");
  const [linkedin, setLinkedin] = useState("https://linkedin.com");
  const [github, setGithub] = useState("https://github.com");
  const [instagram, setInstagram] = useState("https://instagram.com");
  const [copyright, setCopyright] = useState("> © 2026 CIPHER SJEC.");

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch('/api/public/content');
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

  return (
    <footer className="relative border-t border-[#00ff66]/15 bg-[#020603] pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          
          {/* Brand */}
          <div className="text-center md:text-left">
            <h4 className="font-mono text-3xl font-extrabold tracking-wider text-[#00ff66] text-glow mb-2">
              CIPHER
            </h4>
            <p className="font-mono text-xs sm:text-sm text-[#88aa90]">
              Student Association &middot; Computer Science &amp; Engineering
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 text-[#00ff66]">
            <a
              href={`mailto:${email}`}
              aria-label="Email"
              className="w-11 h-11 rounded-full border border-[#00ff66]/30 hover:border-[#00ff66] hover:bg-[#00ff66]/10 flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,102,0.4)]"
            >
              <Mail className="w-5 h-5" />
            </a>

            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-11 h-11 rounded-full border border-[#00ff66]/30 hover:border-[#00ff66] hover:bg-[#00ff66]/10 flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,102,0.4)]"
            >
              <LinkedinIcon className="w-5 h-5" />
            </a>

            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="w-11 h-11 rounded-full border border-[#00ff66]/30 hover:border-[#00ff66] hover:bg-[#00ff66]/10 flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,102,0.4)]"
            >
              <GithubIcon className="w-5 h-5" />
            </a>

            <a
              href={instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-11 h-11 rounded-full border border-[#00ff66]/30 hover:border-[#00ff66] hover:bg-[#00ff66]/10 flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,102,0.4)]"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#00ff66]/15 mb-8" />

        {/* Bottom Copyright */}
        <div className="text-center font-mono text-xs sm:text-sm text-[#88aa90]">
          {copyright}
        </div>

      </div>
    </footer>
  );
};