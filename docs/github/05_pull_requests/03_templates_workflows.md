---
sidebar_position: 4
title: Templates y Workflows Avanzados
---

# Templates y Workflows Avanzados

Hasta ahora viste cómo crear y revisar PRs uno por uno. Esta lección te enseña algunas funcionalidades avanzadas que hacen tu vida con PRs mucho más fácil: templates, draft PRs, y workflows automatizados.

---

## PR Templates

Un **template de PR** es una plantilla que GitHub usa automáticamente cuando alguien abre un PR nuevo. Te asegura que todos los PRs del equipo tengan una estructura consistente.

### Crear un template

En tu repo, crea un archivo en esta ruta exacta:

```
.github/PULL_REQUEST_TEMPLATE.md
```

Contenido recomendado para análisis de datos:

```markdown
## ¿Qué cambia?

<!-- Describe brevemente qué hace este PR -->

## ¿Por qué?

<!-- Contexto: por qué es necesario, qué problema resuelve, qué mejora aporta -->

## ¿Cómo se prueba?

<!-- Pasos para validar que el cambio funciona correctamente -->

1. 
2. 
3. 

## Tipo de cambio

- [ ] Nueva funcionalidad (feature)
- [ ] Corrección de bug (fix)
- [ ] Refactor (sin cambio de comportamiento)
- [ ] Documentación
- [ ] Configuración / mantenimiento

## Checklist

- [ ] El código fue probado localmente
- [ ] Se ejecutaron las pruebas existentes y pasan
- [ ] Se actualizó la documentación si aplica
- [ ] No hay secretos hardcoded
- [ ] El nombre de la branch sigue la convención del equipo

## Notas adicionales

<!-- Cualquier cosa relevante: tickets relacionados, decisiones tomadas, etc. -->
```

### Cómo funciona

Cuando alguien crea un PR nuevo en este repo, GitHub automáticamente llena el campo de descripción con el contenido del template. El autor solo tiene que reemplazar los placeholders con la información real.

> 💡 **Beneficio:** todos los PRs del repo quedan con la misma estructura, mismas secciones, mismo nivel de detalle. Reduce la fricción del autor (no tiene que pensar qué incluir) y mejora la calidad de los PRs.

### Templates múltiples

Si tu equipo tiene tipos muy distintos de PRs (features, bugs, hotfixes), puedes crear varios templates en una carpeta:

```
.github/PULL_REQUEST_TEMPLATE/
├── feature.md
├── bugfix.md
└── hotfix.md
```

GitHub te permite seleccionar qué template usar al crear el PR, agregando un parámetro a la URL: `?template=feature.md`.

---

## Draft Pull Requests

Un **draft PR** es un PR que NO está listo para review todavía. Es como decir: "estoy trabajando en esto, lo subo para que lo vean en progreso, pero aún no lo aprueben".

### Cuándo usar draft PRs

- **Trabajo en progreso visible**: querés que el equipo sepa en qué estás trabajando, pero no terminaste
- **Pedir feedback temprano**: querés opinión sobre el enfoque ANTES de terminar todo
- **Validar CI/CD**: querés que las pruebas automáticas se ejecuten contra tus cambios para asegurarte que pasan
- **Coordinación**: avisar al equipo "estoy tocando este archivo, no lo modifiquen mientras tanto"

### Crear un draft PR

Cuando llegas al botón verde "Create pull request", hay una flecha pequeña a la derecha. Click en ella → "Create draft pull request".

El PR se crea con estado "Draft". GitHub muestra claramente que NO está listo para mergear.

### Convertir draft a ready

Cuando termines tu trabajo y quieras pedir review:

1. Abre el PR en GitHub
2. Click en el botón "Ready for review" abajo de la descripción

El PR cambia a estado normal y los reviewers pueden empezar a revisarlo.

> 💡 **Patrón recomendado:** crea draft PRs desde el día 1 cuando empieces algo grande. Los conviertes en ready solo cuando estás seguro que está listo. Mientras tanto, todos saben que estás trabajando en eso.

---

## Linkear PRs con issues

GitHub Enterprise tiene **Issues**: tickets para reportar bugs, pedir features, o trackear tareas. Cuando un PR resuelve un issue, puedes linkearlos para que se cierre automáticamente.

### Sintaxis para linkear

En la descripción del PR, incluye una de estas frases:

```
Closes #42
Fixes #123
Resolves #7
```

Donde `#42` es el número del issue. Cuando el PR se mergee, el issue se cierra automáticamente.

### Cómo encontrar el número del issue

En GitHub Enterprise → tab "Issues" → cada issue tiene un número visible.

### Múltiples issues

```
Closes #42
Closes #43
Fixes #44
```

### Issues de otros repos

```
Closes equipo-data/otro-repo#42
```

> 💡 **En CBC, los repos importantes usan issues para todo.** Antes de empezar a trabajar en algo, busca si hay un issue. Si no hay, créalo. Te da trazabilidad completa: del issue → al PR → al merge → al cambio en producción.

---

## CODEOWNERS: revisores automáticos

Un archivo especial llamado `CODEOWNERS` te permite definir QUIÉN debe revisar qué partes del repo automáticamente.

### Crear el archivo

Ruta exacta:

```
.github/CODEOWNERS
```

### Sintaxis

```
# Reglas globales
# Cualquier cambio en el repo requiere review de @maria
*       @maria

# Reglas específicas por carpeta
# Cambios en lib/ requieren review de @carlos
/lib/   @carlos

# Cambios en jobs/ requieren review de los DOS leads
/jobs/  @maria @carlos

# Cambios en docs solo requieren review de @ana
/docs/  @ana

# Cambios en tests requieren review de cualquier persona del equipo de QA
/tests/ @cbc/equipo-qa
```

