---
sidebar_position: 2
title: Conectar Databricks a GitHub Enterprise
---

# Conectar Databricks a GitHub Enterprise

**Databricks Repos** es una funcionalidad de Databricks que te permite tener una copia de un repositorio de Git directamente dentro de tu workspace. Sincronizas, haces commits, branches, todo desde la interfaz de Databricks. Y cuando algo se actualiza en GitHub, aparece automáticamente en Databricks.

Esta lección te enseña a configurar la conexión y crear tu primer Databricks Repo.

---

## ¿Qué es exactamente Databricks Repos?

Imagínate este flujo:

```
        GitHub Enterprise (CBC)
              ↑↓
        ┌─────────────┐
        │  Databricks │
        │    Repos    │
        └─────────────┘
              ↕
        Tu workspace de Databricks
```

Databricks Repos hace el rol de "puente" entre GitHub y tu trabajo en Databricks. Es como tener un cliente de Git dentro de Databricks, con UI visual para hacer commits, push, pull, branches, etc.

### Ventajas

- **Tu código vive en GitHub**: control de versiones completo
- **Trabajas en Databricks**: ejecutas notebooks contra clusters reales
- **Sincronización automática**: cambios fluyen entre los dos
- **Branches reales**: puedes tener feature branches en Databricks

### Lo que NO es

- **NO es un "atajo" para evitar Git**: por debajo es Git real
- **NO reemplaza VSCode**: es un complemento, no un sustituto
- **NO es solo "guardado en la nube"**: es un repositorio versionado completo

---

## El flujo completo VSCode + Databricks Repos

Para entender cómo encaja todo, vamos a ver el flujo end-to-end de cómo trabajas con GitHub + VSCode + Databricks:

```
1. Editas código localmente en VSCode
       ↓
2. git commit + git push a GitHub
       ↓
3. Abres un PR en GitHub Enterprise
       ↓
4. Tu equipo revisa el PR y aprueba
       ↓
5. PR se mergea a main en GitHub
       ↓
6. En Databricks, tu Repo hace pull desde GitHub
       ↓
7. Ejecutas el notebook actualizado en Databricks
```

Notas:

- **Pasos 1-5**: trabajas en tu computadora con VSCode + Git + GitHub
- **Pasos 6-7**: trabajas dentro de Databricks con la interfaz de Repos

> 💡 **El punto clave:** GitHub es la fuente de verdad. Tanto VSCode como Databricks son "vistas" del mismo código.

---

## Configurar el acceso de Databricks a GitHub Enterprise

Antes de crear tu primer Databricks Repo, Databricks necesita autenticarse contra GitHub Enterprise. Esta configuración se hace una sola vez por usuario.

### Paso 1: Generar un Personal Access Token en GitHub Enterprise

En GitHub Enterprise:

1. Click en tu avatar arriba a la derecha → `Settings`
2. Menú lateral: `Developer settings`
3. `Personal access tokens` → `Tokens (classic)`
4. `Generate new token` → `Generate new token (classic)`
5. Llena los campos:
   - **Note**: "Databricks Repos - CBC" (algo descriptivo)
   - **Expiration**: 90 días (o lo que tu política permita)
   - **Scopes**: marca al menos `repo` (cubre acceso completo a repos)
6. Click en `Generate token`
7. **IMPORTANTE**: copia el token inmediatamente. Solo se muestra UNA vez.

> ⚠️ **Guarda el token en un lugar seguro temporalmente.** Lo vas a pegar en Databricks en el siguiente paso. Después puedes borrarlo de donde lo guardaste, porque Databricks lo va a almacenar de forma segura.

### Paso 2: Configurar el token en Databricks

En Databricks:

1. Click en tu avatar arriba a la derecha → `User Settings`
2. Tab `Linked accounts` (o `Git Integration` según versión)
3. En la sección de Git provider:
   - **Git provider**: GitHub
   - **Git provider URL**: la URL de GitHub Enterprise de CBC (ej: `https://github.cbc.com`)
   - **Username**: tu usuario de GitHub Enterprise
   - **Token**: pega el token que generaste
4. Click en `Save`

Listo. Databricks ahora puede autenticarse contra GitHub Enterprise.

> 💡 **Nota:** algunos workspaces de CBC tienen el provider configurado a nivel de workspace por el equipo de plataforma, así que solo necesitas poner tu token. Pregunta a tu lead si tienes dudas.

---

## Crear tu primer Databricks Repo

Ahora vamos a crear un Databricks Repo conectado a un repositorio de GitHub Enterprise.

