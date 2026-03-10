"use client";

import React from "react";
import TeamSection from "@/components/UIElement/TeamSection/TeamSection";
import ComponentPageLayout from "@/components/layout/ComponentPageLayout";

const TEAM_MEMBERS = [
  { image: "/img4.avif", name: "Jack" },
  { image: "/img2.avif", name: "Jane" },
  { image: "/img3.avif", name: "Bob" },
  { image: "/img1.avif", name: "John" },
  { image: "/img5.avif", name: "Lisa" },
  { image: "/img6.avif", name: "Harry" },
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
  { image: "/img4.avif", name: "Jack" },
  { image: "/img2.avif", name: "Jane" },
  { image: "/img3.avif", name: "Bob" },
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
