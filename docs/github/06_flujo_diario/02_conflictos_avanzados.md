---
sidebar_position: 3
title: Resolución de Conflictos en la Vida Real
---

# Resolución de Conflictos en la Vida Real

En la sesión 3 viste cómo resolver conflictos básicos. Esta lección te muestra cómo se ven los conflictos en proyectos reales de CBC, las estrategias para minimizarlos, y cómo manejar situaciones complejas que vas a encontrar tarde o temprano.

---

## Por qué los conflictos son inevitables

Cuando dos personas modifican el mismo código, hay dos posibilidades:

1. **Las modificaciones son compatibles**: Git las combina automáticamente
2. **Las modificaciones se contradicen**: Git pide ayuda humana → conflicto

En equipos pequeños y bien coordinados, los conflictos son raros. En equipos grandes con muchos cambios paralelos, son frecuentes. **Aceptar que van a pasar y saber cómo manejarlos** es parte del trabajo profesional.

---

## Anatomía de un conflicto real

Vamos a ver un ejemplo de la vida real. Imagina que estás trabajando en `feature/agregar-segmentacion` y tu colega trabajó en `feature/optimizar-margen`. Ambos tocaron `lib/transformaciones.py`.

Tu colega ya mergeó su branch a main. Cuando tú vas a sincronizar:

```bash
git switch feature/agregar-segmentacion
git pull origin main
```

Resultado:

```
Auto-merging lib/transformaciones.py
CONFLICT (content): Merge conflict in lib/transformaciones.py
Automatic merge failed; fix conflicts and then commit the result.
```

Git te dice: "no pude combinar `lib/transformaciones.py`. Resuélvelo tú."

### Abriendo el archivo

```python
def procesar_ventas(df):
    """Procesa el DataFrame de ventas con limpieza y enriquecimiento."""
<<<<<<< HEAD
    # Tu cambio: agregar segmentación de clientes
    df = df.withColumn(
        "segmento_cliente",
        F.when(F.col("monto") > 5000, "premium")
         .when(F.col("monto") > 1000, "standard")
         .otherwise("basic")
    )
    
    # Filtros básicos
    df = df.filter(F.col("monto") > 0)
=======
    # Cambio del colega: optimizar cálculo de margen
    df = df.withColumn("monto", F.col("monto").cast("double"))
    
    df = df.withColumn(
        "margen",
        F.when(F.col("categoria") == "Bebidas", F.col("monto") * 0.35)
         .when(F.col("categoria") == "Snacks", F.col("monto") * 0.30)
         .otherwise(F.col("monto") * 0.25)
    )
    
    # Filtros básicos
    df = df.filter(F.col("monto") > 0)
>>>>>>> main
    
    return df
```

### Análisis del conflicto

Lo importante: **leer ambas versiones y entender qué hace cada una**.

- **Tu versión (HEAD)**: agrega una columna `segmento_cliente` basada en monto, mantiene el filtro original
- **Versión de main**: castea monto a double, agrega columna `margen` por categoría, mantiene el mismo filtro

¿Son compatibles? **Sí, son compatibles**. Los dos cambios hacen cosas distintas y no se contradicen. La resolución correcta es **incluir ambos**.

### La resolución

```python
def procesar_ventas(df):
    """Procesa el DataFrame de ventas con limpieza y enriquecimiento."""
    # Castear monto a double (cambio de optimización de margen)
    df = df.withColumn("monto", F.col("monto").cast("double"))
    
    # Calcular margen por categoría
    df = df.withColumn(
        "margen",
        F.when(F.col("categoria") == "Bebidas", F.col("monto") * 0.35)
         .when(F.col("categoria") == "Snacks", F.col("monto") * 0.30)
         .otherwise(F.col("monto") * 0.25)
    )
    
    # Agregar segmentación de clientes
    df = df.withColumn(
        "segmento_cliente",
        F.when(F.col("monto") > 5000, "premium")
         .when(F.col("monto") > 1000, "standard")
         .otherwise("basic")
    )
    
    # Filtros básicos
    df = df.filter(F.col("monto") > 0)
    
    return df
```

Borraste las marcas (`<<<<<<<`, `=======`, `>>>>>>>`) y combinaste las dos lógicas en un orden que tiene sentido.

### Completar el merge

```bash
git add lib/transformaciones.py
git status  # verificar que no hay más conflictos
git commit
```

Git te abre el editor con un mensaje predefinido tipo:

```
Merge branch 'main' into feature/agregar-segmentacion
```

Puedes dejarlo así o personalizarlo. Guarda y cierra el editor.

---

## Cuando los cambios SÍ se contradicen

A veces los cambios no son compatibles y tienes que decidir cuál usar.

### Ejemplo: dos formas distintas de calcular IVA

