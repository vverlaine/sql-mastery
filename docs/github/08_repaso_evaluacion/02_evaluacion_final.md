---
sidebar_position: 3
title: Evaluación Final
---

# Evaluación Final

Esta es tu evaluación del módulo. NO es un examen tradicional con preguntas. Es un **proyecto integrador colaborativo** donde aplicas TODO lo que aprendiste.

Si puedes completar esta evaluación sin mirar las soluciones de las lecciones anteriores, estás listo para trabajar con GitHub en cualquier repositorio de CBC.

---

## El caso

Eres analista en CBC. Tu equipo te asigna esta tarea:

> "Necesitamos que crees un repositorio nuevo para un análisis de inventario por categoría. El proceso debe estar versionado en GitHub Enterprise, ser colaborativo (al menos otro analista debe poder contribuir), e integrarse con Databricks Repos para ejecución en clusters."

Lo importante: NO solo el código debe funcionar. La estructura del repo, el flujo de trabajo, los hábitos de colaboración, todo cuenta.

---

## Criterios de evaluación

Para considerarte listo en este módulo, deberías poder cumplir estos 10 criterios:

1. **Crear un repositorio profesional** desde cero con estructura del Pilar 4
2. **Subirlo a GitHub Enterprise** con la configuración correcta
3. **Trabajar con branches** siguiendo la convención del equipo
4. **Hacer commits limpios** con mensajes descriptivos
5. **Crear Pull Requests** con título, descripción y template
6. **Hacer code reviews** dando feedback constructivo
7. **Resolver conflictos** sin perder trabajo
8. **Integrar con Databricks Repos** para ejecución
9. **Configurar al menos un workflow básico** de GitHub Actions
10. **Documentar el proyecto** con README claro y útil

---

## Parte 1: Setup inicial del repositorio

### Tarea 1.1: Crear el repo en GitHub Enterprise

En GitHub Enterprise:

1. Crear un nuevo repositorio llamado `nexus-pilar5-evaluacion`
2. Visibility: Internal o Private (no Public)
3. Initialize with README: NO (lo vas a hacer tú localmente)
4. Add .gitignore: NO
5. Choose a license: NO

### Tarea 1.2: Inicializar el repo localmente

En tu computadora:

1. Crear carpeta `nexus-pilar5-evaluacion`
2. Abrir en VSCode
3. Inicializar Git con `git init`
4. Crear estructura de carpetas (siguiendo Pilar 4):
   ```
   nexus-pilar5-evaluacion/
   ├── README.md
   ├── .gitignore
   ├── pyproject.toml
   ├── notebooks/
   ├── lib/
   │   └── __init__.py
   ├── jobs/
   ├── tests/
   └── .github/
       ├── PULL_REQUEST_TEMPLATE.md
       └── workflows/
           └── lint.yml
   ```

### Tarea 1.3: Llenar archivos clave

Crear con contenido apropiado:

**README.md**:
- Título del proyecto
- Descripción de qué hace
- Estructura del repo
- Cómo ejecutar
- Contacto del dueño

**.gitignore**:
- Las exclusiones recomendadas para análisis de datos

**PULL_REQUEST_TEMPLATE.md**:
- El template estándar con secciones para qué/por qué/cómo probar

**.github/workflows/lint.yml**:
- Workflow básico que ejecuta Ruff y Black en cada PR

### Tarea 1.4: Primer commit y push

```bash
git add .
git commit -m "chore: initial commit with project structure"
git branch -M main
git remote add origin <URL-del-repo-de-GitHub>
git push -u origin main
```

Verificar en GitHub Enterprise que todo subió correctamente.

---

## Parte 2: Crear el código del análisis

### Tarea 2.1: Crear branch para tu trabajo

```bash
git switch -c feature/agregar-analisis-inventario
```

### Tarea 2.2: Crear funciones reutilizables en `lib/`

Crear `lib/analisis_inventario.py` con al menos 3 funciones:

- `cargar_datos_inventario()`: carga la tabla de inventario
- `calcular_rotacion_por_categoria(df)`: calcula rotación
- `identificar_categorias_bajas(df, umbral)`: identifica categorías con rotación baja

Cada función debe:

- Tener type hints
- Tener docstring
- Estar documentada en el README

### Tarea 2.3: Crear notebook que use las funciones

Crear `jobs/analisis_inventario_mensual.py` con:

- Header de notebook (`# Databricks notebook source`)
- Estructura completa de notebook productivo
- Uso de las funciones de `lib/`
- Validaciones intermedias
- Output claro

### Tarea 2.4: Commits limpios

Hacer commits separados por tipo de cambio:

```bash
git add lib/analisis_inventario.py
git commit -m "feat: agregar funciones para análisis de inventario"

git add jobs/analisis_inventario_mensual.py
git commit -m "feat: crear notebook de análisis mensual"

git add README.md
git commit -m "docs: documentar nuevas funciones de inventario"
```

