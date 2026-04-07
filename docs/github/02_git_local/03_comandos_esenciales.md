---
sidebar_position: 4
title: Comandos Esenciales del Día a Día
---

# Comandos Esenciales del Día a Día

Ya hiciste tu primer commit y configuraste tu `.gitignore`. Ahora vamos a ver los comandos que vas a usar TODOS los días en Git. No son muchos: con dominar 8 comandos cubres el 95% de tu trabajo cotidiano.

---

## Los 8 comandos esenciales

| Comando | Para qué sirve |
|---|---|
| `git status` | Ver qué está pasando en el repositorio |
| `git diff` | Ver qué cambió en los archivos |
| `git add` | Agregar archivos al staging area |
| `git commit` | Guardar un snapshot en el historial |
| `git log` | Ver el historial de commits |
| `git restore` | Descartar cambios o sacar del staging |
| `git mv` | Renombrar archivos manteniendo historial |
| `git rm` | Eliminar archivos del repositorio |

Vamos a ver cada uno con casos de uso reales.

---

## git status: el que más vas a usar

`git status` es tu mejor amigo. Lo vas a ejecutar 50 veces al día. Te dice todo lo que necesitas saber sobre el estado actual del repositorio.

```bash
git status
```

Lo que muestra:

- **En qué branch estás**
- **Cambios listos para commit** (en el staging area)
- **Cambios pendientes** (en el working directory)
- **Archivos nuevos** (untracked)
- **Archivos eliminados**

> 💡 **Hábito profesional:** ejecuta `git status` antes y después de CADA operación de Git. Te asegura que entiendes qué está pasando antes de avanzar.

### Versión más corta

Si quieres una versión más compacta:

```bash
git status -s
```

Resultado:

```
 M analisis.py
A  utils.py
?? notas.md
```

Las letras significan:

- **`M`** en la primera columna: modificado pero no en staging
- **`M`** en la segunda columna: modificado y en staging
- **`A`**: agregado al staging
- **`??`**: untracked (Git no lo conoce)

---

## git diff: ver exactamente qué cambió

Antes de commitear, siempre revisa qué cambió. `git diff` te lo muestra.

### Ver cambios en working directory (no staged)

```bash
git diff
```

### Ver cambios en staging area

```bash
git diff --staged
```

O equivalente:

```bash
git diff --cached
```

### Ver cambios de un archivo específico

```bash
git diff analisis.py
```

### Comparar contra un commit anterior

```bash
git diff HEAD~1
```

`HEAD~1` significa "el commit anterior al actual". `HEAD~2` sería dos commits atrás, etc.

### Modo VSCode

En el panel de Source Control, click en cualquier archivo modificado. VSCode te abre la vista de diff con la versión anterior a la izquierda y la actual a la derecha. Las líneas agregadas en verde, las eliminadas en rojo.

> 💡 **Mi recomendación:** para diffs visuales (ver cambios de varios archivos), usa VSCode. Es mucho más cómodo. Para diffs rápidos en la terminal, usa `git diff`.

---

## git add: variantes que vale la pena conocer

Ya viste `git add archivo.py` y `git add .`. Hay más opciones:

### Agregar varios archivos

```bash
git add archivo1.py archivo2.py archivo3.py
```

### Agregar todos los archivos de una carpeta

```bash
git add notebooks/
```

### Agregar interactivamente

```bash
git add -p
```

Esto es ORO. Git te muestra cada cambio uno por uno y te pregunta si lo quieres incluir. Súper útil cuando tienes muchos cambios mezclados y solo quieres incluir algunos.

Las opciones que te ofrece:

- **y**: yes, incluye este cambio
- **n**: no, sáltalo
- **q**: quit, sal sin guardar
- **a**: incluye este y todos los siguientes del archivo
- **s**: split, divide este cambio en partes más pequeñas

> 💡 **`git add -p` es uno de los secretos de los desarrolladores experimentados.** Te permite hacer commits mucho más limpios y enfocados.

---

## git commit: variantes y buenas prácticas

### Commit normal

