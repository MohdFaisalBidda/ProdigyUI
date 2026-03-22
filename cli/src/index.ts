#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import https from "https";
import http from "http";
import { spawn } from "child_process";
import prompts from "prompts";

const REGISTRY_URL =
  process.env.LOCAL_REGISTRY ||
  "https://raw.githubusercontent.com/MohdFaisalBidda/ProdigyUI/main/packages/registry/registry.json";

const program = new Command();

function fetchJSON(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    if (url.startsWith("file://") || !url.startsWith("http")) {
      const filePath = url.replace("file://", "");
      fs.readFile(filePath, "utf-8")
        .then(JSON.parse)
        .then(resolve)
        .catch(reject);
      return;
    }
    const client = url.startsWith("https") ? https : http;
    client.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on("error", reject);
  });
}

function fetchText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, (res) => {
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
  if (agent.includes("bun")) return "bun";
  return "npm";
}

function installCommand(
  pm: string,
  deps: string[],
  isDev: boolean = false
): string {
  const cmds: Record<string, string> = {
    npm: `npm install ${isDev ? "-D " : ""}${deps.join(" ")}`,
    pnpm: `pnpm add ${isDev ? "-D " : ""}${deps.join(" ")}`,
    yarn: `yarn add ${isDev ? "-D " : ""}${deps.join(" ")}`,
    bun: `bun add ${isDev ? "-D " : ""}${deps.join(" ")}`,
  };
  return cmds[pm];
}

async function appendGlobals(sourceUrl: string): Promise<void> {
  const spinner = ora("Adding global styles…").start();

  let globalsPath = path.join(process.cwd(), getDefaultGlobalsPath());

  if (!(await fs.pathExists(globalsPath))) {
    await fs.ensureDir(path.dirname(globalsPath));
    await fs.writeFile(globalsPath, "", "utf-8");
  }

  try {
    const globalsContent = await fetchText(sourceUrl);
    const marker = "/* ProdigyUI Global Styles */";
    const existingContent = await fs.readFile(globalsPath!, "utf-8");

    if (existingContent.includes(marker)) {
      spinner.info(`  Global styles already added to ${globalsPath}`);
      return;
    }

    const newContent = `\n${marker}\n${globalsContent}\n`;
    await fs.writeFile(globalsPath!, existingContent.trimEnd() + newContent, "utf-8");
    spinner.succeed(`  ${chalk.green("✓")} Added global styles to ${globalsPath}`);
  } catch {
    console.log(chalk.yellow("  Warning: Could not add global styles. You may need to add them manually."));
  }
}

function getDefaultComponentsPath(): string {
  const root = process.cwd();
  
  const srcExists = fs.existsSync(path.join(root, "src"));
  const appInSrc = fs.existsSync(path.join(root, "src/app"));
  const appInRoot = fs.existsSync(path.join(root, "app"));
  
  if (srcExists) {
    if (appInSrc) {
      return "src/components/ui";
    }
    const componentsInSrc = fs.existsSync(path.join(root, "src/components"));
    if (componentsInSrc) {
      return "src/components/ui";
    }
    return "src/components/ui";
  }
  
  if (appInRoot) {
    return "components/ui";
  }
  
  return "components/ui";
}

function getDefaultGlobalsPath(): string {
  const root = process.cwd();
  
  if (fs.existsSync(path.join(root, "src/app/globals.css"))) {
    return "src/app/globals.css";
  }
  if (fs.existsSync(path.join(root, "app/globals.css"))) {
    return "app/globals.css";
  }
  if (fs.existsSync(path.join(root, "src/styles/globals.css"))) {
    return "src/styles/globals.css";
  }
  if (fs.existsSync(path.join(root, "styles/globals.css"))) {
    return "styles/globals.css";
  }
  
  if (fs.existsSync(path.join(root, "src/app"))) {
    return "src/app/globals.css";
  }
  if (fs.existsSync(path.join(root, "app"))) {
    return "app/globals.css";
  }
  
  return "src/app/globals.css";
}

program
  .name("prodigy")
  .description("Add animated components to your project")
  .version("1.0.0");