---

## Parte 3: Pull Request

### Tarea 3.1: Push de la branch

```bash
git push -u origin feature/agregar-analisis-inventario
```

### Tarea 3.2: Crear el PR en GitHub Enterprise

1. Ir al repo en GitHub Enterprise
2. Crear Pull Request desde tu branch
3. Llenar el template completo:
   - Título descriptivo
   - Descripción con todas las secciones
   - Tipo de cambio marcado
4. Marcarlo como **Draft** primero

### Tarea 3.3: Verificar los CI checks

- El workflow de lint debe ejecutarse automáticamente
- Si falla, arregla el código localmente y pushea
- Cuando todos los checks pasen, marcar como "Ready for review"

---

## Parte 4: Colaboración

### Tarea 4.1: Pedir review a un colega

Asignar a un colega del programa Universidad Nexus como reviewer del PR.

### Tarea 4.2: Atender el feedback

Cuando el reviewer deje comentarios:

1. Responder cada comentario
2. Hacer los cambios solicitados
3. Pushear los cambios
4. Marcar los hilos como resueltos

### Tarea 4.3: Hacer review del PR de un colega

Otro colega te va a asignar como reviewer en SU PR. Tienes que:

1. Leer la descripción
2. Revisar los archivos modificados
3. Dejar al menos 3 comentarios constructivos:
   - 1 sugerencia o pregunta
   - 1 reconocimiento positivo
   - 1 mejora bloqueante o no
4. Marcar el review (Comment, Approve, o Request Changes)

### Tarea 4.4: Mergear el PR

Cuando tu PR sea aprobado:

1. Mergear con "Squash and merge"
2. Verificar que la branch se borró
3. Verificar que el issue (si lo había) se cerró
4. Limpiar localmente:
   ```bash
   git switch main
   git pull
   git branch -d feature/agregar-analisis-inventario
   ```

---

## Parte 5: Manejar conflictos

### Tarea 5.1: Crear un conflicto controlado

Esta es una práctica intencional. Vas a crear un conflicto para practicar resolverlo.

1. Crear branch `feature/cambio-a` desde main
2. Modificar una línea del README. Hacer commit y push.
3. Sin mergear, volver a main y crear branch `feature/cambio-b`
4. Modificar la MISMA línea del README de forma diferente. Commit y push.

### Tarea 5.2: Resolver el conflicto

1. Mergear `feature/cambio-a` a main (debe ser fast-forward sin conflicto)
2. Intentar mergear `feature/cambio-b`: aparece conflicto
3. Resolver el conflicto manualmente o con VSCode
4. Completar el merge

### Tarea 5.3: Documentar la experiencia

En tu README, agregar una sección "Notas del proceso" describiendo cómo resolviste el conflicto.

---

## Parte 6: Integración con Databricks Repos

### Tarea 6.1: Configurar el acceso

Si todavía no lo hiciste, generar un Personal Access Token y configurarlo en Databricks User Settings.

### Tarea 6.2: Crear el Databricks Repo

1. En Databricks → Workspace → Users → tu carpeta
2. Crear → Repo → URL de tu repo de evaluación
3. Verificar que se clona correctamente

### Tarea 6.3: Trabajar en branches desde Databricks

1. En Databricks Repos, crear una branch nueva: `feature/ejecutar-en-databricks`
2. Modificar el notebook `jobs/analisis_inventario_mensual.py`
3. Ejecutarlo contra un cluster de Databricks
4. Si todo funciona, commitear desde Databricks Repos
5. Push al remoto

### Tarea 6.4: Verificar la sincronización

1. Volver a VSCode local
2. `git pull`
3. Verificar que los cambios desde Databricks aparecen
4. Crear un PR para mergear esa branch a main

---

## Parte 7: CI/CD funcionando

### Tarea 7.1: Verificar el workflow de lint

Tu workflow `.github/workflows/lint.yml` debe ejecutarse en cada PR. Verificar:

1. Que aparece como "check" en los PRs
2. Que falla cuando el código tiene errores de linting
3. Que pasa cuando el código está limpio

### Tarea 7.2: Hacer fallar el CI a propósito

1. Crear branch `experiment/codigo-feo`
2. Agregar código intencionalmente mal formateado (líneas largas, imports sin usar)
3. Hacer commit y push
4. Abrir un PR
5. Verificar que el CI falla
6. Leer el error del log

### Tarea 7.3: Arreglar y verificar

1. Arreglar el código formateando con Black localmente
2. Pushear los cambios
3. Verificar que el CI ahora pasa
4. Mergear el PR

---

## Parte 8: Documentación final

### Tarea 8.1: README profesional

Tu README final debe tener:

