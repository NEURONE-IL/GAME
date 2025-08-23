# Usar imagen base de Node.js
FROM node:14

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Exponer el puerto definido en .env o por defecto 3030
EXPOSE 3030

# Comando para iniciar la app
CMD ["node", "app.js"]