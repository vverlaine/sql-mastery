---
sidebar_position: 3
title: Merge y Resolución de Conflictos
---

# Merge y Resolución de Conflictos

Crear branches es solo la mitad del trabajo. La otra mitad es **mergear** (fusionar) los cambios de vuelta a `main` cuando terminas. Esta lección te enseña cómo hacer merges, y lo más importante: cómo resolver los **conflictos** que aparecen cuando dos personas modifican el mismo código.

---

## ¿Qué es un merge?

Un **merge** es el proceso de combinar dos branches. Cuando terminas de trabajar en `feature/algo`, "fusionas" sus cambios con `main` para que pasen a ser parte del código oficial.

Visualmente:

```
ANTES del merge:

main:        A---B---C
                  \
feature:           D---E

DESPUÉS del merge:

main:        A---B---C---M
                  \     /
feature:           D---E
```

`M` es el "commit de merge": un commit especial que combina las dos branches. Contiene todos los cambios de `feature` aplicados sobre `main`.

---

## El merge básico

El flujo es siempre el mismo: te paras en la branch que va a RECIBIR los cambios, y mergeas la otra.

### Modo línea de comandos

```bash
# 1. Cambiar a main (la branch que recibe)
git switch main

# 2. Mergear feature
git merge feature/agregar-validacion

# 3. (Opcional) Borrar la branch ya mergeada
git branch -d feature/agregar-validacion
```

### Modo VSCode

1. Cambia a `main` (click en branch en barra inferior)
2. Abre la paleta de comandos (`Cmd/Ctrl + Shift + P`)
3. Escribe "Git: Merge Branch"
4. Selecciona la branch a mergear

---

## Tipos de merge

Hay dos tipos principales de merge, y Git decide cuál usar automáticamente según la situación.

### Fast-forward merge

Cuando `main` no ha cambiado desde que creaste tu branch, el merge es un **fast-forward**. Simplemente "mueve" el puntero de `main` hasta donde está tu branch.

```
ANTES:

main:        A---B---C
                      \
feature:               D---E

DESPUÉS (fast-forward):

main:        A---B---C---D---E
```

No se crea un commit de merge porque no hace falta. Es la situación más limpia.

### Three-way merge (merge real)

Cuando `main` SÍ cambió mientras trabajabas en tu branch, Git necesita combinar los dos historiales. Esto crea un commit de merge.

```
ANTES:

main:        A---B---C---F
                  \
feature:           D---E

DESPUÉS (three-way merge):

main:        A---B---C---F---M
                  \         /
feature:           D---E---'
```

`M` es el commit de merge. Contiene los cambios de F (que vinieron a main mientras trabajabas) combinados con D y E (los tuyos).

> 💡 **No tienes que pensar en cuál usar.** Git decide automáticamente. Solo es bueno saber que existen los dos para entender qué ves en el historial.

---

## Forzar un merge commit (no fast-forward)

A veces querés que SIEMPRE se cree un commit de merge, incluso cuando podría ser fast-forward. Por dos razones:

1. **Trazabilidad**: el commit de merge marca claramente cuándo una feature se integró
2. **Reversibilidad**: si necesitas revertir la feature completa, basta con revertir un commit

Para forzar:

```bash
git merge --no-ff feature/nueva-funcionalidad
```

`--no-ff` significa "no fast-forward".

> 💡 **Convención común en CBC y muchos equipos:** usar `--no-ff` para features importantes. Mantiene el historial más explícito.

---

## ¿Qué es un conflicto?

Un **conflicto de merge** ocurre cuando Git intenta combinar dos branches y NO PUEDE decidir qué versión usar. Pasa cuando dos branches modifican la **misma línea del mismo archivo** de formas distintas.

Ejemplo: estás en `main` y tu colega en `feature`. Ambos modifican la línea 10 de `analisis.py`:

```python
# Tú en main
margen = ventas * 0.30

# Tu colega en feature
margen = ventas * 0.35
```

Cuando intentas mergear, Git no sabe cuál es la correcta. Te marca el conflicto y te pide que TÚ decidas.

> 💡 **Los conflictos son normales y son parte del trabajo en equipo.** No tengas miedo de ellos. Si nunca tienes conflictos, es probablemente porque trabajas solo o tu equipo no comparte código.

