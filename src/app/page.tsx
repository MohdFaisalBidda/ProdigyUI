"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import TeamSection from "@/components/UIElement/TeamSection/TeamSection";
import Cards from "../components/UIElement/StrokeCards/Cards";
import StrokeCards from "../components/UIElement/StrokeCards/StrokeCards";
import GooeyStatusBar from "@/components/UIElement/GooeyBar/GoeeyBar";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ─── Data ─────────────────────────────────────────────────────── */

const TEAM = [
  { image: "/img4.avif", name: "Jack" },
  { image: "/img2.avif", name: "Jane" },
  { image: "/img3.avif", name: "Bob" },
  { image: "/img1.avif", name: "John" },
  { image: "/img5.avif", name: "Lisa" },
  { image: "/img6.avif", name: "Harry" },
];

const COMPONENTS = [
  {
    slug: "stroke-cards",
    index: "01",
    name: "Stroke Cards",
    tag: "Interactive",
    tagColor: "#C8FF00",
    desc: "SVG path-drawing with masked hover reveals",
    snippet: `<Cards\n  imgSrc="/img.avif"\n  title="Motion"\n  strokeColor1="#C8FF00"\n  strokeColor2="#FF3B3B"\n/>`,
  },
  {
    slug: "team-section",
    index: "02",
    name: "Team Section",
    tag: "GSAP",
    tagColor: "#FF3B3B",
    desc: "Giant char-stagger reveal on image hover",
    snippet: `<TeamSection\n  defaultName="Our Squad"\n  members={team}\n  accentColor="#FF3B3B"\n/>`,
  },
  {
    slug: "gooey-bar",
    index: "03",
    name: "Gooey Bar",
    tag: "Motion",
    tagColor: "#7B6BFF",
    desc: "Fluid spring-physics status bar with blob drip",
    snippet: `<GooeyStatusBar\n  items={statusItems}\n  barColor="#000"\n  iconColor="#fff"\n/>`,
  },
];

const STROKE_CARDS = [
  { id: "1", imgSrc: "/img1.avif", title: "Motion Design", strokeColor1: "#C8FF00", strokeColor2: "#FF3B3B" },
  { id: "2", imgSrc: "/img2.avif", title: "Typography", strokeColor1: "#7B6BFF", strokeColor2: "#C8FF00" },
  { id: "3", imgSrc: "/img3.avif", title: "Color Systems", strokeColor1: "#FF3B3B", strokeColor2: "#7B6BFF" },
];

/* ─── Component Badge ──────────────────────────────────────────── */

