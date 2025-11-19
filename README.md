Apartir de aca mudamos a animals


## 🔄 Pipeline CI/CD

El pipeline automatiza:

1. **Análisis de Calidad** → SonarCloud (informativo)
2. **Tests** → Backend (.NET) + Frontend (Angular)
3. **Build & Push** → Imágenes Docker a GHCR (`:qa` y `:prod`)
4. **Deploy QA** → Automático en cada push
5. **Deploy PROD** → Requiere aprobación manual

📖 Ver [PIPELINE_GUIDE.md](PIPELINE_GUIDE.md) para más detalles.

## 📚 Documentación

- **[Decisiones.md](Decisiones.md)** - Decisiones arquitectónicas y justificaciones técnicas
