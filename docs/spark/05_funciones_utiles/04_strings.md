---
sidebar_position: 5
title: Funciones de Texto (Strings)
---

# Funciones de Texto (Strings)

Cuando trabajas con datos reales, una buena parte del tiempo lo pasas limpiando texto: estandarizar mayúsculas, eliminar espacios extras, dividir nombres, extraer códigos. Spark tiene un set completo de funciones para esto.

En esta lección vas a ver las que más vas a usar como analista.

---

## Mayúsculas y minúsculas

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")

ventas.withColumn("region_upper", F.upper(F.col("region")))
ventas.withColumn("region_lower", F.lower(F.col("region")))
ventas.withColumn("region_title", F.initcap(F.col("region")))
```

| Función | Qué hace | Ejemplo |
|---|---|---|
| `F.upper()` | Convierte todo a mayúsculas | "guatemala" → "GUATEMALA" |
| `F.lower()` | Convierte todo a minúsculas | "GUATEMALA" → "guatemala" |
| `F.initcap()` | Primera letra de cada palabra en mayúscula | "san salvador" → "San Salvador" |

> 💡 **Caso típico:** Cuando una columna tiene inconsistencias como "Guatemala", "GUATEMALA", "guatemala", la primera línea de defensa es aplicar `F.upper()` o `F.lower()` para estandarizarla. Esto evita que el sistema cuente la misma categoría como tres distintas.

---

## Eliminar espacios

```python
ventas.withColumn("region_limpia", F.trim(F.col("region")))
```

| Función | Qué hace |
|---|---|
| `F.trim()` | Elimina espacios al inicio y al final |
| `F.ltrim()` | Solo al inicio (left) |
| `F.rtrim()` | Solo al final (right) |

`F.trim()` es uno de los hábitos más importantes cuando importas datos desde Excel o CSV. Es muy común que vengan con espacios accidentales que rompen tus filtros y joins:

```python
# La columna llega como " Guatemala " (con espacios)
ventas.filter(F.col("pais") == "Guatemala")  # No encuentra nada

# Solución: limpiar primero
ventas.withColumn("pais", F.trim(F.col("pais")))
```

---

## Concatenar texto

`F.concat()` une varias columnas o literales:

```python
ventas.withColumn(
    "ubicacion",
    F.concat(F.col("region"), F.lit(" - "), F.col("pais"))
)
```

Cualquier valor que no sea una columna debe ir envuelto en `F.lit()`. Sin eso, Spark te da error.

### Versión con separador: concat_ws()

Cuando vas a unir varias columnas con el mismo separador, `F.concat_ws()` es más limpio. La `ws` es de "with separator":

```python
ventas.withColumn(
    "direccion_completa",
    F.concat_ws(", ", F.col("region"), F.col("pais"), F.col("ciudad"))
)
```

El primer argumento es el separador, los siguientes son las columnas. Spark se encarga de meter el separador entre cada una.

> 💡 **Bonus de `concat_ws()`:** ignora valores nulos. Si una de las columnas es null, no aparece doble separador. Es lo que querés el 99% de las veces.

---

## Longitud del texto

```python
ventas.withColumn("largo_region", F.length(F.col("region")))
```

`F.length()` cuenta los caracteres. Útil para validar formatos: por ejemplo, si todos los códigos de cliente deben tener exactamente 6 dígitos, puedes filtrar los que no cumplen:

```python
clientes.filter(F.length(F.col("codigo")) != 6)
```

---

## Dividir texto: split()

`F.split()` divide un string en una lista basándose en un separador. El resultado es una columna de tipo array:

```python
clientes = spark.table("clientes")

