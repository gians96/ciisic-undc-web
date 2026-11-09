# Multi-stage: Bun solo instala dependencias; Nuxt se prepara y compila con Node.js
#
# Rama histórica ciisic-7 (VII CIISIC 2025). Único cambio sobre el commit 206333e (PR #56):
# el servidor de Dokploy no tiene SSE4.2 y la etiqueta móvil `oven/bun:1` fallaba con
# «this CPU is missing SSE4.2 support, which Bun requires» (exit 134). Por eso se usa el
# mismo binario fijo de Bun (1.4.2) que la landing de main, y nuxt prepare/build corren con
# Node.js (con `bun --bun`, nuxt prepare se colgaba en Dokploy). El código no se toca.
FROM node:22-slim AS builder
WORKDIR /app

# Binario de Bun fijado (misma versión que main): solo se usa para respetar bun.lock
COPY --from=oven/bun:1.4.2 /usr/local/bin/bun /usr/local/bin/bun

# Build no interactivo: evita prompts de nuxi/telemetría
ENV CI=true
ENV NUXT_TELEMETRY_DISABLED=1

# Copy package files
COPY package.json bun.lock* ./

# Install dependencies with Bun. --ignore-scripts: el postinstall (nuxt prepare)
# se ejecuta más abajo, cuando el proyecto ya está copiado.
RUN bun install --frozen-lockfile --ignore-scripts

# Copy the entire project
COPY . .

# Build arguments que Dokploy puede pasar durante el build
ARG API_BASE_URL
ARG NODE_ENV=production

# Set environment variables para el build (necesario para variables públicas de Nuxt)
ENV API_BASE_URL=$API_BASE_URL
ENV NODE_ENV=$NODE_ENV

# Debug: mostrar qué variables están disponibles durante el build
RUN echo "🔍 BUILD-TIME Environment Variables:" && \
    echo "API_BASE_URL: ${API_BASE_URL:-NOT_SET}" && \
    echo "NODE_ENV: ${NODE_ENV:-NOT_SET}"

# Prepare and build with Node.js
RUN node_modules/.bin/nuxt prepare
RUN node_modules/.bin/nuxt build

# Production stage with Node.js
FROM node:22-alpine AS production
WORKDIR /app

# .output de Nuxt es autocontenido: no necesita node_modules ni el código fuente
# (se quita el `npm install --only=production`, que no aportaba nada y repetía la
# resolución de dependencias sin lockfile en cada build).
COPY --from=builder /app/.output ./.output

# Runtime environment variables (las críticas las establece Dokploy en runtime)
ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Expose port
EXPOSE 3000/tcp

# Run the app with Node.js
CMD ["node", ".output/server/index.mjs"]
