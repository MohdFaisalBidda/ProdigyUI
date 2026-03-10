"use client";

import React from "react";
import SpringBackCards from "@/components/UIElement/SpringBackCard/page";
import ComponentPageLayout from "@/components/layout/ComponentPageLayout";

export default function SpringBackCardPage() {
  return (
    <ComponentPageLayout
      index="03"
      name="Spring Back Card"
      tag="Interactive"
      tagColor="#FF3B3B"
      slug="spring-back-card"
      description="3D spring physics card that follows cursor movement with smooth lerp interpolation and rotation effects."

      preview={
        <SpringBackCards />
      }

      codeSnippet={`import SpringBackCards from "@/components/UIElement/SpringBackCard/page";

export default function Example() {
  return <SpringBackCards />;
}`}

      props={[
        { name: "children", type: "ReactNode", default: "—", description: "Card content to render" },
        { name: "imgSrc", type: "string", default: "—", description: "Optional background image source" },
        { name: "imgAlt", type: "string", default: '""', description: "Alt text for image" },
        { name: "widthClass", type: "string", default: "—", description: "Tailwind width class" },
        { name: "heightClass", type: "string", default: "—", description: "Tailwind height class" },
        { name: "className", type: "string", default: '""', description: "Extra CSS classes" },
        { name: "style", type: "React.CSSProperties", default: "—", description: "Inline styles" },
        { name: "initialRotation", type: "number", default: "0", description: "Initial rotation in degrees" },
        { name: "offsetX", type: "number", default: "0", description: "X offset for positioning" },
        { name: "delay", type: "number", default: "0", description: "Animation delay in seconds" },
        { name: "index", type: "number", default: "0", description: "Index for staggered animations" },
        { name: "interactive", type: "boolean", default: "true", description: "Enable mouse interaction" },
        { name: "maxRotation", type: "number", default: "20", description: "Maximum rotation on hover" },
        { name: "maxX", type: "number", default: "30", description: "Maximum X movement" },
        { name: "maxY", type: "number", default: "30", description: "Maximum Y movement" },
        { name: "lerpSpeed", type: "number", default: "0.1", description: "Lerp interpolation speed" },
        { name: "mobileVisible", type: "boolean", default: "true", description: "Show on mobile devices" },
      ]}

      prevComponent={{ slug: "team-section", name: "Team Section" }}
      nextComponent={{ slug: "more-space-scroll", name: "More Space Scroll" }}
    />
  );
}
