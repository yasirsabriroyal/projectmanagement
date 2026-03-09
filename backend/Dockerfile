FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate
COPY tsconfig.json ./
COPY src ./src/
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
COPY prisma ./prisma/
COPY tsconfig.seed.json ./
RUN npm ci
RUN npx prisma generate
COPY --from=builder /app/dist ./dist
EXPOSE 4000
CMD ["sh", "-c", "set -e && npx prisma migrate deploy && if [ \"$RUN_SEED\" = 'true' ]; then npx ts-node --project tsconfig.seed.json prisma/seed.ts; fi && node dist/index.js"]
