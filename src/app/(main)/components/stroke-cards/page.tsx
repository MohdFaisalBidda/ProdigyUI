import React from "react";
import StrokeCards from "@/components/UIElement/StrokeCards/StrokeCards";
import ComponentPageLayout from "@/components/layout/ComponentPageLayout";
import { getLocalImage } from "@/lib/images";

const PREVIEW_CARDS = [
  { id: "1", imgSrc: getLocalImage(0, 1), title: "Motion Design", strokeColor1: "#C8FF00", strokeColor2: "#FF3B3B" },
  { id: "2", imgSrc: getLocalImage(1, 2), title: "Typography", strokeColor1: "#7B6BFF", strokeColor2: "#C8FF00" },
  { id: "3", imgSrc: getLocalImage(2, 3), title: "Color Systems", strokeColor1: "#FF3B3B", strokeColor2: "#7B6BFF" },
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
    imgSrc: "https://picsum.photos/seed/1/800/600",
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
        { name: "cards", type: "CardEntry[]", default: "default cards with picsum images", description: "Array of card data" },
        { name: "columns", type: "2 | 3 | 4", default: "2", description: "Number of cards per row" },
        { name: "gap", type: "string", default: '"1rem"', description: "Gap between cards" },
        { name: "padding", type: "string", default: '"0 2rem"', description: "Padding around the grid" },
        { name: "minCardWidth", type: "string", default: '"280px"', description: "Minimum card width" },
        { name: "maxCardWidth", type: "string", default: '"400px"', description: "Maximum card width" },
      ]}

      nextComponent={{ slug: "team-section", name: "Team Section" }}
    />
  );
}
