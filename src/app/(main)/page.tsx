"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ─── Static data ───────────────────────────────────────────────── */

const STATS = [
  { value: "8+", label: "Components" },
  { value: "MIT", label: "License" },
  { value: "TS", label: "Typed" },
  { value: "0", label: "Dependencies" },
];

const FEATURES = [
  {
    icon: "⌥",
    title: "Copy. Paste. Done.",
    body: "Every component ships as a single self-contained file. No wrappers, no providers, no runtime package to version-lock yourself into.",
  },
  {
    icon: "⬡",
    title: "Motion-first",
    body: "GSAP, Lenis, and spring physics baked in. Real scroll-driven animations — not CSS transitions pretending to be something more.",
  },
  {
    icon: "◈",
    title: "Full source control",
    body: "You own the file. Tweak easing curves, swap colors, rewrite the whole thing. No black box, no abstraction tax.",
  },
  {
    icon: "⌘",
    title: "Zero opinion on stack",
    body: "Works in any Next.js or React project using Tailwind CSS, Just drop the file in and install the listed peer deps.",
  },
];

const STACK = [
  { name: "GSAP", color: "#88CE02" },
  { name: "Lenis", color: "#C8FF00" },
  { name: "React", color: "#61DAFB" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Tailwind", color: "#38BDF8" },
];

const MARQUEE_ITEMS = [
  "Stroke Cards", "Team Section", "Gooey Bar",
  "Arc Slider", "More Space", "Spring Back",
  "Spotlight", "Infinite Contact",
];

/* ─── Command tabs ──────────────────────────────────────────────── */

const INSTALL_CMD = "npx prodigy-ui list";

function CommandWidget() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="group flex items-center gap-3 rounded-full border border-white/[0.08] px-5 py-2.5 hover:border-white/[0.16] transition-colors duration-200"
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <span className="text-[11px] select-none" style={{ color: "#C8FF00", fontFamily: "'JetBrains Mono', monospace" }}>$</span>
      <span className="text-[12px] text-white/45 tracking-wide" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {INSTALL_CMD}
      </span>
      <span className="transition-colors duration-200 text-white/20 group-hover:text-white/40">
        {copied ? (
          <svg className="w-3.5 h-3.5" style={{ color: "#C8FF00" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2v1" />
          </svg>
        )}
      </span>
    </button>
  );
}

/* ─── Marquee ───────────────────────────────────────────────────── */

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-white/5 py-3.5 select-none">
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #070707, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #070707, transparent)" }} />
      <div className="flex gap-10 animate-marquee whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-10 font-mono-jetbrains text-[11px] tracking-[0.2em] uppercase text-white/20">
            {item}
            <span className="text-white/10">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Feature card ──────────────────────────────────────────────── */

function FeatureCard({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="group flex flex-col gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300">
      <span className="text-2xl text-white/30 group-hover:text-[#C8FF00] transition-colors duration-300">
        {icon}
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="font-syne text-base font-bold text-white tracking-tight">{title}</h3>
        <p className="font-mono-jetbrains text-[11px] text-white/35 leading-relaxed font-light">{body}</p>
      </div>
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────────────── */

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);

  /* Lenis */
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

  /* Hero entrance */
  useEffect(() => {
    if (!titleRef.current || !subRef.current) return;
    const ctx = gsap.context(() => {
      const split = SplitText.create(titleRef.current!, { type: "chars", mask: "chars" });

      const tl = gsap.timeline({ delay: 0.1 });

      tl.from(split.chars, {
        yPercent: 110,
        duration: 1.0,
        ease: "power4.out",
        stagger: { amount: 0.3 },
      })
        .from(subRef.current, {
          opacity: 0, y: 16, duration: 0.7, ease: "power3.out",
        }, "-=0.4")
        .from(".hero-cta", {
          opacity: 0, y: 12, duration: 0.6, ease: "power3.out", stagger: 0.1,
        }, "-=0.4")
        .from(".hero-stat", {
          opacity: 0, y: 8, duration: 0.5, ease: "power2.out", stagger: 0.07,
        }, "-=0.3")
        .from(".hero-command", {
          opacity: 0, y: 10, duration: 0.5, ease: "power3.out",
        }, "-=0.2");

      /* parallax on scroll */
      gsap.to(heroRef.current, {
        yPercent: -8,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  /* Scroll-in for sections */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 30, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[#070707] text-white font-syne">

      {/* ══ HERO ══ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        {/* Lime glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#C8FF00] opacity-[0.04] blur-[160px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-8 max-w-6xl">
          <div className="flex items-center gap-3 text-[11px] text-white/25 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <span className="w-5 h-px bg-white/15" />
            Animated Component Library
            <span className="w-5 h-px bg-white/15" />
          </div>

          <h1
            ref={titleRef}
            className="text-[clamp(3rem,7vw,6rem)] font-bold leading-[0.88] tracking-[-0.04em]"
          >
            Animations worth
            <br />
            <span className="text-[#C8FF00]">noticing.</span>
          </h1>

          <p ref={subRef} className="text-white/30 text-xs md:text-base max-w-3xl leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 300 }}>
            Production-ready animated components built with GSAP and Lenis.
            Copy the source, drop it in your project, and customize every detail —
            no wrestling with third-party APIs or version conflicts.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8">
            {[{ n: "MIT", l: "license" }, { n: STATS[0].value, l: "components" }, { n: "TS", l: "typed" }].map(({ n, l }) => (
              <div key={l} className="hero-stat flex flex-col items-center gap-0.5">
                <span className="text-2xl font-bold text-white">{n}</span>
                <span className="text-[10px] text-white/20 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{l}</span>
              </div>
            ))}
          </div>

          {/* ── Command widget ── */}
          <div className="hero-command flex justify-center">
            <CommandWidget />
          </div>
          
          {/* CTA button */}
          <Link
            href="/components"
            className="hero-cta inline-flex items-center gap-3 rounded-full text-black text-sm font-bold tracking-wide hover:scale-[1.03] active:scale-[0.98] transition-transform"
            style={{ background: "#C8FF00", fontFamily: "'JetBrains Mono', monospace", padding: "0.75rem 2rem" }}
          >
            Browse components
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>

        </div>

        <div className="absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
          <span className="text-[9px] text-white/15 tracking-[0.25em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>scroll</span>
        </div>
      </section>

      {/* ══ MARQUEE ═══════════════════════════════════════════════ */}
      <Marquee />

      {/* ══ HOW IT WORKS ══════════════════════════════════════════ */}
      <section className="reveal-up max-w-6xl mx-auto px-5 md:px-10 py-20 md:py-28">

        <div className="flex items-center gap-4 mb-10">
          <span className="font-mono-jetbrains text-[10px] text-white/20 tracking-[0.2em] uppercase">How it works</span>
          <div className="flex-1 h-px bg-white/[0.06] max-w-[60px]" />
        </div>

        <h2 className="font-syne text-[clamp(2rem,3vw,3rem)] font-extrabold tracking-[-0.03em] leading-[0.95] text-white mb-16 max-w-3xl">
          Find a component.<br />
          <span className="text-white/30">Run one command.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden">
          {[
            { step: "01", action: "Browse", detail: "Pick a component from the library. Preview it live, read the docs." },
            { step: "02", action: "Install", detail: "Run npx prodigy-ui add <name>. The file lands in your project." },
            { step: "03", action: "Ship", detail: "Own the source. Tweak it, extend it, delete it. No upstream breakage." },
          ].map(({ step, action, detail }) => (
            <div key={step} className="flex flex-col gap-5 p-7 md:p-8 bg-[#070707] hover:bg-white/[0.02] transition-colors duration-200">
              <span className="font-mono-jetbrains text-[10px] text-[#C8FF00]/50 tracking-[0.2em]">{step}</span>
              <h3 className="font-syne text-3xl md:text-4xl font-extrabold text-white tracking-[-0.02em]">{action}</h3>
              <p className="font-mono-jetbrains text-[11px] text-white/30 leading-relaxed font-light">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FEATURES GRID ═════════════════════════════════════════ */}
      <section className="reveal-up max-w-6xl mx-auto px-5 md:px-10 pb-20 md:pb-28">

        <div className="flex items-center gap-4 mb-10">
          <span className="font-mono-jetbrains text-[10px] text-white/20 tracking-[0.2em] uppercase">Why this</span>
          <div className="flex-1 h-px bg-white/[0.06] max-w-[60px]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ══ STACK STRIP ═══════════════════════════════════════════ */}
      <section className="reveal-up border-y border-white/[0.05] py-8 px-5 md:px-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <span className="font-mono-jetbrains text-[10px] text-white/20 tracking-[0.18em] uppercase shrink-0">
            Peer deps
          </span>
          <div className="flex flex-wrap gap-3">
            {STACK.map(({ name, color }) => (
              <span
                key={name}
                className="font-mono-jetbrains text-[11px] rounded-full px-3.5 py-1.5 border tracking-wide"
                style={{
                  color,
                  background: `${color}10`,
                  borderColor: `${color}25`,
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════════ */}
      <section className="reveal-up flex flex-col items-center text-center gap-8 px-5 md:px-10 py-24 md:py-36">

        <span
          className="font-syne font-extrabold text-[clamp(5rem,18vw,18rem)] leading-none tracking-[-0.05em] select-none pointer-events-none text-zinc-500/10"
          aria-hidden
        >
          {STATS[0].value}
        </span>

        <div className="-mt-[clamp(4rem,14vw,14rem)] flex flex-col items-center gap-6">
          <h2 className="font-syne text-[clamp(2.5rem,6vw,6rem)] font-extrabold tracking-[-0.04em] leading-[0.92]">
            Start building
            <br />
            <span className="text-[#C8FF00]">today.</span>
          </h2>

          <p className="font-mono-jetbrains text-xs text-white/25 max-w-xs leading-relaxed">
            Every component is a copy-paste starting point. No lock-in, no surprises.
          </p>

          <Link
            href="/components"
            className="inline-flex items-center gap-2.5 rounded-full bg-[#C8FF00] text-black font-mono-jetbrains text-sm font-bold px-8 py-3.5 hover:bg-white transition-colors duration-200"
          >
            Browse all components →
          </Link>
        </div>
      </section>

    </div>
  );
}