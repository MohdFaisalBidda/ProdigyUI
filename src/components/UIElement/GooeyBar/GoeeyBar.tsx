'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';

/* ============================
   Types
============================ */

export interface StatusItem {
  id: string;
  icon: 'music' | 'cube' | 'cloud' | 'wifi' | 'battery' | 'clock' | 'custom';
  label?: string;
  value?: string;
  /** For 'custom' icon type — render your own SVG/node */
  customIcon?: React.ReactNode;
}

export interface GooeyBarProps {
  /** Items to display in the bar */
  items?: StatusItem[];
  /** Custom renderer for the tooltip content */
  renderContent?: (item: StatusItem) => React.ReactNode;
  /** Extra classes for the tooltip text */
  contentClassName?: string;
  /** Background color of bar and gooey blob (default: black) */
  barColor?: string;
  /** Text/icon color (default: white) */
  iconColor?: string;
  /** Extra class for outer wrapper */
  className?: string;
  /** Icon size class (default: 'w-5 h-5') */
  iconSize?: string;
  /** Button size class (default: 'w-10 h-10') */
  buttonSize?: string;
  /** Gap between buttons (default: 'gap-1') */
  gap?: string;
  /** Padding of main bar (default: 'px-3 py-2') */
  padding?: string;
}

/* ============================
   Default data
============================ */

export const defaultStatusItems: StatusItem[] = [
  { id: 'music', icon: 'music', label: 'Now Playing' },
  { id: 'cube', icon: 'cube', value: '3D View' },
  { id: 'cloud', icon: 'cloud', value: '72°F' },
  { id: 'wifi', icon: 'wifi', value: 'ProtonVPN' },
  { id: 'battery', icon: 'battery', value: '87%' },
  {
    id: 'clock',
    icon: 'clock',
    value: `${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} | ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
  },
];

/* ============================
   Icons
============================ */

function MusicIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="currentColor" className={className}>
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  );
}
function CubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="currentColor" className={className}>
      <path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.36.2-.8.2-1.14 0l-7.9-4.44A.991.991 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.36-.2.8-.2 1.14 0l7.9 4.44c.32.17.53.5.53.88v9z" />
    </svg>
  );
}
function CloudIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="currentColor" className={className}>
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
    </svg>
  );
}
function WifiIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="currentColor" className={className}>
      <path d="M12 18c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0-6c3.31 0 6 2.69 6 6h-2c0-2.21-1.79-4-4-4s-4 1.79-4 4H6c0-3.31 2.69-6 6-6zm0-4c4.97 0 9 4.03 9 9h-2c0-3.87-3.13-7-7-7s-7 3.13-7 7H3c0-4.97 4.03-9 9-9z" />
    </svg>
  );
}
function BatteryIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="currentColor" className={className}>
      <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
    </svg>
  );
}
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" fill="currentColor" className={className}>
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2z" />
    </svg>
  );
}

function IconComponent({ type, className, custom }: { type: StatusItem['icon']; className?: string; custom?: React.ReactNode }) {
  if (type === 'custom') return <>{custom}</>;
  switch (type) {
    case 'music': return <MusicIcon className={className} />;
    case 'cube': return <CubeIcon className={className} />;
    case 'cloud': return <CloudIcon className={className} />;
    case 'wifi': return <WifiIcon className={className} />;
    case 'battery': return <BatteryIcon className={className} />;
    case 'clock': return <ClockIcon className={className} />;
    default: return null;
  }
}

/* ============================
   Component
============================ */

export default function GooeyStatusBar({
  items = defaultStatusItems,
  renderContent,
  contentClassName = '',
  barColor = '#000000',
  iconColor = '#ffffff',
  className = '',
  iconSize = 'w-5 h-5',
  buttonSize = 'w-10 h-10',
  gap = 'gap-1',
  padding = 'px-3 py-2',
}: GooeyBarProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const targetX = useMotionValue(0);
  const targetOpacity = useMotionValue(0);

  const smoothX = useSpring(targetX, { stiffness: 350, damping: 28, mass: 0.8 });
  const smoothOpacity = useSpring(targetOpacity, { stiffness: 500, damping: 30 });

  const notchPath = useTransform(smoothX, () => `
    M 0 0 H 600
    C 560 0 530 14 500 30 C 470 44 430 50 380 50
    H 220
    C 170 50 130 44 100 30 C 70 14 40 0 0 0 Z
  `);

  useEffect(() => {
    if (!activeItem || !containerRef.current) {
      targetOpacity.set(0);
      return;
    }
    const index = items.findIndex(i => i.id === activeItem);
    const el = itemRefs.current[index];
    if (!el) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const itemRect = el.getBoundingClientRect();
    targetX.set(itemRect.left + itemRect.width / 2 - containerRect.left);
    targetOpacity.set(1);
  }, [activeItem, targetX, targetOpacity, items]);

  const activeData = useMemo(() => items.find(i => i.id === activeItem), [activeItem, items]);

  return (
    <div className={`flex justify-center w-full pt-4 ${className}`}>
      <div ref={containerRef} className="relative w-full">
        <div
          className={`flex items-center justify-center ${gap} ${padding}`}
          style={{ backgroundColor: barColor }}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              ref={el => (itemRefs.current[index] = el)}
              onMouseEnter={() => setActiveItem(item.id)}
              onMouseLeave={() => setActiveItem(null)}
            >
              <motion.button
                className={`flex items-center justify-center cursor-pointer ${buttonSize}`}
                style={{ color: iconColor }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconComponent type={item.icon} className={iconSize} custom={item.customIcon} />
              </motion.button>
            </div>
          ))}
        </div>

        <motion.div
          className="absolute pointer-events-none"
          style={{ left: smoothX, top: '100%', transform: 'translateX(-50%)', opacity: smoothOpacity }}
        >
          <svg width="350" height="80" viewBox="0 0 600 90" preserveAspectRatio="none">
            <motion.path d={notchPath} fill={barColor} />
          </svg>
          <div className="absolute inset-0 bottom-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {activeData && (
                <motion.div
                  key={activeData.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className={`text-xs font-medium ${contentClassName}`}
                  style={{ color: iconColor }}
                >
                  {renderContent ? renderContent(activeData) : activeData.value || activeData.label}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}