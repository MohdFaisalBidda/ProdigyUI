"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getComponentBySlug } from "@/lib/component-registry";

export default function Breadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const isComponentPage = segments[0] === "components" && segments.length > 1;
  const componentSlug = segments[1];
  const component = componentSlug ? getComponentBySlug(componentSlug) : null;

  return (
    <div className="flex items-center gap-3 px-5 pt-20 md:px-10 bg-[#070707] text-white overflow-x-hidden font-syne">
      <Link
        href="/"
        className="flex items-center gap-2 text-white/30 font-mono-jetbrains text-[11px] no-underline transition-colors duration-200 hover:text-white"
      >
        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Home
      </Link>
      <span className="text-white/15">/</span>
      <Link
        href="/components"
        className="font-mono-jetbrains text-[11px] text-white/55 tracking-[0.06em] no-underline transition-colors duration-200 hover:text-white"
      >
        Components
      </Link>
      {isComponentPage && component && (
        <>
          <span className="text-white/15">/</span>
          <span className="font-mono-jetbrains text-[11px] text-white tracking-[0.06em]">
            {component.name}
          </span>
        </>
      )}
    </div>
  );
}
