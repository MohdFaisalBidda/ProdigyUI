"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { componentRegistry, ComponentRegistryItem } from "@/lib/component-registry";

gsap.registerPlugin(ScrollTrigger);

function ComponentSelector({ selectedComponent, onSelect }: {
  selectedComponent: ComponentRegistryItem | null;
  onSelect: (component: ComponentRegistryItem) => void;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-white mb-4">Select Component</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {componentRegistry.map((component) => (
          <button
            key={component.slug}
            onClick={() => onSelect(component)}
            className={`p-4 rounded-lg border text-left transition-all duration-200 ${
              selectedComponent?.slug === component.slug
                ? 'border-[#C8FF00] bg-[#C8FF00]/10'
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="font-semibold text-white text-sm">{component.name}</span>
              <span
                className="text-xs px-2 py-1 rounded"
                style={{ backgroundColor: component.tagColor + '20', color: component.tagColor }}
              >
                {component.tag}
              </span>
            </div>
            <p className="text-white/60 text-xs leading-relaxed">{component.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function PropsEditor({ component, props, onPropsChange }: {
  component: ComponentRegistryItem;
  props: Record<string, any>;
  onPropsChange: (props: Record<string, any>) => void;
}) {
  const handlePropChange = (propName: string, value: any) => {
    onPropsChange({ ...props, [propName]: value });
  };

  const handleReset = () => {
    const defaultProps: Record<string, any> = {};
    component.props.forEach((prop) => {
      if (prop.default !== undefined) {
        if (typeof prop.default === 'string' && prop.default.startsWith('"') && prop.default.endsWith('"')) {
          defaultProps[prop.name] = prop.default.slice(1, -1);
        } else if (prop.default === 'true') {
          defaultProps[prop.name] = true;
        } else if (prop.default === 'false') {
          defaultProps[prop.name] = false;
        } else if (!isNaN(Number(prop.default))) {
          defaultProps[prop.name] = Number(prop.default);
        } else {
          defaultProps[prop.name] = prop.default;
        }
      }
    });
    onPropsChange(defaultProps);
  };

  const renderPropInput = (prop: ComponentRegistryItem['props'][0]) => {
    const currentValue = props[prop.name] ?? prop.default;

    switch (prop.type) {
      case 'string':
        return (
          <input
            type="text"
            value={currentValue || ''}
            onChange={(e) => handlePropChange(prop.name, e.target.value)}
            className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded text-white text-sm font-mono focus:border-[#C8FF00] focus:outline-none transition-colors"
            placeholder={prop.default || ''}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={currentValue || 0}
            onChange={(e) => handlePropChange(prop.name, parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded text-white text-sm font-mono focus:border-[#C8FF00] focus:outline-none transition-colors"
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={currentValue || false}
              onChange={(e) => handlePropChange(prop.name, e.target.checked)}
              className="w-4 h-4 accent-[#C8FF00]"
            />
            <span className="text-white/60 text-sm">
              {currentValue ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        );

      default:
        return (
          <textarea
            value={JSON.stringify(currentValue, null, 2) || ''}
            onChange={(e) => {
              try {
                handlePropChange(prop.name, JSON.parse(e.target.value));
              } catch {
                handlePropChange(prop.name, e.target.value);
              }
            }}
            className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded text-white text-sm font-mono focus:border-[#C8FF00] focus:outline-none transition-colors resize-none"
            rows={3}
            placeholder={prop.default || ''}
          />
        );
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Component Props</h3>
        <button
          onClick={handleReset}
          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white/80 text-sm transition-colors"
        >
          Reset to Defaults
        </button>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {component.props.map((prop) => (
          <div key={prop.name} className="flex flex-col gap-2 p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2">
              <code className="text-white font-mono text-sm bg-white/10 px-2 py-1 rounded">
                {prop.name}
              </code>
              <span className="text-white/50 text-xs">{prop.type}</span>
              {prop.required && <span className="text-red-400 text-xs">*</span>}
            </div>
            {renderPropInput(prop)}
            <p className="text-white/50 text-xs leading-relaxed">{prop.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComponentPreview({ component, props }: {
  component: ComponentRegistryItem;
  props: Record<string, any>;
}) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    // Dynamic import based on component slug
    const importComponent = async () => {
      try {
        let importedComponent;
        switch (component.slug) {
          case 'stroke-cards':
            importedComponent = (await import('@/components/UIElement/StrokeCards/StrokeCards')).default;
            break;
          case 'team-section':
            importedComponent = (await import('@/components/UIElement/TeamSection/TeamSection')).default;
            break;
          case 'pixel-image':
            importedComponent = (await import('@/components/UIElement/PixelImage/PixelImage')).default;
            break;
          // Add more components as needed
          default:
            importedComponent = null;
        }
        setComponent(() => importedComponent);
      } catch (error) {
        console.error('Failed to load component:', error);
        setComponent(null);
      }
    };

    importComponent();
  }, [component.slug]);

  if (!Component) {
    return (
      <div className="flex items-center justify-center h-64 bg-black/20 rounded-lg border border-white/10">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full mx-auto mb-4"></div>
          <p className="text-white/60">Loading component...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/20 rounded-lg border border-white/10 p-8 min-h-64">
      <Suspense fallback={<div className="text-white/60">Loading...</div>}>
        <Component {...props} />
      </Suspense>
    </div>
  );
}

function CodeSnippet({ component, props }: {
  component: ComponentRegistryItem;
  props: Record<string, any>;
}) {
  const generateCode = () => {
    const propsString = Object.entries(props)
      .filter(([key, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value}"`;
        } else if (typeof value === 'boolean') {
          return value ? key : `${key}={false}`;
        } else if (typeof value === 'number') {
          return `${key}={${value}}`;
        } else {
          return `${key}={${JSON.stringify(value)}}`;
        }
      })
      .join('\n  ');

    return `<${component.name.charAt(0).toUpperCase() + component.name.slice(1).replace(/-/g, '')}\n  ${propsString}\n/>`;
  };

  const generateImport = () => {
    return `import ${component.name.charAt(0).toUpperCase() + component.name.slice(1).replace(/-/g, '')} from "@/components/ui/${component.slug}/${component.name}";`;
  };

  const [copied, setCopied] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyImport = () => {
    navigator.clipboard.writeText(generateImport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Generated Code</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImport(!showImport)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white/80 text-sm transition-colors"
          >
            {showImport ? 'Hide Import' : 'Show Import'}
          </button>
          <button
            onClick={copyCode}
            className="px-4 py-2 bg-[#C8FF00] text-black font-semibold rounded hover:bg-white transition-colors text-sm"
          >
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
      </div>

      {showImport && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm">Import Statement</span>
            <button
              onClick={copyImport}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-white/60 hover:text-white text-xs"
            >
              Copy Import
            </button>
          </div>
          <pre className="bg-black/60 border border-white/10 rounded p-3">
            <code className="text-white/90 text-sm font-mono">{generateImport()}</code>
          </pre>
        </div>
      )}

      <pre className="bg-black/60 border border-white/10 rounded-lg p-4 overflow-x-auto">
        <code className="text-white/90 text-sm font-mono leading-relaxed">
          {generateCode()}
        </code>
      </pre>
    </div>
  );
}

