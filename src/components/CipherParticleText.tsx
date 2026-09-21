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
      homeX: number;
      homeY: number;
      vx: number;
      vy: number;
      char: string;
      size: number;
      brightness: number;
      phase: number;
    };

    const particles: Particle[] = [];

    const mouse = {
      x: -1000,
      y: -1000,
      previousX: -1000,
      previousY: -1000,
      active: false,
      lastMove: 0,
    };

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]#$%&";

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

      // Substantially larger font size proportioned to canvas
      const maxFontSizeByHeight = height * 0.74;
      const maxFontSizeByWidth = width / 7.2;
      const fontSize = Math.min(maxFontSizeByHeight, maxFontSizeByWidth, 185);

      offCtx.font = `900 ${fontSize}px monospace`;
      offCtx.textBaseline = "middle";

      const letters = "CIPHER".split("");
      const letterWidths = letters.map(
        (letter) => offCtx.measureText(letter).width
      );
      const sumWidths = letterWidths.reduce((sum, value) => sum + value, 0);

      // Target total span: fill ~92% of the canvas width to match the red outline guide
      const targetSpan = Math.min(width * 0.92, width - 40);
      const minSpacing = fontSize * 0.15;

      // Calculate letter spacing to distribute the letters across the intended horizontal area
      const letterSpacing = Math.max(
        minSpacing,
        (targetSpan - sumWidths) / (letters.length - 1)
      );

      const totalWidth = sumWidths + letterSpacing * (letters.length - 1);
      let currentX = (width - totalWidth) / 2;

      letters.forEach((letter, index) => {
        const letterWidth = letterWidths[index];

        offCtx.textAlign = "left";
        offCtx.fillStyle = "#ffffff";

        offCtx.fillText(
          letter,
          currentX,
          height / 2
        );

        currentX += letterWidth + letterSpacing;
      });

      const image = offCtx.getImageData(0, 0, Math.round(width), Math.round(height));
      const data = image.data;

      // Dense sampling intervals for fine, sandy matrix texture
      const gap = Math.max(4, Math.min(6, Math.round(width / 190)));

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const index = (Math.floor(y) * Math.round(width) + Math.floor(x)) * 4;

          if (data[index + 3] > 100) {
            particles.push({
              x,
              y,

              homeX: x,
              homeY: y,

              vx: 0,
              vy: 0,

              char: randomChar(),

              size: Math.max(6, Math.min(9, fontSize * 0.05 + Math.random() * 1.5)),

              brightness: 0.45 + Math.random() * 0.55,

              phase: Math.random() * Math.PI * 2,
            });
          }
        }
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();

      mouse.previousX = mouse.x;
      mouse.previousY = mouse.y;

      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;

      mouse.active = true;
      mouse.lastMove = performance.now();
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const isDark = themeRef.current === "dark";

      // Sweeping sand brush radius scaled to text dimensions
      const radius = Math.min(170, Math.max(120, width * 0.14));

      particles.forEach((p) => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (mouse.active && distance < radius) {
          const force = Math.pow(1 - distance / radius, 1.5);

          const directionX = distance === 0 ? 1 : dx / distance;
          const directionY = distance === 0 ? 0 : dy / distance;

          // Push particles away from cursor
          p.vx += directionX * force * 2.2;
          p.vy += directionY * force * 2.2;

          // Sweeping momentum in cursor motion direction
          const sweepX = mouse.x - mouse.previousX;
          const sweepY = mouse.y - mouse.previousY;

          p.vx += sweepX * force * 0.045;
          p.vy += sweepY * force * 0.045;
        }

        // Return particles to their original letter positions
        const homeDX = p.homeX - p.x;
        const homeDY = p.homeY - p.y;

        p.vx += homeDX * 0.02;
        p.vy += homeDY * 0.02;

        // Friction creates soft, grainy movement
        p.vx *= 0.90;
        p.vy *= 0.90;

        p.x += p.vx;
        p.y += p.vy;

        const displaced = Math.hypot(homeDX, homeDY);
        const glow = 0.5 + Math.sin(time * 0.0015 + p.phase) * 0.15;
        const alpha = Math.min(1, 0.55 + glow * 0.35 + displaced * 0.002);

        ctx.globalAlpha = alpha * p.brightness;
        ctx.font = `${p.size}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (isDark) {
          ctx.fillStyle = "#00ff88";
          ctx.shadowColor = "#00ff66";
          ctx.shadowBlur = displaced > 3 ? 5 : 3;
        } else {
          ctx.fillStyle = "#059669";
          ctx.shadowColor = "#059669";
          ctx.shadowBlur = displaced > 3 ? 4 : 2;
        }

        ctx.fillText(p.char, p.x, p.y);
      });

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      if (performance.now() - mouse.lastMove > 100) {
        mouse.previousX = mouse.x;
        mouse.previousY = mouse.y;
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
