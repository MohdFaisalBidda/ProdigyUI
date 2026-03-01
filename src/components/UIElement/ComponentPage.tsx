"use client";

/**
 * components/ComponentPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable doc-page shell. Every component page.tsx uses this.
 *
 * ── Minimal (preview only) ───────────────────────────────────────────────────
 *
 *   // app/components/stroke-cards/page.tsx
 *   "use client";
 *   import { getMeta } from "@/lib/registry";
 *   import ComponentPage from "@/components/ComponentPage";
 *   import Cards from "@/components/Cards";
 *
 *   const meta = getMeta("stroke-cards")!;
 *
 *   export default function StrokeCardsPage() {
 *     return (
 *       <ComponentPage meta={meta}>
 *         <Cards imgSrc="/img1.avif" title="Motion" strokeColor1="#F5EE41" strokeColor2="#6E44FF" />
 *       </ComponentPage>
 *     );
 *   }
 *
 * ── With playground ──────────────────────────────────────────────────────────
 *
 *   export default function StrokeCardsPage() {
 *     return (
 *       <ComponentPage meta={meta} playground={<StrokeCardsPlayground />}>
 *         <Cards imgSrc="/img1.avif" title="Motion" strokeColor1="#F5EE41" strokeColor2="#6E44FF" />
 *       </ComponentPage>
 *     );
 *   }
 */

import React, { useState } from "react";
import type { ComponentMeta } from "@/lib/registry";

// ─────────────────────────────────────────────────────────────────────────────
// Public primitives — exported so individual playgrounds can reuse them
// ─────────────────────────────────────────────────────────────────────────────

export function CodeBlock({ code, accent }: { code: string; accent: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group rounded-xl overflow-hidden"
      style={{ background: "#070707", border: "1px solid #141414" }}>
      <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ borderBottom: "1px solid #111" }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.5 }} />
        ))}
      </div>
      <pre className="p-4 md:p-5 text-xs md:text-sm font-mono leading-relaxed overflow-x-auto"
        style={{ color: "#525252" }}>
        <code>{code}</code>
      </pre>
      <button onClick={copy}
        className="absolute top-2 right-2 px-2.5 py-1 rounded-md text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-all duration-150"
        style={{ background: "#141414", color: copied ? accent : "#333" }}>
        {copied ? "✓" : "copy"}
      </button>
    </div>
  );
}

/** Two-column shell for playgrounds: controls on left, live result on right */
export function PlaygroundShell({
  controls,
  preview,
}: {
  controls: React.ReactNode;
  preview: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden"
      style={{ border: "1px solid #111" }}>
      <div className="flex flex-col gap-5 p-6"
        style={{ background: "#080808", borderBottom: "1px solid #111" }}>
        <p className="text-[9px] font-mono tracking-[0.2em] uppercase" style={{ color: "#242424" }}>
          Customize props
        </p>
        {controls}
      </div>
      <div className="flex items-center justify-center p-8 min-h-[200px]"
        style={{ background: "#060606" }}>
        {preview}
      </div>
    </div>
  );
}

/** Labelled field wrapper for playground controls */
export function PropInput({ label, accent, children }: {
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[9px] font-mono tracking-[0.15em] uppercase" style={{ color: accent }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function TextInput({ value, onChange, accent, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  accent: string;
  placeholder?: string;
}) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full rounded-lg px-3 py-2 text-xs outline-none transition-colors duration-150"
      style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", color: "#ccc" }}
      onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
      onBlur={(e) => (e.currentTarget.style.borderColor = "#1a1a1a")}
    />
  );
}

