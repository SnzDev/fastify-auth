FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

COPY . .

RUN pnpm install --frozen-lockfile


RUN pnpm build

FROM node:22-alpine

WORKDIR /app
# Instalação do openssl usada no 22-slim
# RUN apt-get update && apt-get install -y openssl libssl1.1 && rm -rf /var/lib/apt/lists/*

# Instalação do openssl usada no 22-alpine
RUN apk add --no-cache openssl libssl3

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3333
CMD ["node", "dist/index.js"]

