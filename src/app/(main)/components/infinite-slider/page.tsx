import type { Metadata } from "next";
import ComponentPageLayout from "@/components/layout/ComponentPageLayout";
import { getComponentBySlug } from "@/lib/component-registry";

export async function generateMetadata(): Promise<Metadata> {
  const component = getComponentBySlug("infinite-slider");
  
  if (!component) {
    return {
      title: "Infinite Slider | Prodigy UI",
    };
  }

  return {
    title: `${component.name} | Prodigy UI`,
    description: component.description,
    openGraph: {
      title: `${component.name} | Prodigy UI`,
      description: component.description,
      images: [
        {
          url: "/og-infinite-slider.png",
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
      images: ["/og-infinite-slider.png"],
    },
  };
}

export default function InfiniteSliderPage() {
  const component = getComponentBySlug("infinite-slider");

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
