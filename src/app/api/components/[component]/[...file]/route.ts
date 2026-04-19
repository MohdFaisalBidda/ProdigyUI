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
      // Convert folder name to slug: "StrokeCards" -> "stroke-cards"
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

  // Dynamic folder lookup
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

  // Add type declarations for browser globals if not already present
  let headerAdded = false;
  if (!content.includes('declare global') && !content.includes('/// <reference')) {
    // Move "use client" to after header if present
    content = content.replace(/^"use client"/, '');
    content = content.replace(/^'use client'/, '');

    const header = `// @ts-nocheck
/* eslint-disable */
"use client";

`;
    content = header + content.trim();
    headerAdded = true;
  }

  // Fix export name: function page() -> function FolderName()
  const exportName = folder.replace(/[^a-zA-Z]/g, "");
  if (content.includes("function page()")) {
    content = content.replace(/function page\(\)/g, `function ${exportName}()`);
  }
  if (content.includes("export default page")) {
    content = content.replace(/export default page/g, `export default ${exportName}`);
  }

  // Replace next/image with regular img for non-Next.js projects
  const nextImageComponents = ["team-section", "spring-back-card", "more-space-scroll", "infinite-slider"];
  if (nextImageComponents.includes(component)) {
    content = content.replace(/import Image from ["']next\/image["']/g, '');
    content = content.replace(/<Image\n?/g, '<img ');
    content = content.replace(/width=\{(\d+)\}/g, 'width="$1"');
    content = content.replace(/height=\{(\d+)\}/g, 'height="$1"');
    content = content.replace(/(<img[^>]*[^/])>/g, '$1 />');
  }

  return NextResponse.json({
    name: component,
    type: "registry:ui",
    dependencies: getDependencies(component), // see below
    files: [
      {
        path: `components/${folder}/${fileName}`,
        content: content,
        type: "registry:ui",
      },
    ],
  });
}
