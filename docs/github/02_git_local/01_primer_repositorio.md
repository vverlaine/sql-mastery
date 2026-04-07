---
sidebar_position: 2
title: Tu Primer Repositorio
---

# Tu Primer Repositorio

Vamos a crear tu primer repositorio Git desde cero. Es más simple de lo que crees: dos comandos y ya tienes una carpeta versionada.

---

## Crear la carpeta del proyecto

Antes de Git, necesitamos una carpeta. Vamos a crear una para practicar todo el curso.

### Modo línea de comandos

```bash
cd ~/Documents
mkdir nexus_pilar5_practica
cd nexus_pilar5_practica
```

Acabas de crear una carpeta y entrar en ella. Ahora estás "dentro" de tu futuro repositorio.

### Modo VSCode

1. Abre VSCode
2. `File → Open Folder`
3. Navega a `~/Documents`
4. Click derecho → `New Folder` → nombre: `nexus_pilar5_practica`
5. Selecciona la nueva carpeta y `Open`

VSCode ahora tiene la carpeta abierta como workspace.

---

## Inicializar el repositorio

Hasta ahora es solo una carpeta normal. Para convertirla en un repositorio Git, necesitas un solo comando.

### Modo línea de comandos

```bash
git init
```

Verás un mensaje como:

```
Initialized empty Git repository in /Users/tu_usuario/Documents/nexus_pilar5_practica/.git/
```

¡Felicitaciones! Acabas de crear tu primer repositorio Git. Detrás de escenas, Git creó la carpeta oculta `.git/` donde va a guardar todo el historial.

Verifica que está ahí:

```bash
ls -la
```

Verás algo como:

```
drwxr-xr-x  3 usuario  staff   96 Apr  7 10:00 .
drwxr-xr-x  5 usuario  staff  160 Apr  7 10:00 ..
drwxr-xr-x  9 usuario  staff  288 Apr  7 10:00 .git
```

La carpeta `.git` es el "cerebro" del repositorio. **Nunca la toques manualmente**. Git la maneja sola.

### Modo VSCode

1. Click en el icono de Source Control en la Activity Bar (`Cmd/Ctrl + Shift + G`)
2. Verás un mensaje "There are no source control providers registered" o un botón "Initialize Repository"
3. Click en `Initialize Repository`

VSCode ejecuta `git init` por ti. El panel cambia y ahora muestra el estado del repositorio.

> 💡 **Importante:** los dos modos hacen exactamente lo mismo. La línea de comandos es más explícita, VSCode es más visual. Elige el que te guste más, pero te recomiendo entender ambos.

---

## Verificar el estado del repositorio

Git tiene un comando que es probablemente el que más vas a usar en tu vida: `git status`. Te dice qué está pasando en este momento.

### Modo línea de comandos

```bash
git status
```

Te mostrará algo como:

```
On branch main
No commits yet
nothing to commit (create/copy files and use "git add" to track)
```

Lee con calma:

- **`On branch main`**: estás en la branch principal
- **`No commits yet`**: todavía no has hecho ningún commit
- **`nothing to commit`**: no hay cambios pendientes

Es exactamente lo que esperamos: un repositorio recién creado, vacío.

### Modo VSCode

El panel de Source Control te muestra el estado visualmente. Como acabas de inicializar, verás:

- Tu branch actual en la barra inferior (`main`)
- Una sección "Changes" vacía
- Botones para "Initialize" y "Publish to GitHub"

El equivalente visual de `git status` es esa vista del panel. Cada vez que algo cambia, este panel se actualiza automáticamente.

---

## Crear tu primer archivo

Vamos a agregar contenido al repositorio. Crea un archivo `README.md`:

### Modo línea de comandos

```bash
echo "# Mi Primer Repositorio" > README.md
```

Esto crea un archivo `README.md` con una línea de contenido.

### Modo VSCode

1. En el explorador de archivos (panel izquierdo), click en el icono de "New File"
2. Nombre: `README.md`
3. Escribe en el archivo: `# Mi Primer Repositorio`
4. Guarda con `Cmd/Ctrl + S`

---

## Volver a verificar el estado

Ahora que agregaste un archivo, vuelve a ejecutar `git status`:

### Modo línea de comandos

```bash
git status
```

El mensaje cambió:

```
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        README.md

nothing added to commit but untracked files present (use "git add" to track)
```

Conceptos importantes:

- **`Untracked files`**: archivos que existen en tu carpeta pero que Git todavía NO está vigilando. Son "nuevos para Git".
- Git te dice qué hacer: usar `git add` para empezar a rastrearlos.

### Modo VSCode

En el panel de Source Control verás una sección "Changes" con `README.md` listado. Junto al nombre, verás la letra **U** (Untracked).

