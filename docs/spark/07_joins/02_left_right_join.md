---
sidebar_position: 3
title: Left Join y Right Join
---

# Left Join y Right Join

El inner join solo devuelve filas que tienen coincidencia en ambas tablas. Pero a veces necesitas conservar TODAS las filas de una tabla, incluso las que no tienen pareja en la otra. Para eso existen el `left join` y el `right join`.

---

## El problema que resuelven

Imagina que tienes 100 ventas y haces un inner join con la tabla de clientes. Si 5 ventas tienen `cliente_id` que no existe en la tabla de clientes (datos sucios, o clientes eliminados), esas 5 ventas DESAPARECEN del resultado.

En análisis, eso es peligroso. Acabas de perder información sin darte cuenta.

El **left join** resuelve esto: te garantiza que todas las filas de la tabla "izquierda" (la primera) estarán en el resultado, hayan tenido coincidencia o no. Las que no la tuvieron, vienen con nulos en las columnas de la tabla derecha.

---

## Left Join: conserva todo lo de la izquierda

```python
ventas = spark.table("ventas")
clientes = spark.table("clientes")

resultado = ventas.join(
    clientes,
    ventas.cliente_id == clientes.id,
    "left"
)

display(resultado)
```

Las 100 ventas siguen ahí. Las 5 que no tienen cliente correspondiente aparecen con `NULL` en `nombre`, `segmento`, etc.

> 💡 **Cuándo usarlo:** Siempre que la tabla principal de tu análisis sea la "izquierda" y no quieras perder ninguna de sus filas. Por ejemplo, "todas las ventas con info del cliente CUANDO esté disponible".

### Detectar registros huérfanos con left join

Un uso muy útil: encontrar las filas que NO tienen pareja. Después del left join, filtras donde la columna de la tabla derecha sea nula:

```python
ventas_sin_cliente = (
    ventas.join(
        clientes,
        ventas.cliente_id == clientes.id,
        "left"
    )
    .filter(clientes.id.isNull())
)

print(f"Ventas con cliente desconocido: {ventas_sin_cliente.count()}")
```

Es una técnica clave para auditar la calidad de tus datos. Si hay muchos huérfanos, hay un problema en la fuente que necesitas reportar.

---

## Right Join: conserva todo lo de la derecha

`right join` es lo mismo que `left join`, pero al revés: conserva todas las filas de la tabla DERECHA.

```python
resultado = ventas.join(
    clientes,
    ventas.cliente_id == clientes.id,
    "right"
)
```

En este caso conservas todos los clientes, incluso los que no han comprado. Los clientes sin ventas aparecen con nulos en las columnas de `ventas`.

> 💡 **En la práctica:** El `right join` es raro. Casi nadie lo usa porque siempre puedes lograr lo mismo con un `left join` poniendo la tabla en orden distinto:
> 
> ```python
> # En lugar de:
> ventas.join(clientes, ventas.cliente_id == clientes.id, "right")
> 
> # Es más legible:
> clientes.join(ventas, clientes.id == ventas.cliente_id, "left")
> ```
> 
> Las dos consultas devuelven exactamente lo mismo. La segunda es más natural de leer porque la "tabla principal" está al frente.

---

## Comparación visual

Pongamos un ejemplo simple. Imagina estas dos tablas:

```
ventas:               clientes:
+----+-------------+  +----+--------+
| id | cliente_id  |  | id | nombre |
+----+-------------+  +----+--------+
| 1  | 100         |  | 100| Ana    |
| 2  | 101         |  | 101| Carlos |
| 3  | 999         |  | 102| María  |
+----+-------------+  +----+--------+
```

Cliente 999 no existe en `clientes`. Cliente 102 (María) no tiene ventas.

### Inner join

Solo las filas que tienen pareja en ambas tablas:

```
+----+-------------+--------+
| id | cliente_id  | nombre |
+----+-------------+--------+
| 1  | 100         | Ana    |
| 2  | 101         | Carlos |
+----+-------------+--------+
```

