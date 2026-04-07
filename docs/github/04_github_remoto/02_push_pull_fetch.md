---
sidebar_position: 3
title: Push, Pull y Fetch
---

# Push, Pull y Fetch

Tres comandos. Tres acciones. Si los entiendes bien, dominas el flujo remoto de Git completo. Esta lección los explica con casos reales de uso.

---

## Los tres comandos en una imagen

```
   GitHub Enterprise (remoto)
        ▲   │
        │   │
   PUSH │   │ FETCH / PULL
        │   ▼
   Tu computadora (local)
```

- **`git push`**: subir tus commits locales al remoto
- **`git fetch`**: bajar información del remoto sin aplicarla
- **`git pull`**: bajar y aplicar cambios del remoto a tu local (= fetch + merge)

---

## git push: subir tus cambios

`git push` toma tus commits locales y los sube al remoto. Es lo que haces cuando terminaste tu trabajo y quieres compartirlo con el equipo.

### Sintaxis básica

```bash
git push origin main
```

Significa: "sube la branch `main` al remoto llamado `origin`".

### Si configuraste tracking con `-u`

Una vez que hiciste `git push -u origin main` la primera vez, en el futuro basta con:

```bash
git push
```

Git ya sabe a qué remoto y a qué branch subir.

### Push de una branch específica

Si estás en una branch llamada `feature/nueva-validacion`:

```bash
git push origin feature/nueva-validacion
```

O si ya tiene tracking:

```bash
git push
```

### Push de TODAS las branches

```bash
git push --all origin
```

> ⚠️ **Cuidado con `--all`:** sube todas tus branches locales, incluyendo experimentos personales que no querías compartir. Úsalo solo cuando estés seguro.

### Modo VSCode

En el panel de Source Control:

1. Después de hacer commit, en el menú "..." (tres puntos arriba)
2. Selecciona "Push"
3. O usa el icono de sincronización en la barra inferior (la flecha hacia arriba con número)

---

## git fetch: bajar info sin aplicarla

`git fetch` baja información del remoto pero NO la aplica a tus archivos. Te permite **ver** qué hay nuevo en el remoto antes de decidir si lo quieres traer.

### Sintaxis

```bash
git fetch origin
```

Después de fetch, Git "sabe" qué cambios hay en el remoto, pero tu working directory sigue intacto. Puedes verlos con:

```bash
git log origin/main
```

O con interfaz gráfica:

```bash
git log --all --oneline --graph
```

### ¿Para qué sirve fetch sin pull?

- **Inspeccionar** qué cambió en el remoto antes de aplicarlo
- **Revisar** cambios de un colega antes de integrarlos
- **Verificar** si tu branch está atrasada respecto al remoto sin afectar tu trabajo en curso

> 💡 **Caso típico:** estás a mitad de algo importante y quieres saber si el remoto cambió, pero no quieres traer los cambios todavía. `git fetch` te da esa información sin tocar nada.

---

## git pull: bajar y aplicar

`git pull` es la combinación de `git fetch` + `git merge`. Baja los cambios del remoto Y los aplica a tu branch local.

### Sintaxis básica

```bash
git pull origin main
```

O si tienes tracking:

```bash
git pull
```

### Lo que hace internamente

```bash
# Equivalente a:
git fetch origin
git merge origin/main
```

Trae los commits nuevos del remoto y los mergea con tu branch actual.

### Cuándo hacer pull

**Antes de empezar a trabajar cada día:**

```bash
git switch main
git pull
```

Esto asegura que partes del estado más reciente del repo.

**Antes de hacer push:**

```bash
git pull
git push
```

Si el remoto tiene cambios nuevos que tú no tienes, `git push` puede fallar. Hacer `pull` primero los baja y los integra.

**Después de un sync con tu equipo:**

Si tu colega te avisa "subí mis cambios", haces `git pull` para tenerlos.

### Modo VSCode

En el panel de Source Control:

1. Click en el menú "..." 
2. "Pull"

O click en el icono de sincronización en la barra inferior (la flecha hacia abajo con número).

---

## El flujo completo del día a día

Vamos a juntar todo en un flujo realista. Imagina que llegas a trabajar el lunes:

```bash
# 1. Llegar al trabajo, abrir el repo
cd ~/proyectos/proyecto-ventas

# 2. Asegurarte de estar en main
git switch main

# 3. Bajar lo último del remoto
git pull

# 4. Crear branch para tu trabajo del día
git switch -c feature/agregar-metrica-roi

# 5. Trabajar... editar archivos... commitear...
# ... varios commits ...
git add .
git commit -m "feat: agregar cálculo de ROI"

# ... más trabajo ...
git add .
git commit -m "feat: incluir ROI en reporte mensual"

# 6. Cuando estés listo para compartir, hacer push
git push -u origin feature/agregar-metrica-roi

# 7. (Lo verás en sesión 5) Crear un Pull Request en GitHub
```

