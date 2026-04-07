---
sidebar_position: 4
title: Conversión de Tipos (Cast)
---

# Conversión de Tipos (Cast)

A veces los datos vienen con tipos que no son los que necesitas. Una columna de números almacenada como texto, una fecha guardada como string, un decimal cuando esperabas un entero. Convertir tipos es algo que vas a hacer todo el tiempo.

En Spark, esta conversión se llama **cast**, y se hace con el método `.cast()`.

---

## ¿Por qué importan los tipos?

Imagina que tienes una columna `monto` que se guardó accidentalmente como string. Cuando intentas sumarla con `F.sum()`, Spark te da error o resultados raros. Lo mismo pasa si quieres comparar fechas que están como texto: el orden alfabético no es el orden cronológico.

Antes de cualquier análisis serio, valida los tipos con `printSchema()` y corrige los que no estén bien.

```python
ventas = spark.table("ventas")
ventas.printSchema()
```

Si ves algo como esto:

```
root
 |-- id: integer (nullable = true)
 |-- fecha: string (nullable = true)       ← debería ser date
 |-- monto: string (nullable = true)       ← debería ser decimal
 |-- cantidad: integer (nullable = true)
```

Tienes trabajo de casting por delante.

---

## Sintaxis básica del cast

`cast()` se aplica a una columna y devuelve esa misma columna con el tipo nuevo. Como devuelve una columna, casi siempre lo combinas con `withColumn()`:

```python
from pyspark.sql import functions as F

ventas_corregidas = ventas.withColumn(
    "monto",
    F.col("monto").cast("decimal(10,2)")
)
```

Esto reemplaza la columna `monto` con la versión convertida a decimal.

---

## Tipos más comunes

Estos son los tipos que más vas a usar:

| Tipo en Spark | Para qué |
|---|---|
| `"int"` o `"integer"` | Números enteros |
| `"long"` o `"bigint"` | Enteros grandes (más allá de 2 mil millones) |
| `"float"` | Decimales con poca precisión |
| `"double"` | Decimales con alta precisión |
| `"decimal(10,2)"` | Decimales con precisión exacta (10 dígitos, 2 decimales) |
| `"string"` | Texto |
| `"date"` | Fecha sin hora |
| `"timestamp"` | Fecha con hora |
| `"boolean"` | True / False |

> 💡 **Para montos de dinero, usa `decimal`.** Es el único tipo que mantiene precisión exacta. `float` y `double` pueden tener errores de redondeo que son imperceptibles individualmente pero se acumulan al sumar millones de filas.

---

## Ejemplos prácticos

### Convertir string a decimal

```python
ventas.withColumn(
    "monto",
    F.col("monto").cast("decimal(10,2)")
)
```

### Convertir string a fecha

```python
ventas.withColumn(
    "fecha",
    F.col("fecha").cast("date")
)
```

> ⚠️ Esto solo funciona si el string ya está en formato `YYYY-MM-DD`. Si tu fecha viene como `"05/01/2024"` o `"5-Jan-2024"`, necesitas usar `F.to_date()` con un formato específico:

```python
ventas.withColumn(
    "fecha",
    F.to_date(F.col("fecha"), "dd/MM/yyyy")
)
```

### Convertir número a entero

```python
ventas.withColumn(
    "cantidad",
    F.col("cantidad").cast("int")
)
```

### Convertir varias columnas a la vez

```python
ventas_corregidas = (
    ventas
    .withColumn("monto", F.col("monto").cast("decimal(10,2)"))
    .withColumn("cantidad", F.col("cantidad").cast("int"))
    .withColumn("fecha", F.col("fecha").cast("date"))
)
```

---

## Cuidado con la pérdida de datos

Cuando conviertes de un tipo a otro, puedes perder información:

**Decimal a int:** se pierden los decimales.
```python
F.lit(99.7).cast("int")  # → 99
```

**Texto inválido a número:** Spark devuelve `NULL`.
```python
F.lit("hola").cast("int")  # → NULL
```

Esto último es muy importante: si tienes una columna de strings con algunos valores no numéricos y la conviertes a int, esos valores se vuelven NULL silenciosamente. Tu cuenta de filas no cambia, pero tus sumas y promedios pueden estar mal.

> 💡 **Buen hábito:** Después de un cast, verifica si aparecieron NULLs nuevos:
> ```python
> ventas.filter(F.col("monto").isNull()).count()
> ```
> Si esperabas 0 y tienes 50, alguien tiene datos inválidos en esa columna.

---

## El patrón completo: limpiar tipos al inicio

Una buena práctica es estandarizar los tipos justo después de cargar la tabla, antes de cualquier análisis:

```python
from pyspark.sql import functions as F

ventas = (
    spark.table("ventas")
    .withColumn("fecha", F.col("fecha").cast("date"))
    .withColumn("monto", F.col("monto").cast("decimal(10,2)"))
    .withColumn("cantidad", F.col("cantidad").cast("int"))
)

# Validar
ventas.printSchema()
print(f"Filas con monto nulo: {ventas.filter(F.col('monto').isNull()).count()}")
```

Después de este bloque, sabes que estás trabajando con tipos correctos y puedes seguir con confianza.

---

## 🎯 Tareas

**Tarea 1:** Convierte la columna `cantidad` a tipo `int`.

<details>
<summary>Ver solución</summary>

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")
ventas.withColumn(
    "cantidad",
    F.col("cantidad").cast("int")
).printSchema()
```

</details>

**Tarea 2:** Convierte la columna `monto` a `decimal(10,2)` y verifica con `printSchema()`.

<details>
<summary>Ver solución</summary>

```python
ventas.withColumn(
    "monto",
    F.col("monto").cast("decimal(10,2)")
).printSchema()
```

</details>

**Tarea 3:** Crea un DataFrame con la fecha convertida a `date`, el monto a `decimal(10,2)` y la cantidad a `int`. Cuenta cuántas filas tienen monto nulo después de la conversión.

<details>
<summary>Ver solución</summary>

```python
ventas_corregidas = (
    ventas
    .withColumn("fecha", F.col("fecha").cast("date"))
    .withColumn("monto", F.col("monto").cast("decimal(10,2)"))
    .withColumn("cantidad", F.col("cantidad").cast("int"))
)

ventas_corregidas.printSchema()
nulos = ventas_corregidas.filter(F.col("monto").isNull()).count()
print(f"Filas con monto nulo: {nulos}")
```

</details>

---

*Universidad Nexus — Curso de Python y Spark*
