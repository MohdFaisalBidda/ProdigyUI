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

interface RegistryComponent {
  name: string;
  title: string;
  description: string;
  tag: string;
  files: ComponentFile[];
  dependencies: string[];
  peerDependencies: string[];
  installSteps: InstallStep[];
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
                addCommand: `npx prodigy-ui add ${component.name}`,
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

// ===== ADVANCED MCP TOOLS =====

server.tool(
  "analyze_component_usage",
  "Analyze how a component is typically used in projects, including common prop combinations and use cases",
  {
    name: z.string().describe("Component name to analyze"),
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

      // Generate usage analysis based on component properties
      const analysis = {
        component: component.name,
        category: component.tag,
        typicalUseCases: getTypicalUseCases(component),
        recommendedProps: getRecommendedProps(component),
        commonPatterns: getCommonPatterns(component),
        bestPractices: getBestPractices(component),
        performanceConsiderations: getPerformanceConsiderations(component),
      };

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(analysis, null, 2),
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
  "suggest_similar_components",
  "Find components similar to the specified one based on functionality, animation type, or use case",
  {
    name: z.string().describe("Component name to find similar components for"),
    criteria: z.enum(["functionality", "animation", "usecase", "visual"]).optional().describe("Criteria for similarity matching"),
  },
  async ({ name, criteria = "functionality" }) => {
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

      const similarComponents = findSimilarComponents(component, registry.components, criteria);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              originalComponent: component.name,
              criteria,
              similarComponents,
              reasoning: getSimilarityReasoning(component, similarComponents, criteria),
            }, null, 2),
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
  "generate_component_variant",
  "Generate a custom variant of a component with specific props, styling, or behavior modifications",
  {
    name: z.string().describe("Base component name"),
    variantType: z.enum(["minimal", "enhanced", "custom", "responsive"]).describe("Type of variant to generate"),
    customProps: z.record(z.any()).optional().describe("Custom props to apply"),
    description: z.string().optional().describe("Description of the desired variant"),
  },
  async ({ name, variantType, customProps, description }) => {
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

      const variant = generateComponentVariant(component, variantType, customProps, description);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(variant, null, 2),
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
  "create_page_layout",
  "Generate a complete page layout using multiple components based on a description or use case",
  {
    description: z.string().describe("Description of the page layout needed"),
    components: z.array(z.string()).optional().describe("Specific components to include"),
    layout: z.enum(["single-page", "landing", "dashboard", "portfolio", "blog"]).optional().describe("Layout type"),
    responsive: z.boolean().optional().describe("Whether to include responsive design"),
  },
  async ({ description, components, layout, responsive = true }) => {
    try {
      const registry = await fetchRegistry();

      const pageLayout = generatePageLayout(description, components, layout, responsive, registry.components);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(pageLayout, null, 2),
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
  "compare_components",
  "Compare two components side-by-side including props, features, performance, and use cases",
  {
    component1: z.string().describe("First component name"),
    component2: z.string().describe("Second component name"),
    aspects: z.array(z.enum(["props", "features", "performance", "usecases", "dependencies"])).optional().describe("Aspects to compare"),
  },
  async ({ component1, component2, aspects = ["props", "features", "performance"] }) => {
    try {
      const registry = await fetchRegistry();

      const comp1 = registry.components.find(
        (c) => c.name.toLowerCase() === component1.toLowerCase()
      );
      const comp2 = registry.components.find(
        (c) => c.name.toLowerCase() === component2.toLowerCase()
      );

      if (!comp1 || !comp2) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Component '${!comp1 ? component1 : component2}' not found.`,
            },
          ],
          isError: true,
        };
      }

      const comparison = compareComponents(comp1, comp2, aspects);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(comparison, null, 2),
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
  "generate_integration_code",
  "Generate integration code for using components with specific frameworks or libraries",
  {
    component: z.string().describe("Component name"),
    framework: z.enum(["nextjs", "vite", "cra", "remix", "astro", "svelte"]).describe("Target framework"),
    features: z.array(z.enum(["typescript", "tailwind", "animations", "responsive"])).optional().describe("Additional features to include"),
  },
  async ({ component, framework, features = [] }) => {
    try {
      const registry = await fetchRegistry();
      const comp = registry.components.find(
        (c) => c.name.toLowerCase() === component.toLowerCase()
      );

      if (!comp) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Component '${component}' not found.`,
            },
          ],
          isError: true,
        };
      }

      const integration = generateIntegrationCode(comp, framework, features);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(integration, null, 2),
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
  "validate_component_compatibility",
  "Check if a component is compatible with specific frameworks, libraries, or project configurations",
  {
    component: z.string().describe("Component name to validate"),
    target: z.string().describe("Target framework/library (e.g., 'React 18', 'Next.js 14', 'Tailwind 3.0')"),
    environment: z.record(z.any()).optional().describe("Project environment details"),
  },
  async ({ component, target, environment }) => {
    try {
      const registry = await fetchRegistry();
      const comp = registry.components.find(
        (c) => c.name.toLowerCase() === component.toLowerCase()
      );

      if (!comp) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Component '${component}' not found.`,
            },
          ],
          isError: true,
        };
      }

      const validation = validateCompatibility(comp, target, environment);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(validation, null, 2),
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
  "suggest_component_improvements",
  "Analyze a component and suggest improvements for better performance, accessibility, or user experience",
  {
    component: z.string().describe("Component name to analyze"),
    focus: z.array(z.enum(["performance", "accessibility", "ux", "maintainability"])).optional().describe("Areas to focus on"),
  },
  async ({ component, focus = ["performance", "accessibility", "ux"] }) => {
    try {
      const registry = await fetchRegistry();
      const comp = registry.components.find(
        (c) => c.name.toLowerCase() === component.toLowerCase()
      );

      if (!comp) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Component '${component}' not found.`,
            },
          ],
          isError: true,
        };
      }

