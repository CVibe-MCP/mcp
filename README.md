# CVibe MCP Server

Model Context Protocol server for accessing the CVibe prompt registry from Cursor IDE.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Cursor IDE with MCP support

### Installation

```bash
# Clone and install
git clone <repo>
cd mcp
npm install

# Build the project
npm run build
```

### Configuration

The MCP server is configured directly in your Cursor `mcp.json` file. The API URL is set via command-line arguments.

## 🔧 Cursor IDE Integration

Add this to your Cursor MCP configuration:

### Production API Configuration:
```json
{
  "mcpServers": {
    "cvibe": {
      "command": "node",
      "args": [
        "/path/to/cvibe-mcp/dist/index.js",
        "--api-url=https://api.cvibe.dev/api/v1"
      ],
      "cwd": "/path/to/cvibe-mcp"
    }
  }
}
```

### Local Development API:
```json
{
  "mcpServers": {
    "cvibe": {
      "command": "node", 
      "args": [
        "/path/to/cvibe-mcp/dist/index.js",
        "--api-url=http://localhost:3000/api/v1"
      ],
      "cwd": "/path/to/cvibe-mcp"
    }
  }
}
```

## 🛠️ Available Tools

Once configured in Cursor, you'll have access to these MCP tools:

- **`cvibe_search`** - Search the CVibe prompt registry
- **`cvibe_get`** - Get a specific prompt by ID
- **`cvibe_init`** - Initialize a new prompt package
- **`cvibe_publish`** - Publish a prompt to the registry

## 📝 Usage Examples

### Search for prompts:
```
Use the cvibe_search tool to find React prompts with difficulty "intermediate"
```

### Get a specific prompt:
```
Use cvibe_get with prompt ID "abc123" to view the full prompt
```

### Create a new prompt:
```
Use cvibe_init to create a new TypeScript debugging prompt
```

## 🔧 Development

```bash
# Build and test locally
npm run build
npm run dev
```

## 📚 Documentation

For more information about MCP and Cursor integration, see:
- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [Cursor IDE MCP Guide](https://docs.cursor.com/mcp)

---

**Made with ❤️ for the CVibe community**