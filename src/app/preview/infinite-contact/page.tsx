import type { Metadata } from "next";
import InfiniteContact from "@/components/UIElement/InfiniteContact/page";
import { localImages, getImageSrc } from "@/lib/images";

const images = localImages.map((img, i) => getImageSrc(img, i + 1));

export const metadata: Metadata = {
  title: "Infinite Contact Preview | Prodigy UI",
  description:
    "Preview of the Infinite Contact component - Scroll-triggered infinite contact section with GSAP animations.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function InfiniteContactPage() {
  return <InfiniteContact images={images} />;
}
