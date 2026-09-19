import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Lock, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message || "Invalid administrator credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-[#020703] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Matrix/Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,102,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#00ff66]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#00ff66]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-[#040e06]/90 backdrop-blur-xl border border-[#00ff66]/30 rounded-2xl p-8 shadow-[0_0_50px_rgba(0,255,102,0.15)]">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#00ff66]/10 border border-[#00ff66]/40 mx-auto flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,255,102,0.2)]">
              <img src="/assets/logo.png" alt="Cipher Logo" className="w-10 h-10 object-contain" />
            </div>
            <h1 className="font-mono text-2xl font-bold tracking-wider text-white">
              CIPHER <span className="text-[#00ff66] text-glow">ADMIN</span>
            </h1>
            <p className="font-mono text-xs text-[#88aa90] mt-1">
              Authorized personnel credentials required
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-3.5 rounded-lg bg-red-950/60 border border-red-500/50 flex items-center gap-3 text-red-200 text-xs font-mono animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-mono text-xs text-[#00ff66] uppercase tracking-wider mb-2">
                Administrator Email
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-[#88aa90] absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cipher.sjec.ac.in"
                  required
                  autoComplete="email"
                  className="w-full bg-[#020603] border border-[#00ff66]/30 focus:border-[#00ff66] rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00ff66]/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-[#00ff66] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-[#88aa90] absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#020603] border border-[#00ff66]/30 focus:border-[#00ff66] rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-[#00ff66]/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00ff66] hover:bg-[#00e65b] text-[#030804] font-mono font-bold text-sm tracking-widest py-3.5 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(0,255,102,0.4)] hover:shadow-[0_0_30px_rgba(0,255,102,0.7)] flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.01]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  ENTER CONSOLE <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 pt-5 border-t border-[#00ff66]/15 text-center">
            <div className="flex items-center justify-center gap-2 font-mono text-[11px] text-[#88aa90]">
              <Shield className="w-3.5 h-3.5 text-[#00ff66]" />
              <span>Protected by Rate Limiting &amp; Session Tokens</span>
            </div>
            <a
              href="/"
              className="inline-block mt-3 font-mono text-xs text-[#00ff66]/80 hover:text-[#00ff66] transition-colors"
            >
              &larr; Back to Public Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};