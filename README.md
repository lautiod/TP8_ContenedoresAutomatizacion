# TP8 – Contenedores y Automatización (ISW3)

Este repositorio contiene el desarrollo completo del **Trabajo Práctico Nº8** de la asignatura *Ingeniería de Software 3*, enfocado en la **containerización**, **automatización de despliegues** y **configuración de pipelines CI/CD**.

Aquí se encuentra:

- El **código fuente** del backend (.NET) y frontend (Angular)
- Los **Dockerfiles** utilizados para generar las imágenes de cada servicio
- El archivo **YAML del pipeline** de GitHub Actions encargado de:
  - Ejecutar análisis de calidad y tests
  - Construir y publicar imágenes en GHCR
  - Desplegar automáticamente en los entornos **QA** y **PROD** en Render

El proyecto implementa un flujo completo de integración y despliegue continuo, permitiendo que cada cambio en el repositorio se valide, construya y distribuya de manera automatizada.
