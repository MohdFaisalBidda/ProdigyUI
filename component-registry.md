Great plan. Here's the complete shadcn-style architecture step by step.

---

## How shadcn Works (the mental model)

A CLI reads a **registry** (JSON manifest of all components), fetches the source file, copies it into the user's project, and installs required dependencies. That's it. No runtime package.

---

## Step 1 — Project Structure

Reorganize your repo to separate the registry source from the docs site:

```
your-repo/
├── apps/
│   └── web/                        ← your Next.js docs site (current project)
│       ├── app/
│       ├── components/
│       └── ...
├── packages/
│   └── registry/
│       ├── components/             ← the actual component source files
│       │   ├── stroke-cards/
│       │   │   └── StrokeCards.tsx
│       │   ├── team-section/
│       │   │   └── TeamSection.tsx
│       │   ├── gooey-bar/
│       │   │   └── GooeyBar.tsx
│       │   └── ...
│       └── registry.json           ← the manifest
├── cli/                            ← the npx CLI tool
│   ├── index.ts
│   └── package.json
└── package.json                    ← monorepo root (turborepo or pnpm workspaces)
```

If a monorepo feels like too much right now, you can keep everything flat — docs site + registry in the same Next.js project, CLI as a separate folder. The important parts are the **registry.json** and the **CLI**, not the folder layout.

---

## Step 2 — The Registry JSON

This is the single source of truth. Every component is an entry.

```json
// packages/registry/registry.json
{
  "version": "1.0.0",
  "components": [
    {
      "name": "stroke-cards",
      "title": "Stroke Cards",
      "description": "SVG path-drawing with masked hover reveals",
      "files": [
        {
          "path": "components/ui/StrokeCards.tsx",
          "source": "https://raw.githubusercontent.com/you/repo/main/packages/registry/components/stroke-cards/StrokeCards.tsx"
        }
      ],
      "dependencies": [],
      "devDependencies": [],
      "peerDependencies": {
        "gsap": "^3.12.0"
      },
      "tailwind": {
        "plugins": []
      },
      "cssVars": {}
    },
    {
      "name": "team-section",
      "title": "Team Section",
      "files": [
        {
          "path": "components/ui/TeamSection.tsx",
          "source": "https://raw.githubusercontent.com/..."
        }
      ],
      "peerDependencies": {
        "gsap": "^3.12.0"
      },
      "cssVars": {}
    },
    {
      "name": "infinte-contact",
      "title": "Infinite Contact",
      "files": [
        {
          "path": "components/ui/InfiniteContact.tsx",
          "source": "https://raw.githubusercontent.com/..."
        }
      ],
      "peerDependencies": {
        "gsap": "^3.12.0",
        "lenis": "^1.0.0"
      },
      "cssVars": {}
    }
  ]
}
```

---

## Step 3 — The CLI

This is what users run: `npx your-cli add stroke-cards`

```bash
mkdir cli && cd cli
npm init -y
npm install commander chalk ora fs-extra picocolors prompts
npm install -D typescript @types/node tsup
```

