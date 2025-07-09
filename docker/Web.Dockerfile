FROM node:18-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package*.json nx.json tsconfig.base.json pnpm-lock.yaml ./
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm nx build web

FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Copy the static export files
COPY --from=builder /app/dist/apps/web ./

RUN sed -i '/^user nginx;/d' /etc/nginx/nginx.conf
RUN sed -i 's|pid\s\+.*;|pid /tmp/nginx.pid;|' /etc/nginx/nginx.conf

RUN printf 'client_body_temp_path /tmp/client_temp;\n\
proxy_temp_path /tmp/proxy_temp;\n\
fastcgi_temp_path /tmp/fastcgi_temp;\n\
uwsgi_temp_path /tmp/uwsgi_temp;\n\
scgi_temp_path /tmp/scgi_temp;\n' > /etc/nginx/conf.d/nginx-temp-paths.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
