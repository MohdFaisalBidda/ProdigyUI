import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UIElement_DIR = path.join(process.cwd(), "src/components/UIElement");

interface ComponentMetadata {
  name: string;
  description: string;
  tag: string;
  dependencies: string[];
  peerDependencies: string[];
  files: { path: string; source: string }[];
  installSteps: { title: string; description: string; code: string }[];
}

const componentMetadata: Record<string, ComponentMetadata> = {
  "stroke-cards": {
    name: "Stroke Cards",
    description: "SVG path-drawing animation with masked image hover reveals. Each card traces its border on hover.",
    tag: "Interactive",
    dependencies: ["clsx", "tailwind-merge"],
    peerDependencies: ["gsap"],
    files: [
      { path: "stroke-cards/StrokeCards.tsx", source: "StrokeCards" },
      { path: "stroke-cards/Cards.tsx", source: "Cards" },
    ],
    installSteps: [
      { title: "Install GSAP", description: "Install gsap package for animations", code: "npm install gsap" },
      { title: "Register GSAP Plugin", description: "Add GSAP plugin registration in your app", code: "import { SplitText } from 'gsap/SplitText'\ngsap.registerPlugin(SplitText)" },
    ],
  },
  "team-section": {
    name: "Team Section",
    description: "Interactive team member showcase with GSAP-powered hover animations. Names animate in on profile hover.",
    tag: "GSAP",
    dependencies: ["clsx", "tailwind-merge"],
    peerDependencies: ["gsap"],
    files: [{ path: "team-section/TeamSection.tsx", source: "TeamSection" }],
    installSteps: [
      { title: "Install GSAP", description: "Install gsap package for animations", code: "npm install gsap" },
      { title: "Register GSAP Plugin", description: "Add GSAP plugin registration in your app", code: "import { SplitText } from 'gsap/SplitText'\ngsap.registerPlugin(SplitText)" },
    ],
  },
  "spring-back-card": {
    name: "Spring Back Card",
    description: "3D spring physics card that follows cursor movement with smooth lerp interpolation and rotation effects.",
    tag: "Interactive",
    dependencies: ["clsx", "tailwind-merge"],
    peerDependencies: [],
    files: [
      { path: "spring-back-card/SpringBackCard.tsx", source: "SpringBackCard" },
      { path: "spring-back-card/SpringBackCardDemo.tsx", source: "Demo" },
    ],
    installSteps: [],
  },
  "more-space-scroll": {
    name: "More Space Scroll",
    description: "Smooth scrolling effect using Lenis with horizontal project showcase. Scroll vertically to move through horizontal content.",
    tag: "Scroll",
    dependencies: ["clsx", "tailwind-merge"],
    peerDependencies: ["lenis", "gsap"],
    files: [
      { path: "more-space-scroll/MoreSpaceProjects.tsx", source: "MoreSpaceProjects" },
      { path: "more-space-scroll/MoreSpaceScroll.tsx", source: "MoreSpaceScroll" },
    ],
    installSteps: [
      { title: "Install Dependencies", description: "Install lenis and gsap packages", code: "npm install lenis gsap" },
      { title: "Register GSAP Plugin", description: "Add GSAP ScrollTrigger registration", code: "import { ScrollTrigger } from 'gsap/ScrollTrigger'\ngsap.registerPlugin(ScrollTrigger)" },
      { title: "Setup Lenis", description: "Wrap your app with ReactLenis for smooth scrolling", code: "import { ReactLenis } from 'lenis/react'\n\nexport default function RootLayout({ children }) {\n  return (\n    <html lang=\"en\">\n      <body>\n        <ReactLenis root>\n          {children}\n        </ReactLenis>\n      </body>\n    </html>\n  )" },
    ],
  },
  "infinite-contact": {
    name: "Infinite Contact",
    description: "Scroll-triggered infinite contact section with GSAP animations. Contact info animates infinitely as you scroll.",
    tag: "Scroll",
    dependencies: ["clsx", "tailwind-merge"],
    peerDependencies: ["gsap", "lenis"],
    files: [{ path: "infinite-contact/InfiniteContact.tsx", source: "InfiniteContact" }],
    installSteps: [
      { title: "Install Dependencies", description: "Install gsap and lenis packages", code: "npm install gsap lenis" },
      { title: "Register GSAP Plugins", description: "Add GSAP ScrollTrigger registration", code: "import { ScrollTrigger } from 'gsap/ScrollTrigger'\ngsap.registerPlugin(ScrollTrigger)" },
      { title: "Setup Lenis", description: "Wrap your app with ReactLenis for smooth scrolling", code: "import { ReactLenis } from 'lenis/react'" },
    ],
  },
  "infinite-slider": {
    name: "Infinite Slider",
    description: "Arc-shaped infinite image slider with GSAP scroll-triggered animations. Images arranged in a 3D arc perspective.",
    tag: "Interactive",
    dependencies: ["clsx", "tailwind-merge"],
    peerDependencies: ["gsap"],
    files: [{ path: "infinite-slider/page.tsx", source: "InfiniteSlider" }],
    installSteps: [
      { title: "Install GSAP", description: "Install gsap package for animations", code: "npm install gsap" },
    ],
  },
  "glowing-light": {
    name: "Glowing Light",
    description: "Lottie-powered glowing light effect that tracks cursor movement with spotlight and mask animations.",
    tag: "Interactive",
    dependencies: ["clsx", "tailwind-merge"],
    peerDependencies: ["lenis", "lottie-web"],
    files: [{ path: "glowing-light/GlowingLight.tsx", source: "GlowingLight" }],
    installSteps: [
      { title: "Install Dependencies", description: "Install lenis and lottie-web packages", code: "npm install lenis lottie-web" },
      { title: "Setup Lenis", description: "Wrap your app with ReactLenis for smooth scrolling", code: "import { ReactLenis } from 'lenis/react'" },
    ],
  },
  "gooey-bar": {
    name: "Gooey Bar",
    description: "Animated status bar with gooey SVG filter effects. Hover over items to see fluid morphing animations with tooltips.",
    tag: "Motion",
    dependencies: ["clsx", "tailwind-merge"],
    peerDependencies: ["motion"],
    files: [{ path: "gooey-bar/GooeyBar.tsx", source: "GooeyBar" }],
    installSteps: [
      { title: "Install Motion", description: "Install motion package for animations", code: "npm install motion" },
    ],
  },
  "pixel-image": {
    name: "Pixel Image",
    description: "Pixelated image reveal animation. Image dissolves from coarse pixels to clear after certain delay.",
    tag: "Animation",
    dependencies: ["clsx", "tailwind-merge"],
    peerDependencies: ["gsap"],
    files: [{ path: "pixel-image/PixelImage.tsx", source: "PixelImage" }],
    installSteps: [
      { title: "Install GSAP", description: "Install gsap package for animations", code: "npm install gsap" },
      { title: "Register GSAP Plugin", description: "Add GSAP ScrollTrigger registration", code: "import { ScrollTrigger } from 'gsap/ScrollTrigger'\ngsap.registerPlugin(ScrollTrigger)" },
    ],
  },
};

