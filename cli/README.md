# Prodigy UI CLI

Add animated components to your React/Next.js project with a single command.

## Installation

```bash
npm install -g prodigy-ui
```

Or use npx to run without installing:

```bash
npx prodigy@latest add stroke-cards
```

## Usage

### Initialize Your Project

Before adding components, initialize prodigy-ui in your project:

```bash
npx prodigy@latest init
```

This sets up the necessary configuration for component installation.

### Add Components

Add one or more components to your project:

```bash
# Add a single component
npx prodigy@latest add stroke-cards

# Add multiple components
npx prodigy@latest add stroke-cards team-section

# Add all components
npx prodigy@latest add --all
```

### Available Commands

| Command | Description |
|---------|-------------|
| `npx prodigy@latest init` | Initialize prodigy-ui in your project |
| `npx prodigy@latest add <component>` | Add one or more components |
| `npx prodigy@latest add --all` | Add all available components |
| `npx prodigy@latest list` | List all available components |

### List Components

View all available components:

```bash
npx prodigy@latest list
```

## Available Components

| Component | Description |
|-----------|-------------|
| `stroke-cards` | SVG path-drawing animation with masked image hover reveals |
| `team-section` | Interactive team member showcase with GSAP-powered animations |
| `spring-back-card` | 3D spring physics card that follows cursor movement |
| `more-space-scroll` | Smooth horizontal scrolling with Lenis |
| `infinite-contact` | Scroll-triggered infinite contact section |
| `infinite-slider` | Arc-shaped infinite image slider |
| `glowing-light` | Lottie-powered cursor tracking spotlight effect |
| `gooey-bar` | Animated status bar with gooey SVG filter effects |
| `pixel-image` | Pixelated image reveal animation with GSAP scroll triggers |
| `split-cards` | Scroll-triggered 3D card flip animation with gap and width transitions |

## Peer Dependencies

After adding components, install the required peer dependencies:

```bash
npm install gsap lenis lottie-web motion
```

| Package | Used By |
|---------|--------|
| gsap | Stroke Cards, Team Section, Infinite Contact, Infinite Slider, Pixel Image, Split Cards |
| lenis | More Space Scroll, Infinite Contact, Infinite Slider, Glowing Light, Split Cards |
| lottie-web | Glowing Light |
| motion | Gooey Bar |

## Requirements

- Node.js >= 18
- React or Next.js project
- Tailwind CSS configured in your project

## Quick Example

```bash
# Initialize
npx prodigy@latest init

# Add a component
npx prodigy@latest add stroke-cards

# Install dependencies
npm install gsap
```

Then import and use in your code:

```tsx
import StrokeCards from "@/components/UIElement/StrokeCards/StrokeCards";

const cards = [
  { id: "1", imgSrc: "/img1.png", title: "Motion Design", strokeColor1: "#C8FF00", strokeColor2: "#FF3B3B" },
];

export default function Page() {
  return <StrokeCards cards={cards} columns={3} gap="1rem" />;
}
```

## Documentation

For full documentation, live previews, and detailed props reference, visit [prodigyui.in](https://prodigyui.in).

## License

MIT
