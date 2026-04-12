"use client";

import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BASIC_TOOLS = [
  {
    name: "list_components",
    description: "List all available ProdigyUI components",
    parameters: [],
    example: "list_components"
  },
  {
    name: "search_components",
    description: "Search ProdigyUI components by name, description, or tag",
    parameters: [{ name: "query", type: "string", required: true }],
    example: "search_components query=\"interactive\""
  },
  {
    name: "get_component",
    description: "Get detailed information about a specific ProdigyUI component",
    parameters: [{ name: "name", type: "string", required: true }],
    example: "get_component name=\"stroke-cards\""
  },
  {
    name: "get_component_source",
    description: "Get the source code URL for a specific component file",
    parameters: [
      { name: "name", type: "string", required: true },
      { name: "filePath", type: "string", required: false }
    ],
    example: "get_component_source name=\"stroke-cards\" filePath=\"StrokeCards.tsx\""
  },
  {
    name: "get_install_command",
    description: "Get the installation command for adding a component to a project",
    parameters: [{ name: "name", type: "string", required: true }],
    example: "get_install_command name=\"stroke-cards\""
  },
  {
    name: "get_components_by_tag",
    description: "Get all components filtered by a specific tag",
    parameters: [{ name: "tag", type: "string", required: true }],
    example: "get_components_by_tag tag=\"Interactive\""
  },
  {
    name: "get_all_tags",
    description: "Get all available component tags/categories",
    parameters: [],
    example: "get_all_tags"
  }
];

const ADVANCED_TOOLS = [
  {
    name: "analyze_component_usage",
    description: "Analyze how a component is typically used, including common patterns and best practices",
    parameters: [{ name: "name", type: "string", required: true }],
    example: "analyze_component_usage name=\"stroke-cards\"",
    category: "Analysis"
  },
  {
    name: "suggest_similar_components",
    description: "Find components similar to the specified one based on functionality or visual style",
    parameters: [
      { name: "name", type: "string", required: true },
      { name: "criteria", type: "string", required: false }
    ],
    example: "suggest_similar_components name=\"stroke-cards\" criteria=\"functionality\"",
    category: "Discovery"
  },
  {
    name: "generate_component_variant",
    description: "Generate a custom variant of a component with specific modifications",
    parameters: [
      { name: "name", type: "string", required: true },
      { name: "variantType", type: "string", required: true },
      { name: "customProps", type: "object", required: false }
    ],
    example: "generate_component_variant name=\"stroke-cards\" variantType=\"minimal\"",
    category: "Generation"
  },
  {
    name: "create_page_layout",
    description: "Generate a complete page layout using multiple components",
    parameters: [
      { name: "description", type: "string", required: true },
      { name: "components", type: "array", required: false },
      { name: "layout", type: "string", required: false }
    ],
    example: "create_page_layout description=\"Modern landing page with hero and features\"",
    category: "Generation"
  },
  {
    name: "compare_components",
    description: "Compare two components side-by-side including features and performance",
    parameters: [
      { name: "component1", type: "string", required: true },
      { name: "component2", type: "string", required: true },
      { name: "aspects", type: "array", required: false }
    ],
    example: "compare_components component1=\"stroke-cards\" component2=\"team-section\"",
    category: "Analysis"
  },
  {
    name: "generate_integration_code",
    description: "Generate integration code for specific frameworks",
    parameters: [
      { name: "component", type: "string", required: true },
      { name: "framework", type: "string", required: true },
      { name: "features", type: "array", required: false }
    ],
    example: "generate_integration_code component=\"stroke-cards\" framework=\"nextjs\"",
    category: "Integration"
  },
  {
    name: "validate_component_compatibility",
    description: "Check if a component is compatible with specific frameworks or versions",
    parameters: [
      { name: "component", type: "string", required: true },
      { name: "target", type: "string", required: true }
    ],
    example: "validate_component_compatibility component=\"stroke-cards\" target=\"React 18\"",
    category: "Validation"
  },
  {
    name: "suggest_component_improvements",
    description: "Analyze a component and suggest improvements for performance or accessibility",
    parameters: [
      { name: "component", type: "string", required: true },
      { name: "focus", type: "array", required: false }
    ],
    example: "suggest_component_improvements component=\"stroke-cards\" focus=[\"performance\",\"accessibility\"]",
    category: "Analysis"
  },
  {
    name: "generate_component_from_description",
    description: "Generate a component based on natural language description",
    parameters: [
      { name: "description", type: "string", required: true },
      { name: "baseComponent", type: "string", required: false },
      { name: "complexity", type: "string", required: false }
    ],
    example: "generate_component_from_description description=\"An animated card that flips on hover\"",
    category: "Generation"
  },
  {
    name: "analyze_project_components",
    description: "Analyze which ProdigyUI components are used in the current project",
    parameters: [
      { name: "projectPath", type: "string", required: false },
      { name: "includeUsage", type: "boolean", required: false }
    ],
    example: "analyze_project_components includeUsage=true",
    category: "Analysis"
  }
];

