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

    let wordmarkParticles: Particle[] = [];
    let ambientParticles: Particle[] = [];

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

    // Controlled, localized interaction parameters
    const MOUSE_RADIUS = 85;
    const MOUSE_FORCE = 9.5;

    // Controlled recovery
    const RETURN_FORCE = 0.024;
    const DAMPING = 0.89;

    // Cap velocity to prevent runaway dispersion
    const MAX_SPEED = 10;

    // Digital character palette
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
      wordmarkParticles = [];
      ambientParticles = [];

      maskCtx.clearRect(0, 0, width, height);

      // Locate the anchor in the hero content flow
      const anchor = document.getElementById("cipher-wordmark-anchor");
      const heroRect = canvas.getBoundingClientRect();

      let targetX = width * 0.08;
      let targetY = Math.min(height * 0.22, 140);
      let availableWidth = width * 0.84;
      let availableHeight = 120;

      if (anchor && heroRect) {
        const anchorRect = anchor.getBoundingClientRect();
        if (anchorRect.width > 0) {
          targetX = anchorRect.left - heroRect.left;
          targetY = anchorRect.top - heroRect.top + anchorRect.height * 0.5;
          availableWidth = anchorRect.width;
          availableHeight = Math.max(anchorRect.height, 80);
        }
      }

      // Proportional font size matching reference video layout
      const fontSize = Math.min(
        Math.max(availableWidth * 0.082, 38),
        Math.min(availableHeight * 0.88, 102)
      );

      maskCtx.font = `900 ${fontSize}px 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif`;
      if ("letterSpacing" in maskCtx) {
        (maskCtx as any).letterSpacing = `${Math.round(fontSize * 0.16)}px`;
      }
      maskCtx.textAlign = "left";
      maskCtx.textBaseline = "middle";
      maskCtx.fillStyle = "#ffffff";

      maskCtx.fillText("CIPHER", targetX, targetY);

      const textMetrics = maskCtx.measureText("CIPHER");
      const wordmarkWidth = textMetrics.width || fontSize * 5;

      const imageData = maskCtx.getImageData(
        0,
        0,
        Math.round(width),
        Math.round(height)
      );

      const data = imageData.data;

      // Dense sampling for clear, recognizable digital wordmark
      const spacing = Math.max(5, Math.round(fontSize / 23));

      // Scan only around the wordmark bounding box for efficiency
      const startX = Math.max(0, Math.floor(targetX - 10));
      const endX = Math.min(width, Math.ceil(targetX + wordmarkWidth + 20));
      const startY = Math.max(0, Math.floor(targetY - fontSize * 0.8));
      const endY = Math.min(height, Math.ceil(targetY + fontSize * 0.8));

      for (let y = startY; y < endY; y += spacing) {
        for (let x = startX; x < endX; x += spacing) {
          const index = (y * Math.round(width) + x) * 4;

          if (data[index + 3] > 100) {
            wordmarkParticles.push({
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

      // Ambient particles: controlled envelope around and behind CIPHER only
      const ambientCount = Math.min(65, Math.max(35, Math.round(width / 35)));
      const ambMinX = Math.max(10, targetX - 40);
      const ambMaxX = Math.min(width - 10, targetX + wordmarkWidth + 60);
      const ambMinY = Math.max(20, targetY - fontSize * 0.85);
      const ambMaxY = Math.min(height - 20, targetY + fontSize * 1.9);

      for (let i = 0; i < ambientCount; i++) {
        const ax = ambMinX + Math.random() * (ambMaxX - ambMinX);
        const ay = ambMinY + Math.random() * (ambMaxY - ambMinY);
        ambientParticles.push({
          x: ax,
          y: ay,
          ox: ax,
          oy: ay,
          vx: 0,
          vy: 0,
          char: DIGITAL_CHARS[Math.floor(Math.random() * DIGITAL_CHARS.length)],
          size: Math.max(6, spacing * 0.8),
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const newX = event.clientX - rect.left;
      const newY = event.clientY - rect.top;

      if (
        newX >= 0 &&
        newX <= rect.width &&
        newY >= 0 &&
        newY <= rect.height
      ) {
        mouse.px = mouse.x > -1000 ? mouse.x : newX;
        mouse.py = mouse.y > -1000 ? mouse.y : newY;
        mouse.x = newX;
        mouse.y = newY;
        mouse.active = true;
      } else {
        mouse.active = false;
        mouse.x = -10000;
        mouse.y = -10000;
        mouse.px = -10000;
        mouse.py = -10000;
      }
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      mouse.x = -10000;
      mouse.y = -10000;
      mouse.px = -10000;
      mouse.py = -10000;
    };

    // Calculate closest point on cursor movement segment
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
        Math.min(1, ((px - ax) * abx + (py - ay) * aby) / lengthSquared)
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

      // 1. Ambient particles in the background
      for (const p of ambientParticles) {
        const driftX = Math.sin(elapsed * 0.7 + p.phase) * 10;
        const driftY = Math.cos(elapsed * 0.5 + p.phase) * 7;

        let forceX = 0;
        let forceY = 0;

        if (mouse.active && mouse.px > -1000 && mouse.py > -1000) {
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
            const force = influence * influence * MOUSE_FORCE * 0.7;
            forceX += (dx / distance) * force;
            forceY += (dy / distance) * force;
          }
        }

        p.vx += forceX;
        p.vy += forceY;
        p.vx += (p.ox + driftX - p.x) * (RETURN_FORCE * 0.8);
        p.vy += (p.oy + driftY - p.y) * (RETURN_FORCE * 0.8);
        p.vx *= DAMPING;
        p.vy *= DAMPING;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > MAX_SPEED) {
          p.vx = (p.vx / speed) * MAX_SPEED;
          p.vy = (p.vy / speed) * MAX_SPEED;
        }

        p.x += p.vx;
        p.y += p.vy;

        const disp = Math.sqrt((p.x - p.ox) ** 2 + (p.y - p.oy) ** 2);
        const disturbed = disp > 3;

        ctx.font = `${p.size}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const ambAlpha = disturbed
          ? 0.85
          : 0.16 + 0.12 * Math.sin(elapsed * 1.8 + p.phase);

        if (isDark) {
          ctx.fillStyle = `rgba(0,255,110,${ambAlpha})`;
          ctx.shadowColor = disturbed ? "#00ff66" : "transparent";
        } else {
          ctx.fillStyle = `rgba(5,150,105,${ambAlpha})`;
          ctx.shadowColor = disturbed ? "#059669" : "transparent";
        }
        ctx.shadowBlur = disturbed ? 7 : 0;
        ctx.fillText(p.char, p.x, p.y);
      }

      // 2. Main CIPHER Wordmark particles
      for (const p of wordmarkParticles) {
        let forceX = 0;
        let forceY = 0;

        if (mouse.active && mouse.px > -1000 && mouse.py > -1000) {
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
            const force = influence * influence * MOUSE_FORCE;

            forceX += (dx / distance) * force;
            forceY += (dy / distance) * force;

            const moveX = mouse.x - mouse.px;
            const moveY = mouse.y - mouse.py;
            const moveLength = Math.sqrt(moveX * moveX + moveY * moveY);

            if (moveLength > 0) {
              const directionalForce = force * 0.45;
              forceX += (moveX / moveLength) * directionalForce;
              forceY += (moveY / moveLength) * directionalForce;
            }
          }
        }

        p.vx += forceX;
        p.vy += forceY;
        p.vx += (p.ox - p.x) * RETURN_FORCE;
        p.vy += (p.oy - p.y) * RETURN_FORCE;
        p.vx *= DAMPING;
        p.vy *= DAMPING;

        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > MAX_SPEED) {
          p.vx = (p.vx / speed) * MAX_SPEED;
          p.vy = (p.vy / speed) * MAX_SPEED;
        }

        p.x += p.vx;
        p.y += p.vy;

        const shimmer = 0.78 + 0.22 * Math.sin(elapsed * 2.2 + p.phase);
        const displacement = Math.sqrt(
          (p.x - p.ox) ** 2 + (p.y - p.oy) ** 2
        );
        const disturbed = displacement > 2.5;

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

        ctx.shadowBlur = disturbed ? 11 : 5;
        ctx.fillText(p.char, p.x, p.y);
      }

      ctx.shadowBlur = 0;

      if (mouse.active) {
        mouse.px = mouse.x;
        mouse.py = mouse.y;
      }

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    const settleTimer = setTimeout(resize, 60);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", resize);

    animationFrame = requestAnimationFrame(draw);

    return () => {
      clearTimeout(settleTimer);
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Interactive CIPHER digital particle animation"
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default CipherParticleText;
