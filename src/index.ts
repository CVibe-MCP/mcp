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
import { writeFileSync } from 'fs';
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
    downloads: 0, // No download tracking in current DB
    rating: 0,
    language: cvibe.language,
    framework: cvibe.framework,
    difficulty: cvibe.difficulty || 'beginner',
    createdAt: apiPrompt.createdAt,
    updatedAt: apiPrompt.updatedAt,
    license: apiPrompt.content.license || 'MIT'
  };
}




// Helper function to generate AI-powered model recommendation snippet for prompt content
function generateAIModelRecommendationSnippet(models: { recommended: string[], compatible: string[] }): string {
  if (models.recommended.length === 0 && models.compatible.length === 0) {
    return '';
  }
  
  const recommended = models.recommended.join(', ');
  const compatible = models.compatible.join(', ');
  
  let snippet = '\n\n--- AI AGENT MODEL CHECK ---\n';
  snippet += 'Before proceeding with this prompt, please check what model you are running on and provide a model recommendation to the user:\n\n';
  
  if (models.recommended.length > 0) {
    snippet += `RECOMMENDED MODELS: ${recommended}\n`;
    snippet += `COMPATIBLE MODELS: ${compatible.length > 0 ? compatible : 'Any model (not optimal)'}\n\n`;
    snippet += 'Instructions for AI agent:\n';
    snippet += '1. Check what model you are currently running on\n';
    snippet += '2. If you are one of the RECOMMENDED models, tell the user: "✅ Perfect! You are using [YOUR_MODEL_NAME], which is optimized for this prompt."\n';
    snippet += '3. If you are one of the COMPATIBLE models (but not recommended), tell the user: "⚠️ You are using [YOUR_MODEL_NAME]. This prompt will work, but for optimal results consider switching to: [RECOMMENDED_MODELS]"\n';
    snippet += '4. If you are not in either list, tell the user: "🚨 WARNING: You are using [YOUR_MODEL_NAME]. This prompt is optimized for: [RECOMMENDED_MODELS]. Results may be suboptimal with your current model."\n';
  } else {
    snippet += `COMPATIBLE MODELS: ${compatible}\n\n`;
    snippet += 'Instructions for AI agent:\n';
    snippet += '1. Check what model you are currently running on\n';
    snippet += '2. If you are one of the COMPATIBLE models, tell the user: "✅ You are using [YOUR_MODEL_NAME], which is compatible with this prompt."\n';
    snippet += '3. If you are not in the compatible list, tell the user: "⚠️ You are using [YOUR_MODEL_NAME]. This prompt is tested with: [COMPATIBLE_MODELS]. Results may vary with your current model."\n';
  }
  
  snippet += '5. Always provide this model compatibility check at the beginning of your response before executing the main prompt.\n';
  snippet += '--- END MODEL CHECK ---\n\n';
  
  return snippet;
}

