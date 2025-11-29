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

# Build de la aplicación
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

# Copiar build desde el stage anterior
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 5001

# Comando para ejecutar la aplicación
CMD ["node", "dist/main.js"]
