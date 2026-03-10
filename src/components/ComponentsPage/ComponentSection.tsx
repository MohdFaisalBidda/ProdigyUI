"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ComponentData } from "@/data/componentData";
import StrokeCards from "@/components/UIElement/StrokeCards/StrokeCards";
import TeamSection from "@/components/UIElement/TeamSection/TeamSection";
import GooeyStatusBar from "@/components/UIElement/GooeyBar/GoeeyBar";
import InfiniteSlider from "@/components/UIElement/InfiniteSlider/page";

const STROKE_CARDS = [
  { id: "1", imgSrc: "/img1.avif", title: "Motion Design", strokeColor1: "#C8FF00", strokeColor2: "#FF3B3B" },
  { id: "2", imgSrc: "/img2.avif", title: "Typography", strokeColor1: "#7B6BFF", strokeColor2: "#C8FF00" },
  { id: "3", imgSrc: "/img3.avif", title: "Color Systems", strokeColor1: "#FF3B3B", strokeColor2: "#7B6BFF" },
];

const TEAM_MEMBERS = [
  { image: "/img4.avif", name: "Jack" },
  { image: "/img2.avif", name: "Jane" },
  { image: "/img3.avif", name: "Bob" },
  { image: "/img1.avif", name: "John" },
  { image: "/img5.avif", name: "Lisa" },
  { image: "/img6.avif", name: "Harry" },
];

/*
 * DIALOG_SLUGS → components rendered inside an <iframe> pointing at their
 * own Next.js page route.  This gives them a completely isolated window,
 * scroll, Lenis instance, and GSAP context — identical to visiting the page
 * directly.  No window-scroll hacks, no Lenis conflicts.
 *
 * The iframe src must match the actual page route for each component.
 * Adjust the paths below if your file-system routes differ.
 */
const DIALOG_IFRAME_ROUTES: Record<string, string> = {
  "more-space-scroll": "/preview/more-space-scroll",
  "infinte-contact": "/preview/infinte-contact",
  "glowing-light": "/preview/glowing-light",
  "spring-back-card": "/preview/spring-back-card",
  "infinite-slider": "/preview/infinite-slider",
};

/* ─── Section Label ─────────────────────────────────────────────── */

function SectionLabel({ count, total, tag, tagColor, slug, name, description }: {
  count: string; total: string; tag: string; tagColor: string;
  slug: string; name: string; description: string;
}) {
  return (
    <div
      className="section-label"
      style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "2.5rem 2.5rem 1.5rem" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", fontFamily: "'JetBrains Mono', monospace" }}>
            {count} / {total}
          </span>
          <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.1)" }} />
          <span style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: tagColor, fontFamily: "'JetBrains Mono', monospace" }}>
            {tag}
          </span>
        </div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, margin: 0 }}>
          {name}
        </h2>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "rgba(255,255,255,0.35)", maxWidth: "500px", lineHeight: 1.6, margin: 0 }}>
          {description}
        </p>
      </div>
      <Link
        href={`/components/${slug}`}
        style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", fontFamily: "'JetBrains Mono', monospace", textDecoration: "none", transition: "color 0.2s", flexShrink: 0 }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
      >
        View docs →
      </Link>
    </div>
  );
}

/* ─── IFrame Dialog ─────────────────────────────────────────────── */
/*
 * Renders into document.body via a portal so no parent CSS can interfere.
 * The <iframe> loads the component's own page route, giving it a fully
 * isolated browsing context: own window, own scroll, own Lenis/GSAP.
 */

