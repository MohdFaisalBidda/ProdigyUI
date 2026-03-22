"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { components } from "@/lib/component-registry";
import NavigationSidebar from "@/components/ComponentsPage/NavigationSidebar";
import ComponentSection from "@/components/ComponentsPage/ComponentSection";

gsap.registerPlugin(ScrollTrigger);

export default function ComponentsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      touchMultiplier: 2,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    const id = requestAnimationFrame(raf);
    gsap.ticker.lagSmoothing(0);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".section-label", {
        opacity: 0, x: -20, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ".section-label", start: "top 90%" },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const total = components.length;
  const totalStr = String(total).padStart(2, "0");

  return (
    <div ref={containerRef} className="bg-[#070707] text-white min-h-screen overflow-x-hidden font-syne">

      <NavigationSidebar />

      {/* offset for sidebar on large screens */}
      <div className="lg:mr-[280px]">

        {/* ── Header ── */}
        <header className="px-5 pt-10 pb-7 md:px-10 border-b border-white/5">
          <h1 className="font-syne text-[clamp(2rem,6vw,4rem)] font-extrabold tracking-[-0.04em] leading-[0.9] m-0">
            Components
          </h1>
          <p className="font-mono-jetbrains text-xs text-white/35 font-light leading-relaxed mt-3 max-w-sm">
            Copy-paste animated components. Zero abstraction. Full control.
          </p>
        </header>

        {/* ── Stats bar ── */}
        <div className="flex items-center gap-4 px-5 md:px-10 py-3 border-b border-white/5 bg-black/20">
          <span className="font-mono-jetbrains text-[10px] text-white/20 tracking-[0.12em]">
            {totalStr} TOTAL
          </span>
          <div className="w-px h-4 bg-white/10" />
          <span className="hidden sm:inline font-mono-jetbrains text-[10px] text-white/25">
            Click any component to view docs
          </span>
        </div>

        {/* ── Component sections ── */}
        {components.map((component) => (
          <ComponentSection key={component.slug} component={component} total={total} />
        ))}

        {/* ── All components grid ── */}
        {/* <section className="px-5 md:px-10 py-12 md:py-16 border-t border-white/5">
          <h2 className="font-syne text-xl md:text-2xl font-bold mb-6">
            All Components
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {components.map((component) => (
              <ComponentCard key={component.slug} component={component} />
            ))}
          </div>
        </section> */}

      </div>
    </div>
  );
}