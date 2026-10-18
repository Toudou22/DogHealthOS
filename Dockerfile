# Stage 1: Build & Dependencies
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production Minimal Runtime
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Security: Run as non-root user
USER node

# Copy package descriptors and production-only dependencies
COPY --chown=node:node package*.json ./
RUN npm ci --only=production

# Copy pre-compiled server and client bundles
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/server.ts ./server.ts
COPY --chown=node:node --from=builder /app/public ./public

EXPOSE 3000

# Start server using tsx or bundled node script
CMD ["node", "dist/server.cjs"]
