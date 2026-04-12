# Prodigy UI - Setup Guide

## Project Structure

```
prodigy-ui/
├── packages/
│   └── registry/
│       ├── components/          # Component source files for CLI
│       │   ├── stroke-cards/
│       │   ├── team-section/
│       │   ├── gooey-bar/
│       │   └── ...
│       └── registry.json         # Component manifest
├── cli/
│   ├── bin/prodigy              # CLI entry point
│   ├── src/index.ts             # CLI source code
│   └── package.json
└── src/
    └── app/
        ├── api/registry/         # API routes for local testing
        │   └── route.ts
        └── components/           # UI components
```

---

## Local Development & Testing

### 1. Start Next.js Dev Server

```bash
cd ~/Gh-Projects/prodigy-ui
npm run dev
```

This serves:
- Docs site: `http://localhost:3000`
- Registry API: `http://localhost:3000/api/registry`
- Component files: `http://localhost:3000/api/components/[component]/[file]`

### 2. Test CLI Locally

```bash
cd ~/Gh-Projects/prodigy-ui/cli

# Rebuild after any changes
npm run build

# Test list command
./bin/prodigy list

# Add a component
./bin/prodigy add stroke-cards
```

---

## Adding New Components

### Step 1: Create Component Source File

Create a self-contained component in `packages/registry/components/[component-name]/`:

```bash
mkdir packages/registry/components/new-component
```

The component must be:
- ✅ Self-contained (no internal imports like `@/components/...`)
- ✅ Use only Tailwind CSS (no CSS variables from globals)
- ✅ All props/types defined inline or imported from peer deps
- ✅ No Next.js specific APIs unless documented

### Step 2: Update registry.json

Add entry in `packages/registry/registry.json`:

```json
{
  "name": "new-component",
  "title": "New Component",
  "description": "Description here",
  "tag": "Interactive",
  "files": [
    {
      "path": "new-component/NewComponent.tsx",
      "source": "http://localhost:3000/api/components/new-component/NewComponent.tsx"
    }
  ],
  "dependencies": ["clsx", "tailwind-merge"],
  "peerDependencies": ["gsap"],
  "registryDependencies": []
}
```

### Step 3: Test

```bash
cd cli
npm run build
./bin/prodigy add new-component
```

---

## Publishing to Production

### Step 1: Update URLs for Production

Edit `packages/registry/registry.json` - replace all local URLs with GitHub URLs:

```json
"source": "https://raw.githubusercontent.com/YOUR_USERNAME/prodigy-ui/main/packages/registry/components/stroke-cards/StrokeCards.tsx"
```

### Step 2: Update CLI Registry URL

Edit `cli/src/index.ts`:

```typescript
const REGISTRY_URL = "https://raw.githubusercontent.com/YOUR_USERNAME/prodigy-ui/main/packages/registry/registry.json";
```

### Step 3: Build CLI

```bash
cd cli
npm run build
```

### Step 4: Publish to npm

```bash
npm publish --access public
```

---

## CLI Usage (For End Users)

### Install

```bash
npx prodigy@latest add stroke-cards
```

### List Components

```bash
npx prodigy@latest list
```

### Initialize Project

```bash
npx prodigy@latest init
```

---

## Troubleshooting

### 404 when adding component

- Check that component source file exists in `packages/registry/components/`
- Verify registry.json has correct name and source URL

### Component download fails

- Ensure Next.js dev server is running
- Check API route is working: `curl http://localhost:3000/api/registry`

### Dependencies not installing

- Run CLI from a valid project directory with `package.json`
- Install manually: `npm install clsx tailwind-merge gsap`

---

## API Routes

### GET /api/registry

Returns the component registry JSON.

### GET /api/components/[component]/[...file]

Returns the component source file.

Example:
```
http://localhost:3000/api/components/stroke-cards/StrokeCards.tsx
```
