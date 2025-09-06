# CVibe MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

> **The npm for prompts** — Access millions of open-source, field-tested prompts through Model Context Protocol

CVibe MCP is a Model Context Protocol server that brings the power of the [CVibe prompt registry](https://cvibe.dev) directly into your development workflow. No more scattered Google Docs, screenshots, or one-off hacks. Every prompt is versioned, standardized, and MCP-native.

## ✨ Features

- 🔍 **Search & Discover** - Find prompts by category, difficulty, rating, and more
- 📦 **Package Management** - Initialize, version, and publish prompt packages
- 🔌 **MCP Native** - Works seamlessly with Cursor, Claude Code, Windsurf, and other MCP-compatible tools
- 🌐 **Community Driven** - Access prompts shared by developers worldwide
- 📚 **Standardized** - Every prompt follows consistent metadata and structure

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Cursor IDE, Claude Code, Windsurf, or other MCP-compatible tool

### Installation

**For Production Use:**
No installation needed! Use the remote MCP server directly in your configuration.

**For Local Development:**
```bash
# Clone the repository
git clone https://github.com/CVibe-MCP/mcp.git
cd mcp

# Install dependencies
npm install

# Build the project
npm run build
```

### Configuration

Add CVibe to your MCP configuration file:

**For Cursor IDE** (`~/.cursor/mcp.json`):

**Production (Remote MCP Server):**
```json
{
  "mcpServers": {
    "cvibe": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.cvibe.dev/mcp"
      ]
    }
  }
}
```

**Local Development:**
```json
{
  "mcpServers": {
    "cvibe-local": {
      "command": "node",
      "args": [
        "mcp/dist/index.js"
      ]
    }
  }
}
```

**For Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "cvibe": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.cvibe.dev/mcp"
      ]
    }
  }
}
```

## 🛠️ Available Tools

Once configured, you'll have access to these MCP tools:

| Tool | Description |
|------|-------------|
| `cvibe_search` | Search the prompt registry with filters (category, difficulty, rating) |
| `cvibe_get` | Get a specific prompt by ID with full metadata |
| `cvibe_init` | Initialize a new prompt package with proper structure |
| `cvibe_publish` | Publish your prompt to the community registry |

## 📝 Usage Examples

### Search for React prompts
```
Search for React prompts with difficulty "intermediate" and minimum rating 4.0
```

### Get a specific prompt
```
Get the prompt with name "react-component-generator" to see its full content
```

### Create and publish a new prompt
```
Initialize a new TypeScript debugging prompt package, then publish it to the registry
```

## 🔧 Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/CVibe-MCP/mcp.git
cd mcp

# Install dependencies
npm install

# Build the project
npm run build
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** and add tests if applicable
4. **Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and patterns
- Update documentation as needed

## 📚 Documentation

- [CVibe Website](https://cvibe.dev) - Browse prompts and learn more
- [Model Context Protocol](https://modelcontextprotocol.io) - Learn about MCP
- [Cursor IDE MCP Guide](https://docs.cursor.com/mcp) - Cursor-specific setup

## 🐛 Issues & Support

- **Bug Reports**: [GitHub Issues](https://github.com/CVibe-MCP/mcp/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/CVibe-MCP/mcp/discussions)
- **Community**: [Discord](https://discord.gg/cvibe) - Join real-time discussions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the CVibe community
- Powered by [Model Context Protocol](https://modelcontextprotocol.io)
- Inspired by the npm ecosystem

---

**Made with ❤️ for developers who are tired of reinventing prompts**