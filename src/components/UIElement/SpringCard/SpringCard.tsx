"use client";

import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

export interface SpringCardProps {
  /** Image source URL */
  imgSrc: string;
  /** Alt text for the image */
  imgAlt?: string;
  /** Initial rotation angle in degrees */
  initialRotation?: number;
  /** Horizontal offset from center */
  offsetX?: number;
  /** Card width class (Tailwind classes) */
  widthClass?: string;
  /** Card height class (Tailwind classes) */
  heightClass?: string;
  /** Additional CSS classes */
  className?: string;
  /** Index for staggered animations */
  index?: number;
  /** Animation delay in seconds */
  delay?: number;
  /** Whether the card should respond to mouse/touch */
  interactive?: boolean;
}

/**
 * A spring-back card component with physics-based animations.
 * Inspired by truus.co - features smooth inertia-based movement
 * that springs back when released.
 */
function SpringCard({
  imgSrc,
  imgAlt = "Card image",
  initialRotation = 0,
  offsetX = 0,
  widthClass = "w-32 md:w-40 lg:w-56",
  heightClass = "h-40 md:h-52 lg:h-72",
  className = "",
  index = 0,
  delay = 0,
  interactive = true,
}: SpringCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const velocity = useRef({ x: 0, y: 0, rotation: 0 });
  const position = useRef({ x: 0, y: 0, rotation: 0 });
  const lastPointer = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number | null>(null);

  // Handle pointer movement
  const handlePointerMove = useCallback(
    (e: PointerEvent | TouchEvent) => {
      if (!interactive || !cardRef.current) return;

      const clientX = "touches" in e ? e.touches[0].clientX : (e as PointerEvent).clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : (e as PointerEvent).clientY;

      // Calculate movement from initial position
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (clientX - centerX) * 0.08;
      const deltaY = (clientY - centerY) * 0.08;
      const rotation = deltaX * 0.15;

      // Smooth update
      gsap.to(cardRef.current, {
        x: deltaX,
        y: deltaY,
        rotation: rotation + initialRotation,
        duration: 0.3,
        ease: "power2.out",
      });
    },
    [interactive, initialRotation]
  );

  // Handle pointer leave - spring back
  const handlePointerLeave = useCallback(() => {
    if (!interactive || !cardRef.current) return;

    gsap.to(cardRef.current, {
      x: 0,
      y: 0,
      rotation: initialRotation,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });
  }, [interactive, initialRotation]);

  // Handle pointer down for drag
  const handlePointerDown = useCallback(
    (e: PointerEvent | TouchEvent) => {
      if (!interactive) return;
      isDragging.current = true;

      const clientX = "touches" in e ? e.touches[0].clientX : (e as PointerEvent).clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : (e as PointerEvent).clientY;

      lastPointer.current = { x: clientX, y: clientY };
      velocity.current = { x: 0, y: 0, rotation: 0 };
    },
    [interactive]
  );

  // Handle pointer up
  const handlePointerUp = useCallback(() => {
    if (!interactive) return;
    isDragging.current = false;

    // Spring back to original position
    gsap.to(cardRef.current, {
      x: 0,
      y: 0,
      rotation: initialRotation,
      duration: 1,
      ease: "elastic.out(1, 0.4)",
    });
  }, [interactive, initialRotation]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Set initial position
    gsap.set(card, {
      x: offsetX,
      rotation: initialRotation,
    });

    // Add event listeners
    const onPointerMove = (e: PointerEvent) => handlePointerMove(e);
    const onPointerDown = (e: PointerEvent) => handlePointerDown(e);
    const onPointerUp = () => handlePointerUp();
    const onPointerLeave = () => handlePointerLeave();
    const onTouchMove = (e: TouchEvent) => handlePointerMove(e);
    const onTouchStart = (e: TouchEvent) => handlePointerDown(e);
    const onTouchEnd = () => handlePointerUp();

    if (interactive) {
      card.addEventListener("pointermove", onPointerMove);
      card.addEventListener("pointerdown", onPointerDown);
      card.addEventListener("pointerup", onPointerUp);
      card.addEventListener("pointerleave", onPointerLeave);
      card.addEventListener("pointercancel", onPointerLeave);
      card.addEventListener("touchmove", onTouchMove, { passive: true });
      card.addEventListener("touchstart", onTouchStart, { passive: true });
      card.addEventListener("touchend", onTouchEnd);
    }

    // Entry animation
    gsap.fromTo(
      card,
      {
        opacity: 0,
        scale: 0.8,
        y: 100,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        delay: delay + index * 0.1,
        ease: "back.out(1.7)",
      }
    );

    return () => {
      if (interactive) {
        card.removeEventListener("pointermove", onPointerMove);
        card.removeEventListener("pointerdown", onPointerDown);
        card.removeEventListener("pointerup", onPointerUp);
        card.removeEventListener("pointerleave", onPointerLeave);
        card.removeEventListener("pointercancel", onPointerLeave);
        card.removeEventListener("touchmove", onTouchMove);
        card.removeEventListener("touchstart", onTouchStart);
        card.removeEventListener("touchend", onTouchEnd);
      }
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [
    handlePointerMove,
    handlePointerDown,
    handlePointerUp,
    handlePointerLeave,
    delay,
    index,
    interactive,
    offsetX,
    initialRotation,
  ]);

  return (
    <div
      ref={cardRef}
      className={`spring-card absolute overflow-hidden rounded-lg shadow-2xl cursor-pointer select-none ${widthClass} ${heightClass} ${className}`}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {/* Card Image */}
      <div className="w-full h-full relative">
        <img
          src={imgSrc}
          alt={imgAlt}
          className="w-full h-full object-cover"
          draggable={false}
        />
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent pointer-events-none" />
      </div>

      {/* Card shine effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)",
        }}
      />
    </div>
  );
}

export default SpringCard;
