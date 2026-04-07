---
sidebar_position: 2
title: Inner Join — Cruzando Tablas
---

# Inner Join — Cruzando Tablas

Un join combina dos tablas usando una columna que tienen en común. La más usada es el **inner join**: te devuelve solo las filas que tienen coincidencia en ambas tablas.

Es el join "estándar". Cuando alguien dice "haz un join entre estas dos tablas" sin especificar el tipo, casi siempre se refiere a un inner join.

---

## El concepto: dos tablas relacionadas

Imagina que tienes la tabla `ventas` y la tabla `productos`:

```
ventas:
+----+-------------+--------+
| id | producto_id | monto  |
+----+-------------+--------+
| 1  | 101         | 1500   |
| 2  | 102         | 800    |
| 3  | 101         | 2300   |
| 4  | 103         | 950    |
+----+-------------+--------+

productos:
+-----+----------+----------+
| id  | nombre   | categoria|
+-----+----------+----------+
| 101 | Galletas | Snacks   |
| 102 | Refresco | Bebidas  |
| 103 | Chocolate| Snacks   |
+-----+----------+----------+
```

`ventas.producto_id` apunta a `productos.id`. Esa es la **relación**. Cuando haces el join, Spark cruza ambas tablas para que cada venta tenga la información completa del producto:

```
+----+-------------+--------+----------+----------+
| id | producto_id | monto  | nombre   | categoria|
+----+-------------+--------+----------+----------+
| 1  | 101         | 1500   | Galletas | Snacks   |
| 2  | 102         | 800    | Refresco | Bebidas  |
| 3  | 101         | 2300   | Galletas | Snacks   |
| 4  | 103         | 950    | Chocolate| Snacks   |
+----+-------------+--------+----------+----------+
```

Cada venta ahora viene con el nombre y la categoría del producto. Eso es un join.

---

## Sintaxis básica

```python
ventas = spark.table("ventas")
productos = spark.table("productos")

resultado = ventas.join(
    productos,
    ventas.producto_id == productos.id,
    "inner"
)

display(resultado)
```

Tres argumentos:

1. **El otro DataFrame** (`productos`)
2. **La condición** (`ventas.producto_id == productos.id`) — qué columna de cada tabla se usa para cruzar
3. **El tipo de join** (`"inner"`) — opcional, inner es el default

> 💡 **Diferencia con SQL:** En SQL escribes `JOIN productos ON ventas.producto_id = productos.id`. En Spark es `.join(productos, ventas.producto_id == productos.id, "inner")`. Misma idea, sintaxis distinta.

---

## La condición del join

La condición del join puede escribirse de varias formas:

### 1. Comparando columnas explícitas

```python
ventas.join(
    productos,
    ventas.producto_id == productos.id,
    "inner"
)
```

Es la más clara, especialmente cuando las columnas tienen nombres diferentes (`producto_id` vs `id`).

### 2. Cuando las columnas se llaman igual

Si las dos tablas tienen una columna con el MISMO nombre que se usa para cruzar, puedes simplificar:

```python
# Si ambas tablas tuvieran una columna llamada 'producto_id'
ventas.join(productos, "producto_id", "inner")
```

Este atajo solo funciona cuando los nombres coinciden exactamente.

### 3. Usando F.col()

```python
from pyspark.sql import functions as F

ventas.join(
    productos,
    F.col("ventas.producto_id") == F.col("productos.id"),
    "inner"
)
```

Es la forma más explícita pero también la más verbosa. Útil cuando hay ambigüedad.

---

## El problema de las columnas duplicadas

Cuando haces un join, las columnas con el mismo nombre en ambas tablas se duplican en el resultado. Si `ventas` e `productos` ambos tienen una columna `id`, el resultado tiene dos columnas `id`, lo que confunde mucho.

Hay dos formas de manejarlo:

### Opción A: renombrar antes del join

```python
productos_renombrado = productos.withColumnRenamed("id", "producto_id_ref")

resultado = ventas.join(
    productos_renombrado,
    ventas.producto_id == productos_renombrado.producto_id_ref,
    "inner"
)
```

Es la opción más limpia: renombras antes para que no haya conflicto.

### Opción B: seleccionar solo las que necesitas

