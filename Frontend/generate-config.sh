#!/bin/sh
# Script para generar config.json en runtime basado en variables de entorno

CONFIG_FILE="/usr/share/nginx/html/assets/config.json"

# Si las variables no están definidas, usar valores por defecto
API_URL=${API_URL:-"http://localhost:7150"}
ENV_NAME=${ENV_NAME:-"DEV"}
DB_NAME=${DB_NAME:-"ISW_DB_DEV"}

# Generar el archivo config.json
cat > $CONFIG_FILE <<EOF
{
  "apiUrl": "$API_URL",
  "envName": "$ENV_NAME",
  "dbName": "$DB_NAME"
}
EOF

echo "Configuration file generated at $CONFIG_FILE"
echo "  API_URL=$API_URL"
echo "  ENV_NAME=$ENV_NAME"
echo "  DB_NAME=$DB_NAME"
