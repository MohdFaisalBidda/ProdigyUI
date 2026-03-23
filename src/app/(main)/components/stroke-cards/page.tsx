import type { Metadata } from "next";
import StrokeCards from "@/components/UIElement/StrokeCards/StrokeCards";
import ComponentPageLayout from "@/components/layout/ComponentPageLayout";
import { getComponentBySlug } from "@/lib/component-registry";
import { getLocalImage } from "@/lib/images";

const PREVIEW_CARDS = [
  { id: "1", imgSrc: getLocalImage(0, 1), title: "Motion Design", strokeColor1: "#C8FF00", strokeColor2: "#FF3B3B" },
  { id: "2", imgSrc: getLocalImage(1, 2), title: "Typography", strokeColor1: "#7B6BFF", strokeColor2: "#C8FF00" },
  { id: "3", imgSrc: getLocalImage(2, 3), title: "Color Systems", strokeColor1: "#FF3B3B", strokeColor2: "#7B6BFF" },
];

export async function generateMetadata(): Promise<Metadata> {
  const component = getComponentBySlug("stroke-cards");

  if (!component) {
    return { title: "Stroke Cards | Prodigy UI" };
  }

  return {
    title: component.name,
    description: component.description,
    keywords: [
      component.name,
      component.tag,
      "react component",
      "animation",
      "svg animation",
      "hover effect",
      "card component",
      "prodigy ui",
    ],
    openGraph: {
      title: `${component.name} | Prodigy UI`,
      description: component.description,
      images: [
        {
          url: `/og-${component.slug}.png`,
          width: 1200,
          height: 630,
          alt: `${component.name} Component Preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${component.name} | Prodigy UI`,
      description: component.description,
      images: [`/og-${component.slug}.png`],
    },
  };
}

export default function StrokeCardsPage() {
  const component = getComponentBySlug("stroke-cards");

  if (!component) return null;

  return (
    <ComponentPageLayout
      index={component.index}
      name={component.name}
      tag={component.tag}
      tagColor={component.tagColor}
      slug={component.slug}
      description={component.description}
      preview={
        <div className="w-full flex items-center justify-center p-10 px-6">
          <StrokeCards cards={PREVIEW_CARDS} columns={3} gap="1rem" padding="0" />
        </div>
      }
      previewUrl={component.previewUrl}
      previewHeight={component.previewHeight}
      codeSnippet={component.snippet}
      props={component.props}
      prevComponent={component.prevComponent}
      nextComponent={component.nextComponent}
      peerDependencies={component.peerDependencies}
    />
  );
}