### Paso 1: Tener un repo existente en GitHub Enterprise

Necesitas un repositorio que ya exista en GitHub Enterprise. Puede ser uno de tu equipo, o el repo de práctica que creaste en la sesión 4.

Copia la URL del repo (HTTPS):

```
https://github.cbc.com/equipo-data/proyecto-ventas.git
```

### Paso 2: Crear el Repo en Databricks

En Databricks:

1. En el menú lateral, click en `Workspace`
2. Navega a tu carpeta personal (`Users/tu_email`)
3. Click derecho → `Create` → `Repo`
4. Llena el formulario:
   - **Git repository URL**: pega la URL del repo
   - **Git provider**: GitHub (debería autoseleccionarse)
   - **Repository name**: el nombre se autocompleta del URL
5. Click en `Create Repo`

Databricks va a:

1. Conectarse a GitHub Enterprise con tus credenciales
2. Clonar el repositorio completo
3. Crear una carpeta nueva en tu workspace con el contenido del repo

Cuando termina, ves los archivos del repo dentro de Databricks. ¡Listo!

---

## Anatomía de un Databricks Repo

Una vez creado, el Repo se ve como una carpeta normal en tu workspace, pero tiene un icono especial (parece una bifurcación de ramas) que indica que es un Repo conectado a Git.

Cuando abres el Repo:

- Ves todos los archivos del repositorio
- Puedes navegar las carpetas como en cualquier workspace
- Los notebooks (`.py`, `.ipynb`) son ejecutables directamente
- Las carpetas como `lib/`, `notebooks/`, `jobs/` son las que estructuraste en el Pilar 4

> 💡 **Si tu repo tiene la estructura del Pilar 4, todo va a "funcionar mágicamente" en Databricks Repos.** Esa es una de las ventajas de adoptar la estructura recomendada.

---

## La interfaz de Git dentro de Databricks Repos

Click en el nombre del Repo (parte superior del workspace), o en el icono de Git. Se abre un panel con la interfaz de Git de Databricks.

Vas a ver:

- **Branch actual**: el nombre de la branch en la que estás (ej: `main`)
- **Status**: archivos modificados, agregados, eliminados
- **Botones**: para hacer commit, push, pull, crear branches

Es como el panel de Source Control de VSCode, pero dentro de Databricks.

### Operaciones disponibles

| Acción | Cómo |
|---|---|
| Ver estado | Panel de Git → muestra archivos modificados |
| Hacer commit | Escribir mensaje + click en "Commit" |
| Push al remoto | Click en "Push" o "Commit & Push" |
| Pull del remoto | Click en "Pull" |
| Crear branch | Dropdown de branch → "Create new branch" |
| Cambiar branch | Dropdown de branch → seleccionar |
| Mergear | (Limitado) hacer merge requiere usar GitHub web |

> 💡 **Lo que NO puedes hacer dentro de Databricks Repos:** crear PRs (eso se hace en GitHub web), resolver conflictos complejos (mejor en VSCode), operaciones avanzadas como rebase. Para esas cosas, vuelves a tu computadora local.

---

## El flujo recomendado: VSCode para escribir, Databricks para ejecutar

La pregunta clave: **¿dónde editar el código, en VSCode o en Databricks Repos?**

Mi recomendación honesta:

### Edita en VSCode cuando:

- Estás escribiendo lógica compleja (funciones nuevas, refactorings)
- Estás trabajando en módulos `lib/` reutilizables
- Necesitas autocompletado profundo, refactoring asistido
- Estás haciendo cambios grandes en muchos archivos
- Quieres hacer commits limpios y bien estructurados
- Necesitas resolver conflictos

### Edita en Databricks Repos cuando:

- Estás trabajando en un notebook que necesita ejecutarse mucho contra el cluster
- Estás haciendo análisis exploratorio interactivo
- El cambio es pequeño y específico de un notebook
- Necesitas iterar rápidamente con datos reales

### Lo más importante: NO edites el mismo archivo en los dos lados al mismo tiempo

Si editas un archivo en VSCode local Y en Databricks Repos sin sincronizar, te vas a generar conflictos a ti mismo. Decide en cuál vas a trabajar y mantente ahí hasta que pushees y pulles.

---

## Sincronizar cambios entre VSCode y Databricks Repos

### Caso 1: hiciste cambios en VSCode, los quieres en Databricks

```bash
# En tu computadora con VSCode
git add .
git commit -m "feat: nuevo análisis"
git push origin main
```

Después en Databricks Repos:

