import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  searchPromptsAdvanced,
  getPrompt,
  initializePromptPackage,
  publishPromptPackage,
  toolDefinitions
} from './tools.js';

export function getServer(): McpServer {
  // Create MCP server instance
  const server = new McpServer({
    name: 'cvibe-mcp',
    version: '1.0.0',
  });

  // Register tools using the proper McpServer API
  server.registerTool(
    'cvibe_search',
    toolDefinitions.cvibe_search,
    async ({ query = '', category, difficulty, minRating, limit = 10 }) => {
      const result = await searchPromptsAdvanced(query, category, difficulty, minRating, limit);
      return { content: [{ type: 'text', text: result }] };
    }
  );

  server.registerTool(
    'cvibe_get',
    toolDefinitions.cvibe_get,
    async ({ promptId }) => {
      const result = await getPrompt(promptId);
      return { content: [{ type: 'text', text: result }] };
    }
  );

  server.registerTool(
    'cvibe_init',
    toolDefinitions.cvibe_init,
    async ({ name, author, description, category, difficulty, tags, license, language, framework }) => {
      const result = await initializePromptPackage(name, author, description, category, difficulty, tags, license, language, framework);
      return { content: [{ type: 'text', text: result }] };
    }
  );

  server.registerTool(
    'cvibe_publish',
    toolDefinitions.cvibe_publish,
    async ({ packageFile, packageContent }) => {
      const result = await publishPromptPackage(packageFile, packageContent);
      return { content: [{ type: 'text', text: result }] };
    }
  );

  return server;
}
