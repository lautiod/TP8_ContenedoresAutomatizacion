# ===== Build Angular (Production) =====
FROM node:20 AS build
WORKDIR /app

# Copio package* primero para aprovechar cache
COPY Frontend/package*.json ./
RUN npm install

# Copio el resto del código y build production
COPY Frontend/ ./
RUN npx ng build --configuration production

# ===== Nginx para servir estático =====
FROM nginx:alpine AS final

# Quita el default y pone uno SPA-friendly (maneja rutas)
COPY Frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copio el artefacto Angular (Angular 17+ usa /browser)
COPY --from=build /app/dist/farm-crud-angular/browser /usr/share/nginx/html

# Copio el script de generación de config
COPY Frontend/generate-config.sh /docker-entrypoint.d/generate-config.sh
RUN chmod +x /docker-entrypoint.d/generate-config.sh

EXPOSE 80

# Usar el script como entrypoint para generar config.json en runtime
ENTRYPOINT ["/docker-entrypoint.d/generate-config.sh"]
