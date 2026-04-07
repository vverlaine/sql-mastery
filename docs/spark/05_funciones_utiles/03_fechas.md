---
sidebar_position: 4
title: Funciones de Fechas
---

# Funciones de Fechas

Las fechas son uno de los tipos de datos más importantes en análisis de negocio. Casi todas tus preguntas tienen un componente temporal: ventas del último mes, crecimiento año contra año, comportamiento por día de la semana.

Spark tiene un set completo de funciones para trabajar con fechas. En esta lección vas a aprender las que más vas a usar.

---

## Antes de empezar: tipos de fecha

Spark distingue entre dos tipos principales:

- **`date`**: solo fecha, sin hora. Ejemplo: `2024-03-15`.
- **`timestamp`**: fecha con hora, minutos y segundos. Ejemplo: `2024-03-15 14:30:45`.

La mayoría de las funciones de fecha trabajan con ambos. Pero antes de operar, asegúrate de que tu columna esté en el tipo correcto. Si está como string, primero conviértela:

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")

# Si la fecha está como string en formato YYYY-MM-DD
ventas = ventas.withColumn("fecha", F.col("fecha").cast("date"))
```

Si tu fecha viene en otro formato (como `dd/MM/yyyy`), usa `F.to_date()` con el formato:

```python
ventas = ventas.withColumn(
    "fecha",
    F.to_date(F.col("fecha"), "dd/MM/yyyy")
)
```

---

## Extraer partes de una fecha

Estas son las funciones que más vas a usar para análisis temporal:

```python
ventas_temporales = (
    ventas
    .withColumn("anio", F.year("fecha"))
    .withColumn("mes", F.month("fecha"))
    .withColumn("dia", F.dayofmonth("fecha"))
    .withColumn("trimestre", F.quarter("fecha"))
    .withColumn("dia_semana", F.dayofweek("fecha"))
    .withColumn("dia_anio", F.dayofyear("fecha"))
    .withColumn("semana_anio", F.weekofyear("fecha"))
)
```

Cada una devuelve un número. Por ejemplo, para la fecha `2024-03-15`:

| Función | Resultado |
|---|---|
| `year` | 2024 |
| `month` | 3 |
| `dayofmonth` | 15 |
| `quarter` | 1 |
| `dayofweek` | 6 (viernes — 1 es domingo) |
| `dayofyear` | 75 |
| `weekofyear` | 11 |

> 💡 **Por qué importan:** Estas funciones son la base para hacer análisis "por mes", "por trimestre", "por día de la semana". Sin ellas tendrías que hacer manipulaciones de strings horribles.

---

## Comparaciones con fechas

Puedes comparar fechas como si fueran números: las más recientes son "mayores" que las antiguas.

```python
# Ventas posteriores al 1 de enero de 2024
ventas.filter(F.col("fecha") >= "2024-01-01")

# Ventas entre dos fechas
ventas.filter(
    F.col("fecha").between("2024-01-01", "2024-03-31")
)
```

> 💡 Spark interpreta los strings con formato `YYYY-MM-DD` como fechas automáticamente cuando los compara con una columna `date`. Es muy conveniente.

---

## Aritmética con fechas

Spark tiene funciones para sumar y restar tiempo a una fecha:

```python
# Sumar 30 días
ventas.withColumn("fecha_vencimiento", F.date_add(F.col("fecha"), 30))

# Restar 7 días
ventas.withColumn("fecha_inicio_semana", F.date_sub(F.col("fecha"), 7))

# Sumar meses
ventas.withColumn("proximo_corte", F.add_months(F.col("fecha"), 1))
```

Estas funciones son muy útiles para calcular fechas de corte, vencimientos, o ventanas móviles.

### Diferencia entre dos fechas

Para saber cuántos días hay entre dos fechas, usa `F.datediff()`:

```python
ventas.withColumn(
    "dias_desde_creacion",
    F.datediff(F.current_date(), F.col("fecha"))
)
```

`F.current_date()` te da la fecha de hoy. Combinada con `datediff` te permite calcular antigüedades, días desde un evento, etc.

> 💡 **Para meses entre fechas:** existe `F.months_between()` que calcula la diferencia en meses (incluyendo decimales).

---

## Formatear fechas como string

A veces necesitas convertir una fecha a un string con un formato específico para reportes o exportaciones:

```python
ventas.withColumn(
    "fecha_legible",
    F.date_format(F.col("fecha"), "dd 'de' MMMM 'de' yyyy")
)
```

Los formatos siguen las convenciones de Java:

| Símbolo | Significado | Ejemplo |
|---|---|---|
| `yyyy` | Año (4 dígitos) | 2024 |
| `MM` | Mes (2 dígitos) | 03 |
| `dd` | Día (2 dígitos) | 15 |
| `HH` | Hora (24h) | 14 |
| `mm` | Minuto | 30 |
| `ss` | Segundo | 45 |
| `MMMM` | Nombre del mes | March |
| `EEEE` | Nombre del día | Friday |

Ejemplos comunes:

```python
F.date_format("fecha", "yyyy-MM-dd")        # 2024-03-15
F.date_format("fecha", "dd/MM/yyyy")        # 15/03/2024
F.date_format("fecha", "yyyy-MM")           # 2024-03
F.date_format("fecha", "MMMM yyyy")         # March 2024
```

> 💡 **Truco útil:** `date_format("fecha", "yyyy-MM")` te da el "año-mes" como string, perfecto para agrupar por mes en gráficos o tablas.

---

## Caso real: análisis temporal completo

Imagina que quieres analizar las ventas de 2024 agrupadas por trimestre y día de la semana. Este sería el preprocesamiento:

```python
from pyspark.sql import functions as F

ventas_2024 = (
    spark.table("ventas")
    .withColumn("fecha", F.col("fecha").cast("date"))
    .filter(F.year("fecha") == 2024)
    .withColumn("trimestre", F.quarter("fecha"))
    .withColumn("mes", F.month("fecha"))
    .withColumn("dia_semana", F.dayofweek("fecha"))
    .withColumn("anio_mes", F.date_format("fecha", "yyyy-MM"))
)

display(ventas_2024)
```

Con eso ya tienes columnas listas para agrupar y graficar de cualquier forma.

---

## 🎯 Tareas

**Tarea 1:** Agrega tres columnas a las ventas: `anio`, `mes` y `trimestre`.

<details>
<summary>Ver solución</summary>

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")
(
    ventas
    .withColumn("anio", F.year("fecha"))
    .withColumn("mes", F.month("fecha"))
    .withColumn("trimestre", F.quarter("fecha"))
).show()
```

</details>

**Tarea 2:** Filtra solo las ventas del primer trimestre de 2024.

<details>
<summary>Ver solución</summary>

```python
(
    ventas
    .filter(
        (F.year("fecha") == 2024) & (F.quarter("fecha") == 1)
    )
).show()
```

</details>

**Tarea 3:** Crea una columna `dias_desde_venta` que indique cuántos días han pasado desde la fecha de la venta hasta hoy.

<details>
<summary>Ver solución</summary>

```python
ventas.withColumn(
    "dias_desde_venta",
    F.datediff(F.current_date(), F.col("fecha"))
).show()
```

</details>

**Tarea 4:** Crea una columna `anio_mes` con formato "YYYY-MM" para poder agrupar fácilmente.

<details>
<summary>Ver solución</summary>

```python
ventas.withColumn(
    "anio_mes",
    F.date_format("fecha", "yyyy-MM")
).show()
```

</details>

---

*Universidad Nexus — Curso de Python y Spark*
