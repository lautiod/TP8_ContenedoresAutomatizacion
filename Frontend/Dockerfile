# ===== Build Angular =====
FROM node:20 AS build
WORKDIR /app

# Copio package* primero para aprovechar cache
COPY Frontend/package*.json ./
RUN npm install

# Copio el resto del código y build prod
COPY Frontend/ ./
# Si tu proyecto usa Angular CLI:
RUN npm run build --if-present || npx ng build --configuration production

# ===== Nginx para servir estático =====
FROM nginx:alpine AS final

# Quita el default y pone uno SPA-friendly (maneja rutas)
COPY Frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copio el artefacto Angular (ajusta la carpeta si tu output difiere)
# Normalmente dist/<nombre-app>/
COPY --from=build /app/dist/ /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
