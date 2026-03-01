/**
 * lib/registry.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Metadata only — no JSX, no imports of actual components.
 * Used by the sidebar to list components and by each page for its doc content.
 */

export interface InstallStep {
  step: string;
  title: string;
  description: string;
  code: string;
}

export interface PropDef {
  name: string;
  type: string;
  default: string;
  desc: string;
}

export interface ComponentMeta {
  slug: string;
  name: string;
  description: string;
  index: string;
  tags: string[];
  accent: string;
  accent2: string;
  version?: string;
  stability?: string;
  installSteps: InstallStep[];
  props: PropDef[];
  fullExample?: string;
}

export const registry: ComponentMeta[] = [

  // ── 01 · Stroke Cards ───────────────────────────────────────────────────────
  {
    slug: "stroke-cards",
    name: "Stroke Cards",
    description: "Cards with animated SVG path-drawing on hover and masked word reveals.",
    index: "01",
    tags: ["Interactive", "GSAP", "SplitText", "On Hover"],
    accent: "#F5EE41",
    accent2: "#6E44FF",
    version: "v1.0",
    stability: "stable",
    installSteps: [
      {
        step: "01",
        title: "Install dependencies",
        description: "Stroke Cards requires GSAP and the SplitText plugin.",
        code: `npm install gsap`,
      },
      {
        step: "02",
        title: "Copy the component",
        description: "Drop Cards.tsx into your components directory.",
        code: `cp Cards.tsx ./components/`,
      },
      {
        step: "03",
        title: "Register GSAP plugins",
        description: "Add this once at the top of the file that uses the component.",
        code: `import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);`,
      },
      {
        step: "04",
        title: "Use it",
        description: "Import and drop in wherever you need it.",
        code: `import Cards from "@/components/Cards";

<Cards
  imgSrc="/your-image.avif"
  title="Your Title"
  strokeColor1="#F5EE41"
  strokeColor2="#6E44FF"
/>`,
      },
    ],
    props: [
      { name: "imgSrc",             type: "string",     default: '"/img1.avif"', desc: "Background image path" },
      { name: "imgAlt",             type: "string",     default: '""',           desc: "Alt text for the image" },
      { name: "title",              type: "string",     default: '"Hello World"',desc: "Title text revealed on hover" },
      { name: "strokeColor1",       type: "string",     default: '"#F5EE41"',    desc: "Primary SVG stroke colour" },
      { name: "strokeColor2",       type: "string",     default: '"#6E44FF"',    desc: "Secondary SVG stroke colour" },
      { name: "titleColor",         type: "string",     default: '"white"',      desc: "Title text colour" },
      { name: "borderRadius",       type: "string",     default: '"2rem"',       desc: "Card corner radius" },
      { name: "strokeAnimDuration", type: "number",     default: "1.5",          desc: "Stroke draw animation duration (s)" },
      { name: "titleAnimDuration",  type: "number",     default: "0.75",         desc: "Title reveal animation duration (s)" },
      { name: "className",          type: "string",     default: '""',           desc: "Extra CSS classes for the wrapper" },
      { name: "onClick",            type: "() => void", default: "—",            desc: "Optional click handler" },
      { name: "children",           type: "ReactNode",  default: "—",            desc: "Custom overlay content" },
    ],
    fullExample: `import Cards from "@/components/Cards";

export default function MyPage() {
  return (
    <div className="flex gap-4">
      <Cards
        imgSrc="/img1.avif"
        title="Motion Design"
        strokeColor1="#F5EE41"
        strokeColor2="#6E44FF"
      />
      <Cards
        imgSrc="/img2.avif"
        title="Typography"
        strokeColor1="#FF4D4D"
        strokeColor2="#FF9966"
        borderRadius="3rem"
      />
      <Cards
        imgSrc="/img3.avif"
        title="Color Theory"
        strokeColor1="#00FFB2"
        strokeColor2="#0066FF"
        strokeAnimDuration={2}
        titleAnimDuration={0.5}
      />
    </div>
  );
}`,
  },

  // ── 02 · Gooey Status Bar ───────────────────────────────────────────────────
  {
    slug: "gooey-status-bar",
    name: "Gooey Status Bar",
    description: "A macOS-style status bar with a liquid gooey blob that follows the hovered icon and reveals a tooltip.",
    index: "02",
    tags: ["Interactive", "Framer Motion", "Spring Physics", "On Hover"],
    accent: "#00FFB2",
    accent2: "#0066FF",
    version: "v1.0",
    stability: "stable",
    installSteps: [
      {
        step: "01",
        title: "Install dependencies",
        description: "GooeyStatusBar uses Framer Motion for spring animations.",
        code: `npm install motion`,
      },
      {
        step: "02",
        title: "Copy the component",
        description: "Drop GooeyStatusBar.tsx into your components directory.",
        code: `cp GooeyStatusBar.tsx ./components/`,
      },
      {
        step: "03",
        title: "Use it",
        description: "Drop it anywhere — it's self-contained with default status items.",
        code: `import GooeyStatusBar from "@/components/GooeyStatusBar";

// Zero config — uses built-in defaults
<GooeyStatusBar />`,
      },
      {
        step: "04",
        title: "Customise items",
        description: "Pass your own items array to control icons and tooltip values.",
        code: `import GooeyStatusBar, { type StatusItem } from "@/components/GooeyStatusBar";

const items: StatusItem[] = [
  { id: "wifi",    icon: "wifi",    value: "Connected" },
  { id: "battery", icon: "battery", value: "92%" },
  { id: "clock",   icon: "clock",   value: "09:41 AM" },
];

<GooeyStatusBar
  items={items}
  barColor="#111111"
  iconColor="#ffffff"
/>`,
      },
    ],
    props: [
      { name: "items",            type: "StatusItem[]",                    default: "defaultStatusItems", desc: "Icons and tooltip values to display" },
      { name: "renderContent",    type: "(item: StatusItem) => ReactNode", default: "—",                  desc: "Custom tooltip content renderer" },
      { name: "contentClassName", type: "string",                          default: '""',                 desc: "Extra classes for the tooltip text" },
      { name: "barColor",         type: "string",                          default: '"#000000"',           desc: "Background colour of bar and gooey blob" },
      { name: "iconColor",        type: "string",                          default: '"#ffffff"',           desc: "Icon and tooltip text colour" },
      { name: "className",        type: "string",                          default: '""',                 desc: "Extra class for the outer wrapper" },
      { name: "iconSize",         type: "string",                          default: '"w-5 h-5"',          desc: "Tailwind size class for icons" },
      { name: "buttonSize",       type: "string",                          default: '"w-10 h-10"',        desc: "Tailwind size class for each icon button" },
      { name: "gap",              type: "string",                          default: '"gap-1"',            desc: "Tailwind gap between icon buttons" },
      { name: "padding",          type: "string",                          default: '"px-3 py-2"',        desc: "Tailwind padding of the main bar" },
    ],
    fullExample: `import GooeyStatusBar, { type StatusItem } from "@/components/GooeyStatusBar";

const myItems: StatusItem[] = [
  { id: "music",   icon: "music",   label: "Tame Impala — Let It Happen" },
  { id: "wifi",    icon: "wifi",    value: "ProtonVPN" },
  { id: "battery", icon: "battery", value: "87%" },
  {
    id: "clock",
    icon: "clock",
    value: new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
];

export default function MyLayout() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <GooeyStatusBar
        items={myItems}
        barColor="#0a0a0a"
        iconColor="#f5f5f5"
        padding="px-4 py-2"
        gap="gap-2"
      />
    </div>
  );
}`,
  },

  // ── 03 · Team Section ──────────────────────────────────────────────────────
  {
    slug: "team-section",
    name: "Team Section",
    description: "Full-screen team section where hovering a profile image expands it and reveals the member's name with a split-text animation.",
    index: "03",
    tags: ["Interactive", "GSAP", "SplitText", "Full Screen"],
    accent: "#f93535",
    accent2: "#ff8c42",
    version: "v1.0",
    stability: "stable",
    installSteps: [
      {
        step: "01",
        title: "Install dependencies",
        description: "TeamSection uses GSAP and SplitText for character animations.",
        code: `npm install gsap`,
      },
      {
        step: "02",
        title: "Copy the component",
        description: "Drop TeamSection.tsx into your components directory.",
        code: `cp TeamSection.tsx ./components/`,
      },
      {
        step: "03",
        title: "Register GSAP plugins",
        description: "Add this once at the top of the file that uses the component.",
        code: `import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);`,
      },
      {
        step: "04",
        title: "Use it",
        description: "Pass your members array — everything else is handled internally.",
        code: `import TeamSection from "@/components/TeamSection";

const members = [
  { image: "/team/alice.jpg", name: "Alice" },
  { image: "/team/bob.jpg",   name: "Bob"   },
  { image: "/team/carol.jpg", name: "Carol" },
];

<TeamSection members={members} defaultName="Our Squad" />`,
      },
    ],
    props: [
      { name: "members",                         type: "TeamMember[]",  default: "—",          desc: "Array of { image, name } objects (required)" },
      { name: "defaultName",                     type: "string",        default: '"Our Squad"', desc: "Text shown when no member is hovered" },
      { name: "backgroundColor",                 type: "string",        default: '"#0f0f0f"',  desc: "Section background colour" },
      { name: "textColor",                       type: "string",        default: '"#e3e3db"',  desc: "Default name text colour" },
      { name: "accentColor",                     type: "string",        default: '"#f93535"',  desc: "Hovered member name colour" },
      { name: "hoverScaleFactor",                type: "number",        default: "2",           desc: "How much the profile image grows on hover" },
      { name: "animDuration",                    type: "number",        default: "0.75",        desc: "Animation duration in seconds" },
      { name: "charStagger",                     type: "number",        default: "0.025",       desc: "Stagger delay between each character (s)" },
      { name: "containerClassName",              type: "string",        default: '""',          desc: "Extra class for the section container" },
      { name: "containerStyle",                  type: "CSSProperties", default: "{}",          desc: "Inline styles for the container" },
      { name: "profileImagesContainerClassName", type: "string",        default: '""',          desc: "Extra class for the images row" },
      { name: "profileNamesContainerClassName",  type: "string",        default: '""',          desc: "Extra class for the names overflow area" },
      { name: "defaultNameClassName",            type: "string",        default: '""',          desc: "Extra class for the default name heading" },
      { name: "memberNameClassName",             type: "string",        default: '""',          desc: "Extra class applied to every member name heading" },
    ],
    fullExample: `import TeamSection, { type TeamMember } from "@/components/TeamSection";

const members: TeamMember[] = [
  { image: "/team/alice.jpg", name: "Alice" },
  { image: "/team/bob.jpg",   name: "Bob"   },
  { image: "/team/carol.jpg", name: "Carol" },
  { image: "/team/dan.jpg",   name: "Dan"   },
];

export default function AboutPage() {
  return (
    <TeamSection
      members={members}
      defaultName="The Team"
      backgroundColor="#080808"
      textColor="#e3e3db"
      accentColor="#f93535"
      hoverScaleFactor={2.5}
      animDuration={0.6}
    />
  );
}`,
  },

];

export function getMeta(slug: string): ComponentMeta | undefined {
  return registry.find((c) => c.slug === slug);
}