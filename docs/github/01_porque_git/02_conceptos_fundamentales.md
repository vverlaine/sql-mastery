---
sidebar_position: 3
title: Los Conceptos Fundamentales
---

# Los Conceptos Fundamentales

Git tiene su propio vocabulario. Antes de tocar ningún comando, vamos a entender los 6 conceptos que necesitas dominar. Si entiendes estos 6, entiendes Git al 80%. Todo lo demás son detalles.

---

## 1. Repositorio (Repository, "repo")

Un **repositorio** es una carpeta de tu computadora que Git está vigilando. Cuando una carpeta se convierte en repositorio, Git empieza a llevar registro de todos los cambios que ocurren dentro de ella.

Visualmente:

```
📁 mi_proyecto_analisis/   ← carpeta normal
    ├── analisis.py
    └── README.md

📁 mi_proyecto_analisis/   ← repositorio Git (después de inicializarlo)
    ├── .git/              ← carpeta oculta donde Git guarda todo
    ├── analisis.py
    └── README.md
```

La diferencia es la carpeta oculta `.git/`. Es el "cerebro" del repositorio: ahí Git guarda todo el historial, las versiones, las branches, todo. Tú nunca tocas esta carpeta directamente. Git la maneja sola.

> 💡 **Punto importante:** un repositorio NO es algo abstracto en GitHub. Es tu carpeta local con la magia adentro. GitHub es solo un lugar donde puedes hospedar una COPIA de tu repositorio.

---

## 2. Working Directory (área de trabajo)

El **working directory** es tu carpeta normal: donde editas archivos, agregas nuevos, borras los que ya no usas. Es lo que ves en VSCode o en tu explorador de archivos.

Cuando modificas `analisis.py`, ese cambio existe en tu working directory. Pero todavía NO es parte del historial de Git. Es solo un cambio "en vivo" que está esperando.

```
Working Directory
├── analisis.py    ← lo modificaste (cambio pendiente)
├── README.md      ← sin cambios
└── nuevo.py       ← nuevo archivo (no rastreado)
```

> 💡 **Analogía:** piensa en el working directory como tu escritorio físico. Tienes papeles encima del escritorio, los mueves, escribes en ellos. Pero hasta que no los archives en el archivador, no son parte del registro permanente.

---

## 3. Staging Area (área de preparación)

Aquí viene el concepto que MÁS confunde a la gente al inicio. Y también es donde Git muestra su elegancia.

Entre tu working directory y el historial permanente, Git tiene un **área intermedia** llamada **staging area** (también conocida como "index"). Es como una zona de espera donde decides QUÉ cambios quieres incluir en tu próximo commit.

```
Working Directory          Staging Area              Historial (commits)
├── analisis.py (mod)  →   ├── analisis.py     →     [commits anteriores]
├── README.md (mod)        │                          
├── nuevo.py (nuevo)       │                          
└── borrador.txt (mod)     
```

En el ejemplo: modificaste 4 archivos. Pero al hacer staging, decides incluir solo `analisis.py` en tu próximo commit. Los otros 3 cambios siguen pendientes para futuros commits.

### ¿Por qué existe el staging area?

Porque te permite **agrupar cambios relacionados** en commits coherentes. Imagínate que en una sesión hiciste tres cosas distintas:

1. Arreglaste un bug en `analisis.py`
2. Agregaste una nueva función en `utils.py`
3. Mejoraste la documentación en `README.md`

Sin staging area, tendrías que hacer un solo commit gigante con todos esos cambios. Con staging area, puedes hacer 3 commits separados, cada uno con su contexto:

- Commit 1: "Fix: corregir cálculo de margen en análisis de ventas"
- Commit 2: "Feature: agregar función de validación de fechas"
- Commit 3: "Docs: actualizar README con instrucciones de instalación"

Mucho más limpio. Mucho más útil cuando alguien revisa el historial.

> 💡 **Analogía:** si el working directory es tu escritorio, el staging area es la bandeja de "para archivar" antes de que mandes los papeles al archivador permanente.

---

## 4. Commit

Un **commit** es una "foto instantánea" de tu proyecto en un momento específico. Es la unidad básica del historial de Git.

Cuando haces un commit, Git toma todo lo que está en tu staging area y lo guarda permanentemente con:

- Un identificador único (un hash como `a3f5c8d9...`)
- La fecha y hora exacta
- El autor (tú)
- Un mensaje que tú escribes explicando qué cambió y por qué
- Una referencia al commit anterior (esto crea la "cadena" del historial)

```
Commit a3f5c8d9
Autor: Tu Nombre
Fecha: 2024-04-07 10:15:23
Mensaje: "Agregar función para calcular margen por categoría"

Cambios:
+ analisis.py: 12 líneas agregadas
- analisis.py: 3 líneas eliminadas
```

Cada commit es un punto en el tiempo al que puedes regresar. **Esto es el corazón de Git**: el historial es una cadena de commits, y siempre puedes volver a cualquiera de ellos.

### Anatomía de un buen commit message

El mensaje del commit es lo que tu yo del futuro (o tus colegas) van a leer cuando intenten entender el historial. Hay convenciones para escribirlos bien:

```
[tipo]: descripción corta en presente

(opcional) Explicación más larga del por qué del cambio,
cuál era el problema que resolvía, decisiones que tomaste.
```

Tipos comunes:

- `feat`: nueva funcionalidad
- `fix`: corrección de un bug
- `docs`: cambios en documentación
- `refactor`: reorganización del código sin cambiar comportamiento
- `style`: cambios de formato
- `test`: agregar o modificar pruebas
- `chore`: tareas de mantenimiento

