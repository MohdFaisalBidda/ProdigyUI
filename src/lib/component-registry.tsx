import { ReactNode } from "react";
import StrokeCards from "@/components/UIElement/StrokeCards/StrokeCards";
import TeamSection from "@/components/UIElement/TeamSection/TeamSection";
import GooeyStatusBar from "@/components/UIElement/GooeyBar/GoeeyBar";

export type ComponentData = {
  slug: string;
  index: string;
  name: string;
  tag: string;
  tagColor: string;
  description: string;
  snippet: string;
};

export type PropField = {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
};

export type ComponentRegistryItem = {
  slug: string;
  index: string;
  name: string;
  tag: string;
  tagColor: string;
  description: string;
  snippet: string;
  preview?: ReactNode;
  previewUrl?: string;
  previewHeight?: number;
  props: PropField[];
  installSteps?: { step: string; title: string; description: string; code: string }[];
  fullExample?: string;
  prevComponent?: { slug: string; name: string };
  nextComponent?: { slug: string; name: string };
  peerDependencies?: string[];
};

const STROKE_CARDS_PREVIEW = [
  { id: "1", imgSrc: "/img1.avif", title: "Motion Design", strokeColor1: "#C8FF00", strokeColor2: "#FF3B3B" },
  { id: "2", imgSrc: "/img2.avif", title: "Typography", strokeColor1: "#7B6BFF", strokeColor2: "#C8FF00" },
  { id: "3", imgSrc: "/img3.avif", title: "Color Systems", strokeColor1: "#FF3B3B", strokeColor2: "#7B6BFF" },
];

const TEAM_MEMBERS_PREVIEW = [
  { image: "/img4.avif", name: "Jack" },
  { image: "/img2.avif", name: "Jane" },
  { image: "/img3.avif", name: "Bob" },
  { image: "/img1.avif", name: "John" },
  { image: "/img5.avif", name: "Lisa" },
  { image: "/img6.avif", name: "Harry" },
];

