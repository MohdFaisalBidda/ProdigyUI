#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import https from "https";
import http from "http";
import { spawn } from "child_process";
import prompts from "prompts";
var REGISTRY_URL = "https://raw.githubusercontent.com/MohdFaisalBidda/ProdigyUI/main/packages/registry/registry.json";
var program = new Command();
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
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
function fetchText(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}
function detectPackageManager() {
  const agent = process.env.npm_config_user_agent || "";
  if (agent.includes("pnpm")) return "pnpm";
  if (agent.includes("yarn")) return "yarn";
  if (agent.includes("bun")) return "bun";
  return "npm";
}
function installCommand(pm, deps, isDev = false) {
  const cmds = {
    npm: `npm install ${isDev ? "-D " : ""}${deps.join(" ")}`,
    pnpm: `pnpm add ${isDev ? "-D " : ""}${deps.join(" ")}`,
    yarn: `yarn add ${isDev ? "-D " : ""}${deps.join(" ")}`,
    bun: `bun add ${isDev ? "-D " : ""}${deps.join(" ")}`
  };
  return cmds[pm];
}
program.name("prodigy").description("Add animated components to your project").version("1.0.0");
program.command("add [components...]").description("Add one or more components to your project").option("-y, --yes", "skip confirmation prompts").option(
  "--path <path>",
  "destination folder relative to project root",
  "src/components/ui"
).action(async (components, opts) => {
  const spinner = ora("Fetching registry\u2026").start();
  let registry;
  try {
    registry = await fetchJSON(REGISTRY_URL);
    spinner.succeed("Registry loaded");
  } catch (e) {
    spinner.fail("Could not reach registry");
    process.exit(1);
  }
  let targets = components;
  if (!targets.length) {
    const { chosen } = await prompts({
      type: "multiselect",
      name: "chosen",
      message: "Which components do you want to add?",
      choices: registry.components.map((c) => ({
        title: c.title,
        value: c.name,
        description: c.description
      }))
    });
    targets = chosen;
  }
  if (!targets || targets.length === 0) {
    console.log(chalk.yellow("No components selected."));
    process.exit(0);
  }
  for (const name of targets) {
    const component = registry.components.find((c) => c.name === name);
    if (!component) {
      console.log(
        chalk.red(`  \u2716 Component "${name}" not found in registry`)
      );
      continue;
    }
    console.log(chalk.bold(`
${chalk.cyan("\u25BA")} Adding ${component.title}\u2026`));
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
        fileSpinner.succeed(`  ${chalk.green("\u2713")} ${destPath}`);
      } catch {
        fileSpinner.fail(`  Failed to download ${file.path}`);
      }
    }
    const dependencies = component.dependencies || [];
    const peerDependencies = component.peerDependencies || [];
    const pm = detectPackageManager();
    if (dependencies.length) {
      console.log(chalk.dim(`
  Installing dependencies\u2026`));
      const depSpinner = ora("  Installing dependencies").start();
      try {
        const depCmd = installCommand(pm, dependencies);
        console.log(chalk.dim(`  Running: ${depCmd}`));
        await execShellCommand(depCmd);
        depSpinner.succeed("  Dependencies installed");
      } catch (err) {
        depSpinner.fail("  Failed to install dependencies");
        console.log(chalk.dim(`  Run manually: ${installCommand(pm, dependencies)}`));
        if (err?.message) {
          console.log(chalk.dim(`  Error: ${err.message}`));
        }
      }
    }
    if (peerDependencies.length) {
      console.log(chalk.yellow(`
  Peer dependencies required:`));
      console.log(
        chalk.dim(`  ${installCommand(pm, peerDependencies)}
`)
      );
    }
  }
  console.log(chalk.green.bold("\n\u2713 Done!\n"));
  console.log(
    chalk.dim(`  Import and use the component in your project.
`)
  );
});
program.command("init").description("Initialize prodigy-ui in your project").option("-y, --yes", "skip confirmation prompts").action(async (opts) => {
  const spinner = ora("Setting up prodigy-ui\u2026").start();
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
program.command("add-all").description("Add all components to your project").option("-y, --yes", "skip confirmation prompts").option(
  "--path <path>",
  "destination folder relative to project root",
  "src/components/ui"
).action(async (opts) => {
  const spinner = ora("Fetching registry\u2026").start();
  let registry;
  try {
    registry = await fetchJSON(REGISTRY_URL);
    spinner.succeed("Registry loaded");
  } catch (e) {
    spinner.fail("Could not reach registry");
    process.exit(1);
  }
  const targets = registry.components.map((c) => c.name);
  const pm = detectPackageManager();
  console.log(chalk.bold(`
${chalk.cyan("\u25BA")} Adding all ${targets.length} components\u2026
`));
  for (const name of targets) {
    const component = registry.components.find((c) => c.name === name);
    if (!component) continue;
    console.log(chalk.dim(`
  Adding ${component.title}\u2026`));
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
        fileSpinner.succeed(`  ${chalk.green("\u2713")} ${destPath}`);
      } catch {
        fileSpinner.fail(`  Failed to download ${file.path}`);
      }
    }
  }
  const allDeps = /* @__PURE__ */ new Set();
  const allPeerDeps = /* @__PURE__ */ new Set();
  registry.components.forEach((c) => {
    (c.dependencies || []).forEach((d) => allDeps.add(d));
    (c.peerDependencies || []).forEach((d) => allPeerDeps.add(d));
  });
  if (allDeps.size > 0) {
    console.log(chalk.dim(`
  Installing dependencies\u2026`));
    const depSpinner = ora("  Installing dependencies").start();
    try {
      const depCmd = installCommand(pm, Array.from(allDeps));
      console.log(chalk.dim(`  Running: ${depCmd}`));
      await execShellCommand(depCmd);
      depSpinner.succeed("  Dependencies installed");
    } catch (err) {
      depSpinner.fail("  Failed to install dependencies");
      console.log(chalk.dim(`  Run manually: ${installCommand(pm, Array.from(allDeps))}`));
    }
  }
  if (allPeerDeps.size > 0) {
    console.log(chalk.yellow(`
  Peer dependencies required:`));
    console.log(
      chalk.dim(`  ${installCommand(pm, Array.from(allPeerDeps))}
`)
    );
  }
  console.log(chalk.green.bold("\n\u2713 All components added!\n"));
  console.log(
    chalk.dim(`  Import and use the components in your project.
`)
  );
});
program.command("list").description("List all available components").action(async () => {
  const spinner = ora("Fetching registry\u2026").start();
  const registry = await fetchJSON(REGISTRY_URL);
  spinner.stop();
  console.log(
    chalk.bold(`
${chalk.cyan("Available components:")}
`)
  );
  registry.components.forEach((c) => {
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
function execShellCommand(cmd) {
  return new Promise((resolve, reject) => {
    const [command, ...args] = cmd.split(" ");
    const child = spawn(command, args, { shell: true, stdio: "pipe" });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (data) => {
      stdout += data;
    });
    child.stderr?.on("data", (data) => {
      stderr += data;
    });
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
