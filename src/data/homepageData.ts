import { componentRegistry } from "@/lib/component-registry";

export const STATS_CONFIG = [
  { label: "License", value: "MIT" },
  { label: "Typed", value: "TS" },
  { label: "Dependencies", value: "0" },
];

export const getStatsData = () => [
  { value: `${componentRegistry.length}+`, label: "Components" },
  ...STATS_CONFIG,
];

export const FEATURES = [
  {
    icon: "⌥",
    title: "Copy. Paste. Done.",
    body: "Every component ships as a single self-contained file. No wrappers, no providers, no runtime package to version-lock yourself into.",
  },
  {
    icon: "⬡",
    title: "Motion-first",
    body: "GSAP, Lenis, and spring physics baked in. Real scroll-driven animations — not CSS transitions pretending to be something more.",
  },
  {
    icon: "◈",
    title: "Full source control",
    body: "You own the file. Tweak easing curves, swap colors, rewrite the whole thing. No black box, no abstraction tax.",
  },
  {
    icon: "⌘",
    title: "Zero opinion on stack",
    body: "Works in any Next.js or React project using Tailwind CSS, Just drop the file in and install the listed peer deps.",
  },
];

export const STACK = [
  { name: "GSAP", color: "#88CE02" },
  { name: "Lenis", color: "#C8FF00" },
  { name: "React", color: "#61DAFB" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Tailwind", color: "#38BDF8" },
];

export const getMarqueeItems = () => componentRegistry.map((c) => c.name);

export const INSTALL_CMD = "npx prodigy-ui list";