function ComponentBadge({
  index,
  name,
  tag,
  tagColor,
  desc,
  snippet,
  slug,
}: (typeof COMPONENTS)[0]) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span
          className="font-mono text-xs tracking-widest"
          style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace" }}
        >
          {index}
        </span>
        <span
          className="font-mono text-xs tracking-widest uppercase rounded-full"
          style={{
            background: `${tagColor}22`,
            color: tagColor,
            border: `1px solid ${tagColor}44`,
            padding: "0.25rem 0.625rem",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
          }}
        >
          {tag}
        </span>
      </div>

      <h2
        className="font-bold tracking-tight leading-none"
        style={{
          fontFamily: "'Syne', sans-serif",
          color: "#fff",
          fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
        }}
      >
        {name}
      </h2>

      <p
        className="text-sm leading-relaxed"
        style={{
          color: "rgba(255,255,255,0.4)",
          maxWidth: "220px",
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 300,
        }}
      >
        {desc}
      </p>

      <div className="relative group" style={{ maxWidth: "260px" }}>
        <pre
          className="font-mono leading-relaxed cursor-pointer rounded-xl transition-colors overflow-hidden"
          style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.5)",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "0.75rem 1rem",
          }}
          onClick={() => {
            navigator.clipboard.writeText(snippet);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          <code>{snippet}</code>
          <span
            className="absolute top-2 right-2 transition-colors"
            style={{
              fontSize: "9px",
              fontFamily: "'JetBrains Mono', monospace",
              color: copied ? "rgba(200,255,0,0.8)" : "rgba(255,255,255,0.3)",
            }}
          >
            {copied ? "✓ copied" : "copy"}
          </span>
        </pre>
      </div>

      <Link
        href={`/components/${slug}`}
        className="inline-flex items-center gap-2 transition-colors"
        style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.4)",
          fontFamily: "'JetBrains Mono', monospace",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
      >
        View docs
        <svg
          style={{ width: "14px", height: "14px" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </Link>
    </div>
  );
}

/* ─── Section Label ─────────────────────────────────────────────── */

function SectionLabel({
  count,
  total,
  tag,
  tagColor,
  slug,
}: {
  count: string;
  total: string;
  tag: string;
  tagColor: string;
  slug: string;
}) {
  return (
    <div
      className="section-label flex items-center justify-between"
      style={{ padding: "2.5rem 2.5rem 1.5rem" }}
    >
      <div className="flex items-center gap-4">
        <span
          style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.15em",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {count} / {total}
        </span>
        <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.1)" }} />
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: tagColor,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {tag}
        </span>
      </div>
      <Link
        href={`/components/${slug}`}
        style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.25)",
          fontFamily: "'JetBrains Mono', monospace",
          textDecoration: "none",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
      >
        View docs →
      </Link>
    </div>
  );
}

/* ─── Mobile Component List ─────────────────────────────────────── */

