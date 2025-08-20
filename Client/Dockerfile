# Usar imagen base de Node para construir la app
FROM node:14 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Usar imagen base de Nginx para servir la app
FROM nginx:alpine

# Copiar archivos de la build Angular al directorio de Nginx
COPY --from=build /app/dist/NEURONE-GAME /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
