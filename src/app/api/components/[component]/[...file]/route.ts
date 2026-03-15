import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { COMPONENT_MAP } from "@/lib/component-config";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ component: string; file: string[] }> }
) {
  const { component, file } = await params;
  const fileName = file[file.length - 1];
  
  const config = COMPONENT_MAP[component];
  if (!config) {
    return new NextResponse("Component not found", { status: 404 });
  }

  const fileConfig = config.files[fileName];
  if (!fileConfig) {
    return new NextResponse("File not found in component", { status: 404 });
  }

  const filePath = path.join(
    process.cwd(),
    "src/components/UIElement",
    config.folder,
    fileConfig.source
  );

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

  // Fix export name if different from filename
  if (fileConfig.exportName) {
    // Replace function page() with function ComponentName()
    content = content.replace(/function page\(\)/g, `function ${fileConfig.exportName}()`);
    // Replace export default page with export default ComponentName
    content = content.replace(/export default (\w+)/g, `export default ${fileConfig.exportName}`);
  }

  // For spring-back-card, also export Cards as named export
  if (component === "spring-back-card" && fileName === "page.tsx") {
    // Add export for Cards function if not already exported
    if (!content.includes("export function Cards")) {
      content = content.replace(/^function Cards\(\)/m, "export function Cards()");
    }
  }

  // Replace next/image with regular img for non-Next.js projects
  if (["team-section", "spring-back-card", "more-space-scroll", "infinite-slider"].includes(component)) {
    content = content.replace(/import Image from ["']next\/image["']/g, '');
    // Replace Image component with img - handle both self-closing and regular tags
    content = content.replace(/<Image\n?/g, '<img ');
    content = content.replace(/width=\{(\d+)\}/g, 'width="$1"');
    content = content.replace(/height=\{(\d+)\}/g, 'height="$1"');
    // Only add self-closing for img tags, not for closing tags
    content = content.replace(/(<img[^>]*[^/])>/g, '$1 />');
    
    // Fix import paths for spring-back-card
    if (component === "spring-back-card") {
      content = content.replace(/from ["']@\/components\/UIElement\/SpringBackCard\/SpringBackCard["']/g, 'from "./SpringBackCard"');
    }
  }
  
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
