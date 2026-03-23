import type { Metadata } from "next";
import GlowingLight from "@/components/UIElement/GlowingLight/page";

export const metadata: Metadata = {
  title: "Glowing Light Preview | Prodigy UI",
  description:
    "Preview of the Glowing Light component - Lottie-powered glowing light effect that tracks cursor movement with spotlight and mask animations.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GlowingLightPage() {
  return <GlowingLight />;
}
