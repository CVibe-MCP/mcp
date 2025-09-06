import { z } from 'zod';
import {
  PROMPT_CATEGORIES,
} from './data/prompts.js';

// Helper function to make API requests
async function makeApiRequest(endpoint: string, options: RequestInit = {}) {
  const API_BASE_URL = process.env.CVIBE_API_URL || 'http://localhost:3000/api/v1';
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
}

// Search prompts with advanced filtering
export async function searchPromptsAdvanced(
  query: string = '',
  category?: string,
  difficulty?: string,
  minRating?: number,
  limit: number = 10
): Promise<string> {
  try {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    if (minRating !== undefined) params.append('minRating', minRating.toString());
    params.append('limit', limit.toString());

    const data = await makeApiRequest(`/prompts/search?${params.toString()}`);
    
    if (!data.prompts || data.prompts.length === 0) {
      return 'No prompts found matching your criteria.';
    }

    let result = `Found ${data.prompts.length} prompt(s):\n\n`;
    
    data.prompts.forEach((prompt: any, index: number) => {
      result += `${index + 1}. **${prompt.name}** (ID: ${prompt.id})\n`;
      result += `   Author: ${prompt.author}\n`;
      result += `   Category: ${prompt.category}\n`;
      result += `   Difficulty: ${prompt.difficulty}\n`;
      result += `   Rating: ${prompt.rating || 'N/A'}/5\n`;
      result += `   Description: ${prompt.description}\n`;
      if (prompt.tags && prompt.tags.length > 0) {
        result += `   Tags: ${prompt.tags.join(', ')}\n`;
      }
      result += `   URL: ${prompt.url || 'N/A'}\n\n`;
    });

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return `❌ Error searching prompts: ${errorMessage}`;
  }
}

// Get a specific prompt by ID
export async function getPrompt(promptId: string): Promise<string> {
  try {
    const data = await makeApiRequest(`/prompts/${promptId}`);
    
    if (!data.prompt) {
      return `❌ Prompt with ID "${promptId}" not found.`;
    }

    const prompt = data.prompt;
    let result = `# ${prompt.name}\n\n`;
    result += `**ID:** ${prompt.id}\n`;
    result += `**Author:** ${prompt.author}\n`;
    result += `**Category:** ${prompt.category}\n`;
    result += `**Difficulty:** ${prompt.difficulty}\n`;
    result += `**Rating:** ${prompt.rating || 'N/A'}/5\n`;
    result += `**Description:** ${prompt.description}\n\n`;
    
    if (prompt.tags && prompt.tags.length > 0) {
      result += `**Tags:** ${prompt.tags.join(', ')}\n\n`;
    }
    
    if (prompt.language) {
      result += `**Language:** ${prompt.language}\n`;
    }
    if (prompt.framework) {
      result += `**Framework:** ${prompt.framework}\n`;
    }
    
    result += `\n**Content:**\n\`\`\`\n${prompt.content}\n\`\`\`\n`;
    
    if (prompt.url) {
      result += `\n**URL:** ${prompt.url}\n`;
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return `❌ Error retrieving prompt: ${errorMessage}`;
  }
}

// Initialize a new prompt package
export async function initializePromptPackage(
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
    const { writeFileSync } = await import('fs');
    
    const packageData = {
      name,
      author,
      description,
      category,
      difficulty,
      tags,
      license,
      language,
      framework,
      version: '1.0.0',
      createdAt: new Date().toISOString(),
    };

    const filename = 'cvibe-package.json';
    writeFileSync(filename, JSON.stringify(packageData, null, 2));

    return `✅ Prompt package initialized successfully!\n\n` +
           `📁 Created: ${filename}\n` +
           `📦 Package: ${name} v1.0.0\n` +
           `👤 Author: ${author}\n` +
           `📝 Description: ${description}\n` +
           `🏷️ Category: ${category}\n` +
           `⚡ Difficulty: ${difficulty}\n` +
           `🏷️ Tags: ${tags.join(', ')}\n` +
           `📄 License: ${license}\n` +
           `${language ? `💻 Language: ${language}\n` : ''}` +
           `${framework ? `🔧 Framework: ${framework}\n` : ''}\n` +
           `\nNext steps:\n` +
           `1. Add your prompt content to the package\n` +
           `2. Use cvibe_publish to publish it to the registry`;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return `❌ Error initializing package: ${errorMessage}`;
  }
}

