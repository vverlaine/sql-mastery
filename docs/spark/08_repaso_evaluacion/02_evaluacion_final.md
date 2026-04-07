---
sidebar_position: 3
title: Evaluación Final
---

# Evaluación Final

Esta es tu evaluación del módulo. Vas a resolver un caso integrador que combina TODO lo que aprendiste: cargar tablas, limpiar nulos, hacer joins, transformar columnas, agrupar, agregar y ordenar.

No es un examen para aprobar o reprobar. Es un ejercicio para que te demuestres a ti mismo que el contenido del curso quedó internalizado. Si puedes hacerlo sin mirar las soluciones, estás listo.

---

## El caso

Eres analista de datos en CBC. Tu jefe te pide un reporte ejecutivo con las siguientes preguntas. Tienes acceso a las cuatro tablas que usaste durante el curso: `ventas`, `productos`, `clientes` y `tiendas`.

Debes responder cada pregunta con código Spark.

---

## Criterios de avance

Para considerarte listo en este módulo, deberías poder:

1. **Cargar e inspeccionar** una tabla con `spark.table()`, `printSchema()` y `count()`.
2. **Diagnosticar nulos** en columnas críticas y decidir cómo manejarlos.
3. **Transformar columnas** con `withColumn()`, casts y funciones de fecha.
4. **Filtrar datos** con `filter()` usando condiciones simples y combinadas.
5. **Aplicar lógica condicional** con `F.when()` para clasificar registros.
6. **Hacer joins** entre tablas conservando los registros relevantes.
7. **Agrupar y resumir** con `groupBy()` y `agg()`, calculando múltiples métricas.
8. **Ordenar y rankear** resultados con `orderBy()` y `limit()`.

Si después de este ejercicio sientes que dominas estos 8 puntos, has completado el módulo con éxito.

---

## Pregunta 1: Diagnóstico de calidad de datos

Antes de cualquier análisis, necesitas saber con qué estás trabajando.

**Tarea:** Carga la tabla `ventas`. Reporta:
- Cuántas filas totales tiene
- Qué tipos de datos tiene cada columna
- Cuántos valores nulos hay en `monto`, `cantidad`, `region` y `cliente_id`

<details>
<summary>Ver solución</summary>

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")

# Total de filas
print(f"Total filas: {ventas.count():,}")

# Schema
ventas.printSchema()

# Diagnóstico de nulos
columnas_criticas = ["monto", "cantidad", "region", "cliente_id"]
for col in columnas_criticas:
    nulos = ventas.filter(F.col(col).isNull()).count()
    print(f"  {col}: {nulos} nulos")
```

</details>

---

## Pregunta 2: Top 5 productos por facturación en 2024

Tu jefe quiere saber cuáles son los productos más rentables del año.

**Tarea:** Calcula los 5 productos con mayor monto total facturado en 2024. Muestra el nombre del producto, su categoría y el total facturado.

<details>
<summary>Ver solución</summary>

```python
ventas = spark.table("ventas")
productos = spark.table("productos")

resultado = (
    ventas
    .filter(F.year("fecha") == 2024)
    .join(
        productos,
        ventas.producto_id == productos.id,
        "inner"
    )
    .groupBy("nombre", "categoria")
    .agg(F.sum("monto").alias("total_facturado"))
    .orderBy(F.col("total_facturado").desc())
    .limit(5)
)

display(resultado)
```

</details>

---

## Pregunta 3: Análisis por país y mes

Tu jefe quiere ver la evolución mensual de las ventas por país durante 2024.

**Tarea:** Agrupa las ventas de 2024 por país y mes. Calcula el total de ventas y el número de transacciones de cada combinación. Ordena por país y luego por mes.

<details>
<summary>Ver solución</summary>

```python
resultado = (
    spark.table("ventas")
    .filter(F.year("fecha") == 2024)
    .withColumn("mes", F.month("fecha"))
    .groupBy("pais", "mes")
    .agg(
        F.sum("monto").alias("total_ventas"),
        F.count("*").alias("num_transacciones")
    )
    .orderBy("pais", "mes")
)

display(resultado)
```

</details>

---

## Pregunta 4: Clasificación de transacciones

Tu equipo quiere clasificar cada venta según su tamaño para hacer análisis posteriores.

**Tarea:** Crea una nueva columna `tamano` con los siguientes valores:
- `"Pequeña"` si el monto es menor a 1000
- `"Mediana"` si está entre 1000 y 10000
- `"Grande"` si está entre 10000 y 50000
- `"Premium"` si es mayor a 50000

Muestra cuántas transacciones hay en cada categoría.

<details>
<summary>Ver solución</summary>

```python
resultado = (
    spark.table("ventas")
    .withColumn(
        "tamano",
        F.when(F.col("monto") < 1000, "Pequeña")
         .when(F.col("monto") < 10000, "Mediana")
         .when(F.col("monto") < 50000, "Grande")
         .otherwise("Premium")
    )
    .groupBy("tamano")
    .count()
    .orderBy(F.col("count").desc())
)

display(resultado)
```

</details>

---

## Pregunta 5: Top 10 clientes por valor total

Tu jefe quiere identificar a los clientes más valiosos para diseñar un programa VIP.

**Tarea:** Encuentra los 10 clientes con mayor monto total comprado. Muestra: nombre del cliente, segmento, número de transacciones y monto total. No pierdas ventas si algún cliente no tiene registro completo.

<details>
<summary>Ver solución</summary>

```python
ventas = spark.table("ventas")
clientes = spark.table("clientes")

