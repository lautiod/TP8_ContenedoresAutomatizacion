# Decisiones TP8 

---

## 1. Arquitectura utilizada

### 1.1 Stack tecnológico elegido y justificación
Para el desarrollo del proyecto se utilizó un stack mixto compuesto por:

- **Backend:** .NET 8 Web API  
  Elegido por su rendimiento, su ecosistema maduro, la facilidad para estructurar servicios REST y la integración nativa con contenedores mediante imágenes oficiales de Microsoft.

- **Frontend:** Angular  
  Seleccionado por su robustez, su CLI integrada y la capacidad de generar builds de producción fácilmente containerizables y servidos mediante Nginx.

- **Base de datos:** MongoDB Atlas  
  Se optó por una base NoSQL gestionada por su facilidad de provisión en la nube, su modelo flexible para el CRUD implementado y su disponibilidad gratuita en planes básicos.

El stack combina tecnologías modernas, con fuerte soporte empresarial, buena documentación y compatibilidad directa con Docker.

---

### 1.2 Servicios Cloud elegidos y justificación

#### Container Registry: **GitHub Container Registry (GHCR)**
Se eligió GHCR porque:
- Está integrado al repositorio, lo que simplifica la autenticación desde GitHub Actions.
- Permite publicar imágenes sin necesidad de tokens externos adicionales.
- Facilita el versionado y la visibilidad pública/privada de imágenes.
- Reduce la complejidad al centralizar código, pipeline y registry en la misma plataforma.

#### Hosting: **Render**
Render se seleccionó por:
- Soporte nativo para despliegues desde imágenes de contenedores.
- Servicio gratuito para ambientes de prueba (QA).
- Webhooks de despliegue simples que se integran fácilmente al pipeline.
- Escalado automático y health checks integrados.
- Interfaz intuitiva para gestionar múltiples servicios (frontend/back para QA y PROD).

#### CI/CD: **GitHub Actions**
GitHub Actions fue elegido porque:
- Está completamente integrado al repositorio.
- Permite disparar pipelines en cada push, PR o tag.
- Ofrece runners gratuitos y soporte directo para Docker, Node y .NET.
- Se integra sin fricción con GHCR y con Render a través de Deploy Hooks.

---

### 1.3 Decisión QA vs PROD

#### Ambientes diferenciados en Render
Se optó por usar **servicios diferentes** para QA y PROD, tanto para el frontend como para el backend.

Justificación:
- Permite aislar los entornos y evitar que cambios en QA afecten la estabilidad de producción.
- Cada ambiente tiene su propia URL pública, ideal para debugging, testing y demostraciones.
- Facilita el uso de bases de datos separadas (una para QA y otra para PROD).
- Permite diferenciar variables de entorno (por ejemplo, `AllowedOrigins`, `ASPNETCORE_ENVIRONMENT`, `ConnectionStrings`, etc.).
- Se configura cada servicio para que consuma una imagen distinta: `:qa` o `:prod`.

#### Ventajas de esta separación
- Despliegue automático a QA para validar cambios sin riesgo.
- Despliegue a PROD requiere aprobación manual (mayor control).
- Monitoreo separado, logs separados y health checks diferenciados.
- Permite rollback independiente por ambiente.


---

### 1.4 Configuración de recursos por ambiente

#### QA
- Instancia **Free** de Render para minimizar costos.
- Reinicios automáticos permitidos.
- Logs y métricas suficientes para testing.
- Menores requerimientos de CPU/memoria porque se utiliza solo para validación funcional.

#### PROD
- Instancia también Free para fines académicos, pero configurada con:
  - Variables de entorno específicas.
  - Autodeploy únicamente desde imágenes con tag `:prod`.
  - Aprobación manual previa al despliegue.
- En un escenario real, se evaluaría escalar PROD a instancias con mayor memoria/CPU y habilitar escalado automático.

---

En conjunto, estas decisiones permitieron un flujo claro, reproducible y seguro desde el desarrollo local hasta la automatización completa del ciclo de vida (CI + CD) con entornos independientes.

