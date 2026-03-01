/**
 * components/ComponentsLayout.tsx
 *
 * Place in:  app/components/layout.tsx
 *   import ComponentsLayout from "@/components/ComponentsLayout";
 *   export default function Layout({ children }) {
 *     return <ComponentsLayout>{children}</ComponentsLayout>;
 *   }
 */

import React from "react";

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#060606", color: "#fff" }}>
      <div className="flex flex-1 pt-14">
        <main className="flex-1 mx-auto w-full"
        style={{
          padding:"6rem 2rem"
        }}
        >{children}</main>
      </div>
    </div>
  );
}
