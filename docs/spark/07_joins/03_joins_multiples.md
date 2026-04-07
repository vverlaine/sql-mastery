---
sidebar_position: 4
title: Joins Múltiples y Casos Reales
---

# Joins Múltiples y Casos Reales

En el día a día de un analista, casi nunca trabajas con un solo join. Los datos viven distribuidos en muchas tablas, y para responder una pregunta de negocio necesitas cruzar tres, cuatro o más al mismo tiempo.

Esta lección es práctica: vas a ver cómo encadenar varios joins, cómo evitar los errores más comunes y cómo construir vistas enriquecidas que respondan preguntas reales.

---

## El patrón "vista enriquecida"

Una **vista enriquecida** es un DataFrame donde tomas una tabla principal (típicamente la de transacciones) y le agregas contexto desde varias tablas relacionadas. Es el patrón más común en análisis.

En nuestro caso, la tabla de `ventas` solo tiene IDs (`producto_id`, `cliente_id`, `tienda_id`). Con joins, podemos enriquecerla con nombres, categorías, segmentos y regiones:

```python
from pyspark.sql import functions as F

ventas_enriquecidas = (
    spark.table("ventas")
    .join(
        spark.table("productos"),
        F.col("producto_id") == F.col("productos.id"),
        "left"
    )
    .join(
        spark.table("clientes"),
        F.col("cliente_id") == F.col("clientes.id"),
        "left"
    )
    .join(
        spark.table("tiendas"),
        F.col("tienda_id") == F.col("tiendas.id"),
        "left"
    )
)

display(ventas_enriquecidas)
```

Tres `left join` encadenados. Ahora cada venta viene con todo el contexto: qué producto, qué cliente, qué tienda. Esta es la base sobre la que vas a construir cualquier análisis.

> 💡 **Por qué left join y no inner:** porque queremos conservar TODAS las ventas. Si por alguna razón algún ID está roto en una de las tablas relacionadas, no queremos perder esa venta del análisis.

---

## El problema de las columnas duplicadas (otra vez)

Cuando encadenas varios joins, las columnas con nombres iguales se vuelven un dolor de cabeza. Por ejemplo, las tablas `productos`, `clientes` y `tiendas` probablemente todas tienen una columna `id` y una columna `nombre`.

Después de los tres joins, tu DataFrame puede tener:

- `id` (de ventas)
- `id` (de productos)
- `id` (de clientes)
- `id` (de tiendas)
- `nombre` (de productos)
- `nombre` (de clientes)
- `nombre` (de tiendas)

Si haces `select("nombre")`, Spark no sabe a cuál te refieres y te da un error de ambigüedad.

### Solución: renombrar antes de hacer join

La forma más limpia de evitar este problema es renombrar las columnas conflictivas antes de juntarlas:

```python
productos = (
    spark.table("productos")
    .withColumnRenamed("id", "prod_id")
    .withColumnRenamed("nombre", "producto_nombre")
)

clientes = (
    spark.table("clientes")
    .withColumnRenamed("id", "cli_id")
    .withColumnRenamed("nombre", "cliente_nombre")
)

tiendas = (
    spark.table("tiendas")
    .withColumnRenamed("id", "tien_id")
    .withColumnRenamed("nombre", "tienda_nombre")
)

ventas_enriquecidas = (
    spark.table("ventas")
    .join(productos, F.col("producto_id") == F.col("prod_id"), "left")
    .join(clientes, F.col("cliente_id") == F.col("cli_id"), "left")
    .join(tiendas, F.col("tienda_id") == F.col("tien_id"), "left")
    .drop("prod_id", "cli_id", "tien_id")
)
```

Después del join, ya no hay ambigüedad. Cada columna tiene un nombre único: `producto_nombre`, `cliente_nombre`, `tienda_nombre`. Y al final hacemos `drop` de los IDs auxiliares que ya no necesitamos.

> 💡 **Buena costumbre:** Cuando crees vistas enriquecidas que vas a reutilizar mucho, dedícale tiempo a que los nombres de las columnas sean limpios y consistentes. Tu yo del futuro te lo va a agradecer.

---

## Optimización: filtrar antes de hacer join

Cuanto más grande sea el DataFrame que estás joineando, más trabajo tiene Spark. Una técnica simple para acelerar consultas es **filtrar antes** del join, no después.

### Patrón lento

```python
# Mal: une 10 millones de ventas con 50 mil productos, luego filtra
resultado = (
    ventas
    .join(productos, ventas.producto_id == productos.id, "inner")
    .filter(F.col("anio") == 2024)
)
```

### Patrón rápido

```python
# Bien: filtra primero las ventas, luego une
resultado = (
    ventas
    .filter(F.col("anio") == 2024)
    .join(productos, ventas.producto_id == productos.id, "inner")
)
```

En el primer caso, Spark une los 10 millones de filas con productos y DESPUÉS filtra. En el segundo, primero reduces a las ventas relevantes (digamos, 1 millón) y solo eso se une. Mucho más eficiente.

