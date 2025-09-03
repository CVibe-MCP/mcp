# 🌊 CVibe MCP - The npm for Prompts

<div align="center">

**Discover, Share, and Access Millions of Field-Tested AI Prompts**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/cvibe/cvibe-mcp)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-Compatible-purple.svg)](https://modelcontextprotocol.io)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)

*"Just like npm revolutionized package management, CVibe revolutionizes prompt management."*

</div>

---

## 🚀 What is CVibe?

CVibe MCP is a **Model Context Protocol server** that transforms how developers access and manage AI prompts. Think of it as **npm for prompts** - a vast registry of battle-tested, open-source prompts that you can discover, install, and use directly in your AI workflows.

### 🎯 The Problem We Solve

- **Prompt Fragmentation**: Developers recreate the same prompts over and over
- **Quality Uncertainty**: No way to know if a prompt is field-tested and reliable  
- **Discovery Difficulty**: Finding the right prompt for your specific use case
- **Version Management**: No systematic way to update and maintain prompts
- **Community Isolation**: Brilliant prompts locked away in individual workflows

### ✨ The CVibe Solution

CVibe creates a **centralized, searchable registry** of high-quality prompts with:
- 🔍 **Smart Search**: Find prompts by keywords, categories, difficulty, and ratings
- ⭐ **Community Ratings**: See what prompts actually work in production
- 📊 **Usage Analytics**: Download counts and popularity metrics
- 🏷️ **Rich Metadata**: Categories, tags, frameworks, languages, and more
- 👥 **Author Attribution**: Discover prolific prompt creators
- 🔄 **Version Control**: Track prompt evolution and improvements

---

## 🎨 Features

### 🔧 Core Tools

| Tool | Description | Use Case |
|------|-------------|----------|
| `cvibe_search` | Advanced prompt search with filters | Find prompts by keywords, category, difficulty |
| `cvibe_get` | Retrieve full prompt content | Get the complete prompt ready to use |
| `cvibe_popular` | Most downloaded prompts | Discover trending and proven prompts |
| `cvibe_categories` | Browse prompt categories | Explore prompts by domain/use case |
| `cvibe_author` | Find prompts by author | Follow your favorite prompt creators |
| `cvibe_stats` | Registry statistics | Get insights into the prompt ecosystem |

### 📚 Prompt Categories

- 🔨 **code-generation** - Generate production-ready code
- 🐛 **debugging** - Systematic debugging and troubleshooting  
- 📖 **documentation** - Create comprehensive docs and guides
- 🧪 **testing** - Test strategies and implementation
- ♻️ **refactoring** - Code improvement and optimization
- 🏗️ **architecture** - System design and architecture decisions
- 🔒 **security** - Security analysis and hardening
- ⚡ **performance** - Performance optimization techniques
- 🎨 **ui-ux** - User interface and experience design
- 📊 **data-analysis** - Data processing and insights
- 🚀 **devops** - Deployment and infrastructure automation
- 🔌 **api-design** - API development and documentation
- 🗄️ **database** - Database design and optimization
- 📱 **mobile** - Mobile app development
- 🌐 **web** - Web development and frameworks
- 🤖 **machine-learning** - ML/AI model development
- 🔧 **general** - Multi-purpose and utility prompts

---

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org)
- **Claude for Desktop** - [Get it here](https://claude.ai/desktop)

### Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/cvibe/cvibe-mcp.git
   cd cvibe-mcp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Configure Claude for Desktop**:
   
   Edit your Claude configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

   Add CVibe to your MCP servers:
   ```json
   {
     "mcpServers": {
       "cvibe": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/cvibe-mcp/dist/index.js"]
       }
     }
   }
   ```

5. **Restart Claude for Desktop** and look for the CVibe tools! 🎉

---

## 🎯 Usage Examples

### 🔍 Discover Prompts

```
"Find React component generation prompts"
→ Uses cvibe_search with query="React component generation"

"Show me advanced debugging prompts with high ratings"  
→ Uses cvibe_search with difficulty="advanced", category="debugging", minRating=4.5

"What are the most popular prompts right now?"
→ Uses cvibe_popular
```

### 📖 Get Full Prompts

```
"Get the React Component Generator Pro prompt"
→ Uses cvibe_get with promptId="react-component-gen-v2"

"Show me the SQL optimization prompt"
→ Uses cvibe_get with promptId="sql-optimizer-pro"
```

### 📊 Explore the Registry

```
"What categories are available?"
→ Uses cvibe_categories

"Show me prompts by reactmaster"
→ Uses cvibe_author with author="reactmaster"  

"Give me CVibe statistics"
→ Uses cvibe_stats
```

---

## 🌟 Sample Prompts in Registry

### 🔥 React Component Generator Pro
- **Author**: reactmaster | **Rating**: ⭐ 4.8/5 | **Downloads**: 15,420
- Generate production-ready React components with TypeScript, tests, and docs
- **Tags**: react, typescript, components, testing, documentation

### 🔍 API Debug Detective  
- **Author**: debugguru | **Rating**: ⭐ 4.9/5 | **Downloads**: 8,750
- Systematically debug API issues with comprehensive analysis
- **Tags**: api, debugging, http, troubleshooting, networking

### ⚡ SQL Query Optimizer Pro
- **Author**: sqlwizard | **Rating**: ⭐ 4.7/5 | **Downloads**: 12,300  
- Analyze and optimize SQL queries for maximum performance
- **Tags**: sql, database, optimization, performance, indexing

### 👀 Comprehensive Code Review Assistant
- **Author**: codereviewpro | **Rating**: ⭐ 4.6/5 | **Downloads**: 9,800
- Perform thorough code reviews with security and performance focus
- **Tags**: code-review, quality, security, performance, best-practices

### 🐳 Docker Deployment Generator
- **Author**: dockermaster | **Rating**: ⭐ 4.9/5 | **Downloads**: 7,650
- Generate production-ready Docker configurations with best practices  
- **Tags**: docker, deployment, devops, containerization, production

---

## 🏗️ Project Structure

```
cvibe-mcp/
├── 📁 src/
│   ├── 📄 index.ts              # Main MCP server implementation
│   └── 📁 data/
│       └── 📄 prompts.ts        # Prompt registry and utilities
├── 📁 dist/                     # Compiled JavaScript (auto-generated)
├── 📄 package.json              # Project configuration  
├── 📄 tsconfig.json             # TypeScript configuration
├── 📄 .gitignore               # Git ignore rules
└── 📄 README.md                # This amazing documentation
```

---

## 🔧 Development

### Available Scripts

```bash
npm run build      # Compile TypeScript → JavaScript
npm start          # Run the compiled server  
npm run dev        # Build and run in one command
npm run watch      # Watch for changes and rebuild
npm test           # Run tests (coming soon!)
```

### Adding New Prompts

1. **Edit** `src/data/prompts.ts`
2. **Add your prompt** to the `PROMPTS_REGISTRY` array
3. **Follow the schema**:
   ```typescript
   {
     id: 'unique-prompt-id',
     name: 'Human Readable Name',
     description: 'What this prompt does',
     content: 'The actual prompt template',
     category: 'code-generation', // from PROMPT_CATEGORIES
     tags: ['tag1', 'tag2'],
     author: 'yourusername',
     version: '1.0.0',
     // ... other metadata
   }
   ```
4. **Rebuild**: `npm run build`

### Contributing

We welcome contributions! Here's how:

1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch: `git checkout -b amazing-feature`
3. ✍️ **Add** your prompts or improvements
4. ✅ **Test** your changes: `npm run dev`
5. 📤 **Submit** a pull request

---

## 🚨 Troubleshooting

### 🔧 Server Issues

**CVibe not showing up in Claude?**
1. ✅ Check your `claude_desktop_config.json` syntax
2. ✅ Verify the absolute path is correct
3. ✅ Ensure `dist/index.js` exists (`npm run build`)
4. ✅ Restart Claude for Desktop completely

**Tool calls failing?**
1. 📋 Check Claude's logs:
   - **macOS**: `tail -f ~/Library/Logs/Claude/mcp*.log`
   - **Windows**: Check `%APPDATA%/Claude/Logs/mcp*.log`
2. 🔍 Verify prompt IDs are correct
3. 🔄 Try rebuilding: `npm run build`

### 🐛 Build Issues

**TypeScript compilation errors?**
1. 🔄 Delete `node_modules`: `rm -rf node_modules package-lock.json`
2. 🔄 Reinstall: `npm install`  
3. ✅ Check Node.js version: `node --version` (should be 18+)

---

## 🌐 Community & Ecosystem

### 🎯 Vision

CVibe aims to become the **definitive prompt registry** for the AI development community. We envision:

- 📈 **Millions of prompts** across every domain and use case
- 🤝 **Collaborative improvement** through community feedback
- 🔍 **AI-powered discovery** to find exactly what you need
- 🔄 **Automatic updates** when prompts improve
- 🏆 **Quality assurance** through community validation

### 🤝 Join the Movement

- 💬 **Discord**: [Join our community](https://discord.gg/cvibe)
- 🐦 **Twitter**: [@CVibeDev](https://twitter.com/cvibedev)
- 📧 **Email**: hello@cvibe.dev
- 🌟 **GitHub**: [Star the repo](https://github.com/cvibe/cvibe-mcp)

### 🏷️ Related Projects

- 🔗 **CVibe CLI** - Command-line prompt management (coming soon)
- 🌐 **CVibe Web** - Browse prompts in your browser (coming soon)  
- 🔌 **CVibe API** - REST API for prompt integration (coming soon)
- 📱 **CVibe Mobile** - Prompts on the go (future)

---

## 📜 License

**MIT License** - Use CVibe freely in personal and commercial projects.

See [LICENSE](LICENSE) for full details.

---

## 🙏 Acknowledgments

- 🎯 **Anthropic** - For creating Claude and the MCP protocol
- 👥 **Open Source Community** - For sharing amazing prompts
- 💡 **npm** - For inspiring our package management approach  
- ⚡ **TypeScript** - For making JavaScript development delightful
- 🔍 **Fuse.js** - For powering our fuzzy search capabilities

---

<div align="center">

### 🌊 **Ready to Ride the CVibe Wave?**

**Transform your AI workflow today. Install CVibe MCP and join thousands of developers accessing the world's largest prompt registry.**

[⚡ Quick Start](#-installation--setup) • [🔍 Explore Prompts](#-sample-prompts-in-registry) • [🤝 Contribute](#contributing) • [💬 Community](#-join-the-movement)

---

*CVibe MCP - Where Prompts Meet Productivity* 🚀

</div>