```python
<<<<<<< HEAD
# Tu versión
margen_iva = monto * 0.13
=======
# Versión de main: cambio aprobado por finanzas
margen_iva = monto * 0.15
>>>>>>> main
```

Aquí solo una versión puede ser correcta. Tienes que decidir.

### Cómo decidir

1. **Lee la historia de cada cambio** para entender el contexto:

```bash
# Ver el commit de la versión en main
git log -1 main -- lib/transformaciones.py

# Ver el commit de tu versión
git log -1 HEAD -- lib/transformaciones.py
```

2. **Mira los mensajes de commit y la descripción del PR** que originó cada cambio
3. **Si sigues sin estar seguro, pregunta** a quien hizo el otro cambio

> 💡 **Regla de oro:** cuando dudes en un conflicto, NO commitees solo. Pregunta. Es mejor pausar 10 minutos para confirmar que mergear algo incorrecto que rompe el código.

### La decisión

Si después de investigar descubres que el cambio en main fue aprobado por finanzas y es la versión correcta, te quedas con esa:

```python
margen_iva = monto * 0.15  # Cambio aprobado por finanzas, abril 2024
```

Bórraste las marcas, dejaste solo la versión correcta, y agregaste un comentario para que quien lea el código en el futuro entienda el por qué.

---

## Conflictos en archivos críticos

Hay archivos donde los conflictos son más delicados:

### Archivos de configuración (YAML, JSON)

```yaml
<<<<<<< HEAD
database:
  host: localhost
  port: 5432
  name: dev_db
=======
database:
  host: prod-server.cbc.com
  port: 5432
  name: prod_db
  ssl: true
>>>>>>> main
```

Aquí necesitas combinar inteligentemente: probablemente quieres mantener la estructura de main pero ajustar para dev:

```yaml
database:
  host: localhost
  port: 5432
  name: dev_db
  ssl: false
```

### Archivos de dependencias (requirements.txt, pyproject.toml)

```
<<<<<<< HEAD
pandas==2.0.3
numpy==1.24.0
=======
pandas==2.1.0
numpy==1.25.0
matplotlib==3.7.0
>>>>>>> main
```

Casi siempre quieres las versiones más nuevas Y todas las dependencias:

```
pandas==2.1.0
numpy==1.25.0
matplotlib==3.7.0
```

### Archivos de notebooks (.ipynb)

Los notebooks de Jupyter son archivos JSON con muchos metadatos. Los conflictos en notebooks son **horribles**: pueden haber miles de líneas de diff por un solo cambio visual.

> 💡 **Por eso recomendamos usar formato `.py` en lugar de `.ipynb`** (lo viste en el Pilar 4). Los `.py` con `# COMMAND ----------` son texto plano y los conflictos son normales.

Si DEBES manejar conflictos en `.ipynb`:

1. Abre el notebook en VSCode (con la extensión Jupyter)
2. Usa la vista de diff
3. Considera hacer **squash** de los cambios para tener un solo conflicto en lugar de 50

---

## Estrategias para minimizar conflictos

Los conflictos son normales pero molestos. Aquí van algunas prácticas que los reducen drásticamente.

### 1. Branches cortas

Branches que viven 2-3 horas casi nunca tienen conflictos. Branches que viven 2 semanas casi siempre los tienen.

### 2. Sincronizar con main frecuentemente

Si tu branch va a vivir más de un día, baja main al menos cada mañana:

```bash
git switch main
git pull
git switch tu-branch
git merge main
```

Resuelves conflictos chiquitos en lugar de uno gigante al final.

### 3. Comunicación con el equipo

Si vas a tocar un archivo crítico, **avisa al equipo** antes:

> "Voy a refactorizar `transformaciones.py` durante esta tarde, no lo toquen mientras tanto."

Cuesta 30 segundos mandar el mensaje. Ahorra horas de conflictos.

### 4. Archivos pequeños y modulares

Archivos gigantes con 1000 líneas son imanes de conflictos. Si dos personas tocan el mismo archivo, casi seguro hay conflicto.

**Solución:** dividir archivos grandes en módulos más chicos. Cada uno toca su propio archivo.

### 5. Funciones bien encapsuladas

Si las funciones son chicas y tienen una responsabilidad clara, dos personas pueden modificar funciones distintas del mismo archivo sin conflicto. Si las funciones son gigantes, cualquier cambio toca muchas líneas.

### 6. Convenciones del equipo

Adopta convenciones consistentes con tu equipo: indentación, ordenamiento de imports, formato de strings. Cuando dos personas tocan el mismo archivo con estilos distintos, hay conflictos por puro formato.

> 💡 **Black y Ruff (que viste en el Pilar 4) reducen conflictos por formato a CERO.** Es una de sus ventajas más subestimadas.

---

## Cancelar un merge en curso

¿Empezaste a resolver un merge y te das cuenta que prefieres no hacerlo? Puedes abortar:

