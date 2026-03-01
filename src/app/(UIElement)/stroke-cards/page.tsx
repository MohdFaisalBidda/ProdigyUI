"use client";

/**
 * app/components/stroke-cards/page.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * This is the ONLY file you write per component.
 * It owns:  1) the live preview   2) the playground (optional)
 *
 * Everything else — layout chrome, install steps, props table, full example —
 * comes automatically from the registry entry via <ComponentPage>.
 */

import { useState } from "react";
import { getMeta } from "@/lib/registry";
import ComponentPage, {
  PlaygroundShell,
  PropInput,
  TextInput,
  ColorInput,
} from "@/components/UIElement/ComponentPage";
import Cards from "@/components/UIElement/StrokeCards/Cards";

const meta = getMeta("stroke-cards")!;

// ── Playground ────────────────────────────────────────────────────────────────

function StrokeCardsPlayground() {
  const [title, setTitle] = useState("Motion");
  const [strokeColor1, setStrokeColor1] = useState("#F5EE41");
  const [strokeColor2, setStrokeColor2] = useState("#6E44FF");
  const [borderRadius, setBorderRadius] = useState("2rem");

  return (
    <PlaygroundShell
      controls={
        <>
          <PropInput label="title" accent={meta.accent}>
            <TextInput value={title} onChange={setTitle} accent={meta.accent} />
          </PropInput>

          <PropInput label="strokeColor1" accent={meta.accent}>
            <ColorInput value={strokeColor1} onChange={setStrokeColor1} />
          </PropInput>

          <PropInput label="strokeColor2" accent={meta.accent}>
            <ColorInput value={strokeColor2} onChange={setStrokeColor2} />
          </PropInput>

          <PropInput label="borderRadius" accent={meta.accent}>
            <TextInput value={borderRadius} onChange={setBorderRadius} accent={meta.accent} placeholder="2rem" />
          </PropInput>
        </>
      }
      preview={
        <div className="w-full max-w-[220px]">
          <Cards
            imgSrc="/img1.avif"
            title={title}
            strokeColor1={strokeColor1}
            strokeColor2={strokeColor2}
            borderRadius={borderRadius}
          />
        </div>
      }
    />
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function StrokeCardsPage() {
  return (
    <ComponentPage meta={meta} playground={<StrokeCardsPlayground />}>
      {/* Preview slot — shown in the static preview box above the playground */}
      <div className="flex gap-4 flex-wrap justify-center">
        <Cards imgSrc="/img1.avif" title="Motion" strokeColor1="#F5EE41" strokeColor2="#6E44FF" />
        <Cards imgSrc="/img2.avif" title="Design" strokeColor1="#000000" strokeColor2="#9a8ad0" />
      </div>
    </ComponentPage>
  );
}