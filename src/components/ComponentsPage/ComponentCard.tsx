"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ComponentData } from "@/lib/component-registry";

export default function ComponentCard({ component }: { component: ComponentData }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/components/${component.slug}`} className="no-underline block">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex flex-col rounded-2xl overflow-hidden bg-[#0e0e0e] cursor-pointer transition-colors duration-300"
        style={{ border: `1px solid ${hovered ? `${component.tagColor}44` : "rgba(255,255,255,0.07)"}` }}
      >
        {/* Card header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="font-mono-jetbrains text-[9px] text-white/20 tracking-[0.12em]">
              {component.index}
            </span>
            {/* dynamic tag color inline */}
            <span
              className="font-mono-jetbrains text-[9px] tracking-[0.12em] uppercase rounded-full px-2 py-0.5"
              style={{
                color: component.tagColor,
                background: `${component.tagColor}18`,
                border: `1px solid ${component.tagColor}30`,
              }}
            >
              {component.tag}
            </span>
          </div>
          <span
            className="font-syne text-[0.8rem] font-bold tracking-[-0.01em] transition-colors duration-200"
            style={{ color: hovered ? "#fff" : "rgba(255,255,255,0.6)" }}
          >
            {component.name}
          </span>
        </div>

        {/* Preview area */}
        <div className="relative w-full overflow-hidden bg-[#080808]" style={{ aspectRatio: "4/3" }}>
          {/* gradient placeholder */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${component.tagColor}10 0%, transparent 100%)` }}
          >
            <span
              className="font-syne text-5xl font-extrabold opacity-[0.15]"
              style={{ color: component.tagColor }}
            >
              {component.index}
            </span>
          </div>
          {/* vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(7,7,7,0.5) 100%)" }} />
          {/* accent glow */}
          <div
            className="absolute top-0 left-0 w-[120px] h-20 pointer-events-none transition-opacity duration-300"
            style={{ background: component.tagColor, opacity: hovered ? 0.1 : 0, filter: "blur(40px)" }}
          />
        </div>

        {/* Card footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
          <p className="font-mono-jetbrains text-[10px] text-white/30 font-light m-0 leading-snug">
            {component.description.split(".")[0]}.
          </p>
          {/* dynamic arrow button */}
          <div
            className="w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 ml-3 transition-all duration-300"
            style={{
              background: hovered ? component.tagColor : "rgba(255,255,255,0.06)",
              border: `1px solid ${hovered ? component.tagColor : "rgba(255,255,255,0.1)"}`,
              transform: hovered ? "translate(2px,-2px)" : "none",
            }}
          >
            <svg
              className="w-[11px] h-[11px]"
              style={{ color: hovered ? "#000" : "rgba(255,255,255,0.5)" }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}