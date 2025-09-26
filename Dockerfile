# Multi-stage build: Use Bun for building, Node.js for running
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies with Bun
RUN bun install --frozen-lockfile

# Copy the entire project
COPY . .

# Build arguments para variables públicas de entorno
ARG API_BASE_URL
ARG NODE_ENV=production

# Set environment variables para el proceso de build (solo las públicas)
ENV API_BASE_URL=$API_BASE_URL
ENV NODE_ENV=$NODE_ENV

# Prepare and build with Bun
RUN bun --bun run postinstall
RUN bun --bun run build

# Production stage with Node.js
FROM node:22-alpine AS production
WORKDIR /app

# Copy package.json for production dependencies
COPY package.json ./

# Install only production dependencies with npm
RUN npm install --only=production

# Copy the built application from builder stage
COPY --from=builder /app/.output ./.output

# Runtime environment variables (serán establecidas por Dokploy)
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Expose port
EXPOSE 3000/tcp

# Run the app with Node.js
CMD ["node", ".output/server/index.mjs"]