### Cómo funciona

Cuando alguien abre un PR, GitHub automáticamente asigna como reviewers a las personas listadas en CODEOWNERS según qué archivos modificó. El PR no se puede mergear hasta que esos owners lo aprueben.

> 💡 **Ventaja:** no dependes de que la persona se acuerde de asignarte reviewers. El sistema lo hace solo según las reglas del equipo.

---

## GitHub Actions: validaciones automáticas

GitHub Actions es el sistema de CI/CD de GitHub. Te permite ejecutar acciones automáticas cuando algo pasa en tu repo: alguien hace push, abre un PR, mergea algo, etc.

Las acciones más comunes para análisis de datos:

### Linting automático

Cada vez que alguien abre un PR, GitHub ejecuta Ruff y Black sobre el código. Si hay errores de estilo, el PR muestra "Failed checks" y no se puede mergear.

### Tests automáticos

Si el repo tiene tests, GitHub los ejecuta automáticamente. Si fallan, el PR tampoco se puede mergear.

### Validaciones de seguridad

GitHub puede detectar secretos hardcoded, dependencias vulnerables, y problemas comunes de seguridad.

### Configuración

Los workflows de GitHub Actions viven en:

```
.github/workflows/
├── lint.yml
├── tests.yml
└── deploy.yml
```

Cada archivo `.yml` define un workflow. Tu equipo de plataforma probablemente ya configuró los workflows estándar para CBC. Tu trabajo como analista es entender qué validan, no necesariamente escribirlos desde cero.

> 💡 **Si los checks fallan en tu PR:** abre el detalle del check (click en el link "Details"). GitHub te muestra exactamente qué falló y por qué. Arregla la causa, pushea, y los checks se vuelven a ejecutar automáticamente.

---

## Branch protection rules

GitHub Enterprise permite configurar **reglas de protección** para branches importantes (típicamente `main`). Estas reglas hacen que ciertas operaciones sean imposibles, incluso para administradores.

Reglas comunes en CBC:

- **Require pull request before merging**: nadie puede pushear directamente a `main`. Todo debe pasar por PR.
- **Require approvals**: el PR necesita al menos N aprobaciones antes de poder mergearse.
- **Require status checks to pass**: los CI checks deben pasar antes de mergear.
- **Require branches to be up to date**: tu branch debe estar sincronizada con `main` antes de mergear.
- **Require conversation resolution**: todos los comentarios del PR deben estar marcados como resueltos.
- **Restrict who can push to matching branches**: solo ciertas personas pueden pushear directamente.

> 💡 **Como analista no vas a configurar estas reglas**, pero es bueno entenderlas. Si te sale un mensaje "Push declined due to branch protection", significa que estás violando alguna de estas reglas.

---

## El flujo profesional completo

Ya tienes todas las piezas. Vamos a ver cómo se ve un flujo profesional completo en CBC:

```
1. Lees el issue que te asignaron en GitHub
2. Entiendes el contexto y los criterios de aceptación
3. git switch main && git pull
4. git switch -c feature/nombre-descriptivo
5. Trabajas, commits pequeños frecuentes
6. git push -u origin feature/nombre-descriptivo
7. Abres un draft PR linkeado al issue (Closes #X)
8. Los CI checks corren automáticamente
9. Si los checks fallan, los arreglas
10. Cuando todo está listo, conviertes el draft a ready
11. CODEOWNERS asigna reviewers automáticos
12. Recibes feedback, haces cambios, pusheas
13. Reviewers aprueban
14. Mergeas con squash and merge
15. La branch se borra automáticamente
16. El issue se cierra automáticamente
17. git switch main && git pull && git branch -d feature/nombre
```

Este flujo es lo que pasa CADA VEZ que haces algo en CBC. En 2 semanas se vuelve automático.

---

## Métricas que importan

Algunos indicadores de salud de cómo trabajas con PRs:

### Tamaño promedio de PR
- **< 200 líneas cambiadas**: ideal
- **200-500**: aceptable
- **> 500**: probablemente debería ser varios PRs

### Tiempo de PR abierto
- **< 24 horas**: ideal
- **1-3 días**: aceptable
- **> 1 semana**: algo está mal (PR muy grande, equipo no revisa, requisitos cambiando)

### Número de commits por PR
- **1-10 commits**: típico
- **> 30 commits**: probablemente fue squash and merge

### Comentarios por PR
- **0 comentarios**: el reviewer no leyó realmente, o el PR es trivial
- **3-15 comentarios**: review saludable
- **> 30 comentarios**: PR muy grande o discusión que debería ser síncrona

> 💡 **Estas métricas son solo indicadores.** No las uses como castigo. Úsalas para identificar patrones que se pueden mejorar.

---

## 🎯 Tareas

**Tarea 1:** En tu repo de práctica, crea un archivo `.github/PULL_REQUEST_TEMPLATE.md` con la plantilla recomendada. Hazle commit y push.

**Tarea 2:** Crea una branch nueva, hazle un cambio simple, y abre un PR. Verifica que la descripción se llena automáticamente con el template.

**Tarea 3:** Crea otra branch, hazle un commit, y abre un PR como **draft**. Verifica que aparece como "Draft".

**Tarea 4:** Convierte el draft a "Ready for review".

**Tarea 5:** En GitHub Enterprise, crea un issue con cualquier descripción. Anota el número.

**Tarea 6:** Crea un PR cuya descripción incluya `Closes #<numero>`. Mergea el PR. Verifica que el issue se cierra automáticamente.

**Tarea 7:** Investiga si el repo de tu equipo en CBC tiene un archivo `CODEOWNERS`. Si lo tiene, entiende qué reglas aplica.

---

*Universidad Nexus — Curso de GitHub para Analistas*