program
  .command("add [components...]")
  .description("Add one or more components to your project")
  .option("-y, --yes", "skip confirmation prompts")
  .option(
    "--path <path>",
    "destination folder relative to project root (auto-detected if not specified)"
  )
  .action(async (components: string[], opts) => {
    const defaultPath = getDefaultComponentsPath();
    const componentsPath = opts.path || defaultPath;
    
    const spinner = ora("Fetching registry…").start();

    let registry: any;
    try {
      registry = await fetchJSON(REGISTRY_URL);
      spinner.succeed("Registry loaded");
    } catch (e) {
      spinner.fail("Could not reach registry");
      process.exit(1);
    }

    let targets: string[] = components;
    if (!targets.length) {
      const { chosen } = await prompts({
        type: "multiselect",
        name: "chosen",
        message: "Which components do you want to add?",
        choices: registry.components.map((c: any) => ({
          title: c.title,
          value: c.name,
          description: c.description,
        })),
      });
      targets = chosen;
    }

    if (!targets || targets.length === 0) {
      console.log(chalk.yellow("No components selected."));
      process.exit(0);
    }

    if (registry.globals) {
      await appendGlobals(registry.globals.source);
    }

    for (const name of targets) {
      const component = registry.components.find((c: any) => c.name === name);
      if (!component) {
        console.log(
          chalk.red(`  ✖ Component "${name}" not found in registry`)
        );
        continue;
      }

      console.log(chalk.bold(`\n${chalk.cyan("►")} Adding ${component.title}…`));

      for (const file of component.files) {
        const destPath = path.join(
          process.cwd(),
          componentsPath,
          file.path
        );
        await fs.ensureDir(path.dirname(destPath));

        const fileSpinner = ora(
          `  Downloading ${path.basename(file.path)}`
        ).start();
        try {
          const source = await fetchText(file.source);
          await fs.writeFile(destPath, source, "utf-8");
          fileSpinner.succeed(`  ${chalk.green("✓")} ${destPath}`);
        } catch {
          fileSpinner.fail(`  Failed to download ${file.path}`);
        }
      }

      try {
        const publicAssets: Record<string, { path: string; source: string }[]> = {
          "glowing-light": [{ path: "fire.json", source: "https://raw.githubusercontent.com/MohdFaisalBidda/ProdigyUI/main/public/fire.json" }]
        };

        const componentPublicAssets = publicAssets[component.name] || [];
        if (componentPublicAssets.length) {
          console.log(chalk.dim(`\n  Copying public assets…`));
          const publicPath = path.join(process.cwd(), "public");
          await fs.ensureDir(publicPath);
          for (const asset of componentPublicAssets) {
            const destPath = path.join(publicPath, asset.path);
            const assetSpinner = ora(`  Copying ${asset.path} to public/`).start();
            try {
              const source = await fetchText(asset.source);
              await fs.writeFile(destPath, source, "utf-8");
              assetSpinner.succeed(`  ${chalk.green("✓")} public/${asset.path}`);
            } catch (err: any) {
              assetSpinner.fail(`  Failed to copy public/${asset.path}`);
              console.log(chalk.dim(`  Error: ${err?.message || "Unknown error"}`));
            }
          }
        }
      } catch (err: any) {
        console.log(chalk.red(`ERROR in public assets: ${err?.message}`));
      }

      const dependencies = component.dependencies || [];
      const peerDependencies = component.peerDependencies || [];

      const pm = detectPackageManager();

      if (dependencies.length) {
        console.log(chalk.dim(`\n  Installing dependencies…`));
        const depSpinner = ora("  Installing dependencies").start();
        try {
          const depCmd = installCommand(pm, dependencies);
          console.log(chalk.dim(`  Running: ${depCmd}`));
          await execShellCommand(depCmd);
          depSpinner.succeed("  Dependencies installed");
        } catch (err: any) {
          depSpinner.fail("  Failed to install dependencies");
          console.log(chalk.dim(`  Run manually: ${installCommand(pm, dependencies)}`));
          if (err?.message) {
            console.log(chalk.dim(`  Error: ${err.message}`));
          }
        }
      }

      if (peerDependencies.length) {
        console.log(chalk.dim(`\n  Installing peer dependencies…`));
        const peerDepSpinner = ora("  Installing peer dependencies").start();
        try {
          const peerDepCmd = installCommand(pm, peerDependencies);
          console.log(chalk.dim(`  Running: ${peerDepCmd}`));
          await execShellCommand(peerDepCmd);
          peerDepSpinner.succeed("  Peer dependencies installed");
        } catch (err: any) {
          peerDepSpinner.fail("  Failed to install peer dependencies");
          console.log(chalk.dim(`  Run manually: ${installCommand(pm, peerDependencies)}`));
          if (err?.message) {
            console.log(chalk.dim(`  Error: ${err.message}`));
          }
        }
      }

      if (component.installSteps && component.installSteps.length > 0) {
        console.log(chalk.bold(`\n  ${chalk.cyan("Installation Steps:")}`));
        component.installSteps.forEach((step: any, index: number) => {
          console.log(`\n  ${chalk.green(`${index + 1}.`)} ${chalk.bold(step.title)}`);
          console.log(chalk.dim(`     ${step.description}`));
          console.log(chalk.cyan(`     ${step.code}`));
        });
      }
    }

    console.log(chalk.green.bold("\n✓ Done!\n"));
    console.log(
      chalk.dim(`  Import and use the component in your project.\n`)
    );
  });

program
  .command("init")
  .description("Initialize prodigy-ui in your project")
  .option("-y, --yes", "skip confirmation prompts")
  .action(async (opts) => {
    const spinner = ora("Setting up prodigy-ui…").start();

    const uiPath = path.join(process.cwd(), "src/components/ui");
    await fs.ensureDir(uiPath);

    const configContent = `{
  "components": {}
}
`;
    await fs.writeFile(
      path.join(process.cwd(), "prodigy.json"),
      configContent,
      "utf-8"
    );

    spinner.succeed("prodigy-ui initialized!");
    console.log(chalk.dim("\n  Run 'prodigy add <component>' to add components.\n"));
  });

