export interface ComponentData {
  slug: string;
  index: string;
  name: string;
  tag: string;
  tagColor: string;
  description: string;
  snippet: string;
}

export const components: ComponentData[] = [
  {
    slug: "stroke-cards",
    index: "01",
    name: "Stroke Cards",
    tag: "Interactive",
    tagColor: "#C8FF00",
    description: "SVG path-drawing animation with masked image hover reveals. Each card traces its border on hover.",
    snippet: `import StrokeCards from "@/components/UIElement/StrokeCards/StrokeCards";

const cards = [
  { id: "1", imgSrc: "/img1.png", title: "Motion Design", strokeColor1: "#C8FF00", strokeColor2: "#FF3B3B" },
];

<StrokeCards cards={cards} columns={3} gap="1rem" />`,
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
  },
  {
    slug: "infinite-contact",
    index: "05",
    name: "Infinite Contact",
    tag: "Scroll",
    tagColor: "#7B6BFF",
    description: "Scroll-triggered infinite contact section with GSAP animations. Contact info animates infinitely as you scroll.",
    snippet: `import InfiniteContact from "@/components/UIElement/InfiniteContact/page";

<InfiniteContact />`,
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
  },
];
