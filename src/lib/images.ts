export const useLocalImages = process.env.NEXT_PUBLIC_USE_LOCAL_IMAGES === "true";

export const getImageSrc = (localPath: string, seed: number) => {
  if (useLocalImages) {
    return localPath;
  }
  return `https://picsum.photos/seed/${seed}/800/600`;
};

export const localImages = [
  "/img1.avif",
  "/img2.avif",
  "/img3.avif",
  "/img4.avif",
  "/img5.avif",
  "/img6.avif",
];

export const getLocalImage = (index: number, seed: number) => {
  return getImageSrc(localImages[index] || localImages[0], seed);
};