```bash
git commit -m "feat: agregar validación de fechas"
```

### Commit con mensaje largo

A veces el mensaje merece más que una línea. Puedes hacer:

```bash
git commit
```

Sin el `-m`. Git te abre el editor (VSCode si lo configuraste) para escribir un mensaje multilínea:

```
feat: agregar validación de fechas

Las fechas vienen del sistema externo en varios formatos.
Ahora validamos que estén en YYYY-MM-DD antes de procesarlas.
Si no lo están, el script falla con un mensaje claro
indicando exactamente qué fila tiene el problema.

Ref: ticket DATA-1234
```

La primera línea es el "título" (corta, máximo 50 caracteres). Línea en blanco. Después el cuerpo con más detalles.

### Commit que incluye automáticamente todos los archivos modificados

```bash
git commit -am "Mensaje"
```

El flag `-a` hace `git add` automático de TODOS los archivos modificados (pero NO incluye los nuevos archivos untracked). Útil cuando ya estás seguro de que quieres commitear todo.

> ⚠️ **Cuidado con `-am`**: incluye TODOS los archivos modificados, sin posibilidad de revisar qué incluiste. Úsalo solo cuando ya tengas confianza.

### Modificar el último commit (amend)

¿Olvidaste algo en tu último commit? No hagas otro commit. Modifica el anterior:

```bash
# Hacer los cambios que faltaban
git add archivo_olvidado.py

# Modificar el commit anterior
git commit --amend --no-edit
```

`--amend` reemplaza el commit anterior con uno nuevo que incluye los cambios agregados. `--no-edit` mantiene el mismo mensaje. Si quieres cambiar también el mensaje, omite `--no-edit`.

> ⚠️ **Solo usa `--amend` con commits LOCALES.** Si ya hiciste push al remoto, modificar un commit causa problemas a otros que ya tenían tu versión anterior.

---

## git log: explorar el historial

Ya viste `git log` y `git log --oneline`. Hay más formas de explorar:

### Historial gráfico

```bash
git log --oneline --graph --all
```

Te muestra el historial con un gráfico ASCII de las branches y merges. Cuando empieces a trabajar con branches (próxima sección), esto se vuelve indispensable.

```
* a3f5c8d (HEAD -> main) docs: actualizar README
* b4e7f9a feat: agregar validación
| * c5d8e0b (feature/nueva-metrica) WIP nueva métrica
|/
* d6f9a1c Inicializar repositorio
```

### Mostrar commits de un autor específico

```bash
git log --author="Victor"
```

### Mostrar commits que afectaron un archivo específico

```bash
git log --follow analisis.py
```

`--follow` rastrea el archivo incluso si fue renombrado.

### Mostrar commits en un rango de fechas

```bash
git log --since="2 weeks ago" --until="yesterday"
```

### Búsqueda en mensajes de commit

```bash
git log --grep="bug fix"
```

Te muestra commits cuyo mensaje contenga "bug fix".

### Modo VSCode con GitLens

GitLens en VSCode te da una vista visual del historial. Puedes ver commits, filtrar por autor, ver diffs visuales. Para exploración casual, GitLens es más cómodo. Para búsquedas avanzadas, `git log` con filtros es más potente.

---

## git restore: deshacer cambios

A veces quieres descartar un cambio que hiciste pero todavía no commiteaste. Para eso está `git restore`.

### Descartar cambios en un archivo (no staged)

```bash
git restore analisis.py
```

El archivo vuelve al estado del último commit. **Atención: esto borra tus cambios irreversiblemente**. Asegúrate de que es lo que quieres.

### Descartar TODOS los cambios no staged

```bash
git restore .
```

### Sacar archivos del staging area

```bash
git restore --staged analisis.py
```

Esto saca el archivo del staging pero MANTIENE tus cambios en el working directory. Útil cuando agregaste algo al staging por error.

### Recuperar un archivo borrado

Si borraste un archivo accidentalmente y todavía no commiteaste:

```bash
git restore archivo_borrado.py
```

Vuelve a aparecer.

