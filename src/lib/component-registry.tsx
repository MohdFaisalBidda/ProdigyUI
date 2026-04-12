import { ReactNode } from "react";
import StrokeCards from "@/components/UIElement/StrokeCards/StrokeCards";
import TeamSection from "@/components/UIElement/TeamSection/TeamSection";
import GooeyStatusBar from "@/components/UIElement/GooeyBar/GoeeyBar";
import PixelImage from "@/components/UIElement/PixelImage/PixelImage";
import SplitCards from "@/components/UIElement/SplitCards/SplitCards";

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
  keywords?: string[];
};

const STROKE_CARDS_PREVIEW = [
  { id: "1", imgSrc: "/img1.png", title: "Motion Design", strokeColor1: "#252627", strokeColor2: "#767677" },
  { id: "2", imgSrc: "/img2.avif", title: "Typography", strokeColor1: "#9BA6F8", strokeColor2: "#071E4A" },
  { id: "3", imgSrc: "/img3.avif", title: "Color Systems", strokeColor1: "#B6A383", strokeColor2: "#414141" },
];

const TEAM_MEMBERS_PREVIEW = [
  { image: "/img4.avif", name: "Jack" },
  { image: "/img2.avif", name: "Jane" },
  { image: "/img3.avif", name: "Bob" },
  { image: "/img1.png", name: "John" },
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
    snippet: `import StrokeCards from "@/components/ui/stroke-cards/StrokeCards";

const cards = [
  { id: "1", imgSrc: "/img1.png", title: "Motion Design", strokeColor1: "#C8FF00", strokeColor2: "#FF3B3B" },
];

<StrokeCards cards={cards} columns={3} gap="1rem" />`,
    preview: (
      <div className="w-full flex items-center justify-center p-10 px-6">
        <StrokeCards cards={STROKE_CARDS_PREVIEW} columns={3} gap="1rem" padding="0" />
      </div>
    ),
    props: [
      { name: "cards", type: "Array<{ id: string; imgSrc?: string; imgAlt?: string; title?: string; strokeColor1?: string; strokeColor2?: string; titleColor?: string; borderRadius?: string; className?: string }>", required: true, description: "Array of card objects. Each card has: id (unique identifier), imgSrc (image URL), imgAlt (image alt text), title (hover text), strokeColor1 (primary stroke), strokeColor2 (secondary stroke), titleColor, borderRadius, className" },
      { name: "columns", type: "2 | 3 | 4", default: "2", description: "Number of cards per row in the grid" },
      { name: "gap", type: "string", default: '"1rem"', description: "CSS gap value between cards (e.g., '1rem', '20px')" },
      { name: "padding", type: "string", default: '"0 2rem"', description: "CSS padding around the grid container" },
      { name: "minCardWidth", type: "string", default: '"280px"', description: "Minimum width of each card" },
      { name: "maxCardWidth", type: "string", default: '"400px"', description: "Maximum width of each card" },
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
    snippet: `import TeamSection from "@/components/ui/team-section/TeamSection";

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
      { name: "members", type: "Array<{ image: string; name: string; imageClassName?: string; imageStyle?: CSSProperties; nameClassName?: string; nameStyle?: CSSProperties }>", required: true, description: "Array of team members. Each member has: image (profile photo URL), name (display name), and optional styling props" },
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
    snippet: `import SpringBackCard from "@/components/ui/spring-back-card/SpringBackCard";

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
    snippet: `import MoreSpaceScroll from "@/components/ui/more-space-scroll/MoreSpaceScroll";

const projects = [
  { name: "Project 1", img: "/project1.jpg", year: "2024" },
  { name: "Project 2", img: "/project2.jpg", year: "2025" },
];

<MoreSpaceScroll projects={projects} projectsPerRow={9} totalRows={10} />`,
    previewUrl: "/preview/more-space-scroll",
    previewHeight: 600,
    props: [
      { name: "projects", type: "Array<{ name: string; img: string; year: string }>", default: "default projects", description: "Array of project objects. Each project has: name (project title), img (image URL), year (project year)" },
      { name: "projectsPerRow", type: "number", default: "9", description: "Number of projects to display per row" },
      { name: "totalRows", type: "number", default: "10", description: "Total number of rows to render" },
    ],
    prevComponent: { slug: "spring-back-card", name: "Spring Back Card" },
    nextComponent: { slug: "infinite-contact", name: "Infinite Contact" },
    peerDependencies: ["lenis", "gsap"],
  },
  {
    slug: "infinite-contact",
    index: "05",
    name: "Infinite Contact",
    tag: "Scroll",
    tagColor: "#7B6BFF",
    description: "Scroll-triggered infinite contact section with GSAP animations. Contact info animates infinitely as you scroll.",
    snippet: `import InfiniteContact from "@/components/ui/infinite-contact/InfiniteContact";

const contacts = [
  { label: "Alex Morgan", value: "Founder & CEO" },
  { label: "Sophia Carter", value: "Creative Director" },
];

const images = ["/avatar1.jpg", "/avatar2.jpg"];

<InfiniteContact data={contacts} images={images} />`,
    previewUrl: "/preview/infinite-contact",
    previewHeight: 600,
    props: [
      { name: "data", type: "Array<{ label: string; value: string }>", default: "default contacts", description: "Array of contact items. Each item has: label (person name/role), value (position/title)" },
      { name: "images", type: "string[]", default: "default avatars", description: "Array of image URLs for the contact avatars" },
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
    snippet: `import InfiniteSlider from "@/components/ui/infinite-slider/InfiniteSlider";

const images = ["/slide1.jpg", "/slide2.jpg", "/slide3.jpg"];
const titles = ["First Slide", "Second Slide", "Third Slide"];

<InfiniteSlider images={images} titles={titles} slideCount={6} />`,
    previewUrl: "/preview/infinite-slider",
    previewHeight: 600,
    props: [
      { name: "images", type: "string[]", default: "picsum images", description: "Array of image URLs for the slides" },
      { name: "titles", type: "string[]", default: "default titles", description: "Array of title strings displayed below the slider" },
      { name: "slideCount", type: "number", default: "6", description: "Number of slide duplicates for infinite scrolling effect" },
    ],
    prevComponent: { slug: "infinite-contact", name: "Infinite Contact" },
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
    snippet: `import GlowingLight from "@/components/ui/glowing-light/GlowingLight";

<GlowingLight lottiePath="./fire.json" />`,
    previewUrl: "/preview/glowing-light",
    previewHeight: 600,
    props: [
      { name: "lottiePath", type: "string", default: '"/fire.json"', description: "Path to the Lottie JSON animation file" },
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
    snippet: `import GooeyStatusBar from "@/components/ui/gooey-bar/GooeyStatusBar";

<GooeyStatusBar />`,
    preview: (
      <div className="w-full flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-xl">
          <GooeyStatusBar barColor="#7B6BFF" iconColor="#000000" />
        </div>
      </div>
    ),
    props: [
      { name: "items", type: "Array<{ id: string; icon: 'music' | 'cube' | 'cloud' | 'wifi' | 'battery' | 'clock' | 'custom'; label?: string; value?: string; customIcon?: ReactNode }>", default: "defaultStatusItems", description: "Array of status items. Each item has: id (unique identifier), icon (icon type), label/value (display text), customIcon (for 'custom' type)" },
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
    nextComponent: { slug: "pixel-image", name: "Pixel Image" },
    peerDependencies: ["motion"],
  },
  {
    slug: "pixel-image",
    index: "09",
    name: "Pixel Image",
    tag: "Animation",
    tagColor: "#C8FF00",
    description: "Pixelated image reveal animation. Image dissolves from coarse pixels to clear after certain delay.",
    snippet: `import PixelImage from "@/components/ui/pixel-image/PixelImage";

function Page() {
  return (
    <div className="p-8">
      <PixelImage
        className="h-[400px] w-full mt-8"
        loop
        loopTimes={Infinity}
      />
    </div>
  )
}`,
    preview: (
      <div className="p-8">
        <PixelImage
          src="/img1.png"
          className="h-[400px] w-full mt-8"
          loop
          loopTimes={Infinity}
          triggerStart="top+=20% bottom"
        />
      </div>
    ),
    previewHeight: 600,
    props: [
      { name: "src", type: "string", default: "https://picsum.photos/800/600", description: "Image source URL" },
      { name: "pxSteps", type: "number[]", default: "[40, 20, 10, 6, 4, 2, 1]", description: "Pixelation steps array" },
      { name: "triggerStart", type: "string", default: '"top+=20% bottom"', description: "Scroll trigger start position" },
      { name: "speed", type: "number", default: "1.5", description: "Animation duration in seconds" },
      { name: "intialDelay", type: "number", default: "0.5", description: "Initial delay before animation" },
      { name: "className", type: "string", default: '""', description: "Additional CSS classes" },
      { name: "style", type: "CSSProperties", default: "{}", description: "Inline styles" },
      { name: "loop", type: "boolean", default: "true", description: "Whether animation repeats" },
      { name: "loopTimes", type: "number", default: "Infinity", description: "Number of loop iterations" },
      { name: "loopDelay", type: "number", default: "3", description: "Delay between loop iterations" },
    ],
    prevComponent: { slug: "gooey-bar", name: "Gooey Bar" },
    nextComponent: { slug: "split-cards", name: "Split Cards" },
    peerDependencies: ["gsap"],
  },
  {
    slug: "split-cards",
    index: "10",
    name: "Split Cards",
    tag: "Scroll",
    tagColor: "#7B6BFF",
    description: "Scroll-triggered 3D card flip animation with gap and width transitions. Cards flip to reveal content on scroll.",
    snippet: `import SplitCards from "@/components/ui/split-cards/SplitCards";

const cards = [
  {
    id: "card-1",
    frontImage: "/image1.jpg",
    backTitle: "Global Reach",
    backDescription: "Connect users across borders seamlessly.",
  },
  // ... more cards
];

<SplitCards
  cards={cards}
  introTitle="Building the Future"
  headerTitle="Three Key Areas"
  outroTitle="Start Now"
/>`,
    previewUrl: "/preview/split-cards",
    previewHeight: 600,
    props: [
      { name: "cards", type: "Array<{ id: string; frontImage: string; backTitle: string; backDescription: string }>", default: "default cards", description: "Array of card objects. Each card has: id (unique identifier), frontImage (URL for front side), backTitle (title shown on back flip), backDescription (description text on back flip)" },
      { name: "introTitle", type: "string", default: '"Building the Future..."', description: "Title text for the intro section" },
      { name: "headerTitle", type: "string", default: '"Three Forces..."', description: "Title text for the sticky header section" },
      { name: "outroTitle", type: "string", default: '"Start Connecting..."', description: "Title text for the outro section" },
      { name: "containerClassName", type: "string", default: '""', description: "Additional CSS classes for the outer container" },
    ],
    prevComponent: { slug: "pixel-image", name: "Pixel Image" },
    nextComponent: undefined,
    peerDependencies: ["gsap", "lenis"],
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
