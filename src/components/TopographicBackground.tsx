import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';

export const TopographicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    let t = 0;
    const lines = 110; // Increased number of contour threads across the screen

    const draw = () => {
      const isDark = themeRef.current === 'dark';
      ctx.fillStyle = isDark ? '#030804' : '#ffffff';
      ctx.fillRect(0, 0, width, height);

      t += 0.003;

      for (let i = 0; i < lines; i++) {
        const lineFraction = i / lines;
        const baseY = height * 0.05 + lineFraction * height * 0.95;
        
        ctx.beginPath();
        if (isDark) {
          ctx.strokeStyle = `rgba(0, 255, 102, ${0.18 + (i % 3 === 0 ? 0.18 : 0.08)})`;
        } else {
          ctx.strokeStyle = `rgba(5, 150, 105, ${0.20 + (i % 3 === 0 ? 0.18 : 0.09)})`;
        }
        ctx.lineWidth = i % 4 === 0 ? 2.2 : (i % 2 === 0 ? 1.6 : 1.2);

        for (let x = 0; x <= width; x += 10) {
          const nx = x / width;
          // Harmonic wave simulation mimicking Perlin elevation contours
          const wave1 = Math.sin(nx * 4.5 + t + i * 0.15) * 45;
          const wave2 = Math.cos(nx * 2.2 - t * 0.8 + i * 0.25) * 35;
          const wave3 = Math.sin((nx * 7.0) + (i * 0.08) + t * 1.5) * 20;
          
          // Mountainous crest in upper-center & lower sides
          const centerWeight = Math.exp(-Math.pow((nx - 0.45) * 2.8, 2));
          const elevation = (wave1 + wave2 + wave3) * (0.8 + centerWeight * 1.8);

          const y = baseY + elevation;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 1 }}
    />
  );
};
