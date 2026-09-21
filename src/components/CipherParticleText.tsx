import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  ease: number;
  friction: number;
  char: string;
  size: number;
  color: string;
  ambientPhase: number;
  ambientSpeed: number;
  isBright: boolean;
}

const MATRIX_CHARS = 'CIPHER0123456789#%*+=:;.-_@&/<>[]';

export const CipherParticleText: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Track mouse / pointer position
    const mouse = {
      x: -9999,
      y: -9999,
      radius: 95,
      isActive: false,
    };

    // Color palettes for dark and light modes
    const getColors = (isDark: boolean) => {
      if (isDark) {
        return {
          primary: ['#00ff66', '#00ff66', '#00e65b', '#10b981'],
          dim: ['#00bb44', '#009933', '#047857'],
          bright: ['#ffffff', '#b4ffd0', '#70ff9e'],
        };
      } else {
        return {
          primary: ['#059669', '#047857', '#065f46'],
          dim: ['#0f766e', '#115e59', '#134e4a'],
          bright: ['#10b981', '#34d399', '#059669'],
        };
      }
    };

    // Init & sample typography pixels to build particles
    const initParticles = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      if (width <= 0) return;

      // Adjust height based on screen width
      const height = width < 640 ? 110 : width < 1024 ? 140 : 170;

      canvas.width = width;
      canvas.height = height;

      // Dynamic mouse radius based on canvas dimensions
      mouse.radius = Math.min(Math.max(width * 0.11, 80), 120);

      // Offscreen canvas for rasterizing text and sampling coordinates
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      // Calculate font size & spacing for "CIPHER"
      const isMobile = width < 640;
      const fontSize = Math.floor(
        Math.min(width / (isMobile ? 6.6 : 7.2), height * 0.85)
      );

      offCtx.font = `900 ${fontSize}px "Space Grotesk", "JetBrains Mono", sans-serif`;
      offCtx.fillStyle = '#ffffff';
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';

      const letters = ['C', 'I', 'P', 'H', 'E', 'R'];
      const totalLetters = letters.length;
      
      // Calculate letter spacing so CIPHER fills wide and evenly
      const totalSpan = Math.min(width * 0.94, 1150);
      const letterSpacing = totalSpan / totalLetters;
      const startX = (width - (totalLetters - 1) * letterSpacing) / 2;
      const centerY = height / 2;

      letters.forEach((letter, i) => {
        offCtx.fillText(letter, startX + i * letterSpacing, centerY);
      });

      // Sample pixels
      const imgData = offCtx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const step = isMobile ? 6 : 5; // grid density
      const isDark = themeRef.current === 'dark';
      const colors = getColors(isDark);

      const newParticles: Particle[] = [];

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3];

          if (alpha > 100) {
            // Select color shade & highlight status
            const rand = Math.random();
            let color = colors.primary[Math.floor(Math.random() * colors.primary.length)];
            let isBright = false;

            if (rand > 0.88) {
              color = colors.bright[Math.floor(Math.random() * colors.bright.length)];
              isBright = true;
            } else if (rand < 0.22) {
              color = colors.dim[Math.floor(Math.random() * colors.dim.length)];
            }

            const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
            const particleSize = isMobile ? 8 : (isBright ? 10 : 9);

            newParticles.push({
              x: x + (Math.random() - 0.5) * 4,
              y: y + (Math.random() - 0.5) * 4,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              ease: 0.045 + Math.random() * 0.035, // spring return ease
              friction: 0.90 + Math.random() * 0.03, // dampening
              char,
              size: particleSize,
              color,
              ambientPhase: Math.random() * Math.PI * 2,
              ambientSpeed: 0.015 + Math.random() * 0.02,
              isBright,
            });
          }
        }
      }

      particles = newParticles;
    };

    // Ensure fonts are loaded before initial sampling
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        initParticles();
      });
    } else {
      initParticles();
    }

    // Mouse & Pointer Position Handlers
    const handleWindowMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const isInside = (
        e.clientX >= rect.left - 40 &&
        e.clientX <= rect.right + 40 &&
        e.clientY >= rect.top - 30 &&
        e.clientY <= rect.bottom + 30
      );

      if (isInside) {
        mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
        mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
        mouse.isActive = true;
      } else if (mouse.isActive) {
        mouse.isActive = false;
        mouse.x = -9999;
        mouse.y = -9999;
      }
    };

    const handleMouseLeave = () => {
      mouse.isActive = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        mouse.x = (touch.clientX - rect.left) * (canvas.width / rect.width);
        mouse.y = (touch.clientY - rect.top) * (canvas.height / rect.height);
        mouse.isActive = true;
      }
    };

    const handleTouchEnd = () => {
      handleMouseLeave();
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleMouseLeave);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchcancel', handleTouchEnd);

    // Resize Observer for responsive scaling
    const resizeObserver = new ResizeObserver(() => {
      initParticles();
    });
    resizeObserver.observe(container);

    // Animation Render Loop
    let time = 0;

    const render = () => {
      time += 1;
      const isDark = themeRef.current === 'dark';
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const radius = mouse.radius;
      const radiusSq = radius * radius;
      const mouseX = mouse.x;
      const mouseY = mouse.y;
      const mouseActive = mouse.isActive;

      ctx.font = 'bold 9px "JetBrains Mono", "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Mouse Dispersion & Explosion Physics
        if (mouseActive) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < radiusSq && distSq > 0) {
            const dist = Math.sqrt(distSq);
            // Smooth falloff force
            const force = (radius - dist) / radius;
            const angle = Math.atan2(dy, dx);
            
            // Scatter like digital dust explosion
            const blast = force * 15;
            p.vx -= Math.cos(angle) * blast + (Math.random() - 0.5) * 3;
            p.vy -= Math.sin(angle) * blast + (Math.random() - 0.5) * 3;
          }
        }

        // 2. Spring force returning to original position
        const homeDx = p.originX - p.x;
        const homeDy = p.originY - p.y;
        p.vx += homeDx * p.ease;
        p.vy += homeDy * p.ease;

        // Friction dampening
        p.vx *= p.friction;
        p.vy *= p.friction;

        p.x += p.vx;
        p.y += p.vy;

        // 3. Subtle ambient floating when settled (alive feeling)
        const distFromHome = Math.abs(homeDx) + Math.abs(homeDy);
        if (distFromHome < 2.0) {
          p.ambientPhase += p.ambientSpeed;
          p.x = p.originX + Math.sin(p.ambientPhase) * 0.45;
          p.y = p.originY + Math.cos(p.ambientPhase * 0.85) * 0.45;
        }

        // 4. Matrix periodic character shimmer
        if (Math.random() < 0.004) {
          p.char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        }

        // 5. Draw digital particle glyph
        const speed = Math.abs(p.vx) + Math.abs(p.vy);
        if (isDark && (p.isBright || speed > 2.5)) {
          ctx.shadowBlur = 7;
          ctx.shadowColor = '#00ff66';
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = p.color;
        ctx.fillText(p.char, p.x, p.y);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full relative select-none py-1 overflow-hidden"
      style={{ touchAction: 'pan-y' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-auto block cursor-crosshair"
      />
    </div>
  );
};
