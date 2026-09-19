import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons.tsx';

export interface Leader {
  id: string;
  name: string;
  role: string;
  image: string;
  modalImage?: string;
  github: string;
  linkedin: string;
}

interface LeaderModalProps {
  leader: Leader | null;
  onClose: () => void;
}

export const LeaderModal: React.FC<LeaderModalProps> = ({ leader, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!leader) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth || 350);
    let height = (canvas.height = canvas.offsetHeight || 500);

    const chars = "0123456789ABCDEFｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈ";
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops = Array(columns).fill(1);

    let animId: number;

    const render = () => {
      ctx.fillStyle = "rgba(3, 8, 4, 0.2)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "#00ff66";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = Math.random() > 0.8 ? "#ffffff" : "#00ff66";
        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [leader]);

  if (!leader) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md rounded-2xl overflow-hidden border border-[#00ff66] bg-[#051108] p-6 shadow-[0_0_35px_rgba(0,255,102,0.35)]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 border border-[#00ff66]/40 text-[#00ff66] hover:bg-[#00ff66] hover:text-black flex items-center justify-center transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Portrait with Matrix Canvas */}
        <div className="relative w-full h-[380px] sm:h-[420px] rounded-xl overflow-hidden border border-[#00ff66]/20 bg-black flex items-end justify-center mb-6">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" />
          
          <img
            src={leader.modalImage || leader.image}
            alt={leader.name}
            className="relative z-10 max-h-[92%] object-contain filter drop-shadow-[0_0_20px_rgba(0,255,102,0.3)]"
          />
        </div>

        {/* Info */}
        <div className="text-center">
          <div className="font-mono text-xs sm:text-sm tracking-widest text-[#00ff66] font-semibold mb-1 uppercase">
            {leader.role}
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            {leader.name}
          </h3>

          {/* Socials */}
          <div className="flex items-center justify-center gap-4 text-[#88aa90]">
            <a
              href={leader.github}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg border border-[#00ff66]/20 hover:border-[#00ff66] hover:text-[#00ff66] hover:bg-[#00ff66]/10 transition-colors"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
            <a
              href={leader.linkedin}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg border border-[#00ff66]/20 hover:border-[#00ff66] hover:text-[#00ff66] hover:bg-[#00ff66]/10 transition-colors"
            >
              <LinkedinIcon className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
