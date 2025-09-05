#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import Fuse from 'fuse.js';
import axios from 'axios';
import { 
  PROMPT_CATEGORIES, 
  type Prompt, 
  type PromptCategory
} from './data/prompts.js';

// API Configuration  
const API_BASE_URL = process.env.CVIBE_API_URL || 'http://localhost:3000/api/v1';
const API_TIMEOUT = 10000; // 10 seconds

// Configure axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'cvibe-mcp/1.0.0'
  }
});

// API response interfaces
interface ApiPromptResponse {
  id: string;
  name: string;
  readme: string; // Descriptive text explaining how to use the prompt
  content: {
    prompt: string; // The actual prompt text
    version: string;
    license: string;
    author: string;
    cvibe: {
      kind: string;
      category: string;
      difficulty: 'beginner' | 'intermediate' | 'advanced';
      tags: string[];
      rating: number;
      framework?: string;
      language?: string;
      models: {
        recommended: string[];
        compatible: string[];
      };
      inputs: Array<{
        name: string;
        type: string;
        required: boolean;
        description: string;
      }>;
      quality: {
        success_rate: number;
        last_verified: string;
      };
    };
    description: string;
    originalId?: string;
    sourceUrl?: string;
    type: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ApiPromptsListResponse {
  prompts: ApiPromptResponse[];
  total: number;
  limit: number;
  offset: number;
}

// Convert API response to our Prompt interface
function convertApiPromptToPrompt(apiPrompt: ApiPromptResponse): Prompt {
  const cvibe = apiPrompt.content.cvibe;
  return {
    id: apiPrompt.id,
    name: apiPrompt.name,
    description: apiPrompt.content.description || '',
    content: apiPrompt.content.prompt, // The actual prompt text
    category: cvibe.category,
    tags: cvibe.tags || [],
    author: apiPrompt.content.author || 'Anonymous',
    version: apiPrompt.content.version || '1.0.0',
    downloads: Math.floor(cvibe.quality.success_rate * 10000), // Simulate downloads based on success rate
    rating: cvibe.rating || 0,
    language: cvibe.language,
    framework: cvibe.framework,
    difficulty: cvibe.difficulty || 'beginner',
    createdAt: apiPrompt.createdAt,
    updatedAt: apiPrompt.updatedAt,
    license: apiPrompt.content.license || 'MIT'
  };
}

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
🆔 ID: \`${prompt.id}\`
`;
}

async function formatPromptFull(promptId: string): Promise<string> {
  try {
    // Get the full API response to access both readme and content
    const response = await apiClient.get<ApiPromptResponse>(`/prompts/${promptId}`);
    const apiPrompt = response.data;
    const prompt = convertApiPromptToPrompt(apiPrompt);
    
    return `# ${prompt.name} v${prompt.version}

## Usage Guide
${apiPrompt.readme}

## Metadata
- **Author**: ${prompt.author}
- **Category**: ${prompt.category}
- **Difficulty**: ${prompt.difficulty}
- **Rating**: ${prompt.rating}/5 (${prompt.downloads.toLocaleString()} simulated downloads)
- **Tags**: ${prompt.tags.join(', ')}
- **Language**: ${prompt.language || 'N/A'}
- **Framework**: ${prompt.framework || 'N/A'}
- **License**: ${prompt.license}
- **Created**: ${new Date(prompt.createdAt).toLocaleDateString()}
- **Updated**: ${new Date(prompt.updatedAt).toLocaleDateString()}

## Model Compatibility
- **Recommended**: ${apiPrompt.content.cvibe.models.recommended.join(', ')}
- **Compatible**: ${apiPrompt.content.cvibe.models.compatible.join(', ')}

## Required Inputs
${apiPrompt.content.cvibe.inputs.length > 0 
  ? apiPrompt.content.cvibe.inputs.map(input => 
      `- **{${input.name}}** (${input.type}): ${input.description}`
    ).join('\n')
  : 'No additional inputs required'}

## Quality Metrics
- **Success Rate**: ${(apiPrompt.content.cvibe.quality.success_rate * 100).toFixed(1)}%
- **Last Verified**: ${apiPrompt.content.cvibe.quality.last_verified}

## Prompt Content
\`\`\`
${prompt.content}
\`\`\`

---
*Prompt ID: ${prompt.id}*
*Use 'cvibe install ${prompt.id}' to add this to your toolkit!*
*Powered by CVibe API - The npm for prompts*
`;
  } catch (error) {
    throw error; // Re-throw to be handled by the calling function
  }
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
    // Build query parameters
    const params: any = {
      limit: Math.min(limit, 50), // Cap at 50 for performance
      offset: 0
    };

    if (query && query.trim()) {
      params.search = query.trim();
    }

    // Make API call to get prompts
    const response = await apiClient.get<ApiPromptsListResponse>('/prompts', { params });
    let results = response.data.prompts.map(convertApiPromptToPrompt);

    // Apply client-side filters (since API doesn't support all filters yet)
    if (category && PROMPT_CATEGORIES.includes(category as PromptCategory)) {
      results = results.filter(p => p.category === category);
    }

    if (difficulty) {
      results = results.filter(p => p.difficulty === difficulty);
    }

    if (minRating !== undefined) {
      results = results.filter(p => p.rating >= minRating);
    }

    // Sort by rating since we don't have download counts yet
    results = results
      .sort((a, b) => b.rating - a.rating)
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
    
    return `Found ${results.length} prompt${results.length === 1 ? '' : 's'} (from ${response.data.total} total):

${formatted}

💡 Use 'cvibe get <prompt-id>' to view the full prompt content!
📋 Copy the ID from the results above (e.g., \`${results[0]?.id || 'prompt-id'}\`)`;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        return `❌ Cannot connect to CVibe API at ${API_BASE_URL}. Please ensure the API server is running.`;
      }
      return `❌ API Error: ${error.response?.data?.error || error.message}`;
    }
    return `Error searching prompts: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

async function getPrompt(promptId: string): Promise<string> {
  try {
    return await formatPromptFull(promptId);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return `❌ Prompt '${promptId}' not found.

💡 Try:
- 'cvibe search <keywords>' to find prompts
- 'cvibe popular' to see trending prompts
- 'cvibe categories' to browse by category`;
      }
      if (error.code === 'ECONNREFUSED') {
        return `❌ Cannot connect to CVibe API at ${API_BASE_URL}. Please ensure the API server is running.`;
      }
      return `❌ API Error: ${error.response?.data?.error || error.message}`;
    }
    return `Error retrieving prompt: ${error instanceof Error ? error.message : 'Unknown error'}`;
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