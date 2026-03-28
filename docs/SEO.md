# SEO Documentation

## Overview

This document outlines the SEO implementation for Prodigy UI, including metadata, OpenGraph, Twitter Cards, and pending tasks.

---

## Completed

### 1. Metadata Implementation

#### Root Layout
- **`/src/app/(main)/layout.tsx`**
  - Default title template: `"%s | Prodigy UI"`
  - Site-wide description and keywords
  - OpenGraph configuration with `og-home.png`
  - Twitter Card configuration with `og-home.png`
  - Robots settings for indexing

#### Components Layout
- **`/src/app/(main)/components/layout.tsx`**
  - Dynamic metadata for the components listing page
  - Generates keywords from all component names

#### Dynamic Route
- **`/src/app/(main)/components/[slug]/page.tsx`**
  - `generateMetadata()` for dynamic SEO based on component slug
  - Keywords include component name, tag, and common terms
   - OG image path: `/og/og-{slug}.webp`
  - Twitter Card support

### 2. Component Pages with Metadata

| Component | Route | Metadata |
|-----------|-------|----------|
| Stroke Cards | `/components/stroke-cards` | ✅ Complete |
| Team Section | `/components/team-section` | ✅ Complete |
| Spring Back Card | `/components/spring-back-card` | ✅ Complete |
| More Space Scroll | `/components/more-space-scroll` | ✅ Complete |
| Infinite Contact | `/components/infinite-contact` | ✅ Complete |
| Infinite Slider | `/components/infinite-slider` | ✅ Complete |
| Glowing Light | `/components/glowing-light` | ✅ Complete |
| Gooey Bar | `/components/gooey-bar` | ✅ Complete |

### 3. Preview Pages

Preview pages use `robots: { index: false, follow: false }` since they are for demo purposes only.

| Preview | Route |
|---------|-------|
| Spring Back Card | `/preview/spring-back-card` |
| More Space Scroll | `/preview/more-space-scroll` |
| Infinite Contact | `/preview/infinite-contact` |
| Infinite Slider | `/preview/infinite-slider` |
| Glowing Light | `/preview/glowing-light` |

### 4. OG Image Support

The metadata structure supports OG images for all pages with the following naming convention:
- Format: `/og-{slug}.png`
- Dimensions: 1200x630 pixels

---

## Pending Tasks

### 1. OG Images Required

The following OG images need to be created and placed in the `/public/og` folder:

| Image Name | For Page |
|------------|----------|
| `og-home.webp` | Homepage |
| `og-components.webp` | Components listing |
| `og-stroke-cards.webp` | Stroke Cards |
| `og-team-section.webp` | Team Section |
| `og-spring-back-card.webp` | Spring Back Card |
| `og-more-space-scroll.webp` | More Space Scroll |
| `og-infinite-contact.webp` | Infinite Contact |
| `og-infinite-slider.webp` | Infinite Slider |
| `og-glowing-light.webp` | Glowing Light |
| `og-gooey-bar.webp` | Gooey Bar |
| `og-pixel-image.webp` | Pixel Image |

**Recommended OG Image Specs:**
- Dimensions: 1200x630 pixels
- Format: WebP (recommended for better compression)
- File size: < 500KB for fast loading
- Include component preview or branding

### 2. Site Map

Consider adding `next-sitemap` or creating a `sitemap.ts` for better search engine indexing.

### 3. Robots.txt

Consider adding a `robots.txt` file in the `/public` folder.

### 4. Favicon & App Icons

Add proper favicon and app icons for better branding:
- `favicon.ico`
- `apple-touch-icon.png`
- `icon-192.png`
- `icon-512.png`

### 5. Canonical URLs

Consider adding canonical URLs to prevent duplicate content issues.

---

## File Structure

```
/public
/og
├── og-home.webp              # TODO: Create
├── og-components.webp        # TODO: Create
├── og-stroke-cards.webp      # TODO: Create
├── og-team-section.webp      # TODO: Create
├── og-spring-back-card.webp  # TODO: Create
├── og-more-space-scroll.webp # TODO: Create
├── og-infinite-contact.webp  # TODO: Create
├── og-infinite-slider.webp   # TODO: Create
├── og-glowing-light.webp     # TODO: Create
└── og-gooey-bar.webp         # TODO: Create

/src/app
├── (main)
│   ├── layout.tsx                      # Root metadata
│   ├── page.tsx                        # Homepage (no additional metadata needed)
│   └── components
│       ├── layout.tsx                  # Components page metadata
│       ├── page.tsx                    # Components listing (no additional metadata needed)
│       ├── [slug]
│       │   └── page.tsx                # Dynamic component page with generateMetadata
│       ├── stroke-cards
│       │   └── page.tsx                # Component page with metadata
│       ├── team-section
│       │   └── page.tsx                # Component page with metadata
│       ├── spring-back-card
│       │   └── page.tsx                # Component page with metadata
│       ├── more-space-scroll
│       │   └── page.tsx                # Component page with metadata
│       ├── infinite-contact
│       │   └── page.tsx                # Component page with metadata
│       ├── infinite-slider
│       │   └── page.tsx                # Component page with metadata
│       ├── glowing-light
│       │   └── page.tsx                # Component page with metadata
│       └── gooey-bar
│           └── page.tsx                # Component page with metadata
└── preview
    ├── spring-back-card
    │   └── page.tsx                    # Preview with noindex
    ├── more-space-scroll
    │   └── page.tsx                    # Preview with noindex
    ├── infinite-contact
    │   └── page.tsx                    # Preview with noindex
    ├── infinite-slider
    │   └── page.tsx                    # Preview with noindex
    └── glowing-light
        └── page.tsx                    # Preview with noindex
```

---

## Testing

To verify SEO implementation:

1. **View Page Source**: Check for `<title>`, `<meta name="description">`, and OpenGraph tags
2. **Social Media Debuggers**:
   - [Facebook OG Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
3. **Google Search Console**: Verify indexing and rich results

---

## Metadata Fields Used

| Field | Purpose |
|-------|---------|
| `title` | Page title (appears in browser tab and search results) |
| `description` | Page description (appears in search snippets) |
| `keywords` | Comma-separated keywords for search engines |
| `openGraph` | Facebook/LinkedIn sharing metadata |
| `openGraph.images` | OG image for social sharing |
| `twitter` | Twitter card metadata |
| `twitter.card` | Card type (summary_large_image recommended) |
| `robots` | Control search engine crawling (index, follow) |

---

## Updating SEO

When adding a new component:

1. Add the component to `/src/lib/component-registry.tsx`
2. Create the component page in `/src/app/(main)/components/{component-slug}/page.tsx`
3. Create a preview page in `/src/app/preview/{component-slug}/page.tsx` (optional)
4. Add metadata with `generateMetadata()`
5. Create OG image: `/public/og/og-{component-slug}.webp`

