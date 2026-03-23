import type { Metadata } from "next";
import SpringBackCards from "@/components/UIElement/SpringBackCard/page";

export const metadata: Metadata = {
  title: "Spring Back Card Preview | Prodigy UI",
  description:
    "Preview of the Spring Back Card component - 3D spring physics card that follows cursor movement with smooth lerp interpolation and rotation effects.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <SpringBackCards />;
}