---

## 2. Implementación

### Container Registry
- Evidencia del registry funcionando (capturas con imágenes y tags)
<img width="1110" height="173" alt="image" src="https://github.com/user-attachments/assets/76f7bb37-2aeb-4477-98fc-b0c65ce09c9d" />

<img width="913" height="266" alt="image" src="https://github.com/user-attachments/assets/22951871-f81a-4e3c-92e8-3963402aab21" />

- Configuración de permisos: Ambos los concedimos como públicos para ahorrarnos problemas de configuracion y credenciales
<img width="1281" height="266" alt="image" src="https://github.com/user-attachments/assets/82153bfd-0a46-4375-8ace-710d4b81c933" />

### Ambiente QA

- Deploy de las web services en Render (qa)
<img width="1446" height="122" alt="image" src="https://github.com/user-attachments/assets/e6694938-99a8-48ca-a272-5c9213c33436" />

- Variables de entorno en Render de Back-QA. ( Homólogas para Back-PROD )
<img width="1324" height="290" alt="image" src="https://github.com/user-attachments/assets/7f892a2f-cca6-4219-97db-8c19e71fbc26" />

- Página web en front-prod
<img width="1647" height="654" alt="image" src="https://github.com/user-attachments/assets/6c6db0f7-67d8-4f90-a949-803553c651e6" />

### Ambiente PROD

- Deploy de las web services en Render (prod)
<img width="1365" height="117" alt="image" src="https://github.com/user-attachments/assets/110128b0-0e71-498d-8251-73ea9bb433c6" />

- Página web en front-prod
<img width="1677" height="653" alt="image" src="https://github.com/user-attachments/assets/89a4e770-2da6-4959-992f-967cd28bf4c1" />

### Secretos configurados
<img width="1012" height="434" alt="image" src="https://github.com/user-attachments/assets/a339a7bf-aa01-470c-beef-a20e735ec3b5" />

### Pipeline CI/CD

- Deploy a QA
<img width="1345" height="240" alt="image" src="https://github.com/user-attachments/assets/343028c7-6200-45f7-aa36-a1808b9b1fbf" />

- Deploy a PROD con aprobación manual
<img width="1340" height="236" alt="image" src="https://github.com/user-attachments/assets/06fa7ae5-0a9c-40f9-9a62-890cc91b02db" />
<img width="1570" height="493" alt="image" src="https://github.com/user-attachments/assets/97080032-a3f3-430b-9026-767645d0b647" />

- Partes del pipeline
<img width="381" height="243" alt="image" src="https://github.com/user-attachments/assets/40b69031-9caa-449d-bd38-2431741b0a29" />

## 3. Comparativa QA vs PROD, Servicios Elegidos y Análisis de Alternativas

### 3.1 Uso de servicios diferentes para QA y PROD

Para este trabajo se decidió utilizar **servicios separados** en Render para cada ambiente:
- `tp8-front-qa` y `tp8-back-qa`
- `tp8-front-prod` y `tp8-back-prod`

Esta separación permitió aislar el comportamiento de cada entorno y garantizar que los cambios en QA no afectaran la estabilidad de producción.

---

### 3.2 Por qué cada servicio es apropiado para cada ambiente

#### ✅ QA (Testing)
- Se ejecuta sobre instancias **Free** de Render, suficientes para validar builds y verificar integraciones.
- Permite realizar pruebas funcionales sin afectar usuarios de producción.
- Es un entorno descartable: puede ser reiniciado o regenerado sin impacto.
- Recibe despliegues automáticos del pipeline en cada push a `main`.

#### ✅ PROD (Estable y controlado)
- Tiene un flujo más estricto: solo recibe despliegues manualmente aprobados.
- Mantiene variables de entorno específicas (bases de datos, CORS, URLs, etc.).
- Mantiene independencia total de QA, lo que facilita rollback o diagnósticos.

---

### 3.3 Trade-offs de la decisión

