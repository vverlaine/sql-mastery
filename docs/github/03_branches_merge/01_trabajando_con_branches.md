---
sidebar_position: 2
title: Trabajando con Branches
---

# Trabajando con Branches

Una **branch** es una línea independiente de desarrollo. Es como tener una copia paralela de tu proyecto donde puedes hacer cambios sin afectar la versión principal. Es el concepto que hace posible trabajar en equipo sin pisarse el código.

---

## ¿Por qué necesitas branches?

Imagina este escenario sin branches:

- Estás en `main` trabajando en una nueva funcionalidad
- A mitad del trabajo, te avisan de un bug crítico que hay que arreglar YA
- Tu funcionalidad está a medias y no funciona
- Para arreglar el bug, tienes que terminar la funcionalidad primero, o descartarla

Es un problema. Las branches lo resuelven elegantemente:

- Estás en una branch `feature/nueva-funcionalidad`
- Te avisan del bug crítico
- Cambias a `main`, creas una branch `fix/bug-critico`, arreglas el bug, lo mergeas
- Vuelves a `feature/nueva-funcionalidad` y continúas donde estabas

Sin perder nada. Sin pisar nada. Sin estrés.

---

## Ver las branches existentes

### Modo línea de comandos

```bash
git branch
```

Te muestra las branches locales:

```
* main
```

El asterisco `*` indica en qué branch estás actualmente. Si solo has trabajado en `main`, verás solo esa.

### Ver branches remotas también

```bash
git branch -a
```

Te muestra todas, incluyendo las del repositorio remoto (cuando estés conectado a GitHub):

```
* main
  remotes/origin/main
  remotes/origin/develop
  remotes/origin/feature/dashboard
```

### Modo VSCode

En la barra inferior izquierda de VSCode, verás el nombre de la branch actual junto a un icono de bifurcación. Click en él te abre un menú con todas las branches y opciones para crear o cambiar.

---

## Crear una branch nueva

### Modo línea de comandos

```bash
git branch nombre-de-la-branch
```

Esto crea la branch pero NO te cambia a ella. Estás en `main` todavía.

Para crear Y cambiar al mismo tiempo:

```bash
git checkout -b nombre-de-la-branch
```

O con la sintaxis moderna (Git 2.23+):

```bash
git switch -c nombre-de-la-branch
```

> 💡 **Recomendación:** usa `git switch -c` para crear+cambiar y `git switch` para solo cambiar. Es más claro que `checkout` (que hace muchas cosas distintas).

### Modo VSCode

1. Click en el nombre de la branch en la barra inferior
2. Selecciona "Create new branch..."
3. Escribe el nombre
4. VSCode crea la branch y te cambia automáticamente

---

## Convenciones para nombrar branches

Una buena convención de nombres facilita entender de un vistazo qué hay en cada branch. La más usada es:

```
<tipo>/<descripcion-corta-en-kebab-case>
```

Tipos comunes:

- **`feature/`**: nueva funcionalidad
- **`fix/`**: corrección de bug
- **`hotfix/`**: corrección urgente para producción
- **`refactor/`**: refactorización sin cambiar comportamiento
- **`docs/`**: cambios de documentación
- **`chore/`**: mantenimiento, actualizaciones de dependencias
- **`experiment/`**: pruebas que pueden no llegar a main

Ejemplos:

```
feature/agregar-validacion-fechas
fix/calculo-margen-incorrecto
refactor/extraer-funciones-utils
docs/actualizar-readme
hotfix/error-en-job-mensual
```

> ⚠️ **Reglas básicas para nombres:**
> - **No uses espacios.** Usa guiones medios (`-`).
> - **No uses caracteres especiales.** Solo letras, números y guiones.
> - **Sé descriptivo pero corto.** Idealmente menos de 50 caracteres.
> - **En inglés o español.** Sé consistente con tu equipo.

---

## Cambiar de branch