export function ColorInput({ value, onChange }: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded-md cursor-pointer flex-shrink-0"
        style={{ border: "1px solid #1e1e1e", background: "transparent" }} />
      <span className="text-xs font-mono" style={{ color: "#383838" }}>{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

function Tag({ label, highlight, accent }: { label: string; highlight?: boolean; accent: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] tracking-[0.15em] uppercase font-mono"
      style={highlight
        ? { border: `1px solid ${accent}`, color: accent, background: `${accent}0d` }
        : { border: "1px solid #181818", color: "#2e2e2e" }}>
      {label}
    </span>
  );
}

function SectionLabel({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="flex items-center gap-4 mb-6 md:mb-8">
      <span className="text-[9px] font-mono tracking-[0.2em] uppercase flex-shrink-0"
        style={{ color: "#282828" }}>
        {children}
      </span>
      <div className="flex-1 h-px"
        style={{ background: `linear-gradient(to right, ${accent}18, transparent)` }} />
    </div>
  );
}

function PropsTable({ props, accent, accent2 }: {
  props: ComponentMeta["props"];
  accent: string;
  accent2: string;
}) {
  return (
    <section className="mb-16 md:mb-20">
      <SectionLabel accent={accent}>Props</SectionLabel>

      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-2 md:hidden">
        {props.map((p) => (
          <div key={p.name} className="rounded-xl p-4"
            style={{ background: "#080808", border: "1px solid #111" }}>
            <div className="flex items-baseline justify-between gap-2 flex-wrap mb-1.5">
              <span className="font-mono text-xs" style={{ color: accent }}>{p.name}</span>
              <span className="font-mono text-[10px]" style={{ color: accent2 }}>{p.type}</span>
            </div>
            <p className="text-[11px] leading-relaxed mb-2" style={{ color: "#3a3a3a" }}>{p.desc}</p>
            <span className="font-mono text-[10px]" style={{ color: "#242424" }}>
              default: {p.default}
            </span>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block rounded-xl overflow-hidden" style={{ border: "1px solid #111" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #111", background: "#080808" }}>
                {["Prop", "Type", "Default", "Description"].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left font-mono tracking-[0.15em] uppercase"
                    style={{ color: "#1e1e1e", fontSize: "10px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {props.map((p, i) => (
                <tr key={p.name}
                  className="transition-colors duration-100"
                  style={{ borderBottom: "1px solid #0c0c0c", background: i % 2 === 0 ? "#070707" : "#080808" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#0d0d0d")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "#070707" : "#080808")}
                >
                  <td className="px-5 py-3.5 font-mono text-xs" style={{ color: accent }}>{p.name}</td>
                  <td className="px-5 py-3.5 font-mono text-xs" style={{ color: accent2 }}>{p.type}</td>
                  <td className="px-5 py-3.5 font-mono text-xs" style={{ color: "#282828" }}>{p.default}</td>
                  <td className="px-5 py-3.5 text-xs leading-relaxed" style={{ color: "#3a3a3a" }}>{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

export default function ComponentPage({
  meta,
  children,
  playground,
}: {
  meta: ComponentMeta;
  children: React.ReactNode;
  playground?: React.ReactNode;
}) {
  const { accent, accent2 = "#6E44FF" } = meta;

  return (
    <div className="min-h-screen" style={{ color: "#fff" }}>
      {/* ambient glow */}
      <div className="fixed top-0 inset-x-0 h-px pointer-events-none z-10"
        style={{ background: `linear-gradient(to right, transparent 10%, ${accent}1a 50%, transparent 90%)` }} />

      <div
      className="w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-10 pt-10 md:pt-14 pb-32">

        {/* ── Hero ── */}
        <header className="mb-16 md:mb-20">
          <div className="flex flex-wrap gap-1.5 mb-6">
            {meta.tags.map((t, i) => <Tag key={t} label={t} highlight={i === 0} accent={accent} />)}
          </div>

          <div className="flex items-start gap-3 mb-5">
            <span className="font-mono leading-none select-none flex-shrink-0 pt-1"
              style={{ fontSize: "clamp(3rem,8vw,7rem)", color: "#0d0d0d", letterSpacing: "-0.05em" }}>
              {meta.index}
            </span>
            <div>
              {(() => {
                const words = meta.name.split(" ");
                const last = words.pop();
                return (
                  <h1 className="font-medium leading-[0.9] tracking-[-0.04em]"
                    style={{ fontSize: "clamp(1.8rem,5vw,3.8rem)" }}>
                    {words.length > 0 && <>{words.join(" ")}<br /></>}
                    <span style={{ color: accent }}>{last}</span>
                  </h1>
                );
              })()}
            </div>
          </div>

          <p className="text-sm md:text-base leading-relaxed max-w-md" style={{ color: "#3e3e3e" }}>
            {meta.description}
          </p>
        </header>

        {/* ── Preview ── */}
        <section className="mb-16 md:mb-20">
          <SectionLabel accent={accent}>Preview</SectionLabel>
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #0f0f0f", background: "#080808" }}>
            <div className="flex items-center justify-between px-4 py-2.5"
              style={{ borderBottom: "1px solid #0d0d0d" }}>
              <span className="text-[9px] font-mono" style={{ color: "#1c1c1c" }}>live preview</span>
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => <span key={i} className="w-1 h-1 rounded-full" style={{ background: "#181818" }} />)}
              </div>
            </div>
            <div className="p-6 sm:p-10 md:p-14 flex items-center justify-center min-h-[220px]">
              {children}
            </div>
          </div>
        </section>

        {/* ── Playground ── */}
        {playground && (
          <section className="mb-16 md:mb-20">
            <SectionLabel accent={accent}>Playground</SectionLabel>
            {playground}
          </section>
        )}

        {/* ── Installation ── */}
        <section className="mb-16 md:mb-20">
          <SectionLabel accent={accent}>Installation</SectionLabel>
          <div className="flex flex-col">
            {meta.installSteps.map((s, i) => (
              <div key={s.step} className="grid gap-4 pb-10 relative"
                style={{ gridTemplateColumns: "40px 1fr" }}>
                {i < meta.installSteps.length - 1 && (
                  <div className="absolute w-px"
                    style={{ left: "19px", top: "38px", bottom: "-10px", background: `linear-gradient(to bottom, ${accent}1a, transparent)` }} />
                )}
                <div className="flex justify-center">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ border: `1px solid ${accent}20`, background: "#090909" }}>
                    <span className="text-[9px] font-mono" style={{ color: accent }}>{s.step}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-1.5">
                  <h3 className="text-sm font-medium" style={{ color: "#aaa" }}>{s.title}</h3>
                  <p className="text-[11px] leading-relaxed" style={{ color: "#383838" }}>{s.description}</p>
                  <CodeBlock code={s.code} accent={accent} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Props ── */}
        <PropsTable props={meta.props} accent={accent} accent2={accent2} />

        {/* ── Full example ── */}
        {meta.fullExample && (
          <section>
            <SectionLabel accent={accent}>Full example</SectionLabel>
            <CodeBlock code={meta.fullExample} accent={accent} />
          </section>
        )}

      </div>
    </div>
  );
}