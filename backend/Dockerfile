# Imagen base
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiar dependencias primero (cache de capas)
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar el resto del código
COPY src/ ./src/

# Variables de entorno por defecto
ENV PORT=4000
ENV NODE_ENV=production

# Exponer puerto
EXPOSE 4000

# Comando de inicio
CMD ["node", "src/index.js"]