function getDependencies(component: string): string[] {
  return componentMetadata[component]?.dependencies ?? [];
}

function getComponentFolders(): Record<string, string> {
  const folders: Record<string, string> = {};
  if (!fs.existsSync(UIElement_DIR)) return folders;

  const entries = fs.readdirSync(UIElement_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const slug = entry.name.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "");
      folders[slug] = entry.name;
    }
  }
  return folders;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ component: string }> }
) {
  const { component } = await params;
  const folders = getComponentFolders();
  const folder = folders[component];

  if (!folder) {
    return new NextResponse("Component not found", { status: 404 });
  }

  const metadata = componentMetadata[component];
  if (!metadata) {
    return new NextResponse("Component metadata not found", { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://raw.githubusercontent.com/MohdFaisalBidda/ProdigyUI/main";
  const rawBaseUrl = "https://raw.githubusercontent.com/MohdFaisalBidda/ProdigyUI/main";

  const files = metadata.files.map((file) => {
    const filePath = path.join(UIElement_DIR, folder, file.path.split("/").pop()!);
    let content = "";
    
    if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath, "utf-8");
      
      if (!content.includes('declare global') && !content.includes('/// <reference')) {
        content = content.replace(/^"use client"/, "").replace(/^'use client'/, "");
        content = `// @ts-nocheck\n/* eslint-disable */\n"use client";\n\n${content.trim()}`;
      }

      const exportName = file.source.replace(/[^a-zA-Z]/g, "");
      if (content.includes("function page()")) {
        content = content.replace(/function page\(\)/g, `function ${exportName}()`);
      }
      if (content.includes("export default page")) {
        content = content.replace(/export default page/g, `export default ${exportName}`);
      }

      const nextImageComponents = ["team-section", "spring-back-card", "more-space-scroll", "infinite-slider"];
      if (nextImageComponents.includes(component)) {
        content = content.replace(/import Image from ["']next\/image["']/g, "");
        content = content.replace(/<Image\n?/g, "<img ");
        content = content.replace(/width=\{(\d+)\}/g, 'width="$1"');
        content = content.replace(/height=\{(\d+)\}/g, 'height="$1"');
        content = content.replace(/(<img[^>]*[^/])>/g, "$1 />");
      }
    }

    return {
      path: `components/${folder}/${file.path.split("/").pop()}`,
      content: content,
      type: "registry:component",
    };
  });

  const exportName = folder.replace(/[^a-zA-Z]/g, "");
  const pageContent = `import ${exportName} from "@/components/${folder}";

export default function Page() {
  return (
    <div className="min-h-screen bg-black">
      <${exportName} />
    </div>
  );
}`;

  files.push({
    path: "app/page.tsx",
    content: pageContent,
    type: "registry:page",
    target: "app/page.tsx",
  });

  return NextResponse.json({
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: component,
    type: "registry:block",
    title: metadata.name,
    description: metadata.description,
    dependencies: metadata.dependencies,
    peerDependencies: metadata.peerDependencies,
    files,
    installSteps: metadata.installSteps,
  });
}