export default function PlaygroundPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedComponent, setSelectedComponent] = useState<ComponentRegistryItem | null>(null);
  const [componentProps, setComponentProps] = useState<Record<string, any>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    if (selectedComponent) {
      // Initialize props with defaults
      const defaultProps: Record<string, any> = {};
      selectedComponent.props.forEach((prop) => {
        if (prop.default !== undefined) {
          if (typeof prop.default === 'string' && prop.default.startsWith('"') && prop.default.endsWith('"')) {
            defaultProps[prop.name] = prop.default.slice(1, -1);
          } else if (prop.default === 'true') {
            defaultProps[prop.name] = true;
          } else if (prop.default === 'false') {
            defaultProps[prop.name] = false;
          } else if (!isNaN(Number(prop.default))) {
            defaultProps[prop.name] = Number(prop.default);
          } else {
            defaultProps[prop.name] = prop.default;
          }
        }
      });
      setComponentProps(defaultProps);
    }
  }, [selectedComponent]);

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
            Component Playground
          </h1>
          <p className="font-mono-jetbrains text-xs text-white/35 font-light leading-relaxed mt-3 max-w-sm">
            Experiment with components and their props in real-time.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-8">
            <ComponentSelector
              selectedComponent={selectedComponent}
              onSelect={setSelectedComponent}
            />

            {selectedComponent && (
              <>
                <PropsEditor
                  component={selectedComponent}
                  props={componentProps}
                  onPropsChange={setComponentProps}
                />

                <CodeSnippet
                  component={selectedComponent}
                  props={componentProps}
                />

                {/* Advanced Tools */}
                <div className="border-t border-white/10 pt-6">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
                  >
                    <span className="text-sm font-semibold">Advanced Tools</span>
                    <svg className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {showAdvanced && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white/90 font-semibold mb-2">Export Configuration</h4>
                        <button
                          onClick={() => {
                            const config = {
                              component: selectedComponent.slug,
                              props: componentProps,
                              timestamp: new Date().toISOString()
                            };
                            navigator.clipboard.writeText(JSON.stringify(config, null, 2));
                          }}
                          className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-white/80 text-sm transition-colors"
                        >
                          Copy Config as JSON
                        </button>
                      </div>

                      <div>
                        <h4 className="text-white/90 font-semibold mb-2">Import Configuration</h4>
                        <input
                          type="file"
                          accept=".json"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (e) => {
                                try {
                                  const config = JSON.parse(e.target?.result as string);
                                  if (config.component && config.props) {
                                    const component = componentRegistry.find(c => c.slug === config.component);
                                    if (component) {
                                      setSelectedComponent(component);
                                      setComponentProps(config.props);
                                    }
                                  }
                                } catch (err) {
                                  console.error('Invalid config file');
                                }
                              };
                              reader.readAsText(file);
                            }
                          }}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white/80 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#C8FF00] file:text-black hover:file:bg-white"
                        />
                      </div>

                      <div>
                        <h4 className="text-white/90 font-semibold mb-2">Quick Actions</h4>
                        <div className="space-y-2">
                          <button
                            onClick={() => {
                              // Randomize props for creative exploration
                              const newProps = { ...componentProps };
                              selectedComponent.props.forEach(prop => {
                                if (prop.type === 'number') {
                                  const defaultVal = prop.default ? parseFloat(prop.default.toString()) : 0;
                                  newProps[prop.name] = Math.round((Math.random() - 0.5) * 200 + defaultVal);
                                } else if (prop.type === 'boolean') {
                                  newProps[prop.name] = Math.random() > 0.5;
                                }
                              });
                              setComponentProps(newProps);
                            }}
                            className="w-full px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded text-purple-300 text-sm transition-colors"
                          >
                            🎲 Randomize Values
                          </button>

                          <button
                            onClick={() => {
                              // Minimal props - only required ones
                              const minimalProps: Record<string, any> = {};
                              selectedComponent.props.forEach(prop => {
                                if (prop.required) {
                                  if (prop.default !== undefined) {
                                    minimalProps[prop.name] = prop.default;
                                  }
                                }
                              });
                              setComponentProps(minimalProps);
                            }}
                            className="w-full px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-300 text-sm transition-colors"
                          >
                            🎯 Minimal Setup
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <h3 className="text-lg font-bold text-white mb-4">Live Preview</h3>

              {selectedComponent ? (
                <ComponentPreview
                  component={selectedComponent}
                  props={componentProps}
                />
              ) : (
                <div className="flex items-center justify-center h-64 bg-black/20 rounded-lg border border-white/10">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-white/20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <p className="text-white/60">Select a component to see the preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}