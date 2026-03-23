import type { Metadata } from "next";
import TeamSection from "@/components/UIElement/TeamSection/TeamSection";
import ComponentPageLayout from "@/components/layout/ComponentPageLayout";
import { getComponentBySlug } from "@/lib/component-registry";
import { getImageSrc } from "@/lib/images";

export async function generateMetadata(): Promise<Metadata> {
  const component = getComponentBySlug("team-section");

  if (!component) {
    return { title: "Team Section | Prodigy UI" };
  }

  return {
    title: component.name,
    description: component.description,
    keywords: [
      component.name,
      component.tag,
      "react component",
      "animation",
      "gsap",
      "team showcase",
      "hover animation",
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

const TEAM_MEMBERS = [
  { image: getImageSrc("/img4.avif", 1), name: "Jack" },
  { image: getImageSrc("/img2.avif", 2), name: "Jane" },
  { image: getImageSrc("/img3.avif", 3), name: "Bob" },
  { image: getImageSrc("/img1.avif", 4), name: "John" },
  { image: getImageSrc("/img5.avif", 5), name: "Lisa" },
  { image: getImageSrc("/img6.avif", 6), name: "Harry" },
];

export default function TeamSectionPage() {
  const component = getComponentBySlug("team-section");

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
        <TeamSection
          defaultName="Our Squad"
          members={TEAM_MEMBERS}
          backgroundColor="#070707"
          textColor="#e3e3db"
          accentColor="#FF3B3B"
        />
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
