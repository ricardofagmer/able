FROM node:18-alpine
WORKDIR /app
RUN npm i -g corepack@latest
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package*.json nx.json tsconfig.base.json pnpm-lock.yaml ./
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm nx build web
EXPOSE 4200
CMD ["pnpm", "nx", "serve", "web"]