export const componentRegistry: ComponentRegistryItem[] = [
  {
    slug: "stroke-cards",
    index: "01",
    name: "Stroke Cards",
    tag: "Interactive",
    tagColor: "#C8FF00",
    description: "SVG path-drawing animation with masked image hover reveals. Each card traces its border on hover.",
    snippet: `import StrokeCards from "@/components/UIElement/StrokeCards/StrokeCards";

const cards = [
  { id: "1", imgSrc: "/img1.avif", title: "Motion Design", strokeColor1: "#C8FF00", strokeColor2: "#FF3B3B" },
];

<StrokeCards cards={cards} columns={3} gap="1rem" />`,
    preview: (
      <div className="w-full flex items-center justify-center p-10 px-6">
        <StrokeCards cards={STROKE_CARDS_PREVIEW} columns={3} gap="1rem" padding="0" />
      </div>
    ),
    props: [
      { name: "cards", type: "Card[]", required: true, description: "Array of card objects with id, imgSrc, title, strokeColor1, strokeColor2" },
      { name: "columns", type: "number", default: "3", description: "Number of columns in the grid" },
      { name: "gap", type: "string", default: '"1rem"', description: "Gap between cards" },
      { name: "padding", type: "string", default: '"2rem"', description: "Padding around the container" },
      { name: "className", type: "string", default: '""', description: "Extra CSS classes" },
    ],
    prevComponent: undefined,
    nextComponent: { slug: "team-section", name: "Team Section" },
    peerDependencies: ["gsap"],
  },
  {
    slug: "team-section",
    index: "02",
    name: "Team Section",
    tag: "GSAP",
    tagColor: "#FF3B3B",
    description: "Interactive team member showcase with GSAP-powered hover animations. Names animate in on profile hover.",
    snippet: `import TeamSection from "@/components/UIElement/TeamSection/TeamSection";

const members = [
  { image: "/img4.avif", name: "Jack" },
  { image: "/img2.avif", name: "Jane" },
];

<TeamSection defaultName="Our Squad" members={members} />`,
    preview: (
      <TeamSection
        defaultName="Our Squad"
        members={TEAM_MEMBERS_PREVIEW}
        backgroundColor="#070707"
        textColor="#e3e3db"
        accentColor="#FF3B3B"
      />
    ),
    props: [
      { name: "members", type: "TeamMember[]", required: true, description: "Array of { image, name } objects" },
      { name: "defaultName", type: "string", default: '"Our Squad"', description: "Text shown when no member is hovered" },
      { name: "backgroundColor", type: "string", default: '"#0f0f0f"', description: "Section background colour" },
      { name: "textColor", type: "string", default: '"#e3e3db"', description: "Default name text colour" },
      { name: "accentColor", type: "string", default: '"#f93535"', description: "Hovered member name colour" },
    ],
    prevComponent: { slug: "stroke-cards", name: "Stroke Cards" },
    nextComponent: { slug: "spring-back-card", name: "Spring Back Card" },
    peerDependencies: ["gsap"],
  },
  {
    slug: "spring-back-card",
    index: "03",
    name: "Spring Back Card",
    tag: "Interactive",
    tagColor: "#FF3B3B",
    description: "3D spring physics card that follows cursor movement with smooth lerp interpolation and rotation effects.",
    snippet: `import SpringBackCards from "@/components/UIElement/SpringBackCard/page";

<SpringBackCards />`,
    previewUrl: "/preview/spring-back-card",
    previewHeight: 600,
    props: [],
    prevComponent: { slug: "team-section", name: "Team Section" },
    nextComponent: { slug: "more-space-scroll", name: "More Space Scroll" },
    peerDependencies: [],
  },
  {
    slug: "more-space-scroll",
    index: "04",
    name: "More Space Scroll",
    tag: "Scroll",
    tagColor: "#C8FF00",
    description: "Smooth scrolling effect using Lenis with horizontal project showcase. Scroll vertically to move through horizontal content.",
    snippet: `import MoreSpaceScroll from "@/components/UIElement/MoreSpaceScroll/page";

<MoreSpaceScroll />`,
    previewUrl: "/preview/more-space-scroll",
    previewHeight: 600,
    props: [],
    prevComponent: { slug: "spring-back-card", name: "Spring Back Card" },
    nextComponent: { slug: "infinte-contact", name: "Infinite Contact" },
    peerDependencies: ["lenis", "gsap"],
  },
  {
    slug: "infinte-contact",
    index: "05",
    name: "Infinite Contact",
    tag: "Scroll",
    tagColor: "#7B6BFF",
    description: "Scroll-triggered infinite contact section with GSAP animations. Contact info animates infinitely as you scroll.",
    snippet: `import InfiniteContact from "@/components/UIElement/InfinteContact/page";

<InfiniteContact />`,
    previewUrl: "/preview/infinte-contact",
    previewHeight: 600,
    props: [],
    prevComponent: { slug: "more-space-scroll", name: "More Space Scroll" },
    nextComponent: { slug: "infinite-slider", name: "Infinite Slider" },
    peerDependencies: ["gsap", "lenis"],
  },
  {
    slug: "infinite-slider",
    index: "06",
    name: "Infinite Slider",
    tag: "Interactive",
    tagColor: "#FF3B3B",
    description: "Arc-shaped infinite image slider with GSAP scroll-triggered animations. Images arranged in a 3D arc perspective.",
    snippet: `import InfiniteSlider from "@/components/UIElement/InfiniteSlider/page";

<InfiniteSlider />`,
    previewUrl: "/preview/infinite-slider",
    previewHeight: 600,
    props: [],
    prevComponent: { slug: "infinte-contact", name: "Infinite Contact" },
    nextComponent: { slug: "glowing-light", name: "Glowing Light" },
  },
  {
    slug: "glowing-light",
    index: "07",
    name: "Glowing Light",
    tag: "Interactive",
    tagColor: "#C8FF00",
    description: "Lottie-powered glowing light effect that tracks cursor movement with spotlight and mask animations.",
    snippet: `import GlowingLight from "@/components/UIElement/GlowingLight/page";

<GlowingLight />`,
    previewUrl: "/preview/glowing-light",
    previewHeight: 600,
    props: [],
    prevComponent: { slug: "infinite-slider", name: "Infinite Slider" },
    nextComponent: { slug: "gooey-bar", name: "Gooey Bar" },
    peerDependencies: ["lenis"],
  },
  {
    slug: "gooey-bar",
    index: "08",
    name: "Gooey Bar",
    tag: "Motion",
    tagColor: "#7B6BFF",
    description: "Animated status bar with gooey SVG filter effects. Hover over items to see fluid morphing animations with tooltips.",
    snippet: `import GooeyStatusBar from "@/components/UIElement/GooeyBar/GoeeyBar";

<GooeyStatusBar />`,
    preview: (
      <div className="w-full flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-xl">
          <GooeyStatusBar barColor="#7B6BFF" iconColor="#000000" />
        </div>
      </div>
    ),
    props: [
      { name: "items", type: "StatusItem[]", description: "Array of { id, icon, value } objects" },
      { name: "barColor", type: "string", default: '"#000000"', description: "Background colour of bar" },
      { name: "iconColor", type: "string", default: '"#ffffff"', description: "Icon colour" },
      { name: "className", type: "string", default: '""', description: "Extra CSS classes" },
    ],
    prevComponent: { slug: "glowing-light", name: "Glowing Light" },
    nextComponent: undefined,
    peerDependencies: ["motion"],
  },
];

export const components: ComponentData[] = componentRegistry.map((item) => ({
  slug: item.slug,
  index: item.index,
  name: item.name,
  tag: item.tag,
  tagColor: item.tagColor,
  description: item.description,
  snippet: item.snippet,
}));

export function getComponentBySlug(slug: string): ComponentRegistryItem | undefined {
  return componentRegistry.find((c) => c.slug === slug);
}

export function getComponentIndex(slug: string): number {
  return componentRegistry.findIndex((c) => c.slug === slug);
}