// Publish a prompt package
export async function publishPromptPackage(packageFile?: string, packageContent?: string): Promise<string> {
  try {
    const { readFileSync } = await import('fs');
    
    let packageData;
    
    if (packageContent) {
      packageData = JSON.parse(packageContent);
    } else {
      const filename = packageFile || 'cvibe-package.json';
      const content = readFileSync(filename, 'utf-8');
      packageData = JSON.parse(content);
    }

    // Validate required fields
    const requiredFields = ['name', 'author', 'description', 'category', 'difficulty', 'tags', 'license'];
    const missingFields = requiredFields.filter(field => !packageData[field]);
    
    if (missingFields.length > 0) {
      return `❌ Missing required fields: ${missingFields.join(', ')}`;
    }

    // Add prompt content if not present
    if (!packageData.content) {
      packageData.content = `# ${packageData.name}\n\n${packageData.description}\n\n<!-- Add your prompt content here -->`;
    }

    // Publish to API
    const response = await makeApiRequest('/prompts', {
      method: 'POST',
      body: JSON.stringify(packageData),
    });

    return `✅ Prompt package published successfully!\n\n` +
           `📦 Package: ${packageData.name} v${packageData.version}\n` +
           `🆔 ID: ${response.prompt?.id || 'N/A'}\n` +
           `🌐 URL: ${response.prompt?.url || 'N/A'}\n\n` +
           `Your prompt is now available in the CVibe registry!`;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return `❌ Error publishing package: ${errorMessage}`;
  }
}

// Tool definitions with schemas
export const toolDefinitions = {
  cvibe_search: {
    title: 'Search Prompts',
    description: 'Search the CVibe prompt registry with advanced filters',
    inputSchema: {
      query: z.string().optional().describe('Search query (keywords, prompt name, description, etc.)'),
      category: z.enum([...PROMPT_CATEGORIES] as [string, ...string[]]).optional().describe('Filter by category'),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional().describe('Filter by difficulty level'),
      minRating: z.number().min(0).max(5).optional().describe('Minimum rating (0-5)'),
      limit: z.number().min(1).max(50).default(10).describe('Maximum number of results to return'),
    },
  },
  cvibe_get: {
    title: 'Get Prompt',
    description: 'Get the full content of a specific prompt by ID',
    inputSchema: {
      promptId: z.string().describe('The unique ID of the prompt to retrieve'),
    },
  },
  cvibe_init: {
    title: 'Initialize Package',
    description: 'Initialize a new prompt package for CVibe registry',
    inputSchema: {
      name: z.string().describe('Package name (e.g., "my-awesome-prompt")'),
      author: z.string().describe('Author name'),
      description: z.string().describe('Brief description of what this prompt does'),
      category: z.enum([...PROMPT_CATEGORIES] as [string, ...string[]]).describe('Prompt category'),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).describe('Difficulty level'),
      tags: z.array(z.string()).describe('Array of tags (e.g., ["react", "typescript"])'),
      license: z.string().describe('License (e.g., "MIT", "Apache-2.0", "GPL-3.0")'),
      language: z.string().optional().describe('Programming language (optional)'),
      framework: z.string().optional().describe('Framework (optional)'),
    },
  },
  cvibe_publish: {
    title: 'Publish Package',
    description: 'Publish a prompt package to the CVibe registry',
    inputSchema: {
      packageFile: z.string().optional().describe('Path to the package JSON file (optional, defaults to "cvibe-package.json")'),
      packageContent: z.string().optional().describe('Direct JSON content of the package (alternative to packageFile)'),
    },
  },
};
