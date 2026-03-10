"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { components } from "@/data/componentData";
import NavigationSidebar from "@/components/ComponentsPage/NavigationSidebar";
import ComponentSection from "@/components/ComponentsPage/ComponentSection";
import ComponentCard from "@/components/ComponentsPage/ComponentCard";

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".section-label", {
        opacity: 0,
        x: -20,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".section-label",
          start: "top 90%",
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const total = components.length;
  const totalStr = String(total).padStart(2, "0");

  return (
    <div
      ref={containerRef}
      style={{
        background: "#070707",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "'Syne', sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0; }
        ::selection { background: #C8FF00; color: #000; }
      `}</style>

      <NavigationSidebar />

      <div style={{ marginRight: "280px" }} className="lg:mr-[280px]">
        <header
          style={{
            padding: "3rem 2.5rem 2rem",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "rgba(255,255,255,0.3)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
            >
              <svg style={{ width: "14px", height: "14px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Home
            </Link>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "0.06em",
              }}
            >
              Components
            </span>
          </div>

          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 0.9,
              margin: 0,
            }}
          >
            Components
          </h1>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
              color: "rgba(255,255,255,0.35)",
              fontWeight: 300,
              lineHeight: 1.6,
              marginTop: "0.75rem",
              maxWidth: "400px",
            }}
          >
            Copy-paste animated components. Zero abstraction. Full control.
          </p>
        </header>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "1rem 2.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.12em",
            }}
          >
            {totalStr} TOTAL
          </span>
          <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.1)" }} />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            Click any component to view docs
          </span>
        </div>

        {components.map((component) => (
          <ComponentSection key={component.slug} component={component} total={total} />
        ))}

        <section
          style={{
            padding: "4rem 2.5rem",
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
            }}
          >
            All Components
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {components.map((component) => (
              <ComponentCard key={component.slug} component={component} />
            ))}
          </div>
        </section>

        <footer
          style={{
            padding: "3rem 2.5rem",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "2rem" }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              MIT License
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              TypeScript
            </span>
          </div>
          <Link
            href="/"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: "rgba(255,255,255,0.4)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
          >
            ← Back to Home
          </Link>
        </footer>
      </div>
    </div>
  );
}
