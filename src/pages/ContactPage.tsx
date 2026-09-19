import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Send, Mail, MessageSquare, User, FileText, CheckCircle,
  UserPlus, ChevronRight, Phone, BookOpen, Cpu, Code2,
} from "lucide-react";

// ─── Contact Form ─────────────────────────────────────────────────────────────
const ContactForm: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill all required fields.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try emailing us directly.");
    }
  };

  if (status === "success")
    return (
      <div className="flex flex-col items-center justify-center min-h-[340px] border border-[#00ff66]/30 rounded-xl bg-[#040c06]/60 p-10 text-center">
        <CheckCircle className="w-12 h-12 text-[#00ff66] mb-4" />
        <h3 className="text-lg font-black tracking-tight text-white mb-2">MESSAGE RECEIVED</h3>
        <p className="text-[#88aa90] text-sm max-w-xs leading-relaxed mb-6">
          The Cipher team will review your message and get back to you.
        </p>
        <button onClick={() => setStatus("idle")}
          className="text-xs font-mono font-bold text-[#00ff66] uppercase tracking-wider border border-[#00ff66]/30 px-5 py-2 rounded hover:bg-[#00ff66]/10 transition-colors">
          Send Another
        </button>
      </div>
    );

  return (
    <form onSubmit={submit} className="border border-[#00ff66]/20 rounded-xl bg-[#040c06]/60 backdrop-blur p-6 md:p-8 space-y-5">
      <div className="text-[10px] text-[#00ff66] tracking-widest uppercase">// SEND_MESSAGE</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10px] text-[#88aa90] tracking-widest uppercase">
            <User className="w-3 h-3" /> Name <span className="text-[#00ff66]">*</span>
          </label>
          <input type="text" name="name" value={form.name} onChange={handle} required
            placeholder="Your name"
            className="w-full bg-[#030804] border border-[#00ff66]/20 rounded-lg text-white text-sm px-4 py-2.5 placeholder-[#88aa90]/40 focus:outline-none focus:border-[#00ff66]/60 transition-colors font-mono" />
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10px] text-[#88aa90] tracking-widest uppercase">
            <Mail className="w-3 h-3" /> Email <span className="text-[#00ff66]">*</span>
          </label>
          <input type="email" name="email" value={form.email} onChange={handle} required
            placeholder="your@email.com"
            className="w-full bg-[#030804] border border-[#00ff66]/20 rounded-lg text-white text-sm px-4 py-2.5 placeholder-[#88aa90]/40 focus:outline-none focus:border-[#00ff66]/60 transition-colors font-mono" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-[10px] text-[#88aa90] tracking-widest uppercase">
          <FileText className="w-3 h-3" /> Subject
        </label>
        <select name="subject" value={form.subject} onChange={handle}
          className="w-full bg-[#030804] border border-[#00ff66]/20 rounded-lg text-white text-sm px-4 py-2.5 focus:outline-none focus:border-[#00ff66]/60 transition-colors font-mono appearance-none">
          <option value="">Select a subject...</option>
          <option value="Collaboration">Collaboration / Partnership</option>
          <option value="Event Inquiry">Event Inquiry</option>
          <option value="Project Idea">Project Idea</option>
          <option value="Sponsorship">Sponsorship</option>
          <option value="General">General / Other</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-[10px] text-[#88aa90] tracking-widest uppercase">
          <MessageSquare className="w-3 h-3" /> Message <span className="text-[#00ff66]">*</span>
        </label>
        <textarea name="message" value={form.message} onChange={handle} required rows={5}
          placeholder="Write your message here..."
          className="w-full bg-[#030804] border border-[#00ff66]/20 rounded-lg text-white text-sm px-4 py-2.5 placeholder-[#88aa90]/40 focus:outline-none focus:border-[#00ff66]/60 transition-colors font-mono resize-none" />
      </div>

      {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

      <button type="submit" disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 bg-[#00ff66] text-[#030804] font-black text-sm tracking-widest uppercase py-3 rounded-lg hover:bg-[#5dfcaa] disabled:opacity-60 transition-colors">
        {status === "loading" ? (
          <span className="animate-pulse">TRANSMITTING...</span>
        ) : (
          <><Send className="w-4 h-4" />SEND MESSAGE</>
        )}
      </button>
    </form>
  );
};

// ─── Join Form ────────────────────────────────────────────────────────────────
const JoinForm: React.FC = () => {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", usn: "",
    semester: "", domain: "", skills: "", reason: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.reason.trim()) {
      setError("Name, email, and reason are required.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/public/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", phone: "", usn: "", semester: "", domain: "", skills: "", reason: "" });
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  };

  if (status === "success")
    return (
      <div className="flex flex-col items-center justify-center min-h-[340px] border border-[#00ff66]/30 rounded-xl bg-[#040c06]/60 p-10 text-center">
        <CheckCircle className="w-12 h-12 text-[#00ff66] mb-4" />
        <h3 className="text-lg font-black tracking-tight text-white mb-2">APPLICATION SUBMITTED</h3>
        <p className="text-[#88aa90] text-sm max-w-xs leading-relaxed mb-6">
          Your application has been received. The council will review it and reach out to you.
        </p>
        <button onClick={() => setStatus("idle")}
          className="text-xs font-mono font-bold text-[#00ff66] uppercase tracking-wider border border-[#00ff66]/30 px-5 py-2 rounded hover:bg-[#00ff66]/10 transition-colors">
          Submit Another
        </button>
      </div>
    );

  return (
    <form onSubmit={submit} className="border border-[#00ff66]/20 rounded-xl bg-[#040c06]/60 backdrop-blur p-6 md:p-8 space-y-5">
      <div className="text-[10px] text-[#00ff66] tracking-widest uppercase">// SUBMIT_APPLICATION</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10px] text-[#88aa90] tracking-widest uppercase">
            <User className="w-3 h-3" /> Full Name <span className="text-[#00ff66]">*</span>
          </label>
          <input type="text" name="name" value={form.name} onChange={handle} required
            placeholder="Your full name"
            className="w-full bg-[#030804] border border-[#00ff66]/20 rounded-lg text-white text-sm px-4 py-2.5 placeholder-[#88aa90]/40 focus:outline-none focus:border-[#00ff66]/60 transition-colors font-mono" />
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10px] text-[#88aa90] tracking-widest uppercase">
            <Mail className="w-3 h-3" /> Email <span className="text-[#00ff66]">*</span>
          </label>
          <input type="email" name="email" value={form.email} onChange={handle} required
            placeholder="your@email.com"
            className="w-full bg-[#030804] border border-[#00ff66]/20 rounded-lg text-white text-sm px-4 py-2.5 placeholder-[#88aa90]/40 focus:outline-none focus:border-[#00ff66]/60 transition-colors font-mono" />
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10px] text-[#88aa90] tracking-widest uppercase">
            <Phone className="w-3 h-3" /> Phone
          </label>
          <input type="tel" name="phone" value={form.phone} onChange={handle}
            placeholder="+91 XXXXXXXXXX"
            className="w-full bg-[#030804] border border-[#00ff66]/20 rounded-lg text-white text-sm px-4 py-2.5 placeholder-[#88aa90]/40 focus:outline-none focus:border-[#00ff66]/60 transition-colors font-mono" />
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10px] text-[#88aa90] tracking-widest uppercase">
            <BookOpen className="w-3 h-3" /> USN
          </label>
          <input type="text" name="usn" value={form.usn} onChange={handle}
            placeholder="4JC22CS000"
            className="w-full bg-[#030804] border border-[#00ff66]/20 rounded-lg text-white text-sm px-4 py-2.5 placeholder-[#88aa90]/40 focus:outline-none focus:border-[#00ff66]/60 transition-colors font-mono" />
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10px] text-[#88aa90] tracking-widest uppercase">
            <Cpu className="w-3 h-3" /> Semester
          </label>
          <select name="semester" value={form.semester} onChange={handle}
            className="w-full bg-[#030804] border border-[#00ff66]/20 rounded-lg text-white text-sm px-4 py-2.5 focus:outline-none focus:border-[#00ff66]/60 transition-colors font-mono appearance-none">
            <option value="">Select semester...</option>
            {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map((s) => (
              <option key={s} value={s}>{s} Semester</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[10px] text-[#88aa90] tracking-widest uppercase">
            <Code2 className="w-3 h-3" /> Domain of Interest
          </label>
          <select name="domain" value={form.domain} onChange={handle}
            className="w-full bg-[#030804] border border-[#00ff66]/20 rounded-lg text-white text-sm px-4 py-2.5 focus:outline-none focus:border-[#00ff66]/60 transition-colors font-mono appearance-none">
            <option value="">Select domain...</option>
            <option value="Technical">Technical / Development</option>
            <option value="Design">Design / Creative</option>
            <option value="Media">Media / Documentation</option>
            <option value="Events">Events / Management</option>
            <option value="Open">Open to Anything</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-[10px] text-[#88aa90] tracking-widest uppercase">
          <Code2 className="w-3 h-3" /> Skills / Experience
        </label>
        <input type="text" name="skills" value={form.skills} onChange={handle}
          placeholder="e.g. React, Python, UI Design, Video Editing..."
          className="w-full bg-[#030804] border border-[#00ff66]/20 rounded-lg text-white text-sm px-4 py-2.5 placeholder-[#88aa90]/40 focus:outline-none focus:border-[#00ff66]/60 transition-colors font-mono" />
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-[10px] text-[#88aa90] tracking-widest uppercase">
          <MessageSquare className="w-3 h-3" /> Why do you want to join Cipher? <span className="text-[#00ff66]">*</span>
        </label>
        <textarea name="reason" value={form.reason} onChange={handle} required rows={4}
          placeholder="Tell us what drives you and what you want to build with Cipher..."
          className="w-full bg-[#030804] border border-[#00ff66]/20 rounded-lg text-white text-sm px-4 py-2.5 placeholder-[#88aa90]/40 focus:outline-none focus:border-[#00ff66]/60 transition-colors font-mono resize-none" />
      </div>

      {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

      <button type="submit" disabled={status === "loading"}
        className="w-full flex items-center justify-center gap-2 bg-[#00ff66] text-[#030804] font-black text-sm tracking-widest uppercase py-3 rounded-lg hover:bg-[#5dfcaa] disabled:opacity-60 transition-colors">
        {status === "loading" ? (
          <span className="animate-pulse">SUBMITTING...</span>
        ) : (
          <><UserPlus className="w-4 h-4" />APPLY TO JOIN</>
        )}
      </button>
    </form>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
type Tab = "join" | "contact";

export const ContactPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>("join");

  return (
    <main className="min-h-screen bg-[#030804] text-white font-mono pt-24 pb-20 px-4">
      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#00ff66]/30 bg-[#00ff66]/5 text-[#00ff66] text-[10px] tracking-widest uppercase mb-6">
          <MessageSquare className="w-3 h-3" />
          JOIN &amp; CONTACT
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4 leading-tight">
          BE PART OF<br />
          <span className="text-[#00ff66]">SOMETHING BIGGER.</span>
        </h1>
        <p className="text-[#88aa90] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Join the Cipher community or reach out to us — whether you are a student ready to build, a collaborator with an idea, or simply curious.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex rounded-xl border border-[#00ff66]/20 overflow-hidden bg-[#040c06]/60 p-1 gap-1">
          <button onClick={() => setTab("join")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition-all ${tab === "join" ? "bg-[#00ff66] text-[#030804]" : "text-[#88aa90] hover:text-white"}`}>
            <UserPlus className="w-3.5 h-3.5" /> Join Cipher
          </button>
          <button onClick={() => setTab("contact")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-mono font-bold uppercase tracking-widest transition-all ${tab === "contact" ? "bg-[#00ff66] text-[#030804]" : "text-[#88aa90] hover:text-white"}`}>
            <Mail className="w-3.5 h-3.5" /> Contact Us
          </button>
        </div>
      </div>

      {/* Form Area */}
      <div className="max-w-2xl mx-auto">
        {tab === "join" ? (
          <div className="space-y-4">
            {/* Info strip */}
            <div className="border border-[#00ff66]/10 rounded-xl p-4 bg-[#040c06]/40 text-[#88aa90] text-xs leading-relaxed">
              Applications are reviewed by the Cipher council. Shortlisted candidates will be contacted via email.
              <span className="text-[#00ff66] ml-1">All backgrounds welcome.</span>
            </div>
            <JoinForm />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Direct email */}
            <div className="border border-[#00ff66]/20 rounded-xl p-4 bg-[#040c06]/60 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-[#88aa90] tracking-widest uppercase mb-1">Direct Email</div>
                <a href="mailto:cipher@sjec.ac.in" className="text-[#00ff66] font-bold text-sm hover:underline">
                  cipher@sjec.ac.in
                </a>
              </div>
              <div className="text-[#88aa90] text-xs text-right">
                Replies within<br /><span className="text-white font-bold">24-48 hrs</span>
              </div>
            </div>
            <ContactForm />
          </div>
        )}
      </div>
    </main>
  );
};
