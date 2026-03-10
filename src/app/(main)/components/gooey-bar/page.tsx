"use client";

import React from "react";
import GooeyStatusBar from "@/components/UIElement/GooeyBar/GoeeyBar";
import ComponentPageLayout from "@/components/layout/ComponentPageLayout";

export default function GooeyBarPage() {
  return (
    <ComponentPageLayout
      index="08"
      name="Gooey Bar"
      tag="Interactive"
      tagColor="#7B6BFF"
      slug="gooey-bar"
      description="Animated status bar with gooey SVG filter effects. Hover over items to see fluid morphing animations with tooltips."

      preview={
        <GooeyStatusBar />
      }

      codeSnippet={`import GooeyStatusBar from "@/components/UIElement/GooeyBar/GoeeyBar";

export default function Example() {
  return <GooeyStatusBar />;
}`}

      props={[
        { name: "items", type: "StatusItem[]", default: "defaultStatusItems", description: "Items to display in the bar" },
        { name: "renderContent", type: "(item: StatusItem) => ReactNode", default: "—", description: "Custom renderer for tooltip content" },
        { name: "contentClassName", type: "string", default: '""', description: "Extra classes for tooltip text" },
        { name: "barColor", type: "string", default: '"black"', description: "Background color of bar and gooey blob" },
        { name: "iconColor", type: "string", default: '"white"', description: "Text/icon color" },
        { name: "className", type: "string", default: '""', description: "Extra class for outer wrapper" },
        { name: "iconSize", type: "string", default: '"w-5 h-5"', description: "Icon size class" },
        { name: "buttonSize", type: "string", default: '"w-10 h-10"', description: "Button size class" },
        { name: "gap", type: "string", default: '"gap-1"', description: "Gap between buttons" },
        { name: "padding", type: "string", default: '"px-3 py-2"', description: "Padding of main bar" },
      ]}

      prevComponent={{ slug: "glowing-light", name: "Glowing Light" }}
    />
  );
}
