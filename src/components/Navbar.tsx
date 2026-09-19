import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.tsx";
import { Menu, X } from "lucide-react";

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
    { name: "ABOUT", path: "/about" },
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
      {/* Outer Floating Bar — Sleek Thin Rectangle with contained shimmer border */}
      <div
        className={`fixed top-3 md:top-4 left-1/2 -translate-x-1/2 z-50 w-[96%] md:w-[92%] lg:w-[90%] max-w-6xl rounded-lg transition-all duration-300 ${
          scrolled
            ? "shadow-[0_8px_32px_rgba(0,255,102,0.25)] scale-[0.99]"
            : "shadow-[0_4px_24px_rgba(0,0,0,0.7)]"
        }`}
        style={{ isolation: "isolate" }}
      >
        {/* Shimmer border layer — strictly behind everything, never bleeds over text */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none"
          style={{ zIndex: 0 }}
        >
          <div className="cyber-shimmer-bg absolute inset-0 rounded-lg" />
        </div>

        {/* 1.5px inset mask to show only a thin border line from the shimmer */}
        <div
          className="absolute inset-[1.5px] rounded-[6px] bg-[#030804] pointer-events-none"
          style={{ zIndex: 1 }}
        />

        {/* Inner Glassmorphic Header */}
        <header
          className="relative w-full rounded-[6px] backdrop-blur-xl bg-[#030804]/92 dark:bg-[#030804]/92 transition-colors"
          style={{ zIndex: 2 }}
        >
          {/* Cyber Corner Reticles */}
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

            {/* Center: Nav Buttons */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 font-mono text-xs tracking-widest text-[#88aa90]">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`corner-link uppercase py-1 px-2.5 ${
                    isActive(link.path)
                      ? "active text-[#00ff66] font-bold"
                      : "hover:text-[#00ff66]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right: Mobile Menu Toggle only (theme toggle moved to mobile menu & footer) */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
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
