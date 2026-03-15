import { notFound } from "next/navigation";
import { getComponentBySlug } from "@/lib/component-registry";
import ComponentPageLayout from "@/components/layout/ComponentPageLayout";

interface PageProps {
  params: Promise<{ slug: string }>;
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
