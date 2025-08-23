# Usar imagen base de Node.js
FROM node:14

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Parchear config/config.js para que use el servicio "mongo" (contenedor) en lugar de localhost
RUN sed -i 's|mongodb://localhost:27017|mongodb://mongo:27017|g' /app/config/config.js

# Exponer el puerto definido en .env o por defecto 3030
EXPOSE 3030

# Comando para iniciar la app
CMD ["node", "app.js"]