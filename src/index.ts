#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import Fuse from 'fuse.js';
import { 
  PROMPTS_REGISTRY, 
  PROMPT_CATEGORIES, 
  type Prompt, 
  type PromptCategory,
  searchPrompts,
  getPromptById,
  getPopularPrompts,
  getPromptsByCategory,
  getPromptsByAuthor
} from './data/prompts.js';

// Fuse.js configuration for advanced search
const fuseOptions = {
  keys: [
    { name: 'name', weight: 0.3 },
    { name: 'description', weight: 0.2 },
    { name: 'tags', weight: 0.2 },
    { name: 'category', weight: 0.1 },
    { name: 'author', weight: 0.1 },
    { name: 'content', weight: 0.1 }
  ],
  threshold: 0.4,
  includeScore: true,
  includeMatches: true
};

const fuse = new Fuse(PROMPTS_REGISTRY, fuseOptions);

// Helper functions
function formatPromptSummary(prompt: Prompt): string {
  return `🔥 **${prompt.name}** (v${prompt.version})
📝 ${prompt.description}
👤 By: ${prompt.author} | ⭐ ${prompt.rating}/5 | 📥 ${prompt.downloads.toLocaleString()} downloads
🏷️ Tags: ${prompt.tags.join(', ')}
📂 Category: ${prompt.category}
🎯 Difficulty: ${prompt.difficulty}
📅 Updated: ${new Date(prompt.updatedAt).toLocaleDateString()}
📄 License: ${prompt.license}
`;
}

function formatPromptFull(prompt: Prompt): string {
  return `# ${prompt.name} v${prompt.version}

## Description
${prompt.description}

## Metadata
- **Author**: ${prompt.author}
- **Category**: ${prompt.category}
- **Difficulty**: ${prompt.difficulty}
- **Rating**: ${prompt.rating}/5 (${prompt.downloads.toLocaleString()} downloads)
- **Tags**: ${prompt.tags.join(', ')}
- **Language**: ${prompt.language || 'N/A'}
- **Framework**: ${prompt.framework || 'N/A'}
- **License**: ${prompt.license}
- **Created**: ${new Date(prompt.createdAt).toLocaleDateString()}
- **Updated**: ${new Date(prompt.updatedAt).toLocaleDateString()}

## Prompt Content
\`\`\`
${prompt.content}
\`\`\`

---
*Prompt ID: ${prompt.id}*
*Use 'cvibe install ${prompt.id}' to add this to your toolkit!*
`;
}