1. Abre el Repo
2. Click en el panel de Git
3. Click en "Pull"
4. Los cambios aparecen

### Caso 2: hiciste cambios en Databricks Repos, los quieres en VSCode

En Databricks Repos:

1. Hacer cambios en notebooks
2. Panel de Git → escribir mensaje de commit
3. Click en "Commit & Push"

En tu VSCode local:

```bash
git pull origin main
```

Los cambios aparecen.

> 💡 **Hábito clave:** antes de empezar a editar en cualquiera de los dos lados, haz pull primero. Te aseguras de partir del estado más reciente.

---

## Branches en Databricks Repos

Sí, puedes trabajar con branches dentro de Databricks Repos. Es exactamente igual que en VSCode:

### Crear una branch nueva

1. Click en el dropdown de branches (arriba del Repo)
2. Click en "Create branch"
3. Nombre: `feature/nueva-funcionalidad`
4. Click en "Create"

Estás en la branch nueva. Cualquier cambio que hagas se guarda en esa branch, no en main.

### Cambiar de branch

1. Click en el dropdown de branches
2. Selecciona la branch a la que quieres ir
3. Listo

### Pushear la branch al remoto

1. Hacer commits en la branch
2. Click en "Push"

La branch ahora existe en GitHub Enterprise. Puedes abrir un PR desde la web de GitHub.

---

## Limitaciones importantes de Databricks Repos

Hay cosas que Databricks Repos NO hace bien o no hace en absoluto:

### 1. Resolución de conflictos compleja

Si te aparece un conflicto difícil, la interfaz de Databricks no es la mejor para resolverlo. Recomendación: hacer pull en VSCode local, resolver allí, push, y después pull en Databricks.

### 2. No puedes crear PRs desde Databricks

Los PRs siempre se crean desde GitHub Enterprise web. Databricks Repos solo te permite trabajar localmente y pushear.

### 3. Operaciones avanzadas de Git no disponibles

`rebase`, `cherry-pick`, `stash`, `reflog`: estos comandos no están en la interfaz de Databricks. Para usarlos, necesitas tu computadora local.

### 4. Algunos archivos no se versionan bien

Imágenes, archivos binarios, datos: no metas estos en el repo. Vive en el data lake o en almacenamiento separado.

### 5. Tamaño limitado

Databricks Repos tiene límites de tamaño (típicamente 100MB para el repo completo). Si tu repo crece mucho, considera dividirlo.

---

## Permisos y colaboración

Los Databricks Repos tienen el mismo modelo de permisos que cualquier carpeta del workspace:

- **No permission**: no puedes ver el Repo
- **Read**: puedes ver y ejecutar pero no modificar
- **Run**: puedes ejecutar (incluyendo notebooks que dependen del Repo)
- **Edit**: puedes modificar archivos
- **Manage**: puedes cambiar permisos

> 💡 **Buena práctica:** los Repos productivos viven en `/Workspace/Shared/Repos` o `/Workspace/Repos` con permisos de solo lectura para la mayoría del equipo. Solo los responsables tienen `Edit`.

---

## Errores comunes al configurar

### "Unable to clone repository"

Causas posibles:

- El token de GitHub expiró → genera uno nuevo
- No tienes acceso al repo → confirma con tu lead
- La URL del repo está mal escrita

### "Authentication failed"

El token está mal configurado en User Settings. Vuelve a pegarlo.

### "Permission denied" al hacer commit

No tienes permisos de Edit en el Repo. Solo puedes leer.

### "Branch protection rules"

Estás intentando pushear directamente a main, que tiene protección. Crea una branch en su lugar y abre un PR.

---

## 🎯 Tareas

**Tarea 1:** Genera un Personal Access Token en GitHub Enterprise para Databricks. Configúralo en User Settings de Databricks.

**Tarea 2:** Crea tu primer Databricks Repo conectado al repo de práctica que creaste en la sesión 4.

**Tarea 3:** Verifica que ves los archivos del repo dentro de Databricks. Abre un notebook y ejecútalo contra un cluster.

**Tarea 4:** Haz un cambio en VSCode local. Pushealo. Luego haz pull desde Databricks Repos. Verifica que el cambio aparece.

**Tarea 5:** Haz un cambio en Databricks Repos. Commitealo y pushealo. Luego haz pull en VSCode. Verifica que aparece.

**Tarea 6:** Crea una branch en Databricks Repos, haz un cambio, pushea. Verifica que la branch aparece en GitHub Enterprise.

---

*Universidad Nexus — Curso de GitHub para Analistas*