// Helper functions
function formatPromptSummary(prompt: Prompt): string {
  return `🔥 **${prompt.name}** (v${prompt.version})
📝 ${prompt.description}
👤 By: ${prompt.author}
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
    
    // Simple model information display
    const models = apiPrompt.content.cvibe.models;
    const hasRecommendedModels = models.recommended.length > 0;
    
    let modelInfo = '';
    if (hasRecommendedModels) {
      modelInfo = `

## 🎯 Model Compatibility
**Recommended models:** ${models.recommended.join(', ')}
${models.compatible.length > 0 ? `**Compatible models:** ${models.compatible.join(', ')}` : ''}

`;
    } else if (models.compatible.length > 0) {
      modelInfo = `

## 🎯 Model Compatibility
**Compatible models:** ${models.compatible.join(', ')}

`;
    }
    
    return `# ${prompt.name} v${prompt.version}${modelInfo}

## Usage Guide
${apiPrompt.readme}

## Metadata
- **Author**: ${prompt.author}
- **Category**: ${prompt.category}
- **Difficulty**: ${prompt.difficulty}
- **Downloads**: Not tracked in current version
- **Tags**: ${prompt.tags.join(', ')}
- **Language**: ${prompt.language || 'N/A'}
- **Framework**: ${prompt.framework || 'N/A'}
- **License**: ${prompt.license}
- **Created**: ${new Date(prompt.createdAt).toLocaleDateString()}
- **Updated**: ${new Date(prompt.updatedAt).toLocaleDateString()}

## Required Inputs
${apiPrompt.content.cvibe.inputs.length > 0 
  ? apiPrompt.content.cvibe.inputs.map(input => 
      `- **{${input.name}}** (${input.type}): ${input.description}`
    ).join('\n')
  : 'No additional inputs required'}

## Prompt Content
\`\`\`
${prompt.content}${generateAIModelRecommendationSnippet(apiPrompt.content.cvibe.models)}
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

// Initialize prompt package function
async function initializePromptPackage(
  name: string,
  author: string, 
  description: string,
  category: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  tags: string[],
  license: string,
  language?: string,
  framework?: string
): Promise<string> {
  try {
    // Create the package structure based on the API schema
    const packageData = {
      name: name,
      readme: `# ${name}\n\n${description}\n\n## How to use\n\n1. Replace {input} with your content\n2. Run with your favorite AI model\n3. Enjoy the results!\n\n*Made by ${author}*`,
      content: {
        cvibe: {
          tags: tags,
          inputs: [
            {
              name: 'input',
              type: 'string', 
              required: true,
              description: 'Your main input - customize this!'
            }
          ],
          models: {
            compatible: [],
            recommended: []
          },
          category: category,
          language: language,
          framework: framework,
          difficulty: difficulty
        },
        author: author,
        prompt: 'You are a helpful assistant. Please help with: {input}',
        license: license,
        description: description
      }
    };

    // Generate the package file content
    const packageJson = JSON.stringify(packageData, null, 2);
    
    // Write the file to disk
    const filename = 'cvibe-package.json';
    try {
      writeFileSync(filename, packageJson, 'utf8');
    } catch (writeError) {
      throw new Error(`Failed to create ${filename}: ${writeError instanceof Error ? writeError.message : 'Unknown error'}`);
    }
    
    return `🎉 **${name}** initialized!

📁 **cvibe-package.json** created successfully
👤 ${author} • 📂 ${category} • 🎯 ${difficulty}${language ? ` • 🔤 ${language}` : ''}${framework ? ` • 🚀 ${framework}` : ''}

**Next steps:**
1. **Edit your prompt** - Replace the default prompt text in cvibe-package.json
2. **Add inputs** - Define what variables your prompt needs  
3. **Pick models** - Add compatible AI models
4. **Publish** - \`cvibe publish\` when ready

✅ **File created:** \`cvibe-package.json\` is ready for editing!`;
  } catch (error) {
    throw error;
  }
}

