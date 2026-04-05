# ProdigyUI MCP Server

Connect ProdigyUI to your AI editor via the Model Context Protocol. Expose the entire component library for effortless AI-assisted development.

## Setup

### Cursor

1. Open Cursor Settings (Cmd/Ctrl + ,)
2. Navigate to Features > MCP
3. Click "Add new MCP server"
4. Add the following configuration:

```json
{
  "mcpServers": {
    "prodigy-ui": {
      "command": "npx",
      "args": ["-y", "prodigy-ui", "mcp"]
    }
  }
}
```

### Claude Code

Run the following command:

```bash
claude mcp add prodigy-ui -- npx -y prodigy-ui mcp
```

Or add to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "prodigy-ui": {
      "command": "npx",
      "args": ["-y", "prodigy-ui", "mcp"]
    }
  }
}
```

### VS Code with Cline

1. Install the Cline extension
2. Go to Cline Settings > MCP Servers
3. Add a new server with:

```json
{
  "mcpServers": {
    "prodigy-ui": {
      "command": "npx",
      "args": ["-y", "prodigy-ui", "mcp"]
    }
  }
}
```

## Available Tools

The ProdigyUI MCP server exposes the following tools:

| Tool | Description |
|------|-------------|
| `list_components` | List all available components with names, descriptions, and tags |
| `search_components` | Search components by name, description, or tag |
| `get_component` | Get detailed information about a specific component |
| `get_component_source` | Get source code URLs for component files |
| `get_install_command` | Get installation commands and dependencies for a component |
| `get_components_by_tag` | Filter components by tag (Interactive, GSAP, Scroll, Motion) |
| `get_all_tags` | List all available component tags |

## Usage Examples

### List All Components

```
Search the ProdigyUI registry for all available components. List them with their names and descriptions.
```

### Search for Components

```
Search ProdigyUI for components related to cards or image galleries.
```

### Get Component Details

```
Get the full documentation for the stroke-cards component, including its files and dependencies.
```

### Install a Component

```
Search for components related to animations, then get the install command for the pixel-image component.
```

### Filter by Tag

```
Get all GSAP-powered components from the ProdigyUI library.
```

## Security

Your API key is never stored in plaintext. MCP connections are established locally via stdio, ensuring secure communication between your editor and the component registry.

## Need Help?

- [Documentation](https://prodigyui.in)
- [GitHub Issues](https://github.com/MohdFaisalBidda/ProdigyUI/issues)
- [CLI Commands](/docs/cli-commands)
