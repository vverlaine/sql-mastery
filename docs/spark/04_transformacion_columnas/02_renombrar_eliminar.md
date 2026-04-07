---
sidebar_position: 3
title: withColumnRenamed() y drop()
---

# withColumnRenamed() y drop()

Además de crear y modificar columnas, hay dos operaciones que vas a hacer todo el tiempo: renombrar columnas para que tengan nombres más claros, y eliminar las que no necesitas. Estas dos funciones son simples pero esenciales.

---

## withColumnRenamed() — Renombrar columnas

`withColumnRenamed()` cambia el nombre de una columna. Recibe dos argumentos: el nombre actual y el nombre nuevo.

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")

ventas_renombradas = ventas.withColumnRenamed("monto", "monto_total")
display(ventas_renombradas)
```

El resto del DataFrame queda igual. Solo cambia el nombre de esa columna.

### ¿Cuándo renombrar?

Hay varios casos típicos:

**1. Cuando los nombres originales no son claros:**

```python
# La tabla viene con columnas crípticas del sistema
df.withColumnRenamed("vlr_vta", "monto_venta")
df.withColumnRenamed("cod_cli", "cliente_id")
df.withColumnRenamed("dt_op", "fecha_operacion")
```

**2. Cuando vas a hacer un join y quieres evitar columnas duplicadas:**

```python
# Las dos tablas tienen una columna 'id', mejor renombrar
clientes_renombrados = clientes.withColumnRenamed("id", "cliente_id")
```

**3. Cuando vas a exportar o presentar el resultado:**

```python
# Para que el dashboard tenga títulos legibles
resultado.withColumnRenamed("avg_monto", "Monto Promedio")
```

### Renombrar varias columnas a la vez

`withColumnRenamed()` solo renombra una a la vez. Para varias, las encadenas:

```python
resultado = (
    ventas
    .withColumnRenamed("monto", "valor_venta")
    .withColumnRenamed("cantidad", "unidades")
    .withColumnRenamed("region", "zona")
)
```

Si tienes que renombrar muchas, hay otras técnicas más eficientes (como `toDF()` con una lista de nombres), pero para casos normales encadenar `withColumnRenamed()` es perfectamente válido y muy legible.

---

## drop() — Eliminar columnas

`drop()` elimina una o más columnas del DataFrame. Devuelve un DataFrame nuevo sin esas columnas:

```python
ventas_sin_id = ventas.drop("id")
display(ventas_sin_id)
```

### Eliminar varias columnas a la vez

A diferencia de `withColumnRenamed()`, `drop()` sí acepta varios nombres a la vez:

```python
ventas_limpias = ventas.drop("id", "tienda_id", "cliente_id")
```

Esto elimina las tres columnas en una sola operación.

### ¿Cuándo eliminar columnas?

**1. Cuando las columnas son ruido para el análisis:**

```python
# No necesitas los IDs internos para tu reporte
ventas.drop("id", "fecha_creacion", "usuario_creacion")
```

**2. Cuando son sensibles y no deben aparecer en el resultado:**

```python
# Eliminar datos personales antes de compartir
clientes.drop("email", "telefono", "documento")
```

**3. Cuando son duplicados después de un join:**

```python
# Después de unir dos tablas, una columna se duplicó
resultado.drop("region_y")
```

---

## El patrón completo: limpiar y renombrar

En la práctica, vas a combinar todas estas operaciones para preparar un DataFrame antes del análisis. Este es un patrón muy común:

```python
from pyspark.sql import functions as F

resultado = (
    spark.table("ventas")
    # Agregar columnas calculadas
    .withColumn("monto_con_iva", F.col("monto") * 1.13)
    .withColumn("anio", F.year("fecha"))
    .withColumn("mes", F.month("fecha"))
    # Renombrar para mayor claridad
    .withColumnRenamed("monto", "monto_neto")
    # Eliminar columnas que no necesitamos
    .drop("tienda_id", "cliente_id")
    # Filtrar
    .filter(F.col("anio") == 2024)
    # Seleccionar solo lo final
    .select("id", "fecha", "anio", "mes", "monto_neto", "monto_con_iva", "region")
)

display(resultado)
```

Mira el flujo: cargar → agregar columnas → renombrar → limpiar → filtrar → seleccionar. Es un patrón que vas a repetir en miles de análisis.

> 💡 **Buena práctica:** Cuando una transformación se vuelve muy larga, divídela en varias variables intermedias con nombres descriptivos:

```python
ventas_cargadas = spark.table("ventas")
ventas_calculadas = ventas_cargadas.withColumn(...).withColumn(...)
ventas_filtradas = ventas_calculadas.filter(...)
resultado_final = ventas_filtradas.select(...)
```

Esto sacrifica un poco de elegancia por mucha legibilidad. Y la legibilidad casi siempre vale más.

---

## drop() vs select(): cuándo usar cada uno

A veces puedes lograr lo mismo de dos maneras: eliminar las columnas que no quieres con `drop()`, o seleccionar solo las que sí quieres con `select()`.

```python
# Opción A: drop
resultado = ventas.drop("id", "tienda_id", "cliente_id", "creado_en")

# Opción B: select
resultado = ventas.select("fecha", "monto", "region", "pais", "cantidad")
```

¿Cuál usar?

- **Usa `drop()`** cuando hay POCAS columnas que quieres eliminar y MUCHAS que quieres conservar.
- **Usa `select()`** cuando hay POCAS columnas que quieres conservar y MUCHAS que quieres eliminar.

Y aplica la regla más importante: usa la opción que sea más legible. Si tu DataFrame tiene 50 columnas y solo quieres conservar 5, escribir `select()` con esas 5 es muchísimo más claro que escribir `drop()` con las otras 45.

---

## 🎯 Tareas

**Tarea 1:** Renombra la columna `monto` a `valor_venta`.

<details>
<summary>Ver solución</summary>

```python
ventas = spark.table("ventas")
ventas.withColumnRenamed("monto", "valor_venta").show()
```

</details>

**Tarea 2:** Elimina las columnas `tienda_id` y `cliente_id` del DataFrame.

<details>
<summary>Ver solución</summary>

```python
ventas.drop("tienda_id", "cliente_id").show()
```

</details>

**Tarea 3:** Crea un nuevo DataFrame que: agregue una columna `mes` (con `F.month`), renombre `monto` a `valor`, y elimine `tienda_id`.

<details>
<summary>Ver solución</summary>

```python
from pyspark.sql import functions as F

resultado = (
    ventas
    .withColumn("mes", F.month("fecha"))
    .withColumnRenamed("monto", "valor")
    .drop("tienda_id")
)
resultado.show()
```

</details>

---

*Universidad Nexus — Curso de Python y Spark*
