import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getComponentBySlug } from "@/lib/component-registry";
import ComponentPageLayout from "@/components/layout/ComponentPageLayout";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponentBySlug(slug);

  if (!component) {
    return {
      title: "Component Not Found",
    };
  }

  return {
    title: component.name,
    description: component.description,
    keywords: [
      component.name,
      component.tag,
      ...(component.keywords || []),
      "react component",
      "animation",
      "gsap",
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

export default async function ComponentPage({ params }: PageProps) {
  const { slug } = await params;
  const component = getComponentBySlug(slug);

  if (!component) {
    notFound();
  }

  return (
    <ComponentPageLayout
      index={component.index}
      name={component.name}
      tag={component.tag}
      tagColor={component.tagColor}
      slug={component.slug}
      description={component.description}
      preview={component.preview}
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

export async function generateStaticParams() {
  const { componentRegistry } = await import("@/lib/component-registry");
  return componentRegistry.map((component) => ({
    slug: component.slug,
  }));
}