clientes.withColumn(
    "partes_nombre",
    F.split(F.col("nombre_completo"), " ")
)
```

Para acceder a una posición específica del resultado, usa los corchetes:

```python
clientes.withColumn(
    "primer_nombre",
    F.split(F.col("nombre_completo"), " ")[0]
)
```

> 💡 **Recuerda:** En Python (y en Spark), las posiciones empiezan en 0. El primer elemento es `[0]`, el segundo `[1]`, etc.

---

## Extraer una parte: substring()

`F.substring(columna, posicion, longitud)` extrae un fragmento del string:

```python
# Extraer los primeros 3 caracteres
clientes.withColumn(
    "prefijo",
    F.substring(F.col("codigo"), 1, 3)
)
```

> ⚠️ **Atención:** `substring()` empieza en 1, no en 0 (a diferencia de la mayoría de cosas en Python). Es una excepción molesta que conviene recordar.

---

## Reemplazar texto: regexp_replace()

Para reemplazar partes de un string, usa `F.regexp_replace()`:

```python
# Reemplazar "S.A." con "SA"
clientes.withColumn(
    "razon_social",
    F.regexp_replace(F.col("razon_social"), "S\\.A\\.", "SA")
)
```

```python
# Eliminar todos los caracteres que no sean letras o números
clientes.withColumn(
    "codigo_limpio",
    F.regexp_replace(F.col("codigo"), "[^a-zA-Z0-9]", "")
)
```

El primer argumento es la columna, el segundo es el patrón a buscar (puede ser texto literal o una expresión regular), el tercero es lo que va a reemplazarlo.

> 💡 **No te asustes con los regex.** Para casos simples, basta con poner el texto que quieres reemplazar. Solo necesitas regex avanzado cuando tienes patrones complejos como "cualquier número de 4 dígitos seguido de una letra".

---

## Buscar dentro de un string: contains() y like()

Para filtrar filas donde una columna CONTIENE cierto texto:

```python
# Productos cuyo nombre contiene "Coca"
productos.filter(F.col("nombre").contains("Coca"))
```

Para buscar con comodines (similar al `LIKE` de SQL):

```python
# Nombres que empiezan con "Co"
productos.filter(F.col("nombre").like("Co%"))

# Nombres que contienen "Cola" en cualquier parte
productos.filter(F.col("nombre").like("%Cola%"))

# Nombres que terminan en "ml"
productos.filter(F.col("nombre").like("%ml"))
```

`%` es el comodín que significa "cualquier cosa". Funciona exactamente igual que en SQL.

### startswith() y endswith()

Para casos simples, hay funciones más legibles:

```python
productos.filter(F.col("nombre").startswith("Co"))
productos.filter(F.col("nombre").endswith("ml"))
```

Hacen lo mismo que `like()` pero son más claras de leer.

---

## Caso real: estandarizar nombres de clientes

Imagina que tu tabla de clientes viene con nombres caóticos:

```
"  juan PEREZ  "
"MARIA Garcia"
"pedro lopez   "
```

Y quieres limpiarlos a:

```
"Juan Perez"
"Maria Garcia"
"Pedro Lopez"
```

El pipeline sería:

```python
from pyspark.sql import functions as F

clientes_limpios = (
    spark.table("clientes")
    .withColumn(
        "nombre_completo",
        F.initcap(F.trim(F.col("nombre_completo")))
    )
)
```

Una sola línea: `trim()` quita espacios, `initcap()` pone la primera letra de cada palabra en mayúscula. Resultado consistente.

---

## 🎯 Tareas

**Tarea 1:** Convierte la columna `region` a mayúsculas y guárdala como `region_upper`.

<details>
<summary>Ver solución</summary>

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")
ventas.withColumn(
    "region_upper",
    F.upper(F.col("region"))
).show()
```

</details>

**Tarea 2:** Crea una columna `ubicacion` que concatene región y país separados por " / ".

<details>
<summary>Ver solución</summary>

```python
ventas.withColumn(
    "ubicacion",
    F.concat_ws(" / ", F.col("region"), F.col("pais"))
).show()
```

</details>

**Tarea 3:** Filtra los productos cuyo nombre contiene "Coca". Asume que tienes una tabla `productos` con columna `nombre`.

<details>
<summary>Ver solución</summary>

```python
productos = spark.table("productos")
productos.filter(F.col("nombre").contains("Coca")).show()
```

</details>

**Tarea 4:** Estandariza la columna `region` aplicando trim y luego convirtiendo a formato título (primera letra mayúscula).

<details>
<summary>Ver solución</summary>

```python
ventas.withColumn(
    "region",
    F.initcap(F.trim(F.col("region")))
).show()
```

</details>

---

*Universidad Nexus — Curso de Python y Spark*
