---
sidebar_position: 3
title: agg() — Múltiples Agregaciones
---

# agg() — Múltiples Agregaciones

En la lección anterior viste cómo agrupar y aplicar UNA función de agregación a la vez (`.sum()`, `.avg()`, etc.). Pero en la vida real, casi siempre quieres calcular VARIAS métricas al mismo tiempo: total, promedio, máximo, mínimo, conteo… todo en una sola consulta.

Para eso existe `agg()`. Es la forma profesional de hacer agregaciones múltiples y, además, te permite ponerle nombres claros a las columnas del resultado.

---

## El problema con .sum() solo

Si quieres calcular total y promedio por región, los atajos no te alcanzan:

```python
# Esto solo te da el total
ventas.groupBy("region").sum("monto")

# Esto solo te da el promedio
ventas.groupBy("region").avg("monto")
```

Para tener ambas cosas necesitarías hacer dos consultas y unirlas. Tedioso. Aquí es donde entra `agg()`.

---

## Sintaxis básica de agg()

`agg()` recibe una o más expresiones de agregación:

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")

resultado = ventas.groupBy("region").agg(
    F.sum("monto").alias("total_ventas"),
    F.avg("monto").alias("ticket_promedio"),
    F.count("*").alias("num_transacciones"),
    F.max("monto").alias("venta_maxima"),
    F.min("monto").alias("venta_minima")
)

display(resultado)
```

Mira lo que cambió:

1. Cada función de agregación se llama desde `F.` (no como atajo)
2. Cada una recibe el nombre de la columna entre comillas
3. Cada una usa `.alias()` para darle un nombre claro al resultado
4. Todas van separadas por comas dentro de `agg()`

El resultado tiene columnas legibles: `region`, `total_ventas`, `ticket_promedio`, `num_transacciones`, `venta_maxima`, `venta_minima`. Listo para reportar.

---

## Funciones de agregación disponibles

Estas son las que más vas a usar dentro de `agg()`:

| Función | Qué hace |
|---|---|
| `F.sum("col")` | Suma de los valores |
| `F.avg("col")` o `F.mean("col")` | Promedio |
| `F.count("col")` | Cuenta valores no nulos |
| `F.count("*")` | Cuenta todas las filas (incluye nulos) |
| `F.countDistinct("col")` | Cuenta valores únicos |
| `F.max("col")` | Valor máximo |
| `F.min("col")` | Valor mínimo |
| `F.stddev("col")` | Desviación estándar |
| `F.first("col")` | Primer valor del grupo |
| `F.last("col")` | Último valor del grupo |

---

## Contar valores únicos: countDistinct

Este es muy útil. Te dice cuántos valores DIFERENTES hay en una columna dentro de cada grupo:

```python
ventas.groupBy("region").agg(
    F.count("*").alias("num_transacciones"),
    F.countDistinct("cliente_id").alias("clientes_unicos"),
    F.countDistinct("producto_id").alias("productos_unicos")
)
```

Pregunta de negocio: "¿Cuántos clientes únicos compraron en cada región y cuántos productos diferentes vendí?". Con `countDistinct` se responde directo.

> 💡 **Diferencia clave:**
> - `count("*")` = cuántas filas (transacciones)
> - `countDistinct("cliente_id")` = cuántos valores únicos (clientes)
> 
> Si Carlos compró 5 veces, `count` lo cuenta 5 veces pero `countDistinct` lo cuenta 1 sola vez.

---

## Agregaciones con condiciones

A veces necesitas agregar solo cierto tipo de filas dentro del grupo. Combinas `agg` con `when`:

```python
ventas.groupBy("region").agg(
    F.sum("monto").alias("total_general"),
    F.sum(F.when(F.col("monto") > 5000, F.col("monto"))).alias("total_grandes"),
    F.count(F.when(F.col("monto") > 5000, 1)).alias("num_grandes")
)
```

Aquí estamos calculando, por región:
- El total de ventas
- El total solo de las ventas grandes (>5000)
- Cuántas ventas grandes hubo

Es muy útil para calcular métricas condicionales sin tener que filtrar varias veces.

---

## Cálculos derivados después del agg

Una vez que tienes el resultado del `agg`, puedes seguir transformándolo con `withColumn`:

```python
resultado = (
    ventas.groupBy("region")
    .agg(
        F.sum("monto").alias("total_ventas"),
        F.count("*").alias("num_transacciones")
    )
    .withColumn(
        "ticket_promedio",
        F.col("total_ventas") / F.col("num_transacciones")
    )
)
```

Acabamos de calcular el ticket promedio dividiendo el total entre el conteo. Esto es exactamente lo mismo que usar `F.avg()`, pero te muestra que puedes encadenar lo que necesites.

---

## Caso real: dashboard de métricas por región

Imagina que tu jefe te pide un resumen con: total vendido, número de transacciones, ticket promedio, clientes únicos y la venta más grande, todo por región. Esto es lo que escribirías:

```python
from pyspark.sql import functions as F

