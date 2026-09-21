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
      px: -10000,
      py: -10000,
      active: false,
    };

    // Mouse interaction settings.
    const MOUSE_RADIUS = 105;
    const MOUSE_FORCE = 12;

    // Recovery settings.
    const RETURN_FORCE = 0.018;
    const DAMPING = 0.91;

    // Prevent particles from gaining unlimited velocity.
    const MAX_SPEED = 15;

    // Digital character palette.
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

      // Generate a bold CIPHER text mask.
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

      // Dense sampling for a recognizable digital wordmark.
      const spacing = Math.max(5, Math.round(fontSize / 24));

      for (let y = 0; y < height; y += spacing) {
        for (let x = 0; x < width; x += spacing) {
          const index = (y * Math.round(width) + x) * 4;

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

      const newX = event.clientX - rect.left;
      const newY = event.clientY - rect.top;

      mouse.px = mouse.x;
      mouse.py = mouse.y;

      mouse.x = newX;
      mouse.y = newY;

      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;

      mouse.x = -10000;
      mouse.y = -10000;

      mouse.px = -10000;
      mouse.py = -10000;
    };

    // Find the closest point on the cursor's movement segment.
    const closestPointOnSegment = (
      px: number,
      py: number,
      ax: number,
      ay: number,
      bx: number,
      by: number
    ) => {
      const abx = bx - ax;
      const aby = by - ay;

      const lengthSquared = abx * abx + aby * aby;

      if (lengthSquared === 0) {
        return { x: ax, y: ay, t: 0 };
      }

      const t = Math.max(
        0,
        Math.min(
          1,
          ((px - ax) * abx + (py - ay) * aby) / lengthSquared
        )
      );

      return {
        x: ax + abx * t,
        y: ay + aby * t,
        t,
      };
    };

    const draw = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      const elapsed = (timestamp - startTime) / 1000;
      const isDark = themeRef.current === "dark";

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        let forceX = 0;
        let forceY = 0;

        if (
          mouse.active &&
          mouse.px > -1000 &&
          mouse.py > -1000
        ) {
          // Calculate distance from the entire recent mouse path.
          const closest = closestPointOnSegment(
            p.x,
            p.y,
            mouse.px,
            mouse.py,
            mouse.x,
            mouse.y
          );

          const dx = p.x - closest.x;
          const dy = p.y - closest.y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < MOUSE_RADIUS && distance > 0) {
            const influence = 1 - distance / MOUSE_RADIUS;

            // Stronger impulse close to the cursor trail.
            const force = influence * influence * MOUSE_FORCE;

            // Push away from the cursor's path.
            forceX += (dx / distance) * force;
            forceY += (dy / distance) * force;

            // Add directional movement following the cursor.
            const moveX = mouse.x - mouse.px;
            const moveY = mouse.y - mouse.py;

            const moveLength = Math.sqrt(
              moveX * moveX + moveY * moveY
            );

            if (moveLength > 0) {
              const directionalForce = force * 0.65;

              forceX += (moveX / moveLength) * directionalForce;
              forceY += (moveY / moveLength) * directionalForce;
            }
          }
        }

        // Apply the mouse impulse.
        p.vx += forceX;
        p.vy += forceY;

        // Gradually reconstruct the original CIPHER lettering.
        p.vx += (p.ox - p.x) * RETURN_FORCE;
        p.vy += (p.oy - p.y) * RETURN_FORCE;

        // Damping creates smooth, controlled motion.
        p.vx *= DAMPING;
        p.vy *= DAMPING;

        // Clamp extreme velocities.
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);

        if (speed > MAX_SPEED) {
          p.vx = (p.vx / speed) * MAX_SPEED;
          p.vy = (p.vy / speed) * MAX_SPEED;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Subtle digital shimmer.
        const shimmer =
          0.82 + 0.18 * Math.sin(elapsed * 2.5 + p.phase);

        const displacement = Math.sqrt(
          (p.x - p.ox) ** 2 + (p.y - p.oy) ** 2
        );

        // Displaced characters glow more brightly.
        const disturbed = displacement > 3;

        ctx.font = `bold ${p.size}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (isDark) {
          ctx.fillStyle = disturbed
            ? "rgba(0,255,110,1)"
            : `rgba(0,255,110,${shimmer})`;
          ctx.shadowColor = "#00ff66";
        } else {
          ctx.fillStyle = disturbed
            ? "rgba(5,150,105,1)"
            : `rgba(5,150,105,${shimmer})`;
          ctx.shadowColor = "#059669";
        }

        ctx.shadowBlur = disturbed ? 13 : 6;

        // Always render digital characters, never plain dots.
        ctx.fillText(p.char, p.x, p.y);
      }

      ctx.shadowBlur = 0;

      // Preserve the previous cursor position for the next frame.
      if (mouse.active) {
        mouse.px = mouse.x;
        mouse.py = mouse.y;
      }

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

export default CipherParticleText;
