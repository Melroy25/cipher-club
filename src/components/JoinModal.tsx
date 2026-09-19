import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-[#00ff66]/40 bg-[#051008] p-7 sm:p-9 shadow-[0_0_40px_rgba(0,255,102,0.25)]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg border border-[#00ff66]/30 text-[#00ff66] hover:bg-[#00ff66] hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="font-mono text-xs tracking-widest text-[#00ff66] mb-2">
          // ACCESS REQUEST
        </div>

        <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2 text-glow">
          Join CIPHER
        </h3>

        <p className="font-mono text-sm text-[#a0c0a8] mb-8">
          Send us a message and we'll get back to you.
        </p>

        {submitted ? (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
            <CheckCircle2 className="w-14 h-14 text-[#00ff66] animate-bounce" />
            <div className="font-mono text-lg text-[#00ff66] text-glow">
              &gt; Transmission received. Welcome to CIPHER.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-mono text-xs tracking-wider text-[#00ff66] mb-2 uppercase">
                NAME
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-[#00ff66]/25 focus:border-[#00ff66] text-white font-mono text-sm placeholder-[#44664e] outline-none focus:ring-1 focus:ring-[#00ff66] transition-colors"
              />
            </div>

            <div>
              <label className="block font-mono text-xs tracking-wider text-[#00ff66] mb-2 uppercase">
                EMAIL
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-[#00ff66]/25 focus:border-[#00ff66] text-white font-mono text-sm placeholder-[#44664e] outline-none focus:ring-1 focus:ring-[#00ff66] transition-colors"
              />
            </div>

            <div>
              <label className="block font-mono text-xs tracking-wider text-[#00ff66] mb-2 uppercase">
                MESSAGE
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us why you'd like to join..."
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-[#00ff66]/25 focus:border-[#00ff66] text-white font-mono text-sm placeholder-[#44664e] outline-none focus:ring-1 focus:ring-[#00ff66] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#00ff66] hover:bg-[#00e65b] text-[#030804] font-mono font-bold text-sm tracking-widest py-4 rounded-lg shadow-[0_0_20px_rgba(0,255,102,0.4)] hover:shadow-[0_0_30px_rgba(0,255,102,0.7)] transition-all"
            >
              SEND &rarr;
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
