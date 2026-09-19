import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.tsx";
import { Sun, Moon, Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("/assets/logo.png");
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Fetch dynamic logo from SiteContent
  useEffect(() => {
    fetch("/api/public/content")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data) {
          const logoItem = data.data.find(
            (item: { key: string; value: string }) => item.key === "site_logo_url"
          );
          if (logoItem && logoItem.value) {
            setLogoUrl(logoItem.value);
          }
        }
      })
      .catch(() => {
        // Fallback silently to default logo
      });
  }, []);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "BLOG", path: "/blog" },
    { name: "TEAM", path: "/team" },
    { name: "EVENTS", path: "/events" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Outer Floating Bar with Cyber Rotating Shimmer - Sleek Thin Rectangle */}
      <div
        className={`fixed top-3 md:top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] md:w-[92%] lg:w-[90%] max-w-6xl rounded-lg p-[1.5px] overflow-hidden cyber-shimmer-bg transition-all duration-300 ${
          scrolled
            ? "shadow-[0_8px_32px_rgba(0,255,102,0.25)] scale-[0.99]"
            : "shadow-[0_4px_24px_rgba(0,0,0,0.7)]"
        }`}
      >
        {/* Glow halo behind header */}
        <div className="absolute inset-0 cyber-shimmer-glow opacity-30 blur-md pointer-events-none" />

        {/* Inner Glassmorphic Header with Sleek Rectangular Shape and Subtle Cyber Corner Marks */}
        <header className="relative w-full rounded-[6px] backdrop-blur-xl bg-[#030804]/92 dark:bg-[#030804]/92 border border-[#00ff66]/25 transition-colors">
          {/* Subtle Cyber Corner Reticles for High-Tech Rectangular HUD Aesthetic */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#00ff66]/60 pointer-events-none" />
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-[#00ff66]/60 pointer-events-none" />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-[#00ff66]/60 pointer-events-none" />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#00ff66]/60 pointer-events-none" />

          <div className="flex items-center justify-between px-4 md:px-6 py-1.5 md:py-2">
            {/* Left: Dynamic Club Logo & Name */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <img
                src={logoUrl}
                alt="Cipher Logo"
                className="h-7 md:h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_8px_rgba(0,255,102,0.5)]"
                onError={() => setLogoUrl("/assets/logo.png")}
              />
              <span className="font-mono text-xs tracking-wider text-[#00ff66] hidden sm:inline-block font-bold">
                CIPHER
              </span>
            </Link>

            {/* Center: Nav Buttons with High-Tech Corner Brackets */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-3 font-mono text-xs tracking-widest text-[#88aa90]">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`corner-link uppercase py-1 px-3 ${
                    isActive(link.path)
                      ? "active text-[#00ff66] font-bold"
                      : "hover:text-[#00ff66]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right: Dark / Light Mode Switch & Mobile Menu Toggle */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              {/* Sliding Rectangular Cyber Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle dark/light theme"
                className="group relative w-14 h-7 rounded-md bg-[#051408] border border-[#00ff66]/30 backdrop-blur-xl transition-all duration-300 flex items-center p-0.5 overflow-hidden hover:border-[#00ff66] focus:outline-none"
              >
                {/* Sun & Moon Icons inside */}
                <div className="relative z-10 flex w-full justify-between items-center px-1.5 pointer-events-none text-xs">
                  <Sun
                    className={`w-3 h-3 transition-colors ${
                      theme === "light"
                        ? "text-yellow-400 font-bold"
                        : "text-[#88aa90] group-hover:text-yellow-400"
                    }`}
                  />
                  <Moon
                    className={`w-3 h-3 transition-colors ${
                      theme === "dark"
                        ? "text-[#00ff66] font-bold"
                        : "text-[#88aa90] group-hover:text-[#00ff66]"
                    }`}
                  />
                </div>

                {/* Sliding Indicator Knob - sleek rounded-sm */}
                <div
                  className={`absolute top-0.5 w-6 h-5.5 rounded-sm bg-[#00ff66] shadow-[0_0_10px_rgba(0,255,102,0.8)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    theme === "dark" ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </button>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                className="md:hidden p-1.5 rounded-md text-[#00ff66] hover:bg-[#00ff66]/10 border border-[#00ff66]/20 transition-colors focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Floating Dropdown Menu */}
      {mobileMenuOpen && (
        <nav
          className="fixed md:hidden top-[5.5rem] left-1/2 -translate-x-1/2 w-[92%] max-w-sm rounded-2xl
          bg-[#030804]/95 backdrop-blur-2xl text-white font-mono shadow-[0_10px_35px_rgba(0,0,0,0.8)]
          border border-[#00ff66]/40 p-5 space-y-4 z-50 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`corner-link w-full text-center py-2.5 rounded-lg text-sm tracking-wider uppercase ${
                  isActive(link.path)
                    ? "active bg-[#00ff66]/10 text-[#00ff66] font-bold border border-[#00ff66]/30"
                    : "text-[#88aa90] hover:text-[#00ff66]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-[#00ff66]/20 flex items-center justify-between">
            <span className="text-xs text-[#88aa90]">Theme Mode:</span>
            <button
              onClick={toggleTheme}
              className="text-xs font-mono font-bold text-[#00ff66] uppercase hover:underline"
            >
              Switch to {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </nav>
      )}
    </>
  );
};
