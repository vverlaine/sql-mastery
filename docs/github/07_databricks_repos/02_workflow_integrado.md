---
sidebar_position: 3
title: El Workflow Integrado Completo
---

# El Workflow Integrado Completo

Esta lección es la consolidación de TODO lo que aprendiste hasta ahora. Vas a ver cómo se conectan en la práctica VSCode + GitHub + Databricks Repos en un workflow de día a día. Si dominas este workflow, tienes el set de habilidades completo para trabajar como analista profesional en CBC.

---

## El stack completo del analista CBC

```
┌──────────────────────────────────────────────┐
│            GitHub Enterprise (CBC)            │
│   ┌────────────────────────────────────┐    │
│   │  proyecto-ventas/                   │    │
│   │  ├── README.md                       │    │
│   │  ├── notebooks/                      │    │
│   │  ├── lib/                            │    │
│   │  ├── jobs/                           │    │
│   │  └── pyproject.toml                  │    │
│   └────────────────────────────────────┘    │
└─────────────┬───────────────────┬───────────┘
              │                   │
              ↓                   ↓
   ┌──────────────────┐  ┌──────────────────┐
   │  Tu computadora   │  │   Databricks     │
   │  (VSCode + Git)   │  │     Repos        │
   │                   │  │                  │
   │  Edición de       │  │  Ejecución       │
   │  código pesada    │  │  contra clusters │
   │  Refactoring      │  │  Análisis        │
   │  Tests locales    │  │  exploratorio    │
   └──────────────────┘  └──────────────────┘
```

GitHub Enterprise es la **fuente de verdad**. VSCode y Databricks son dos formas de trabajar con el mismo código.

---

## Caso de uso real: agregar una nueva métrica al reporte mensual

Vamos a ver el workflow completo desde cero hasta producción. Imagina que tu lead te asigna esto:

> "Necesitamos agregar la métrica de 'rotación de inventario' al reporte mensual. Hay un issue en GitHub: #156."

### Paso 1: Leer el issue (en GitHub Enterprise web)

```
Issue #156: Agregar rotación de inventario al reporte mensual

Descripción:
Necesitamos calcular la rotación de inventario por categoría 
de producto en el reporte mensual. La fórmula es:
  rotacion = ventas_totales / inventario_promedio

Criterios de aceptación:
- Nueva columna 'rotacion_inventario' en el output del reporte
- Cálculo a nivel de categoría
- Documentado en el README
- Tests para validar la función

Asignado a: tu_email@cbc.com
```

### Paso 2: Sincronizar localmente (en tu computadora con VSCode)

```bash
cd ~/proyectos/proyecto-ventas
code .  # abre VSCode
```

En la terminal integrada de VSCode:

```bash
git switch main
git pull
```

Te aseguras de partir del estado más reciente.

### Paso 3: Crear tu branch de trabajo

```bash
git switch -c feature/156-rotacion-inventario
```

Convención: `<tipo>/<numero-issue>-<descripcion-corta>`.

### Paso 4: Trabajar en VSCode (la lógica pesada)

Abres `lib/metricas.py` en VSCode. Agregas la nueva función:

```python
def calcular_rotacion_inventario(ventas: DataFrame, inventario: DataFrame) -> DataFrame:
    """
    Calcula la rotación de inventario por categoría.
    
    Args:
        ventas: DataFrame con columnas (categoria, monto)
        inventario: DataFrame con columnas (categoria, inventario_promedio)
    
    Returns:
        DataFrame con columnas (categoria, rotacion_inventario)
    """
    ventas_por_cat = (
        ventas
        .groupBy("categoria")
        .agg(F.sum("monto").alias("ventas_totales"))
    )
    
    return (
        ventas_por_cat
        .join(inventario, on="categoria", how="left")
        .withColumn(
            "rotacion_inventario",
            F.col("ventas_totales") / F.col("inventario_promedio")
        )
        .select("categoria", "rotacion_inventario")
    )
```

Aprovechas el autocompletado, el linting de Ruff, el formato automático de Black. Todo lo que aprendiste en el Pilar 4.

### Paso 5: Primer commit local

```bash
git add lib/metricas.py
git commit -m "feat: agregar función calcular_rotacion_inventario"
```

### Paso 6: Push y crear draft PR

```bash
git push -u origin feature/156-rotacion-inventario
```

