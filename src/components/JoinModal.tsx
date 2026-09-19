import React, { useState } from "react";
import { X, CheckCircle2, Loader2, Sparkles, Send, Shield } from "lucide-react";

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DOMAINS = ["Technical & Web", "AI & Machine Learning", "Design & Media", "Events & Logistics", "Open Source & Competitive Coding"];

export const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    usn: "",
    semester: "3rd Sem (2nd Year)",
    domain: "Technical & Web",
    reason: "",
    skills: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/public/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            usn: "",
            semester: "3rd Sem (2nd Year)",
            domain: "Technical & Web",
            reason: "",
            skills: "",
          });
          onClose();
        }, 2800);
      } else {
        setErrorMessage(data.error || "Failed to submit application");
      }
    } catch {
      setErrorMessage("Network connection error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key: keyof typeof formData, val: string) =>
    setFormData((f) => ({ ...f, [key]: val }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#00ff66]/40 bg-[#040e06] p-6 sm:p-8 shadow-[0_0_50px_rgba(0,255,102,0.3)] scrollbar-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg border border-[#00ff66]/30 text-[#00ff66] hover:bg-[#00ff66] hover:text-black transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/30 font-mono text-[10px] tracking-widest text-[#00ff66] mb-3 uppercase">
          <Shield className="w-3 h-3" />
          <span>Membership Protocol</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-mono font-bold text-white mb-2 tracking-tight">
          Join <span className="text-[#00ff66] text-glow">CIPHER</span>
        </h3>

        <p className="font-mono text-xs text-[#88aa90] mb-6 leading-relaxed">
          Submit your application to the Cipher Student Association. The executive council reviews submissions for workshop leads, event organizers, and technical cohorts.
        </p>

        {submitted ? (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-[#00ff66]/20 border border-[#00ff66] flex items-center justify-center text-[#00ff66] shadow-[0_0_25px_rgba(0,255,102,0.5)]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="font-mono text-base font-bold text-white">
              Transmission Received
            </div>
            <p className="font-mono text-xs text-[#a0c0a8] max-w-sm">
              Your application has been logged into the Cipher database. The council will reach out to you via email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-mono">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#00ff66] mb-1.5 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => field("name", e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-[#00ff66]/25 focus:border-[#00ff66] text-white text-xs placeholder-[#44664e] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-[#00ff66] mb-1.5 uppercase tracking-wider">
                  College / Personal Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => field("email", e.target.value)}
                  placeholder="student@sjec.ac.in"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-[#00ff66]/25 focus:border-[#00ff66] text-white text-xs placeholder-[#44664e] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Phone + USN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#00ff66] mb-1.5 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => field("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-[#00ff66]/25 focus:border-[#00ff66] text-white text-xs placeholder-[#44664e] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-[#00ff66] mb-1.5 uppercase tracking-wider">
                  USN (College ID)
                </label>
                <input
                  type="text"
                  value={formData.usn}
                  onChange={(e) => field("usn", e.target.value)}
                  placeholder="4SO23CS..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-[#00ff66]/25 focus:border-[#00ff66] text-white text-xs placeholder-[#44664e] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Semester + Domain Interest */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#00ff66] mb-1.5 uppercase tracking-wider">
                  Semester / Year
                </label>
                <select
                  value={formData.semester}
                  onChange={(e) => field("semester", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#020703] border border-[#00ff66]/25 focus:border-[#00ff66] text-white text-xs outline-none transition-colors"
                >
                  <option>1st Sem (1st Year)</option>
                  <option>2nd Sem (1st Year)</option>
                  <option>3rd Sem (2nd Year)</option>
                  <option>4th Sem (2nd Year)</option>
                  <option>5th Sem (3rd Year)</option>
                  <option>6th Sem (3rd Year)</option>
                  <option>7th Sem (4th Year)</option>
                  <option>8th Sem (4th Year)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#00ff66] mb-1.5 uppercase tracking-wider">
                  Domain Preference
                </label>
                <select
                  value={formData.domain}
                  onChange={(e) => field("domain", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#020703] border border-[#00ff66]/25 focus:border-[#00ff66] text-white text-xs outline-none transition-colors"
                >
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Skills / Background */}
            <div>
              <label className="block text-xs text-[#00ff66] mb-1.5 uppercase tracking-wider">
                Tech Stack / Experience / Interests
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => field("skills", e.target.value)}
                placeholder="e.g. Python, React, UI/UX, Video Editing, Event Organizing..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-[#00ff66]/25 focus:border-[#00ff66] text-white text-xs placeholder-[#44664e] outline-none transition-colors"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs text-[#00ff66] mb-1.5 uppercase tracking-wider">
                Why do you want to join CIPHER? *
              </label>
              <textarea
                rows={3}
                required
                value={formData.reason}
                onChange={(e) => field("reason", e.target.value)}
                placeholder="Tell us what you'd like to build, learn, or contribute to the club..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-[#00ff66]/25 focus:border-[#00ff66] text-white text-xs placeholder-[#44664e] outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 bg-[#00ff66] hover:bg-[#00e65b] text-[#030804] font-mono font-bold text-xs tracking-widest py-3.5 rounded-lg shadow-[0_0_20px_rgba(0,255,102,0.4)] hover:shadow-[0_0_30px_rgba(0,255,102,0.7)] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>TRANSMITTING DATA...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT APPLICATION &rarr;</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
