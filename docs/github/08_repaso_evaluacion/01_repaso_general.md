---
sidebar_position: 2
title: Repaso General
---

# Repaso General

Esta página es tu cheat sheet del módulo completo. Tenla a la mano cuando empieces a trabajar en repositorios reales de CBC.

---

## 1. Conceptos fundamentales

### Repositorio
Una carpeta con la magia de Git adentro (`.git/`). Vive en tu computadora.

### Working Directory
Tu carpeta normal donde editas archivos.

### Staging Area
Zona intermedia donde decides qué incluir en el próximo commit.

### Commit
Foto instantánea del proyecto en un momento. Tiene hash único, autor, fecha, mensaje.

### Branch
Línea independiente de desarrollo. Permite trabajar en paralelo sin pisarse.

### Merge
Combinar dos branches. Puede ser fast-forward o three-way.

---

## 2. Configuración inicial

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@cbc.com"
git config --global core.editor "code --wait"
git config --global init.defaultBranch main
git config --global color.ui auto
```

---

## 3. Comandos del día a día

### Estado y exploración

```bash
git status              # ver qué pasa
git diff                # ver cambios no staged
git diff --staged       # ver cambios staged
git log --oneline       # historial compacto
git log --graph --all   # historial visual
```

### Workflow básico

```bash
git add archivo.py      # un archivo
git add .               # todo
git commit -m "mensaje" # commit
git push                # subir al remoto
git pull                # bajar del remoto
```

### Branches

```bash
git branch              # ver branches
git switch -c nombre    # crear y cambiar
git switch nombre       # cambiar
git branch -d nombre    # borrar (mergeada)
git branch -D nombre    # forzar borrado
```

### Remotos

```bash
git clone `<url>`                    # clonar
git remote -v                      # ver remotos
git remote add origin <url>        # agregar remoto
git push -u origin nombre-branch   # primer push de branch
git fetch origin                   # bajar info sin aplicar
```

### Recuperación

```bash
git restore archivo.py            # descartar cambios
git restore --staged archivo.py   # sacar de staging
git commit --amend --no-edit      # modificar último commit
git reset --soft HEAD~1           # deshacer commit (mantener cambios)
git reset --hard HEAD~1           # deshacer commit (descartar cambios)
git revert <hash>                 # revertir commit pusheado
git stash                         # guardar trabajo temporalmente
git stash pop                     # recuperar trabajo guardado
git reflog                        # ver TODOS los movimientos
```

---

## 4. Convenciones de mensajes de commit

```
<tipo>: descripción corta en presente

(opcional) Explicación más larga del por qué del cambio.
```

### Tipos comunes

- `feat`: nueva funcionalidad
- `fix`: corrección de bug
- `docs`: cambios en documentación
- `refactor`: reorganización sin cambiar comportamiento
- `style`: formato (espacios, puntos y comas)
- `test`: agregar o modificar pruebas
- `chore`: tareas de mantenimiento

### Ejemplos buenos

```
feat: agregar cálculo de margen por categoría
fix: corregir filtrado de fechas en análisis Q1
docs: actualizar README con instrucciones de instalación
refactor: extraer función de validación a módulo separado
```

### Ejemplos malos (no hagas esto)

```
cambios
update
final
asdf
WIP
```

---

## 5. Convenciones de branches

```
<tipo>/<descripcion-corta>
o
<tipo>/<numero-issue>-<descripcion>
```

### Tipos comunes

- `feature/`: nueva funcionalidad
- `fix/`: corrección de bug
- `hotfix/`: corrección urgente para producción
- `refactor/`: refactorización
- `docs/`: cambios de documentación

### Ejemplos

```
feature/agregar-validacion-fechas
feature/156-rotacion-inventario
fix/calculo-margen-incorrecto
hotfix/error-en-job-mensual
refactor/extraer-funciones-utils
```

---

## 6. .gitignore esencial

```gitignore
# Python
__pycache__/
*.pyc
.venv/
venv/

# Jupyter
.ipynb_checkpoints/

# IDEs
.vscode/
.idea/

# Sistema
.DS_Store
Thumbs.db

# Databricks
.databrickscfg
.databricks/

# Secretos
.env
.env.local
*.pem
*.key

# Datos
*.csv
*.xlsx
*.parquet
data/raw/

# Outputs
*.log
*.tmp
output/
```

---

## 7. Pull Requests

### Estructura del PR

```markdown
## ¿Qué cambia?
Descripción breve del cambio.

## ¿Por qué?
Contexto, motivación, problema que resuelve.

## ¿Cómo se prueba?
Pasos para validar.

## Tipo de cambio
- [ ] Feature
- [ ] Fix
- [ ] Refactor
- [ ] Docs

