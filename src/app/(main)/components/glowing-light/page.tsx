"use client";

import React from "react";
import GlowingLight from "@/components/UIElement/GlowingLight/page";
import ComponentPageLayout from "@/components/layout/ComponentPageLayout";

export default function GlowingLightPage() {
  return (
    <ComponentPageLayout
      index="07"
      name="Glowing Light"
      tag="Interactive"
      tagColor="#C8FF00"
      slug="glowing-light"
      description="Lottie-powered glowing light effect that tracks cursor movement with spotlight and mask animations."

      preview={
        <GlowingLight />
      }

      codeSnippet={`import GlowingLight from "@/components/UIElement/GlowingLight/page";

export default function Example() {
  return <GlowingLight />;
}`}

      props={[]}

      prevComponent={{ slug: "infinite-slider", name: "Infinite Slider" }}
      nextComponent={{ slug: "gooey-bar", name: "Gooey Bar" }}
    />
  );
}