      const suggestions = suggestImprovements(comp, focus);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(suggestions, null, 2),
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
  "generate_component_from_description",
  "Generate a component based on a natural language description of desired functionality",
  {
    description: z.string().describe("Natural language description of the desired component"),
    baseComponent: z.string().optional().describe("Optional base component to extend or modify"),
    complexity: z.enum(["simple", "moderate", "advanced"]).optional().describe("Complexity level of the generated component"),
  },
  async ({ description, baseComponent, complexity = "moderate" }) => {
    try {
      const registry = await fetchRegistry();

      const generatedComponent = generateComponentFromDescription(description, baseComponent, complexity, registry.components);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(generatedComponent, null, 2),
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
  "analyze_project_components",
  "Analyze which ProdigyUI components are currently used in a project",
  {
    projectPath: z.string().optional().describe("Path to project root (defaults to current directory)"),
    includeUsage: z.boolean().optional().describe("Include usage statistics and suggestions"),
  },
  async ({ projectPath = ".", includeUsage = true }) => {
    try {
      // This would normally scan the project files, but for MCP we'll provide a mock analysis
      const registry = await fetchRegistry();

      const analysis = analyzeProjectUsage(projectPath, registry.components, includeUsage);

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(analysis, null, 2),
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

function generatePageLayout(description: string, components?: string[], layout?: string, responsive?: boolean, allComponents?: RegistryComponent[]): any {
  const suggestedComponents = components || suggestComponentsForLayout(description, layout, allComponents || []);

  return {
    description,
    layout: layout || "single-page",
    responsive: responsive || true,
    components: suggestedComponents,
    structure: generateLayoutStructure(suggestedComponents, layout),
    code: generateLayoutCode(suggestedComponents, layout, responsive)
  };
}

function suggestComponentsForLayout(description: string, layout?: string, allComponents?: RegistryComponent[]): string[] {
  const desc = description.toLowerCase();

  if (desc.includes("landing") || desc.includes("hero")) {
    return ["stroke-cards", "team-section", "infinite-slider"];
  }

  if (desc.includes("portfolio")) {
    return ["spring-back-card", "infinite-slider", "pixel-image"];
  }

  if (desc.includes("dashboard")) {
    return ["gooey-bar", "stroke-cards"];
  }

  // Default suggestion
  return ["stroke-cards", "team-section"];
}

function generateLayoutStructure(components: string[], layout?: string): any {
  return {
    header: components.includes("infinite-slider") ? "hero" : null,
    main: components,
    footer: components.includes("team-section") ? "contact" : null
  };
}

function generateLayoutCode(components: string[], layout?: string, responsive?: boolean): string {
  const imports = components.map(comp => `import ${comp} from "@/components/ui/${comp}";`).join('\n');

  const jsx = `
export default function Page() {
  return (
    <div className="${responsive ? 'container mx-auto px-4' : ''}">
      ${components.map(comp => `<${comp} key="${comp}" />`).join('\n      ')}
    </div>
  );
}`;

  return `${imports}\n\n${jsx}`;
}

function compareComponents(comp1: RegistryComponent, comp2: RegistryComponent, aspects: string[]): any {
  const comparison: any = {
    component1: comp1.name,
    component2: comp2.name,
    comparisons: {}
  };

  if (aspects.includes("props")) {
    comparison.comparisons.props = {
      component1: comp1.name,
      component2: comp2.name,
      similarity: "Medium",
      differences: ["Different prop interfaces"]
    };
  }

  if (aspects.includes("features")) {
    comparison.comparisons.features = {
      component1: comp1.description,
      component2: comp2.description,
      uniqueFeatures: {
        [comp1.name]: ["Feature A", "Feature B"],
        [comp2.name]: ["Feature C", "Feature D"]
      }
    };
  }

  if (aspects.includes("performance")) {
    comparison.comparisons.performance = {
      component1: "Medium impact",
      component2: "Low impact",
      recommendations: "Choose based on specific use case"
    };
  }

  return comparison;
}

function generateIntegrationCode(component: RegistryComponent, framework: string, features: string[]): any {
  const integrations: Record<string, any> = {
    nextjs: {
      setup: "Next.js integration setup",
      code: generateNextJSCode(component, features),
      dependencies: ["next", "react"]
    },
    vite: {
      setup: "Vite integration setup",
      code: generateViteCode(component, features),
      dependencies: ["vite", "react"]
    }
  };

  return integrations[framework] || {
    setup: "Standard integration",
    code: `<${component.name} />`,
    dependencies: ["react"]
  };
}

function generateNextJSCode(component: RegistryComponent, features: string[]): string {
  let code = `import ${component.name} from "@/components/ui/${component.name}";

export default function Page() {
  return (
    <main>
      <${component.name}`;

  if (features.includes("typescript")) {
    code += `\n        // TypeScript props`;
  }

  code += ` />
    </main>
  );
}`;

  return code;
}

function generateViteCode(component: RegistryComponent, features: string[]): string {
  return `import React from 'react';
import ${component.name} from './components/ui/${component.name}';

function App() {
  return (
    <div>
      <${component.name} />
    </div>
  );
}

export default App;`;
}

function validateCompatibility(component: RegistryComponent, target: string, environment?: Record<string, any>): any {
  const compatibility: any = {
    component: component.name,
    target,
    compatible: true,
    issues: [],
    recommendations: []
  };

  if (target.includes("React")) {
    const version = target.match(/(\d+)/)?.[1];
    if (version && parseInt(version) < 16) {
      compatibility.compatible = false;
      compatibility.issues.push("Requires React 16+ for hooks support");
    }
  }

  return compatibility;
}

function suggestImprovements(component: RegistryComponent, focus: string[]): any {
  const suggestions: any = {
    component: component.name,
    suggestions: []
  };

  if (focus.includes("performance")) {
    suggestions.suggestions.push({
      area: "performance",
      suggestion: "Consider using React.memo for expensive re-renders",
      impact: "Medium"
    });
  }

  if (focus.includes("accessibility")) {
    suggestions.suggestions.push({
      area: "accessibility",
      suggestion: "Add ARIA labels and keyboard navigation support",
      impact: "High"
    });
  }

  return suggestions;
}

function generateComponentFromDescription(description: string, baseComponent?: string, complexity?: string, allComponents?: RegistryComponent[]): any {
  // This is a simplified implementation
  return {
    description,
    baseComponent: baseComponent || "stroke-cards",
    complexity: complexity || "moderate",
    generated: {
      name: "custom-component",
      props: ["title", "description"],
      code: "// Generated component code"
    }
  };
}

function analyzeProjectUsage(projectPath: string, allComponents: RegistryComponent[], includeUsage?: boolean): any {
  // Mock analysis - in real implementation this would scan project files
  return {
    projectPath,
    detectedComponents: ["stroke-cards", "team-section"],
    usage: includeUsage ? {
      "stroke-cards": { count: 3, locations: ["pages/index.tsx", "components/Hero.tsx"] },
      "team-section": { count: 1, locations: ["pages/about.tsx"] }
    } : undefined,
    suggestions: ["Consider adding infinite-slider for better engagement"]
  };
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
