"use client";

import React from "react";
import ComponentPageLayout from "@/components/layout/ComponentPageLayout";
import { getComponentBySlug } from "@/lib/component-registry";

export default function GlowingLightPage() {
  const component = getComponentBySlug("glowing-light");

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
