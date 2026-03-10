"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ComponentData } from "@/data/componentData";

interface ComponentCardProps {
  component: ComponentData;
}

export default function ComponentCard({ component }: ComponentCardProps) {
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(component.snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Link href={`/components/${component.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          flexDirection: "column",
          borderRadius: "0.875rem",
          overflow: "hidden",
          border: `1px solid ${hovered ? `${component.tagColor}44` : "rgba(255,255,255,0.07)"}`,
          background: "#0e0e0e",
          cursor: "pointer",
          transition: "border-color 0.25s",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 1rem",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.12em",
              }}
            >
              {component.index}
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: component.tagColor,
                background: `${component.tagColor}18`,
                border: `1px solid ${component.tagColor}30`,
                borderRadius: "9999px",
                padding: "0.15rem 0.5rem",
              }}
            >
              {component.tag}
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: hovered ? "#fff" : "rgba(255,255,255,0.6)",
              letterSpacing: "-0.01em",
              transition: "color 0.2s",
            }}
          >
            {component.name}
          </span>
        </div>

        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "4 / 3",
            overflow: "hidden",
            background: "#080808",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${component.tagColor}10 0%, transparent 100%)`,
            }}
          >
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "3rem",
                fontWeight: 800,
                color: component.tagColor,
                opacity: 0.15,
              }}
            >
              {component.index}
            </span>
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at center, transparent 50%, rgba(7,7,7,0.5) 100%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "120px",
              height: "80px",
              background: component.tagColor,
              opacity: hovered ? 0.1 : 0,
              filter: "blur(40px)",
              transition: "opacity 0.35s",
              pointerEvents: "none",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.75rem 1rem",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              color: "rgba(255,255,255,0.3)",
              fontWeight: 300,
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {component.description.split(".")[0]}.
          </p>
          <div
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "50%",
              background: hovered ? component.tagColor : "rgba(255,255,255,0.06)",
              border: `1px solid ${hovered ? component.tagColor : "rgba(255,255,255,0.1)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginLeft: "0.75rem",
              transition: "background 0.25s, border-color 0.25s, transform 0.25s",
              transform: hovered ? "translate(2px,-2px)" : "none",
            }}
          >
            <svg
              style={{ width: "11px", height: "11px", color: hovered ? "#000" : "rgba(255,255,255,0.5)" }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
