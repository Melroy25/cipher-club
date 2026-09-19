import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Send, Mail, MessageSquare, User, FileText, CheckCircle, UserPlus, ChevronRight } from "lucide-react";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send message.");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or email us directly.");
    }
  };

  return (
    <main className="min-h-screen bg-[#030804] text-white font-mono pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-[#00ff66]/30 bg-[#00ff66]/5 text-[#00ff66] text-[10px] tracking-widest uppercase mb-6">
          <MessageSquare className="w-3 h-3" />
          REACH OUT
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4 leading-tight">
          GOT AN IDEA?
          <br />
          <span className="text-[#00ff66]">LET`S BUILD IT.</span>
        </h1>
        <p className="text-[#88aa90] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Whether you have a collaboration proposal, a technical question, or just want to connect with the Cipher team — we are all ears. Drop a message and we will get back to you.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-[#00ff66]/20 rounded-lg p-5 bg-[#040c06]/60 backdrop-blur">
            <div className="flex items-center gap-2 text-[#00ff66] text-xs tracking-widest uppercase mb-3">
              <Mail className="w-3.5 h-3.5" />
              DIRECT EMAIL
            </div>
            <a href="mailto:cipher@sjec.ac.in" className="text-white font-bold text-sm hover:text-[#00ff66] transition-colors break-all">
              cipher@sjec.ac.in
            </a>
            <p className="text-[#88aa90] text-xs mt-2 leading-relaxed">
              For urgent matters, project proposals, or collaborations — email us directly.
            </p>
          </div>

          <div className="border border-[#00ff66]/10 rounded-lg p-5 bg-[#040c06]/40">
            <p className="text-[#88aa90] text-xs leading-relaxed">
              <span className="text-[#00ff66] font-bold">Response time:</span> We typically reply within 24-48 hours. Messages submitted through the form are routed directly to the Cipher team.
            </p>
          </div>

          <div className="border border-[#00ff66]/30 rounded-lg p-5 bg-[#00ff66]/5 relative overflow-hidden group">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#00ff66]/5 rounded-full blur-xl group-hover:bg-[#00ff66]/10 transition-colors duration-500" />
            <div className="flex items-center gap-2 text-[#00ff66] text-xs tracking-widest uppercase mb-2">
              <UserPlus className="w-3.5 h-3.5" />
              WANT TO JOIN US?
            </div>
            <p className="text-[#88aa90] text-xs mb-4 leading-relaxed">
              Interested in becoming a Cipher member? Applications are reviewed by our team.
            </p>
            <Link to="/" className="inline-flex items-center gap-1.5 text-[#00ff66] text-xs font-bold uppercase tracking-wider hover:underline">
              Apply to Join <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="border border-[#00ff66]/10 rounded-lg p-5 bg-[#040c06]/40">
            <p className="text-[#88aa90] text-xs leading-relaxed">
              Want to see who has contributed to our events?{" "}
              <Link to="/contributors" className="text-[#00ff66] hover:underline">View Contributors</Link>
            </p>
          </div>
        </div>

        <div className="lg:col-span-3">
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] border border-[#00ff66]/30 rounded-lg bg-[#040c06]/60 p-10 text-center">
              <CheckCircle className="w-12 h-12 text-[#00ff66] mb-4" />
              <h2 className="text-xl font-black tracking-tight text-white mb-2">MESSAGE RECEIVED</h2>
              <p className="text-[#88aa90] text-sm max-w-xs leading-relaxed mb-6">
                Thanks for reaching out. The Cipher team will review your message and get back to you shortly.
              </p>
              <button onClick={() => setStatus("idle")} className="text-xs font-mono font-bold text-[#00ff66] uppercase tracking-wider border border-[#00ff66]/30 px-5 py-2 rounded hover:bg-[#00ff66]/10 transition-colors">
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="border border-[#00ff66]/20 rounded-lg bg-[#040c06]/60 backdrop-blur p-6 md:p-8 space-y-5">
              <div className="text-[10px] text-[#00ff66] tracking-widest uppercase mb-2">// COMPOSE_MESSAGE</div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[10px] text-[#88aa90] tracking-widest uppercase">
                  <User className="w-3 h-3" /> Name <span className="text-[#00ff66]">*</span>
                </label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Your full name"
                  className="w-full bg-[#030804] border border-[#00ff66]/20 rounded text-white text-sm px-4 py-2.5 placeholder-[#88aa90]/50 focus:outline-none focus:border-[#00ff66]/60 transition-colors font-mono" />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[10px] text-[#88aa90] tracking-widest uppercase">
                  <Mail className="w-3 h-3" /> Email <span className="text-[#00ff66]">*</span>
                </label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="your@email.com"
                  className="w-full bg-[#030804] border border-[#00ff66]/20 rounded text-white text-sm px-4 py-2.5 placeholder-[#88aa90]/50 focus:outline-none focus:border-[#00ff66]/60 transition-colors font-mono" />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[10px] text-[#88aa90] tracking-widest uppercase">
                  <FileText className="w-3 h-3" /> Subject
                </label>
                <select name="subject" value={form.subject} onChange={handleChange}
                  className="w-full bg-[#030804] border border-[#00ff66]/20 rounded text-white text-sm px-4 py-2.5 focus:outline-none focus:border-[#00ff66]/60 transition-colors font-mono appearance-none">
                  <option value="">Select a subject...</option>
                  <option value="Collaboration">Collaboration / Partnership</option>
                  <option value="Event Inquiry">Event Inquiry</option>
                  <option value="Project Idea">Project Idea</option>
                  <option value="Sponsorship">Sponsorship</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="General">General / Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[10px] text-[#88aa90] tracking-widest uppercase">
                  <MessageSquare className="w-3 h-3" /> Message <span className="text-[#00ff66]">*</span>
                </label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Write your message here..."
                  className="w-full bg-[#030804] border border-[#00ff66]/20 rounded text-white text-sm px-4 py-2.5 placeholder-[#88aa90]/50 focus:outline-none focus:border-[#00ff66]/60 transition-colors font-mono resize-none" />
              </div>

              {errorMsg && <p className="text-red-400 text-xs font-mono">{errorMsg}</p>}

              <button type="submit" disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 bg-[#00ff66] text-[#030804] font-black text-sm tracking-widest uppercase py-3 rounded hover:bg-[#5dfcaa] disabled:opacity-60 transition-colors">
                {status === "loading" ? (
                  <><span className="animate-pulse">TRANSMITTING</span><span className="animate-ping w-1.5 h-1.5 rounded-full bg-[#030804]" /></>
                ) : (
                  <><Send className="w-4 h-4" />SEND MESSAGE</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
};