> 💡 **Buena noticia:** Spark es inteligente y a veces hace esta optimización por ti automáticamente. Pero no siempre. Como buena práctica, escribe tu código en el orden correcto: filtra primero, joinea después.

---

## Caso real 1: Análisis de ventas por categoría y país

**Pregunta de negocio:** "Dame el total facturado por categoría de producto y país, solo para 2024, ordenado de mayor a menor."

```python
from pyspark.sql import functions as F

resultado = (
    spark.table("ventas")
    .filter(F.year("fecha") == 2024)
    .join(
        spark.table("productos"),
        F.col("producto_id") == F.col("productos.id"),
        "inner"
    )
    .groupBy("pais", "categoria")
    .agg(
        F.sum("monto").alias("total_facturado"),
        F.countDistinct("cliente_id").alias("clientes_unicos")
    )
    .orderBy(F.col("total_facturado").desc())
)

display(resultado)
```

Patrón: filtrar → joinear → agrupar → resumir → ordenar. Es el flujo estándar.

---

## Caso real 2: Top clientes por segmento

**Pregunta de negocio:** "Dame los 10 mejores clientes por segmento, con su nombre y total comprado."

```python
resultado = (
    spark.table("ventas")
    .join(
        spark.table("clientes"),
        F.col("cliente_id") == F.col("clientes.id"),
        "inner"
    )
    .groupBy("segmento", "cliente_id", "nombre")
    .agg(F.sum("monto").alias("total_comprado"))
    .orderBy("segmento", F.col("total_comprado").desc())
)

display(resultado)
```

Aquí la información del nombre viene del join con la tabla de clientes. Sin el join, solo tendríamos el `cliente_id` (un número), que no le sirve a nadie.

---

## Caso real 3: Productos más vendidos por tienda

**Pregunta de negocio:** "¿Cuál es el producto más vendido en cada tienda?"

```python
resultado = (
    spark.table("ventas")
    .join(
        spark.table("productos"),
        F.col("producto_id") == F.col("productos.id"),
        "inner"
    )
    .join(
        spark.table("tiendas"),
        F.col("tienda_id") == F.col("tiendas.id"),
        "inner"
    )
    .groupBy("tiendas.nombre", "productos.nombre")
    .agg(F.sum("cantidad").alias("unidades_vendidas"))
    .orderBy("tiendas.nombre", F.col("unidades_vendidas").desc())
)
```

Dos joins porque necesitamos información de productos Y de tiendas en el mismo análisis.

---

## Errores comunes y cómo evitarlos

### Error 1: usar inner cuando deberías usar left

```python
# Mal: pierdes ventas si algún cliente no está registrado
ventas.join(clientes, ..., "inner")

# Bien: conservas todas las ventas
ventas.join(clientes, ..., "left")
```

### Error 2: olvidar que el join multiplica filas

Si una venta puede tener varias filas en la otra tabla (por ejemplo, un cliente que tiene varios registros históricos), el join devuelve más filas que las originales. Tu suma se duplica. Antes de hacer un join, asegúrate de que la tabla de la derecha tiene una sola fila por cada clave.

### Error 3: ambigüedad de columnas

```python
# Si productos y clientes tienen ambos una columna 'id'
ventas.join(productos, ...).join(clientes, ...).select("id")
# Error: ambigüedad
```

Solución: renombra las columnas conflictivas antes del join, o usa nombres calificados (`productos.id`).

---

## 🎯 Tareas

**Tarea 1:** Crea una vista enriquecida que combine `ventas` con `productos` y `clientes`. Selecciona: id de venta, fecha, monto, nombre del producto y nombre del cliente.

<details>
<summary>Ver solución</summary>

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")
productos = spark.table("productos").withColumnRenamed("nombre", "producto_nombre")
clientes = spark.table("clientes").withColumnRenamed("nombre", "cliente_nombre")

(
    ventas
    .join(productos, ventas.producto_id == productos.id, "left")
    .join(clientes, ventas.cliente_id == clientes.id, "left")
    .select(
        ventas.id.alias("venta_id"),
        ventas.fecha,
        ventas.monto,
        F.col("producto_nombre"),
        F.col("cliente_nombre")
    )
).show()
```

</details>

**Tarea 2:** Calcula el total facturado por categoría de producto, solo para Guatemala.

<details>
<summary>Ver solución</summary>

```python
(
    ventas
    .filter(F.col("pais") == "Guatemala")
    .join(productos, ventas.producto_id == productos.id, "inner")
    .groupBy("categoria")
    .agg(F.sum("monto").alias("total"))
    .orderBy(F.col("total").desc())
).show()
```

</details>

**Tarea 3:** Encuentra los 5 clientes que más han comprado (por monto total). Muestra su nombre y el total acumulado.

<details>
<summary>Ver solución</summary>

```python
(
    ventas
    .join(clientes, ventas.cliente_id == clientes.id, "inner")
    .groupBy("cliente_nombre")
    .agg(F.sum("monto").alias("total_comprado"))
    .orderBy(F.col("total_comprado").desc())
    .limit(5)
).show()
```

</details>

---

*Universidad Nexus — Curso de Python y Spark*
