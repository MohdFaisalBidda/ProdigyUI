# Prodigy UI

> A library of production-ready animated UI components for React/Next.js with Tailwind CSS.

Prodigy UI provides a collection of beautifully crafted, copy-paste-ready animated components. Each component is self-contained with all logic and styles inline - no runtime dependencies required.

## Features

- **Copy-Paste Ready** - Components are designed to be copied directly into your project
- **Zero Runtime Dependencies** - No package installs needed for the components themselves
- **GSAP-Powered** - Smooth, professional animations using GSAP
- **Tailwind CSS** - Fully styled with Tailwind CSS utilities
- **TypeScript** - Full TypeScript support with typed props
- **Responsive** - Mobile-first design with responsive breakpoints
- **MCP Server** - AI-assisted development with Model Context Protocol

## Components

| Component | Tag | Description |
|-----------|-----|-------------|
| [Stroke Cards](/components/stroke-cards) | Interactive | SVG path-drawing animation with masked image hover reveals |
| [Team Section](/components/team-section) | GSAP | Interactive team member showcase with GSAP-powered hover animations |
| [Spring Back Card](/components/spring-back-card) | Interactive | 3D spring physics card that follows cursor movement |
| [More Space Scroll](/components/more-space-scroll) | Scroll | Smooth horizontal scrolling with Lenis |
| [Infinite Contact](/components/infinte-contact) | Scroll | Scroll-triggered infinite contact section |
| [Infinite Slider](/components/infinite-slider) | Interactive | Arc-shaped infinite image slider |
| [Glowing Light](/components/glowing-light) | Interactive | Lottie-powered cursor tracking spotlight effect |
| [Gooey Bar](/components/gooey-bar) | Motion | Animated status bar with gooey SVG filter effects |

## Quick Start

### Option 1: CLI (Recommended)

```bash
# Initialize prodigy-ui in your project
npx prodigy-ui init

# Add a specific component
npx prodigy-ui add stroke-cards

# Add all components
npx prodigy-ui add-all

# List all available components
npx prodigy-ui list
```

### Option 2: Copy-Paste

Simply copy the component code from the documentation and paste it into your project. Each component is self-contained.

## Documentation

Visit our [documentation site](https://prodigyui.in) for:

- Live component previews
- Detailed props documentation
- Usage examples
- Installation instructions

## Peer Dependencies

Some components require additional packages. Install them with:

```bash
npm install gsap lenis lottie-web motion
```

| Package | Used By |
|---------|---------|
| gsap | Stroke Cards, Team Section, Infinite Contact, Infinite Slider |
| lenis | More Space Scroll, Infinite Contact, Infinite Slider, Glowing Light |
| lottie-web | Glowing Light |
| motion | Gooey Bar |

## Tech Stack

- **React 19** / **Next.js 15**
- **TypeScript 5**
- **Tailwind CSS 4**
- **GSAP** (animations)
- **Lenis** (smooth scrolling)
- **Motion** (Framer Motion fork)

## MCP Server

Connect ProdigyUI to your AI editor for intelligent component discovery and installation.

### Setup (Cursor)

```json
{
  "mcpServers": {
    "prodigy-ui": {
      "command": "npx",
      "args": ["-y", "@prodigyui/mcp"]
    }
  }
}
```

### Available Tools

| Tool | Description |
|------|-------------|
| `list_components` | List all available components |
| `search_components` | Search by name, description, or tag |
| `get_component` | Get detailed component documentation |
| `get_install_command` | Get installation commands |

See [docs/MCP.md](docs/MCP.md) for full setup instructions.

## License

MIT
