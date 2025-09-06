#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { getServer } from './server.js';

// Configuration
const API_BASE_URL = process.env.CVIBE_API_URL || 'http://localhost:3000/api/v1';

// Parse command line arguments
const args = process.argv.slice(2);

// Tool implementations are now in tools.ts

// Create MCP server instance for stdio mode
const server = getServer();

// Start the server
async function main() {
  // Check if we should run in HTTP mode (for mcp-remote)
  const httpMode = process.env.MCP_HTTP_MODE === 'true' || args.includes('--http');
  const port = parseInt(process.env.PORT || '3001');

  if (httpMode) {
    // Streamable HTTP mode for remote access (Kubernetes deployment)
    const express = await import('express');
    const app = express.default();
    app.use(express.json());

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        service: 'cvibe-mcp',
        version: '1.0.0',
        apiUrl: API_BASE_URL,
        timestamp: new Date().toISOString()
      });
    });

    // MCP endpoint - stateless mode for concurrent clients
    app.post('/mcp', async (req, res) => {
      // In stateless mode, create a new instance of transport and server for each request
      // to ensure complete isolation. A single instance would cause request ID collisions
      // when multiple clients connect concurrently.
      
      try {
        // Create a new server instance for each request
        const requestServer = getServer();

        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: undefined,
        });
        
        res.on('close', () => {
          console.log('Request closed');
          transport.close();
          requestServer.close();
        });
        
        await requestServer.connect(transport);
        await transport.handleRequest(req, res, req.body);
      } catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
          res.status(500).json({
            jsonrpc: '2.0',
            error: {
              code: -32603,
              message: 'Internal server error',
            },
            id: null,
          });
        }
      }
    });

    // SSE notifications not supported in stateless mode
    app.get('/mcp', async (req, res) => {
      console.log('Received GET MCP request');
      res.writeHead(405).end(JSON.stringify({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Method not allowed."
        },
        id: null
      }));
    });

    // Session termination not needed in stateless mode
    app.delete('/mcp', async (req, res) => {
      console.log('Received DELETE MCP request');
      res.writeHead(405).end(JSON.stringify({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Method not allowed."
        },
        id: null
      }));
    });

    // Default response
    app.use((req, res) => {
      res.status(404).send('CVibe MCP Server - Use /mcp endpoint for MCP communication');
    });

    app.listen(port, () => {
      console.error(`🚀 CVibe MCP Server (Stateless Streamable HTTP mode) running on port ${port}`);
      console.error(`📡 Connected to API: ${API_BASE_URL}`);
      console.error(`🌐 MCP endpoint: http://localhost:${port}/mcp`);
      console.error(`💡 Use mcp-remote to connect from Cursor`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.error('🛑 Received SIGTERM, shutting down gracefully');
      process.exit(0);
    });

  } else {
    // Stdio mode for local Cursor integration
  const transport = new StdioServerTransport();
  await server.connect(transport);
    console.error('🚀 CVibe MCP Server (stdio mode) running - The npm for prompts is ready!');
    console.error(`📡 Connected to API: ${API_BASE_URL}`);
  }
}

main().catch((error) => {
  console.error('💥 Server error:', error);
  process.exit(1);
});