---
sidebar_position: 2
title: groupBy() — Agrupar Datos
---

# groupBy() — Agrupar Datos

`groupBy()` es la operación que te permite analizar tus datos por categorías. En lugar de mirar fila por fila, agrupas las filas que comparten un valor común y calculas métricas sobre cada grupo.

Es el equivalente exacto del `GROUP BY` de SQL. Y como vas a ver, la lógica es la misma, solo cambia un poco la sintaxis.

---

## La idea: agrupar y resumir

Imagina que tienes 1 millón de filas de ventas. Ver fila por fila no te dice nada. Pero si las **agrupas** por región y calculas la suma del monto, obtienes:

```
+--------+-------------+
| region | total_ventas|
+--------+-------------+
| Norte  | 4,500,000   |
| Sur    | 3,200,000   |
| Centro | 5,800,000   |
| Este   | 2,100,000   |
+--------+-------------+
```

De 1 millón de filas pasaste a 4. Y esas 4 filas te cuentan una historia que las 1 millón no podían.

Eso es agregación: **resumir muchas filas en pocas, organizadas por categorías que importan**.

---

## Sintaxis básica

`groupBy()` por sí sola no hace nada útil. Siempre la combinas con una operación de agregación. La forma más simple es contar:

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")

ventas_por_region = ventas.groupBy("region").count()
display(ventas_por_region)
```

Esto te da el conteo de filas por cada valor único de `region`. Simple pero útil: te dice cuántas ventas hay en cada región.

---

## Funciones de agregación más comunes

Después de `groupBy()`, puedes aplicar varias funciones de resumen. Las más usadas son:

| Función | Qué calcula | Ejemplo |
|---|---|---|
| `count()` | Cuántas filas hay en cada grupo | Cuántas ventas por región |
| `sum("col")` | Suma los valores de una columna | Total vendido por región |
| `avg("col")` o `mean("col")` | Promedio | Ticket promedio por región |
| `max("col")` | Valor máximo | Venta más grande por región |
| `min("col")` | Valor mínimo | Venta más chica por región |

Ejemplos en código:

```python
# Total de ventas por región
ventas.groupBy("region").sum("monto")

# Cantidad promedio vendida por región
ventas.groupBy("region").avg("cantidad")

# Venta más grande por país
ventas.groupBy("pais").max("monto")
```

> ⚠️ **El nombre de la columna resultante:** Cuando usas el atajo (`.sum("monto")`), Spark te crea una columna con un nombre auto-generado como `sum(monto)`. No es muy legible. En la próxima lección vas a aprender una forma mejor de hacerlo con `agg()`, donde puedes ponerle el nombre que quieras.

---

## Agrupar por múltiples columnas

Puedes pasar varias columnas a `groupBy()` para crear grupos más específicos:

```python
ventas.groupBy("pais", "region").sum("monto")
```

Esto te da el total vendido por cada combinación país-región. Si tienes 3 países y 4 regiones por país, podrías tener hasta 12 filas en el resultado.

```
+-----------+--------+-----------+
| pais      | region | sum(monto)|
+-----------+--------+-----------+
| Guatemala | Norte  | 1,200,000 |
| Guatemala | Sur    | 980,000   |
| Honduras  | Norte  | 750,000   |
| Honduras  | Sur    | 620,000   |
| ...                            |
```

Cuantas más columnas agrupes, más específica es tu análisis y más filas tiene el resultado.

---

## Combinar groupBy con filter

Casi siempre vas a filtrar antes o después de agrupar. Las dos formas son válidas, pero hacen cosas diferentes:

**Filtrar ANTES del groupBy** (filtra filas antes de agrupar):

```python
# Solo ventas de 2024, agrupadas por región
(
    ventas
    .filter(F.year("fecha") == 2024)
    .groupBy("region")
    .sum("monto")
)
```

**Filtrar DESPUÉS del groupBy** (filtra grupos basados en el resultado):

```python
# Regiones con ventas totales mayores a 1 millón
(
    ventas
    .groupBy("region")
    .sum("monto")
    .filter(F.col("sum(monto)") > 1000000)
)
```

> 💡 **Equivalencias con SQL:** Filtrar antes del groupBy es como `WHERE` en SQL. Filtrar después es como `HAVING`. Si lo viste en el módulo de SQL, ya lo conoces. Es la misma idea.

---

## Ordenar el resultado

El resultado de `groupBy()` no viene ordenado por defecto. Casi siempre vas a querer ordenarlo, especialmente para rankings:

```python
from pyspark.sql import functions as F

(
    ventas
    .groupBy("region")
    .sum("monto")
    .orderBy(F.col("sum(monto)").desc())
)
```

Esto te da las regiones ordenadas de mayor a menor por total de ventas. Combinado con `.limit(5)` te da el Top 5:

```python
(
    ventas
    .groupBy("region")
    .sum("monto")
    .orderBy(F.col("sum(monto)").desc())
    .limit(5)
)
```

Patrón Top N en una sola expresión. Es una de las cosas que más vas a hacer.

---

## Ejemplo completo: ventas por país y mes

Imagina que quieres ver el total vendido por país, mes a mes, durante 2024:

```python
from pyspark.sql import functions as F

resultado = (
    spark.table("ventas")
    .filter(F.year("fecha") == 2024)
    .withColumn("mes", F.month("fecha"))
    .groupBy("pais", "mes")
    .sum("monto")
    .orderBy("pais", "mes")
)

display(resultado)
```

Mira el flujo: filtrar → crear columna nueva → agrupar → resumir → ordenar. Es el patrón estándar de un análisis temporal por categoría.

---

## 🎯 Tareas

**Tarea 1:** Cuenta cuántas ventas hay por cada región.

<details>
<summary>Ver solución</summary>

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")
ventas.groupBy("region").count().show()
```

</details>

**Tarea 2:** Calcula el total de ventas (suma del monto) por país.

<details>
<summary>Ver solución</summary>

```python
ventas.groupBy("pais").sum("monto").show()
```

</details>

**Tarea 3:** Calcula el monto promedio por región y ordénalo de mayor a menor.

<details>
<summary>Ver solución</summary>

```python
(
    ventas
    .groupBy("region")
    .avg("monto")
    .orderBy(F.col("avg(monto)").desc())
).show()
```

</details>

**Tarea 4:** Muestra el top 3 de regiones con mayor cantidad total vendida.

<details>
<summary>Ver solución</summary>

```python
(
    ventas
    .groupBy("region")
    .sum("cantidad")
    .orderBy(F.col("sum(cantidad)").desc())
    .limit(3)
).show()
```

</details>

---

*Universidad Nexus — Curso de Python y Spark*
