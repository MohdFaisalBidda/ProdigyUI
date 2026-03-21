import InfiniteSlider from "@/components/UIElement/InfiniteSlider/page";
import { localImages, getImageSrc } from "@/lib/images";

const images = localImages.map((img, i) => getImageSrc(img, i + 1));

export default function InfiniteSliderPage() {
  return <InfiniteSlider images={images} />;
}