### Modo línea de comandos

```bash
git switch nombre-de-la-branch
```

O la versión clásica:

```bash
git checkout nombre-de-la-branch
```

> ⚠️ **Importante**: antes de cambiar de branch, asegúrate de no tener cambios sin commitear. Si los tienes, Git te puede dar problemas. Tienes dos opciones:
> 1. Hacer commit de los cambios primero
> 2. Guardarlos temporalmente con `git stash` (lo verás más adelante)

### Modo VSCode

Click en el nombre de la branch en la barra inferior → selecciona la branch a la que quieres cambiar.

---

## Hacer cambios en una branch

Una vez que estás en una branch nueva, trabajas exactamente igual que en `main`:

```bash
# Estás en feature/nueva-validacion
echo "def validar_fecha(fecha): pass" > validacion.py
git add validacion.py
git commit -m "feat: agregar función de validación de fechas"
```

Los commits se quedan en `feature/nueva-validacion`. La branch `main` no se entera. Cuando vuelves a `main`, ese archivo `validacion.py` desaparece (porque vive en la otra branch).

Eso es lo poderoso: cada branch tiene su propio universo de cambios.

---

## Ver el estado de las branches

### Historial visual

```bash
git log --oneline --graph --all
```

Te muestra el historial con un gráfico ASCII de las branches:

```
* a3f5c8d (HEAD -> feature/nueva-validacion) feat: agregar función de validación
| * b4e7f9a (main) docs: actualizar README
|/
* c5d8e0b Inicializar repositorio
```

Lectura:

- `*` es un commit
- Las líneas verticales son la línea del tiempo de cada branch
- `HEAD ->` indica en qué branch estás
- `(main)` indica dónde está la branch main

### En VSCode con GitLens

Si tienes GitLens instalado, puedes ver el grafo de branches visualmente sin tener que leer ASCII. Es más cómodo para repos con muchas branches.

---

## Borrar una branch

Cuando ya no necesitas una branch (porque la mergeaste o porque era un experimento que no funcionó):

### Modo línea de comandos

```bash
# Borrar branch local mergeada
git branch -d nombre-de-la-branch

# Borrar branch local NO mergeada (forzar)
git branch -D nombre-de-la-branch
```

La diferencia entre `-d` y `-D`:

- **`-d`**: borra solo si la branch ya fue mergeada a otra. Es seguro.
- **`-D`**: borra la branch sin importar si fue mergeada. **Atención**: pierdes los commits si no estaban en otra branch.

> ⚠️ **No puedes borrar la branch en la que estás.** Cambia a otra primero.

### Modo VSCode

1. Click en el nombre de la branch en la barra inferior
2. Selecciona "Delete Branch..."
3. Elige cuál borrar

---

## Renombrar una branch

A veces te das cuenta que el nombre de tu branch no es el mejor. Para renombrar:

### Si estás EN la branch que quieres renombrar

```bash
git branch -m nombre-nuevo
```

### Si estás en otra branch

```bash
git branch -m nombre-viejo nombre-nuevo
```

---

## El flujo típico con branches

Vamos a ver cómo se ve el flujo completo de trabajar con una branch desde cero hasta mergearla:

```bash
# 1. Estás en main, asegúrate de tener lo último
git switch main
git status  # debe estar limpio

# 2. Crear branch nueva para tu trabajo
git switch -c feature/agregar-metricas-margen

# 3. Hacer tus cambios
# ... editar archivos ...
git add .
git commit -m "feat: agregar cálculo de margen por categoría"

# 4. Más cambios
# ... más ediciones ...
git add .
git commit -m "feat: incluir margen en reporte mensual"

# 5. Volver a main
git switch main

# 6. Mergear los cambios de la feature
git merge feature/agregar-metricas-margen

# 7. Borrar la branch (ya no la necesitas)
git branch -d feature/agregar-metricas-margen
```

