"use client";

import React from "react";
import MoreSpaceScroll from "@/components/UIElement/MoreSpaceScroll/page";
import ComponentPageLayout from "@/components/layout/ComponentPageLayout";

export default function MoreSpaceScrollPage() {
  return (
    <ComponentPageLayout
      index="04"
      name="More Space Scroll"
      tag="Scroll"
      tagColor="#C8FF00"
      slug="more-space-scroll"
      description="Smooth scrolling effect using Lenis with horizontal project showcase. Scroll vertically to move through horizontal content."

      preview={
        <MoreSpaceScroll />
      }

      codeSnippet={`import MoreSpaceScroll from "@/components/UIElement/MoreSpaceScroll/page";

export default function Example() {
  return <MoreSpaceScroll />;
}`}

      props={[]}

      prevComponent={{ slug: "spring-back-card", name: "Spring Back Card" }}
      nextComponent={{ slug: "infinte-contact", name: "Infinite Contact" }}
    />
  );
}
