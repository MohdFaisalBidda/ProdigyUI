"use client";
import React from "react";
import ComponentPageLayout from "@/components/layout/ComponentPageLayout";

export default function InfiniteContactPage() {
  return (
    <ComponentPageLayout
      index="05"
      name="Infinite Contact"
      tag="Scroll"
      tagColor="#7B6BFF"
      slug="infinte-contact"
      description="Scroll-triggered infinite contact list with GSAP + Lenis."

      // ✅ iframe — component uses window.scroll, Lenis, GSAP ScrollTrigger
      previewUrl="/preview/infinte-contact"
      previewHeight={700}           // optional, defaults to 600

      codeSnippet={`import InfiniteContact from "@/components/UIElement/InfinteContact/page";

export default function Example() {
  return <InfiniteContact />;
}`}
      props={[]}
      prevComponent={{ slug: "more-space-scroll", name: "More Space Scroll" }}
      nextComponent={{ slug: "infinite-slider", name: "Infinite Slider" }}
    />
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// RULE OF THUMB
// ─────────────────────────────────────────────────────────────────────────────
// Use `preview={<MyComponent />}`   when the component renders in isolation
//                                    with no window-scroll/Lenis dependency.

// Use `previewUrl="/preview/slug"`  when the component calls:
//   • new Lenis(...)
//   • gsap.ticker / ScrollTrigger
//   • window.scrollY / window.addEventListener("scroll", ...)
//   • requestAnimationFrame loops that read scroll position

// For every previewUrl you use, create a matching bare route, e.g.:
//   app/preview/infinte-contact/page.tsx
//     → export { default } from "@/components/UIElement/InfinteContact/page";