```ts
// cli/src/index.ts
#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import https from "https";
import prompts from "prompts";

const REGISTRY_URL =
  "https://raw.githubusercontent.com/you/repo/main/packages/registry/registry.json";

const program = new Command();

program
  .name("motion-ui")
  .description("Add animated components to your project")
  .version("1.0.0");

/* ── helpers ── */

function fetchJSON(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on("error", reject);
  });
}

function fetchText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

function detectPackageManager(): "npm" | "pnpm" | "yarn" | "bun" {
  const agent = process.env.npm_config_user_agent || "";
  if (agent.includes("pnpm")) return "pnpm";
  if (agent.includes("yarn")) return "yarn";
  if (agent.includes("bun"))  return "bun";
  return "npm";
}

function installCommand(pm: string, deps: string[]): string {
  const cmds: Record<string, string> = {
    npm:  `npm install ${deps.join(" ")}`,
    pnpm: `pnpm add ${deps.join(" ")}`,
    yarn: `yarn add ${deps.join(" ")}`,
    bun:  `bun add ${deps.join(" ")}`,
  };
  return cmds[pm];
}

/* ── add command ── */

program
  .command("add [components...]")
  .description("Add one or more components to your project")
  .option("-y, --yes", "skip confirmation prompts")
  .option(
    "--path <path>",
    "destination folder relative to project root",
    "src/components/ui"
  )
  .action(async (components: string[], opts) => {
    const spinner = ora("Fetching registry…").start();

    let registry: any;
    try {
      registry = await fetchJSON(REGISTRY_URL);
      spinner.succeed("Registry loaded");
    } catch (e) {
      spinner.fail("Could not reach registry");
      process.exit(1);
    }

    /* if no component names given, prompt to pick */
    let targets: string[] = components;
    if (!targets.length) {
      const { chosen } = await prompts({
        type: "multiselect",
        name: "chosen",
        message: "Which components do you want to add?",
        choices: registry.components.map((c: any) => ({
          title: c.title,
          value: c.name,
        })),
      });
      targets = chosen;
    }

    for (const name of targets) {
      const component = registry.components.find((c: any) => c.name === name);
      if (!component) {
        console.log(chalk.red(`  ✖ Component "${name}" not found in registry`));
        continue;
      }

      console.log(chalk.bold(`\nAdding ${chalk.cyan(component.title)}…`));

      /* download each file */
      for (const file of component.files) {
        const destPath = path.join(process.cwd(), opts.path, path.basename(file.path));
        await fs.ensureDir(path.dirname(destPath));

        const fileSpinner = ora(`  Downloading ${path.basename(file.path)}`).start();
        try {
          const source = await fetchText(file.source);
          await fs.writeFile(destPath, source, "utf-8");
          fileSpinner.succeed(`  ${chalk.green("✔")} ${destPath}`);
        } catch {
          fileSpinner.fail(`  Failed to download ${file.path}`);
        }
      }

      /* list peer deps to install */
      const peers = Object.entries(component.peerDependencies || {})
        .map(([pkg, version]) => `${pkg}@${version}`);

      if (peers.length) {
        const pm = detectPackageManager();
        console.log(chalk.yellow(`\n  Install dependencies:`));
        console.log(chalk.dim(`  ${installCommand(pm, peers)}\n`));
      }
    }

    console.log(chalk.green.bold("\n✔ Done!\n"));
  });

/* ── list command ── */

program
  .command("list")
  .description("List all available components")
  .action(async () => {
    const spinner = ora("Fetching registry…").start();
    const registry = await fetchJSON(REGISTRY_URL);
    spinner.stop();

    console.log(chalk.bold("\nAvailable components:\n"));
    registry.components.forEach((c: any) => {
      console.log(
        `  ${chalk.cyan(c.name.padEnd(22))} ${chalk.dim(c.description || "")}`
      );
    });
    console.log("");
  });

program.parse();
```

```json
// cli/package.json (key parts)
{
  "name": "motion-ui-cli",
  "version": "1.0.0",
  "bin": {
    "motion-ui": "./dist/index.js"
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs --banner.js '#!/usr/bin/env node'",
    "dev": "tsup src/index.ts --watch"
  }
}
```

---

## Step 4 — Prepare Each Component File

Before adding to the registry, each component file must be **self-contained**:

```
✅ Only Tailwind classes (no CSS variables from your globals)
✅ No imports from your internal @/components/... paths
✅ All types defined inline or imported from a peer dep
✅ Props for anything that was hardcoded (colors, sizes)
✅ No next/image or Next.js-specific APIs unless documented
```

Example checklist per component:
```tsx
// ✅ good — self contained
import gsap from "gsap"                    // peer dep, user installs
import Lenis from "lenis"                  // peer dep, user installs

// ❌ bad — internal path user won't have
import { something } from "@/lib/utils"

// ❌ bad — CSS variable not in user's project
style={{ color: "var(--base-100)" }}

// ✅ good — explicit or prop-driven
style={{ color: "#e8e8e2" }}
// or
interface Props { textColor?: string }
```

---

## Step 5 — Publish the CLI

```bash
# build
cd cli && npm run build

# test locally before publishing
npm link
motion-ui list
motion-ui add stroke-cards

# publish
npm publish --access public
```

Users then run:
```bash
npx motion-ui-cli add stroke-cards
npx motion-ui-cli add stroke-cards team-section gooey-bar
npx motion-ui-cli list
```

---

## Step 6 — Docs Site Integration

On each component page, show the install command instead of (or alongside) the code snippet:

```tsx
// In ComponentPageLayout — add an "install" tab
const tabs = ["preview", "install", "code"] as const

// Install tab content
<div>
  <p>Run this command in your project root:</p>
  <CodeBlock code={`npx motion-ui-cli add ${slug}`} />
  
  <p>Then install peer dependencies:</p>
  <CodeBlock code={`npm install gsap lenis`} />
</div>
```

---

## Summary

| Step | What |
|------|------|
| 1 | Restructure repo — registry source separated from docs |
| 2 | Write `registry.json` — one entry per component with files + peer deps |
| 3 | Build CLI with `commander` — `add`, `list` commands |
| 4 | Audit components — all Tailwind, no internal imports, no CSS vars |
| 5 | Publish CLI to npm |
| 6 | Add install tab to docs site |

The key insight matching shadcn: **you ship source, not a compiled package**. Users own the file, Tailwind sees it, no version conflicts, no black-box.