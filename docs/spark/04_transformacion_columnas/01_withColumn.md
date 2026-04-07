---
sidebar_position: 2
title: withColumn() — Crear y Modificar Columnas
---

# withColumn() — Crear y Modificar Columnas

`withColumn()` es probablemente la función que más vas a usar en Spark. Sirve para dos cosas:

1. **Crear** una columna nueva en el DataFrame
2. **Modificar** una columna que ya existe

La sintaxis es la misma para ambos casos. Si la columna no existe, la crea. Si existe, la reemplaza.

---

## Sintaxis básica

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")

ventas_con_iva = ventas.withColumn(
    "monto_con_iva",
    F.col("monto") * 1.13
)

display(ventas_con_iva)
```

`withColumn()` recibe dos argumentos:
1. El **nombre** de la columna (como string)
2. La **expresión** que define su valor

En el ejemplo anterior, creamos una columna nueva llamada `monto_con_iva` que es el resultado de multiplicar `monto` por 1.13.

---

## Crear una columna con un valor fijo

A veces necesitas agregar una columna con un valor constante para todas las filas. Para eso usas `F.lit()`, que crea una "literal" (un valor fijo):

```python
ventas_con_pais = ventas.withColumn("origen", F.lit("CBC"))
display(ventas_con_pais)
```

Ahora todas las filas tienen una columna `origen` con el valor `"CBC"`. Es útil cuando vas a unir varios DataFrames y necesitas marcar de dónde viene cada uno.

> 💡 **¿Cuándo usar F.lit()?** Siempre que quieras poner un valor que NO viene de otra columna. Si pones directamente `"CBC"` sin envolverlo en `F.lit()`, Spark se confunde porque espera un objeto de columna, no un string suelto.

---

## Crear columnas basadas en operaciones

Las operaciones matemáticas funcionan como en Python normal:

```python
ventas_calculadas = ventas.withColumn(
    "precio_unitario",
    F.col("monto") / F.col("cantidad")
)
```

Suma, resta, multiplicación, división — todo funciona igual que con números normales, pero aplicado columna por columna.

```python
# Margen estimado al 30%
ventas.withColumn(
    "margen_estimado",
    F.col("monto") * 0.30
)

# Diferencia entre dos columnas
ventas.withColumn(
    "diferencia",
    F.col("monto") - F.col("descuento")
)
```

---

## Modificar una columna existente

Si pasas un nombre de columna que YA existe, `withColumn()` la reemplaza:

```python
# La columna 'monto' ahora incluye IVA
ventas_actualizadas = ventas.withColumn(
    "monto",
    F.col("monto") * 1.13
)
```

Esto es útil cuando necesitas estandarizar valores: convertir mayúsculas, redondear decimales, ajustar formatos.

> ⚠️ **Cuidado:** Si reemplazas una columna, pierdes los valores originales en el resultado. Si necesitas conservarlos, mejor crea una columna nueva con un nombre diferente.

---

## Encadenar varios withColumn

Es muy común necesitar varias columnas calculadas. Puedes encadenar varios `withColumn()`:

```python
resultado = (
    ventas
    .withColumn("monto_con_iva", F.col("monto") * 1.13)
    .withColumn("descuento_5pct", F.col("monto") * 0.05)
    .withColumn("monto_final", F.col("monto_con_iva") - F.col("descuento_5pct"))
)
```

Notaste algo interesante: en la tercera línea estamos usando `monto_con_iva`, que fue creada en la primera línea. Eso funciona porque cada `withColumn()` devuelve un DataFrame nuevo donde esa columna ya existe.

> 💡 **Patrón muy útil:** Encadenar transformaciones en orden lógico hace tu código mucho más fácil de leer. Cada paso construye sobre el anterior.

---

## Operaciones con strings

Spark tiene muchas funciones para trabajar con texto. Las más comunes:

```python
# Convertir a mayúsculas
ventas.withColumn("region_upper", F.upper(F.col("region")))

# Convertir a minúsculas
ventas.withColumn("region_lower", F.lower(F.col("region")))

# Concatenar dos columnas
ventas.withColumn(
    "ubicacion",
    F.concat(F.col("region"), F.lit(" - "), F.col("pais"))
)

# Longitud del texto
ventas.withColumn("largo_region", F.length(F.col("region")))
```

`F.lit(" - ")` aquí está agregando un guion como literal entre las dos columnas. Sin `F.lit()` no funcionaría.

---

## Operaciones con números

```python
# Redondear a 2 decimales
ventas.withColumn("monto_redondeado", F.round(F.col("monto"), 2))

# Valor absoluto
ventas.withColumn("monto_abs", F.abs(F.col("monto")))

# Raíz cuadrada
ventas.withColumn("raiz", F.sqrt(F.col("monto")))
```

---

## Operaciones con fechas

Las funciones de fecha son especialmente útiles para análisis temporal:

```python
# Extraer el año
ventas.withColumn("anio", F.year(F.col("fecha")))

# Extraer el mes
ventas.withColumn("mes", F.month(F.col("fecha")))

# Extraer el día
ventas.withColumn("dia", F.dayofmonth(F.col("fecha")))

# Día de la semana (1 = domingo, 7 = sábado)
ventas.withColumn("dia_semana", F.dayofweek(F.col("fecha")))
```

Esto te permite agrupar análisis por mes, año o día de la semana sin tener que hacer manipulaciones complejas.

```python
# Agregar año, mes y trimestre en una sola operación
ventas_temporales = (
    ventas
    .withColumn("anio", F.year("fecha"))
    .withColumn("mes", F.month("fecha"))
    .withColumn("trimestre", F.quarter("fecha"))
)
```

> 💡 **Detalle útil:** Cuando le pasas una columna a una función, puedes usar el string directamente (`"fecha"`) o `F.col("fecha")`. Las dos formas funcionan, pero `F.col()` es más explícito y consistente.

---

## 🎯 Tareas

**Tarea 1:** Crea una columna nueva llamada `monto_con_iva` que contenga el monto multiplicado por 1.13.

<details>
<summary>Ver solución</summary>

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")
ventas.withColumn(
    "monto_con_iva",
    F.col("monto") * 1.13
).show()
```

</details>

**Tarea 2:** Crea una columna `precio_unitario` que sea el resultado de dividir `monto` entre `cantidad`.

<details>
<summary>Ver solución</summary>

```python
ventas.withColumn(
    "precio_unitario",
    F.col("monto") / F.col("cantidad")
).show()
```

</details>

**Tarea 3:** Agrega tres columnas a partir de la fecha: `anio`, `mes` y `trimestre`.

<details>
<summary>Ver solución</summary>

```python
(
    ventas
    .withColumn("anio", F.year("fecha"))
    .withColumn("mes", F.month("fecha"))
    .withColumn("trimestre", F.quarter("fecha"))
).show()
```

</details>

**Tarea 4:** Crea una columna `region_pais` que concatene la región y el país separados por " - " (ejemplo: "Norte - Guatemala").

<details>
<summary>Ver solución</summary>

```python
ventas.withColumn(
    "region_pais",
    F.concat(F.col("region"), F.lit(" - "), F.col("pais"))
).show()
```

</details>

---

*Universidad Nexus — Curso de Python y Spark*
