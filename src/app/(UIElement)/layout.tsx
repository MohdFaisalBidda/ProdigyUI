/**
 * app/components/layout.tsx
 * Wraps every page under /components/* with the sidebar + navbar shell.
 */

import ComponentsLayout from "@/components/layout/component-layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ComponentsLayout>{children}</ComponentsLayout>;
}