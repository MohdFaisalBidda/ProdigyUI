export interface ComponentFileConfig {
  source: string;
  exportName?: string;
}

export interface ComponentConfig {
  folder: string;
  files: Record<string, ComponentFileConfig>;
}

export const COMPONENT_MAP: Record<string, ComponentConfig> = {
  "stroke-cards": { 
    folder: "StrokeCards", 
    files: { 
      "Cards.tsx": { source: "Cards.tsx" }, 
      "StrokeCards.tsx": { source: "StrokeCards.tsx" } 
    } 
  },
  "team-section": { 
    folder: "TeamSection", 
    files: { 
      "TeamSection.tsx": { source: "TeamSection.tsx" } 
    } 
  },
  "gooey-bar": { 
    folder: "GooeyBar", 
    files: { 
      "GooeyBar.tsx": { source: "GoeeyBar.tsx" } 
    } 
  },
  "spring-back-card": { 
    folder: "SpringBackCard", 
    files: { 
      "SpringBackCard.tsx": { source: "SpringBackCard.tsx" }, 
      "page.tsx": { source: "page.tsx", exportName: "SpringBackCards" } 
    } 
  },
  "more-space-scroll": { 
    folder: "MoreSpaceScroll", 
    files: { 
      "MoreSpaceProjects.tsx": { source: "MoreSpaceProjects.tsx" }, 
      "page.tsx": { source: "page.tsx", exportName: "MoreSpaceScroll" } 
    } 
  },
  "infinite-contact": { 
    folder: "InfinteContact", 
    files: { 
      "page.tsx": { source: "page.tsx", exportName: "InfiniteContact" } 
    } 
  },
  "infinite-slider": { 
    folder: "InfiniteSlider", 
    files: { 
      "page.tsx": { source: "page.tsx", exportName: "InfiniteSlider" } 
    } 
  },
  "glowing-light": { 
    folder: "GlowingLight", 
    files: { 
      "page.tsx": { source: "page.tsx", exportName: "GlowingLight" } 
    } 
  },
};
