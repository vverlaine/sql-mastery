---
sidebar_position: 3
title: filter() y where() — Filtrar Filas
---

# filter() y where() — Filtrar Filas

Si `select()` es el equivalente de `SELECT` en SQL, `filter()` es el equivalente de `WHERE`. Te permite quedarte solo con las filas que cumplen una condición.

Y aquí viene un detalle agradable: en Spark hay dos funciones para hacer exactamente lo mismo, `filter()` y `where()`. Funcionan idéntico. Puedes usar la que prefieras.

---

## Sintaxis básica

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")

ventas_norte = ventas.filter(F.col("region") == "Norte")
display(ventas_norte)
```

Esto devuelve solo las filas donde `region` es igual a `"Norte"`. La sintaxis para escribir la condición es prácticamente igual a Python normal.

> ⚠️ **Importante:** Para igualdad usa `==` (doble), no `=`. Esta es la misma regla que aprendiste en la sección de Python básico, pero conviene recordarla porque es uno de los errores más comunes al empezar con Spark.

---

## filter() y where() son intercambiables

Estas dos líneas hacen exactamente lo mismo:

```python
ventas.filter(F.col("region") == "Norte")
ventas.where(F.col("region") == "Norte")
```

¿Por qué existen las dos? Por compatibilidad: `where` se siente más natural para gente que viene de SQL, y `filter` se siente más natural para gente que viene de programación. Spark las acepta ambas para no obligarte a elegir.

> 💡 **Recomendación:** Elige una y úsala consistentemente en todo tu código. Mezclar las dos confunde a quien lee. En este curso vamos a usar `filter()` porque es el nombre más común en código Python real.

---

## Operadores de comparación

Igual que en SQL, puedes filtrar con varios operadores:

| Operador | Significado | Ejemplo |
|---|---|---|
| `==` | Igual a | `F.col("region") == "Norte"` |
| `!=` | Distinto de | `F.col("region") != "Sur"` |
| `<` | Menor que | `F.col("monto") < 1000` |
| `<=` | Menor o igual | `F.col("monto") <= 1000` |
| `>` | Mayor que | `F.col("monto") > 5000` |
| `>=` | Mayor o igual | `F.col("monto") >= 5000` |

Ejemplos:

```python
# Ventas mayores a 5000
ventas_grandes = ventas.filter(F.col("monto") > 5000)

# Ventas menores o iguales a 1000
ventas_pequenas = ventas.filter(F.col("monto") <= 1000)

# Ventas que NO son del Norte
ventas_no_norte = ventas.filter(F.col("region") != "Norte")
```

---

## Combinar condiciones con & (AND) y | (OR)

En SQL usabas `AND` y `OR`. En Spark usas `&` y `|` respectivamente. Y hay una regla importante: **cada condición debe ir entre paréntesis**.

### Combinar con AND (&)

```python
# Ventas del Norte con monto mayor a 5000
ventas_premium_norte = ventas.filter(
    (F.col("region") == "Norte") & (F.col("monto") > 5000)
)
```

### Combinar con OR (|)

```python
# Ventas del Norte O del Sur
ventas_norte_sur = ventas.filter(
    (F.col("region") == "Norte") | (F.col("region") == "Sur")
)
```

### Combinar varios

```python
# Norte con monto > 5000, O Sur con monto > 10000
ventas_top = ventas.filter(
    ((F.col("region") == "Norte") & (F.col("monto") > 5000)) |
    ((F.col("region") == "Sur") & (F.col("monto") > 10000))
)
```

> ⚠️ **Los paréntesis no son opcionales.** Si los olvidas, Python interpreta los operadores en un orden distinto al que esperas y obtienes resultados incorrectos. Usa siempre paréntesis explícitos en cada condición.

---

## Negación con ~ (NOT)

Para invertir una condición usas `~`:

```python
# Todas las ventas que NO son del Norte
ventas_otras = ventas.filter(~(F.col("region") == "Norte"))
```

Aunque en este caso es más legible escribirlo con `!=`:

```python
ventas_otras = ventas.filter(F.col("region") != "Norte")
```

`~` es más útil cuando inviertes una condición compleja:

```python
# Todas las ventas que NO sean (Norte y mayor a 5000)
ventas.filter(~((F.col("region") == "Norte") & (F.col("monto") > 5000)))
```

---

## Filtrar con isin(): el equivalente de IN

Cuando quieres filtrar por una lista de valores, usar varios `OR` se vuelve tedioso:

```python
# Forma tediosa
ventas.filter(
    (F.col("region") == "Norte") |
    (F.col("region") == "Sur") |
    (F.col("region") == "Centro")
)
```

Spark te da un atajo: `isin()`:

```python
# Forma elegante
ventas.filter(F.col("region").isin("Norte", "Sur", "Centro"))
```

Es exactamente el equivalente de `WHERE region IN ('Norte', 'Sur', 'Centro')` en SQL.

---

## Filtrar valores nulos: isNull() e isNotNull()

Recuerda lo que aprendiste en SQL: para verificar valores nulos NO uses `==`. En Spark tienes funciones específicas:

```python
# Filas donde region es NULL
ventas.filter(F.col("region").isNull())

# Filas donde region NO es NULL
ventas.filter(F.col("region").isNotNull())
```

---

## Filtrar por rangos: between()

Para filtrar valores dentro de un rango (equivalente de `BETWEEN` en SQL):

```python
ventas.filter(F.col("monto").between(1000, 5000))
```

Esto es equivalente a:

```python
ventas.filter((F.col("monto") >= 1000) & (F.col("monto") <= 5000))
```

`between()` es inclusivo en ambos extremos, igual que en SQL.

---

## Encadenar select() y filter()

El patrón más común en análisis es seleccionar columnas y filtrar filas en una sola expresión:

```python
from pyspark.sql import functions as F

resultado = (
    ventas
    .select("id", "fecha", "region", "monto")
    .filter(F.col("region") == "Norte")
    .filter(F.col("monto") > 1000)
)

display(resultado)
```

Notaste que aplicamos `.filter()` dos veces. Eso es perfectamente válido y a veces más legible que combinar todo en una sola condición. Spark internamente las combina y optimiza.

---

## 🎯 Tareas

**Tarea 1:** Filtra las ventas cuyo monto sea mayor a 10,000.

<details>
<summary>Ver solución</summary>

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")
ventas.filter(F.col("monto") > 10000).show()
```

</details>

**Tarea 2:** Filtra las ventas de Guatemala con cantidad mayor o igual a 50 unidades.

<details>
<summary>Ver solución</summary>

```python
ventas.filter(
    (F.col("pais") == "Guatemala") & (F.col("cantidad") >= 50)
).show()
```

</details>

**Tarea 3:** Filtra las ventas que sean de las regiones "Norte", "Centro" o "Sur" con monto entre 5,000 y 20,000.

<details>
<summary>Ver solución</summary>

```python
ventas.filter(
    F.col("region").isin("Norte", "Centro", "Sur") &
    F.col("monto").between(5000, 20000)
).show()
```

</details>

**Tarea 4:** Selecciona solo `id`, `fecha` y `monto` de las ventas con cantidad nula.

<details>
<summary>Ver solución</summary>

```python
(
    ventas
    .select("id", "fecha", "monto")
    .filter(F.col("cantidad").isNull())
).show()
```

</details>

---

*Universidad Nexus — Curso de Python y Spark*
