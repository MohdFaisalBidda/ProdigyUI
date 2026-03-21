import InfiniteContact from "@/components/UIElement/InfiniteContact/page";
import { localImages, getImageSrc } from "@/lib/images";

const images = localImages.map((img, i) => getImageSrc(img, i + 1));

export default function InfiniteContactPage() {
  return <InfiniteContact images={images} />;
}
