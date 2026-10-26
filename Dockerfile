# ==========================================
# 1. Backend API Builder
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.28.8 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client/package.json ./client/

RUN pnpm install --frozen-lockfile --filter clean-architecture-reference

COPY tsconfig.json ./
COPY src/ ./src/

RUN pnpm run build

# ==========================================
# 2. Production Runner
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN corepack enable && corepack prepare pnpm@11.28.8 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile --filter clean-architecture-reference

COPY --from=builder /app/dist ./dist

EXPOSE 3000

HEALTHCHECK --interval=5s --timeout=5s --retries=5 --start-period=5s \
  CMD node -e "fetch('http://127.0.0.1:3000/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

CMD ["node", "dist/index.js"]