Después en GitHub Enterprise:

1. Ir al repo
2. Click en "Compare & pull request" (banner amarillo)
3. Llenar el template del PR:
   - Título: `feat: agregar rotación de inventario al reporte`
   - Descripción siguiendo el template
   - Incluir `Closes #156`
4. Marcar como **Draft PR**
5. Crear

### Paso 7: Trabajar en el notebook (en Databricks Repos)

Ahora abres Databricks. Vas a tu Databricks Repo del proyecto. Lo primero:

```
Panel de Git → Pull
```

Esto trae los cambios que acabas de pushear (incluyendo la nueva función en `lib/metricas.py`).

Cambias a la branch que creaste:

```
Dropdown de branches → feature/156-rotacion-inventario
```

Ahora estás en Databricks pero en TU branch, con tu código.

Abres el notebook `jobs/reporte_mensual.py` y lo modificas para usar la nueva función:

```python
# COMMAND ----------

from lib.metricas import calcular_rotacion_inventario

# ... código existente ...

# Nueva métrica
rotacion = calcular_rotacion_inventario(ventas_mes, inventario_mes)
display(rotacion)
```

Lo ejecutas contra el cluster de Databricks. Verificas que funciona con datos reales.

### Paso 8: Commit desde Databricks Repos

En el panel de Git de Databricks:

1. Ver los archivos modificados (`jobs/reporte_mensual.py`)
2. Escribir mensaje: `feat: integrar rotacion en reporte mensual`
3. Click en "Commit & Push"

Los cambios suben a GitHub Enterprise en tu branch.

### Paso 9: Volver a VSCode para más cambios

Vuelves a tu computadora. Necesitas agregar tests y documentación.

```bash
git pull  # bajar el commit que hiciste desde Databricks
```

Editas el README:

```markdown
## Métricas calculadas

- Total de ventas por región
- Ticket promedio por categoría
- **Rotación de inventario por categoría** (nuevo)
```

Creas tests en `tests/test_metricas.py`:

```python
def test_calcular_rotacion_inventario():
    # ... implementación del test ...
    pass
```

Commits y push:

```bash
git add tests/test_metricas.py README.md
git commit -m "test: agregar tests y docs para rotación de inventario"
git push
```

### Paso 10: Convertir el draft a ready

En GitHub Enterprise, el PR ahora tiene varios commits. Lo conviertes de draft a ready:

1. Click en "Ready for review"
2. CODEOWNERS asigna reviewers automáticos
3. Los CI checks corren contra tu código

### Paso 11: Atender el feedback

Tus reviewers dejan comentarios:

> Reviewer 1: "👍 La función está bien estructurada. ¿Podrías agregar un check de que `inventario_promedio` no sea 0 para evitar división por cero?"

Atiendes el feedback en VSCode:

```python
def calcular_rotacion_inventario(ventas: DataFrame, inventario: DataFrame) -> DataFrame:
    # ... validación nueva ...
    inventario_validado = inventario.filter(F.col("inventario_promedio") > 0)
    
    # ... resto del código ...
```

```bash
git add lib/metricas.py
git commit -m "fix: validar inventario > 0 para evitar división por cero"
git push
```

El PR se actualiza automáticamente.

### Paso 12: Aprobación y merge

Los reviewers aprueban. Los CI checks pasan. Estás listo para mergear.

En GitHub Enterprise:

1. Click en "Squash and merge" (siguiendo la convención del equipo)
2. Confirmar el mensaje del commit final
3. "Confirm squash and merge"

GitHub:

- Mergea tu PR a `main`
- Cierra automáticamente el issue #156 (gracias al `Closes #156`)
- Borra tu branch del remoto

### Paso 13: Limpiar localmente

```bash
git switch main
git pull
git branch -d feature/156-rotacion-inventario
```

### Paso 14: Sincronizar Databricks Repos

En Databricks:

1. Cambiar el Repo a la branch `main`
2. Pull
3. Verificar que los cambios están ahí

### Paso 15: Ejecutar el job actualizado en Databricks

El job `reporte_mensual.py` ahora incluye la nueva métrica. La próxima vez que corra (manualmente o programado), va a producir el output con la columna nueva.

**Listo. Tu cambio está en producción.**

---

## El tiempo total

¿Cuánto duró todo el proceso? Depende del cambio:

