"use client";

import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export interface SpringBackCardProps {
  children?: React.ReactNode;
  imgSrc?: string;
  imgAlt?: string;
  widthClass?: string;
  heightClass?: string;
  className?: string;
  style?: React.CSSProperties;
  initialRotation?: number;
  offsetX?: number;
  delay?: number;
  index?: number;
  interactive?: boolean;
  maxRotation?: number;
  maxX?: number;
  maxY?: number;
  lerpSpeed?: number;
}

interface SpringState {
  x: number;
  y: number;
  rotation: number;
  vx: number;
  vy: number;
  vr: number;
}

function SpringBackCard({
  children,
  imgSrc,
  imgAlt = "Card image",
  widthClass = "w-28 sm:w-32 md:w-40 lg:w-56",
  heightClass = "h-36 sm:h-40 md:h-52 lg:h-72",
  className = "",
  style,
  initialRotation = 0,
  offsetX = 0,
  delay = 0,
  index = 0,
  interactive = true,
  maxRotation = 18,
  maxX = 80,
  maxY = 60,
  lerpSpeed = 0.1,
}: SpringBackCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const state = useRef<SpringState>({
    x: 0, y: 0, rotation: initialRotation,
    vx: 0, vy: 0, vr: 0,
  });

  const rafId   = useRef<number | null>(null);
  const baseRot = useRef(initialRotation);

  // Cursor velocity tracking
  const cursor = useRef({ x: 0, y: 0, vx: 0, vy: 0, prevX: 0, prevY: 0, t: 0 });

  // ── Spring constants — buttery smooth ───────────────────────────────────────
  // Low stiffness = slow lazy return. High damping = glides to rest, no chop.
  // Just enough overshoot (damping < 1) for organic feel without ringing.
  const SPRING  = 0.048;  // soft pull — card drifts back lazily
  const DAMPING = 0.82;   // smooth glide, barely any oscillation
  const SETTLE  = 0.012;  // run longer so the tail-end float is visible

  // ── Physics loop ─────────────────────────────────────────────────────────────
  const runSpring = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;

    const s = state.current;

    s.vx = (s.vx - s.x * SPRING) * DAMPING;
    s.vy = (s.vy - s.y * SPRING) * DAMPING;
    s.vr = (s.vr - (s.rotation - baseRot.current) * SPRING) * DAMPING;

    s.x        += s.vx;
    s.y        += s.vy;
    s.rotation += s.vr;

    gsap.set(card, { x: offsetX + s.x, y: s.y, rotation: s.rotation });

    const settled =
      Math.abs(s.vx) < SETTLE && Math.abs(s.vy) < SETTLE && Math.abs(s.vr) < SETTLE &&
      Math.abs(s.x)  < SETTLE && Math.abs(s.y)  < SETTLE &&
      Math.abs(s.rotation - baseRot.current) < SETTLE;

    if (settled) {
      s.x = 0; s.y = 0; s.rotation = baseRot.current;
      s.vx = 0; s.vy = 0; s.vr = 0;
      gsap.set(card, { x: offsetX, y: 0, rotation: baseRot.current });
      rafId.current = null;
    } else {
      rafId.current = requestAnimationFrame(runSpring);
    }
  }, [offsetX]);

  const startSpring = useCallback(() => {
    if (!rafId.current) rafId.current = requestAnimationFrame(runSpring);
  }, [runSpring]);

  // ── Global mousemove: track cursor velocity ──────────────────────────────────
  const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
    const now = performance.now();
    const dt  = Math.max(1, now - cursor.current.t);
    cursor.current.vx    = ((e.clientX - cursor.current.prevX) / dt) * 16;
    cursor.current.vy    = ((e.clientY - cursor.current.prevY) / dt) * 16;
    cursor.current.prevX = cursor.current.x;
    cursor.current.prevY = cursor.current.y;
    cursor.current.x     = e.clientX;
    cursor.current.y     = e.clientY;
    cursor.current.t     = now;
  }, []);

  // ── mouseenter: edge crossing impulse ───────────────────────────────────────
  // Impulse is proportional to cursor speed. Soft cap via square-root so fast
  // moves hit harder but don't become jarring — preserves the smooth feel.
  const handleMouseEnter = useCallback((_e: MouseEvent) => {
    const cvx   = cursor.current.vx;
    const cvy   = cursor.current.vy;
    const speed = Math.sqrt(cvx * cvx + cvy * cvy);

    if (speed < 0.5) return;

    // sqrt scaling: slow = small nudge, fast = noticeably bigger, never extreme
    const imp = Math.sqrt(speed) * 0.55;
    const nx  = cvx / speed;
    const ny  = cvy / speed;

    state.current.vx += nx * imp;
    state.current.vy += ny * imp;
    state.current.vr += nx * imp * 0.35;

    startSpring();
  }, [startSpring]);

  // ── mousemove on card: continuous sweep accumulates gently ──────────────────
  // Each frame of fast movement adds a little more — repeated pushing travels further.
  const handleCardMouseMove = useCallback((_e: MouseEvent) => {
    const cvx   = cursor.current.vx;
    const cvy   = cursor.current.vy;
    const speed = Math.sqrt(cvx * cvx + cvy * cvy);

    if (speed < 1.5) return;

    // Small per-frame addition — accumulates with repeated sweeps
    const SWEEP_SCALE = 0.018;
    const nx = cvx / speed;
    const ny = cvy / speed;

    state.current.vx += nx * speed * SWEEP_SCALE;
    state.current.vy += ny * speed * SWEEP_SCALE;
    state.current.vr += nx * speed * SWEEP_SCALE * 0.3;

    startSpring();
  }, [startSpring]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !interactive) return;

    baseRot.current = initialRotation;
    gsap.set(card, { x: offsetX, y: 0, rotation: initialRotation });

    state.current = {
      x: 0, y: 0, rotation: initialRotation,
      vx: 0, vy: 0, vr: 0,
    };

    gsap.fromTo(
      card,
      { opacity: 0, scale: 0.85, y: 60 },
      {
        opacity: 1, scale: 1, y: 0,
        duration: 0.9,
        delay: delay + index * 0.12,
        ease: "back.out(1.4)",
      }
    );

    window.addEventListener("mousemove", handleGlobalMouseMove);
    card.addEventListener("mouseenter",  handleMouseEnter);
    card.addEventListener("mousemove",   handleCardMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      card.removeEventListener("mouseenter",  handleMouseEnter);
      card.removeEventListener("mousemove",   handleCardMouseMove);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [interactive, delay, index, offsetX, initialRotation,
      handleGlobalMouseMove, handleMouseEnter, handleCardMouseMove]);

  return (
    <div className={`spring-back-card-wrapper absolute ${className}`} style={style}>
      <div
        ref={cardRef}
        className={`spring-back-card overflow-hidden rounded-lg shadow-2xl cursor-pointer select-none will-change-transform pointer-events-auto ${widthClass} ${heightClass}`}
        style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
      >
        {children ? (
          children
        ) : imgSrc ? (
          <>
            <div className="w-full h-full relative">
              <img
                src={imgSrc}
                alt={imgAlt}
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent pointer-events-none" />
            </div>
            <div
              className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 40%, rgba(255,255,255,0.08) 100%)",
              }}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

export default SpringBackCard;