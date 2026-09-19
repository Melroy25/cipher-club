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
      {/* Outer Floating Bar with Cyber Rotating Shimmer */}
      <div
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-[85%] max-w-5xl rounded-2xl p-[2px] overflow-hidden cyber-shimmer-bg transition-all duration-300 ${
          scrolled
            ? "shadow-[0_8px_32px_rgba(0,255,102,0.2)] scale-[0.98]"
            : "shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
        }`}
      >
        {/* Glow halo behind header */}
        <div className="absolute inset-0 cyber-shimmer-glow opacity-30 blur-md pointer-events-none" />

        {/* Inner Glassmorphic Header */}
        <header className="w-full rounded-[14px] backdrop-blur-xl bg-[#030804]/90 dark:bg-[#030804]/90 border border-[#00ff66]/25 transition-colors">
          <div className="flex items-center justify-between px-5 md:px-7 py-3">
            {/* Left: Dynamic Club Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={logoUrl}
                alt="Cipher Logo"
                className="h-8 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_10px_rgba(0,255,102,0.5)]"
                onError={() => setLogoUrl("/assets/logo.png")}
              />
              <span className="font-mono text-xs tracking-wider text-[#00ff66] hidden sm:inline-block font-bold">
                CIPHER
              </span>
            </Link>

            {/* Center: Nav Buttons with High-Tech Corner Brackets */}
            <nav className="hidden md:flex items-center space-x-2 lg:space-x-4 font-mono text-xs lg:text-sm tracking-widest text-[#88aa90]">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`corner-link uppercase ${
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
            <div className="flex items-center gap-3">
              {/* Sliding Pill Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle dark/light theme"
                className="group relative w-16 h-8 rounded-full bg-[#051408] border border-[#00ff66]/30 backdrop-blur-xl transition-all duration-300 flex items-center p-1 overflow-hidden hover:border-[#00ff66] focus:outline-none"
              >
                {/* Sun & Moon Icons inside */}
                <div className="relative z-10 flex w-full justify-between items-center px-1 pointer-events-none text-xs">
                  <Sun
                    className={`w-3.5 h-3.5 transition-colors ${
                      theme === "light"
                        ? "text-yellow-400 font-bold"
                        : "text-[#88aa90] group-hover:text-yellow-400"
                    }`}
                  />
                  <Moon
                    className={`w-3.5 h-3.5 transition-colors ${
                      theme === "dark"
                        ? "text-[#00ff66] font-bold"
                        : "text-[#88aa90] group-hover:text-[#00ff66]"
                    }`}
                  />
                </div>

                {/* Sliding Indicator Knob */}
                <div
                  className={`absolute top-1 w-6 h-6 rounded-full bg-[#00ff66] shadow-[0_0_12px_rgba(0,255,102,0.8)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    theme === "dark" ? "translate-x-8" : "translate-x-0"
                  }`}
                />
              </button>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                className="md:hidden p-2 rounded-lg text-[#00ff66] hover:bg-[#00ff66]/10 border border-[#00ff66]/20 transition-colors focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
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