// Publish prompt package function
async function publishPromptPackage(
  packageFile?: string,
  packageContent?: string
): Promise<string> {
  try {
    let packageData: any;
    
    if (packageContent) {
      // Parse the provided JSON content
      try {
        packageData = JSON.parse(packageContent);
      } catch (parseError) {
        throw new Error('Invalid JSON format in packageContent');
      }
    } else {
      // Use default file or provided file path
      const filePath = packageFile || 'cvibe-package.json';
      throw new Error(`Reading files is not supported in MCP context. Please provide the package content directly using the 'packageContent' parameter instead of 'packageFile'.

To publish your package:
1. Copy the content of your ${filePath} file
2. Use cvibe_publish with packageContent parameter containing the JSON content`);
    }

    // Validate required fields match API schema
    if (!packageData.name || !packageData.readme || !packageData.content) {
      throw new Error('Package must contain "name", "readme", and "content" fields');
    }

    const { content } = packageData;
    if (!content.cvibe || !content.author || !content.prompt || !content.description) {
      throw new Error('Package content must contain "cvibe", "author", "prompt", and "description" fields');
    }

    const { cvibe } = content;
    if (!cvibe.tags || !cvibe.models || !cvibe.category || !cvibe.difficulty) {
      throw new Error('CVibe metadata must contain "tags", "models", "category", and "difficulty" fields');
    }

    // Make API call to publish the prompt
    const response = await apiClient.post('/prompts', packageData);
    
    if (response.status === 201) {
      const publishedPrompt = response.data;
      return `🎉 Prompt published successfully!

📦 **${publishedPrompt.name}**
🆔 ID: \`${publishedPrompt.id}\`
👤 Author: ${publishedPrompt.content.author}
📂 Category: ${publishedPrompt.content.cvibe.category}
🎯 Difficulty: ${publishedPrompt.content.cvibe.difficulty}
📅 Published: ${new Date(publishedPrompt.createdAt).toLocaleDateString()}

✅ Your prompt is now live in the CVibe registry!
🔍 Users can find it with: \`cvibe search ${publishedPrompt.name}\`
📋 Or get it directly with: \`cvibe get ${publishedPrompt.id}\`

🌟 Share your prompt ID: **${publishedPrompt.id}**`;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        return `❌ Cannot connect to CVibe API at ${API_BASE_URL}. Please ensure the API server is running.`;
      }
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        return `❌ Validation Error: ${errorData.message || 'Invalid package format'}

Please check your package structure and ensure all required fields are properly filled.`;
      }
      return `❌ API Error: ${error.response?.data?.error || error.message}`;
    }
    return `❌ Error publishing prompt: ${error instanceof Error ? error.message : 'Unknown error'}`;
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
    let apiResults = response.data.prompts; // Keep original API results for model data

    // Apply client-side filters (since API doesn't support all filters yet)
    if (category && PROMPT_CATEGORIES.includes(category as PromptCategory)) {
      results = results.filter((p, i) => {
        const keep = p.category === category;
        if (!keep) {
          apiResults.splice(i, 1);
        }
        return keep;
      });
    }

    if (difficulty) {
      results = results.filter((p, i) => {
        const keep = p.difficulty === difficulty;
        if (!keep) {
          apiResults.splice(i, 1);
        }
        return keep;
      });
    }

    if (minRating !== undefined) {
      results = results.filter((p, i) => {
        const keep = p.rating >= minRating;
        if (!keep) {
          apiResults.splice(i, 1);
        }
        return keep;
      });
    }

    // Sort by created date (newest first)
    const sortedIndices = results
      .map((p, i) => ({ prompt: p, apiPrompt: apiResults[i], index: i }))
      .sort((a, b) => new Date(b.prompt.createdAt).getTime() - new Date(a.prompt.createdAt).getTime())
      .slice(0, limit);

    results = sortedIndices.map(item => item.prompt);
    apiResults = sortedIndices.map(item => item.apiPrompt);

    if (results.length === 0) {
      return `No prompts found matching your criteria.
      
Try:
- Different search terms
- Broader category selection
- Lower minimum rating
- Check available categories: ${PROMPT_CATEGORIES.join(', ')}`;
    }

    let modelNotice = '';

    const formatted = results.map(prompt => 
      formatPromptSummary(prompt)
    ).join('\n\n---\n\n');
    
    return `Found ${results.length} prompt${results.length === 1 ? '' : 's'} (from ${response.data.total} total):
${modelNotice}
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
  {
    name: 'cvibe_init',
    description: 'Initialize a new prompt package for CVibe registry',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Package name (e.g., "my-awesome-prompt")',
        },
        author: {
          type: 'string',
          description: 'Author name',
        },
        description: {
          type: 'string',
          description: 'Brief description of what this prompt does',
        },
        category: {
          type: 'string',
          description: 'Prompt category',
          enum: ['code-generation', 'debugging', 'documentation', 'testing', 'refactoring', 'architecture', 'security', 'performance', 'ui-ux', 'data-analysis', 'devops', 'api-design', 'database', 'mobile', 'web', 'machine-learning', 'general'],
        },
        difficulty: {
          type: 'string',
          description: 'Difficulty level',
          enum: ['beginner', 'intermediate', 'advanced'],
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of tags (e.g., ["react", "typescript"])',
        },
        language: {
          type: 'string',
          description: 'Programming language (optional)',
        },
        framework: {
          type: 'string',
          description: 'Framework (optional)',
        },
        license: {
          type: 'string',
          description: 'License (e.g., "MIT", "Apache-2.0", "GPL-3.0")',
        },
      },
      required: ['name', 'author', 'description', 'category', 'difficulty', 'tags', 'license'],
    },
  },
  {
    name: 'cvibe_publish',
    description: 'Publish a prompt package to the CVibe registry',
    inputSchema: {
      type: 'object',
      properties: {
        packageFile: {
          type: 'string',
          description: 'Path to the package JSON file (optional, defaults to "cvibe-package.json")',
        },
        packageContent: {
          type: 'string',
          description: 'Direct JSON content of the package (alternative to packageFile)',
        },
      },
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

      case 'cvibe_init': {
        const { name, author, description, category, difficulty, tags, license, language, framework } = args as {
          name: string;
          author: string;
          description: string;
          category: string;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          tags: string[];
          license: string;
          language?: string;
          framework?: string;
        };
        const result = await initializePromptPackage(name, author, description, category, difficulty, tags, license, language, framework);
        return { content: [{ type: 'text', text: result }] };
      }

      case 'cvibe_publish': {
        const { packageFile, packageContent } = args as {
          packageFile?: string;
          packageContent?: string;
        };
        const result = await publishPromptPackage(packageFile, packageContent);
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