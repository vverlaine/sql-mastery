---
sidebar_position: 2
title: Crear tu Primer Pull Request
---

# Crear tu Primer Pull Request

Un **Pull Request** (PR) es una propuesta formal de mergear cambios de una branch a otra. En la práctica funciona así: tú trabajas en una branch, la pusheas a GitHub, y abres un PR pidiendo que tus cambios se integren a `main`. Tu equipo revisa, discute, sugiere mejoras, y cuando todos están de acuerdo, los cambios se mergean.

Es la forma profesional de colaborar en código. Todos los repositorios serios de CBC lo usan.

---

## ¿Por qué Pull Requests?

Imagínate que mergeas directamente a `main` cada vez que terminas algo. Funciona, pero tiene problemas serios:

- **Nadie revisa tu código** antes de que entre a producción
- **Errores obvios** se cuelan al código oficial
- **No hay discusión** sobre decisiones técnicas
- **No queda registro** del por qué de los cambios
- **No hay forma de validar** que el código pasa las pruebas

Con Pull Requests, todo eso se resuelve:

- **Code review obligatorio**: alguien tiene que aprobar antes de mergear
- **Conversación documentada**: comentarios y discusiones quedan en el PR
- **Validaciones automáticas**: GitHub puede correr pruebas, linters, etc.
- **Trazabilidad completa**: sabes quién aprobó qué y cuándo
- **Calidad mejorada**: dos pares de ojos siempre encuentran más bugs que uno

> 💡 **En CBC todos los merges a `main` deben pasar por PR.** No es opcional. Es parte del estándar de calidad del equipo.

---

## El flujo completo de un Pull Request

Vamos a ver el flujo de principio a fin con un ejemplo realista.

### Paso 1: Crear una branch para tu trabajo

Estás en `main`, listo para empezar algo nuevo:

```bash
git switch main
git pull
git switch -c feature/agregar-metricas-roi
```

### Paso 2: Hacer tus cambios y commits

```bash
# Editar archivos...
git add .
git commit -m "feat: agregar cálculo de ROI por categoría"

# Más cambios...
git add .
git commit -m "feat: incluir ROI en reporte mensual"

# Más cambios...
git add .
git commit -m "docs: documentar nueva métrica en README"
```

### Paso 3: Push de tu branch al remoto

```bash
git push -u origin feature/agregar-metricas-roi
```

Cuando termina, Git te muestra un mensaje útil:

```
remote: Create a pull request for 'feature/agregar-metricas-roi' on GitHub by visiting:
remote:      https://github.cbc.com/equipo-data/proyecto/pull/new/feature/agregar-metricas-roi
```

Ese link te lleva directamente a la página de creación del PR.

### Paso 4: Abrir el PR en GitHub Enterprise

Hay tres formas de llegar a la página de creación:

**Opción A**: Click en el link que Git te dio en el push.

**Opción B**: Ve a tu repo en GitHub Enterprise. Después de pushear, GitHub muestra un banner amarillo arriba: "feature/agregar-metricas-roi had recent pushes. Compare & pull request". Click en el botón verde.

**Opción C**: Manualmente. Ve al repo → tab `Pull requests` → `New pull request` → selecciona las branches.

### Paso 5: Llenar el formulario del PR

GitHub te muestra un formulario con varios campos:

#### Title (título)

Debe ser corto y descriptivo. Ideal: usa el formato de commit messages.

```
feat: agregar cálculo de ROI por categoría
```

#### Description (descripción)

Aquí describes el contexto completo del cambio. **No escatimes**: una buena descripción ahorra horas a quien revisa.

Estructura recomendada:

```markdown
## ¿Qué cambia?

Agrega el cálculo de ROI (Return on Investment) por categoría de producto
en el reporte mensual. Esto incluye:

- Nueva función `calcular_roi()` en `lib/metricas.py`
- Modificación del notebook `jobs/reporte_mensual.py` para incluirla
- Documentación actualizada en el README

## ¿Por qué?

El equipo de finanzas pidió esta métrica en la reunión del 5 de abril
(ver tickets DATA-1234). Permite identificar qué categorías generan
mejor retorno y orientar decisiones de inventario.

## ¿Cómo se prueba?

1. Ejecutar `jobs/reporte_mensual.py` con `mes_objetivo = 2024-03`
2. Verificar que el output incluye una columna `roi` por categoría
3. Validar contra el cálculo manual de Excel del equipo de finanzas

## Notas adicionales

- El cálculo asume que el costo viene de la columna `costo_unitario`
  de la tabla `productos`. Si esa columna cambia de nombre, hay que
  actualizar la función.
- No afecta los reportes existentes, solo agrega una columna nueva.
```