- **Cambio simple**: 1-2 horas total (incluyendo review)
- **Cambio mediano**: 1-2 días
- **Cambio grande**: 1-2 semanas (con feedback iterativo)

Lo importante es que CADA paso del proceso tiene un propósito claro y agrega valor.

---

## Cuándo usar cada herramienta

Esta es la guía rápida que vale la pena memorizar:

| Acción | Herramienta |
|---|---|
| Entender el contexto del trabajo | GitHub Enterprise (issues) |
| Editar lógica compleja, refactoring | VSCode |
| Crear módulos reutilizables (`lib/`) | VSCode |
| Tests automatizados | VSCode |
| Buscar en muchos archivos | VSCode |
| Análisis exploratorio interactivo | Databricks Repos |
| Ejecutar contra datos reales | Databricks Repos |
| Iterar rápidamente con cluster | Databricks Repos |
| Crear PRs | GitHub Enterprise web |
| Code reviews | GitHub Enterprise web (o VSCode con extensión) |
| Programar jobs | Databricks Workflows |

---

## Antipatrones del workflow integrado

### ❌ Editar el mismo archivo en VSCode y Databricks al mismo tiempo

Vas a generar conflictos contigo mismo. Decide en cuál estás trabajando.

### ❌ No hacer pull antes de empezar

Si en Databricks o en VSCode no haces pull primero, vas a trabajar sobre código viejo y te vas a hacer tu propio conflicto.

### ❌ Commitear secretos a Databricks Repos pensando que es "diferente" a Git

Databricks Repos ES Git. Lo que commitees ahí va a GitHub Enterprise. Las mismas reglas aplican.

### ❌ Trabajar directamente en main desde Databricks Repos

Mismas reglas que VSCode: nunca trabajes en main directamente. Siempre branches y PRs.

### ❌ Mergear PRs desde Databricks

No es posible. Los PRs se mergean desde GitHub Enterprise web.

### ❌ Ejecutar notebooks que están en branches sin mergear

Riesgo: ejecutas algo que no está aprobado. Para producción, asegúrate de estar en main.

---

## Buenas prácticas del workflow

### ✅ Empieza el día con dos pulls

Uno en VSCode local (`git pull`), uno en Databricks Repos (panel de Git → Pull). Te aseguras de partir del mismo estado en los dos lados.

### ✅ Comunícate cuando trabajas en algo que afecta a otros

Si vas a modificar `lib/transformaciones.py` que muchos usan, avisa antes.

### ✅ PR draft desde el día 1

Da visibilidad a tu trabajo desde temprano.

### ✅ Sincroniza con main cada 1-2 días

Si tu branch va a vivir más de un día, hazle merge de main para evitar conflictos al final.

### ✅ Una task = una branch = un PR

No mezcles cambios no relacionados.

### ✅ Documenta las decisiones importantes en el PR

No solo en el código. Las decisiones técnicas merecen un comentario en el PR para que queden en la trazabilidad.

---

## El check del viernes

Cada viernes (o el momento que prefieras), haz un "check" rápido de tu trabajo de la semana:

```bash
# 1. Branches locales que ya no necesitas
git branch --merged main
# Borrar las que ya estén mergeadas
git branch -d <nombre>

# 2. PRs que tienes abiertos
# Ir a GitHub Enterprise → tu perfil → Pull requests
# Cerrar los que abandonaste

# 3. Issues asignados a ti
# Ir a GitHub Enterprise → tu perfil → Issues
# Actualizar el estado de los que están en progreso

# 4. Repos en Databricks
# Hacer pull en los Repos que usaste
```

Este check de 5 minutos mantiene tu workspace ordenado.

---

## 🎯 Tareas

**Tarea 1:** Practica el flujo completo end-to-end con una tarea pequeña: hacer un cambio simple, pasar por VSCode, GitHub PR, y Databricks Repos.

**Tarea 2:** Identifica en qué momento prefieres usar cada herramienta. ¿Cuándo VSCode? ¿Cuándo Databricks Repos? ¿Cuándo GitHub web?

**Tarea 3:** Haz tu propio "check del viernes" en los repos que usas en CBC. Limpia branches, PRs y issues abandonados.

**Tarea 4:** Pídele a tu lead un caso real donde trabajen colaborativamente entre varios analistas. Practica el flujo completo en ese contexto.

---

*Universidad Nexus — Curso de GitHub para Analistas*
