# Configuración de Variables de Entorno en Render

## Resumen de Cambios

Se ha reestructurado el proyecto para usar **una única imagen Docker** tanto para QA como para Production. La diferencia entre ambientes ahora se maneja mediante **variables de entorno en runtime**.

## Variables de Entorno Requeridas

### Frontend QA (tp8-front-qa)
Ir a: https://dashboard.render.com/web/[tu-servicio-qa]
En la sección "Environment", agregar:

```
API_URL=https://tp8-api-qa.onrender.com/api/Animal
```

### Frontend PROD (tp8-front-prod)
Ir a: https://dashboard.render.com/web/[tu-servicio-prod]
En la sección "Environment", agregar:

```
API_URL=https://tp8-api-prod.onrender.com/api/Animal
```

### Backend QA y PROD
No requieren cambios - ya usan `appsettings.QA.json` y `appsettings.Production.json`

## Actualización de Tags de Imágenes en Render

Ambos servicios (QA y PROD) ahora deben usar el tag **`:latest`** en lugar de `:qa` y `:prod`.

### Para Frontend QA:
```
Image URL: ghcr.io/lautiod/tp8-angular:latest
```

### Para Frontend PROD:
```
Image URL: ghcr.io/lautiod/tp8-angular:latest
```

### Para Backend QA:
```
Image URL: ghcr.io/lautiod/tp8-api:latest
```

### Para Backend PROD:
```
Image URL: ghcr.io/lautiod/tp8-api:latest
```

## Cómo Funciona

1. El pipeline construye **una única imagen** con tag `:latest` y `:${SHA}`
2. Render pull la imagen `:latest`
3. Al iniciar el contenedor, el script `generate-config.sh` lee la variable `API_URL`
4. Se genera `/usr/share/nginx/html/assets/config.json` con la URL correcta
5. La aplicación Angular lee este archivo en runtime y conecta a la API correspondiente

## Ventajas

- ✅ Una sola imagen validada para ambos ambientes
- ✅ Lo que funciona en QA, funciona en PROD
- ✅ Más rápido (se construye una sola vez)
- ✅ Mejor práctica de CI/CD
- ✅ Trazabilidad con SHA commits

## Verificación

Después de configurar las variables:

1. Re-desplegar ambos servicios en Render
2. Verificar en la consola del navegador: `console.log` mostrará "Configuration loaded"
3. Comprobar que las peticiones HTTP van a la URL correcta del ambiente
