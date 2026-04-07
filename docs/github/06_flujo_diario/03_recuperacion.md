---
sidebar_position: 4
title: Comandos de Recuperación
---

# Comandos de Recuperación

Hay un dicho entre desarrolladores: **"si lo pusiste en Git, casi nunca se pierde"**. Pero solo si sabes los comandos correctos para recuperarlo. Esta lección te enseña los comandos que vas a necesitar cuando algo sale mal: deshacer cambios, recuperar commits perdidos, revertir merges malos.

---

## La regla más importante: NO entres en pánico

Cuando algo sale mal con Git, la peor decisión es ejecutar comandos al azar para "arreglarlo". Eso casi siempre empeora la situación.

**Reglas básicas:**

1. **No ejecutes nada que no entiendas**
2. **No borres carpetas como `.git/`**
3. **No hagas `--force` a menos que sepas exactamente qué hace**
4. **Cuando dudes, pregunta**

Casi cualquier "desastre" en Git tiene una solución. Pero solo si NO sigues haciendo cosas mientras intentas resolver.

---

## Deshacer cambios no commiteados

### Descartar cambios en un archivo

Editaste un archivo y quieres volver al estado del último commit:

```bash
git restore archivo.py
```

> ⚠️ **Esto borra tus cambios irrecuperablemente.** Asegúrate de que es lo que quieres.

### Descartar TODOS los cambios

```bash
git restore .
```

Borra todos los cambios pendientes en tu working directory.

### Sacar archivos del staging area

Hiciste `git add` por error:

```bash
git restore --staged archivo.py
```

Esto saca el archivo del staging pero MANTIENE tus cambios. Solo "desagrega".

### Recuperar un archivo borrado (si todavía no commiteaste el borrado)

```bash
git restore archivo_borrado.py
```

Vuelve a aparecer.

---

## Modificar el último commit

### Cambiar el mensaje del último commit

Te equivocaste al escribir el mensaje:

```bash
git commit --amend -m "Nuevo mensaje correcto"
```

> ⚠️ **Solo si NO hiciste push.** Si ya lo subiste, modificarlo causa problemas.

### Agregar archivos olvidados al último commit

Olvidaste agregar un archivo en tu commit anterior:

```bash
git add archivo_olvidado.py
git commit --amend --no-edit
```

`--no-edit` mantiene el mismo mensaje. Si quieres también cambiar el mensaje, omite `--no-edit`.

### Quitar un archivo del último commit

Incluiste algo que no debías:

```bash
git restore --staged archivo_que_no_debe_ir.py
git commit --amend --no-edit
```

---

## Deshacer commits enteros

### Volver al commit anterior pero MANTENER los cambios

Hiciste un commit que en realidad querías dividir en varios. Quieres "deshacer el commit" pero conservar tu trabajo:

```bash
git reset --soft HEAD~1
```

Resultado:

- El commit desaparece
- Los cambios vuelven al staging area
- Puedes reorganizar y commitear de nuevo

### Volver al commit anterior y descartar los cambios

Hiciste un commit que está completamente mal y quieres borrarlo junto con su contenido:

```bash
git reset --hard HEAD~1
```

> ⚠️ **`--hard` es destructivo.** Borra los cambios sin posibilidad de recuperar (excepto via reflog). Úsalo solo si estás SEGURO.

### Volver a un commit específico

```bash
git reset --hard <hash-del-commit>
```

Para encontrar el hash:

```bash
git log --oneline
```

---

## Revertir un commit (la opción segura)

`git reset` es destructivo: cambia el historial. Si ya pusheaste, no puedes usarlo.

`git revert` es la alternativa segura: crea un NUEVO commit que deshace los cambios del commit que quieres revertir. No borra historia, agrega.

```bash
git revert <hash-del-commit>
```

Git te abre el editor con un mensaje predefinido. Guarda y cierra. Tienes un nuevo commit que deshace los cambios del commit que indicaste.

> 💡 **Cuándo usar revert vs reset:**
> - **Reset**: para commits que NO has pusheado aún
> - **Revert**: para commits que YA pusheaste y otros pueden tenerlos

