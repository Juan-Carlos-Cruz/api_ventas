# Build Stage
FROM node:18-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

COPY . .

RUN rm -rf node_modules package-lock.json
RUN uname -a && cat /etc/os-release
RUN npm install
RUN npx prisma generate
RUN npm run build

# Production Stage
FROM node:18-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD sh -c "npx prisma db push --accept-data-loss && npm start"
