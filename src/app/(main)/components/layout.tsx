import type { Metadata } from "next";
import { components } from "@/lib/component-registry";
import Breadcrumb from "@/components/layout/Breadcrumb";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: "Components",
      template: "%s | Components | Prodigy UI",
    },
    description:
      "Browse and explore our collection of production-ready animated components. Each component is a copy-paste starting point with GSAP and Lenis animations.",
    keywords: [
      ...components.map((c) => c.name),
      "ui components",
      "react",
      "animation",
      "gsap",
      "tailwind",
    ],
    openGraph: {
      title: "Components | Prodigy UI",
      description:
        "Browse and explore our collection of production-ready animated components. Each component is a copy-paste starting point with GSAP and Lenis animations.",
      images: [
        {
          url: "/og/og-components.webp",
          width: 1200,
          height: 630,
          alt: "Prodigy UI Components",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Components | Prodigy UI",
      description:
        "Browse and explore our collection of production-ready animated components.",
      images: ["/og/og-components.webp"],
    },
  };
}

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumb />
      {children}
    </>
  );
}