program
  .command("add-all")
  .description("Add all components to your project")
  .option("-y, --yes", "skip confirmation prompts")
  .option(
    "--path <path>",
    "destination folder relative to project root (auto-detected if not specified)"
  )
  .action(async (opts) => {
    const defaultPath = getDefaultComponentsPath();
    const componentsPath = opts.path || defaultPath;
    
    const spinner = ora("Fetching registry…").start();

    let registry: any;
    try {
      registry = await fetchJSON(REGISTRY_URL);
      spinner.succeed("Registry loaded");
    } catch (e) {
      spinner.fail("Could not reach registry");
      process.exit(1);
    }

    const targets = registry.components.map((c: any) => c.name);
    const pm = detectPackageManager();

    console.log(chalk.bold(`\n${chalk.cyan("►")} Adding all ${targets.length} components…\n`));

    if (registry.globals) {
      await appendGlobals(registry.globals.source);
    }

    for (const name of targets) {
      const component = registry.components.find((c: any) => c.name === name);
      if (!component) continue;

      console.log(chalk.dim(`\n  Adding ${component.title}…`));

      for (const file of component.files) {
        const destPath = path.join(
          process.cwd(),
          componentsPath,
          file.path
        );
        await fs.ensureDir(path.dirname(destPath));

        const fileSpinner = ora(`  Downloading ${path.basename(file.path)}`).start();
        try {
          const source = await fetchText(file.source);
          await fs.writeFile(destPath, source, "utf-8");
          fileSpinner.succeed(`  ${chalk.green("✓")} ${destPath}`);
        } catch {
          fileSpinner.fail(`  Failed to download ${file.path}`);
        }
      }
    }

    const allDeps = new Set<string>();
    const allPeerDeps = new Set<string>();
    
    registry.components.forEach((c: any) => {
      (c.dependencies || []).forEach((d: string) => allDeps.add(d));
      (c.peerDependencies || []).forEach((d: string) => allPeerDeps.add(d));
    });

    if (allDeps.size > 0) {
      console.log(chalk.dim(`\n  Installing dependencies…`));
      const depSpinner = ora("  Installing dependencies").start();
      try {
        const depCmd = installCommand(pm, Array.from(allDeps));
        console.log(chalk.dim(`  Running: ${depCmd}`));
        await execShellCommand(depCmd);
        depSpinner.succeed("  Dependencies installed");
      } catch (err: any) {
        depSpinner.fail("  Failed to install dependencies");
        console.log(chalk.dim(`  Run manually: ${installCommand(pm, Array.from(allDeps))}`));
      }
    }

    if (allPeerDeps.size > 0) {
      console.log(chalk.yellow(`\n  Peer dependencies required:`));
      console.log(
        chalk.dim(`  ${installCommand(pm, Array.from(allPeerDeps))}\n`)
      );
    }

    console.log(chalk.green.bold("\n✓ All components added!\n"));

    const uniqueSteps = new Map<string, any>();
    registry.components.forEach((c: any) => {
      if (c.installSteps) {
        c.installSteps.forEach((step: any) => {
          uniqueSteps.set(step.title, step);
        });
      }
    });

    if (uniqueSteps.size > 0) {
      console.log(chalk.bold(`${chalk.cyan("Important Setup Steps:")}\n`));
      uniqueSteps.forEach((step, title) => {
        console.log(`  ${chalk.green("•")} ${chalk.bold(step.title)}`);
        console.log(chalk.dim(`    ${step.description}`));
        console.log();
      });
    }

    console.log(
      chalk.dim(`  Import and use the components in your project.\n`)
    );
  });

program
  .command("list")
  .description("List all available components")
  .action(async () => {
    const spinner = ora("Fetching registry…").start();
    const registry = await fetchJSON(REGISTRY_URL);
    spinner.stop();

    console.log(
      chalk.bold(`\n${chalk.cyan("Available components:")}\n`)
    );
    registry.components.forEach((c: any) => {
      console.log(
        `  ${chalk.cyan(c.name.padEnd(22))} ${chalk.dim(
          c.description ? c.description.substring(0, 50) + "..." : ""
        )}`
      );
      console.log(
        chalk.dim(`    Tag: ${c.tag}`)
      );
      if (c.peerDependencies && c.peerDependencies.length > 0) {
        console.log(
          chalk.yellow(`    ⚠ Setup required: ${c.peerDependencies.join(", ")}`)
        );
      }
      console.log();
    });
  });

function execShellCommand(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const [command, ...args] = cmd.split(" ");
    const child = spawn(command, args, { shell: true, stdio: "pipe" });
    
    let stdout = "";
    let stderr = "";
    
    child.stdout?.on("data", (data) => { stdout += data; });
    child.stderr?.on("data", (data) => { stderr += data; });
    
    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(stderr || `Command failed with code ${code}`));
      }
    });
    
    child.on("error", reject);
  });
}

program.parse(process.argv);
