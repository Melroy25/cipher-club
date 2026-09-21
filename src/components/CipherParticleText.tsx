import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  returnSpeed: number;
  friction: number;
  blastMultiplier: number;
  char: string;
  size: number;
  color: string;
  ambientPhase: number;
  ambientSpeed: number;
  isHighlight: boolean;
  isText: boolean;
}

interface CipherParticleTextProps {
  heroRef: React.RefObject<HTMLElement | null>;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}

const MATRIX_CHARS = 'CIPHER0123456789#%*+=:;.-@_[]';
const AMBIENT_CHARS = ['·', '▪', '.', '+', '0', '1', '*', ':', '~'];

export const CipherParticleText: React.FC<CipherParticleTextProps> = ({ heroRef, anchorRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const heroEl = heroRef.current;
    const anchorEl = anchorRef.current;
    const canvas = canvasRef.current;
    if (!heroEl || !anchorEl || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Pointer state across the full hero environment
    const mouse = {
      x: -9999,
      y: -9999,
      radius: 125,
      active: false,
    };

    const getPalette = (isDark: boolean) => {
      if (isDark) {
        return {
          primary: ['#00ff66', '#00ff66', '#38ef7d', '#00e65b', '#10b981'],
          deep: ['#00cc55', '#00aa44', '#047857'],
          sparkle: ['#ffffff', '#e0ffe8', '#a8ffc4'],
          ambient: ['rgba(0, 255, 102, 0.65)', 'rgba(0, 255, 102, 0.4)', 'rgba(56, 239, 125, 0.55)', 'rgba(0, 204, 85, 0.35)'],
        };
      } else {
        return {
          primary: ['#059669', '#047857', '#065f46'],
          deep: ['#0f766e', '#115e59'],
          sparkle: ['#10b981', '#34d399', '#059669'],
          ambient: ['rgba(5, 150, 105, 0.55)', 'rgba(5, 150, 105, 0.35)', 'rgba(16, 185, 129, 0.45)'],
        };
      }
    };

    // Initialize full-hero particle environment
    const initEnvironment = () => {
      const heroRect = heroEl.getBoundingClientRect();
      const anchorRect = anchorEl.getBoundingClientRect();

      const width = Math.floor(heroRect.width);
      const height = Math.floor(heroRect.height);
      if (width <= 0 || height <= 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Mouse influence radius scales with screen size
      mouse.radius = Math.min(Math.max(width * 0.12, 95), 145);

      // Relative coordinates of the CIPHER text anchor inside the hero section
      const targetX = Math.max(0, anchorRect.left - heroRect.left);
      const targetY = Math.max(0, anchorRect.top - heroRect.top);
      const targetWidth = Math.max(200, anchorRect.width);
      const targetHeight = Math.max(60, anchorRect.height);

      // Offscreen canvas for sampling high-density CIPHER text mask
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      const isMobile = width < 640;
      const fontSize = Math.floor(
        Math.min(targetWidth / (isMobile ? 6.2 : 6.8), targetHeight * 0.96)
      );

      // Ultra-bold monospace font for strong matrix letterforms
      offCtx.font = `900 ${fontSize}px "JetBrains Mono", "Space Grotesk", monospace`;
      offCtx.fillStyle = '#ffffff';
      offCtx.strokeStyle = '#ffffff';
      offCtx.lineWidth = Math.max(3, Math.floor(fontSize * 0.05));
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';

      const letters = ['C', 'I', 'P', 'H', 'E', 'R'];
      const totalLetters = letters.length;
      
      // Calculate balanced span and spacing
      const totalSpan = Math.min(targetWidth * 0.96, 1150);
      const letterSpacing = totalSpan / totalLetters;
      const startX = targetX + (targetWidth - (totalLetters - 1) * letterSpacing) / 2;
      const centerY = targetY + targetHeight / 2;

      // Draw stroke and fill so letter strokes have solid, bold body
      letters.forEach((letter, i) => {
        const x = startX + i * letterSpacing;
        offCtx.strokeText(letter, x, centerY);
        offCtx.fillText(letter, x, centerY);
      });

      // Sample pixels on a dense grid
      const imgData = offCtx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const step = isMobile ? 5 : 4; // High density step
      const isDark = themeRef.current === 'dark';
      const palette = getPalette(isDark);

      const newParticles: Particle[] = [];

      // 1. Text Particles (CIPHER Wordmark)
      for (let y = Math.max(0, Math.floor(targetY - 10)); y < Math.min(height, Math.ceil(targetY + targetHeight + 10)); y += step) {
        for (let x = Math.max(0, Math.floor(targetX - 10)); x < Math.min(width, Math.ceil(targetX + targetWidth + 10)); x += step) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3];

          if (alpha > 75) {
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
              baseVx: 0,
              baseVy: 0,
              returnSpeed: 0.08 + Math.random() * 0.04,
              friction: 0.88 + Math.random() * 0.03,
              blastMultiplier: 38 + Math.random() * 24,
              char,
              size: particleSize,
              color,
              ambientPhase: Math.random() * Math.PI * 2,
              ambientSpeed: 0.015 + Math.random() * 0.02,
              isHighlight,
              isText: true,
            });
          }
        }
      }

      // 2. Second Layer: Ambient Digital Dust Across Full Hero Background
      const ambientCount = Math.floor(Math.min((width * height) / 3800, 240));

      for (let i = 0; i < ambientCount; i++) {
        const ax = Math.random() * width;
        const ay = Math.random() * height;
        const driftX = (Math.random() - 0.5) * 0.45;
        const driftY = (Math.random() - 0.5) * 0.35;
        const aColor = palette.ambient[Math.floor(Math.random() * palette.ambient.length)];
        const aChar = AMBIENT_CHARS[Math.floor(Math.random() * AMBIENT_CHARS.length)];
        const aSize = Math.random() > 0.6 ? 7 : 5;

        newParticles.push({
          x: ax,
          y: ay,
          originX: ax,
          originY: ay,
          vx: driftX,
          vy: driftY,
          baseVx: driftX,
          baseVy: driftY,
          returnSpeed: 0.02,
          friction: 0.92,
          blastMultiplier: 28 + Math.random() * 18,
          char: aChar,
          size: aSize,
          color: aColor,
          ambientPhase: Math.random() * Math.PI * 2,
          ambientSpeed: 0.01 + Math.random() * 0.015,
          isHighlight: false,
          isText: false,
        });
      }

      particles = newParticles;
    };

    // Ensure fonts are loaded before initial sampling
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        initEnvironment();
      });
    } else {
      initEnvironment();
    }

    // Pointer Interaction Across Full Hero
    const updatePointer = (clientX: number, clientY: number) => {
      const rect = heroEl.getBoundingClientRect();
      const pad = 50;

      if (
        clientX >= rect.left - pad &&
        clientX <= rect.right + pad &&
        clientY >= rect.top - pad &&
        clientY <= rect.bottom + pad
      ) {
        mouse.x = (clientX - rect.left) * (canvas.clientWidth / rect.width);
        mouse.y = (clientY - rect.top) * (canvas.clientHeight / rect.height);
        mouse.active = true;
      } else {
        mouse.active = false;
        mouse.x = -9999;
        mouse.y = -9999;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePointer(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
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
      handleMouseLeave();
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    // Resize Observer on Hero section and Anchor
    const resizeObserver = new ResizeObserver(() => {
      initEnvironment();
    });
    resizeObserver.observe(heroEl);
    resizeObserver.observe(anchorEl);

    // 60FPS Physics & Render Loop
    const render = () => {
      const isDark = themeRef.current === 'dark';
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

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

        // 1. Mouse Repulsion Across Full Hero (Digital Dust Dispersion)
        if (mouseActive) {
          const dx = p.x - mouseX; // Vector pointing AWAY from cursor
          const dy = p.y - mouseY;
          const distSq = dx * dx + dy * dy;

          if (distSq < radiusSq && distSq > 0.1) {
            const dist = Math.sqrt(distSq);
            const force = (radius - dist) / radius; // 1 at center, 0 at edge
            const normX = dx / dist;
            const normY = dy / dist;

            // Physical blast force
            const impulse = force * force * p.blastMultiplier;
            p.vx += normX * impulse;
            p.vy += normY * impulse;

            // Turbulence noise
            p.vx += (Math.random() - 0.5) * 4 * force;
            p.vy += (Math.random() - 0.5) * 4 * force;
          }
        }

        let drawX = p.x;
        let drawY = p.y;
        const speed = Math.abs(p.vx) + Math.abs(p.vy);

        if (p.isText) {
          // Text particles: Spring return to origin
          p.vx *= p.friction;
          p.vy *= p.friction;
          p.x += p.vx + (p.originX - p.x) * p.returnSpeed;
          p.y += p.vy + (p.originY - p.y) * p.returnSpeed;

          // Subtle ambient breathing when settled
          const distFromHome = Math.abs(p.originX - p.x) + Math.abs(p.originY - p.y);
          if (distFromHome < 1.5 && speed < 0.25) {
            p.ambientPhase += p.ambientSpeed;
            drawX += Math.sin(p.ambientPhase) * 0.35;
            drawY += Math.cos(p.ambientPhase * 0.8) * 0.35;
          }

          // Matrix character periodic shimmer
          if (Math.random() < 0.003) {
            p.char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
          }
        } else {
          // Ambient background particles: Natural floating drift
          p.vx *= p.friction;
          p.vy *= p.friction;
          p.x += p.vx;
          p.y += p.vy;

          // Seamless wrap around hero edges
          if (p.x < -30) p.x = width + 30;
          if (p.x > width + 30) p.x = -30;
          if (p.y < -30) p.y = height + 30;
          if (p.y > height + 30) p.y = -30;

          // Gradually resume baseline drift
          p.vx += (p.baseVx - p.vx) * 0.02;
          p.vy += (p.baseVy - p.vy) * 0.02;

          drawX = p.x;
          drawY = p.y;
        }

        // Glow effects
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
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [heroRef, anchorRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 block"
    />
  );
};
