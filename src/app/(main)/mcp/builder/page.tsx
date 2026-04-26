"use client";

import React, { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { componentRegistry, ComponentRegistryItem } from "@/lib/component-registry";

gsap.registerPlugin(ScrollTrigger);

// Mock page templates based on common use cases
const PAGE_TEMPLATES = [
  {
    id: "hero-landing",
    title: "Hero Landing Page",
    description: "A modern landing page with hero section, features, and CTA",
    prompt: "Create a landing page with a hero section, feature grid, and call-to-action",
    components: ["stroke-cards", "team-section", "pixel-image"],
    layout: `
<div className="min-h-screen">
  {/* Hero Section */}
  <section className="hero-section">
    <PixelImage src="/hero-image.jpg" />
    <h1>Welcome to Our Platform</h1>
    <p>Build amazing things with our components</p>
  </section>

  {/* Features */}
  <section className="features-section">
    <StrokeCards cards={featureCards} />
  </section>

  {/* Team */}
  <section className="team-section">
    <TeamSection members={teamMembers} />
  </section>
</div>
    `
  },
  {
    id: "portfolio-showcase",
    title: "Portfolio Showcase",
    description: "Display work samples with smooth scrolling and interactive elements",
    prompt: "Build a portfolio page with project showcase and smooth scrolling",
    components: ["more-space-scroll", "infinite-slider", "glowing-light"],
    layout: `
<div className="portfolio-page">
  {/* Hero */}
  <section className="hero">
    <h1>My Portfolio</h1>
    <GlowingLight lottiePath="./fire.json" />
  </section>

  {/* Projects */}
  <section className="projects">
    <MoreSpaceScroll projects={portfolioProjects} />
  </section>

  {/* Gallery */}
  <section className="gallery">
    <InfiniteSlider images={galleryImages} titles={galleryTitles} />
  </section>
</div>
    `
  },
  {
    id: "contact-page",
    title: "Contact Page",
    description: "Professional contact page with infinite scrolling contact info",
    prompt: "Create a contact page with team information and contact details",
    components: ["infinite-contact", "team-section"],
    layout: `
<div className="contact-page">
  {/* Header */}
  <section className="contact-header">
    <h1>Get In Touch</h1>
    <p>Let's build something amazing together</p>
  </section>

  {/* Contact Info */}
  <section className="contact-info">
    <InfiniteContact data={contactData} images={contactImages} />
  </section>

  {/* Team */}
  <section className="team">
    <TeamSection members={teamMembers} />
  </section>
</div>
    `
  },
  {
    id: "dashboard-ui",
    title: "Dashboard Interface",
    description: "Admin dashboard with status indicators and interactive elements",
    prompt: "Design a dashboard with status bars and interactive components",
    components: ["gooey-bar", "infinite-slider", "stroke-cards"],
    layout: `
<div className="dashboard">
  {/* Header */}
  <header className="dashboard-header">
    <h1>Dashboard</h1>
    <GooeyStatusBar />
  </header>

  {/* Main Content */}
  <main className="dashboard-main">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="stats-section">
        <StrokeCards cards={statsCards} />
      </div>
      <div className="gallery-section">
        <InfiniteSlider images={chartImages} titles={chartTitles} />
      </div>
    </div>
  </main>
</div>
    `
  }
];

function PromptInput({ onSubmit }: { onSubmit: (prompt: string) => void }) {
  const [prompt, setPrompt] = useState("");
  const [isAdvanced, setIsAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt("");
    }
  };

  const quickPrompts = [
    "Create a modern SaaS landing page with hero, features, testimonials, and CTA",
    "Build a portfolio showcase with project grid, about section, and contact form",
    "Design an e-commerce product page with image gallery, reviews, and add to cart",
    "Make a blog layout with featured posts, categories, and newsletter signup",
    "Create a dashboard interface with charts, stats cards, and navigation"
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Describe Your Page</h3>
        <button
          onClick={() => setIsAdvanced(!isAdvanced)}
          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white/80 text-sm transition-colors"
        >
          {isAdvanced ? 'Simple' : 'Advanced'} Mode
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={isAdvanced
              ? "Describe your page in detail: layout, components, colors, animations, responsive behavior..."
              : "E.g., 'Create a modern landing page with hero section, feature showcase, and contact form'"
            }
            className={`w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/40 resize-none focus:outline-none focus:border-[#C8FF00] transition-colors ${
              isAdvanced ? 'h-48' : 'h-32'
            }`}
          />
          {isAdvanced && (
            <div className="absolute bottom-2 right-2 text-white/40 text-xs">
              {prompt.length} characters
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-6 py-3 bg-[#C8FF00] text-black font-semibold rounded-lg hover:bg-white transition-colors flex-1"
          >
            Generate Layout ✨
          </button>
        </div>
      </form>

      {!isAdvanced && (
        <div className="mt-6">
          <h4 className="text-white/80 font-semibold mb-3">Quick Start Templates:</h4>
          <div className="grid grid-cols-1 gap-2">
            {quickPrompts.map((quickPrompt, index) => (
              <button
                key={index}
                onClick={() => setPrompt(quickPrompt)}
                className="text-left p-3 bg-white/5 hover:bg-white/10 rounded border border-white/10 hover:border-white/20 transition-colors text-white/70 hover:text-white text-sm"
              >
                {quickPrompt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TemplateCard({ template, onSelect }: {
  template: typeof PAGE_TEMPLATES[0];
  onSelect: (template: typeof PAGE_TEMPLATES[0]) => void;
}) {
  return (
    <div className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 cursor-pointer" onClick={() => onSelect(template)}>
      <h4 className="text-lg font-bold text-white mb-2">{template.title}</h4>
      <p className="text-white/60 text-sm mb-4">{template.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {template.components.map((componentSlug) => {
          const component = componentRegistry.find(c => c.slug === componentSlug);
          return component ? (
            <span
              key={componentSlug}
              className="text-xs px-2 py-1 rounded bg-white/10 text-white/80"
            >
              {component.name}
            </span>
          ) : null;
        })}
      </div>
      <p className="text-white/40 text-xs italic">"{template.prompt}"</p>
    </div>
  );
}

function GeneratedLayout({ template }: { template: typeof PAGE_TEMPLATES[0] | null }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!template) return null;

  const copyCode = () => {
    navigator.clipboard.writeText(template.layout);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveTemplate = () => {
    // In a real app, this would save to a database or local storage
    const savedTemplates = JSON.parse(localStorage.getItem('saved-templates') || '[]');
    savedTemplates.push({
      ...template,
      id: `custom-${Date.now()}`,
      savedAt: new Date().toISOString()
    });
    localStorage.setItem('saved-templates', JSON.stringify(savedTemplates));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Generated Layout</h3>
        <div className="flex gap-2">
          <button
            onClick={saveTemplate}
            className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded text-sm transition-colors"
          >
            {saved ? '✓ Saved!' : '💾 Save Template'}
          </button>
          <button
            onClick={copyCode}
            className="px-4 py-2 bg-[#C8FF00] text-black font-semibold rounded hover:bg-white transition-colors text-sm"
          >
            {copied ? 'Copied!' : 'Copy Layout'}
          </button>
        </div>
      </div>

      <div className="bg-black/60 border border-white/10 rounded-lg p-6">
        <h4 className="text-white font-semibold mb-4">{template.title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {template.components.map((componentSlug) => {
            const component = componentRegistry.find(c => c.slug === componentSlug);
            return component ? (
              <div key={componentSlug} className="flex items-center gap-3 p-3 bg-white/5 rounded">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: component.tagColor }}
                />
                <span className="text-white/80 text-sm">{component.name}</span>
              </div>
            ) : null;
          })}
        </div>
        <pre className="text-white/90 text-sm font-mono leading-relaxed overflow-x-auto">
          <code>{template.layout}</code>
        </pre>
      </div>
    </div>
  );
}

function ComponentPreview({ template }: { template: typeof PAGE_TEMPLATES[0] | null }) {
  if (!template) {
    return (
      <div className="flex items-center justify-center h-64 bg-black/20 rounded-lg border border-white/10">
        <div className="text-center">
          <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-white/60">Select a template or enter a prompt to see the layout preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/20 rounded-lg border border-white/10 p-8">
      <div className="space-y-8">
        {/* Mock layout visualization */}
        <div className="bg-gradient-to-r from-[#C8FF00]/20 to-[#7B6BFF]/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Hero Section</h2>
          <p className="text-white/60">Main banner with call-to-action</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {template.components.slice(0, 3).map((componentSlug, index) => {
            const component = componentRegistry.find(c => c.slug === componentSlug);
            return component ? (
              <div key={componentSlug} className="bg-white/5 rounded-lg p-6 text-center">
                <div
                  className="w-8 h-8 rounded-full mx-auto mb-3"
                  style={{ backgroundColor: component.tagColor + '40' }}
                />
                <h3 className="text-white font-semibold mb-1">{component.name}</h3>
                <p className="text-white/50 text-xs">{component.tag}</p>
              </div>
            ) : null;
          })}
        </div>

        <div className="bg-gradient-to-r from-[#FF3B3B]/20 to-[#C8FF00]/20 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Footer / CTA</h2>
          <p className="text-white/60">Call-to-action section</p>
        </div>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof PAGE_TEMPLATES[0] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handlePromptSubmit = async (prompt: string) => {
    setIsGenerating(true);

    // Simulate MCP processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Find best matching template based on prompt keywords
    const promptLower = prompt.toLowerCase();
    let bestMatch = PAGE_TEMPLATES[0];

    if (promptLower.includes('portfolio') || promptLower.includes('showcase')) {
      bestMatch = PAGE_TEMPLATES.find(t => t.id === 'portfolio-showcase') || bestMatch;
    } else if (promptLower.includes('contact') || promptLower.includes('team')) {
      bestMatch = PAGE_TEMPLATES.find(t => t.id === 'contact-page') || bestMatch;
    } else if (promptLower.includes('dashboard') || promptLower.includes('admin')) {
      bestMatch = PAGE_TEMPLATES.find(t => t.id === 'dashboard-ui') || bestMatch;
    }

    setSelectedTemplate(bestMatch);
    setIsGenerating(false);
  };

  return (
    <div ref={containerRef} className="bg-[#070707] text-white min-h-screen font-syne">

      {/* Header */}
      <header className="px-5 pt-10 pb-7 md:px-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <a href="/mcp" className="text-white/60 hover:text-white transition-colors">
              ← Back to MCP
            </a>
          </div>
          <h1 className="font-syne text-[clamp(2rem,6vw,4rem)] font-extrabold tracking-[-0.04em] leading-[0.9] m-0">
            Page Builder
          </h1>
          <p className="font-mono-jetbrains text-xs text-white/35 font-light leading-relaxed mt-3 max-w-sm">
            Describe your vision and let MCP assemble the perfect page.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left Panel - Input */}
          <div className="space-y-8">
            <PromptInput onSubmit={handlePromptSubmit} />

            <div>
              <h3 className="text-lg font-bold text-white mb-4">Quick Templates</h3>
              <div className="grid grid-cols-1 gap-4">
                {PAGE_TEMPLATES.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={setSelectedTemplate}
                  />
                ))}
              </div>
            </div>

            {isGenerating && (
              <div className="flex items-center gap-4 p-4 bg-[#C8FF00]/10 border border-[#C8FF00]/20 rounded-lg">
                <div className="animate-spin w-6 h-6 border-2 border-[#C8FF00]/20 border-t-[#C8FF00] rounded-full"></div>
                <span className="text-[#C8FF00]">Analyzing your request and generating layout...</span>
              </div>
            )}

            <GeneratedLayout template={selectedTemplate} />
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <h3 className="text-lg font-bold text-white mb-4">Layout Preview</h3>
            <ComponentPreview template={selectedTemplate} />
          </div>

        </div>

      </div>

    </div>
  );
}