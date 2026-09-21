import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext.tsx";
import "./CipherParticles.css";

export const CipherParticleText: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return;

    let width = 0;
    let height = 0;
    let animationFrame = 0;

    type Particle = {
      x: number;
      y: number;
      originX: number;
      originY: number;
      vx: number;
      vy: number;
      char: string;
      size: number;
      baseAlpha: number;
      colorVariation: "neon" | "emerald" | "cyber";
      brightness: number;
      phase: number;
    };

    const particles: Particle[] = [];

    const mouse = {
      x: -2000,
      y: -2000,
      prevX: -2000,
      prevY: -2000,
      vx: 0,
      vy: 0,
      active: false,
      lastTime: 0,
    };

    const characters =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[];:/=*+-_~#$";

    const randomChar = () =>
      characters[Math.floor(Math.random() * characters.length)];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      if (!width || !height) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      offscreen.width = Math.round(width);
      offscreen.height = Math.round(height);

      createParticles();
    };

    const createParticles = () => {
      particles.length = 0;
      offCtx.clearRect(0, 0, width, height);

      // Desktop target: heavy, thick, large letters ~165-175px height
      const targetHeight = Math.min(height * 0.76, 175);
      // Ensure on narrow screens it scales down proportionally
      const maxPossibleWidth = width - 32;
      // At fontSize ~ 170px, total width with close spacing in Arial Black is ~750px
      const scale = Math.min(1, maxPossibleWidth / 750);
      const fontSize = Math.max(48, Math.round(targetHeight * scale));

      // Ultra-heavy, bold headline font so letter strokes are thick, fat, and chunky
      offCtx.font = `900 ${fontSize}px "Arial Black", Impact, "Segoe UI Black", "Inter", sans-serif`;
      offCtx.textBaseline = "middle";

      const letters = "CIPHER".split("");
      const letterWidths = letters.map(
        (letter) => offCtx.measureText(letter).width
      );
      const sumWidths = letterWidths.reduce((sum, val) => sum + val, 0);

      // Close, tight spacing between letters as shown in reference pic (media_1790010540024.png)
      const letterGap = Math.max(8, Math.round(fontSize * 0.11));

      const actualTotalWidth = sumWidths + letterGap * (letters.length - 1);
      let currentX = (width - actualTotalWidth) / 2;
      const centerY = height / 2;

      letters.forEach((letter, index) => {
        const letterWidth = letterWidths[index];

        offCtx.textAlign = "left";
        offCtx.fillStyle = "#ffffff";
        offCtx.fillText(letter, currentX, centerY);

        currentX += letterWidth + letterGap;
      });

      const image = offCtx.getImageData(0, 0, Math.round(width), Math.round(height));
      const data = image.data;

      // Fine sampling gap for dense, solid matrix texture
      const gap = Math.max(3, Math.min(4, Math.round(fontSize / 46)));

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const index = (Math.floor(y) * Math.round(width) + Math.floor(x)) * 4;

          if (data[index + 3] > 110) {
            const rand = Math.random();
            const colorVariation: "neon" | "emerald" | "cyber" =
              rand > 0.55 ? "neon" : rand > 0.25 ? "emerald" : "cyber";

            particles.push({
              x,
              y,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              char: randomChar(),
              size: Math.max(5.5, Math.min(7.8, fontSize * 0.042 + Math.random() * 1.2)),
              baseAlpha: 0.55 + Math.random() * 0.45,
              colorVariation,
              brightness: 0.7 + Math.random() * 0.3,
              phase: Math.random() * Math.PI * 2,
            });
          }
        }
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const now = performance.now();
      const currentX = event.clientX - rect.left;
      const currentY = event.clientY - rect.top;

      if (mouse.x > -1000) {
        const dt = Math.max(8, Math.min(60, now - mouse.lastTime));
        mouse.vx = ((currentX - mouse.x) / dt) * 16.6;
        mouse.vy = ((currentY - mouse.y) / dt) * 16.6;
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;
      } else {
        mouse.prevX = currentX;
        mouse.prevY = currentY;
      }

      mouse.x = currentX;
      mouse.y = currentY;
      mouse.active = true;
      mouse.lastTime = now;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -2000;
      mouse.y = -2000;
      mouse.vx = 0;
      mouse.vy = 0;
    };

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const isDark = themeRef.current === "dark";

      // Interaction radius tuned to ~110px (within 90-130px specification)
      const radius = 110;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion && mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < radius && dist > 0) {
            const factor = 1 - dist / radius;
            const falloff = factor * factor;

            // 1. Radial displacement away from the cursor
            const radialPush = falloff * 2.6;
            const dirX = dx / dist;
            const dirY = dy / dist;

            p.vx += dirX * radialPush;
            p.vy += dirY * radialPush;

            // 2. Sweeping broom force aligned with cursor movement
            const speed = Math.hypot(mouse.vx, mouse.vy);
            const sweepStrength = Math.min(speed, 24) * 0.055;
            p.vx += mouse.vx * falloff * sweepStrength;
            p.vy += mouse.vy * falloff * sweepStrength;

            // 3. Subtle organic sand grain micro-dispersion
            const grainNoise =
              (Math.sin(p.originX * 91.3 + p.originY * 37.7) - 0.5) * 0.5;
            p.vx += grainNoise * falloff;
            p.vy += grainNoise * falloff;
          }
        }

        // Return force to home target position
        const homeDX = p.originX - p.x;
        const homeDY = p.originY - p.y;
        const displacement = Math.hypot(homeDX, homeDY);

        // Limit maximum displacement to ~85-95px (within 50-100px requirement)
        if (displacement > 90) {
          const excess = (displacement - 90) * 0.09;
          p.vx += (homeDX / displacement) * excess;
          p.vy += (homeDY / displacement) * excess;
        }

        p.vx += homeDX * 0.022;
        p.vy += homeDY * 0.022;

        // Friction damping creates soft, fluid sand motion without bouncing
        p.vx *= 0.88;
        p.vy *= 0.88;

        p.x += p.vx;
        p.y += p.vy;

        // Snap precisely once settled to eliminate idle micro-jitter
        if (
          Math.abs(p.vx) < 0.01 &&
          Math.abs(p.vy) < 0.01 &&
          displacement < 0.25
        ) {
          p.x = p.originX;
          p.y = p.originY;
          p.vx = 0;
          p.vy = 0;
        }

        // Luminous shimmer and disturbance glow
        const shimmer = Math.sin(time * 0.0018 + p.phase) * 0.12;
        const isDisplaced = displacement > 2.5;

        let alpha = Math.min(1, p.baseAlpha * p.brightness + shimmer);
        if (isDisplaced) {
          alpha = Math.min(1, alpha + 0.25);
        }

        ctx.globalAlpha = alpha;
        ctx.font = `${p.size}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (isDark) {
          if (p.colorVariation === "neon") {
            ctx.fillStyle = "#00ff88";
            ctx.shadowColor = "#00ff66";
          } else if (p.colorVariation === "emerald") {
            ctx.fillStyle = "#10b981";
            ctx.shadowColor = "#10b981";
          } else {
            ctx.fillStyle = "#34d399";
            ctx.shadowColor = "#00ff66";
          }
          ctx.shadowBlur = isDisplaced ? 7 : p.brightness > 0.82 ? 4 : 2;
        } else {
          if (p.colorVariation === "neon") {
            ctx.fillStyle = "#059669";
            ctx.shadowColor = "#059669";
          } else if (p.colorVariation === "emerald") {
            ctx.fillStyle = "#047857";
            ctx.shadowColor = "#047857";
          } else {
            ctx.fillStyle = "#0f766e";
            ctx.shadowColor = "#0f766e";
          }
          ctx.shadowBlur = isDisplaced ? 5 : 2;
        }

        ctx.fillText(p.char, p.x, p.y);
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Decay stale cursor velocity
      if (performance.now() - mouse.lastTime > 90) {
        mouse.vx *= 0.6;
        mouse.vy *= 0.6;
      }

      animationFrame = requestAnimationFrame(draw);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    resize();
    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="cipher-particles"
      aria-label="CIPHER animated particle text"
    />
  );
};

export const CipherParticles = CipherParticleText;
export default CipherParticleText;
