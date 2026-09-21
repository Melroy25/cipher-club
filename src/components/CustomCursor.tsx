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
      {/* Outer Ring - Subtle, thin and compact */}
      <div
        className={`fixed flex items-center justify-center rounded-full transition-transform duration-75 ease-out ${
          cursorType === 'search'
            ? 'w-7 h-7 -ml-3.5 -mt-3.5 border border-emerald-600 dark:border-[#00ff66] bg-emerald-600/15 dark:bg-[#00ff66]/10 shadow-[0_0_8px_rgba(16,185,129,0.3)] dark:shadow-[0_0_8px_#00ff66]'
            : cursorType === 'hover'
            ? 'w-6 h-6 -ml-3 -mt-3 border border-emerald-600 dark:border-[#00ff66] bg-emerald-600/10 dark:bg-[#00ff66]/10 shadow-[0_0_6px_rgba(16,185,129,0.25)] dark:shadow-[0_0_6px_#00ff66]'
            : 'w-4.5 h-4.5 -ml-[9px] -mt-[9px] border border-emerald-600/60 dark:border-[#00ff66]/60 bg-transparent'
        }`}
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0)`,
        }}
      >
        {cursorType === 'search' ? (
          <Search className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00ff66] animate-pulse" />
        ) : null}
      </div>

      {/* Inner Dot (Compact glowing green center) */}
      {cursorType !== 'search' && (
        <div
          className="fixed w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-emerald-600 dark:bg-[#00ff66] shadow-[0_0_4px_rgba(16,185,129,0.6)] dark:shadow-[0_0_4px_#00ff66]"
          style={{
            transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          }}
        />
      )}
    </div>
  );
};
