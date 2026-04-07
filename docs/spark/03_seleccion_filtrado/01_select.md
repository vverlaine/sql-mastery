---
sidebar_position: 2
title: select() — Elegir Columnas
---

# select() — Elegir Columnas

`select()` es el equivalente directo del `SELECT` de SQL. Le dice a Spark qué columnas quieres ver del DataFrame.

Es una de las operaciones más usadas, y entenderla bien es la base para todo lo que viene.

---

## Sintaxis básica

Para seleccionar columnas, le pasas sus nombres a `select()`:

```python
ventas = spark.table("ventas")
resultado = ventas.select("id", "fecha", "monto")
display(resultado)
```

Esto devuelve un nuevo DataFrame con solo esas tres columnas. El DataFrame original (`ventas`) sigue intacto. Esto es importante: Spark **nunca modifica** el DataFrame original, siempre devuelve uno nuevo.

> 💡 **Inmutabilidad:** Los DataFrames de Spark son inmutables. Cada operación crea un DataFrame nuevo. Esto puede parecer ineficiente, pero en realidad es lo que le permite a Spark optimizar y paralelizar todo.

---

## Tres formas de pasar columnas

Spark es flexible y te ofrece varias formas de especificar columnas. Vas a encontrarlas todas en código real:

### 1. Como strings (la forma más simple)

```python
ventas.select("id", "fecha", "monto")
```

Esta es la forma más directa. Funciona bien cuando solo necesitas seleccionar columnas existentes.

### 2. Usando F.col() (la forma más poderosa)

```python
from pyspark.sql import functions as F

ventas.select(F.col("id"), F.col("fecha"), F.col("monto"))
```

Aquí estás envolviendo cada columna en `F.col()`, que crea un objeto "columna" de Spark. Parece más verboso, pero te permite hacer cosas que con strings no puedes:

```python
from pyspark.sql import functions as F

ventas.select(
    F.col("id"),
    F.col("monto"),
    (F.col("monto") * 1.13).alias("monto_con_iva")
)
```

Aquí no solo seleccionamos columnas existentes, sino que creamos una nueva (`monto_con_iva`) basada en una transformación. Eso solo es posible con `F.col()`.

### 3. Notación de punto (atajo cuando ya tienes el DataFrame)

```python
ventas.select(ventas.id, ventas.fecha, ventas.monto)
```

Cada columna del DataFrame se puede acceder como un atributo. Es práctico cuando ya tienes el DataFrame en una variable.

> 💡 **¿Cuál usar?** En la práctica, usa strings para casos simples y `F.col()` cuando necesites transformaciones. La notación de punto es útil cuando trabajas con joins (que veremos más adelante) para evitar ambigüedades.

---

## Importar functions: el primer paso siempre

Antes de poder usar `F.col()` y todas las funciones de Spark, necesitas importar el módulo de funciones. Esta línea va al principio del notebook:

```python
from pyspark.sql import functions as F
```

A partir de ese momento, puedes usar `F.col()`, `F.sum()`, `F.avg()`, `F.when()` y muchas más. El alias `F` es una convención universal — la vas a ver en todo código Spark profesional.

---

## Renombrar columnas con .alias()

Cuando creas una columna nueva o quieres dar un nombre más claro, usas `.alias()`:

```python
from pyspark.sql import functions as F

resultado = ventas.select(
    F.col("id").alias("venta_id"),
    F.col("monto").alias("monto_neto"),
    (F.col("monto") * 1.13).alias("monto_con_iva")
)

display(resultado)
```

El resultado tendrá las columnas con los nombres `venta_id`, `monto_neto` y `monto_con_iva`.

> 💡 **Cuándo usarlo:** Siempre que crees una columna calculada, dale un alias claro. Si no lo haces, Spark le pone nombres feos como `(monto * 1.13)`, que son ilegibles.

---

## Seleccionar todas las columnas

Si quieres todas las columnas, simplemente no llames a `select()`. El DataFrame ya las tiene todas por defecto:

```python
ventas = spark.table("ventas")
display(ventas)  # Muestra todas las columnas
```

Pero si por alguna razón necesitas usar `select` con todas las columnas explícitamente:

```python
ventas.select("*")
```

Esto es equivalente al `SELECT *` de SQL.

---

## Encadenamiento: el patrón más importante de Spark

Una de las ventajas más poderosas de la API de DataFrames es que puedes **encadenar operaciones** una tras otra. Cada operación devuelve un DataFrame nuevo, y puedes seguir aplicando operaciones sobre ese resultado.

```python
from pyspark.sql import functions as F

resultado = (
    ventas
    .select("id", "fecha", "region", "monto")
    .filter(F.col("region") == "Norte")
    .orderBy(F.col("monto").desc())
)

display(resultado)
```

Aquí estamos haciendo tres cosas en una sola expresión:
1. Seleccionamos 4 columnas
2. Filtramos solo las de la región Norte
3. Ordenamos por monto descendente

Y todo se lee de arriba hacia abajo como una receta. Este estilo se llama **method chaining** y es la forma estándar de escribir código Spark.

> 💡 **Truco de formato:** Envuelve la cadena de operaciones entre paréntesis para poder dividirla en varias líneas sin necesidad de barras invertidas (`\`). Es mucho más limpio.

---

## 🎯 Tareas

Asumiendo que tienes acceso a la tabla `ventas`:

**Tarea 1:** Selecciona solo las columnas `id`, `producto_id` y `monto`.

<details>
<summary>Ver solución</summary>

```python
ventas = spark.table("ventas")
ventas.select("id", "producto_id", "monto").show()
```

</details>

**Tarea 2:** Selecciona `id`, `region` y `monto`, pero renombra `monto` como `valor_venta`.

<details>
<summary>Ver solución</summary>

```python
from pyspark.sql import functions as F

ventas.select(
    F.col("id"),
    F.col("region"),
    F.col("monto").alias("valor_venta")
).show()
```

</details>

**Tarea 3:** Crea un DataFrame nuevo con tres columnas: `id`, `monto` y una columna calculada `monto_con_iva` que sea `monto * 1.13`.

<details>
<summary>Ver solución</summary>

```python
from pyspark.sql import functions as F

ventas.select(
    F.col("id"),
    F.col("monto"),
    (F.col("monto") * 1.13).alias("monto_con_iva")
).show()
```

</details>

---

*Universidad Nexus — Curso de Python y Spark*
