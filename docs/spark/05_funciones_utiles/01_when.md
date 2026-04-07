---
sidebar_position: 2
title: F.when() — Lógica Condicional
---

# F.when() — Lógica Condicional

`F.when()` es el equivalente del `CASE WHEN` de SQL. Te permite aplicar lógica condicional dentro de una columna: "si pasa esto, devuelve este valor; si no, devuelve este otro".

Es una de las funciones más usadas en análisis porque te permite categorizar, clasificar y crear flags directamente desde Spark, sin necesidad de exportar a Excel.

---

## Sintaxis básica

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")

ventas_clasificadas = ventas.withColumn(
    "categoria",
    F.when(F.col("monto") > 5000, "Grande")
     .otherwise("Pequeña")
)

display(ventas_clasificadas)
```

Desglosemos qué pasa:

- `F.when(condición, valor)` evalúa la condición. Si es verdadera, devuelve el valor.
- `.otherwise(valor)` se ejecuta cuando ninguna condición fue verdadera. Es el "default".

Esta sintaxis te recordará al `if/else` de Python, pero aplicado columna por columna.

---

## Múltiples condiciones encadenadas

Puedes encadenar varios `.when()` para tener más de dos categorías:

```python
ventas_clasificadas = ventas.withColumn(
    "tamano_venta",
    F.when(F.col("monto") < 1000, "Pequeña")
     .when(F.col("monto") < 5000, "Mediana")
     .when(F.col("monto") < 20000, "Grande")
     .otherwise("Premium")
)
```

Spark evalúa las condiciones de arriba hacia abajo. Cuando encuentra una verdadera, devuelve ese valor y se sale. Las demás se ignoran.

> 💡 **Importante:** El orden de las condiciones importa. Si la primera condición captura el caso, las siguientes no se evalúan. Por eso siempre escribe las condiciones de la más específica a la más general.

---

## Combinar condiciones complejas

Puedes usar `&` (AND) y `|` (OR) dentro de cada `when()`, igual que en `filter()`:

```python
ventas.withColumn(
    "prioridad",
    F.when(
        (F.col("region") == "Norte") & (F.col("monto") > 10000),
        "Alta"
    ).when(
        (F.col("region") == "Sur") | (F.col("region") == "Centro"),
        "Media"
    ).otherwise("Baja")
)
```

Recuerda envolver cada condición individual entre paréntesis. Es la misma regla que en `filter()`.

---

## Crear flags booleanos

Un caso muy común es crear columnas booleanas (verdadero/falso) para marcar registros que cumplen ciertas condiciones:

```python
ventas.withColumn(
    "es_venta_grande",
    F.when(F.col("monto") > 10000, True).otherwise(False)
)
```

O más conciso, usando directamente la condición (Spark la convierte a boolean):

```python
ventas.withColumn(
    "es_venta_grande",
    F.col("monto") > 10000
)
```

Las dos formas hacen lo mismo. La segunda es más limpia para casos simples.

---

## Categorización con valores derivados

`when()` no se limita a devolver constantes. También puede devolver valores calculados:

```python
ventas.withColumn(
    "monto_ajustado",
    F.when(
        F.col("region") == "Norte",
        F.col("monto") * 1.10  # 10% más en Norte
    ).when(
        F.col("region") == "Sur",
        F.col("monto") * 0.95  # 5% menos en Sur
    ).otherwise(
        F.col("monto")  # sin cambio en otras
    )
)
```

Esto te permite aplicar reglas de negocio complejas en una sola transformación.

---

## Sin otherwise: ¿qué pasa?

Si no incluyes `.otherwise()`, las filas que no cumplen ninguna condición reciben `NULL`:

```python
ventas.withColumn(
    "etiqueta",
    F.when(F.col("monto") > 5000, "Grande")
     .when(F.col("monto") > 1000, "Mediana")
    # sin otherwise
)
```

En este ejemplo, las ventas con monto menor o igual a 1000 tendrán `NULL` en la columna `etiqueta`. A veces eso es lo que quieres (cuando solo te interesa marcar ciertas filas), pero la mayoría de las veces es mejor incluir `.otherwise()` explícitamente para evitar nulos inesperados.

---

## Caso real: clasificar clientes por valor

Imagina que quieres clasificar las ventas según el segmento de cliente al que pertenecen, combinando varios criterios:

```python
from pyspark.sql import functions as F

resultado = ventas.withColumn(
    "tipo_cliente",
    F.when(
        F.col("monto") > 50000,
        "VIP"
    ).when(
        (F.col("monto") > 10000) & (F.col("cantidad") >= 100),
        "Mayorista"
    ).when(
        F.col("monto") > 1000,
        "Regular"
    ).otherwise(
        "Ocasional"
    )
)

display(resultado)
```

Este patrón es exactamente lo que vas a hacer cuando construyas segmentaciones, alertas o dashboards en CBC.

---

## 🎯 Tareas

**Tarea 1:** Crea una columna `categoria_monto` que clasifique las ventas en "Baja" (menos de 1000), "Media" (entre 1000 y 10000) y "Alta" (más de 10000).

<details>
<summary>Ver solución</summary>

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")
ventas.withColumn(
    "categoria_monto",
    F.when(F.col("monto") < 1000, "Baja")
     .when(F.col("monto") <= 10000, "Media")
     .otherwise("Alta")
).show()
```

</details>

**Tarea 2:** Crea un flag booleano `es_top_venta` que sea True cuando el monto es mayor a 20,000 y la cantidad es mayor o igual a 50.

<details>
<summary>Ver solución</summary>

```python
ventas.withColumn(
    "es_top_venta",
    (F.col("monto") > 20000) & (F.col("cantidad") >= 50)
).show()
```

</details>

**Tarea 3:** Crea una columna `region_nivel` con valor "Premium" si la región es Norte o Centro, "Estándar" si es Sur, y "Otro" en cualquier otro caso.

<details>
<summary>Ver solución</summary>

```python
ventas.withColumn(
    "region_nivel",
    F.when(F.col("region").isin("Norte", "Centro"), "Premium")
     .when(F.col("region") == "Sur", "Estándar")
     .otherwise("Otro")
).show()
```

</details>

---

*Universidad Nexus — Curso de Python y Spark*
