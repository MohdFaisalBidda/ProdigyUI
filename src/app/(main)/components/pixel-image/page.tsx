import type { Metadata } from "next";
import PixelImage from "@/components/UIElement/PixelImage/PixelImage";
import ComponentPageLayout from "@/components/layout/ComponentPageLayout";
import { getComponentBySlug } from "@/lib/component-registry";

export async function generateMetadata(): Promise<Metadata> {
  const component = getComponentBySlug("pixel-image");

  if (!component) {
    return { title: "Pixel Image | Prodigy UI" };
  }

  return {
    title: component.name,
    description: component.description,
    keywords: [
      component.name,
      component.tag,
      "react component",
      "animation",
      "pixel animation",
      "image effect",
      "gsap animation",
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

export default function PixelImagePage() {
  const component = getComponentBySlug("pixel-image");

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
        <div className="p-8">
          <PixelImage
            className="h-[400px] w-full mt-8"
            loop
            loopTimes={Infinity}
            speed={1.5}
            loopDelay={3}
            pxSteps={[40, 20, 10, 6, 4, 2, 1]}
            triggerStart="top+=20% bottom"
          >
            <img src="/img4.avif" className="w-full h-full" />
          </PixelImage>
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
