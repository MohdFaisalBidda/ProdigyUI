"use client";

import React from "react";
import TeamSection from "@/components/UIElement/TeamSection/TeamSection";
import ComponentPageLayout from "@/components/layout/ComponentPageLayout";
import { getImageSrc } from "@/lib/images";

const TEAM_MEMBERS = [
  { image: getImageSrc("/img4.avif", 1), name: "Jack" },
  { image: getImageSrc("/img2.avif", 2), name: "Jane" },
  { image: getImageSrc("/img3.avif", 3), name: "Bob" },
  { image: getImageSrc("/img1.avif", 4), name: "John" },
  { image: getImageSrc("/img5.avif", 5), name: "Lisa" },
  { image: getImageSrc("/img6.avif", 6), name: "Harry" },
];

export default function TeamSectionPage() {
  return (
    <ComponentPageLayout
      index="02"
      name="Team Section"
      tag="Interactive"
      tagColor="#7B6BFF"
      slug="team-section"
      description="Interactive team member showcase with GSAP-powered hover animations. Names animate in on profile hover."

      preview={
        <TeamSection defaultName="Our Squad" members={TEAM_MEMBERS} />
      }

      codeSnippet={`import TeamSection from "@/components/UIElement/TeamSection/TeamSection";

const members = [
  { image: "https://picsum.photos/seed/1/200/200", name: "Jack" },
  { image: "https://picsum.photos/seed/2/200/200", name: "Jane" },
  { image: "https://picsum.photos/seed/3/200/200", name: "Bob" },
];

export default function Example() {
  return (
    <TeamSection defaultName="Our Squad" members={members} />
  );
}`}

      props={[
        { name: "defaultName", type: "string", default: '"Our Squad"', description: "Text displayed when no member is hovered" },
        { name: "members", type: "TeamMember[]", required: true, description: "Array of team members" },
        { name: "backgroundColor", type: "string", default: '"#0f0f0f"', description: "Background color of the section" },
        { name: "textColor", type: "string", default: '"#e3e3db"', description: "Default text color" },
        { name: "accentColor", type: "string", default: '"#f93535"', description: "Hover name color" },
        { name: "containerClassName", type: "string", default: '""', description: "Extra class for the section container" },
        { name: "containerStyle", type: "React.CSSProperties", default: "—", description: "Inline styles for the container" },
        { name: "hoverScaleFactor", type: "number", default: "2", description: "Scale multiplier when a profile image is hovered" },
        { name: "animDuration", type: "number", default: "0.75", description: "Animation duration in seconds" },
        { name: "charStagger", type: "number", default: "0.025", description: "Stagger each char by this amount" },
      ]}

      prevComponent={{ slug: "stroke-cards", name: "Stroke Cards" }}
      nextComponent={{ slug: "spring-back-card", name: "Spring Back Card" }}
    />
  );
}