resultado = (
    ventas
    .join(
        clientes,
        ventas.cliente_id == clientes.id,
        "left"
    )
    .withColumn("nombre", F.coalesce(F.col("nombre"), F.lit("Desconocido")))
    .withColumn("segmento", F.coalesce(F.col("segmento"), F.lit("Sin clasificar")))
    .groupBy("nombre", "segmento")
    .agg(
        F.count("*").alias("num_transacciones"),
        F.sum("monto").alias("monto_total")
    )
    .orderBy(F.col("monto_total").desc())
    .limit(10)
)

display(resultado)
```

</details>

---

## Pregunta 6: Participación de cada categoría

Tu jefe quiere saber qué porcentaje del negocio aporta cada categoría de producto.

**Tarea:** Calcula el monto total facturado por cada categoría de producto, junto con su porcentaje del total general. Ordena de mayor a menor.

<details>
<summary>Ver solución</summary>

```python
ventas = spark.table("ventas")
productos = spark.table("productos")

# Total global primero
total_global = (
    ventas.agg(F.sum("monto").alias("t")).collect()[0]["t"]
)

resultado = (
    ventas
    .join(productos, ventas.producto_id == productos.id, "inner")
    .groupBy("categoria")
    .agg(F.sum("monto").alias("total_categoria"))
    .withColumn(
        "porcentaje",
        F.round((F.col("total_categoria") / total_global) * 100, 2)
    )
    .orderBy(F.col("total_categoria").desc())
)

display(resultado)
```

</details>

---

## Pregunta 7: Vista enriquecida completa

Tu equipo de BI quiere una tabla "lista para reportar" con toda la información cruzada de ventas, productos, clientes y tiendas.

**Tarea:** Construye una vista enriquecida que combine las cuatro tablas. Para cada venta, muestra:
- ID y fecha de la venta
- Nombre del producto y categoría
- Nombre del cliente y segmento
- Nombre de la tienda y región
- Monto y cantidad

Conserva todas las ventas (usa left join donde sea necesario).

<details>
<summary>Ver solución</summary>

```python
ventas = spark.table("ventas")
productos = spark.table("productos").withColumnRenamed("nombre", "producto_nombre")
clientes = spark.table("clientes").withColumnRenamed("nombre", "cliente_nombre")
tiendas = spark.table("tiendas").withColumnRenamed("nombre", "tienda_nombre")

vista = (
    ventas
    .join(productos, ventas.producto_id == productos.id, "left")
    .join(clientes, ventas.cliente_id == clientes.id, "left")
    .join(tiendas, ventas.tienda_id == tiendas.id, "left")
    .select(
        ventas.id.alias("venta_id"),
        ventas.fecha,
        F.col("producto_nombre"),
        F.col("categoria"),
        F.col("cliente_nombre"),
        F.col("segmento"),
        F.col("tienda_nombre"),
        F.col("region"),
        ventas.monto,
        ventas.cantidad
    )
)

display(vista)
```

</details>

---

## Pregunta 8: Tu propio análisis

Esta es la pregunta más importante de toda la evaluación, y la única sin solución de referencia.

**Tarea:** Inventa una pregunta de negocio que sea relevante para CBC y respóndela usando lo aprendido en el curso. Algunas ideas:

- ¿Cuál es la región con mayor crecimiento mes a mes?
- ¿Qué categoría tiene el ticket promedio más alto?
- ¿Cuántos clientes nuevos compraron en los últimos 30 días?
- ¿Qué día de la semana se vende más?
- ¿Hay alguna región con muchas transacciones pero bajo monto promedio?

No hay una respuesta correcta. Lo que importa es:

1. **Que la pregunta sea clara y específica.**
2. **Que tu código la responda correctamente.**
3. **Que el resultado sea legible y útil para alguien que no conoce el código.**
4. **Que documentes con comentarios o markdown qué descubriste.**

> 💡 Cuando termines, si te queda alguna duda sobre si lo hiciste bien, comparte el notebook con tu equipo o con tu lead. La práctica de mostrar tu trabajo y recibir feedback es parte del oficio.

---

## Felicidades

Si llegaste hasta acá y resolviste la mayoría de las preguntas, ya tienes las bases para usar Spark productivamente en CBC. Lo que viene ahora es **práctica deliberada**: aplicar estas herramientas a problemas reales de tu día a día, con datos que te importan.

Spark es un océano. Este curso te enseñó a navegarlo en aguas tranquilas. Los siguientes módulos del programa de Universidad Nexus te van a llevar más profundo:

- **Pilar 3** te llevará a Databricks como entorno productivo y a VSCode para desarrollo local.
- **Pilar 4** te enseñará a versionar tu código con GitHub.
- **Pilar 5** cerrará el círculo conectando todo con Power BI para visualización.

Cada pieza encaja con la siguiente. Al final del programa, vas a ser el tipo de analista que CBC necesita: capaz de ir desde la pregunta de negocio hasta el dashboard final, sin depender de nadie en el camino.

---

*Universidad Nexus — Curso de Python y Spark*
