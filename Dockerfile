# Imagen base oficial de Node.js
FROM node:18

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de definición de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar el código TypeScript
RUN npm run build

# Exponer el puerto NestJS (ajústalo si usas otro)
EXPOSE 3000

# Comando para iniciar la app en modo producción
CMD ["npm", "run", "start:prod"]