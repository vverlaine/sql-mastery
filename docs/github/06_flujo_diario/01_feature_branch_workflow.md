---
sidebar_position: 2
title: El Feature Branch Workflow
---

# El Feature Branch Workflow

Hay muchas formas de organizar el trabajo con Git. Algunas son simples, otras complicadas. La que usa CBC (y la mayoría de los equipos modernos) se llama **feature branch workflow**. Esta lección te explica exactamente cómo funciona y por qué.

---

## Las reglas del workflow

El feature branch workflow tiene 4 reglas simples:

### Regla 1: `main` siempre está limpio

`main` es la branch oficial. Siempre debe estar en un estado funcional, listo para producción. Nunca commiteas directamente a `main`.

### Regla 2: Cada cambio vive en su propia branch

Cada feature, bug fix, refactor, o cambio de documentación tiene su propia branch creada desde `main`.

### Regla 3: Las branches son cortas

Una branch típica vive entre **horas y pocos días**, no semanas. Si una branch lleva más de una semana abierta, algo está mal: el alcance es muy grande, o estás bloqueado por algo, o el equipo no está revisando.

### Regla 4: Todo cambio entra a `main` por PR

Sin excepciones. Incluso un fix de una línea pasa por PR. La revisión es parte del estándar, no algo opcional.

---

## El ciclo completo de una tarea

Voy a mostrarte el ciclo de una tarea típica de inicio a fin. Imagina que tu lead te asigna esto:

> "Necesitamos agregar una métrica de margen por categoría al reporte mensual. Hay un issue en GitHub: #87."

### Paso 1: Leer el issue

Antes de tocar código, lee el issue completo en GitHub Enterprise:

- Qué se pide
- Cuáles son los criterios de aceptación
- Hay comentarios o discusión previa
- Hay tickets relacionados

Si el issue está incompleto, **pregunta en los comentarios** antes de empezar. No asumas.

### Paso 2: Sincronizar con main

Antes de crear tu branch, asegúrate de partir del estado más reciente:

```bash
cd ~/proyectos/proyecto-ventas
git switch main
git pull
```

Esto baja cualquier cambio que se haya hecho en `main` mientras tú no estabas mirando.

### Paso 3: Crear tu branch

El nombre de la branch debe ser descriptivo y seguir la convención del equipo:

```bash
git switch -c feature/agregar-margen-por-categoria
```

Algunos equipos en CBC incluyen el número del issue:

```bash
git switch -c feature/87-agregar-margen-por-categoria
```

> 💡 **Convención CBC común:** `<tipo>/<numero-issue>-<descripcion-corta>`

### Paso 4: Trabajar en commits pequeños

NO hagas todo el trabajo y luego un solo commit gigante. Divide en commits lógicos:

```bash
# Primero implementar la función
# ... código ...
git add lib/metricas.py
git commit -m "feat: agregar función calcular_margen_por_categoria"

# Después agregar tests
# ... código ...
git add tests/test_metricas.py
git commit -m "test: agregar tests para calcular_margen_por_categoria"

# Después integrar en el reporte
# ... código ...
git add jobs/reporte_mensual.py
git commit -m "feat: incluir margen por categoria en reporte mensual"

# Finalmente actualizar docs
git add README.md
git commit -m "docs: documentar nueva métrica de margen"
```

> 💡 **Por qué importan los commits pequeños:** si algo se rompe, puedes revertir UN commit pequeño en lugar de todo el trabajo. Y los reviews son más fáciles cuando cada commit hace una cosa clara.

### Paso 5: Hacer push frecuentemente

Cada vez que termines un commit lógico, pushea:

```bash
git push -u origin feature/agregar-margen-por-categoria
```

Después del primer push (con `-u`), basta con `git push`.

> 💡 **Hacer push frecuente sirve como backup.** Si tu computadora muere, tu trabajo está a salvo en el remoto.

### Paso 6: Crear el PR (incluso como draft)

No esperes a terminar todo para abrir el PR. Crea un **draft PR** desde temprano:

