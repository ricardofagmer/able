FROM node:18-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package*.json nx.json tsconfig.base.json pnpm-lock.yaml ./
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm nx build web
EXPOSE 3000
CMD ["pnpm", "nx", "serve", "web"]