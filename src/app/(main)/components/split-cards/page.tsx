import type { Metadata } from "next";
import ComponentPageLayout from "@/components/layout/ComponentPageLayout";
import { getComponentBySlug } from "@/lib/component-registry";

export async function generateMetadata(): Promise<Metadata> {
  const component = getComponentBySlug("split-cards");

  if (!component) {
    return { title: "Split Cards | Prodigy UI" };
  }

  return {
    title: component.name,
    description: component.description,
    keywords: [
      component.name,
      component.tag,
      "react component",
      "animation",
      "3d effect",
      "card flip",
      "scroll animation",
      "gsap",
      "lenis",
      "prodigy ui",
    ],
    openGraph: {
      title: `${component.name} | Prodigy UI`,
      description: component.description,
      images: [
        {
          url: `/og/og-${component.slug}.webp`,
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
      images: [`/og/og-${component.slug}.webp`],
    },
  };
}

export default function SplitCardsPage() {
  const component = getComponentBySlug("split-cards");

  if (!component) return null;

  return (
    <ComponentPageLayout
      index={component.index}
      name={component.name}
      tag={component.tag}
      tagColor={component.tagColor}
      slug={component.slug}
      description={component.description}
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
