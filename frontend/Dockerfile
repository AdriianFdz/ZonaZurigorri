# force to reload the cache
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de dependencias
COPY package.json ./
COPY pnpm-lock.yaml* ./

# Instalar dependencias
RUN pnpm install

# Copiar código fuente
COPY . .

# Build de Next.js
RUN pnpm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de dependencias
COPY package.json ./
COPY pnpm-lock.yaml* ./

# Instalar solo dependencias de producción
RUN pnpm install --prod

# Copiar build y archivos necesarios
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# Variables de entorno para Next.js
ENV NODE_ENV=production
ENV PORT=3000

# Exponer puerto
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["pnpm", "run", "start"]
