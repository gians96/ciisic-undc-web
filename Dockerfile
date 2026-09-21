# Multi-stage build: Bun solo instala dependencias; Nuxt corre con Node.js
# (con `bun --bun`, nuxt prepare se quedaba colgado en el servidor de Dokploy)
FROM node:22-slim AS builder
WORKDIR /app

# Binario de Bun (misma versión que el CI) para leer bun.lock
COPY --from=oven/bun:1.4.2 /usr/local/bin/bun /usr/local/bin/bun

# Build no interactivo: evita prompts de nuxi/telemetría
ENV CI=true
ENV NUXT_TELEMETRY_DISABLED=1

# Copy package files
COPY package.json bun.lock ./

# Install dependencies with Bun.
# --ignore-scripts: el postinstall (nuxt prepare) se ejecuta más abajo,
# cuando el proyecto ya está copiado; aquí solo correría en una carpeta vacía.
RUN bun install --frozen-lockfile --ignore-scripts

# Copy the entire project
COPY . .

# Prepare and build with Node.js
RUN node_modules/.bin/nuxt prepare
RUN node_modules/.bin/nuxt build

# Production stage with Node.js
FROM node:22-alpine AS production
WORKDIR /app

# Copy the built application from builder stage
COPY --from=builder /app/.output ./.output

# Runtime environment variables (las críticas las establece Dokploy en runtime)
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Expose port
EXPOSE 3000/tcp

# Run the app with Node.js
CMD ["node", ".output/server/index.mjs"]
