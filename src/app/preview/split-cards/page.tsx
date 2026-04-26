import type { Metadata } from "next";
import SplitCardsDemo from "@/components/UIElement/SplitCards/page";

export const metadata: Metadata = {
  title: "Split Cards Preview | Prodigy UI",
  description:
    "Preview of the Split Cards component - Scroll-triggered 3D card flip animation with gap and width transitions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <SplitCardsDemo />;
}
