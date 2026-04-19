"use client";

import React, { useState, ReactNode } from "react";
import Link from "next/link";

/* ══════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════ */

export type PropField = {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
};

export type ComponentVariant = {
  label: string;
  props: Record<string, unknown>;
};

export type ComponentPageConfig = {
  /** e.g. "01" */
  index: string;
  /** e.g. "Stroke Cards" */
  name: string;
  /** e.g. "Interactive" */
  tag: string;
  /** hex color for the tag + accents */
  tagColor: string;
  /** short one-liner */
  description: string;
  /** slug for breadcrumb link */
  slug: string;

  /**
   * Live component rendered directly in the preview box.
   * Use for components that do NOT rely on window scroll / Lenis / GSAP ScrollTrigger.
   */
  preview?: ReactNode;

  /**
   * Route loaded inside an iframe for scroll-dependent components
   * (Lenis, GSAP ScrollTrigger, window.scrollY etc.).
   * They get a fully isolated window + scroll context.
   * e.g. "/preview/infinte-contact"
   */
  previewUrl?: string;

  /** iframe height in px. Defaults to 600. */
  previewHeight?: number;

  /** ready-to-copy import + usage snippet */
  codeSnippet: string;

  /** all configurable props */
  props: PropField[];

  /** optional multiple variants to switch between */
  variants?: ComponentVariant[];
  activeVariant?: string;
  onVariantChange?: (label: string) => void;

  /** siblings for prev/next navigation */
  prevComponent?: { slug: string; name: string };
  nextComponent?: { slug: string; name: string };

  /** peer dependencies to install */
  peerDependencies?: string[];
};

