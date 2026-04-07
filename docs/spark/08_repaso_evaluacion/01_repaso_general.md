---
sidebar_position: 2
title: Repaso General
---

# Repaso General

Esta página es tu cheat sheet del curso completo. Tenla a la mano cuando empieces a trabajar en proyectos reales.

---

## 1. Importar funciones

Siempre lo primero, en cada notebook:

```python
from pyspark.sql import functions as F
```

---

## 2. Cargar datos

```python
# Cargar una tabla
df = spark.table("nombre_tabla")

# Ejecutar SQL puro
df = spark.sql("SELECT * FROM nombre_tabla WHERE condicion")

# Inspeccionar
df.printSchema()
df.count()
df.columns
display(df)
```

---

## 3. Seleccionar columnas

```python
df.select("col1", "col2", "col3")
df.select(F.col("col1"), F.col("col2") * 1.13)
df.select(F.col("col1").alias("nuevo_nombre"))
```

---

## 4. Filtrar filas

```python
df.filter(F.col("monto") > 1000)
df.filter(F.col("region") == "Norte")
df.filter((F.col("region") == "Norte") & (F.col("monto") > 5000))
df.filter(F.col("region").isin("Norte", "Sur"))
df.filter(F.col("monto").between(1000, 5000))
df.filter(F.col("region").isNull())
df.filter(F.col("region").isNotNull())
```

---

## 5. Crear y modificar columnas

```python
df.withColumn("nueva", F.col("monto") * 1.13)
df.withColumn("anio", F.year("fecha"))
df.withColumn("mes", F.month("fecha"))
df.withColumn("trimestre", F.quarter("fecha"))
df.withColumnRenamed("viejo", "nuevo")
df.drop("col1", "col2")

# Cast de tipos
df.withColumn("monto", F.col("monto").cast("decimal(10,2)"))
df.withColumn("fecha", F.col("fecha").cast("date"))
```

---

## 6. Lógica condicional

```python
df.withColumn(
    "categoria",
    F.when(F.col("monto") < 1000, "Baja")
     .when(F.col("monto") < 5000, "Media")
     .otherwise("Alta")
)
```

---

## 7. Manejo de nulos

```python
df.fillna("Desconocida", subset=["region"])
df.fillna({"region": "X", "monto": 0})
df.dropna(subset=["monto"])

# Coalesce: primer valor no nulo
F.coalesce(F.col("col1"), F.col("col2"), F.lit("default"))
```

---

## 8. Funciones de fecha

```python
F.year("fecha")
F.month("fecha")
F.dayofmonth("fecha")
F.quarter("fecha")
F.dayofweek("fecha")
F.date_format("fecha", "yyyy-MM")
F.datediff(F.current_date(), F.col("fecha"))
F.date_add(F.col("fecha"), 30)
```

---

## 9. Funciones de texto

```python
F.upper("col")
F.lower("col")
F.initcap("col")
F.trim("col")
F.length("col")
F.concat(F.col("a"), F.lit(" - "), F.col("b"))
F.concat_ws(" / ", F.col("a"), F.col("b"))
F.col("col").contains("texto")
F.col("col").startswith("Co")
```

---

## 10. Agregaciones

```python
# Atajos simples
df.groupBy("region").count()
df.groupBy("region").sum("monto")
df.groupBy("region").avg("monto")
df.groupBy("region").max("monto")

# Múltiples agregaciones con nombres
df.groupBy("region").agg(
    F.sum("monto").alias("total"),
    F.avg("monto").alias("promedio"),
    F.count("*").alias("transacciones"),
    F.countDistinct("cliente_id").alias("clientes_unicos"),
    F.max("monto").alias("maximo")
)

# Agregación global (sin groupBy)
df.agg(F.sum("monto").alias("total_global"))
```

---

## 11. Ordenar

```python
df.orderBy("col1")                          # asc por defecto
df.orderBy(F.col("col1").desc())            # desc
df.orderBy("col1", F.col("col2").desc())    # múltiples columnas
df.limit(10)                                # primeras 10
```

---

## 12. Joins

```python
# Inner join (estricto)
a.join(b, a.col1 == b.col2, "inner")

# Left join (conserva todo lo de la izquierda)
a.join(b, a.col1 == b.col2, "left")

# Cuando las columnas tienen el mismo nombre
a.join(b, "columna_comun", "inner")

# Múltiples condiciones
a.join(b, (a.x == b.y) & (a.z == b.w), "inner")
```

---

## El esqueleto de un análisis completo

Casi todos tus análisis van a seguir este patrón. Mémorízalo:

```python
from pyspark.sql import functions as F

resultado = (
    spark.table("tabla_principal")
    
    # 1. Cast de tipos si es necesario
    .withColumn("fecha", F.col("fecha").cast("date"))
    .withColumn("monto", F.col("monto").cast("decimal(10,2)"))
    
    # 2. Filtrar lo más temprano posible
    .filter(F.year("fecha") == 2024)
    .filter(F.col("monto") > 0)
    
    # 3. Limpiar nulos
    .fillna("Sin asignar", subset=["region"])
    
    # 4. Joins con tablas relacionadas
    .join(spark.table("productos"), F.col("producto_id") == F.col("productos.id"), "left")
    
    # 5. Crear columnas calculadas
    .withColumn("anio_mes", F.date_format("fecha", "yyyy-MM"))
    
    # 6. Agrupar y resumir
    .groupBy("anio_mes", "categoria")
    .agg(
        F.sum("monto").alias("total"),
        F.count("*").alias("num_transacciones"),
        F.countDistinct("cliente_id").alias("clientes")
    )
    
    # 7. Ordenar
    .orderBy("anio_mes", F.col("total").desc())
)

display(resultado)
```

Carga → cast → filtra → limpia → joinea → calcula → agrupa → ordena. Si interiorizas este flujo, el 90% de tus análisis van a fluir naturalmente.

---

## Mentalidad de analista en Spark

Cierra esta página recordando lo más importante: las herramientas son el medio, no el fin.

- **Spark no responde preguntas que tú no sabes hacer.** Antes de escribir código, define con claridad qué quieres saber.
- **Los datos sucios producen análisis sucios.** Siempre inspecciona y limpia antes de calcular métricas.
- **Un número sin contexto miente.** Acompaña tus métricas de comparaciones, tendencias y rangos.
- **El código que no se entiende se vuelve ingobernable.** Usa nombres claros, comenta cuando algo no sea obvio, divide pasos largos en variables intermedias.
- **Validar siempre.** Si tu análisis dice algo sorprendente, primero duda de tu código. Después duda de los datos. Después duda de la realidad.

---

*Universidad Nexus — Curso de Python y Spark*