---

## Resolver un conflicto paso a paso

Vamos a ver el flujo completo. Imagina que estás haciendo un merge y aparece un conflicto.

### 1. Git te avisa

```bash
git merge feature/cambios-margen
```

Resultado:

```
Auto-merging analisis.py
CONFLICT (content): Merge conflict in analisis.py
Automatic merge failed; fix conflicts and then commit the result.
```

Lee:

- **CONFLICT**: hay un conflicto
- **content**: el conflicto es de contenido (líneas distintas)
- **analisis.py**: en este archivo
- **fix conflicts and then commit the result**: Git te dice qué hacer

### 2. Ver el estado

```bash
git status
```

Te muestra:

```
On branch main
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   analisis.py
```

`both modified` significa que el archivo fue modificado en ambas branches.

### 3. Abrir el archivo conflictivo

Git modificó el archivo para mostrarte el conflicto. Si lo abres, vas a ver algo como:

```python
def calcular_margen(ventas):
<<<<<<< HEAD
    margen = ventas * 0.30  # versión de main
=======
    margen = ventas * 0.35  # versión de feature
>>>>>>> feature/cambios-margen
    return margen
```

Lectura:

- **`<<<<<<< HEAD`**: aquí empieza la versión de tu branch actual (main)
- **`=======`**: separador
- **`>>>>>>> feature/cambios-margen`**: aquí termina la versión de la otra branch

Las dos versiones están una encima de la otra, esperando tu decisión.

### 4. Decidir qué versión usar

Tienes que elegir una de tres opciones:

- **Quedarte con la versión de HEAD** (main)
- **Quedarte con la versión de feature**
- **Combinar las dos** de alguna forma manual

Editas el archivo a mano. Por ejemplo, decides que quieres la versión nueva:

```python
def calcular_margen(ventas):
    margen = ventas * 0.35
    return margen
```

Borraste todas las marcas (`<<<<<<<`, `=======`, `>>>>>>>`) y dejaste solo la versión que quieres.

### 5. Marcar como resuelto

Después de editar y guardar, le dices a Git que ya resolviste el conflicto:

```bash
git add analisis.py
```

Y luego completas el merge:

```bash
git commit
```

Git te abre el editor con un mensaje predefinido. Puedes editarlo o dejarlo así. Guarda y cierra.

### 6. Verificar

```bash
git log --oneline --graph
```

Vas a ver el commit de merge en el historial. ¡Listo!

---

## Resolver conflictos en VSCode (mucho más cómodo)

Resolver conflictos a mano editando el archivo es factible pero feo. VSCode tiene un editor visual de conflictos que es MUCHO más cómodo.

Cuando hay un conflicto, abre el archivo en VSCode. Vas a ver botones encima de cada conflicto:

- **Accept Current Change**: usa la versión de tu branch actual (HEAD)
- **Accept Incoming Change**: usa la versión de la otra branch
- **Accept Both Changes**: incluye las dos versiones
- **Compare Changes**: abre vista lado a lado

Click en la opción que quieras y VSCode resuelve esa parte por ti.

> 💡 **Mi recomendación honesta:** para resolver conflictos, usa siempre VSCode. Es 10 veces más rápido que editar a mano. Para todo lo demás, la línea de comandos está bien.

---

## Cancelar un merge en curso

¿Empezaste un merge y te das cuenta que prefieres no hacerlo? Puedes abortar:

```bash
git merge --abort
```

Vuelve todo al estado anterior al merge. Sin daños.

> 💡 **Útil cuando:** ves que hay muchos conflictos y prefieres resolverlos antes (en otra branch, por ejemplo) antes de intentar el merge de nuevo.

---

## Buenas prácticas para evitar conflictos

Los conflictos son normales pero molestos. Hay prácticas que los reducen:

### 1. Mantén las branches cortas

Cuanto más tiempo viva una branch sin mergearse, más probable es que tenga conflictos. Trata de hacer branches que duren máximo unos días, no semanas.

### 2. Sincroniza con main frecuentemente

Si tu branch va a vivir varios días, baja los cambios de `main` cada cierto tiempo:

```bash
# Estás en feature/algo
git switch main
git pull  # bajar cambios del remoto (lo verás en sesión 4)
git switch feature/algo
git merge main
```