function ToolCard({ tool, isAdvanced = false }: { tool: typeof BASIC_TOOLS[0] | typeof ADVANCED_TOOLS[0]; isAdvanced?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`group border rounded-xl p-6 hover:border-white/[0.16] transition-all duration-300 ${isAdvanced ? 'border-[#7B6BFF]/30 bg-[#7B6BFF]/[0.02]' : 'border-white/[0.08] bg-white/[0.02]'
      }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-syne text-lg font-bold text-white">{tool.name}</h3>
          {isAdvanced && 'category' in tool && (
            <span className={`px-2 py-1 rounded text-xs font-medium ${tool.category === 'Analysis' ? 'bg-blue-500/20 text-blue-300' :
                tool.category === 'Generation' ? 'bg-green-500/20 text-green-300' :
                  tool.category === 'Discovery' ? 'bg-purple-500/20 text-purple-300' :
                    tool.category === 'Integration' ? 'bg-orange-500/20 text-orange-300' :
                      'bg-gray-500/20 text-gray-300'
              }`}>
              {tool.category}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white/40 hover:text-white/60 transition-colors"
        >
          <svg className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <p className="text-white/60 text-sm leading-relaxed mb-4">{tool.description}</p>

      {tool.parameters.length > 0 && (
        <div className="mb-4">
          <h4 className="text-white/80 text-sm font-semibold mb-2">Parameters:</h4>
          <div className="space-y-2">
            {tool.parameters.map((param) => (
              <div key={param.name} className="flex items-center gap-2 text-xs">
                <code className="bg-white/10 px-2 py-1 rounded text-white/90 font-mono">{param.name}</code>
                <span className="text-white/50">{param.type}</span>
                {param.required && <span className="text-red-400">*</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-black/40 rounded-lg p-4 border border-white/5">
        <p className="text-white/70 text-xs font-mono leading-relaxed">{tool.example}</p>
      </div>
    </div>
  );
}

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-black/60 border border-white/10 rounded-lg p-4 overflow-x-auto">
        <code className="text-white/90 text-sm font-mono leading-relaxed">{code}</code>
      </pre>
      <button
        onClick={copyCode}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 rounded px-2 py-1 text-xs text-white/70"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

export default function MCPPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      touchMultiplier: 2,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
    const id = requestAnimationFrame(raf);
    gsap.ticker.lagSmoothing(0);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal-up", {
        opacity: 0, y: 30, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: ".reveal-up", start: "top 88%" },
        stagger: 0.1,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-[#070707] text-white min-h-screen font-syne">

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        {/* Lime glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#C8FF00] opacity-[0.04] blur-[160px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-8 max-w-4xl">
          <div className="flex items-center gap-3 text-[11px] text-white/25 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            <span className="w-5 h-px bg-white/15" />
            Model Context Protocol
            <span className="w-5 h-px bg-white/15" />
          </div>

          <h1 className="text-[clamp(3rem,7vw,5rem)] font-bold leading-[0.88] tracking-[-0.04em]">
            MCP for
            <br />
            <span className="text-[#C8FF00]">ProdigyUI</span>
          </h1>

          <p className="text-white/30 text-base max-w-2xl leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 300 }}>
            Programmatically explore, search, and install animated UI components.
            Integrate ProdigyUI into your development workflow with our MCP server.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a
              href="#setup"
              className="group relative inline-flex items-center gap-3 rounded-full text-black text-sm font-bold tracking-wide overflow-hidden"
              style={{ background: "#C8FF00", fontFamily: "'JetBrains Mono', monospace", padding: "0.75rem 2rem" }}
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </a>

            <a
              href="#tools"
              className="inline-flex items-center gap-3 rounded-full border border-white/[0.16] px-6 py-3 hover:border-white/[0.24] transition-colors duration-200"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <span className="text-white/60">View Tools</span>
              <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>
        </div>

        <div className="absolute bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
          <span className="text-[9px] text-white/15 tracking-[0.25em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>scroll</span>
        </div>
      </section>

      {/* ══ SETUP ═══════════════════════════════════════════════ */}
      <section id="setup" className="reveal-up max-w-4xl mx-auto px-5 md:px-10 py-20 md:py-28">

        <div className="flex items-center gap-4 mb-10">
          <span className="font-mono-jetbrains text-[10px] text-white/20 tracking-[0.2em] uppercase">Setup</span>
          <div className="flex-1 h-px bg-white/[0.06] max-w-[60px]" />
        </div>

        <h2 className="font-syne text-[clamp(2rem,3vw,3rem)] font-extrabold tracking-[-0.03em] leading-[0.95] text-white mb-8">
          One-Command Setup
        </h2>

        <div className="bg-gradient-to-r from-[#C8FF00]/10 to-[#7B6BFF]/10 rounded-2xl border border-[#C8FF00]/20 p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#C8FF00]/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#C8FF00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Automatic Setup</h3>
              <p className="text-white/60">Run one command and everything is configured automatically</p>
            </div>
          </div>

          <CodeBlock code="npx prodigy@latest setup-mcp" />

          <div className="mt-6 space-y-2">
            <p className="text-white/80 font-semibold">What this command does:</p>
            <ul className="text-white/60 space-y-1 ml-4">
              <li>• Detects your MCP client (VS Code, Cursor, Claude Desktop, Windsurf)</li>
              <li>• Installs required dependencies automatically</li>
              <li>• Configures your editor with the MCP server settings</li>
              <li>• Provides fallback instructions if auto-detection fails</li>
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Supported MCP Clients</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center">
                  <span className="text-blue-400 font-bold text-sm">VS</span>
                </div>
                <div>
                  <p className="text-white font-semibold">VS Code</p>
                  <p className="text-white/50 text-sm">with Claude extension</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                <div className="w-8 h-8 bg-purple-500/20 rounded flex items-center justify-center">
                  <span className="text-purple-400 font-bold text-sm">C</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Cursor</p>
                  <p className="text-white/50 text-sm">AI-first code editor</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                <div className="w-8 h-8 bg-orange-500/20 rounded flex items-center justify-center">
                  <span className="text-orange-400 font-bold text-sm">C</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Claude Desktop</p>
                  <p className="text-white/50 text-sm">Desktop MCP client</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                <div className="w-8 h-8 bg-cyan-500/20 rounded flex items-center justify-center">
                  <span className="text-cyan-400 font-bold text-sm">W</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Windsurf</p>
                  <p className="text-white/50 text-sm">AI-powered IDE</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4">Manual Setup (if needed)</h3>
            <p className="text-white/60 mb-4">If auto-detection fails, you can configure manually:</p>
            <CodeBlock
              code={`{
  "mcpServers": {
    "prodigy-ui": {
      "command": "npx",
      "args": ["-y", "@prodigyui/mcp"]
    }
  }
}`}
              language="json"
            />
          </div>
        </div>
      </section>

      {/* ══ CAPABILITIES ═══════════════════════════════════════════════ */}
      <section className="reveal-up max-w-6xl mx-auto px-5 md:px-10 py-20 md:py-28">

        <div className="flex items-center gap-4 mb-10">
          <span className="font-mono-jetbrains text-[10px] text-[#C8FF00] tracking-[0.2em] uppercase">Capabilities</span>
          <div className="flex-1 h-px bg-[#C8FF00]/30 max-w-[60px]" />
        </div>

        <h2 className="font-syne text-[clamp(2rem,3vw,3rem)] font-extrabold tracking-[-0.03em] leading-[0.95] text-white mb-8">
          What MCP Can Do For You
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Component Analysis</h3>
            <p className="text-white/60 text-sm">Deep insights into component usage patterns, performance characteristics, and best practices.</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Code Generation</h3>
            <p className="text-white/60 text-sm">Automatically generate component variants, page layouts, and integration code for different frameworks.</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Intelligent Discovery</h3>
            <p className="text-white/60 text-sm">Find similar components, compare features, and get recommendations based on your project needs.</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Compatibility Validation</h3>
            <p className="text-white/60 text-sm">Check component compatibility with different frameworks, versions, and project configurations.</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-pink-600/5 border border-pink-500/20">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI-Powered Creation</h3>
            <p className="text-white/60 text-sm">Create components from natural language descriptions and get AI-assisted development support.</p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Project Analysis</h3>
            <p className="text-white/60 text-sm">Analyze your project's component usage and get intelligent suggestions for improvements.</p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-white/50 text-lg mb-8">
            From simple component lookup to complete page generation - MCP adapts to your workflow.
          </p>
          <a
            href="#tools"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8FF00] text-black font-semibold rounded-lg hover:bg-white transition-colors"
          >
            Explore All Tools →
          </a>
        </div>
      </section>

      {/* ══ TOOLS ═══════════════════════════════════════════════ */}
      <section id="tools" className="reveal-up max-w-6xl mx-auto px-5 md:px-10 py-20 md:py-28">

        <div className="flex items-center gap-4 mb-10">
          <span className="font-mono-jetbrains text-[10px] text-white/20 tracking-[0.2em] uppercase">Tools</span>
          <div className="flex-1 h-px bg-white/[0.06] max-w-[60px]" />
        </div>

        <h2 className="font-syne text-[clamp(2rem,3vw,3rem)] font-extrabold tracking-[-0.03em] leading-[0.95] text-white mb-12">
          Available Tools
        </h2>

        <div className="space-y-12">
          {/* Basic Tools */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono-jetbrains text-[10px] text-white/20 tracking-[0.2em] uppercase">Basic Tools</span>
              <div className="flex-1 h-px bg-white/[0.06] max-w-[60px]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BASIC_TOOLS.map((tool) => (
                <ToolCard key={tool.name} tool={tool} />
              ))}
            </div>
          </div>

          {/* Advanced Tools */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono-jetbrains text-[10px] text-[#7B6BFF] tracking-[0.2em] uppercase">Advanced Tools</span>
              <div className="flex-1 h-px bg-[#7B6BFF]/30 max-w-[60px]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ADVANCED_TOOLS.map((tool) => (
                <ToolCard key={tool.name} tool={tool} isAdvanced={true} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ PLAYGROUND ══════════════════════════════════════════ */}
      {/* <section className="reveal-up max-w-6xl mx-auto px-5 md:px-10 py-20 md:py-28">

        <div className="flex items-center gap-4 mb-10">
          <span className="font-mono-jetbrains text-[10px] text-white/20 tracking-[0.2em] uppercase">Playground</span>
          <div className="flex-1 h-px bg-white/[0.06] max-w-[60px]" />
        </div>

        <h2 className="font-syne text-[clamp(2rem,3vw,3rem)] font-extrabold tracking-[-0.03em] leading-[0.95] text-white mb-8">
          Interactive Tools
        </h2>

        <p className="text-white/30 text-base max-w-3xl leading-relaxed mb-12" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Explore components interactively, customize props, and generate code snippets.
          Build entire pages by combining components through natural language prompts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="/mcp/playground"
            className="group block p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#C8FF00]/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#C8FF00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Component Playground</h3>
            </div>
            <p className="text-white/60 leading-relaxed mb-4">
              Experiment with component props and see live previews. Generate custom variants and copy code snippets.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-[#C8FF00]/20 text-[#C8FF00] text-xs rounded">Advanced Props Editor</span>
              <span className="px-2 py-1 bg-[#C8FF00]/20 text-[#C8FF00] text-xs rounded">Import/Export Config</span>
              <span className="px-2 py-1 bg-[#C8FF00]/20 text-[#C8FF00] text-xs rounded">Quick Actions</span>
            </div>
          </a>

          <a
            href="/mcp/builder"
            className="group block p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#7B6BFF]/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#7B6BFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Page Builder</h3>
            </div>
            <p className="text-white/60 leading-relaxed mb-4">
              Describe your vision in natural language and let MCP assemble the perfect combination of components.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-[#7B6BFF]/20 text-[#7B6BFF] text-xs rounded">AI-Powered Layouts</span>
              <span className="px-2 py-1 bg-[#7B6BFF]/20 text-[#7B6BFF] text-xs rounded">Save Templates</span>
              <span className="px-2 py-1 bg-[#7B6BFF]/20 text-[#7B6BFF] text-xs rounded">Quick Prompts</span>
            </div>
          </a>
        </div>
      </section>
*/}
    </div>
  );
}