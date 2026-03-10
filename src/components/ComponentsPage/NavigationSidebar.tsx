"use client";

import React from "react";
import Link from "next/link";
import { components, ComponentData } from "@/data/componentData";

interface NavigationSidebarProps {
  activeSlug?: string;
}

export default function NavigationSidebar({ activeSlug }: NavigationSidebarProps) {
  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "280px",
        height: "100vh",
        background: "rgba(7, 7, 7, 0.95)",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
        padding: "1.5rem 1rem",
        overflowY: "auto",
        zIndex: 50,
      }}
      className="hidden lg:block"
    >
      <div style={{ padding: "0 0.75rem", marginBottom: "1.5rem" }}>
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "0.875rem",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.02em",
          }}
        >
          Components
        </span>
        <span
          style={{
            display: "block",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            color: "rgba(255,255,255,0.25)",
            marginTop: "0.25rem",
          }}
        >
          {components.length} total
        </span>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {components.map((component) => {
          const isActive = activeSlug === component.slug;
          return (
            <Link
              key={component.slug}
              href={`/components/${component.slug}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.625rem 0.75rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
                background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                border: `1px solid ${isActive ? "rgba(255,255,255,0.1)" : "transparent"}`,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "9px",
                  color: isActive ? component.tagColor : "rgba(255,255,255,0.2)",
                  letterSpacing: "0.1em",
                  minWidth: "20px",
                }}
              >
                {component.index}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.4)",
                  transition: "color 0.2s",
                }}
              >
                {component.name}
              </span>
              {isActive && (
                <div
                  style={{
                    marginLeft: "auto",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: component.tagColor,
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div
        style={{
          marginTop: "auto",
          paddingTop: "1.5rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 0.75rem",
            borderRadius: "0.5rem",
            textDecoration: "none",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
        >
          <svg
            style={{ width: "14px", height: "14px" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </Link>
      </div>
    </aside>
  );
}