1. Después del primer push, abre GitHub Enterprise
2. Crea un draft PR con título y descripción
3. Incluye `Closes #87` para linkear el issue

Beneficios de abrir el draft temprano:

- El equipo sabe en qué estás trabajando
- Los CI checks corren contra tu código en cada push
- Si hay algún problema técnico, lo descubres temprano
- Tu lead puede dar feedback sobre el enfoque ANTES de que termines

### Paso 7: Sincronizar con main periódicamente

Mientras trabajas, `main` puede recibir cambios de otros. Para evitar conflictos al final, baja esos cambios a tu branch:

```bash
# Estás en feature/agregar-margen-por-categoria
git switch main
git pull
git switch feature/agregar-margen-por-categoria
git merge main
```

O la versión rápida:

```bash
git pull origin main
```

Si hay conflictos, resuélvelos AHORA, no al final.

> 💡 **Hacer esto cada 1-2 días reduce dramáticamente los conflictos.** Es uno de los hábitos más importantes para evitar dolor.

### Paso 8: Convertir el draft a ready

Cuando termines TODO el trabajo y verifiques que funciona localmente:

1. En GitHub, click en "Ready for review"
2. CODEOWNERS asigna reviewers automáticamente
3. Recibes notificación cuando alguien revisa

### Paso 9: Atender el feedback

Los reviewers van a dejar comentarios. Atiéndelos:

- Lee cada comentario
- Si estás de acuerdo, haz el cambio: edita, `git add`, `git commit`, `git push`
- Si no estás de acuerdo, responde explicando tu razón
- Marca como "resolved" cuando termines de atender cada hilo

### Paso 10: Mergear

Cuando todos los reviewers aprueban y los CI checks pasan:

1. Click en "Merge pull request" en GitHub
2. Elige el tipo de merge (squash, merge commit, rebase) según convención del equipo
3. Confirma

GitHub mergea tu PR, cierra el issue automáticamente (gracias al `Closes #87`) y borra la branch del remoto.

### Paso 11: Limpieza local

```bash
git switch main
git pull
git branch -d feature/agregar-margen-por-categoria
```

Ya no necesitas la branch local. Elimínala para mantener limpio tu repo.

---

## Antipatrones que destruyen el flujo

Estos son los hábitos que te van a meter en problemas. Evítalos.

### ❌ Trabajar directamente en main

```bash
# MAL
git switch main
# ... editar archivos ...
git add .
git commit -m "cambios"
git push origin main
```

Esto rompe TODO el sistema de revisión. Y en CBC main suele estar protegido, así que el push fallará.

### ❌ Branches de larga duración

```bash
# Branch creada hace 3 semanas
git switch feature/refactor-completo

# Commits cada 2-3 días
# Sin sincronizar con main
# Con 50 archivos modificados
```

Resultado: cuando intentes mergear, tendrás cientos de conflictos. Y nadie te va a poder revisar bien un PR de 3000 líneas.

### ❌ Mezclar varios cambios en una sola branch

```bash
git switch -c misc-changes
# Arreglas un bug
# Agregas una feature nueva
# Refactorizas otra cosa
# Actualizas docs
# Todo en commits mezclados
```

Cuando alguien revise, va a ser imposible dar feedback claro. Y si necesitas revertir solo una parte, no podrás.

**Solución:** una branch por cambio.

### ❌ Commits gigantes sin contexto

```bash
git add .
git commit -m "cambios"
```

¿Qué cambió? ¿Por qué? ¿Para qué? Sin contexto, el historial es inútil.

**Solución:** mensajes descriptivos siguiendo la convención.

### ❌ "Olvidar" hacer pull antes de push

```bash
# Tu local
git push
# Error: updates were rejected
git pull
# Conflictos masivos
```

**Solución:** `git pull` antes de empezar el día Y antes de hacer push.

### ❌ Usar git push --force en branches compartidas

```bash
git push --force origin main
```

