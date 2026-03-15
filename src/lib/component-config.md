# Component Config Guide

This file (`src/lib/component-config.ts`) contains the configuration for all CLI-available components. It maps component names to their source files and handles the transformation logic for the API routes.

## Adding a New Component

To add a new component to the CLI, follow these steps:

### 1. Add entry to `COMPONENT_MAP`

Add a new entry in `src/lib/component-config.ts`:

```typescript
"my-new-component": { 
  folder: "MyNewComponent",  // Folder name in src/components/UIElement/
  files: { 
    // Key: destination filename
    // Value: source filename in the component folder
    "MyNewComponent.tsx": { source: "MyNewComponent.tsx" },
    // Add more files if needed
  } 
},
```

### 2. Update registry.json

Add the component to `packages/registry/registry.json`:

```json
{
  "name": "my-new-component",
  "title": "My New Component",
  "description": "Description of what it does",
  "tag": "Category",
  "files": [
    {
      "path": "my-new-component/MyNewComponent.tsx",
      "source": "http://localhost:3000/api/components/my-new-component/MyNewComponent.tsx"
    }
  ],
  "dependencies": ["clsx", "tailwind-merge"],
  "peerDependencies": [],
  "registryDependencies": []
}
```

### 3. Handle Special Cases

#### If source file has different export name (e.g., `page.tsx` exports `MyComponent`)

```typescript
"my-component": { 
  folder: "MyComponent", 
  files: { 
    "page.tsx": { source: "page.tsx", exportName: "MyComponent" }
  } 
},
```

The API will automatically:
- Replace `function page()` with `function MyComponent()`
- Replace `export default page` with `export default MyComponent`

#### If source filename differs from destination

```typescript
"my-component": { 
  folder: "MyComponent", 
  files: { 
    "MyComponent.tsx": { source: "Component.tsx" }  // source: actual filename
  } 
},
```

### Config Structure

```typescript
export interface ComponentFileConfig {
  source: string;      // Actual filename in src/components/UIElement/[folder]/
  exportName?: string; // If the component exports under a different name (for page.tsx -> ComponentName)
}

export interface ComponentConfig {
  folder: string;     // Folder name in src/components/UIElement/
  files: Record<string, ComponentFileConfig>; // Key = destination filename, Value = source config
}
```

## API Transformations

The API route automatically applies these transformations:

1. **@ts-nocheck** - Added to top for TypeScript compatibility
2. **"use client"** - Preserved 
3. **Export name fix** - If `exportName` is specified, renames the function
4. **next/image → img** - For components listed in the image replacement array
5. **Import path rewriting** - Component-specific import fixes (e.g., for spring-back-card)

### Components that need next/image → img conversion

Currently: `team-section`, `spring-back-card`, `more-space-scroll`, `infinite-slider`

To add more, edit the array in `route.ts`:

```typescript
if (["team-section", "spring-back-card", "more-space-scroll", "infinite-slider", "new-component"].includes(component)) {
```

## Testing

After adding a new component:
1. Restart the dev server
2. Test the API: `curl http://localhost:3000/api/components/[component-name]/[filename]`
3. Add to test project: `npx prodigy add [component-name]`