// Tool implementations
async function searchPromptsAdvanced(
  query: string, 
  category?: string, 
  difficulty?: string,
  minRating?: number,
  limit: number = 10
): Promise<string> {
  try {
    let results: Prompt[] = [];

    if (query.trim()) {
      // Use Fuse.js for fuzzy search
      const fuseResults = fuse.search(query);
      results = fuseResults.map(result => result.item);
    } else {
      // If no query, get all prompts
      results = [...PROMPTS_REGISTRY];
    }

    // Apply filters
    if (category && PROMPT_CATEGORIES.includes(category as PromptCategory)) {
      results = results.filter(p => p.category === category);
    }

    if (difficulty) {
      results = results.filter(p => p.difficulty === difficulty);
    }

    if (minRating !== undefined) {
      results = results.filter(p => p.rating >= minRating);
    }

    // Sort by downloads (popularity) and limit
    results = results
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, limit);

    if (results.length === 0) {
      return `No prompts found matching your criteria.
      
Try:
- Different search terms
- Broader category selection
- Lower minimum rating
- Check available categories: ${PROMPT_CATEGORIES.join(', ')}`;
    }

    const formatted = results.map(formatPromptSummary).join('\n\n---\n\n');
    
    return `Found ${results.length} prompt${results.length === 1 ? '' : 's'}:

${formatted}

💡 Use 'cvibe get <prompt-id>' to view the full prompt content!`;
  } catch (error) {
    return `Error searching prompts: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

async function getPrompt(promptId: string): Promise<string> {
  try {
    const prompt = getPromptById(promptId);
    
    if (!prompt) {
      return `❌ Prompt '${promptId}' not found.

💡 Try:
- 'cvibe search <keywords>' to find prompts
- 'cvibe popular' to see trending prompts
- 'cvibe categories' to browse by category`;
    }

    return formatPromptFull(prompt);
  } catch (error) {
    return `Error retrieving prompt: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

async function getPopular(limit: number = 10): Promise<string> {
  try {
    const popular = getPopularPrompts(limit);
    const formatted = popular.map(formatPromptSummary).join('\n\n---\n\n');
    
    return `🔥 Top ${limit} Most Popular Prompts:

${formatted}`;
  } catch (error) {
    return `Error getting popular prompts: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

async function listCategories(): Promise<string> {
  try {
    const categoryStats = PROMPT_CATEGORIES.map(category => {
      const prompts = getPromptsByCategory(category);
      const avgRating = prompts.length > 0 
        ? (prompts.reduce((sum, p) => sum + p.rating, 0) / prompts.length).toFixed(1)
        : '0.0';
      
      return `📂 **${category}** (${prompts.length} prompts, avg ⭐${avgRating})`;
    });

    return `📚 Available Prompt Categories:

${categoryStats.join('\n')}

💡 Use 'cvibe search --category <category>' to browse prompts in a specific category!`;
  } catch (error) {
    return `Error listing categories: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

async function getAuthorPrompts(author: string): Promise<string> {
  try {
    const prompts = getPromptsByAuthor(author);
    
    if (prompts.length === 0) {
      return `❌ No prompts found by author '${author}'.
      
💡 Try searching for prompts to discover new authors!`;
    }

    const formatted = prompts.map(formatPromptSummary).join('\n\n---\n\n');
    
    return `👤 Prompts by ${author} (${prompts.length} total):

${formatted}`;
  } catch (error) {
    return `Error getting author prompts: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

async function getStats(): Promise<string> {
  try {
    const totalPrompts = PROMPTS_REGISTRY.length;
    const totalDownloads = PROMPTS_REGISTRY.reduce((sum, p) => sum + p.downloads, 0);
    const avgRating = PROMPTS_REGISTRY.reduce((sum, p) => sum + p.rating, 0) / totalPrompts;
    const authors = [...new Set(PROMPTS_REGISTRY.map(p => p.author))];
    const languages = [...new Set(PROMPTS_REGISTRY.map(p => p.language).filter(Boolean))];
    const frameworks = [...new Set(PROMPTS_REGISTRY.map(p => p.framework).filter(Boolean))];
    
    const categoryBreakdown = PROMPT_CATEGORIES.map(cat => {
      const count = PROMPTS_REGISTRY.filter(p => p.category === cat).length;
      return `  ${cat}: ${count}`;
    }).join('\n');

    return `📊 CVibe Registry Statistics:

🔢 **Total Prompts**: ${totalPrompts.toLocaleString()}
📥 **Total Downloads**: ${totalDownloads.toLocaleString()}
⭐ **Average Rating**: ${avgRating.toFixed(1)}/5
👥 **Contributors**: ${authors.length}
🗂️ **Categories**: ${PROMPT_CATEGORIES.length}

📂 **Prompts by Category**:
${categoryBreakdown}

💻 **Languages Covered**: ${languages.join(', ')}
🛠️ **Frameworks Supported**: ${frameworks.join(', ')}

🚀 *CVibe: The npm for prompts - Discover, Share, Innovate!*`;
  } catch (error) {
    return `Error getting statistics: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

// Create server instance
const server = new Server(
  {
    name: 'cvibe-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
const tools: Tool[] = [
  {
    name: 'cvibe_search',
    description: 'Search the CVibe prompt registry with advanced filters',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query (keywords, prompt name, description, etc.)',
        },
        category: {
          type: 'string',
          description: 'Filter by category',
          enum: [...PROMPT_CATEGORIES],
        },
        difficulty: {
          type: 'string',
          description: 'Filter by difficulty level',
          enum: ['beginner', 'intermediate', 'advanced'],
        },
        minRating: {
          type: 'number',
          description: 'Minimum rating (0-5)',
          minimum: 0,
          maximum: 5,
        },
        limit: {
          type: 'number',
          description: 'Maximum number of results to return',
          minimum: 1,
          maximum: 50,
          default: 10,
        },
      },
      required: [],
    },
  },
  {
    name: 'cvibe_get',
    description: 'Get the full content of a specific prompt by ID',
    inputSchema: {
      type: 'object',
      properties: {
        promptId: {
          type: 'string',
          description: 'The unique ID of the prompt to retrieve',
        },
      },
      required: ['promptId'],
    },
  },
  {
    name: 'cvibe_popular',
    description: 'Get the most popular prompts in the registry',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of popular prompts to return',
          minimum: 1,
          maximum: 50,
          default: 10,
        },
      },
      required: [],
    },
  },
  {
    name: 'cvibe_categories',
    description: 'List all available prompt categories with statistics',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'cvibe_author',
    description: 'Get all prompts by a specific author',
    inputSchema: {
      type: 'object',
      properties: {
        author: {
          type: 'string',
          description: 'The author username to search for',
        },
      },
      required: ['author'],
    },
  },
  {
    name: 'cvibe_stats',
    description: 'Get comprehensive statistics about the CVibe registry',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
];

// Set up request handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'cvibe_search': {
        const { query = '', category, difficulty, minRating, limit = 10 } = args as {
          query?: string;
          category?: string;
          difficulty?: string;
          minRating?: number;
          limit?: number;
        };
        const result = await searchPromptsAdvanced(query, category, difficulty, minRating, limit);
        return { content: [{ type: 'text', text: result }] };
      }

      case 'cvibe_get': {
        const { promptId } = args as { promptId: string };
        const result = await getPrompt(promptId);
        return { content: [{ type: 'text', text: result }] };
      }

      case 'cvibe_popular': {
        const { limit = 10 } = args as { limit?: number };
        const result = await getPopular(limit);
        return { content: [{ type: 'text', text: result }] };
      }

      case 'cvibe_categories': {
        const result = await listCategories();
        return { content: [{ type: 'text', text: result }] };
      }

      case 'cvibe_author': {
        const { author } = args as { author: string };
        const result = await getAuthorPrompts(author);
        return { content: [{ type: 'text', text: result }] };
      }

      case 'cvibe_stats': {
        const result = await getStats();
        return { content: [{ type: 'text', text: result }] };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return {
      content: [{ type: 'text', text: `❌ Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('🚀 CVibe MCP Server running - The npm for prompts is ready!');
}

main().catch((error) => {
  console.error('💥 Server error:', error);
  process.exit(1);
});