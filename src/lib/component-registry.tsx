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
      { name: "cards", type: "CardEntry[]", required: true, description: "Array of card objects containing id, imgSrc, title, and color properties" },
      { name: "columns", type: "2 | 3 | 4", default: "2", description: "Number of cards per row in the grid" },
      { name: "gap", type: "string", default: '"1rem"', description: "CSS gap value between cards (e.g., '1rem', '20px')" },
      { name: "padding", type: "string", default: '"0 2rem"', description: "CSS padding around the grid container" },
      { name: "className", type: "string", default: '""', description: "Additional CSS classes for the container" },
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
      { name: "members", type: "TeamMember[]", required: true, description: "Array of team member objects with image and name properties" },
      { name: "defaultName", type: "string", default: '"Our Squad"', description: "Text displayed when no member is hovered" },
      { name: "backgroundColor", type: "string", default: '"#0f0f0f"', description: "Background color of the section (CSS color value)" },
      { name: "textColor", type: "string", default: '"#e3e3db"', description: "Default text color for the name display" },
      { name: "accentColor", type: "string", default: '"#f93535"', description: "Color of the hovered member's name" },
      { name: "containerClassName", type: "string", default: '""', description: "Additional CSS classes for the main container" },
      { name: "containerStyle", type: "CSSProperties", default: "{}", description: "Inline styles for the main container" },
      { name: "profileImagesContainerClassName", type: "string", default: '""', description: "CSS classes for the images container" },
      { name: "profileImagesContainerStyle", type: "CSSProperties", default: "{}", description: "Inline styles for the images container" },
      { name: "profileNamesContainerClassName", type: "string", default: '""', description: "CSS classes for the names container" },
      { name: "profileNamesContainerStyle", type: "CSSProperties", default: "{}", description: "Inline styles for the names container" },
      { name: "defaultNameClassName", type: "string", default: '""', description: "CSS classes for the default name heading" },
      { name: "defaultNameStyle", type: "CSSProperties", default: "{}", description: "Inline styles for the default name" },
      { name: "memberNameClassName", type: "string", default: '""', description: "CSS classes for all member name headings" },
      { name: "memberNameStyle", type: "CSSProperties", default: "{}", description: "Inline styles for all member names" },
      { name: "hoverScaleFactor", type: "number", default: "2", description: "Scale multiplier when a profile image is hovered" },
      { name: "animDuration", type: "number", default: "0.75", description: "Animation duration in seconds" },
      { name: "charStagger", type: "number", default: "0.025", description: "Stagger delay between each character animation" },
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
    snippet: `import SpringBackCard from "@/components/UIElement/SpringBackCard/SpringBackCard";

<SpringBackCard
  imgSrc="/image.jpg"
  initialRotation={-6}
  className="left-[25%] top-[50%]"
  widthClass="w-28 md:w-36 lg:w-48"
  heightClass="h-36 md:h-48 lg:h-64"
/>`,
    previewUrl: "/preview/spring-back-card",
    previewHeight: 600,
    props: [
      { name: "children", type: "ReactNode", default: "undefined", description: "Custom content to render inside the card" },
      { name: "imgSrc", type: "string", default: "undefined", description: "Image source URL for the card background" },
      { name: "imgAlt", type: "string", default: '"Card image"', description: "Alt text for the card image" },
      { name: "widthClass", type: "string", default: '"w-28 sm:w-32 md:w-40 lg:w-56"', description: "Tailwind width class for card size" },
      { name: "heightClass", type: "string", default: '"h-36 sm:h-40 md:h-52 lg:h-72"', description: "Tailwind height class for card size" },
      { name: "className", type: "string", default: '""', description: "Additional CSS classes for positioning" },
      { name: "style", type: "CSSProperties", default: "{}", description: "Inline styles for the wrapper" },
      { name: "initialRotation", type: "number", default: "0", description: "Initial rotation angle in degrees (positive = clockwise)" },
      { name: "offsetX", type: "number", default: "0", description: "Horizontal offset from the card's base position" },
      { name: "delay", type: "number", default: "0", description: "Animation delay in seconds for entrance animation" },
      { name: "index", type: "number", default: "0", description: "Index used for staggered entrance animations" },
      { name: "interactive", type: "boolean", default: "true", description: "Enable/disable cursor tracking interaction" },
      { name: "maxRotation", type: "number", default: "18", description: "Maximum rotation angle when following cursor" },
      { name: "maxX", type: "number", default: "80", description: "Maximum horizontal displacement in pixels" },
      { name: "maxY", type: "number", default: "60", description: "Maximum vertical displacement in pixels" },
      { name: "lerpSpeed", type: "number", default: "0.1", description: "Speed of the spring interpolation (lower = smoother but slower)" },
      { name: "mobileVisible", type: "boolean", default: "true", description: "Whether the card is visible on mobile screens (< 640px)" },
    ],
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
    props: [
      { name: "No props", type: "standalone", default: "N/A", description: "This component renders a complete scroll experience - customize by editing the source" },
    ],
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
    snippet: `import InfiniteContact from "@/components/UIElement/InfiniteContact/page";

<InfiniteContact />`,
    previewUrl: "/preview/infinte-contact",
    previewHeight: 600,
    props: [
      { name: "No props", type: "standalone", default: "N/A", description: "This component renders a complete scroll experience - customize by editing the source" },
    ],
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
    props: [
      { name: "No props", type: "standalone", default: "N/A", description: "This component renders a complete interactive slider - customize by editing the source" },
    ],
    prevComponent: { slug: "infinte-contact", name: "Infinite Contact" },
    nextComponent: { slug: "glowing-light", name: "Glowing Light" },
    peerDependencies: ["gsap"],
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
    props: [
      { name: "No props", type: "standalone", default: "N/A", description: "This component renders a complete cursor-tracking effect - customize by editing the source" },
    ],
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
      { name: "items", type: "StatusItem[]", default: "defaultStatusItems", description: "Array of status items with id, icon, label/value properties" },
      { name: "renderContent", type: "(item: StatusItem) => ReactNode", default: "undefined", description: "Custom renderer for tooltip content" },
      { name: "contentClassName", type: "string", default: '""', description: "CSS classes for the tooltip text" },
      { name: "barColor", type: "string", default: '"#C8FF00"', description: "Background color of the bar and gooey blob" },
      { name: "iconColor", type: "string", default: '"#000000"', description: "Color of the icons" },
      { name: "className", type: "string", default: '""', description: "Additional CSS classes for the outer wrapper" },
      { name: "iconSize", type: "string", default: '"w-5 h-5"', description: "Tailwind size class for icons" },
      { name: "buttonSize", type: "string", default: '"w-10 h-10"', description: "Tailwind size class for buttons" },
      { name: "gap", type: "string", default: '"gap-1"', description: "Tailwind gap class between buttons" },
      { name: "padding", type: "string", default: '"px-3"', description: "CSS padding for the main bar" },
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
