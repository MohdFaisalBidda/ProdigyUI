import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

interface ComponentFile {
  path: string;
  source: string;
}

interface InstallStep {
  title: string;
  description: string;
  code: string;
}

interface PropField {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

interface RegistryComponent {
  name: string;
  title: string;
  description: string;
  tag: string;
  files: ComponentFile[];
  dependencies: string[];
  peerDependencies: string[];
  installSteps: InstallStep[];
  props?: PropField[];
}

interface Registry {
  name: string;
  version: string;
  description: string;
  globals?: {
    source: string;
  };
  components: RegistryComponent[];
}

const REGISTRY_URL =
  "https://raw.githubusercontent.com/MohdFaisalBidda/ProdigyUI/main/packages/registry/registry.json";

let cachedRegistry: Registry | null = null;

async function fetchRegistry(): Promise<Registry> {
  if (cachedRegistry) return cachedRegistry;

  try {
    const response = await fetch(REGISTRY_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch registry: ${response.status}`);
    }
    cachedRegistry = await response.json();
    return cachedRegistry!;
  } catch (error) {
    console.error("Error fetching registry:", error);
    throw new Error("Failed to fetch component registry");
  }
}

const server = new McpServer({
  name: "prodigy-ui",
  version: "1.0.0",
  description: "MCP server for ProdigyUI - Animated UI components for React/Next.js",
});

server.tool(
  "list_components",
  "List all available ProdigyUI components",
  {},
  async () => {
    try {
      const registry = await fetchRegistry();
      const components = registry.components.map((c) => ({
        name: c.name,
        title: c.title,
        description: c.description,
        tag: c.tag,
        dependencies: c.dependencies,
        peerDependencies: c.peerDependencies,
        props: c.props,
      }));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                count: components.length,
                components,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.tool(
  "search_components",
  "Search ProdigyUI components by name, description, or tag",
  {
    query: z.string().describe("Search query to match against component names, descriptions, or tags"),
  },
  async ({ query }) => {
    try {
      const registry = await fetchRegistry();
      const searchTerm = query.toLowerCase();

      const results = registry.components.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm) ||
          c.title.toLowerCase().includes(searchTerm) ||
          c.description.toLowerCase().includes(searchTerm) ||
          c.tag.toLowerCase().includes(searchTerm)
      );

      const components = results.map((c) => ({
        name: c.name,
        title: c.title,
        description: c.description,
        tag: c.tag,
        dependencies: c.dependencies,
        peerDependencies: c.peerDependencies,
        props: c.props,
      }));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                query,
                count: components.length,
                components,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.tool(
  "get_component",
  "Get detailed information about a specific ProdigyUI component",
  {
    name: z.string().describe("Component name (e.g., 'stroke-cards', 'team-section')"),
  },
  async ({ name }) => {
    try {
      const registry = await fetchRegistry();
      const component = registry.components.find(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      );

      if (!component) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Component '${name}' not found. Use list_components to see available components.`,
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(component, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.tool(
  "get_component_source",
  "Get the source code URL for a specific component file",
  {
    name: z.string().describe("Component name"),
    filePath: z.string().optional().describe("Specific file path (optional, returns all files if not specified)"),
  },
  async ({ name, filePath }) => {
    try {
      const registry = await fetchRegistry();
      const component = registry.components.find(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      );

      if (!component) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Component '${name}' not found.`,
            },
          ],
          isError: true,
        };
      }

      if (filePath) {
        const file = component.files.find((f) => f.path.includes(filePath));
        if (!file) {
          return {
            content: [
              {
                type: "text" as const,
                text: `File '${filePath}' not found in component '${name}'. Available files: ${component.files.map((f) => f.path).join(", ")}`,
              },
            ],
            isError: true,
          };
        }
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(file, null, 2),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                component: component.title,
                files: component.files,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.tool(
  "get_install_command",
  "Get the installation command for adding a component to a project",
  {
    name: z.string().describe("Component name to get install command for"),
  },
  async ({ name }) => {
    try {
      const registry = await fetchRegistry();
      const component = registry.components.find(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      );

      if (!component) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Component '${name}' not found.`,
            },
          ],
          isError: true,
        };
      }

      const installSteps = component.installSteps.length > 0
        ? component.installSteps
        : [{ title: "No additional dependencies", description: "This component has no peer dependencies", code: "# No dependencies needed" }];

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                component: component.title,
                addCommand: `npx prodigy@latest add ${component.name}`,
                dependencies: {
                  required: component.dependencies,
                  peer: component.peerDependencies,
                },
                installSteps,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.tool(
  "get_components_by_tag",
  "Get all components filtered by a specific tag",
  {
    tag: z.string().describe("Tag to filter by (e.g., 'Interactive', 'GSAP', 'Scroll', 'Motion', 'Animation')"),
  },
  async ({ tag }) => {
    try {
      const registry = await fetchRegistry();
      const searchTag = tag.toLowerCase();

      const results = registry.components.filter(
        (c) => c.tag.toLowerCase() === searchTag
      );

      const components = results.map((c) => ({
        name: c.name,
        title: c.title,
        description: c.description,
        tag: c.tag,
        props: c.props,
      }));

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                tag,
                count: components.length,
                components,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
        isError: true,
      };
    }
  }
);

server.tool(
  "get_all_tags",
  "Get all available component tags/categories",
  {},
  async () => {
    try {
      const registry = await fetchRegistry();
      const tags = [...new Set(registry.components.map((c) => c.tag))];

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                tags,
                count: tags.length,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ===== LANDING PAGE TOOL =====

server.tool(
  "create_landing_page",
  "Generate a complete landing page using ProdigyUI components based on a description. Creates production-ready code with hero, features, team sections etc.",
  {
    type: z.enum(["saas", "portfolio", "startup", "product", "agency"]).describe("Type of landing page"),
    title: z.string().describe("Main title/brand name"),
    description: z.string().optional().describe("Short description of the product/service"),
    accentColor: z.string().optional().describe("Accent color in hex (e.g., '#C8FF00')"),
  },
  async ({ type, title, description, accentColor = "#C8FF00" }) => {
    try {
      const pageData = generateLandingPage(type, title, description || "", accentColor);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(pageData, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ===== HELPER FUNCTIONS =====

function getTypicalUseCases(component: RegistryComponent): string[] {
  const useCases: Record<string, string[]> = {
    "stroke-cards": [
      "Product showcase with hover animations",
      "Team member profiles with interactive reveals",
      "Portfolio project cards",
      "Feature highlight sections"
    ],
    "infinite-slider": [
      "Image galleries with smooth transitions",
      "Testimonial carousels",
      "Product showcases",
      "Hero section backgrounds"
    ],
    "team-section": [
      "About page team introductions",
      "Leadership profiles",
      "Contributor showcases",
      "Company culture pages"
    ],
    "spring-back-card": [
      "Interactive portfolio items",
      "Product cards with physics",
      "Contact cards",
      "Feature highlights"
    ]
  };

  return useCases[component.name] || [
    "Interactive UI elements",
    "Modern web applications",
    "Creative portfolios",
    "Marketing websites"
  ];
}

function getRecommendedProps(component: RegistryComponent): Record<string, any> {
  const recommendations: Record<string, Record<string, any>> = {
    "stroke-cards": {
      columns: 3,
      gap: "1rem",
      strokeColor1: "#C8FF00",
      strokeColor2: "#FF3B3B"
    },
    "infinite-slider": {
      slideCount: 6,
      titles: ["Slide 1", "Slide 2", "Slide 3"]
    }
  };

  return recommendations[component.name] || {};
}

function getCommonPatterns(component: RegistryComponent): string[] {
  const patterns: Record<string, string[]> = {
    "stroke-cards": [
      "Grid layout with responsive columns",
      "Hover-triggered SVG animations",
      "Masked image reveals",
      "Color-coded stroke animations"
    ]
  };

  return patterns[component.name] || ["Standard component usage patterns"];
}

function getBestPractices(component: RegistryComponent): string[] {
  return [
    "Use appropriate ARIA labels for accessibility",
    "Consider performance impact of animations",
    "Test on various screen sizes",
    "Follow component's prop guidelines"
  ];
}

function getPerformanceConsiderations(component: RegistryComponent): Record<string, any> {
  const considerations: Record<string, Record<string, any>> = {
    "stroke-cards": {
      impact: "Medium",
      recommendations: [
        "Use WebP images for better performance",
        "Lazy load images when possible",
        "Minimize SVG path complexity"
      ]
    }
  };

  return considerations[component.name] || {
    impact: "Low to Medium",
    recommendations: ["Follow standard React performance practices"]
  };
}

function findSimilarComponents(component: RegistryComponent, allComponents: RegistryComponent[], criteria: string): RegistryComponent[] {
  return allComponents
    .filter(c => c.name !== component.name)
    .filter(c => {
      switch (criteria) {
        case "functionality":
          return c.tag === component.tag;
        case "animation":
          return c.peerDependencies.some(dep => component.peerDependencies.includes(dep));
        case "visual":
          return c.description.toLowerCase().includes("card") && component.description.toLowerCase().includes("card");
        default:
          return true;
      }
    })
    .slice(0, 3);
}

function getSimilarityReasoning(component: RegistryComponent, similar: RegistryComponent[], criteria: string): string {
  const reasons: Record<string, string> = {
    functionality: `These components share similar functionality and belong to the ${component.tag} category.`,
    animation: "These components use similar animation libraries or techniques.",
    visual: "These components have similar visual styles and layouts.",
    usecase: "These components are commonly used for similar purposes."
  };

  return reasons[criteria] || "These components are related based on the specified criteria.";
}

function generateComponentVariant(component: RegistryComponent, variantType: string, customProps?: Record<string, any>, description?: string): any {
  const variants: Record<string, any> = {
    minimal: {
      type: "minimal",
      description: "Minimal configuration with essential props only",
      code: generateMinimalVariant(component),
      props: getMinimalProps(component)
    },
    enhanced: {
      type: "enhanced",
      description: "Enhanced version with advanced features",
      code: generateEnhancedVariant(component),
      props: getEnhancedProps(component)
    },
    custom: {
      type: "custom",
      description: description || "Custom variant with specified modifications",
      code: generateCustomVariant(component, customProps),
      props: customProps || {}
    },
    responsive: {
      type: "responsive",
      description: "Responsive variant optimized for mobile and desktop",
      code: generateResponsiveVariant(component),
      props: getResponsiveProps(component)
    }
  };

  return variants[variantType] || variants.minimal;
}

function generateMinimalVariant(component: RegistryComponent): string {
  return `<${component.name} />`;
}

function generateEnhancedVariant(component: RegistryComponent): string {
  return `<${component.name}
  className="enhanced-component"
  // Add enhanced props here
/>`;
}

function generateCustomVariant(component: RegistryComponent, customProps?: Record<string, any>): string {
  if (!customProps) return generateMinimalVariant(component);

  const propsString = Object.entries(customProps)
    .map(([key, value]) => `${key}={${JSON.stringify(value)}}`)
    .join('\n  ');

  return `<${component.name}
  ${propsString}
/>`;
}

function generateResponsiveVariant(component: RegistryComponent): string {
  return `<${component.name}
  className="w-full md:w-1/2 lg:w-1/3"
  // Add responsive props
/>`;
}

function getMinimalProps(component: RegistryComponent): Record<string, any> {
  // Return only required props
  const requiredProps: Record<string, any> = {};
  // This would be populated based on component.props analysis
  return requiredProps;
}

function getEnhancedProps(component: RegistryComponent): Record<string, any> {
  // Return enhanced configuration
  return {};
}

function getResponsiveProps(component: RegistryComponent): Record<string, any> {
  // Return responsive configuration
  return {
    className: "w-full md:w-auto"
  };
}

function generateLandingPage(type: string, title: string, description: string, accentColor: string): any {
  const templates: Record<string, any> = {
    saas: {
      type: "saas",
      title,
      description: description || "Transform your workflow with AI-powered automation",
      accentColor,
      sections: [
        {
          name: "Hero",
          component: "infinite-slider",
          props: {
            images: ["hero1", "hero2", "hero3"],
            titles: ["Build Faster", "Scale Smarter", "Ship Better"],
            slideCount: 6
          }
        },
        {
          name: "Features",
          component: "stroke-cards",
          props: {
            columns: 3,
            cards: [
              { id: "1", title: "Lightning Fast", strokeColor1: accentColor, strokeColor2: "#FF3B3B" },
              { id: "2", title: "Secure by Default", strokeColor1: accentColor, strokeColor2: "#FF3B3B" },
              { id: "3", title: "AI Powered", strokeColor1: accentColor, strokeColor2: "#FF3B3B" }
            ]
          }
        },
        {
          name: "Team",
          component: "team-section",
          props: {
            members: [{ image: "/p1.jpg", name: "Alex" }, { image: "/p2.jpg", name: "Jordan" }],
            defaultName: "Our Team",
            accentColor
          }
        }
      ],
      installDeps: ["gsap", "lenis"]
    },
    portfolio: {
      type: "portfolio",
      title,
      description: description || "Showcase your work with stunning animations",
      accentColor,
      sections: [
        {
          name: "Featured Work",
          component: "spring-back-card",
          props: {
            imgSrc: "/project.jpg",
            maxRotation: 18,
            lerpSpeed: 0.1
          }
        },
        {
          name: "Projects",
          component: "pixel-image",
          props: {
            pxSteps: [40, 20, 10, 6, 4, 2, 1],
            speed: 1.5
          }
        },
        {
          name: "Gallery",
          component: "infinite-slider",
          props: {
            slideCount: 8
          }
        }
      ],
      installDeps: ["gsap"]
    },
    startup: {
      type: "startup",
      title,
      description: description || "Launch faster with our platform",
      accentColor,
      sections: [
        {
          name: "Hero",
          component: "gooey-bar",
          props: {
            items: [
              { id: "1", icon: "cube", label: "Products" },
              { id: "2", icon: "music", label: "Services" },
              { id: "3", icon: "cloud", label: "Solutions" },
              { id: "4", icon: "wifi", label: "Connect" }
            ],
            barColor: accentColor
          }
        },
        {
          name: "Showcase",
          component: "stroke-cards",
          props: {
            columns: 2,
            cards: [
              { id: "1", title: "Innovate", strokeColor1: accentColor },
              { id: "2", title: "Grow", strokeColor1: accentColor }
            ]
          }
        },
        {
          name: "Team",
          component: "team-section",
          props: {
            defaultName: "The Squad",
            accentColor
          }
        }
      ],
      installDeps: ["gsap", "motion"]
    },
    product: {
      type: "product",
      title,
      description: description || "The ultimate product experience",
      accentColor,
      sections: [
        {
          name: "Hero",
          component: "glowing-light",
          props: {
            lottiePath: "/fire.json"
          }
        },
        {
          name: "Features",
          component: "split-cards",
          props: {
            cards: [
              { id: "1", frontImage: "/f1.jpg", backTitle: "Premium Quality" },
              { id: "2", frontImage: "/f2.jpg", backTitle: "Fast Delivery" }
            ]
          }
        },
        {
          name: "Contact",
          component: "infinite-contact",
          props: {}
        }
      ],
      installDeps: ["gsap", "lenis", "lottie-web"]
    },
    agency: {
      type: "agency",
      title,
      description: description || "We build digital experiences",
      accentColor,
      sections: [
        {
          name: "Projects",
          component: "more-space-scroll",
          props: {
            projectsPerRow: 9,
            totalRows: 10
          }
        },
        {
          name: "Services",
          component: "stroke-cards",
          props: {
            cards: [
              { id: "1", title: "Web Dev" },
              { id: "2", title: "Mobile" },
              { id: "3", title: "Design" }
            ]
          }
        },
        {
          name: "Team",
          component: "team-section",
          props: {
            accentColor
          }
        }
      ],
      installDeps: ["gsap", "lenis"]
    }
  };

  const template = templates[type] || templates.saas;

  return {
    ...template,
    code: generatePageCode(template)
  };
}

function generatePageCode(template: any): string {
  const imports = template.sections
    .map((s: any) => `import ${s.component} from "prodigy-ui";`)
    .join('\n');

  const sections = template.sections
    .map((s: any, i: number) => `  <${s.component} key={${i}} ${propsToString(s.props)} />`)
    .join('\n');

  return `${imports}

export default function ${template.title.replace(/\s+/g, "")}Page() {
  return (
    <main>
${sections}
    </main>
  );
}`;
}

function propsToString(props: Record<string, any>): string {
  return Object.entries(props)
    .map(([k, v]) => {
      if (typeof v === 'string') return `${k}="${v}"`;
      if (Array.isArray(v)) return `${k}={${JSON.stringify(v)}}`;
      if (typeof v === 'object') return `${k}={${JSON.stringify(v)}}`;
      return `${k}={${v}}`;
    })
    .join(' ');
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ProdigyUI MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
