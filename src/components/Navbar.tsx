import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onOpenJoinModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenJoinModal }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#030804]/80 backdrop-blur-md border-b border-[#00ff66]/15 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.6)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <img
            src="/assets/logo.png"
            alt="Cipher Logo"
            className="h-9 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_8px_rgba(0,255,102,0.4)]"
          />
        </a>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs md:text-sm tracking-widest text-[#88aa90]">
          <a
            href="#home"
            className="hover:text-[#00ff66] transition-colors py-1 hover:text-glow"
          >
            HOME
          </a>
          <a
            href="#about"
            className="hover:text-[#00ff66] transition-colors py-1 hover:text-glow"
          >
            ABOUT
          </a>
          <a
            href="#leadership"
            className="hover:text-[#00ff66] transition-colors py-1 hover:text-glow"
          >
            LEADERSHIP
          </a>
          <a
            href="#events"
            className="hover:text-[#00ff66] transition-colors py-1 hover:text-glow"
          >
            EVENTS
          </a>
          <a
            href="#join"
            className="hover:text-[#00ff66] transition-colors py-1 hover:text-glow"
          >
            JOIN
          </a>
        </nav>

        {/* Right CTA Button */}
        <div>
          <button
            onClick={onOpenJoinModal}
            className="font-mono text-xs md:text-sm tracking-widest text-[#00ff66] border border-[#00ff66]/40 hover:border-[#00ff66] px-4 py-2 rounded transition-all duration-300 hover:bg-[#00ff66]/10 hover:shadow-[0_0_15px_rgba(0,255,102,0.3)]"
          >
            JOIN CIPHER
          </button>
        </div>
      </div>
    </header>
  );
};