| Aspecto | Ventajas | Desventajas |
|--------|----------|-------------|
| Separación QA/PROD | Aislamiento total, mayor seguridad, debugging sin impacto | Mayor cantidad de servicios a gestionar |
| Deploy automático a QA | Proceso rápido y continuo | QA puede estar inestable durante el desarrollo |
| Deploy manual a PROD | Mayor control y menor riesgo | Requiere aprobaciones y procesos adicionales |
| Bases independientes | Evita mezclar datos reales y de prueba | Duplicación mínima de costo/gestión |

En balance, los beneficios superan ampliamente la complejidad adicional.

---

### 3.4 Complejidad adicional de manejar dos servicios

Manejar dos ambientes implica:
- Duplicar variables de entorno (DB, AllowedOrigins, API URLs).
- Gestionar 4 servicios en total (front/back para QA y PROD).
- Controlar dos flujos de imágenes (`:qa` y `:prod`) en GHCR.
- Validar que CORS esté correctamente configurado para cada dominio.

Sin embargo, el pipeline automatizado compensa esta complejidad al dejar los despliegues prácticamente sin intervención humana, salvo en PROD.

---

### 3.5 Análisis de alternativas consideradas

#### ✅ **1. Azure App Service + Azure Container Registry (ACR)**
**Por qué se descartó:**
- Requiere mayor configuración inicial.
- ACR es más complejo de usar y no está integrado al repositorio.
- Costos superiores para ambientes productivos.
**Cuándo sería mejor opción:**
- Proyectos con necesidades empresariales, escalado horizontal o integración con redes privadas.

#### ✅ **2. Docker Hub**
**Por qué se descartó:**
- Límite de pulls en la versión gratuita.
- No tiene integración directa con GitHub Actions.
- GHCR ofrece autenticación nativa con `GITHUB_TOKEN`.
**Cuándo sería mejor:**
- En proyectos multi-repo que no dependen de GitHub como plataforma principal.

#### ✅ **3. Railway / Fly.io / Heroku**
**Por qué se descartaron:**
- Limitaciones en free tier (tiempo de ejecución, cold starts, límites de CPU).
- Menor claridad para manejar dos ambientes paralelos.
**Cuándo serían mejores:**
- Prototipos muy livianos o apps sin backend/DB complejas.

---

### 3.6 Análisis de costos

| Entorno | Costo en Render | Justificación |
|---------|-----------------|---------------|
| QA | $0 (Free) | Ideal para pruebas, reinicios frecuentes aceptables |
| PROD | $0 (Free, dado que es un TP) | No se requiere escalado real para este proyecto académico |

#### Comparación con alternativas:
- Azure App Service: más costoso aun en tier básico.
- Railway: free limitado, posibles pausas por inactividad.
- Fly.io: cobra por RAM siquiera en pequeños despliegues.

Render fue la opción más equilibrada: buen rendimiento, despliegues sencillos, buen soporte para contenedores y sin costos para un proyecto académico.

#### Estrategias de optimización:
- Mantener QA siempre en Free.
- Elevar PROD solo si la carga del proyecto lo justificara.
- Utilizar imágenes livianas (Nginx/Alpine, ASP.NET slim).

---

### 3.7 Escalabilidad a futuro

#### ¿Cuándo migrar a Kubernetes?
Sería razonable migrar a Kubernetes si:
- La aplicación requiere múltiples réplicas simultáneas.
- Se necesita balanceo avanzado, autoescalado y políticas de resiliencia.
- Hay múltiples microservicios que deben comunicarse entre sí.
- Se requiere CI/CD multi-cluster.

#### ¿Qué cambiaría si la aplicación crece 10x?
- Migración a pods con límites de CPU/RAM configurados.
- Uso de Horizontal Pod Autoscaler.
- Base de datos con escalado automático o sharding.
- Reemplazo de imágenes base por versiones aún más ligeras.
- Logs centralizados (Grafana/Loki) y métricas (Prometheus).
- Separación estricta de redes y políticas de seguridad.

---

