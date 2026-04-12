# ProdigyUI MCP Server

MCP (Model Context Protocol) server for ProdigyUI - enabling AI-assisted development with animated UI components.

## Installation

```bash
npm install @prodigyui/mcp
```

## Usage

### Direct Usage

```bash
npx @prodigyui/mcp
```

### Via CLI

```bash
npx prodigy@latest mcp
```

## AI Editor Configuration

### Cursor

Add to `Settings > Features > MCP`:

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

### Claude Code

```bash
claude mcp add prodigy-ui -- npx -y @prodigyui/mcp
```

### VS Code + Cline

Add to Cline MCP settings:

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

## Available Tools

| Tool | Description |
|------|-------------|
| `list_components` | List all available ProdigyUI components |
| `search_components` | Search components by name, description, or tag |
| `get_component` | Get detailed information about a specific component |
| `get_component_source` | Get source code URLs for component files |
| `get_install_command` | Get installation commands and dependencies |
| `get_components_by_tag` | Filter components by tag |
| `get_all_tags` | List all available component tags |

## Example Prompts

```
"List all interactive components from ProdigyUI"
"Search for card components"
"Get the install command for the stroke-cards component"
"Show me all GSAP-powered components"
```

## License

MIT
