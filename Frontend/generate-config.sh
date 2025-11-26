#!/bin/sh
# Script para generar config.json en runtime basado en variables de entorno

CONFIG_FILE="/usr/share/nginx/html/assets/config.json"

# Si API_URL no está definida, usar un valor por defecto
API_URL=${API_URL:-"http://localhost:7150"}

# Generar el archivo config.json
cat > $CONFIG_FILE <<EOF
{
  "apiUrl": "$API_URL"
}
EOF

echo "Configuration file generated at $CONFIG_FILE with API_URL=$API_URL"

# Iniciar nginx
nginx -g 'daemon off;'