> 💡 **`git restore` es relativamente nuevo (Git 2.23+).** Versiones más viejas usan `git checkout` para esto, lo cual era confuso porque `git checkout` también sirve para cambiar de branch. Si ves tutoriales viejos, puede que mencionen `git checkout`. Tú usa `git restore`.

---

## git mv: renombrar archivos

Si renombras un archivo con el sistema operativo (cambiar el nombre en VSCode), Git lo ve como "borrar el viejo, crear uno nuevo". Pierde el historial.

Para renombrar manteniendo el historial:

```bash
git mv nombre_viejo.py nombre_nuevo.py
```

Después haz commit:

```bash
git commit -m "rename: nombre_viejo.py → nombre_nuevo.py"
```

Git registra el cambio como un rename, no como crear/borrar. El historial se preserva.

> 💡 **En la práctica:** Git es bastante listo y a veces detecta renames automáticamente incluso sin `git mv`. Pero para estar seguro, úsalo.

---

## git rm: eliminar archivos

Para borrar un archivo y registrar el cambio en Git:

```bash
git rm archivo_obsoleto.py
git commit -m "remove: eliminar análisis obsoleto"
```

`git rm` elimina el archivo del disco Y lo prepara para commit como eliminado.

### Eliminar solo del repositorio (sin borrar del disco)

```bash
git rm --cached archivo_que_quiero_ignorar.py
```

Esto deja el archivo en tu disco pero le dice a Git "deja de rastrearlo". Útil cuando agregaste algo al repo por error y quieres sacarlo sin perderlo.

---

## Atajos en VSCode para los comandos diarios

Si vas a usar VSCode como tu interfaz principal, vale la pena conocer los atajos:

| Acción | Atajo VSCode |
|---|---|
| Abrir panel de Source Control | `Cmd/Ctrl + Shift + G` |
| Stage all changes | (en el panel) ✓ junto a "Changes" |
| Commit | `Cmd/Ctrl + Enter` (con foco en el campo de mensaje) |
| Refresh status | (automático en cada cambio) |
| Ver diff de un archivo | Click en el archivo en el panel |
| Stage un cambio específico | Click derecho en una línea del diff → "Stage Selected Ranges" |

> 💡 **Gem oculto:** "Stage Selected Ranges" en VSCode equivale al `git add -p` de la terminal. Te permite stagear líneas específicas de un archivo, no el archivo completo. Súper útil para commits limpios.

---

## El cheat sheet del día a día

Ten esta lista a la mano las primeras semanas. Después se vuelve automática.

```bash
# Ver qué pasa
git status
git diff

# Guardar cambios
git add archivo.py        # un archivo
git add .                  # todo
git commit -m "mensaje"

# Ver historial
git log --oneline

# Deshacer
git restore archivo.py     # descartar cambios
git restore --staged archivo.py  # sacar de staging

# Modificar el último commit (solo si NO hiciste push)
git commit --amend --no-edit
```

10 comandos. Con esto cubres el 95% de tu trabajo diario.

---

## 🎯 Tareas

**Tarea 1:** En tu repositorio de práctica, crea 3 archivos Python con cualquier contenido. Usa `git status` después de cada uno.

**Tarea 2:** Modifica uno de los archivos. Ejecuta `git diff` para ver el cambio.

**Tarea 3:** Haz `git add` solo de DOS de los tres archivos. Verifica con `git status` que solo esos están en staging.

**Tarea 4:** Haz commit de los dos staged. Después haz otro commit del tercero. Verifica con `git log --oneline` que tienes dos nuevos commits.

**Tarea 5:** Modifica un archivo y ejecuta `git restore` para descartar el cambio. Verifica que el archivo volvió al estado del commit.

**Tarea 6:** Renombra uno de los archivos con `git mv`. Hazle commit. Ejecuta `git log --oneline` y verifica el resultado.

**Tarea 7 (avanzado):** Practica `git add -p` en un archivo donde hayas hecho varios cambios distintos. Stagea solo algunos cambios.

---

*Universidad Nexus — Curso de GitHub para Analistas*
