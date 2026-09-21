import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext.tsx";

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

    const maskCanvas = document.createElement("canvas");
    const maskCtx = maskCanvas.getContext("2d");
    if (!maskCtx) return;

    type Particle = {
      x: number;
      y: number;
      ox: number;
      oy: number;
      vx: number;
      vy: number;
      char: string;
      size: number;
      phase: number;
    };

    let particles: Particle[] = [];

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let startTime = 0;

    const mouse = {
      x: -10000,
      y: -10000,
      active: false,
    };

    // Reference interaction parameters
    const MOUSE_RADIUS = 90;
    const MOUSE_FORCE = 8.5;

    // Smooth recovery
    const RETURN_FORCE = 0.035;
    const DAMPING = 0.88;

    // Digital characters used to construct the lettering
    const DIGITAL_CHARS = "01CIPHER<>/{}[]";

    const resize = () => {
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      if (!width || !height) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      maskCanvas.width = Math.round(width);
      maskCanvas.height = Math.round(height);

      createParticles();
    };

    const createParticles = () => {
      particles = [];

      maskCtx.clearRect(0, 0, width, height);

      // Bold lettering creates a clear, recognizable CIPHER silhouette
      const fontSize = Math.min(width * 0.19, height * 0.78);

      maskCtx.font = `900 ${fontSize}px Arial, Helvetica, sans-serif`;
      maskCtx.textAlign = "center";
      maskCtx.textBaseline = "middle";
      maskCtx.fillStyle = "#ffffff";

      maskCtx.fillText("CIPHER", width / 2, height / 2);

      const imageData = maskCtx.getImageData(
        0,
        0,
        Math.round(width),
        Math.round(height)
      );

      const data = imageData.data;

      // Dense sampling creates the tiny-character digital texture
      const spacing = Math.max(5, Math.round(fontSize / 22));

      for (let y = 0; y < height; y += spacing) {
        for (let x = 0; x < width; x += spacing) {
          const index = (y * Math.round(width) + x) * 4;

          // Only create characters inside the CIPHER letter shapes
          if (data[index + 3] > 100) {
            particles.push({
              x,
              y,
              ox: x,
              oy: y,
              vx: 0,
              vy: 0,
              char: DIGITAL_CHARS[
                Math.floor(Math.random() * DIGITAL_CHARS.length)
              ],
              size: Math.max(7, spacing * 0.95),
              phase: Math.random() * Math.PI * 2,
            });
          }
        }
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();

      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      mouse.x = -10000;
      mouse.y = -10000;
    };

    const draw = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const elapsed = (timestamp - startTime) / 1000;
      const isDark = themeRef.current === "dark";

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        // Push nearby characters away from the cursor
        if (
          mouse.active &&
          distance < MOUSE_RADIUS &&
          distance > 0
        ) {
          const influence = 1 - distance / MOUSE_RADIUS;

          const force = influence * MOUSE_FORCE;

          p.vx += (dx / distance) * force;
          p.vy += (dy / distance) * force;
        }

        // Pull characters back into their original letter positions
        p.vx += (p.ox - p.x) * RETURN_FORCE;
        p.vy += (p.oy - p.y) * RETURN_FORCE;

        p.vx *= DAMPING;
        p.vy *= DAMPING;

        p.x += p.vx;
        p.y += p.vy;

        // Gentle shimmering illumination
        const shimmer =
          0.78 + 0.22 * Math.sin(elapsed * 2.5 + p.phase);

        const nearMouse =
          mouse.active && distance < MOUSE_RADIUS;

        // Make characters glow more brightly near the cursor
        if (isDark) {
          ctx.fillStyle = nearMouse
            ? "rgba(0,255,110,1)"
            : `rgba(0,255,110,${shimmer})`;
          ctx.shadowColor = "#00ff66";
        } else {
          ctx.fillStyle = nearMouse
            ? "rgba(5,150,105,1)"
            : `rgba(5,150,105,${shimmer})`;
          ctx.shadowColor = "#059669";
        }

        ctx.font = `bold ${p.size}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.shadowBlur = nearMouse ? 15 : 7;

        // Render digital characters instead of dots
        ctx.fillText(p.char, p.x, p.y);
      }

      ctx.shadowBlur = 0;

      animationFrame = requestAnimationFrame(draw);
    };

    resize();

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);

    window.addEventListener("resize", resize);

    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);

      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);

      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Interactive CIPHER digital particle animation"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
      }}
    />
  );
};