function MobileComponentList() {
  const items = [
    {
      ...COMPONENTS[0],
      accent: "#C8FF00",
      previewImgs: ["/img1.avif", "/img2.avif", "/img3.avif"],
    },
    {
      ...COMPONENTS[1],
      accent: "#FF3B3B",
      previewImgs: ["/img4.avif", "/img2.avif", "/img5.avif"],
    },
    {
      ...COMPONENTS[2],
      accent: "#7B6BFF",
      previewImgs: [] as string[],
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "2rem 1.25rem 3rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Section header */}
      <div
        style={{
          paddingBottom: "1.5rem",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#fff",
          }}
        >
          Components
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.12em",
          }}
        >
          {items.length} total
        </span>
      </div>

      {/* Cards */}
      {items.map((item) => (
        <Link
          key={item.slug}
          href={`/components/${item.slug}`}
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              padding: "1.5rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "1rem",
              marginBottom: "0.75rem",
              overflow: "hidden",
            }}
          >
            {/* Subtle accent glow */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "120px",
                height: "60px",
                background: item.accent,
                opacity: 0.06,
                filter: "blur(40px)",
                borderRadius: "0 0 100% 0",
                pointerEvents: "none",
              }}
            />

            {/* Top row: index + tag + arrow */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.2)",
                    letterSpacing: "0.12em",
                  }}
                >
                  {item.index}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "9px",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase" as const,
                    color: item.accent,
                    background: `${item.accent}18`,
                    border: `1px solid ${item.accent}33`,
                    borderRadius: "9999px",
                    padding: "0.2rem 0.5rem",
                  }}
                >
                  {item.tag}
                </span>
              </div>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  style={{ width: "12px", height: "12px", color: "rgba(255,255,255,0.4)" }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>

            {/* Name + desc */}
            <div>
              <h3
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  marginBottom: "0.4rem",
                }}
              >
                {item.name}
              </h3>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.35)",
                  lineHeight: 1.6,
                  fontWeight: 300,
                }}
              >
                {item.desc}
              </p>
            </div>

            {/* Preview: image strip for card-based components */}
            {item.previewImgs.length > 0 && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {item.previewImgs.map((src, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      aspectRatio: "1 / 1",
                      borderRadius: "0.5rem",
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Preview: icon mockup for GooeyBar */}
            {item.previewImgs.length === 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.625rem",
                  padding: "1rem",
                  background: "rgba(0,0,0,0.4)",
                  borderRadius: "0.75rem",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {["♪", "⬡", "☁", "⌘", "▮", "◷"].map((icon, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "rgba(123,107,255,0.12)",
                      border: "1px solid rgba(123,107,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.45)",
                    }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            )}

            {/* View docs label */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  color: item.accent,
                  letterSpacing: "0.05em",
                }}
              >
                View docs
              </span>
              <svg
                style={{ width: "10px", height: "10px", color: item.accent }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* ─── Main ─────────────────────────────────────────────────────── */

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const heroWordRef = useRef<HTMLHeadingElement>(null);

  /* Lenis */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      touchMultiplier: 2,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => {
      lenis.raf(t);
      requestAnimationFrame(raf);
    };
    const id = requestAnimationFrame(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  /* Hero entrance */
  useEffect(() => {
    if (!heroWordRef.current) return;
    const ctx = gsap.context(() => {
      const split = SplitText.create(heroWordRef.current!, { type: "chars", mask: "chars" });
      gsap.from(split.chars, {
        yPercent: 100,
        duration: 1.1,
        ease: "power4.out",
        stagger: { amount: 0.35 },
        delay: 0.15,
      });
      gsap.to(heroRef.current, {
        yPercent: -10,
        opacity: 0.2,
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

  /* Section labels */
  useEffect(() => {
    document.querySelectorAll<HTMLElement>(".section-label").forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        x: -20,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
      });
    });
  }, []);

  return (
    <div
      style={{
        background: "#070707",
        color: "#fff",
        overflowX: "hidden",
        fontFamily: "'Syne', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0; }
        ::selection { background: #C8FF00; color: #000; }
      `}</style>

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
            ref={heroWordRef}
            className="text-[clamp(4.5rem,14vw,14rem)] font-bold leading-[0.88] tracking-[-0.04em]"
          >
            Build<br /><span style={{ color: "#C8FF00" }}>Different.</span>
          </h1>

          <p className="text-white/30 text-base max-w-sm leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 300 }}>
            Copy-paste animated components. Zero abstraction. Full control.
          </p>

          <div className="flex items-center gap-8">
            {[{ n: "MIT", l: "license" },{ n: "3", l: "components" },  { n: "TS", l: "typed" }].map(({ n, l }) => (
              <div key={l} className="flex flex-col items-center gap-0.5">
                <span className="text-2xl font-bold text-white">{n}</span>
                <span className="text-[10px] text-white/20 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{l}</span>
              </div>
            ))}
          </div>

          <Link
            href="/components"
            className="inline-flex items-center gap-3 rounded-full text-black text-sm font-bold tracking-wide hover:scale-[1.03] active:scale-[0.98] transition-transform"
            style={{ background: "#C8FF00", fontFamily: "'JetBrains Mono', monospace", padding: "0.75rem 2rem" }}
          >
            Browse components
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
          <span className="text-[9px] text-white/15 tracking-[0.25em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>scroll</span>
        </div>
      </section>

      {/* ── Mobile: component card list ── */}
      <div className="md:hidden">
        <MobileComponentList />
      </div>

      {/* ── Desktop: strip + live demos ── */}
      <div className="hidden md:block">

      {/* Strip */}
      <div
        style={{
          display: "flex",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {COMPONENTS.map((c, i) => (
          <div
            key={c.slug}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.875rem 0",
              borderRight: i < COMPONENTS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.15)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {c.name}
            </span>
          </div>
        ))}
      </div>

      {/* ══ 01 · STROKE CARDS ══ */}
      <section
        style={{
          position: "relative",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <SectionLabel
          count="01"
          total="03"
          tag="Interactive"
          tagColor="#C8FF00"
          slug="stroke-cards"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2.5rem",
            padding: "0 2.5rem 3rem",
          }}
          className="md:grid-cols-[1fr_auto]"
        >
          {/* Cards grid */}
          <StrokeCards cards={STROKE_CARDS} columns={3} gap="1rem" padding="0" />

          {/* Badge */}
          <div style={{ paddingTop: "0.5rem", minWidth: "260px" }}>
            <ComponentBadge {...COMPONENTS[0]} />
          </div>
        </div>
      </section>

      {/* ══ 02 · TEAM SECTION ══ */}
      <section
        style={{
          position: "relative",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "2.5rem 2.5rem 1.5rem",
            pointerEvents: "none",
          }}
          className="section-label"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.15em",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              02 / 03
            </span>
            <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.1)" }} />
            <span
              style={{
                fontSize: "11px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#FF3B3B",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              GSAP
            </span>
          </div>
          <Link
            href="/components/team-section"
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.25)",
              fontFamily: "'JetBrains Mono', monospace",
              textDecoration: "none",
              pointerEvents: "auto",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
          >
            View docs →
          </Link>
        </div>

        <TeamSection
          defaultName="Our Squad"
          members={TEAM}
          backgroundColor="#070707"
          textColor="#e3e3db"
          accentColor="#FF3B3B"
        />

        {/* Badge overlay on desktop */}
        <div
          style={{
            position: "absolute",
            bottom: "2.5rem",
            right: "2.5rem",
            zIndex: 20,
          }}
          className="hidden md:block"
        >
          <ComponentBadge {...COMPONENTS[1]} />
        </div>

        {/* Badge inline on mobile */}
        <div style={{ padding: "1.5rem 2.5rem 2.5rem" }} className="md:hidden">
          <ComponentBadge {...COMPONENTS[1]} />
        </div>
      </section>

      {/* ══ 03 · GOOEY BAR ══ */}
      <section
        style={{
          position: "relative",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <SectionLabel
          count="03"
          total="03"
          tag="Motion"
          tagColor="#7B6BFF"
          slug="gooey-bar"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "2.5rem",
            padding: "0 2.5rem 3rem",
          }}
          className="md:grid-cols-[1fr_auto]"
        >
          {/* Bar demo */}
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "3.5rem 1.5rem",
              background: "#0b0b0b",
              borderRadius: "1rem",
              minHeight: "180px",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "1rem",
                left: "1rem",
                fontSize: "10px",
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.1em",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              barColor=&quot;#C8FF00&quot;
            </span>
            <div style={{ width: "100%", maxWidth: "600px" }}>
              <GooeyStatusBar barColor="#C8FF00" iconColor="#000000" />
            </div>
          </div>

          {/* Badge */}
          <div style={{ paddingTop: "0.5rem", minWidth: "260px" }}>
            <ComponentBadge {...COMPONENTS[2]} />
          </div>
        </div>
      </section>

      </div> {/* end desktop-only wrapper */}

      {/* ══ CTA ══ */}
      <section
        style={{
          padding: "6rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: "3rem",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <h2
            style={{
              fontSize: "clamp(2.5rem, 5vw, 5rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.95,
              fontFamily: "'Syne', sans-serif",
            }}
          >
            Start building
            <br />
            <span style={{ color: "#C8FF00" }}>today.</span>
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.25)",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Every component is a copy-paste starting point. No lock-in.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "100%",
            maxWidth: "320px",
          }}
        >
          <Link
            href="/components"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              borderRadius: "9999px",
              background: "#C8FF00",
              color: "#000",
              fontSize: "0.875rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              padding: "0.75rem 2rem",
              fontFamily: "'JetBrains Mono', monospace",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#C8FF00")}
          >
            Browse all components →
          </Link>
          <a
            href="https://github.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.875rem",
              padding: "0.75rem 2rem",
              fontFamily: "'JetBrains Mono', monospace",
              textDecoration: "none",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "rgba(255,255,255,0.4)";
            }}
          >
            <svg viewBox="0 0 24 24" style={{ width: "16px", height: "16px" }} fill="currentColor">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            Star on GitHub
          </a>
        </div>
      </section>
    </div>
  );
}