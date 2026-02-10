# TP Integrador ISW /

Trabajo Práctico Integrador que comprende los contenidos vistos en la materia **Ingeniería de Software 3** 

## 👥 Alumnos (Cat: A2)

| Alumno             | Clave UCC |
|--------------------|-----------|
| Ojeda Dante        | `2218203` |
| Tricherri Santiago | `2205721` |
| Reyna Agustín      | `2202124` |

---

## 📋 Descripción del Proyecto

Sistema de gestión de animales de granja (**Farm Animals Management**), es un CRUD de animales.

### 🏗️ Arquitectura

- **Backend**: API REST desarrollada en **.NET 8.0** con MongoDB como base de datos
- **Frontend**: Aplicación SPA desarrollada en **Angular 17**
- **Contenedores**: Imágenes Docker alojadas en **GitHub Container Registry (GHCR)**
- **Deployment**: Web services desplegados en **Render** (ambientes QA y PROD)
- **CI/CD**: Pipeline automatizado con **GitHub Actions**

### 🔄 Pipeline CI/CD

El pipeline automatiza el proceso completo de integración y despliegue:

1. **Análisis de Calidad** → SonarCloud (análisis estático de código)
2. **Tests Unitarios** → Backend (.NET) + Frontend (Angular/Karma)
3. **Build & Push** → Construcción de imágenes Docker unificadas con tags `:latest` y `:${SHA}`
4. **Deploy QA** → Despliegue automático + Tests de integración (Cypress)
5. **Deploy PROD** → Despliegue con aprobación manual


### 🧪 Testing

- **Tests Unitarios**: Backend (xUnit) y Frontend (Jasmine/Karma)
- **Tests de Integración**: Cypress ejecutados automáticamente en QA
- **Cobertura de Código**: Reportada a SonarCloud.