Este flujo se repite todos los días. Es la base de todo trabajo profesional con Git.

---

## Conflictos al hacer pull

A veces `git pull` falla con un conflicto. Esto pasa cuando:

- Tú modificaste un archivo localmente
- Otra persona modificó el mismo archivo en el remoto
- Git no puede combinar automáticamente

El mensaje se ve así:

```
Auto-merging analisis.py
CONFLICT (content): Merge conflict in analisis.py
Automatic merge failed; fix conflicts and then commit the result.
```

La solución es exactamente la misma que viste en la sección anterior:

1. Abre el archivo conflictivo
2. Resuelve manualmente o con VSCode
3. `git add archivo.py`
4. `git commit` para completar el merge

> 💡 **Buena práctica:** haz `git pull` con frecuencia, así los conflictos son chicos cuando aparecen. Si pasas días sin pull, los conflictos pueden ser enormes.

---

## Errores comunes con push/pull

### "Updates were rejected because the remote contains work that you do not have"

Significa que el remoto tiene commits nuevos que tú no tienes. Solución:

```bash
git pull
# resuelve conflictos si los hay
git push
```

### "fatal: The current branch X has no upstream branch"

Estás intentando hacer push pero la branch no tiene tracking configurado. Solución:

```bash
git push -u origin <nombre-de-tu-branch>
```

### "Permission denied" al hacer push

Tu usuario no tiene permisos de escritura en el repo. Verifica con tu lead.

### Hiciste push de algo que no querías

Si lo subiste pero NADIE más lo descargó todavía:

```bash
# Revertir el último commit local
git reset --hard HEAD~1

# Forzar push (ten cuidado)
git push --force origin <branch>
```

Pero **`--force` es peligroso**. Solo úsalo en branches personales que sabes que nadie más usa.

> ⚠️ **NUNCA hagas force push en main o en branches compartidas.** Puedes destruir el trabajo de todo el equipo. Si dudas, pregunta antes.

---

## Push y branches: lo que necesitas saber

### Cada branch es independiente al hacer push

Si estás en `feature/A` y haces `git push`, solo subes `feature/A`. La branch `main` y otras no se afectan.

### Las branches del remoto vs tus branches locales

Después de un push:

```
Local                         Remoto
├── main                      ├── main
├── feature/A   ──push──→     ├── feature/A
└── feature/B (no pusheada)   └── (no existe en remoto)
```

`feature/B` solo vive en tu computadora hasta que la pushees.

### Ver qué branches existen en el remoto

```bash
git branch -r
```

Te lista solo las branches del remoto:

```
origin/main
origin/feature/A
origin/develop
```

---

## Sincronizar branches del remoto que no conocías

Cuando otros pushean branches nuevas, no las ves automáticamente en tu local. Para verlas:

```bash
git fetch origin
```

Esto descarga la información de todas las branches del remoto. Después puedes "checkear" una branch nueva:

```bash
git switch <nombre-de-la-branch>
```

Git automáticamente crea una versión local de esa branch que rastrea la del remoto.

---

## Comparación rápida

| Acción | Cuándo usar |
|---|---|
| `git push` | Después de hacer commits que quieres compartir |
| `git pull` | Al empezar el día, antes de hacer push, después de un sync con el equipo |
| `git fetch` | Cuando quieres saber qué hay nuevo sin aplicarlo todavía |

---

## Visualizar el estado de sincronización

VSCode te muestra el estado de sincronización en la barra inferior:

```
↓ 2  ↑ 1
```

Significa:

- **`↓ 2`**: hay 2 commits nuevos en el remoto que no tienes localmente
- **`↑ 1`**: tienes 1 commit local que no está en el remoto

Click en el icono de sincronización ejecuta `git pull` y luego `git push` automáticamente.

> 💡 **Esto es muy útil para no perder de vista si estás "en sync" con el equipo.**

---

## 🎯 Tareas

**Tarea 1:** En tu repo conectado con GitHub Enterprise, haz un cambio en el README. Commitealo. Hazle push.

**Tarea 2:** Verifica en GitHub Enterprise que tu cambio aparece.

**Tarea 3:** En GitHub Enterprise, edita un archivo directamente (con el editor web). Haz commit ahí.

**Tarea 4:** En tu local, ejecuta `git fetch`. Verifica que ves el commit nuevo.

**Tarea 5:** Ahora haz `git pull` y verifica que el cambio del editor web está en tu local.

**Tarea 6:** Crea una branch nueva localmente, hazle un commit, y pushéala con `git push -u origin nombre-de-branch`.

**Tarea 7:** Verifica en GitHub Enterprise que tu nueva branch aparece.

**Tarea 8 (con un colega):** Pide a un colega que clone tu repo, haga un cambio, y haga push. Después tú haces pull y traes ese cambio a tu local.

---

*Universidad Nexus — Curso de GitHub para Analistas*
