# Decisiones del Proyecto - TP6 Ingeniería de Software III  
## Estrategia de Testing, Mocking y Validaciones

---

## Frameworks de Testing elegidos y justificación

###  Backend (.NET Core)
Para la API desarrollada en **.NET Core 8**, se utilizaron las siguientes herramientas de testing:

- **xUnit** → Framework de pruebas unitarias principal por su integración nativa con .NET y su sintaxis simple.  
- **Moq** → Librería utilizada para crear objetos *mock* y aislar dependencias durante las pruebas.  
- **coverlet** → Generación de reportes de cobertura de código.
- **trx logger** → Para exportar los resultados de ejecución en formato `.trx` y poder visualizarlos en Azure DevOps.

**Justificación:**  
xUnit se eligió porque es ligero, moderno y se integra fácilmente con los comandos `dotnet test`.  
Moq permite simular servicios o repositorios sin necesidad de una base de datos real, garantizando que las pruebas sean realmente unitarias.  
El formato `.trx` es estándar en pipelines de Azure DevOps, lo que facilita la integración continua.

---

###  Frontend (Angular)
Para el front desarrollado con **Angular 17**, se usaron las herramientas que el propio framework ofrece:

- **Jasmine** → Framework de testing incluido por defecto en Angular CLI.  
- **Karma** → Test runner que ejecuta las pruebas en un navegador.  
- **junit-reporter** → Para exportar resultados de pruebas a formato XML compatible con Azure DevOps.  
- **Toastr** → Librería utilizada para mostrar mensajes de validación en el front.

**Justificación:**  
Jasmine y Karma son la opción estándar de Angular, lo que garantiza compatibilidad total con el CLI y una curva de aprendizaje baja.  
La salida XML es necesaria para que los pipelines de CI/CD puedan mostrar los resultados junto a los del backend.  
Toastr fue elegido para mostrar validaciones de forma visual y amigable al usuario sin depender del backend.

---

##  Estrategia de Mocking implementada

###  En la API (.NET)
En las pruebas del backend, se aplicó **mocking de repositorios** para simular el acceso a datos sin depender de la base real.  
Ejemplo: se reemplazó el acceso al `DbContext` por un objeto simulado con **Moq**, devolviendo datos predefinidos.

Esto permitió probar la lógica del controlador y los servicios sin conexión a SQL Server, asegurando que las pruebas fueran determinísticas y rápidas.

**Ventajas del enfoque:**
- Independencia de la base real.  
- Facilidad para probar escenarios de error o resultados vacíos.  
- Reducción del tiempo de ejecución de tests.

---

###  En el Frontend (Angular)
En el front no se utilizó un framework de mocking adicional, sino que se simularon **respuestas de servicios HTTP** directamente dentro de los tests con `HttpClientTestingModule`.

Esto permitió comprobar que los componentes reaccionaban correctamente sin depender de una API en ejecución.

Ejemplo: se probó que, ante un error HTTP, el componente mostrara el toast de error correspondiente.

---

##  Casos de prueba más relevantes

1. **Validación de campos obligatorios (Front):**  
   - Se verificó que al intentar guardar un empleado con campos vacíos, se muestre un mensaje Toastr de error sin enviar la solicitud a la API.  

2. **Inserción de registro válido (Back):**  
   - Se probó que el método `AddEmployee()` retorne un `CreatedAtAction` con el empleado creado correctamente.  

3. **Eliminación de empleado inexistente (Back):**  
   - Se simuló un ID inexistente y se verificó que el servicio devuelva un `NotFound()`.

4. **Actualización de empleado (Front):**  
   - Se comprobó que, al editar un empleado, los cambios se reflejen correctamente en la tabla sin recargar la página.

5. **Comunicación fallida con API (Front):**  
   - Se testeó la visualización del mensaje de error al no poder acceder al backend (API detenida).

---

## 📸 Evidencias de ejecución

A continuación se incluyen capturas que evidencian la correcta ejecución de las pruebas:


###  Frontend
<img width="1600" height="1354" alt="image" src="https://github.com/user-attachments/assets/570730ee-c283-49db-824b-71dc6beea012" />

<img width="1600" height="492" alt="image" src="https://github.com/user-attachments/assets/8d273391-e620-4c98-91e7-e2abe523d1e6" />


###  Backend
<img width="1429" height="276" alt="image" src="https://github.com/user-attachments/assets/a20faef4-7a29-4028-86df-6e0d387632b8" />

<img width="1447" height="232" alt="image" src="https://github.com/user-attachments/assets/14d96a9c-ef31-4870-a698-68616e913729" />

Archivo **test-results.trx** dentro de la carpeta TestsResults en EmployeeCrudApi.Tests:

<img width="1670" height="1127" alt="image" src="https://github.com/user-attachments/assets/ef05b66a-5963-4e4c-9693-68cbf0f4c82a" />


###  Azure DevOps
<img width="3600" height="1552" alt="image" src="https://github.com/user-attachments/assets/4c895ddd-2fc6-428a-ad6f-5707377660a2" />


---

## Conclusiones

- Se validó el correcto funcionamiento de la aplicación sin dependencia entre front, API y BD.  
- Se logró una suite de pruebas unitaria completa, con reportes exportables y ejecutables automáticamente desde el pipeline.  
- Las decisiones de frameworks y herramientas se basaron en la facilidad de integración con las tecnologías utilizadas (Angular y .NET Core).

---