> 💡 **Una buena descripción de PR es lo que separa el trabajo profesional del trabajo amateur.** Tu yo del futuro te lo va a agradecer cuando busques en el historial.

#### Reviewers (revisores)

Selecciona a quién quieres que revise. En CBC suele ser tu lead técnico o algún colega del equipo. Algunos repos tienen reviewers automáticos configurados.

#### Assignees (asignados)

Tú mismo, normalmente. Indica quién es responsable del PR (no quién lo revisa).

#### Labels (etiquetas)

Etiquetas opcionales para clasificar el PR: `feature`, `bug`, `documentation`, etc.

#### Milestone

Si el repo usa milestones (fases del proyecto), seleccionas a cuál pertenece este cambio.

### Paso 6: Click en "Create pull request"

¡Listo! Tu PR está abierto. GitHub le asigna un número (ej: #42) y empieza el proceso de revisión.

---

## Lo que pasa después de crear el PR

Una vez creado, varias cosas pueden ocurrir:

### Validaciones automáticas (CI/CD)

Si el repo tiene GitHub Actions configuradas, automáticamente se ejecutan:

- **Linting** (Ruff, Black)
- **Tests** automatizados
- **Build checks** del proyecto
- **Análisis de seguridad**

Estas validaciones aparecen en el PR como checks. Si alguna falla, GitHub te lo dice claramente. Tienes que arreglar lo que falle antes de poder mergear.

> 💡 **Si los tests fallan, NO insistas en mergear.** Arregla la causa. Los tests están ahí por una razón.

### Comentarios de los revisores

Tus reviewers van a leer tu código y dejar comentarios. Pueden ser:

- **Sugerencias**: "Esto se podría hacer más simple así..."
- **Preguntas**: "¿Por qué usaste `withColumn` aquí en lugar de `select`?"
- **Bloqueantes**: "Esto rompe el cálculo del IVA, no podemos mergear hasta arreglarlo"
- **Aprobaciones**: "Looks good to me 👍"

Tú respondes a los comentarios, haces los cambios necesarios, pusheas las correcciones, y el PR se actualiza automáticamente.

---

## Hacer cambios después de abrir el PR

Es muy normal que después de revisar tu PR, alguien pida cambios. Para hacerlos:

```bash
# Asegúrate de estar en la branch del PR
git switch feature/agregar-metricas-roi

# Haz los cambios solicitados
# ... editar archivos ...

# Commitea
git add .
git commit -m "fix: ajustar fórmula de ROI según review"

# Push
git push
```

Eso es todo. El PR se actualiza automáticamente con tu nuevo commit. Los revisores reciben una notificación.

> 💡 **No tienes que cerrar y abrir un PR nuevo cuando haces cambios.** El PR vive mientras la branch viva. Solo pusheas y se actualiza.

---

## Anatomía de un PR en GitHub Enterprise

Cuando abres un PR existente en GitHub, vas a ver varias tabs:

### Conversation
La discusión completa: descripción, comentarios, eventos (commits, reviews, etc.).

### Commits
Lista de todos los commits que están incluidos en el PR.

### Checks
Estado de las validaciones automáticas (GitHub Actions, etc.).

### Files changed
La vista más importante. Muestra el diff completo de todos los archivos modificados, lado a lado. Aquí es donde los reviewers leen tu código.

> 💡 **Tip:** la tab "Files changed" tiene un selector para ver "Unified" (cambios uno encima del otro) o "Split" (lado a lado). Usa el que te resulte más cómodo.

---

## Buenas prácticas al crear PRs

### 1. Mantén los PRs PEQUEÑOS

Un PR de 50 líneas se revisa en 10 minutos. Un PR de 2000 líneas no se revisa nunca (o se revisa mal). Si tu trabajo es grande, divídelo en varios PRs pequeños.

### 2. Un PR = una idea

No mezcles cambios no relacionados. Si quieres agregar una métrica nueva Y arreglar un bug, son DOS PRs separados.

### 3. Título y descripción son obligatorios

Nunca abras un PR con título "fix" o descripción vacía. Es una falta de respeto al tiempo de quien va a revisar.

### 4. Verifica tu propio PR antes de pedir review

Una vez creado el PR, abre la tab "Files changed" y léelo TÚ mismo. Vas a encontrar errores tipográficos, comentarios olvidados, código de prueba que no debiste subir. Arréglalos antes de pedir review.

### 5. Responde a los comentarios

Cuando un reviewer comenta, respóndele. Aunque sea solo "Buen punto, lo cambio". Los comentarios sin respuesta hacen sentir que no escuchas.

### 6. No te ofendas con los reviews

Los reviews son sobre el código, no sobre ti. Si alguien dice "este código se puede mejorar", no significa "eres mal analista". Significa "este código se puede mejorar". Acepta el feedback con apertura.

### 7. Cierra los PRs viejos

Si abriste un PR y ya no lo vas a continuar, ciérralo. Los PRs abandonados llenan el repo y confunden al equipo.

---

## Antipatrones comunes (qué NO hacer)

### ❌ Crear un PR gigante después de 3 semanas de trabajo

Nadie te lo va a revisar bien. Abre PRs pequeños y frecuentes desde el día 1.

### ❌ Pushear cosas sin revisar al PR

Cada commit que agregas debe ser intencional. No pushes "para ver qué pasa".

### ❌ Mergear sin esperar review

Aunque tengas permisos para hacerlo, la regla del equipo es: review antes de merge. Saltarse esto erosiona la confianza del equipo.

### ❌ Discutir decisiones técnicas en el chat sin documentar

Si decidiste algo importante en una conversación de Slack, copia esa decisión a los comentarios del PR. Así queda registro.

### ❌ Cerrar un PR sin mergearlo y sin explicar

Si descartas un PR, deja un comentario explicando por qué. "Decidimos no implementar esta feature porque...". Sin explicación, los demás no entienden.

---

## VSCode + Pull Requests

VSCode tiene una extensión oficial llamada **GitHub Pull Requests and Issues** que te permite manejar PRs sin salir del editor. Vale la pena instalarla:

1. Abre la marketplace de extensiones (`Cmd/Ctrl + Shift + X`)
2. Busca "GitHub Pull Requests and Issues"
3. Instala la oficial de GitHub

Después de instalarla, en la Activity Bar aparece un icono de GitHub. Desde ahí puedes:

- Ver los PRs abiertos del repo
- Crear PRs nuevos sin salir de VSCode
- Revisar PRs de tus colegas
- Comentar líneas de código
- Aprobar / rechazar PRs

Para CBC, necesitas configurar la extensión con la URL de GitHub Enterprise (no es github.com público). La extensión te guía en eso al primer uso.

> 💡 **Mi recomendación:** para PRs cortos, GitHub Enterprise web es más cómodo. Para revisar PRs grandes con muchos archivos, VSCode con la extensión es mejor porque puedes navegar entre archivos como si fueran tuyos.

---

## 🎯 Tareas

**Tarea 1:** En tu repo de práctica conectado con GitHub Enterprise, crea una branch nueva `feature/agregar-seccion-instalacion`.

**Tarea 2:** Agrega una sección al README sobre cómo instalar el proyecto. Hazle commit.

**Tarea 3:** Pushea la branch al remoto.

**Tarea 4:** Abre un Pull Request en GitHub Enterprise. Llena el título y la descripción siguiendo la estructura recomendada.

**Tarea 5:** Verifica que el PR aparece con tu commit y los archivos cambiados.

**Tarea 6:** Pide a un colega que revise tu PR (puede dejar comentarios o aprobarlo).

**Tarea 7:** Si recibes feedback, haz los cambios localmente, commitea y pushea. Verifica que el PR se actualiza automáticamente.

**Tarea 8:** Instala la extensión "GitHub Pull Requests and Issues" en VSCode y configúrala con GitHub Enterprise.

---

*Universidad Nexus — Curso de GitHub para Analistas*
