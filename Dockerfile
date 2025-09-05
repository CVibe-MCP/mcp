# Multi-stage Docker build for CVibe MCP Server (Remote)
FROM node:18-alpine AS base

# Install security updates and dumb-init
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Create app directory with proper permissions
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 -G nodejs

WORKDIR /app
RUN chown -R nodeuser:nodejs /app

# Copy package files
COPY --chown=nodeuser:nodejs package*.json ./

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

###########################################
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

###########################################
FROM base AS runtime

# Copy built application from build stage
COPY --from=build --chown=nodeuser:nodejs /app/dist ./dist

# Copy package.json for version info
COPY --chown=nodeuser:nodejs package.json ./

# Create non-root user for security
USER nodeuser

# Expose port for HTTP/SSE transport
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Use dumb-init for proper signal handling in Kubernetes
ENTRYPOINT ["dumb-init", "--"]

# Start the MCP server in HTTP mode
CMD ["node", "dist/index.js", "--http"]
