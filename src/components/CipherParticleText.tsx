import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  returnSpeed: number;
  friction: number;
  blastMultiplier: number;
  char: string;
  size: number;
  color: string;
  ambientPhase: number;
  ambientSpeed: number;
  isHighlight: boolean;
}

const MATRIX_CHARS = 'CIPHER0123456789#%*+=:;.-@_[]';

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

    // Pointer state with physical repulsion radius
    const mouse = {
      x: -9999,
      y: -9999,
      radius: 120,
      active: false,
    };

    const getPalette = (isDark: boolean) => {
      if (isDark) {
        return {
          primary: ['#00ff66', '#00ff66', '#38ef7d', '#00e65b', '#10b981'],
          deep: ['#00cc55', '#00aa44', '#047857'],
          sparkle: ['#ffffff', '#e0ffe8', '#a8ffc4'],
        };
      } else {
        return {
          primary: ['#059669', '#047857', '#065f46'],
          deep: ['#0f766e', '#115e59'],
          sparkle: ['#10b981', '#34d399', '#059669'],
        };
      }
    };

    // Build dense text mask and sample particles
    const initParticles = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width);
      if (width <= 0) return;

      // Tight, responsive canvas height to eliminate vertical gaps
      const isMobile = width < 640;
      const isTablet = width < 1024;
      const height = isMobile ? 95 : isTablet ? 125 : 150;

      canvas.width = width;
      canvas.height = height;

      // Mouse influence radius scales with screen size
      mouse.radius = Math.min(Math.max(width * 0.12, 85), 135);

      // Offscreen canvas to rasterize ultra-bold "CIPHER" text
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      // Use a bold font with strong monospace/geometric letterforms
      const fontSize = Math.floor(Math.min(width / (isMobile ? 6.2 : 6.8), height * 0.88));
      offCtx.font = `900 ${fontSize}px "JetBrains Mono", "Space Grotesk", monospace`;
      offCtx.fillStyle = '#ffffff';
      offCtx.strokeStyle = '#ffffff';
      offCtx.lineWidth = Math.max(3, Math.floor(fontSize * 0.05));
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';

      const letters = ['C', 'I', 'P', 'H', 'E', 'R'];
      const totalLetters = letters.length;
      
      // Calculate balanced span and spacing
      const totalSpan = Math.min(width * 0.95, 1150);
      const letterSpacing = totalSpan / totalLetters;
      const startX = (width - (totalLetters - 1) * letterSpacing) / 2;
      const centerY = height / 2;

      // Draw stroke and fill so letter strokes have solid, bold body
      letters.forEach((letter, i) => {
        const x = startX + i * letterSpacing;
        offCtx.strokeText(letter, x, centerY);
        offCtx.fillText(letter, x, centerY);
      });

      // Sample pixels on a high-density grid
      const imgData = offCtx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const step = isMobile ? 5 : 4; // Dense sampling step
      const isDark = themeRef.current === 'dark';
      const palette = getPalette(isDark);

      const newParticles: Particle[] = [];

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3];

          // Sample visible pixels from the text mask
          if (alpha > 80) {
            const rand = Math.random();
            let color = palette.primary[Math.floor(Math.random() * palette.primary.length)];
            let isHighlight = false;

            if (rand > 0.88) {
              color = palette.sparkle[Math.floor(Math.random() * palette.sparkle.length)];
              isHighlight = true;
            } else if (rand < 0.2) {
              color = palette.deep[Math.floor(Math.random() * palette.deep.length)];
            }

            const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
            const particleSize = isMobile ? 8 : (isHighlight ? 9.5 : 8.5);

            newParticles.push({
              x,
              y,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              returnSpeed: 0.08 + Math.random() * 0.04, // Smooth spring return
              friction: 0.86 + Math.random() * 0.03, // Dampening for glide
              blastMultiplier: 32 + Math.random() * 22, // Powerful repulsion
              char,
              size: particleSize,
              color,
              ambientPhase: Math.random() * Math.PI * 2,
              ambientSpeed: 0.015 + Math.random() * 0.02,
              isHighlight,
            });
          }
        }
      }

      particles = newParticles;
    };

    // Ensure web fonts are completely ready before rasterizing
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        initParticles();
      });
    } else {
      initParticles();
    }

    // Pointer interaction handling with coordinate normalization
    const updatePointer = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const pad = 60; // Influence buffer around canvas
      const isInside =
        clientX >= rect.left - pad &&
        clientX <= rect.right + pad &&
        clientY >= rect.top - pad &&
        clientY <= rect.bottom + pad;

      if (isInside && rect.width > 0 && rect.height > 0) {
        mouse.x = (clientX - rect.left) * (canvas.width / rect.width);
        mouse.y = (clientY - rect.top) * (canvas.height / rect.height);
        mouse.active = true;
      } else {
        mouse.active = false;
        mouse.x = -9999;
        mouse.y = -9999;
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      updatePointer(e.clientX, e.clientY);
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      handlePointerLeave();
    };

    // Direct canvas event listeners
    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('mouseleave', handlePointerLeave);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('touchcancel', handleTouchEnd);

    // Global window listeners so rapid cursor sweeps are smoothly caught
    window.addEventListener('mousemove', handlePointerMove);
    document.addEventListener('mouseleave', handlePointerLeave);
    window.addEventListener('blur', handlePointerLeave);

    // Responsive scaling
    const resizeObserver = new ResizeObserver(() => {
      initParticles();
    });
    resizeObserver.observe(container);

    // Continuous 60FPS physics and render loop
    const render = () => {
      const isDark = themeRef.current === 'dark';
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const radius = mouse.radius;
      const radiusSq = radius * radius;
      const mouseX = mouse.x;
      const mouseY = mouse.y;
      const mouseActive = mouse.active;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 9px "JetBrains Mono", "Courier New", monospace';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Physical Mouse Repulsion (Digital Dust Dispersion)
        if (mouseActive) {
          const dx = p.x - mouseX; // Vector pointing AWAY from cursor
          const dy = p.y - mouseY;
          const distSq = dx * dx + dy * dy;

          if (distSq < radiusSq && distSq > 0.1) {
            const dist = Math.sqrt(distSq);
            const force = (radius - dist) / radius; // 1 at center, 0 at edge
            const normX = dx / dist;
            const normY = dy / dist;

            // Physical explosive blast
            const impulse = force * force * p.blastMultiplier;
            p.vx += normX * impulse;
            p.vy += normY * impulse;

            // Digital dust turbulence
            p.vx += (Math.random() - 0.5) * 4 * force;
            p.vy += (Math.random() - 0.5) * 4 * force;
          }
        }

        // 2. Returning Spring & Friction Physics
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.x += p.vx + (p.originX - p.x) * p.returnSpeed;
        p.y += p.vy + (p.originY - p.y) * p.returnSpeed;

        // 3. Subtle Ambient Shimmer when Settled (Alive Feeling)
        let drawX = p.x;
        let drawY = p.y;
        const distFromHome = Math.abs(p.originX - p.x) + Math.abs(p.originY - p.y);
        const speed = Math.abs(p.vx) + Math.abs(p.vy);

        if (distFromHome < 1.5 && speed < 0.25) {
          p.ambientPhase += p.ambientSpeed;
          drawX += Math.sin(p.ambientPhase) * 0.35;
          drawY += Math.cos(p.ambientPhase * 0.8) * 0.35;
        }

        // Periodic matrix character flip
        if (Math.random() < 0.003) {
          p.char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        }

        // 4. Glow styling & Draw
        if (isDark && (p.isHighlight || speed > 1.8)) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#00ff66';
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = p.color;
        ctx.fillText(p.char, drawX, drawY);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      canvas.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('mouseleave', handlePointerLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('touchcancel', handleTouchEnd);
      window.removeEventListener('mousemove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full relative select-none leading-none block"
      style={{ touchAction: 'pan-y' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full block relative z-20 cursor-crosshair pointer-events-auto"
      />
    </div>
  );
};
