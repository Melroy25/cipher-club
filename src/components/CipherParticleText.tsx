import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext.tsx";
import "./CipherParticleText.css";

export const CipherParticleText: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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

    let animationFrame: number;

    let width = 0;
    let height = 0;

    type Particle = {
      x: number;
      y: number;
      originalX: number;
      originalY: number;
      vx: number;
      vy: number;
      char: string;
      size: number;
      alpha: number;
      brightness: number;
    };

    let particles: Particle[] = [];

    const mouse = {
      x: -10000,
      y: -10000,
      active: false,
    };

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]*&";

    const gap = 3;
    const interactionRadius = 230;
    const interactionStrength = 75;

    const textCanvas = document.createElement("canvas");
    const textCtx = textCanvas.getContext("2d");
    if (!textCtx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      if (!width || !height) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      textCanvas.width = Math.round(width);
      textCanvas.height = Math.round(height);

      createParticles();
    };

    const createParticles = () => {
      particles = [];

      textCtx.clearRect(0, 0, width, height);

      // Account for vertical canvas padding buffer so lettering stays well proportioned
      const effectiveHeight = Math.max(height - 100, 100);
      const fontSize = Math.min(width * 0.17, effectiveHeight * 0.78);

      textCtx.font = `900 ${fontSize}px monospace`;
      textCtx.textAlign = "center";
      textCtx.textBaseline = "middle";
      textCtx.fillStyle = "#ffffff";

      textCtx.fillText("CIPHER", width / 2, height / 2);

      const imageData = textCtx.getImageData(
        0,
        0,
        Math.round(width),
        Math.round(height)
      );

      const data = imageData.data;
      const samplingGap = Math.max(gap, Math.round(fontSize / 36));

      for (let y = 0; y < height; y += samplingGap) {
        for (let x = 0; x < width; x += samplingGap) {
          const index = (Math.round(y) * Math.round(width) + Math.round(x)) * 4;

          if (data[index + 3] > 100) {
            particles.push({
              x,
              y,
              originalX: x,
              originalY: y,
              vx: 0,
              vy: 0,
              char: characters[
                Math.floor(Math.random() * characters.length)
              ],
              size: fontSize > 100 ? 7 : 6,
              alpha: 0.45 + Math.random() * 0.55,
              brightness: Math.random(),
            });
          }
        }
      }
    };

    const handlePointerMove = (event: MouseEvent | PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = event.clientX - rect.left;
      const my = event.clientY - rect.top;

      mouse.x = mx;
      mouse.y = my;

      if (
        event.clientX >= rect.left - 50 &&
        event.clientX <= rect.right + 50 &&
        event.clientY >= rect.top - 50 &&
        event.clientY <= rect.bottom + 50
      ) {
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      mouse.x = -10000;
      mouse.y = -10000;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = themeRef.current === "dark";

      for (const particle of particles) {
        let targetX = particle.originalX;
        let targetY = particle.originalY;

        if (mouse.active) {
          const dx = particle.originalX - mouse.x;
          const dy = particle.originalY - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < interactionRadius && distance > 0) {
            const falloff = 1 - distance / interactionRadius;
            const force = Math.pow(falloff, 1.5) * interactionStrength;

            targetX += (dx / distance) * force;
            targetY += (dy / distance) * force;
          }
        }

        // Smooth flowing movement with gentle damping
        particle.vx += (targetX - particle.x) * 0.09;
        particle.vy += (targetY - particle.y) * 0.09;

        particle.vx *= 0.78;
        particle.vy *= 0.78;

        particle.x += particle.vx;
        particle.y += particle.vy;

        const glow = particle.brightness > 0.7;

        ctx.font = `${particle.size}px monospace`;

        if (isDark) {
          ctx.fillStyle = glow
            ? `rgba(0, 255, 125, ${particle.alpha})`
            : `rgba(0, 190, 100, ${particle.alpha * 0.8})`;
          ctx.shadowBlur = glow ? 9 : 3;
          ctx.shadowColor = "#00ff88";
        } else {
          ctx.fillStyle = glow
            ? `rgba(5, 150, 105, ${particle.alpha})`
            : `rgba(4, 120, 87, ${particle.alpha * 0.85})`;
          ctx.shadowBlur = glow ? 7 : 2;
          ctx.shadowColor = "#059669";
        }

        ctx.fillText(particle.char, particle.x, particle.y);
      }

      ctx.shadowBlur = 0;

      animationFrame = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("resize", resize);

    resize();
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={containerRef} className="cipher-particle-container">
      <canvas
        ref={canvasRef}
        aria-label="Interactive CIPHER digital particle animation"
        className="cipher-particle-canvas"
      />
    </div>
  );
};

export default CipherParticleText;
