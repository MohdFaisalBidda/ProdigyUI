"use client";

import React from "react";
import ComponentPageLayout from "@/components/layout/ComponentPageLayout";

export default function InfiniteSliderPage() {
  return (
    <ComponentPageLayout
      index="06"
      name="Infinite Slider"
      tag="Interactive"
      tagColor="#FF3B3B"
      slug="infinite-slider"
      description="Arc-shaped infinite image slider with GSAP scroll-triggered animations. Images arranged in a 3D arc perspective."

      previewUrl="/preview/infinite-slider"

      codeSnippet={`import InfiniteSlider from "@/components/UIElement/InfiniteSlider/page";

export default function Example() {
  return <InfiniteSlider />;
}`}

      props={[]}

      prevComponent={{ slug: "infinte-contact", name: "Infinite Contact" }}
      nextComponent={{ slug: "glowing-light", name: "Glowing Light" }}
    />
  );
}