> 💡 **Las letras de estado en VSCode son importantes:**
> - **U** = Untracked (nuevo, no rastreado)
> - **M** = Modified (modificado)
> - **A** = Added (agregado al staging)
> - **D** = Deleted (eliminado)
> - **R** = Renamed (renombrado)
>
> Aprenderlas te va a ayudar a entender el estado de un vistazo.

---

## Agregar al staging area (git add)

Recuerda los conceptos: antes de hacer un commit, necesitas mover los archivos al **staging area**. Eso es lo que hace `git add`.

### Modo línea de comandos

```bash
git add README.md
```

Si quieres agregar TODOS los archivos modificados de un golpe:

```bash
git add .
```

El punto significa "todo lo que hay aquí". Es una forma rápida cuando quieres incluir todos los cambios.

> ⚠️ **Cuidado con `git add .`**: incluye TODOS los archivos modificados, incluso los que no querías incluir. Es práctico pero puede meterte en líos. Cuando empieces, agrega archivos uno por uno hasta que tengas confianza.

### Modo VSCode

En el panel de Source Control, junto al archivo `README.md`, hay un icono **+** (cuando pasas el mouse encima). Click en el +.

El archivo se mueve de la sección "Changes" a "Staged Changes". La letra cambia de **U** a **A** (Added).

### Verificar otra vez con git status

```bash
git status
```

Ahora muestra:

```
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   README.md
```

`Changes to be committed` significa "estos cambios están en el staging area, listos para tu próximo commit".

---

## Hacer tu primer commit

El momento de la verdad. Vas a guardar tu primer "snapshot" en el historial de Git.

### Modo línea de comandos

```bash
git commit -m "Inicializar repositorio con README"
```

El flag `-m` te permite escribir el mensaje del commit directamente en la línea de comandos. Si no lo usas, Git te abre un editor para escribirlo.

Verás una respuesta como:

```
[main (root-commit) a3f5c8d] Inicializar repositorio con README
 1 file changed, 1 insertion(+)
 create mode 100644 README.md
```

Lee con calma:

- **`(root-commit)`**: es tu primer commit del repositorio
- **`a3f5c8d`**: el inicio del hash único del commit
- **`1 file changed, 1 insertion(+)`**: cambió 1 archivo, se agregó 1 línea
- **`create mode 100644`**: se creó un archivo nuevo

¡Felicitaciones! **Acabas de hacer tu primer commit en Git.** Tienes oficialmente el primer punto en tu historial.

### Modo VSCode

1. En el panel de Source Control, en la parte superior hay un campo de texto que dice "Message"
2. Escribe: `Inicializar repositorio con README`
3. Click en el botón ✓ (Commit) arriba del campo, o presiona `Cmd/Ctrl + Enter`

VSCode ejecuta el commit. La sección "Staged Changes" se vacía.

---

## Ver el historial

Ya tienes un commit. Vamos a verlo en el historial.

### Modo línea de comandos

```bash
git log
```

Te muestra:

```
commit a3f5c8d9e2b1f4a6c5d8e9f0a1b2c3d4e5f6a7b8 (HEAD -> main)
Author: Tu Nombre <tu.email@cbc.com>
Date:   Mon Apr 7 10:15:23 2024 -0600

    Inicializar repositorio con README
```

Información del commit:

- **commit a3f5c8d9...**: el hash completo (40 caracteres)
- **(HEAD -> main)**: indica que este commit es el último de la branch main
- **Author**: tu nombre y email (lo que configuraste antes)
- **Date**: cuándo lo hiciste
- **Mensaje**: lo que escribiste

### Versión más compacta

`git log` puede dar mucha información. Para verlo más resumido:

```bash
git log --oneline
```

Resultado:

```
a3f5c8d (HEAD -> main) Inicializar repositorio con README
```

Una línea por commit. Es la forma más usada para ver el historial rápidamente.

### Modo VSCode

VSCode no tiene una vista de historial built-in tan buena. Para ver el historial dentro de VSCode necesitas instalar la extensión **GitLens** (que vimos en el pilar anterior):

1. Si no la tienes, instálala desde Extensions: busca "GitLens"
2. En la Activity Bar aparece un nuevo icono de GitLens
3. Click en GitLens → Commits

Verás el historial de commits con autor, fecha y mensaje.

> 💡 **Recomendación honesta:** para ver el historial, la línea de comandos con `git log --oneline` es más rápida que GitLens. GitLens es más útil para otras cosas (ver quién escribió cada línea, comparar commits visualmente).

---

## Hacer un segundo commit

Vamos a hacer otro cambio y otro commit, para que veas el flujo completo.

### Modificar el archivo