Este es el flujo BÁSICO. En equipo, vas a agregar pasos para sincronizar con el remoto y para code reviews. Pero el corazón es esto.

---

## Casos prácticos

### Caso 1: Empezar a trabajar en algo nuevo

```bash
git switch main
git switch -c feature/lo-que-voy-a-hacer
```

Listo. Ya puedes empezar a trabajar sin afectar nada.

### Caso 2: Pausar lo que estás haciendo para arreglar otra cosa

Estás en `feature/A` con cambios pendientes. Te avisan de un bug urgente.

```bash
# Guardar tu trabajo a medias
git add .
git commit -m "WIP: progreso en feature A"

# Volver a main y crear branch para el bug
git switch main
git switch -c hotfix/error-job

# ... arreglar el bug ...
git add .
git commit -m "fix: corregir error en job mensual"

# Mergear el hotfix
git switch main
git merge hotfix/error-job

# Volver a tu trabajo original
git switch feature/A
```

> 💡 **WIP** significa "Work In Progress". Es una convención común para commits de "guardado temporal".

### Caso 3: Experimentar sin riesgo

```bash
git switch -c experiment/nueva-arquitectura
# ... probar ideas locas ...
```

Si funciona: la mergeas a main. Si no: la borras y nadie se enteró.

```bash
# Si no funciona
git switch main
git branch -D experiment/nueva-arquitectura
```

---

## Errores comunes con branches

### "Cannot switch branches with uncommitted changes"

Tenías cambios pendientes en tu branch actual y trataste de cambiar a otra. Soluciones:

1. Commitea los cambios: `git add . && git commit -m "WIP"`
2. O guárdalos temporalmente: `git stash`
3. O descártalos: `git restore .` (¡cuidado!)

### "Already on 'branch-name'"

Trataste de cambiar a una branch en la que ya estás. No es un error real, solo un aviso.

### Te perdiste y no sabes en qué branch estás

```bash
git branch
```

El asterisco te dice. O mira la barra inferior de VSCode.

### Creaste una branch desde el lugar equivocado

Las branches "heredan" desde donde fueron creadas. Si creaste una branch desde otra branch (no desde main), tu nueva branch incluye los cambios de esa otra. Si era lo que querías, perfecto. Si no, considera empezar de nuevo desde main.

---

## Comparación rápida: CLI vs VSCode

| Acción | Línea de comandos | VSCode |
|---|---|---|
| Ver branches | `git branch` | Click en branch en barra inferior |
| Crear branch | `git switch -c nombre` | Menú → "Create new branch..." |
| Cambiar branch | `git switch nombre` | Click en branch en menú |
| Borrar branch | `git branch -d nombre` | Menú → "Delete Branch..." |
| Ver historial | `git log --graph --all` | GitLens → Branches |
| Renombrar | `git branch -m nombre` | Menú → "Rename Branch..." |

---

## 🎯 Tareas

**Tarea 1:** En tu repo de práctica, ejecuta `git branch` para ver las branches actuales.

**Tarea 2:** Crea una branch llamada `feature/agregar-instrucciones`. Verifica que estás en ella.

**Tarea 3:** Crea un archivo `INSTRUCCIONES.md` con cualquier contenido. Hazle commit en esa branch.

**Tarea 4:** Cambia a `main` y verifica que `INSTRUCCIONES.md` NO está ahí (porque vive en la otra branch).

**Tarea 5:** Vuelve a `feature/agregar-instrucciones`. Verifica que el archivo aparece de nuevo.

**Tarea 6:** Crea una segunda branch llamada `experiment/cambios-locos` desde main. Modifica el README. Hazle commit.

**Tarea 7:** Ejecuta `git log --oneline --graph --all` y entiende el grafo que ves.

**Tarea 8:** Borra la branch `experiment/cambios-locos` (sin mergearla, era un experimento).

---

*Universidad Nexus — Curso de GitHub para Analistas*