/* ══════════════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════════════ */

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "9px",
      letterSpacing: "0.14em",
      textTransform: "uppercase" as const,
      color,
      background: `${color}18`,
      border: `1px solid ${color}33`,
      borderRadius: "9999px",
      padding: "0.25rem 0.625rem",
    }}>{label}</span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
        letterSpacing: "0.1em",
        color: copied ? "#C8FF00" : "rgba(255,255,255,0.35)",
        background: copied ? "rgba(200,255,0,0.08)" : "rgba(255,255,255,0.05)",
        border: `1px solid ${copied ? "rgba(200,255,0,0.25)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "0.4rem", padding: "0.3rem 0.7rem",
        cursor: "pointer", transition: "all 0.2s",
      }}
    >
      {copied ? "✓ copied" : "copy"}
    </button>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div style={{ position: "relative" }}>
      <div style={{
        position: "absolute", top: "0.75rem", right: "0.75rem", zIndex: 10,
      }}>
        <CopyButton text={code} />
      </div>
      <pre style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "12px", lineHeight: 1.7,
        color: "rgba(255,255,255,0.65)",
        background: "rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "0.75rem",
        padding: "1.25rem 1.25rem 1.25rem 1.25rem",
        margin: 0, overflowX: "auto",
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function PropsTable({ fields }: { fields: PropField[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {["Prop", "Type", "Default", "Description"].map((h) => (
              <th key={h} style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)", textAlign: "left",
                padding: "0.5rem 1rem 0.75rem 0",
                fontWeight: 400,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {fields.map((f) => (
            <tr key={f.name} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <td style={{ padding: "0.75rem 1rem 0.75rem 0" }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "12px",
                  color: "#C8FF00",
                }}>
                  {f.name}
                  {f.required && <span style={{ color: "#FF3B3B", marginLeft: "2px" }}>*</span>}
                </span>
              </td>
              <td style={{ padding: "0.75rem 1rem 0.75rem 0" }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "11px",
                  color: "rgba(123,107,255,0.9)",
                }}>{f.type}</span>
              </td>
              <td style={{ padding: "0.75rem 1rem 0.75rem 0" }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "11px",
                  color: "rgba(255,255,255,0.3)",
                }}>{f.default ?? "—"}</span>
              </td>
              <td style={{ padding: "0.75rem 0 0.75rem 0" }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "11px",
                  color: "rgba(255,255,255,0.45)", lineHeight: 1.5,
                }}>{f.description}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN LAYOUT
══════════════════════════════════════════════════════════════ */

export default function ComponentPageLayout({
  index, name, tag, tagColor, description, slug,
  preview, previewUrl, previewHeight = 600,
  codeSnippet, props: propFields,
  variants, activeVariant, onVariantChange,
  prevComponent, nextComponent,
  peerDependencies,
}: ComponentPageConfig) {

  const [activeTab, setActiveTab] = useState<"preview" | "install" | "code">("preview");
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div style={{ background: "#070707", color: "#fff", minHeight: "100vh", fontFamily: "'Syne', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0; }
        ::selection { background: #C8FF00; color: #000; }
      `}</style>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem 2rem" }}>

        {/* ── PAGE TITLE ── */}
        <div style={{ padding: "0.5rem 0 2rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              <h1 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(2rem, 5vw, 4rem)",
                fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.9, margin: 0,
              }}>{name}</h1>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: "12px",
                color: "rgba(255,255,255,0.35)", fontWeight: 300, lineHeight: 1.6, margin: 0,
              }}>{description}</p>
            </div>
            {/* Open in v0 button */}
            {(() => {
              const mainFiles: Record<string, string> = {
                "stroke-cards": "StrokeCards.tsx",
                "team-section": "TeamSection.tsx",
                "spring-back-card": "SpringBackCard.tsx",
                "more-space-scroll": "MoreSpaceProjects.tsx",
                "infinite-contact": "page.tsx",
                "infinite-slider": "page.tsx",
                "glowing-light": "page.tsx",
                "gooey-bar": "GoeeyBar.tsx",
                "pixel-image": "PixelImage.tsx",
                "split-cards": "SplitCards.tsx",
              };
              const mainFile = mainFiles[slug];
              if (!mainFile) return null;
              const folder = slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^[a-z]/, c => c.toUpperCase());
              const rawUrl = `https://raw.githubusercontent.com/MohdFaisalBidda/ProdigyUI/main/src/components/UIElement/${folder}/${mainFile}`;
              return (
<a
                  href={`https://v0.dev/chat/api/open?url=${encodeURIComponent(rawUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-white text-black border border-white hover:bg-neutral-400 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors"
                >
                  <div className="flex items-center justify-center gap-2 transition-opacity">
                    <div className="flex w-full items-center justify-center gap-1">
                      Open in{" "}
                      <svg fill="currentColor" viewBox="0 0 147 70" xmlns="http://www.w3.org/2000/svg" className="w-5">
                        <path d="M56 50.2031V14H70V60.1562C70 65.5928 65.5928 70 60.1562 70C57.5605 70 54.9982 68.9992 53.1562 67.1573L0 14H19.7969L56 50.2031Z"></path>
                        <path d="M147 56H133V23.9531L100.953 56H133V70H96.6875C85.8144 70 77 61.1856 77 50.3125V14H91V46.1562L123.156 14H91V0H127.312C138.186 0 147 8.81439 147 19.6875V56Z"></path>
                      </svg>
                    </div>
                  </div>
                </a>
              );
            })()}

            {/* Variant switcher */}
            {variants && variants.length > 1 && (
              <div style={{ display: "flex", gap: "0.375rem" }}>
                {variants.map((v) => (
                  <button
                    key={v.label}
                    onClick={() => onVariantChange?.(v.label)}
                    style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "10px",
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      color: activeVariant === v.label ? "#000" : "rgba(255,255,255,0.4)",
                      background: activeVariant === v.label ? tagColor : "rgba(255,255,255,0.05)",
                      border: `1px solid ${activeVariant === v.label ? tagColor : "rgba(255,255,255,0.08)"}`,
                      borderRadius: "9999px", padding: "0.35rem 0.875rem",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >{v.label}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── TAB BAR ── */}
        <div style={{
          display: "flex", gap: "0", borderBottom: "1px solid rgba(255,255,255,0.05)",
          marginTop: "0",
        }}>
          {(["preview", "install", "code"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: "11px",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.3)",
                background: "none", border: "none",
                borderBottom: `2px solid ${activeTab === tab ? tagColor : "transparent"}`,
                padding: "0.875rem 1.25rem",
                cursor: "pointer", transition: "color 0.2s, border-color 0.2s",
                marginBottom: "-1px",
              }}
            >{tab}</button>
          ))}
        </div>

        {/* ── CONTENT ── */}
        <div style={{ padding: "2rem 0" }}>

          {/* Preview */}
          {activeTab === "preview" && (
            <div style={{
              position: "relative",
              background: "#0b0b0b",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "1rem",
              overflow: "hidden",
              minHeight: previewUrl ? `${previewHeight}px` : "420px",
            }}>
              {/* dot grid — only for inline previews */}
              {!previewUrl && (
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }} />
              )}
              {/* Accent glow */}
              <div style={{
                position: "absolute", top: 0, right: 0, width: "300px", height: "200px",
                background: tagColor, opacity: 0.04, filter: "blur(80px)", pointerEvents: "none",
              }} />

              {/* ── Iframe preview (scroll-dependent components) ── */}
              {previewUrl && (
                <>
                  {/* Loading spinner — shown until iframe fires onLoad */}
                  {!iframeLoaded && (
                    <div style={{
                      position: "absolute", inset: 0, zIndex: 2,
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: "1rem",
                      background: "#0b0b0b",
                    }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        border: `2px solid ${tagColor}33`,
                        borderTopColor: tagColor,
                        animation: "cpl-spin 0.8s linear infinite",
                      }} />
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                        Loading preview…
                      </span>
                      <style>{`@keyframes cpl-spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                  )}
                  <iframe
                    src={previewUrl}
                    onLoad={() => setIframeLoaded(true)}
                    style={{
                      position: "relative", zIndex: 1,
                      display: "block", width: "100%",
                      height: `${previewHeight}px`,
                      border: "none",
                      opacity: iframeLoaded ? 1 : 0,
                      transition: "opacity 0.3s",
                    }}
                    allow="autoplay"
                  />
                </>
              )}

              {/* ── Inline preview (normal components) ── */}
              {!previewUrl && preview && (
                <div style={{ position: "relative", zIndex: 1 }}>
                  {preview}
                </div>
              )}
            </div>
          )}

          {/* Install */}
          {activeTab === "install" && (
            <div style={{ padding: "1.5rem" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "1rem",
                  lineHeight: 1.6,
                }}>
                  Run this command in your project root to add the component:
                </p>
                <CodeBlock code={`npx prodigy@latest add ${slug}`} />
              </div>

              {peerDependencies && peerDependencies.length > 0 && (
                <div>
                  <p style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: "1rem",
                    lineHeight: 1.6,
                  }}>
                    Install peer dependencies:
                  </p>
                  <CodeBlock code={`npm install ${peerDependencies.join(" ")}`} />
                </div>
              )}
            </div>
          )}

          {/* Code */}
          {activeTab === "code" && (
            <CodeBlock code={codeSnippet} />
          )}
        </div>

        {/* ── PROPS TABLE ── */}
        <section style={{ paddingBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontSize: "1.125rem", fontWeight: 700,
              letterSpacing: "-0.02em", margin: 0,
            }}>Props</h2>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: "9px",
              color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em",
            }}>{propFields.length} total</span>
          </div>
          <PropsTable fields={propFields} />
        </section>

        {/* ── PREV / NEXT NAV ── */}
        {(prevComponent || nextComponent) && (
          <div style={{
            display: "flex", justifyContent: "space-between",
            paddingBottom: "3rem", gap: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "2rem",
          }}>
            {prevComponent ? (
              <Link href={`/components/${prevComponent.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", flexDirection: "column", gap: "0.25rem",
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>← Previous</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
                    {prevComponent.name}
                  </span>
                </div>
              </Link>
            ) : <div />}

            {nextComponent ? (
              <Link href={`/components/${nextComponent.slug}`} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", alignItems: "flex-end" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>Next →</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>
                    {nextComponent.name}
                  </span>
                </div>
              </Link>
            ) : <div />}
          </div>
        )}
      </div>
    </div>
  );
}