En conclusión, la decisión de utilizar servicios independientes para QA y PROD en Render, junto con GHCR como registry y GitHub Actions como pipeline, permitió construir un flujo CI/CD robusto, escalable y completamente automatizado, manteniendo costos mínimos y una arquitectura clara.

---

## 4. Reflexión Grupal

### 4.1 Desafíos encontrados y cómo los resolvimos

Durante el desarrollo del trabajo práctico enfrentamos diversos desafíos técnicos que nos exigieron investigar, probar diferentes alternativas y ajustar configuraciones a medida que avanzábamos. Entre los más relevantes destacamos:

- **Integración con GHCR y permisos de publicación:**  
  Al principio tuvimos inconvenientes con la autenticación y la visibilidad de las imágenes en el registro. Lo resolvimos configurando correctamente los permisos del `GITHUB_TOKEN`, habilitando `packages: write` en el pipeline y definiendo las imágenes como públicas para facilitar su uso desde Render.

- **Configuración de CORS según cada ambiente:**  
  El frontend no lograba comunicarse con el backend debido a restricciones de origen. Superamos este problema parametrizando `AllowedOrigins` mediante variables de entorno específicas para QA y PROD, lo que simplificó y ordenó la configuración.

- **Diferenciación de ambientes Angular (QA/PROD):**  
  Tuvimos que separar adecuadamente los archivos `environment.*` y asegurarnos de que cada Dockerfile utilizara el entorno correcto al construir la aplicación. Optamos por Dockerfiles separados (`qa` y `prod`) para garantizar builds reproducibles.


Cada desafío nos permitió mejorar nuestra comprensión del flujo completo de CI/CD, del comportamiento de las aplicaciones en contenedores y de las exigencias reales de los servicios cloud.

---

### 4.2 Qué mejoraríamos en una implementación productiva real

Si este proyecto se utilizara en un entorno productivo real, aplicaríamos una serie de mejoras adicionales para garantizar mayor rendimiento, estabilidad y seguridad:

- **Escalabilidad y alta disponibilidad:**  
  Utilizaríamos instancias más robustas o servicios con autoescalado para soportar mayor tráfico.

- **Observabilidad:**  
  Incorporaríamos métricas (Prometheus), dashboards (Grafana) y logs centralizados (Loki o Elastic) para monitorear la aplicación en tiempo real.

- **Promoción de artefactos entre ambientes:**  
  En vez de reconstruir imágenes separadas para PROD, promoveríamos la misma imagen que pasó por QA, garantizando consistencia absoluta entre ambientes.

- **Fortalecimiento de la seguridad:**  
  - Uso de GHCR privado con autenticación OIDC  
  - Rotación automática de secretos  
  - Validaciones adicionales en la API  
  - Certificados HTTPS administrados

- **Mayor cobertura de testing:**  
  Agregaríamos pruebas de integración, tests end-to-end y validaciones sobre la estructura de datos en MongoDB.

---

### 4.3 Aprendizajes clave del trabajo práctico

Este trabajo práctico nos dejó aprendizajes muy importantes, tanto técnicos como metodológicos:

- **Importancia de la automatización:**  
  Comprendimos claramente cómo un pipeline CI/CD reduce errores, acelera los tiempos y genera confianza en cada despliegue.

- **Valor de separar QA y PROD:**  
  Vivenciamos la importancia de probar en un ambiente aislado y protegido, y la necesidad de que PROD tenga un flujo más controlado.

- **Uso práctico de contenedores:**  
  Aprendimos a encapsular frontend y backend en imágenes reproducibles, facilitando la portabilidad entre entornos.

- **Gestión correcta de variables de entorno:**  
  Identificamos cómo manejar configuraciones distintas (DB, URLs, CORS) sin mezclarlas dentro del código.

- **Visión integral del ciclo DevOps:**  
  Logramos integrar control de versiones, análisis estático, testing, containerización, registro de imágenes y despliegue continuo en un mismo flujo coherente.

En conjunto, este trabajo nos permitió adquirir una experiencia completa, práctica y realista sobre cómo llevar una aplicación desde el código fuente hasta un entorno productivo con automatización completa.