### Revertir un merge

Los merge commits son especiales. Para revertirlos necesitas indicar a qué "padre" volver:

```bash
git revert -m 1 <hash-del-merge>
```

`-m 1` significa "vuelve al primer padre" (típicamente la branch a la que mergeaste).

---

## Recuperar commits "perdidos" con git reflog

`git reflog` es uno de los comandos más poderosos. Te muestra TODOS los movimientos que hiciste, incluso los que ya no aparecen en `git log` normal.

```bash
git reflog
```

Resultado:

```
a3f5c8d HEAD@{0}: reset: moving to HEAD~1
b4e7f9a HEAD@{1}: commit: trabajo importante
c5d8e0b HEAD@{2}: commit: otro commit
```

Si "perdiste" el commit `b4e7f9a` por un reset, puedes recuperarlo:

```bash
git checkout b4e7f9a
git switch -c branch-de-recuperacion
```

Acabas de "rescatar" el commit en una branch nueva.

> 💡 **`git reflog` guarda los últimos 30 días de actividad por defecto.** Casi nada se pierde para siempre en Git si actúas dentro de ese tiempo.

---

## Casos comunes y sus soluciones

### Caso 1: "Hice commit en la branch equivocada"

Estabas en `main` y commiteaste algo que debía ir en una feature branch:

```bash
# 1. Crear la branch correcta desde donde estás
git switch -c feature/nombre-correcto

# 2. Volver a main
git switch main

# 3. Borrar el commit en main
git reset --hard HEAD~1
```

Tu commit ahora vive en la branch correcta y main está limpio.

### Caso 2: "Pusheé algo que no debía"

Subiste algo (un archivo de prueba, un secreto, etc.) y quieres sacarlo:

**Si nadie más bajó tu cambio**:

```bash
# Revertir local
git reset --hard HEAD~1

# Forzar push (peligroso, solo en branches personales)
git push --force origin tu-branch
```

**Si otros ya pueden haberlo bajado**:

```bash
# Crear un commit que revierte
git revert <hash-del-commit-malo>
git push
```

Los otros tendrán que hacer pull para tener la corrección.

### Caso 3: "Borré un archivo y ya commitee"

```bash
# Encontrar el hash del commit donde el archivo todavía existía
git log --diff-filter=D --summary

# Recuperar el archivo de ese commit
git checkout <hash>~1 -- ruta/al/archivo.py

# Commitear la recuperación
git add ruta/al/archivo.py
git commit -m "restore: recuperar archivo borrado por error"
```

### Caso 4: "Mi branch local diverge mucho del remoto"

Tu branch local y la del remoto se separaron por algún motivo. La opción nuclear:

```bash
# Backup de seguridad
git switch -c backup-por-si-acaso

# Volver a la branch problemática
git switch tu-branch

# Resetear al estado del remoto exactamente
git fetch origin
git reset --hard origin/tu-branch
```

Tu branch local ahora es idéntica al remoto. Si necesitas recuperar algo, lo tienes en `backup-por-si-acaso`.

### Caso 5: "Quiero descartar TODOS mis cambios locales"

```bash
# Descartar cambios no commiteados
git restore .

# Eliminar archivos untracked
git clean -fd
```

> ⚠️ **`git clean -fd` borra archivos que no están en Git.** Asegúrate de que no hay nada importante que olvidaste agregar.

---

## stash: guardar cambios temporalmente

`git stash` te permite guardar cambios temporalmente sin commitearlos. Útil cuando necesitas cambiar de branch pero tienes trabajo a medias.

### Guardar cambios

```bash
git stash
```

Tu working directory queda limpio. Los cambios están guardados en una "pila" de stashes.

### Ver tus stashes

```bash
git stash list
```

Resultado:

```
stash@{0}: WIP on feature/algo: a3f5c8d último commit
stash@{1}: WIP on main: b4e7f9a otro commit
```

### Recuperar el último stash

```bash
git stash pop
```

Esto trae los cambios de vuelta y borra el stash de la lista.

### Recuperar manteniendo el stash

```bash
git stash apply
```

