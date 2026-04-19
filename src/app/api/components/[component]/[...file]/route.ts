import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UIElement_DIR = path.join(process.cwd(), "src/components/UIElement");

function getDependencies(component: string): string[] {
  const deps: Record<string, string[]> = {
    "pixel-image": ["gsap", "gsap/ScrollTrigger"],
    "team-section": ["gsap"],
    "stroke-cards": [],
    "spring-back-card": [],
    "more-space-scroll": ["gsap", "@studio-freight/lenis"],
    "infinite-contact": ["gsap"],
    "infinite-slider": ["gsap"],
    "glowing-light": ["lottie-react"],
    "gooey-bar": ["gsap"],
    "split-cards": [],
  };
  return deps[component] ?? [];
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
  { params }: { params: Promise<{ component: string; file: string[] }> }
) {
  const { component, file } = await params;
  const fileName = file[file.length - 1];

  const folders = getComponentFolders();
  const folder = folders[component];
  if (!folder) {
    return new NextResponse("Component not found", { status: 404 });
  }

  const filePath = path.join(UIElement_DIR, folder, fileName);
  if (!fs.existsSync(filePath)) {
    return new NextResponse("File not found: " + filePath, { status: 404 });
  }

  let content = fs.readFileSync(filePath, "utf-8");

  if (!content.includes('declare global') && !content.includes('/// <reference')) {
    content = content.replace(/^"use client"/, '');
    content = content.replace(/^'use client'/, '');
    content = `// @ts-nocheck\n/* eslint-disable */\n"use client";\n\n` + content.trim();
  }

  const exportName = folder.replace(/[^a-zA-Z]/g, "");
  if (content.includes("function page()")) {
    content = content.replace(/function page\(\)/g, `function ${exportName}()`);
  }
  if (content.includes("export default page")) {
    content = content.replace(/export default page/g, `export default ${exportName}`);
  }

  const nextImageComponents = ["team-section", "spring-back-card", "more-space-scroll", "infinite-slider"];
  if (nextImageComponents.includes(component)) {
    content = content.replace(/import Image from ["']next\/image["']/g, '');
    content = content.replace(/<Image\n?/g, '<img ');
    content = content.replace(/width=\{(\d+)\}/g, 'width="$1"');
    content = content.replace(/height=\{(\d+)\}/g, 'height="$1"');
    content = content.replace(/(<img[^>]*[^/])>/g, '$1 />');
  }

  // ✅ Page wrapper so v0 has an entry point to render at "/"
  const pageContent = `import ${exportName} from "@/components/${folder}/${fileName.replace('.tsx', '')}";

export default function Page() {
  return (
    <div className="min-h-screen bg-black">
      <${exportName} />
    </div>
  );
}`;

  return NextResponse.json({
    $schema: "https://ui.shadcn.com/schema/registry-item.json",  // ← add this
    name: component,
    type: "registry:block",
    title: folder,                          // ← add this (human readable)
    description: `${folder} component from ProdigyUI`,  // ← add this
    dependencies: getDependencies(component),
    files: [
      {
        path: `components/${folder}/${fileName}`,
        content: content,
        type: "registry:component",
        // ← no target needed for registry:component
      },
      {
        path: "app/page.tsx",
        content: pageContent,
        type: "registry:page",
        target: "app/page.tsx",            // ← required for registry:page
      },
    ],
  });
}