Ejemplos buenos:

```
feat: agregar cálculo de margen por categoría

Era el indicador que faltaba en el reporte mensual.
Solicitud del equipo de finanzas en reunión del 5 abril.
```

```
fix: corregir filtrado de fechas en análisis Q1

El filtro anterior excluía las ventas del último día
del trimestre por usar < en vez de <=.
```

Ejemplos malos (no hagas esto):

```
cambios
arreglos
asdf
WIP
trabajando
update final
```

> 💡 **Regla simple:** si tu commit message no le dice a un colega qué cambió y por qué, está mal escrito.

---

## 5. Branch (rama)

Una **branch** es una línea independiente de desarrollo. Es como una "copia paralela" de tu proyecto donde puedes hacer cambios sin afectar la versión principal.

Visualmente:

```
main:        A---B---C---D---E
                      \
feature:               F---G---H
```

`main` es la branch principal (donde vive el código "oficial"). `feature` es una branch que se separó en el commit C, donde alguien está trabajando en una nueva funcionalidad. Mientras esa persona trabaja en `feature`, `main` puede seguir avanzando independientemente.

### ¿Para qué sirven las branches?

- **Experimentar sin riesgo**: pruebas una idea en una branch nueva. Si funciona, la mergeas a main. Si no, la borras.
- **Trabajar en paralelo**: tú estás en una branch, tu colega en otra. Nadie pisa el trabajo del otro.
- **Separar contextos**: una branch para cada feature o cada bug fix.
- **Aprobar antes de incluir**: antes de mergear una branch a main, alguien revisa los cambios.

> 💡 **Analogía:** las branches son como universos paralelos de tu proyecto. En este universo agregaste una funcionalidad. En aquel otro arreglaste un bug. Cuando estás listo, traes el universo paralelo de vuelta al universo principal (eso es el merge).

### La branch principal: main

Tradicionalmente se llamaba `master`. Hoy en día la convención moderna es llamarla `main`. Es la branch "oficial" donde vive el código que está en producción o listo para producción.

En CBC vas a ver las dos: repositorios viejos pueden tener `master`, los nuevos usan `main`. Funcionan exactamente igual.

---

## 6. Merge

**Merge** es el proceso de combinar dos branches. Cuando terminas de trabajar en tu branch `feature`, la "fusionas" con `main` para que tus cambios sean parte del código oficial.

Visualmente:

```
ANTES del merge:

main:        A---B---C---D---E
                      \
feature:               F---G---H

DESPUÉS del merge:

main:        A---B---C---D---E---M
                      \         /
feature:               F---G---H
```

`M` es el "commit de merge": un commit especial que combina los cambios de ambas branches.

### ¿Y si los cambios entran en conflicto?

A veces, dos branches modifican la misma línea del mismo archivo. Git no puede decidir cuál es la versión correcta, así que te pide a TI que decidas. Eso se llama un **conflicto de merge**.

Los conflictos se ven feos al principio, pero tienen solución. Vas a aprender a resolverlos en la sesión 3.

> 💡 **No tengas miedo de los conflictos.** Son normales y son parte del trabajo en equipo. Mejor un conflicto manejado que dos personas pisándose el trabajo sin saberlo.

---

## El flujo mental completo

Si juntamos los 6 conceptos, el flujo básico de Git es así:

```
1. Modificas archivos          → Working Directory
2. Eliges qué incluir          → Staging Area (git add)
3. Guardas con un mensaje      → Commit (git commit)
4. Repites en una branch       → Branch
5. Combinas con main           → Merge
6. Subes a GitHub              → Push (lo verás en sesión 4)
```

Este flujo se va a repetir miles de veces en tu carrera. En 2 semanas vas a hacerlo sin pensarlo.

---

## Comparación: la mentalidad sin Git vs con Git

| Sin Git | Con Git |
|---|---|
| "Voy a guardar este archivo" | "Voy a commitear este cambio" |
| "Hice una copia por si acaso" | "Tengo el historial completo, puedo volver a cualquier punto" |
| "Le mandé el archivo a María" | "Pusheé mi branch para que María la revise" |
| "No sé cuál es la versión buena" | "main siempre es la versión buena" |
| "Espero no haber roto nada" | "Si rompí algo, vuelvo al commit anterior en 5 segundos" |

---

## Lo que NO necesitas memorizar todavía

Mientras avanzas en este pilar, vas a escuchar términos como:

- HEAD
- Origin
- Remote
- Fetch
- Pull
- Push
- Stash
- Rebase
- Cherry-pick

NO los memorices ahora. Los vas a aprender en contexto, en las sesiones siguientes. Por hoy, solo necesitas tener los 6 conceptos fundamentales claros: repositorio, working directory, staging area, commit, branch, merge.

---

## 🎯 Validación de conceptos

Antes de avanzar a la siguiente sección, asegúrate de poder responder estas preguntas con tus propias palabras:

1. ¿Cuál es la diferencia entre el working directory y el staging area?
2. ¿Por qué Git tiene una "área intermedia" en lugar de pasar directamente del working directory al commit?
3. ¿Qué información contiene un commit?
4. ¿Para qué sirve crear una branch en lugar de trabajar siempre en main?
5. ¿Qué pasa cuando dos branches modifican la misma línea del mismo archivo?

Si puedes responder estas 5 preguntas, estás listo para empezar a usar Git. Si no, vuelve a leer la sección antes de avanzar. El resto del curso depende de tener estos conceptos claros.

---

*Universidad Nexus — Curso de GitHub para Analistas*