La venta 3 desaparece (cliente 999 no existe). María desaparece (no tiene ventas).

### Left join (ventas a la izquierda)

Todas las ventas, hayan tenido cliente o no:

```
+----+-------------+--------+
| id | cliente_id  | nombre |
+----+-------------+--------+
| 1  | 100         | Ana    |
| 2  | 101         | Carlos |
| 3  | 999         | NULL   |
+----+-------------+--------+
```

La venta 3 sigue ahí, con `nombre = NULL`.

### Right join (ventas a la izquierda, clientes a la derecha)

Todos los clientes, hayan tenido ventas o no:

```
+------+-------------+--------+
| id   | cliente_id  | nombre |
+------+-------------+--------+
| 1    | 100         | Ana    |
| 2    | 101         | Carlos |
| NULL | NULL        | María  |
+------+-------------+--------+
```

María aparece, sin ventas asociadas.

---

## ¿Cuándo usar cada uno?

| Tipo | Cuándo usarlo |
|---|---|
| **inner** | Solo te interesan los registros que tienen pareja en ambas tablas. El default cuando "ambas son obligatorias". |
| **left** | La tabla principal es la izquierda y no puedes perder ninguna de sus filas. Es el más usado en análisis. |
| **right** | Casi nunca. Mejor invierte el orden y usa left. |

> 💡 **Regla simple:** Si tienes dudas, usa `left join` con la tabla más importante a la izquierda. Es la opción más segura porque no pierdes filas accidentalmente.

---

## Caso real: enriquecer ventas con datos del cliente sin perder ninguna

Imagina que estás haciendo un análisis de ventas mensual. La tabla principal son las `ventas`, y quieres agregarles el segmento del cliente. Pero algunos clientes pueden no estar registrados (datos viejos, problemas de captura). No quieres perder ventas por eso.

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")
clientes = spark.table("clientes")

resultado = (
    ventas
    .join(
        clientes,
        ventas.cliente_id == clientes.id,
        "left"
    )
    # Si el cliente no existe, marca el segmento como "Desconocido"
    .withColumn(
        "segmento",
        F.coalesce(F.col("segmento"), F.lit("Desconocido"))
    )
    .select(
        ventas.id.alias("venta_id"),
        ventas.fecha,
        ventas.monto,
        F.col("segmento")
    )
)

display(resultado)
```

Mira el patrón: left join + coalesce. Es la combinación perfecta cuando quieres "enriquecer sin perder, y rellenar lo que falte con un valor por defecto".

---

## 🎯 Tareas

**Tarea 1:** Haz un left join entre `ventas` y `clientes`, conservando todas las ventas.

<details>
<summary>Ver solución</summary>

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")
clientes = spark.table("clientes")

(
    ventas.join(
        clientes,
        ventas.cliente_id == clientes.id,
        "left"
    )
).show()
```

</details>

**Tarea 2:** Encuentra todas las ventas que NO tienen cliente correspondiente en la tabla de clientes (registros huérfanos).

<details>
<summary>Ver solución</summary>

```python
huerfanas = (
    ventas.join(
        clientes,
        ventas.cliente_id == clientes.id,
        "left"
    )
    .filter(clientes.id.isNull())
)

print(f"Ventas huérfanas: {huerfanas.count()}")
huerfanas.select(ventas.id, ventas.cliente_id, ventas.monto).show()
```

</details>

**Tarea 3:** Calcula el total de ventas por segmento de cliente, marcando como "Desconocido" los clientes no encontrados.

<details>
<summary>Ver solución</summary>

```python
(
    ventas.join(
        clientes,
        ventas.cliente_id == clientes.id,
        "left"
    )
    .withColumn("segmento", F.coalesce(F.col("segmento"), F.lit("Desconocido")))
    .groupBy("segmento")
    .agg(F.sum("monto").alias("total_ventas"))
    .orderBy(F.col("total_ventas").desc())
).show()
```

</details>

---

*Universidad Nexus — Curso de Python y Spark*