- Título y descripción del proyecto
- Estructura del repositorio
- Cómo instalar dependencias
- Cómo ejecutar el análisis localmente
- Cómo ejecutar en Databricks
- Sección de "Cómo contribuir" con el flujo de PR
- Contacto del dueño
- Sección de "Notas del proceso" con tu experiencia del módulo

### Tarea 8.2: Decisiones documentadas

Crear `docs/decisiones.md` con al menos 3 decisiones técnicas que tomaste durante el módulo:

```markdown
# Decisiones técnicas

## 1. [Título de la decisión]

**Contexto**: descripción del problema o situación.

**Decisión**: qué decidiste hacer.

**Razón**: por qué.

**Alternativas consideradas**: qué otras opciones había.

## 2. ...

## 3. ...
```

---

## Checklist de entrega

Antes de considerar la evaluación completada, verifica:

### Repositorio
- [ ] Repo creado en GitHub Enterprise
- [ ] Estructura de carpetas siguiendo Pilar 4
- [ ] README completo y útil
- [ ] .gitignore con exclusiones apropiadas
- [ ] PR template en `.github/`
- [ ] Workflow de lint en `.github/workflows/`

### Código
- [ ] Funciones en `lib/` con type hints y docstrings
- [ ] Notebook productivo en `jobs/`
- [ ] El código pasa el linter (Ruff y Black)
- [ ] El código se ejecuta correctamente en Databricks

### Git
- [ ] Commits limpios con mensajes descriptivos
- [ ] Branches con nombres descriptivos
- [ ] Al menos 3 PRs creados durante el módulo
- [ ] Al menos un conflicto resuelto exitosamente

### Colaboración
- [ ] Al menos un PR tuyo revisado por un colega
- [ ] Al menos un PR de un colega revisado por ti
- [ ] Feedback atendido y resuelto
- [ ] Issues linkeados con `Closes #X`

### Databricks
- [ ] Databricks Repo configurado
- [ ] Notebook ejecutado contra cluster real
- [ ] Sincronización VSCode ↔ Databricks funcionando
- [ ] Branches creadas desde Databricks

### CI/CD
- [ ] Workflow de lint funcionando
- [ ] CI fallando cuando debe fallar
- [ ] CI pasando cuando el código está limpio

### Documentación
- [ ] README con todas las secciones
- [ ] `docs/decisiones.md` con al menos 3 decisiones
- [ ] Comentarios apropiados en el código

---

## Cierre del módulo

Si llegaste hasta aquí, **felicitaciones**. Completaste el módulo de GitHub completo.

### Lo que sabes hacer ahora

Hace 8 sesiones no sabías la diferencia entre `git add` y `git commit`. Hoy puedes:

- Versionar tu trabajo con confianza
- Trabajar con branches sin perder código
- Colaborar con tu equipo mediante Pull Requests
- Hacer code reviews constructivos
- Resolver conflictos sin entrar en pánico
- Conectar VSCode + GitHub + Databricks en un workflow integrado
- Configurar CI/CD básico
- Recuperar trabajo perdido con `git reflog`
- Documentar tus decisiones técnicas

Esto NO es poco. Es la base completa para trabajar como analista colaborativo en CBC.

### Pero más importante: cambiaste tu forma de pensar

Antes pensabas en "guardar archivos". Ahora piensas en "commitear cambios con contexto".

Antes pensabas en "mandar mi versión por Slack". Ahora piensas en "abrir un PR para review".

Antes pensabas en "no tocar el código de otros". Ahora piensas en "colaborar via branches".

Esa es la verdadera transformación. Las herramientas son secundarias.

---

## Lo que viene

En el siguiente y último módulo (**Pilar 6: Power BI**) vas a cerrar el círculo completo del análisis de datos:

- Tomar los DataFrames que generas en Spark
- Convertirlos en dashboards interactivos
- Compartirlos con stakeholders del negocio
- Aplicar los mismos conceptos de versionamiento y colaboración

Cada pieza del programa Universidad Nexus encaja con la siguiente. Estás construyendo el toolkit completo del analista moderno en CBC.

---

## Reflexión final

Antes de terminar, tómate 5 minutos para reflexionar:

1. **¿Qué fue lo más difícil del módulo para ti?**
2. **¿Qué hábito vas a adoptar a partir de mañana?**
3. **¿Hay algún concepto que todavía no entiendes bien? Anótalo y pregúntalo.**
4. **¿Cómo cambia tu forma de trabajar con código a partir de hoy?**

Las respuestas a estas preguntas son tuyas. No las compartas si no quieres. Pero respóndetelas honestamente: son la guía de tu próximo paso de crecimiento como analista.

---

**Felicitaciones de nuevo.** Nos vemos en el Módulo 06.

---

*Universidad Nexus — Curso de GitHub para Analistas*
