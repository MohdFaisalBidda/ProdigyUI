"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { componentRegistry, ComponentData, getComponentBySlug } from "@/lib/component-registry";

/* ─── Section Label ─────────────────────────────────────────────── */

function SectionLabel({ count, total, tag, tagColor, slug, name, description }: {
  count: string; total: string; tag: string; tagColor: string;
  slug: string; name: string; description: string;
}) {
  return (
    <div className="section-label flex items-start justify-between px-5 pt-8 pb-5 md:px-10 md:pt-10">

      <div className="flex flex-col gap-2.5 flex-1 min-w-0 pr-4">
        {/* counter + tag */}
        <div className="flex items-center gap-3">
          <span className="font-mono-jetbrains text-[11px] tracking-[0.15em] text-white/20">
            {count} / {total}
          </span>
          <div className="w-px h-4 bg-white/10" />
          {/* tagColor is dynamic — must stay inline */}
          <span className="font-mono-jetbrains text-[11px] tracking-[0.15em] uppercase" style={{ color: tagColor }}>
            {tag}
          </span>
        </div>

        <h2 className="font-syne text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-white tracking-[-0.02em] leading-none m-0">
          {name}
        </h2>

        <p className="font-mono-jetbrains text-xs text-white/35 leading-relaxed m-0 max-w-md">
          {description}
        </p>
      </div>

      {/* view docs — hidden on mobile, shown sm+ */}
      <Link
        href={`/components/${slug}`}
        className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-mono-jetbrains text-[11px] font-medium no-underline transition-transform duration-200 hover:scale-105"
        style={{ background: tagColor, color: '#0f0f0f' }}
      >
        View docs →
      </Link>
    </div>
  );
}

/* ─── IFrame Dialog ─────────────────────────────────────────────── */

function IFrameDialog({ component, onClose }: { component: ComponentData; onClose: () => void }) {
  const registryItem = getComponentBySlug(component.slug);
  const src = registryItem?.previewUrl;
  const [loaded, setLoaded] = useState(false);

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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const node = (
    <div className="fixed inset-0 flex flex-col bg-[#070707]" style={{ zIndex: 2147483647 }}>

      {/* Top bar */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3 md:px-5 bg-[rgba(7,7,7,0.95)] backdrop-blur-xl border-b border-white/[0.06] z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* dynamic color — inline */}
          <span
            className="font-mono-jetbrains text-[10px] rounded-full px-3 py-1 tracking-[0.1em] shrink-0"
            style={{
              color: component.tagColor,
              background: `${component.tagColor}15`,
              border: `1px solid ${component.tagColor}30`,
            }}
          >
            {component.tag}
          </span>
          <span className="font-syne text-base font-semibold text-white/90 truncate">
            {component.name}
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 ml-3">
          <Link
            href={`/components/${component.slug}`}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-mono-jetbrains text-[11px] font-medium text-black no-underline"
            style={{ background: component.tagColor }}
          >
            Docs →
          </Link>
          <button
            onClick={onClose}
            className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center cursor-pointer bg-white/[0.06] border border-white/10 transition-colors hover:bg-white/10"
          >
            <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Spinner */}
      {!loaded && (
        <div className="absolute top-[53px] inset-x-0 bottom-0 flex flex-col items-center justify-center gap-4 bg-[#070707]">
          <div
            className="w-10 h-10 rounded-full border-2 animate-spin"
            style={{ borderColor: `${component.tagColor}33`, borderTopColor: component.tagColor }}
          />
          <span className="font-mono-jetbrains text-[11px] text-white/30">Loading preview…</span>
        </div>
      )}

      {/* iframe */}
      <iframe
        src={src}
        onLoad={() => setLoaded(true)}
        className="flex-1 w-full border-none bg-[#070707] transition-opacity duration-300"
        style={{ opacity: loaded ? 1 : 0 }}
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
    <div className="relative">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setOpen(true)}
        className="flex flex-col items-center justify-center gap-5 min-h-[240px] md:min-h-[300px] p-6 md:p-8 rounded-2xl cursor-pointer transition-all duration-300"
        style={{
          background: hovered ? "rgba(255,255,255,0.03)" : "transparent",
          border: `1px solid ${hovered ? `${component.tagColor}33` : "transparent"}`,
        }}
      >
        {/* play circle — dynamic color inline */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300"
          style={{
            background: `${component.tagColor}18`,
            border: `1px solid ${component.tagColor}40`,
            transform: hovered ? "scale(1.1)" : "scale(1)",
          }}
        >
          <svg className="w-6 h-6 ml-0.5" style={{ color: component.tagColor }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>

        <div className="text-center">
          <p className="font-syne text-base font-bold text-white mb-1.5 m-0">{component.name}</p>
          <p className="font-mono-jetbrains text-[11px] text-white/30 leading-relaxed m-0 max-w-[280px]">
            {component.description}
          </p>
        </div>

        <span
          className="font-mono-jetbrains text-[11px] tracking-[0.06em] transition-opacity duration-200"
          style={{ color: component.tagColor, opacity: hovered ? 1 : 0.6 }}
        >
          Tap to preview →
        </span>
      </div>

      {open && <IFrameDialog component={component} onClose={close} />}
    </div>
  );
}

/* ─── Inline preview ─────────────────────────────────────────────── */

function InlinePreview({ component }: { component: ComponentData }) {
  const registryItem = getComponentBySlug(component.slug);

  if (registryItem?.preview) {
    return registryItem.preview;
  }

  return (
    <div className="flex items-center justify-center min-h-[240px]">
      <Link
        href={`/components/${component.slug}`}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono-jetbrains text-xs no-underline"
        style={{
          background: `${component.tagColor}20`,
          border: `1px solid ${component.tagColor}40`,
          color: component.tagColor,
        }}
      >
        View {component.name} →
      </Link>
    </div>
  );
}

/* ─── Main export ────────────────────────────────────────────────── */

export default function ComponentSection({ component, total }: { component: ComponentData; total: number }) {
  const registryItem = getComponentBySlug(component.slug);
  const needsDialog = !!registryItem?.previewUrl;

  return (
    <section className="relative border-b border-white/5">
      <SectionLabel
        count={component.index}
        total={String(total)}
        tag={component.tag}
        tagColor={component.tagColor}
        slug={component.slug}
        name={component.name}
        description={component.description}
      />

      {/* mobile-only "view docs" link */}
      <div className="sm:hidden px-5 pb-4">
        <Link
          href={`/components/${component.slug}`}
          className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-mono-jetbrains text-[11px] font-medium no-underline transition-transform duration-200 hover:scale-105"
          style={{ background: component.tagColor, color: '#0f0f0f' }}
        >
          View docs →
        </Link>
      </div>

      {/* preview box */}
      <div className="px-5 pb-8 md:px-10 md:pb-12">
        <div className="relative bg-[#0b0b0b] rounded-2xl overflow-hidden border border-white/[0.06]">
          {/* accent glow — dynamic color inline */}
          <div
            className="absolute top-0 left-0 w-48 h-24 pointer-events-none z-0"
            style={{ background: component.tagColor, opacity: 0.05, filter: "blur(60px)" }}
          />
          <div className="relative z-[1]">
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