Edita `README.md` y agrega más contenido. Puede ser cualquier cosa, por ejemplo:

```markdown
# Mi Primer Repositorio

Este es un repositorio de práctica para aprender Git.

## Lo que estoy aprendiendo

- Comandos básicos de Git
- Cómo hacer commits
- Cómo ver el historial
```

Guarda el archivo.

### Verificar el estado

```bash
git status
```

Resultado:

```
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes)
        modified:   README.md

no changes added to commit (use "git add" to commit)
```

Nuevo concepto:

- **`Changes not staged for commit`**: hay cambios en el working directory que NO están en el staging area todavía
- **`modified: README.md`**: el archivo fue modificado (no es nuevo)

### Ver exactamente qué cambió

Antes de commitear, puedes ver QUÉ cambió:

```bash
git diff
```

Te muestra las líneas agregadas (con `+`) y eliminadas (con `-`):

```diff
diff --git a/README.md b/README.md
index 8c9f4a2..1e2b3c4 100644
--- a/README.md
+++ b/README.md
@@ -1 +1,9 @@
 # Mi Primer Repositorio
+
+Este es un repositorio de práctica para aprender Git.
+
+## Lo que estoy aprendiendo
+
+- Comandos básicos de Git
+- Cómo hacer commits
+- Cómo ver el historial
```

> 💡 **`git diff` es uno de los comandos más útiles.** Antes de commitear, siempre revisa qué cambió. Te asegura que estás commiteando solo lo que querías.

### En VSCode

Click en el archivo modificado dentro del panel de Source Control. VSCode te abre una vista lado a lado: izquierda la versión anterior, derecha la nueva. Las líneas agregadas aparecen en verde, las eliminadas en rojo.

Es probablemente la forma más cómoda de revisar cambios. Yo recomiendo VSCode para esto, y línea de comandos para todo lo demás.

### Stage y commit

```bash
git add README.md
git commit -m "docs: ampliar README con descripción del proyecto"
```

O en VSCode:

1. Click en el **+** junto a `README.md` para hacer stage
2. Escribe el mensaje en el campo de Source Control
3. Click en ✓ para commitear

### Ver el historial actualizado

```bash
git log --oneline
```

Ahora verás dos commits:

```
b4f6d9e (HEAD -> main) docs: ampliar README con descripción del proyecto
a3f5c8d Inicializar repositorio con README
```

Los commits están en orden cronológico inverso: el más reciente arriba.

---

## El flujo completo en una imagen mental

Acabas de hacer el flujo completo de Git local:

```
1. Modificas archivos          → git status (verificar)
2. Revisas qué cambió          → git diff
3. Eliges qué incluir          → git add <archivo>
4. Verificas el staging        → git status (verificar otra vez)
5. Guardas el snapshot         → git commit -m "mensaje"
6. Confirmas en el historial   → git log --oneline
```

Este flujo de 6 pasos es lo que vas a hacer DECENAS de veces al día. En 2 semanas se vuelve automático.

---

## Comparación rápida: CLI vs VSCode

| Acción | Línea de comandos | VSCode |
|---|---|---|
| Inicializar repo | `git init` | Click en "Initialize Repository" |
| Ver estado | `git status` | Panel de Source Control |
| Ver cambios | `git diff` | Click en archivo modificado |
| Stage archivo | `git add <archivo>` | Click en + junto al archivo |
| Stage todo | `git add .` | Click en + junto a "Changes" |
| Commit | `git commit -m "msg"` | Escribe mensaje + click en ✓ |
| Ver historial | `git log --oneline` | GitLens panel |

**Mi recomendación honesta:** usa VSCode para el flujo cotidiano (`add` y `commit`), y línea de comandos para inspección (`status`, `diff`, `log`) y operaciones complejas. Es lo más eficiente.

---

## 🎯 Tareas

**Tarea 1:** Crea una carpeta nueva llamada `mi_primer_repo` en tu computadora.

**Tarea 2:** Inicializa Git en esa carpeta (con CLI o VSCode, tu elección).

**Tarea 3:** Crea un archivo `README.md` con un título y descripción.

**Tarea 4:** Agrega el archivo al staging area y haz tu primer commit con un mensaje claro.

**Tarea 5:** Modifica el README agregando más contenido. Usa `git diff` (o VSCode) para ver qué cambió.

**Tarea 6:** Haz un segundo commit con un mensaje descriptivo.

**Tarea 7:** Ejecuta `git log --oneline` y verifica que ves los dos commits.

**Tarea 8 (extra):** Crea un segundo archivo `notas.md` con cualquier contenido. Hazle commit por separado del README.

---

*Universidad Nexus — Curso de GitHub para Analistas*