```python
resultado = (
    ventas.join(
        productos,
        ventas.producto_id == productos.id,
        "inner"
    )
    .select(
        ventas.id.alias("venta_id"),
        ventas.fecha,
        ventas.monto,
        productos.nombre.alias("producto"),
        productos.categoria
    )
)
```

Después del join, seleccionas explícitamente qué columnas quieres y de qué tabla. Más control, más seguro.

> 💡 **Recomendación:** Si vas a usar el resultado para análisis serio, siempre selecciona explícitamente las columnas que necesitas después del join. Te ahorra dolores de cabeza con duplicados y nombres ambiguos.

---

## Joins con múltiples condiciones

A veces necesitas cruzar por más de una columna. Combinas las condiciones con `&`:

```python
ventas.join(
    tiendas,
    (ventas.tienda_id == tiendas.id) & (ventas.pais == tiendas.pais),
    "inner"
)
```

Esto cruza solo cuando AMBAS condiciones se cumplen. Útil para joins más complejos donde la relación involucra varias columnas (por ejemplo, "misma tienda en el mismo país").

---

## Encadenar joins múltiples

Puedes hacer varios joins en una sola expresión, encadenando uno tras otro:

```python
from pyspark.sql import functions as F

resultado = (
    spark.table("ventas")
    .join(
        spark.table("productos"),
        F.col("producto_id") == F.col("productos.id"),
        "inner"
    )
    .join(
        spark.table("clientes"),
        F.col("cliente_id") == F.col("clientes.id"),
        "inner"
    )
    .join(
        spark.table("tiendas"),
        F.col("tienda_id") == F.col("tiendas.id"),
        "inner"
    )
)
```

Tres joins encadenados. Ahora cada venta tiene info del producto, del cliente y de la tienda. Esto es lo que se llama una "vista enriquecida": datos enriquecidos con todo el contexto.

> 💡 **Atención al rendimiento:** Cuantos más joins haces, más trabajo le das a Spark. En tablas pequeñas no importa, pero si trabajas con millones de filas, intenta filtrar antes del join para reducir el volumen.

---

## Caso real: análisis de ventas con contexto completo

Tu jefe quiere saber: "Top 10 productos más vendidos por categoría, con el nombre del producto y el total facturado." Para responder eso necesitas cruzar `ventas` con `productos`:

```python
from pyspark.sql import functions as F

resultado = (
    spark.table("ventas")
    .join(
        spark.table("productos"),
        F.col("producto_id") == F.col("productos.id"),
        "inner"
    )
    .groupBy("categoria", "nombre")
    .agg(
        F.sum("monto").alias("total_facturado"),
        F.sum("cantidad").alias("unidades_vendidas")
    )
    .orderBy(F.col("total_facturado").desc())
    .limit(10)
)

display(resultado)
```

Sin joins, esto sería imposible con una sola tabla. Con joins, es trivial.

---

## 🎯 Tareas

**Tarea 1:** Haz un inner join entre `ventas` y `productos` usando `producto_id`. Muestra `id` de venta, `nombre` del producto y `monto`.

<details>
<summary>Ver solución</summary>

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")
productos = spark.table("productos")

(
    ventas.join(
        productos,
        ventas.producto_id == productos.id,
        "inner"
    )
    .select(
        ventas.id.alias("venta_id"),
        productos.nombre,
        ventas.monto
    )
).show()
```

</details>

**Tarea 2:** Cruza `ventas` con `clientes` y muestra el nombre del cliente y el monto, ordenados por monto descendente.

<details>
<summary>Ver solución</summary>

```python
clientes = spark.table("clientes")

(
    ventas.join(
        clientes,
        ventas.cliente_id == clientes.id,
        "inner"
    )
    .select(clientes.nombre, ventas.monto)
    .orderBy(F.col("monto").desc())
).show()
```

</details>

**Tarea 3:** Calcula el total facturado por categoría de producto. Necesitas hacer join entre `ventas` y `productos`, agrupar por categoría y sumar el monto.

<details>
<summary>Ver solución</summary>

```python
(
    ventas.join(
        productos,
        ventas.producto_id == productos.id,
        "inner"
    )
    .groupBy("categoria")
    .agg(F.sum("monto").alias("total"))
    .orderBy(F.col("total").desc())
).show()
```

</details>

---

*Universidad Nexus — Curso de Python y Spark*
