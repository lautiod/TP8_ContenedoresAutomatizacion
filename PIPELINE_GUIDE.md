# Pipeline CI/CD - Guía de Uso

## 📋 Resumen

El pipeline está configurado para desplegar automáticamente a **QA** y a **Production** con aprobación manual en GitHub.

## 🏗️ Arquitectura

### Imágenes Docker
- **Backend**: `ghcr.io/lautiod/tp8-crud-api:qa` y `:prod`
- **Frontend**: `ghcr.io/lautiod/tp8-crud-angular:qa` y `:prod`

### Ambientes

#### QA
- **Backend**: https://tp8-back-qa.onrender.com
- **Frontend**: https://tp8-front-qa.onrender.com
- **Base de datos**: `aniamaldb_qa`

#### Production
- **Backend**: https://tp8-back-prod.onrender.com
- **Frontend**: https://tp8-front-prod.onrender.com
- **Base de datos**: `aniamaldb_prod`

## 🚀 Flujo del Pipeline

### 1. Tests & Build Validation
- ✅ Restaura y compila el backend (.NET 8)
- ✅ Ejecuta tests unitarios del backend
- ✅ Instala dependencias del frontend (Angular)
- ✅ Compila el frontend para QA y Production

### 2. Build & Push QA (Paralelo)
- 🐳 Construye imagen del backend con Dockerfile
- 🐳 Construye imagen del frontend con Dockerfile.qa
- 📦 Sube ambas imágenes a GHCR con tag `:qa`

### 3. Build & Push Production (Paralelo)
- 🐳 Construye imagen del backend con Dockerfile
- 🐳 Construye imagen del frontend con Dockerfile.prod
- 📦 Sube ambas imágenes a GHCR con tag `:prod`

### 4. Deploy QA (Automático)
- 🚀 Llama al webhook de Render para backend QA
- 🚀 Llama al webhook de Render para frontend QA
- ⏱️ Render toma ~2-5 minutos en desplegar

### 5. Deploy Production (Requiere Aprobación)
- ⏸️ **ESPERA** aprobación manual en GitHub
- 🚀 Llama al webhook de Render para backend PROD
- 🚀 Llama al webhook de Render para frontend PROD

## 📝 Cómo Usar

### Despliegue Automático a QA
```bash
# Hacer push a main despliega automáticamente a QA
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

### Despliegue a Production
1. El pipeline construye las imágenes automáticamente
2. Ve a **GitHub → Actions → Tu workflow**
3. Busca el job "Deploy to Production"
4. Click en **"Review deployments"**
5. Selecciona **"production"** y aprueba
6. El despliegue a PROD se ejecuta

### Despliegue Manual
```bash
# Ir a GitHub → Actions → CI/CD Pipeline
# Click en "Run workflow" → "Run workflow"
```

## 🔧 Configuración en Render

### Variables de Entorno

#### Backend QA
```env
ASPNETCORE_ENVIRONMENT=QA
ASPNETCORE_URLS=http://0.0.0.0:8080
ConnectionStrings__MongoDB=<tu-connection-string>
AllowedOrigins=https://tp8-front-qa.onrender.com
```

#### Backend PROD
```env
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://0.0.0.0:8080
ConnectionStrings__MongoDB=<tu-connection-string>
AllowedOrigins=https://tp8-front-prod.onrender.com
```

### Configuración de Web Services

Cada servicio en Render debe estar configurado así:

1. **Docker Image**: Apuntar a GHCR
   - Backend QA: `ghcr.io/lautiod/tp8-crud-api:qa`
   - Backend PROD: `ghcr.io/lautiod/tp8-crud-api:prod`
   - Frontend QA: `ghcr.io/lautiod/tp8-crud-angular:qa`
   - Frontend PROD: `ghcr.io/lautiod/tp8-crud-angular:prod`

2. **Registry Credentials**: 
   - Username: tu usuario de GitHub
   - Password: GitHub Personal Access Token con permisos `read:packages`

3. **Auto-Deploy**: **DESACTIVADO** (se usa webhook)

## 🔑 Secrets en GitHub

Asegúrate de tener estos secrets configurados en tu repositorio:

- `RENDER_BACK_QA_HOOK`
- `RENDER_FRONT_QA_HOOK`
- `RENDER_BACK_PROD_HOOK`
- `RENDER_FRONT_PROD_HOOK`

## 🐛 Troubleshooting

### El pipeline falla en tests
```bash
# Ejecuta los tests localmente
cd EmployeeCrudApi.Tests
dotnet test
```

### El build de Angular falla
```bash
cd EmployeeCrudAngular
npm install
npx ng build --configuration qa
npx ng build --configuration production
```

### Las imágenes no se suben a GHCR
- Verifica que el `GITHUB_TOKEN` tenga permisos de `packages: write`
- Las imágenes deben ser públicas o Render necesita credenciales

### Render no despliega
- Verifica que los webhooks estén correctos
- Revisa los logs en Render Dashboard
- Asegúrate de que las imágenes existan en GHCR

## 📊 Monitoreo

### Ver el estado del pipeline
```
https://github.com/lautiod/TP8_ContenedoresAutomatizacion/actions
```

### Ver logs de Render
```
Dashboard → Tu servicio → Logs
```

### Verificar que las imágenes se subieron
```
https://github.com/lautiod?tab=packages
```

## ✅ Checklist de Deployment

Antes de cada despliegue:

- [ ] Tests pasan localmente
- [ ] Build de frontend funciona para qa y production
- [ ] Variables de entorno están correctas en Render
- [ ] URLs de los backends están actualizadas en environment.ts
- [ ] Webhooks de Render están activos

---

**Última actualización**: Noviembre 2025