Igual, pero el stash se queda guardado.

### Stash con mensaje descriptivo

```bash
git stash push -m "WIP: refactor de función limpiar_ventas"
```

### Stash incluyendo archivos untracked

```bash
git stash -u
```

> 💡 **`git stash` es como un "guardar como borrador".** Útil cuando tienes trabajo a medias y necesitas cambiar de contexto urgentemente.

---

## Limpiar el repositorio

### Borrar archivos untracked

A veces tu working directory está lleno de archivos temporales. Para limpiar:

```bash
# Ver qué se borraría (sin hacerlo)
git clean -n

# Borrar archivos untracked
git clean -f

# Borrar archivos Y carpetas untracked
git clean -fd
```

> ⚠️ **Cuidado:** lo que borres con `git clean` no se puede recuperar. Siempre usa `-n` primero para previsualizar.

### Limpiar branches viejas

```bash
# Borrar todas las branches locales mergeadas a main
git branch --merged main | grep -v "main" | xargs git branch -d
```

Para branches no mergeadas, tienes que ser más explícito (y usar `-D` mayúscula).

---

## Cuando NADA funciona

Hay un escenario que vas a vivir tarde o temprano:

- Tu repo está en un estado raro
- Ningún comando lo arregla
- Llevas 2 horas intentando

**Estrategia de último recurso**: clonar de nuevo.

```bash
# 1. Asegurarte de que todos tus cambios importantes están pusheados
git status
git push

# 2. Ir a otra carpeta
cd ~/Documents

# 3. Clonar fresh
git clone https://github.cbc.com/equipo/repo.git repo-fresh

# 4. Trabajar en la nueva
cd repo-fresh
```

Es "trampa" pero a veces es lo más rápido. Solo asegúrate de NO PERDER trabajo: lo que esté local sin pushear se va a perder.

---

## El comando para "ver qué pasaría"

Muchos comandos de Git tienen un flag `--dry-run` o equivalente que te muestra qué pasaría sin hacerlo realmente:

```bash
git clean -n          # ver qué borraría
git rm --dry-run ...  # ver qué eliminaría
git push --dry-run    # ver qué pushearía
```

> 💡 **Cuando dudes de un comando destructivo, usa dry-run primero.**

---

## Cheat sheet de recuperación

| Situación | Comando |
|---|---|
| Descartar cambios en archivo | `git restore archivo` |
| Descartar TODO | `git restore .` |
| Sacar de staging | `git restore --staged archivo` |
| Cambiar mensaje del último commit | `git commit --amend -m "..."` |
| Agregar a último commit | `git add ... && git commit --amend --no-edit` |
| Deshacer commit (mantener cambios) | `git reset --soft HEAD~1` |
| Deshacer commit (descartar cambios) | `git reset --hard HEAD~1` |
| Revertir commit pusheado | `git revert <hash>` |
| Recuperar commit perdido | `git reflog` → `git checkout <hash>` |
| Guardar trabajo temporal | `git stash` |
| Recuperar trabajo guardado | `git stash pop` |
| Limpiar untracked | `git clean -fd` |
| Resetear branch local al remoto | `git reset --hard origin/branch` |

Ten esta tabla a la mano. Vas a volver a ella muchas veces los primeros meses.

---

## 🎯 Tareas

**Tarea 1:** Practica `git restore`: modifica un archivo, después descarta los cambios.

**Tarea 2:** Practica `git commit --amend`: haz un commit, después agrega un archivo olvidado al mismo commit.

**Tarea 3:** Practica `git reset --soft`: haz un commit, deshazlo manteniendo los cambios, vuelve a commitearlos.

**Tarea 4:** Practica `git revert`: haz un commit con algún cambio, después usa revert para crear un commit que lo deshaga.

**Tarea 5:** Practica `git stash`: edita un archivo, guarda los cambios con stash, cambia de branch, vuelve, y recupera con stash pop.

**Tarea 6:** Ejecuta `git reflog` en tu repo y entiende qué movimientos has hecho. Esta vista es tu red de seguridad.

---

*Universidad Nexus — Curso de GitHub para Analistas*
