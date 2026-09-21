import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext.tsx";
import "./CipherParticleText.css";

interface Particle {
  x: number;
  y: number;

  originX: number;
  originY: number;

  vx: number;
  vy: number;

  char: string;
  size: number;
  alpha: number;
}

export const CipherParticleText: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let animationFrame = 0;

    let particles: Particle[] = [];

    const mouse = {
      x: -1000,
      y: -1000,
      active: false,
    };

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]*&";

    // Mouse interaction settings.
    const interactionRadius = 190;
    const interactionStrength = 115;

    const textCanvas = document.createElement("canvas");
    const textCtx = textCanvas.getContext("2d");
    if (!textCtx) return;

    function createParticles() {
      particles = [];

      textCtx!.clearRect(0, 0, width, height);

      // Fit the lettering inside the container.
      // This controls the actual text size, not mouse movement.
      const fontSize = Math.min(
        width * 0.19,
        height * 0.78,
        175
      );

      textCtx!.font = `900 ${fontSize}px monospace`;
      textCtx!.textAlign = "center";
      textCtx!.textBaseline = "middle";
      textCtx!.fillStyle = "#ffffff";

      textCtx!.fillText("CIPHER", width / 2, height / 2);

      const imageData = textCtx!.getImageData(
        0,
        0,
        width,
        height
      );

      const data = imageData.data;

      // Smaller sampling gaps create a grainier,
      // denser digital-character appearance.
      const gap = 4;

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const index = (y * width + x) * 4;

          if (data[index + 3] > 100) {
            particles.push({
              x,
              y,

              originX: x,
              originY: y,

              vx: 0,
              vy: 0,

              char:
                characters[
                  Math.floor(Math.random() * characters.length)
                ],

              size: 6 + Math.random() * 2,

              alpha: 0.45 + Math.random() * 0.55,
            });
          }
        }
      }
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      if (!width || !height) return;

      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);

      // Scale the drawing context for sharp rendering.
      // Do not scale or zoom the particle positions.
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      textCanvas.width = Math.round(width);
      textCanvas.height = Math.round(height);

      createParticles();
    }

    function handleMouseMove(event: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();

      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;

      mouse.active = true;
    }

    function handleMouseLeave() {
      mouse.active = false;
    }

    function animate() {
      ctx!.clearRect(0, 0, width, height);
      const isDark = themeRef.current === "dark";

      for (const particle of particles) {
        let forceX = 0;
        let forceY = 0;

        if (mouse.active) {
          const dx = particle.x - mouse.x;
          const dy = particle.y - mouse.y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (
            distance < interactionRadius &&
            distance > 0
          ) {
            const falloff =
              1 - distance / interactionRadius;

            // Push particles away from the cursor.
            // This changes particle positions only.
            const force =
              Math.pow(falloff, 1.7) *
              interactionStrength;

            forceX = (dx / distance) * force;
            forceY = (dy / distance) * force;
          }
        }

        // Move individual particles.
        // No scaling, zooming, or enlargement of the text.
        const targetX = particle.originX + forceX;
        const targetY = particle.originY + forceY;

        particle.vx += (targetX - particle.x) * 0.085;
        particle.vy += (targetY - particle.y) * 0.085;

        // Smooth damping instead of a bouncy spring.
        particle.vx *= 0.78;
        particle.vy *= 0.78;

        particle.x += particle.vx;
        particle.y += particle.vy;

        // Digital green glow.
        ctx!.font = `${particle.size}px monospace`;

        if (isDark) {
          ctx!.fillStyle = `rgba(0, 255, 125, ${particle.alpha})`;
          ctx!.shadowColor = "#00ff88";
          ctx!.shadowBlur = 5;
        } else {
          ctx!.fillStyle = `rgba(5, 150, 105, ${particle.alpha})`;
          ctx!.shadowColor = "#059669";
          ctx!.shadowBlur = 4;
        }

        ctx!.fillText(
          particle.char,
          particle.x,
          particle.y
        );
      }

      ctx!.shadowBlur = 0;

      animationFrame = requestAnimationFrame(animate);
    }

    const resizeObserver = new ResizeObserver(resize);

    resizeObserver.observe(canvas);

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    resize();

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);

      resizeObserver.disconnect();

      canvas.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      canvas.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
    };
  }, []);

  return (
    <div className="cipher-particle-container">
      <canvas
        ref={canvasRef}
        className="cipher-particle-canvas"
      />
    </div>
  );
};

export default CipherParticleText;