Esto puede destruir el trabajo de OTROS que estaban trabajando sobre la versión anterior. **Nunca** force push en branches compartidas.

### ❌ Borrar el .git/ por desesperación

Cuando algo sale mal, hay analistas que borran la carpeta `.git/` y empiezan de cero. **Nunca hagas esto**. Pierdes todo el historial. Y casi siempre hay una solución de Git que es menos drástica.

**Solución:** pregunta. Hay comandos de recuperación para casi cualquier situación.

---

## Hábitos que te hacen flow

Ahora los hábitos opuestos: los que te hacen trabajar bien con Git.

### ✅ Pull al inicio del día

Empieza siempre con `git pull` en main para tener lo más reciente.

### ✅ Branches con un solo propósito

Cada branch debe poder describirse en una frase corta. Si necesitas una conjunción ("y"), probablemente son dos branches.

### ✅ Commits pequeños y frecuentes

10 commits al día > 1 commit al final del día. Cada commit es una "checkpoint" a la que puedes volver.

### ✅ Mensajes descriptivos

Tómate 10 segundos extra para escribir un buen mensaje de commit. Tu yo del futuro te lo agradece.

### ✅ Sincronizar con main cada 1-2 días

Si la branch va a vivir más de un día, baja main periódicamente.

### ✅ Draft PRs desde temprano

Abre el draft PR el primer día de trabajo, no el último. Da visibilidad y feedback temprano.

### ✅ Limpiar branches viejas

Cada viernes (o el momento que prefieras), borra las branches locales que ya no usas:

```bash
git branch -d feature/algo-que-ya-mergee
git branch -d feature/otra-cosa-mergeada
```

Para limpiar TODAS las branches que ya fueron mergeadas a main:

```bash
git branch --merged | grep -v "main" | xargs git branch -d
```

### ✅ Pedir ayuda cuando estás atascado

Git es complejo. Si llevas más de 30 minutos atascado en algo, **pregunta**. No hay vergüenza. Todos los desarrolladores experimentados pasaron por ahí.

---

## El check de fin de día

Antes de cerrar tu computadora cada día, verifica:

```bash
# 1. ¿Tengo cambios sin commitear?
git status

# 2. Si tengo, ¿debería hacerles commit?
git add ...
git commit -m "..."

# 3. ¿Mi branch está pusheada?
git push

# 4. ¿Cuál es mi estado actual?
git log --oneline -5
```

Este check de 60 segundos te ahorra muchos dolores de cabeza al día siguiente.

---

## Git no es magia: cuándo pedir ayuda

Hay situaciones en las que NO debes intentar arreglar las cosas tú solo:

### Cuando rompiste algo en main

Si pusheaste un cambio que rompió main, **avisa al equipo inmediatamente**. No intentes arreglarlo sin coordinarse, puedes empeorarlo.

### Cuando viste un mensaje raro de Git

Si Git te muestra un mensaje que no entiendes ("detached HEAD", "merge in progress", etc.), pausa. No ejecutes más comandos. Pregunta.

### Cuando perdiste commits

Si crees que perdiste trabajo, **NO sigas trabajando**. Hay formas de recuperar (git reflog), pero solo si no escribes encima.

### Cuando algo se siente "extraño"

Si tu intuición te dice que algo está mal pero no sabes qué, confía en ella. Pregunta.

---

## 🎯 Tareas

**Tarea 1:** Practica el flujo completo de inicio a fin: pull main → crear branch → trabajar → commits → push → PR → mergear.

**Tarea 2:** Identifica qué antipatrón has cometido tú en el pasado. Comprométete a cambiarlo.

**Tarea 3:** Crea un "ritual de inicio del día" personal con los pasos de Git que vas a hacer cada mañana.

**Tarea 4:** Limpia tus branches locales mergeadas con el comando del final de la lección.

**Tarea 5:** Pregunta a tu lead cuál es la convención exacta de naming de branches en tu equipo CBC. Adopta esa convención.

---

*Universidad Nexus — Curso de GitHub para Analistas*
