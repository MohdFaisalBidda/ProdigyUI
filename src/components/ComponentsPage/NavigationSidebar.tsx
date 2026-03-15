"use client";

import React from "react";
import Link from "next/link";
import { components } from "@/lib/component-registry";

interface NavigationSidebarProps {
  activeSlug?: string;
}

export default function NavigationSidebar({ activeSlug }: NavigationSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col fixed top-0 right-0 w-[280px] h-screen bg-[rgba(7,7,7,0.95)] border-l border-white/[0.06] overflow-y-auto z-50">

      {/* Header */}
      <div className="px-4 py-6 shrink-0">
        <span className="font-syne text-sm font-bold text-white tracking-[-0.02em]">
          Components
        </span>
        <span className="block font-mono-jetbrains text-[10px] text-white/25 mt-1">
          {components.length} total
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-2 flex-1">
        {components.map((component) => {
          const isActive = activeSlug === component.slug;
          return (
            <Link
              key={component.slug}
              href={`/components/${component.slug}`}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg no-underline transition-all duration-200"
              style={{
                background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                border: `1px solid ${isActive ? "rgba(255,255,255,0.1)" : "transparent"}`,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <span
                className="font-mono-jetbrains text-[9px] tracking-[0.1em] min-w-[20px]"
                style={{ color: isActive ? component.tagColor : "rgba(255,255,255,0.2)" }}
              >
                {component.index}
              </span>
              <span
                className="font-mono-jetbrains text-[11px] transition-colors duration-200"
                style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.4)" }}
              >
                {component.name}
              </span>
              {isActive && (
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: component.tagColor }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Back to home */}
      <div className="shrink-0 mt-auto px-2 pb-4 pt-4 border-t border-white/[0.06]">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg font-mono-jetbrains text-[11px] text-white/40 no-underline transition-colors duration-200 hover:text-white"
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </Link>
      </div>
    </aside>
  );
}