# Stage 1: Install dependencies
FROM node:18-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

# # Stage 2: Build the app
FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

COPY --from=deps /app/node_modules ./node_modules

RUN npm run build

# Stage 3: Run the app
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "run", 'dev']
