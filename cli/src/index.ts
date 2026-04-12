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
  .option("--all", "Add all available components")
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

    if (opts.all) {
      targets = registry.components.map((c: any) => c.name);
    } else if (!targets.length) {
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
    console.log(chalk.dim("\n  Run 'npx prodigy@latest add <component>' to add components.\n"));
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

async function detectMCPClient(): Promise<{
  type: 'vscode' | 'cursor' | 'claude-desktop' | 'windsurf' | 'unknown';
  configPath?: string;
  settingsPath?: string;
}> {
  const home = process.env.HOME || process.env.USERPROFILE || '';
  const platform = process.platform;

  // VS Code
  const vscodePaths = {
    darwin: path.join(home, 'Library/Application Support/Code/User/settings.json'),
    win32: path.join(home, 'AppData/Roaming/Code/User/settings.json'),
    linux: path.join(home, '.config/Code/User/settings.json')
  };

  // Cursor
  const cursorPaths = {
    darwin: path.join(home, 'Library/Application Support/Cursor/User/settings.json'),
    win32: path.join(home, 'AppData/Roaming/Cursor/User/settings.json'),
    linux: path.join(home, '.config/Cursor/User/settings.json')
  };

  // Claude Desktop
  const claudePaths = {
    darwin: path.join(home, 'Library/Application Support/Claude/claude_desktop_config.json'),
    win32: path.join(home, 'AppData/Roaming/Claude/claude_desktop_config.json'),
    linux: path.join(home, '.config/Claude/claude_desktop_config.json')
  };

  // Windsurf
  const windsurfPaths = {
    darwin: path.join(home, 'Library/Application Support/Windsurf/User/settings.json'),
    win32: path.join(home, 'AppData/Roaming/Windsurf/User/settings.json'),
    linux: path.join(home, '.config/Windsurf/User/settings.json')
  };

  const currentPlatform = platform as keyof typeof vscodePaths;

  // Check in order of preference
  if (await fs.pathExists(vscodePaths[currentPlatform])) {
    return { type: 'vscode', settingsPath: vscodePaths[currentPlatform] };
  }

  if (await fs.pathExists(cursorPaths[currentPlatform])) {
    return { type: 'cursor', settingsPath: cursorPaths[currentPlatform] };
  }

  if (await fs.pathExists(claudePaths[currentPlatform])) {
    return { type: 'claude-desktop', configPath: claudePaths[currentPlatform] };
  }

  if (await fs.pathExists(windsurfPaths[currentPlatform])) {
    return { type: 'windsurf', settingsPath: windsurfPaths[currentPlatform] };
  }

  return { type: 'unknown' };
}

async function configureMCPClient(client: ReturnType<typeof detectMCPClient> extends Promise<infer T> ? T : never): Promise<boolean> {
  if (client.type === 'unknown') return false;

  const mcpConfig = {
    mcpServers: {
      "prodigy-ui": {
        command: "npx",
        args: ["-y", "@prodigyui/mcp"]
      }
    }
  };

  try {
    let configPath = client.settingsPath || client.configPath;
    if (!configPath) return false;

    let existingConfig = {};
    if (await fs.pathExists(configPath)) {
      try {
        const content = await fs.readFile(configPath, 'utf-8');
        existingConfig = JSON.parse(content);
      } catch {
        // If parsing fails, we'll overwrite with new config
      }
    }

    const mergedConfig = { ...existingConfig, ...mcpConfig };
    await fs.ensureDir(path.dirname(configPath));
    await fs.writeFile(configPath, JSON.stringify(mergedConfig, null, 2), 'utf-8');

    return true;
  } catch {
    return false;
  }
}

async function installMCPDependencies(): Promise<boolean> {
  const spinner = ora('Installing MCP dependencies...').start();

  try {
    const pm = detectPackageManager();
    const installCmd = installCommand(pm, ['@modelcontextprotocol/sdk'], true);
    await execShellCommand(installCmd);
    spinner.succeed('MCP dependencies installed');
    return true;
  } catch (err: any) {
    spinner.fail('Failed to install MCP dependencies');
    console.log(chalk.dim(`  You can install manually: npm install -D @modelcontextprotocol/sdk`));
    return false;
  }
}

program
  .command("setup-mcp")
  .description("One-command MCP setup - installs dependencies and configures your MCP client automatically")
  .option("-y, --yes", "skip confirmation prompts")
  .action(async (opts) => {
    console.log(chalk.cyan.bold('\n🚀 ProdigyUI MCP Setup\n'));

    // Step 1: Detect MCP client
    const spinner = ora('Detecting your MCP client...').start();
    const client = await detectMCPClient();

    if (client.type === 'unknown') {
      spinner.warn('Could not auto-detect MCP client');
      console.log(chalk.yellow('\nSupported clients: VS Code, Cursor, Claude Desktop, Windsurf'));
      console.log(chalk.dim('Make sure you have one of these installed and configured.\n'));
    } else {
      spinner.succeed(`Detected ${client.type === 'vscode' ? 'VS Code' : client.type === 'cursor' ? 'Cursor' : client.type === 'claude-desktop' ? 'Claude Desktop' : 'Windsurf'}`);
    }

    // Step 2: Install dependencies
    const depsInstalled = await installMCPDependencies();

    // Step 3: Configure client automatically
    if (client.type !== 'unknown') {
      const configSpinner = ora(`Configuring ${client.type}...`).start();
      const configured = await configureMCPClient(client);

      if (configured) {
        configSpinner.succeed(`${client.type} configured successfully!`);
        console.log(chalk.green('\n✅ Setup complete! Restart your editor to start using MCP.'));
        console.log(chalk.dim('\nYou can now ask your AI assistant to:'));
        console.log(chalk.cyan('  • "Show me all ProdigyUI components"'));
        console.log(chalk.cyan('  • "Get the stroke-cards component"'));
        console.log(chalk.cyan('  • "Install the infinite-slider component"'));
        return;
      } else {
        configSpinner.fail(`Could not configure ${client.type} automatically`);
      }
    }

    // Fallback: Manual configuration
    console.log(chalk.yellow('\n📋 Manual Configuration Required\n'));
    console.log(chalk.dim('Add this to your MCP client configuration:\n'));
    console.log(chalk.cyan(JSON.stringify({
      mcpServers: {
        "prodigy-ui": {
          command: "npx",
          args: ["-y", "@prodigyui/mcp"]
        }
      }
    }, null, 2)));

    console.log(chalk.dim('\nConfiguration locations:'));
    console.log(chalk.dim('  • VS Code/Cursor: Settings → Extensions → MCP'));
    console.log(chalk.dim('  • Claude Desktop: ~/Library/Application Support/Claude/claude_desktop_config.json'));
    console.log(chalk.dim('  • Windsurf: Settings → AI → MCP Configuration'));
  });

program
  .command("mcp")
  .description("Start the ProdigyUI MCP server for AI-assisted development")
  .action(async () => {
    console.log(chalk.cyan("Starting ProdigyUI MCP server..."));
    console.log(chalk.dim("\nConfigure your AI editor with this JSON:\n"));
    console.log(
      JSON.stringify(
        {
          mcpServers: {
            "prodigy-ui": {
              command: "npx",
              args: ["-y", "prodigy-ui", "mcp"],
            },
          },
        },
        null,
        2
      )
    );
    console.log(chalk.dim("\nMCP server is running. Press Ctrl+C to stop.\n"));

    const localMcpPath = path.join(
      process.cwd(),
      "node_modules",
      "@prodigyui",
      "mcp",
      "dist",
      "index.js"
    );

    if (fs.existsSync(localMcpPath)) {
      const { spawn } = await import("child_process");
      const mcpProcess = spawn("node", [localMcpPath], {
        stdio: "inherit",
        env: process.env,
      });
      mcpProcess.on("close", (code) => process.exit(code || 0));
      mcpProcess.on("error", (err) => {
        console.error(chalk.red(`\nFailed to start MCP server: ${err.message}`));
        process.exit(1);
      });
      return;
    }

    const { spawn } = await import("child_process");
    const mcpProcess = spawn("npx", ["-y", "@prodigyui/mcp"], {
      stdio: "inherit",
      env: process.env,
    });
    mcpProcess.on("close", (code) => process.exit(code || 0));
    mcpProcess.on("error", (err) => {
      console.error(chalk.red(`\nFailed to start MCP server: ${err.message}`));
      process.exit(1);
    });
  });

program.parse(process.argv);
