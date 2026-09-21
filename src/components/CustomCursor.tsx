import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState<'default' | 'hover' | 'search'>('default');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isSearchTrigger = target.closest('[data-cursor="search"]');
      const isClickable = target.closest('button, a, [role="button"], input, textarea, .clickable-card');

      if (isSearchTrigger) {
        setCursorType('search');
      } else if (isClickable) {
        setCursorType('hover');
      } else {
        setCursorType('default');
      }
    };

    const handleMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Smooth trailing animation loop
    const followMouse = () => {
      setTrailingPos(prev => ({
        x: prev.x + (pos.x - prev.x) * 0.2,
        y: prev.y + (pos.y - prev.y) * 0.2,
      }));
      animationFrameId = requestAnimationFrame(followMouse);
    };

    animationFrameId = requestAnimationFrame(followMouse);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [pos, visible]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999999] overflow-hidden">
      {/* Outer Ring */}
      <div
        className={`fixed flex items-center justify-center rounded-full transition-transform duration-75 ease-out ${
          cursorType === 'search'
            ? 'w-10 h-10 -ml-5 -mt-5 border border-emerald-600 dark:border-[#00ff66] bg-emerald-600/15 dark:bg-[#00ff66]/10 shadow-[0_0_15px_rgba(16,185,129,0.3)] dark:shadow-[0_0_15px_#00ff66]'
            : cursorType === 'hover'
            ? 'w-9 h-9 -ml-[18px] -mt-[18px] border border-emerald-600 dark:border-[#00ff66] bg-emerald-600/20 dark:bg-[#00ff66]/15 shadow-[0_0_12px_rgba(16,185,129,0.3)] dark:shadow-[0_0_12px_#00ff66]'
            : 'w-7 h-7 -ml-3.5 -mt-3.5 border border-emerald-600 dark:border-[#00ff66]/80 bg-transparent shadow-sm dark:shadow-[0_0_8px_rgba(0,255,102,0.4)]'
        }`}
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0)`,
        }}
      >
        {cursorType === 'search' ? (
          <Search className="w-4 h-4 text-emerald-600 dark:text-[#00ff66] animate-pulse" />
        ) : null}
      </div>

      {/* Inner Dot (Instant) */}
      {cursorType !== 'search' && (
        <div
          className="fixed w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-emerald-600 dark:bg-[#00ff66] shadow-[0_0_6px_rgba(16,185,129,0.5)] dark:shadow-[0_0_6px_#00ff66]"
          style={{
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          }}
        />
      )}
    </div>
  );
};
