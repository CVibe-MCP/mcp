# cvibe MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![cvibe Hub](https://img.shields.io/badge/cvibe-Hub-blue?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)](https://cvibe.dev)

> **The Free AI Prompt Hub** — Discover and share community-built prompts for ChatGPT, Claude, Gemini and more

🌟 **[Browse Free Prompts on cvibe.dev →](https://cvibe.dev)**

cvibe MCP is a Model Context Protocol server that connects you to **the free, community-driven prompt library**. Built by developers, for developers - no more scattered Google Docs, screenshots, or reinventing prompts. Every prompt is tested, versioned, and ready to use.

**🎯 Why Choose cvibe?**
- **100% Free & Open Source** - No subscriptions, no paywalls
- **Community Driven** - Real prompts from real developers
- **Works Everywhere** - ChatGPT, Claude, Gemini, Cursor, VSCode
- **Quality Guaranteed** - Every prompt is tested and rated by the community

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
git clone https://github.com/cvibe-MCP/mcp.git
cd mcp

# Install dependencies
npm install

# Build the project
npm run build
```

### Configuration

Add cvibe to your MCP configuration file:

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
git clone https://github.com/cvibe-MCP/mcp.git
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

## 📚 Documentation & Community

- **🌐 [cvibe.dev](https://cvibe.dev)** - Browse free prompts, submit your own
- **💬 [Join Discord](https://discord.gg/xtzRyfky)** - Get help, share prompts, connect with developers
- **📂 [GitHub](https://github.com/cvibe-MCP/)** - Contribute to the open source project
- **📖 [MCP Documentation](https://modelcontextprotocol.io)** - Learn about Model Context Protocol

## 🚀 Get Started Now

1. **[Visit cvibe.dev](https://cvibe.dev)** to browse free prompts
2. **Configure MCP** using the setup above
3. **Join our [Discord community](https://discord.gg/xtzRyfky)** for support
4. **Share your own prompts** and help grow the community

## 🐛 Issues & Support

- **Bug Reports**: [GitHub Issues](https://github.com/cvibe-MCP/mcp/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/cvibe-MCP/mcp/discussions)
- **Community Help**: [Discord](https://discord.gg/xtzRyfky) - Real-time support from developers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the cvibe community
- Powered by [Model Context Protocol](https://modelcontextprotocol.io)
- Inspired by the npm ecosystem

---

**🎯 Ready to stop reinventing prompts? [Start browsing free prompts on cvibe.dev →](https://cvibe.dev)**

**Made with ❤️ by developers, for developers who value their time**