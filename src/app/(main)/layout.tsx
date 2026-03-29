import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: {
    default: "Prodigy UI | Animated Component Library",
    template: "%s | Prodigy UI",
  },
  description:
    "Production-ready animated components built with GSAP and Lenis. Copy the source, drop it in your project, and customize every detail.",
  keywords: [
    "react components",
    "gsap animations",
    "lenis",
    "next.js",
    "tailwind css",
    "animation library",
    "ui components",
    "scroll animations",
  ],
  authors: [{ name: "Prodigy UI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://prodigy-ui.vercel.app",
    siteName: "Prodigy UI",
    title: "Prodigy UI | Animated Component Library",
    description:
      "Production-ready animated components built with GSAP and Lenis. Copy the source, drop it in your project, and customize every detail.",
    images: [
      {
        url: "/og/og-home.webp",
        width: 1200,
        height: 630,
        alt: "Prodigy UI - Animated Component Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prodigy UI | Animated Component Library",
    description:
      "Production-ready animated components built with GSAP and Lenis. Copy the source, drop it in your project, and customize every detail.",
    images: ["https://prodigy-ui.vercel.app/og/og-home.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