Esto reduce conflictos al final, porque vas resolviendo cambios pequeños en lugar de uno grande.

### 3. Comunícate con tu equipo

Si sabes que vas a tocar un archivo importante, avisa al equipo antes. "Voy a refactorizar `transformaciones.py`, no lo toquen mientras tanto." Es mucho más fácil que resolver conflictos después.

### 4. Hacer commits pequeños y frecuentes

Cada commit pequeño es una unidad fácil de mergear. Commits grandes son más propensos a conflictos.

### 5. Usa `git pull --rebase` cuando sea posible

(Lo verás en sesión 6.) Es una alternativa a merge que evita los commits de merge cuando los cambios son lineales.

---

## Resolver conflictos: anatomía de un caso real

Vamos a ver un ejemplo realista que vas a vivir en CBC.

### El escenario

Estás en `feature/agregar-segmentacion` agregando una columna nueva a un análisis. Mientras tanto, tu colega en `main` corrigió un bug en la misma función. Cuando intentas mergear, hay un conflicto.

### El archivo conflictivo

```python
def procesar_ventas(df):
<<<<<<< HEAD
    # Bug fix: convertir monto a float antes de operar
    df = df.withColumn("monto", F.col("monto").cast("double"))
=======
    # Nueva segmentación por cliente
    df = df.withColumn("segmento", 
                       F.when(F.col("monto") > 1000, "premium")
                        .otherwise("standard"))
>>>>>>> feature/agregar-segmentacion
    return df
```

### El análisis

Ambos cambios son válidos y NO se contradicen. Necesitas combinarlos.

### La resolución

```python
def procesar_ventas(df):
    # Bug fix: convertir monto a float antes de operar
    df = df.withColumn("monto", F.col("monto").cast("double"))
    
    # Nueva segmentación por cliente
    df = df.withColumn("segmento", 
                       F.when(F.col("monto") > 1000, "premium")
                        .otherwise("standard"))
    return df
```

Borraste las marcas y combinaste las dos versiones. Ahora `git add analisis.py && git commit`.

### Cuándo NO combinar

A veces los cambios SÍ se contradicen. Por ejemplo:

```python
<<<<<<< HEAD
margen_iva = monto * 0.13
=======
margen_iva = monto * 0.15  # Cambio aprobado por finanzas
>>>>>>> feature/actualizar-iva
```

Aquí solo una versión puede ser correcta. Tienes que decidir cuál (o consultar con quien sepa).

> 💡 **Regla de oro:** cuando dudes en un conflicto, **NO commitees solo**. Pregunta. Es mejor pausar 10 minutos para preguntar que mergear algo incorrecto que rompe el código.

---

## El comando que te salva: git log para entender qué pasó

Si llegaste a un conflicto y no entiendes por qué, ver el historial de los dos lados te ayuda:

```bash
# Ver los commits que vienen de la otra branch
git log HEAD..feature/agregar-segmentacion

# Ver los commits que están solo en HEAD
git log feature/agregar-segmentacion..HEAD
```

Esto te muestra exactamente qué cambió en cada lado, ayudándote a tomar decisiones informadas.

---

## 🎯 Tareas

**Tarea 1:** En tu repo de práctica, asegúrate de tener al menos un archivo (`README.md` por ejemplo).

**Tarea 2:** Crea una branch `feature/cambios-A` y modifica una línea del README. Hazle commit.

**Tarea 3:** Vuelve a main. Crea otra branch `feature/cambios-B` y modifica LA MISMA línea del README de forma diferente. Hazle commit.

**Tarea 4:** Vuelve a main. Mergea `feature/cambios-A`. Esto debería ser un fast-forward sin conflicto.

**Tarea 5:** Ahora intenta mergear `feature/cambios-B`. Esto SÍ debería generar un conflicto.

**Tarea 6:** Resuelve el conflicto manualmente o con VSCode. Combina las dos versiones de la forma que quieras.

**Tarea 7:** Completa el merge con `git add` y `git commit`.

**Tarea 8:** Ejecuta `git log --oneline --graph --all` y entiende el grafo resultante.

---

*Universidad Nexus — Curso de GitHub para Analistas*