## Notas adicionales
Closes #<numero-issue>
```

### Buenas prácticas

- PRs pequeños (&lt;500 líneas)
- Un PR = una idea
- Título y descripción siempre
- Linkear issue con `Closes #X`
- Draft PR desde temprano
- Atender feedback de reviewers

---

## 8. Code reviews

### Como reviewer

- Lee la descripción primero
- Critica el código, no a la persona
- Distingue: bloqueante / sugerencia / pregunta
- Pregunta antes de afirmar
- Reconoce lo bueno
- No nitpickees
- Sé oportuno (< 24 horas)

### Como autor

- No te lo tomes personal
- Si no entiendes, pregunta
- Si no estás de acuerdo, justifica
- Agradece los reviews
- Marca como resuelto cuando arregles

---

## 9. Resolución de conflictos

### Pasos

1. Abrir el archivo conflictivo
2. Ver las marcas `<<<<<<<` `=======` `>>>>>>>`
3. Decidir: ¿combinar las dos? ¿elegir una?
4. Editar para dejar la versión correcta
5. Borrar las marcas
6. `git add archivo`
7. `git commit` para completar el merge

### Comandos útiles

```bash
git status                           # ver archivos en conflicto
git diff --name-only --diff-filter=U # listar conflictos
git merge --abort                    # cancelar el merge
```

### Para evitarlos

- Branches cortas
- Sincronizar con main frecuentemente
- Comunicar antes de tocar archivos críticos
- Archivos pequeños y modulares
- Black + Ruff configurados

---

## 10. Workflow integrado VSCode + GitHub + Databricks

### Flujo completo

```
1. Leer issue en GitHub
2. git switch main && git pull
3. git switch -c feature/X
4. Editar en VSCode
5. git commit + git push
6. Abrir draft PR
7. Editar notebooks en Databricks Repos si hace falta
8. Ejecutar contra cluster
9. Convertir draft a ready
10. Code review
11. Mergear en GitHub
12. git switch main && git pull
13. git branch -d feature/X
14. Pull en Databricks Repos
```

### Cuándo usar qué

| Acción | Herramienta |
|---|---|
| Lógica compleja, refactoring | VSCode |
| Tests | VSCode |
| Análisis exploratorio | Databricks |
| Ejecutar contra clusters | Databricks |
| Crear PRs | GitHub web |
| Code reviews | GitHub web (o VSCode con extensión) |

---

## 11. Hábitos del analista profesional con Git

### Diarios

- Pull al inicio del día
- Branches con un solo propósito
- Commits pequeños y frecuentes
- Mensajes descriptivos
- `git status` antes y después de cada operación
- Sincronizar con main cada 1-2 días

### Semanales (cada viernes)

- Limpiar branches locales mergeadas
- Cerrar PRs abandonados
- Actualizar issues asignados
- Pull en todos los repos activos

### Antes de cerrar el día

- `git status` (verificar nada pendiente)
- Pushear todo lo importante
- Anotar dónde quedaste

---

## 12. Errores comunes y soluciones

| Error | Solución |
|---|---|
| "Updates were rejected" | `git pull` antes de `git push` |
| "Cannot switch branches with uncommitted changes" | `git stash` o commit primero |
| "Merge conflict" | Resolver manualmente o con VSCode |
| "Permission denied" en push | Verificar acceso con tu lead |
| "Detached HEAD" | `git switch nombre-branch` |
| Borraste algo por accidente | `git reflog` para encontrar y recuperar |
| Pusheaste algo malo | `git revert` (no `--force` en main) |

---

## 13. Comandos que NO debes usar (a menos que sepas qué haces)

```bash
git push --force         # Puede destruir trabajo de otros
git reset --hard <ref>   # Después de push, peligroso
git rebase main          # Reescribe historia, complicado
git push --force-with-lease  # Más seguro pero igual peligroso
```

> 💡 **Regla:** estos comandos están bien en branches PERSONALES. Nunca en main o branches compartidas.

---

## 14. La filosofía del trabajo con Git

Si tuviera que resumir todo el módulo en 5 principios:

### 1. Tu commit message es una carta a tu yo del futuro

Escríbelo pensando en quién va a leerlo en 6 meses sin contexto.

### 2. Una branch = una idea

Si tienes que usar "y" para describir tu branch, son dos branches.

### 3. Pequeño y frecuente > grande y ocasional

10 commits chicos al día > 1 commit gigante al final.

### 4. Pull antes de push, siempre

Te ahorra el 90% de los conflictos.

### 5. Cuando dudes, pregunta

Git es complejo. Pedir ayuda no es debilidad, es profesionalismo.

---

*Universidad Nexus — Curso de GitHub para Analistas*
