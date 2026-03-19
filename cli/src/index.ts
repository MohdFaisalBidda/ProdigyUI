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
  "https://raw.githubusercontent.com/MohdFaisalBidda/ProdigyUI/main/packages/registry/registry.json";

const program = new Command();

function fetchJSON(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
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
          opts.path,
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
        console.log(chalk.yellow(`\n  Peer dependencies required:`));
        console.log(
          chalk.dim(`  ${installCommand(pm, peerDependencies)}\n`)
        );
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
    "destination folder relative to project root",
    "src/components/ui"
  )
  .action(async (opts) => {
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

    for (const name of targets) {
      const component = registry.components.find((c: any) => c.name === name);
      if (!component) continue;

      console.log(chalk.dim(`\n  Adding ${component.title}…`));

      for (const file of component.files) {
        const destPath = path.join(
          process.cwd(),
          opts.path,
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
          chalk.dim(`    Deps: ${c.peerDependencies.join(", ")}`)
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
