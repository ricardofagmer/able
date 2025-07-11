FROM node:20-alpine AS deps
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod && \
    pnpm i && \
    rm -rf /root/.pnpm-store

FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm nx run-many --target=build --all --prod

FROM node:20-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm && \
    pnpm add tslib

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/api/auth ./dist
COPY --from=builder /app/dist/libs ./dist

EXPOSE 3000
CMD ["sh", "-c", "node ./dist/main.js"]
