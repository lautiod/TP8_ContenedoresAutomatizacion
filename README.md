# TP8 – Contenedores y Automatización (ISW3)

[![CI/CD Pipeline](https://github.com/lautiod/TP8_ContenedoresAutomatizacion/actions/workflows/pipeline.yml/badge.svg)](https://github.com/lautiod/TP8_ContenedoresAutomatizacion/actions/workflows/pipeline.yml)

**Integrantes:** Ojeda Dante (2218203) | Reyna Agustín (2202124) | Tricherri Santiago (2205721)

---

## 📋 Descripción

Trabajo Práctico Nº8 de *Ingeniería de Software 3* enfocado en **containerización**, **automatización de despliegues** y **pipelines CI/CD**.

## 🏗️ Arquitectura

- **Backend:** .NET 8 Web API
- **Frontend:** Angular 
- **Database:** MongoDB Atlas
- **Registry:** GitHub Container Registry (GHCR)
- **Hosting:** Render
- **CI/CD:** GitHub Actions

## 🚀 Ambientes

| Ambiente | Frontend | Backend |
|----------|----------|---------|
| **QA** | [tp8-front-qa.onrender.com](https://tp8-front-qa.onrender.com) | [tp8-back-qa-18pa.onrender.com](https://tp8-back-qa-18pa.onrender.com) |
| **PROD** | [tp8-front-prod.onrender.com](https://tp8-front-prod.onrender.com) | [tp8-back-prod.onrender.com](https://tp8-back-prod.onrender.com) |


## 🔄 Pipeline CI/CD

El pipeline automatiza:

1. **Análisis de Calidad** → SonarCloud (informativo)
2. **Tests** → Backend (.NET) + Frontend (Angular)
3. **Build & Push** → Imágenes Docker a GHCR (`:qa` y `:prod`)
4. **Deploy QA** → Automático en cada push
5. **Deploy PROD** → Requiere aprobación manual

📖 Ver [PIPELINE_GUIDE.md](PIPELINE_GUIDE.md) para más detalles.

## 📚 Documentación

- **[PIPELINE_GUIDE.md](PIPELINE_GUIDE.md)** - Guía completa del pipeline y configuración
- **[Decisiones.md](Decisiones.md)** - Decisiones arquitectónicas y justificaciones técnicas
