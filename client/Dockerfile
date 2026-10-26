# ==========================================
# 1. Frontend Client Builder (Vite + React)
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.28.8 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client/package.json ./client/

RUN pnpm install --frozen-lockfile --filter clean-architecture-client...

COPY client/ ./client/

WORKDIR /app/client
RUN pnpm run build

# ==========================================
# 2. Production Web Server (Nginx)
# ==========================================
FROM nginx:alpine AS runner

COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=5s --timeout=5s --retries=5 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
