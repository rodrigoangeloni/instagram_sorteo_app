FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar solo package.json y package-lock.json para cacheo de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de la app
COPY . .

# Exponer puerto
EXPOSE 3000

# Ejecutar
CMD ["npm", "start"]
