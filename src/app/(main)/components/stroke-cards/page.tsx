"use client";

import React from "react";
import StrokeCards from "@/components/UIElement/StrokeCards/StrokeCards";
import ComponentPageLayout from "@/components/layout/ComponentPageLayout";

const PREVIEW_CARDS = [
  { id: "1", imgSrc: "/img1.avif", title: "Motion Design", strokeColor1: "#C8FF00", strokeColor2: "#FF3B3B" },
  { id: "2", imgSrc: "/img2.avif", title: "Typography", strokeColor1: "#7B6BFF", strokeColor2: "#C8FF00" },
  { id: "3", imgSrc: "/img3.avif", title: "Color Systems", strokeColor1: "#FF3B3B", strokeColor2: "#7B6BFF" },
];

export default function StrokeCardsPage() {
  return (
    <ComponentPageLayout
      index="01"
      name="Stroke Cards"
      tag="Interactive"
      tagColor="#C8FF00"
      slug="stroke-cards"
      description="SVG path-drawing animation with masked image hover reveals. Each card traces its border on hover."

      preview={
        <StrokeCards
          cards={PREVIEW_CARDS}
          columns={3}
          gap="1rem"
          padding="2rem"
        />
      }

      codeSnippet={`import StrokeCards from "@/components/UIElement/StrokeCards/StrokeCards";

const cards = [
  {
    id: "1",
    imgSrc: "/img1.avif",
    title: "Motion Design",
    strokeColor1: "#C8FF00",
    strokeColor2: "#FF3B3B",
  },
];

export default function Example() {
  return (
    <StrokeCards
      cards={cards}
      columns={3}
      gap="1rem"
      padding="2rem"
    />
  );
}`}

      props={[
        { name: "imgSrc", type: "string", default: '"/img1.avif"', description: "Background image path" },
        { name: "imgAlt", type: "string", default: '""', description: "Alt text for the image" },
        { name: "title", type: "string", default: '"Hello World"', description: "Title text revealed on hover" },
        { name: "strokeColor1", type: "string", default: '"#F5EE41"', description: "Primary SVG stroke colour" },
        { name: "strokeColor2", type: "string", default: '"#6E44FF"', description: "Secondary SVG stroke colour" },
        { name: "titleColor", type: "string", default: '"white"', description: "Title text colour" },
        { name: "borderRadius", type: "string", default: '"2rem"', description: "Card corner radius" },
        { name: "strokeAnimDuration", type: "number", default: "1.5", description: "Stroke draw animation duration (s)" },
        { name: "titleAnimDuration", type: "number", default: "0.75", description: "Title reveal animation duration (s)" },
        { name: "className", type: "string", default: '""', description: "Extra CSS classes for the wrapper" },
        { name: "onClick", type: "() => void", default: "—", description: "Optional click handler" },
        { name: "children", type: "ReactNode", default: "—", description: "Custom overlay content" },
      ]}

      nextComponent={{ slug: "team-section", name: "Team Section" }}
    />
  );
}