dashboard = (
    spark.table("ventas")
    .filter(F.year("fecha") == 2024)
    .groupBy("region")
    .agg(
        F.sum("monto").alias("total_ventas"),
        F.count("*").alias("num_transacciones"),
        F.avg("monto").alias("ticket_promedio"),
        F.countDistinct("cliente_id").alias("clientes_unicos"),
        F.max("monto").alias("venta_maxima")
    )
    .orderBy(F.col("total_ventas").desc())
)

display(dashboard)
```

Una sola expresión, todas las métricas, listas para presentar. Esto es lo que un analista de SQL puro tardaría 4 consultas en hacer. Spark lo resuelve en una.

---

## Ordenar por una columna agregada

Después del `agg`, los nuevos nombres (los que pusiste con `alias`) están disponibles para ordenar:

```python
resultado.orderBy(F.col("total_ventas").desc())
```

O por varias columnas:

```python
resultado.orderBy(
    F.col("clientes_unicos").desc(),
    F.col("total_ventas").desc()
)
```

---

## Sin groupBy: agregación global

Si necesitas calcular métricas para TODA la tabla (no por grupo), puedes usar `agg()` directamente sin `groupBy`:

```python
ventas.agg(
    F.sum("monto").alias("total_global"),
    F.count("*").alias("num_total"),
    F.avg("monto").alias("promedio_global")
).show()
```

Esto te da una sola fila con las métricas globales. Útil para obtener números generales antes de empezar a desglosar.

---

## 🎯 Tareas

**Tarea 1:** Calcula, por región: total de ventas, cantidad total vendida y número de transacciones. Ponle nombres claros a las columnas.

<details>
<summary>Ver solución</summary>

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")
(
    ventas.groupBy("region")
    .agg(
        F.sum("monto").alias("total_ventas"),
        F.sum("cantidad").alias("unidades_vendidas"),
        F.count("*").alias("num_transacciones")
    )
).show()
```

</details>

**Tarea 2:** Por país, calcula clientes únicos y productos únicos. Ordena por clientes únicos descendente.

<details>
<summary>Ver solución</summary>

```python
(
    ventas.groupBy("pais")
    .agg(
        F.countDistinct("cliente_id").alias("clientes_unicos"),
        F.countDistinct("producto_id").alias("productos_unicos")
    )
    .orderBy(F.col("clientes_unicos").desc())
).show()
```

</details>

**Tarea 3:** Calcula, sin agrupar, las métricas globales: total vendido, total de transacciones, ticket promedio, venta máxima y venta mínima.

<details>
<summary>Ver solución</summary>

```python
ventas.agg(
    F.sum("monto").alias("total_vendido"),
    F.count("*").alias("total_transacciones"),
    F.avg("monto").alias("ticket_promedio"),
    F.max("monto").alias("venta_maxima"),
    F.min("monto").alias("venta_minima")
).show()
```

</details>

---

*Universidad Nexus — Curso de Python y Spark*
