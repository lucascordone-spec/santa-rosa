FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages/core/package*.json ./packages/core/
COPY packages/api/package*.json ./packages/api/
RUN npm ci --ignore-scripts || npm install
COPY . .
RUN npm run build --workspaces || true

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app ./
EXPOSE 3000
CMD ["node", "packages/api/dist/server.js"]