function IFrameDialog({ component, onClose }: { component: ComponentData; onClose: () => void }) {
  const src = DIALOG_IFRAME_ROUTES[component.slug];
  const [loaded, setLoaded] = useState(false);

  /* Freeze page scroll */
  useEffect(() => {
    const htmlPrev = document.documentElement.style.overflow;
    const bodyPrev = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = htmlPrev;
      document.body.style.overflow = bodyPrev;
    };
  }, []);

  /* Esc to close */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const node = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        display: "flex",
        flexDirection: "column",
        background: "#070707",
      }}
    >
      {/* Top bar */}
      <div style={{
        flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.75rem 1.25rem",
        background: "rgba(7,7,7,0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        zIndex: 1,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
            color: component.tagColor, background: `${component.tagColor}15`,
            border: `1px solid ${component.tagColor}30`,
            borderRadius: "9999px", padding: "0.3rem 0.7rem", letterSpacing: "0.1em",
          }}>{component.tag}</span>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
            {component.name}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Link
            href={`/components/${component.slug}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              padding: "0.45rem 1rem", background: component.tagColor,
              borderRadius: "9999px", color: "#000",
              fontFamily: "'JetBrains Mono', monospace", fontSize: "11px",
              fontWeight: 500, textDecoration: "none",
            }}
          >
            Docs →
          </Link>
          <button
            onClick={onClose}
            style={{
              width: "34px", height: "34px", flexShrink: 0,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "50%", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg style={{ width: "15px", height: "15px", color: "rgba(255,255,255,0.7)" }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Loading shimmer — shown until iframe fires onLoad */}
      {!loaded && (
        <div style={{
          position: "absolute", inset: "53px 0 0 0",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#070707", zIndex: 0,
        }}>
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem",
          }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              border: `2px solid ${component.tagColor}33`,
              borderTopColor: component.tagColor,
              animation: "spin 0.8s linear infinite",
            }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
              Loading preview…
            </span>
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* The iframe — gets its own window/scroll/Lenis */}
      <iframe
        src={src}
        onLoad={() => setLoaded(true)}
        style={{
          flex: 1,
          width: "100%",
          border: "none",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s",
          background: "#070707",
        }}
        allow="autoplay"
      />
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(node, document.body);
}

/* ─── Dialog Trigger Card ────────────────────────────────────────── */

function DialogTriggerCard({ component }: { component: ComponentData }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <div style={{ position: "relative" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setOpen(true)}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: "1.25rem",
          minHeight: "300px", padding: "2rem",
          background: hovered ? "rgba(255,255,255,0.03)" : "transparent",
          borderRadius: "1rem", cursor: "pointer",
          transition: "background 0.25s",
          border: `1px solid ${hovered ? `${component.tagColor}33` : "transparent"}`,
        }}
      >
        <div style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: `${component.tagColor}18`,
          border: `1px solid ${component.tagColor}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.25s",
          transform: hovered ? "scale(1.1)" : "scale(1)",
        }}>
          <svg style={{ width: "22px", height: "22px", color: component.tagColor, marginLeft: "3px" }}
            fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#fff", margin: "0 0 0.35rem" }}>
            {component.name}
          </p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.3)", lineHeight: 1.5, margin: 0, maxWidth: "280px" }}>
            {component.description}
          </p>
        </div>

        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: "11px",
          color: component.tagColor, letterSpacing: "0.06em",
          opacity: hovered ? 1 : 0.6, transition: "opacity 0.2s",
        }}>
          Click to preview →
        </span>
      </div>

      {open && <IFrameDialog component={component} onClose={close} />}
    </div>
  );
}

/* ─── Inline preview ─────────────────────────────────────────────── */

function InlinePreview({ component }: { component: ComponentData }) {
  switch (component.slug) {
    case "stroke-cards":
      return (
        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 2rem" }}>
            <StrokeCards cards={STROKE_CARDS} columns={3} gap="1rem" padding="0" />
        </div>
      )


    case "team-section":
      return (
        <TeamSection
          defaultName="Our Squad"
          members={TEAM_MEMBERS}
          backgroundColor="#070707"
          textColor="#e3e3db"
          accentColor={component.tagColor}
        />
      );

    case "gooey-bar":
      return (
        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 2rem" }}>
          <div style={{ width: "100%", maxWidth: "600px" }}>
            <GooeyStatusBar barColor={component.tagColor} iconColor="#000000" />
          </div>
        </div>
      );

    case "infinite-slider":
      return (
        <div style={{ width: "100%", height: "100vh", position: "relative", overflow: "hidden" }}>
          <InfiniteSlider />
        </div>
      );

    default:
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
          <Link
            href={`/components/${component.slug}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              background: `${component.tagColor}20`, border: `1px solid ${component.tagColor}40`,
              borderRadius: "9999px", color: component.tagColor,
              fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", textDecoration: "none",
            }}
          >
            View {component.name} →
          </Link>
        </div>
      );
  }
}

/* ─── Main export ────────────────────────────────────────────────── */

export default function ComponentSection({ component, total }: { component: ComponentData; total: number }) {
  const needsDialog = component.slug in DIALOG_IFRAME_ROUTES;

  return (
    <section style={{ position: "relative", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <SectionLabel
        count={component.index}
        total={String(total)}
        tag={component.tag}
        tagColor={component.tagColor}
        slug={component.slug}
        name={component.name}
        description={component.description}
      />

      <div style={{ padding: "0 2.5rem 3rem" }}>
        <div style={{
          position: "relative",
          background: "#0b0b0b",
          borderRadius: "1rem",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          {/* accent glow */}
          <div style={{
            position: "absolute", top: 0, left: 0,
            width: "200px", height: "100px",
            background: component.tagColor, opacity: 0.05,
            filter: "blur(60px)", pointerEvents: "none", zIndex: 0,
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            {needsDialog
              ? <DialogTriggerCard component={component} />
              : <InlinePreview component={component} />
            }
          </div>
        </div>
      </div>
    </section>
  );
}