# Usar imagen base de Node para construir la app
FROM node:14-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Usar imagen base de Node.js para servir la app
FROM node:14-alpine

WORKDIR /app
RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 4200

CMD ["serve", "-s", "dist/NEURONE-GAME", "-l", "4200"]
