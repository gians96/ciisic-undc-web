# syntax=docker/dockerfile:1
# Multi-stage: Bun solo instala dependencias; Nuxt se prepara y compila con Node.js
# (con `bun --bun`, nuxt prepare se quedaba colgado en el servidor de Dokploy).
#
# Decisiones de estabilidad (no cambiar sin probar el despliegue en Dokploy):
# - Builder y runtime usan la MISMA familia base (node:22-slim, Debian/glibc).
#   Mezclar slim -> alpine exponía el runtime a incompatibilidades con módulos nativos.
# - El token del evento (NUXT_BACKEND_EVENT_TOKEN) solo existe en runtime (Dokploy):
#   nunca se copia .env ni secretos a la imagen (ver .dockerignore).
# - El build no necesita variables: runtimeConfig.backend* quedan vacías y Nitro
#   las completa en arranque con NUXT_BACKEND_BASE_URL y NUXT_BACKEND_EVENT_TOKEN.

# ------------------------------------------------------------------ builder --
FROM node:22-slim AS builder
WORKDIR /app

# Binario de Bun (misma versión que el CI: .github/workflows/ci.yml) para leer bun.lock
COPY --from=oven/bun:1.4.2 /usr/local/bin/bun /usr/local/bin/bun

# Build no interactivo: evita prompts de nuxi/telemetría
ENV CI=true
ENV NUXT_TELEMETRY_DISABLED=1

# Solo manifiestos primero: esta capa se reutiliza mientras no cambien dependencias
COPY package.json bun.lock ./

# Install dependencies with Bun (caché de descargas entre builds vía BuildKit).
# --ignore-scripts: el postinstall (nuxt prepare) se ejecuta más abajo,
# cuando el proyecto ya está copiado; aquí solo correría en una carpeta vacía.
RUN --mount=type=cache,target=/root/.bun/install/cache,sharing=locked \
    bun install --frozen-lockfile --ignore-scripts

# Ahora sí, el código fuente. El .dockerignore deja fuera docs/tests/.git para que
# el contexto sea pequeño y esta capa solo se invalide con cambios reales.
COPY . .

# Prepare and build with Node.js (misma toolchain que el CI y producción)
RUN node_modules/.bin/nuxt prepare
RUN node_modules/.bin/nuxt build

# --------------------------------------------------------------- production --
FROM node:22-slim AS production
WORKDIR /app

# Init mínimo como PID 1: reenvía SIGTERM/SIGINT a Node (apagados limpios en
# Dokploy) y evita procesos zombies. Capa pequeña, sin daemons extra.
RUN apt-get update \
    && apt-get install -y --no-install-recommends tini \
    && rm -rf /var/lib/apt/lists/*

# Runtime environment variables (las críticas las establece Dokploy en runtime)
ENV NODE_ENV=production
ENV NUXT_TELEMETRY_DISABLED=1
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# .output de Nuxt es autocontenido: no necesita node_modules ni el código fuente.
# --chown para correr como usuario sin privilegios (ver USER node).
COPY --from=builder --chown=node:node /app/.output ./.output

USER node

# Expose port
EXPOSE 3000

# /api/health no llama al backend: solo confirma que Nitro arrancó y responde.
# Usa node -e con fetch global para no depender de curl/wget en la imagen.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

ENTRYPOINT ["tini", "--"]

# Expose port
EXPOSE 3000/tcp

# Run the app with Node.js
CMD ["node", ".output/server/index.mjs"]
