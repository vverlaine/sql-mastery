---
sidebar_position: 4
title: orderBy() y Patrones de Análisis
---

# orderBy() y Patrones de Análisis

`orderBy()` es el equivalente directo del `ORDER BY` de SQL: ordena las filas de un DataFrame según una o más columnas. Es simple, pero combinado con `groupBy()` y `agg()` te permite construir todos los rankings y patrones analíticos que vas a necesitar.

En esta lección vas a aprender la sintaxis y los patrones más útiles del día a día.

---

## Sintaxis básica

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")

# Orden ascendente por defecto
ventas.orderBy("monto").show()

# Orden descendente explícito
ventas.orderBy(F.col("monto").desc()).show()
```

Igual que en SQL, el orden por defecto es ascendente (de menor a mayor). Para descendente, usas `.desc()` sobre la columna.

---

## Ordenar por múltiples columnas

```python
# Primero por región (asc), luego por monto (desc)
ventas.orderBy(F.col("region"), F.col("monto").desc())
```

Cada columna puede tener su propia dirección. La primera tiene prioridad, la segunda desempata.

---

## sort() es lo mismo que orderBy()

Spark tiene dos funciones que hacen exactamente lo mismo: `orderBy()` y `sort()`. Funcionan idéntico, puedes usar la que prefieras:

```python
ventas.orderBy(F.col("monto").desc())
ventas.sort(F.col("monto").desc())
```

`orderBy()` es más común porque se parece a SQL. `sort()` es más corto. Elige uno y sé consistente.

---

## Patrón Top N: el más usado

El patrón más común en análisis es "los N más grandes" o "los N más pequeños". Se construye combinando `groupBy`, `agg`, `orderBy` y `limit`:

```python
from pyspark.sql import functions as F

# Top 5 regiones por ventas totales
top_regiones = (
    ventas
    .groupBy("region")
    .agg(F.sum("monto").alias("total"))
    .orderBy(F.col("total").desc())
    .limit(5)
)

display(top_regiones)
```

Cinco líneas para responder "¿cuáles son las 5 regiones que más venden?". Esto es lo que hace de Spark una herramienta tan poderosa para análisis: lo que en Excel tardarías 30 minutos en armar con tablas dinámicas, aquí es una expresión de Python.

---

## Patrón Bottom N: los peores

Mismo patrón pero ordenando ascendente:

```python
# Las 5 ventas más bajas
peores = (
    ventas
    .orderBy(F.col("monto").asc())
    .limit(5)
)
```

O combinado con groupBy:

```python
# Los 5 productos con menos rotación
productos_lentos = (
    ventas
    .groupBy("producto_id")
    .agg(F.sum("cantidad").alias("unidades_vendidas"))
    .orderBy(F.col("unidades_vendidas").asc())
    .limit(5)
)
```

> 💡 **Útil para:** detectar productos con bajo desempeño, clientes inactivos, regiones con menor crecimiento, alertas de stock.

---

## Patrón "porcentaje del total"

Una pregunta clásica: "¿qué porcentaje del total representa cada categoría?". Esto requiere dos pasos:

```python
from pyspark.sql import functions as F

# 1. Calcular el total global
total_global = ventas.agg(F.sum("monto").alias("total")).collect()[0]["total"]

# 2. Calcular el total por región y dividir
participacion = (
    ventas
    .groupBy("region")
    .agg(F.sum("monto").alias("total_region"))
    .withColumn("porcentaje", (F.col("total_region") / total_global) * 100)
    .orderBy(F.col("porcentaje").desc())
)

display(participacion)
```

`collect()` extrae los datos del DataFrame a una lista de Python. En este caso lo usamos para obtener un solo valor (el total global) y usarlo en el cálculo del porcentaje.

> ⚠️ **Cuidado con collect():** trae los datos a la memoria del driver. Solo úsalo cuando sabes que el resultado es pequeño (un solo valor o pocas filas). Nunca hagas `df.collect()` sobre un DataFrame grande — puedes colgar el sistema.

---

## Patrón "ranking dentro de grupos"

Imagina que quieres "el producto más vendido dentro de cada categoría". Esto requiere más sofisticación (window functions), pero hay una forma simple si solo necesitas el top 1:

```python
# Producto con más unidades vendidas por región
top_por_region = (
    ventas
    .groupBy("region", "producto_id")
    .agg(F.sum("cantidad").alias("unidades"))
    .orderBy("region", F.col("unidades").desc())
)
```

Esto te da todos los productos por región ordenados de mayor a menor venta. Para quedarte solo con el primero de cada grupo necesitarías window functions, que es un tema más avanzado y se cubre en cursos posteriores.

---

## Combinar todo: análisis completo

Veamos un ejemplo realista que une todo lo aprendido en este módulo:

```python
from pyspark.sql import functions as F

# Análisis: Top 10 regiones por ventas Q1 2024 con métricas completas
analisis = (
    spark.table("ventas")
    # Filtrado
    .filter(
        (F.year("fecha") == 2024) &
        (F.quarter("fecha") == 1)
    )
    # Limpieza de nulos
    .fillna("Desconocida", subset=["region"])
    # Agregación
    .groupBy("region")
    .agg(
        F.sum("monto").alias("total_ventas"),
        F.count("*").alias("num_transacciones"),
        F.countDistinct("cliente_id").alias("clientes_unicos"),
        F.avg("monto").alias("ticket_promedio")
    )
    # Cálculo derivado
    .withColumn(
        "ventas_por_cliente",
        F.col("total_ventas") / F.col("clientes_unicos")
    )
    # Ranking
    .orderBy(F.col("total_ventas").desc())
    .limit(10)
)

display(analisis)
```

Filtrado → limpieza → agregación → cálculo → ranking. Es el flujo completo de un analista que sabe usar Spark.

---

## 🎯 Tareas

**Tarea 1:** Ordena las ventas de mayor a menor monto y muestra las primeras 10.

<details>
<summary>Ver solución</summary>

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")
ventas.orderBy(F.col("monto").desc()).limit(10).show()
```

</details>

**Tarea 2:** Encuentra las 3 regiones con MÁS clientes únicos.

<details>
<summary>Ver solución</summary>

```python
(
    ventas
    .groupBy("region")
    .agg(F.countDistinct("cliente_id").alias("clientes_unicos"))
    .orderBy(F.col("clientes_unicos").desc())
    .limit(3)
).show()
```

</details>

**Tarea 3:** Calcula el porcentaje de participación de cada país sobre el total global.

<details>
<summary>Ver solución</summary>

```python
total_global = ventas.agg(F.sum("monto").alias("t")).collect()[0]["t"]

(
    ventas
    .groupBy("pais")
    .agg(F.sum("monto").alias("total_pais"))
    .withColumn("porcentaje", (F.col("total_pais") / total_global) * 100)
    .orderBy(F.col("porcentaje").desc())
).show()
```

</details>

---

*Universidad Nexus — Curso de Python y Spark*