```bash
git merge --abort
```

Vuelve todo al estado anterior al merge. Sin cambios, sin daño.

> 💡 **Útil cuando:** ves que hay muchos conflictos y prefieres entender el contexto primero, o cuando descubres que tu colega ya está resolviendo lo mismo en paralelo.

---

## El comando que te salva: git diff durante un conflicto

Durante un merge con conflicto, puedes usar variaciones de `git diff` para entender mejor qué pasa:

### Ver solo los conflictos

```bash
git diff --name-only --diff-filter=U
```

Te lista los archivos con conflictos sin commits.

### Ver tu versión vs la del otro

```bash
git diff HEAD       # tu versión
git diff MERGE_HEAD # la otra versión
```

### Ver el commit que originó cada lado

```bash
git log --merge --oneline
```

Te muestra los commits que están "en conflicto", uno de cada lado.

---

## Recuperarse de un merge mal resuelto

A veces resuelves un conflicto, mergeas, y después te das cuenta que cometiste un error: borrar líneas que no debías, dejar marcas residuales, etc.

### Si todavía no hiciste push

Puedes deshacer el merge completamente:

```bash
git reset --hard HEAD~1
```

Esto borra el último commit (el de merge) y vuelve al estado anterior. **Solo si no hiciste push.**

### Si ya hiciste push

No puedes "deshacer" porque otros pueden haber bajado tu cambio. La opción es revertir con un nuevo commit:

```bash
git revert -m 1 <hash-del-commit-de-merge>
```

Esto crea un nuevo commit que deshace los cambios del merge. Es seguro porque no reescribe historia.

> ⚠️ **`git revert` es seguro. `git reset --hard` después de un push es peligroso.** Recuerda esto.

---

## El conflicto definitivo: cuando todo va mal

Hay un escenario que vas a vivir tarde o temprano:

- Tienes una branch con varios días de trabajo
- Intentas mergear main y aparecen 30 conflictos
- Empiezas a resolver, te confundes, borras lo que no debías
- El código ya no compila
- Tienes pánico

**No entres en pánico. NO borres nada.**

### Estrategia 1: abortar y volver a empezar

```bash
git merge --abort
```

Vuelves al estado de antes del merge. Respira. Pide ayuda.

### Estrategia 2: resolver con ayuda

Pide a un colega que se siente contigo (o haga screenshare) para resolver los conflictos juntos. Dos pares de ojos siempre encuentran las soluciones más rápido.

### Estrategia 3: rehacer el trabajo en una branch limpia

Si los conflictos son demasiado, a veces es más rápido:

1. Guardar tu código actual en otro lado
2. Crear una branch nueva desde main actualizado
3. Aplicar tus cambios manualmente, esta vez sin pelear con conflictos

Es trabajo extra, pero a veces es lo más eficiente.

> 💡 **No hay vergüenza en pedir ayuda con conflictos.** Los desarrolladores senior también la piden. Es trabajo en equipo.

---

## El reflog: tu red de seguridad

`git reflog` es uno de los comandos más subestimados de Git. Te muestra TODOS los movimientos que hiciste, incluso los que ya no aparecen en `git log`:

```bash
git reflog
```

Resultado:

```
a3f5c8d HEAD@{0}: merge main: Merge made by recursive
b4e7f9a HEAD@{1}: commit: feat: agregar segmentación
c5d8e0b HEAD@{2}: checkout: moving from main to feature/agregar-segmentacion
d6f9a1c HEAD@{3}: pull: Fast-forward
```

Cada línea es un movimiento. Si en algún momento "perdiste" un commit (por ejemplo, después de un reset hard), puedes recuperarlo:

```bash
git checkout <hash-del-commit-perdido>
git switch -c branch-de-recuperacion
```

> 💡 **`git reflog` es tu red de seguridad final.** Casi nada se pierde para siempre en Git si todavía tienes acceso a tu carpeta `.git/`.

---

## 🎯 Tareas

**Tarea 1:** Crea intencionalmente un conflicto en tu repo de práctica: dos branches que modifican la misma línea del README de forma diferente.

**Tarea 2:** Resuélvelo manualmente combinando ambas versiones.

**Tarea 3:** Ahora crea otro conflicto donde las dos versiones SE CONTRADICEN. Decide cuál usar y elimina la otra.

**Tarea 4:** Practica `git merge --abort`: empieza un merge con conflicto y abórtalo. Verifica que volviste al estado anterior.

**Tarea 5:** Ejecuta `git reflog` en tu repo. Lee las últimas 10 entradas y entiende qué movimientos representan.

**Tarea 6:** Pregúntale a tu lead si hay archivos críticos en el repo de tu equipo donde los conflictos son frecuentes. Discutan estrategias para reducirlos.

---

*Universidad Nexus — Curso de GitHub para Analistas*
