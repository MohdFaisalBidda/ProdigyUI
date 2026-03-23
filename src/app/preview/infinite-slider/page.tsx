import type { Metadata } from "next";
import InfiniteSlider from "@/components/UIElement/InfiniteSlider/page";
import { localImages, getImageSrc } from "@/lib/images";

const images = localImages.map((img, i) => getImageSrc(img, i + 1));

export const metadata: Metadata = {
  title: "Infinite Slider Preview | Prodigy UI",
  description:
    "Preview of the Infinite Slider component - A beautifully animated infinite slider with GSAP animations, featuring an arc carousel effect.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function InfiniteSliderPage() {
  return <InfiniteSlider images={images} />;
}
