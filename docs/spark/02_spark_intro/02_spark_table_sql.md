---
sidebar_position: 3
title: spark.table y spark.sql
---

# spark.table() y spark.sql()

Para empezar a trabajar con datos en Spark, primero necesitas saber cómo cargarlos. En Databricks, las tablas ya están registradas en el sistema, así que lo único que tienes que hacer es decirle a Spark cuál quieres usar.

Existen dos formas de hacerlo, y cada una tiene su lugar.

---

## La tabla con la que trabajaremos

A lo largo de este curso usaremos cuatro tablas que simulan un entorno retail similar al de CBC. La principal es `ventas`:

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | INTEGER | Identificador único de la venta |
| `fecha` | DATE | Fecha de la transacción |
| `producto_id` | INTEGER | Referencia al producto |
| `cliente_id` | INTEGER | Referencia al cliente |
| `tienda_id` | INTEGER | Referencia a la tienda |
| `cantidad` | INTEGER | Unidades vendidas |
| `monto` | DECIMAL | Valor de la venta |
| `region` | VARCHAR | Región donde ocurrió |
| `pais` | VARCHAR | País |

Usaremos esta tabla para todos los ejemplos de las próximas lecciones.

---

## spark.table(): la forma directa

`spark.table()` carga una tabla por su nombre y devuelve un DataFrame:

```python
ventas = spark.table("ventas")
```

Eso es todo. Después de esa línea, la variable `ventas` contiene un DataFrame que apunta a la tabla. Puedes empezar a trabajar con ella.

> 💡 **Importante:** Spark es perezoso (lazy). La línea anterior NO carga los datos en memoria. Solo crea una referencia. Los datos se procesan cuando ejecutas una acción concreta, como ver el resultado o guardarlo. Esto es lo que le permite a Spark ser tan eficiente.

### Ver los datos: display() y show()

Cargar la tabla no te muestra nada. Para ver el contenido, usas una de dos funciones:

**`display()`** — exclusivo de Databricks, muestra los datos como una tabla interactiva con opciones de visualización:

```python
ventas = spark.table("ventas")
display(ventas)
```

**`show()`** — funciona en cualquier entorno Spark, muestra los datos como texto:

```python
ventas = spark.table("ventas")
ventas.show()
```

Por defecto, `show()` muestra las primeras 20 filas. Si quieres más o menos, le pasas un número:

```python
ventas.show(5)    # Primeras 5 filas
ventas.show(100)  # Primeras 100 filas
```

> 💡 **¿Cuál usar?** En Databricks, casi siempre `display()` porque te da una vista rica con paginación, búsqueda y exportación. `show()` es útil cuando estás depurando código rápido o trabajando fuera de Databricks.

---

## spark.sql(): para los amantes del SQL

Si vienes con confianza desde el módulo de SQL, vas a amar esta función. `spark.sql()` te permite escribir SQL puro y obtener un DataFrame como resultado:

```python
ventas_norte = spark.sql("""
    SELECT id, fecha, producto_id, monto
    FROM ventas
    WHERE region = 'Norte'
""")

display(ventas_norte)
```

Sí, leíste bien. **Todo el SQL que aprendiste en el módulo anterior funciona exactamente igual aquí.** SELECT, FROM, WHERE, ORDER BY, GROUP BY, JOIN... todo.

### ¿Por qué tres comillas?

Las triple comillas (`"""`) en Python te permiten escribir strings de varias líneas. Esto es muy útil para consultas SQL largas, porque puedes formatearlas de forma legible:

```python
resultado = spark.sql("""
    SELECT 
        region,
        SUM(monto) AS total_ventas,
        COUNT(*) AS num_transacciones
    FROM ventas
    WHERE pais = 'Guatemala'
    GROUP BY region
    ORDER BY total_ventas DESC
""")
```

Comparado con escribir todo en una sola línea, esto es muchísimo más legible y mantenible.

---

## ¿Cuándo usar spark.table() y cuándo spark.sql()?

Las dos opciones funcionan, y muchas veces es cuestión de preferencia. Pero hay algunas guías:

| Usa `spark.table()` cuando... | Usa `spark.sql()` cuando... |
|---|---|
| Solo necesitas cargar una tabla completa | Tienes una consulta compleja con JOIN, GROUP BY, etc. |
| Vas a aplicar transformaciones con la API de Python | Tu lógica es más natural en SQL |
| Quieres encadenar muchas operaciones | Estás migrando código SQL existente |
| Trabajas con varias tablas pequeñas | Quieres aprovechar tu conocimiento de SQL |

> 💡 **En la práctica:** Vas a usar las dos. Lo común es cargar tablas con `spark.table()` cuando quieres usar la API de DataFrames, y usar `spark.sql()` cuando ya tienes una consulta SQL escrita o cuando la consulta es compleja. Ambas devuelven el mismo tipo de objeto: un DataFrame.

---

## Inspeccionar un DataFrame antes de analizarlo

Antes de hacer cualquier análisis, siempre conviene inspeccionar el DataFrame para saber con qué estás trabajando. Hay tres funciones esenciales:

### printSchema(): qué columnas y tipos tiene

```python
ventas = spark.table("ventas")
ventas.printSchema()
```

Esto te muestra algo así:

```
root
 |-- id: integer (nullable = true)
 |-- fecha: date (nullable = true)
 |-- producto_id: integer (nullable = true)
 |-- cliente_id: integer (nullable = true)
 |-- tienda_id: integer (nullable = true)
 |-- cantidad: integer (nullable = true)
 |-- monto: decimal(10,2) (nullable = true)
 |-- region: string (nullable = true)
 |-- pais: string (nullable = true)
```

Cada columna te dice su nombre, su tipo de dato y si puede tener valores nulos. Es información crítica antes de operar.

### count(): cuántas filas hay

```python
total_filas = ventas.count()
print(f"La tabla tiene {total_filas:,} filas")
```

### columns: lista de nombres de columnas

```python
print(ventas.columns)
# ['id', 'fecha', 'producto_id', 'cliente_id', 'tienda_id', 'cantidad', 'monto', 'region', 'pais']
```

> 💡 **Hábito de buen analista:** Antes de escribir cualquier transformación, ejecuta `printSchema()` y `count()`. Te ahorra muchos errores. Si esperas 1 millón de filas y tienes 1,500, algo está mal en la fuente. Si esperas que `monto` sea decimal y es string, vas a tener problemas al sumarlo.

---

## 🎯 Ejercicio

Asumiendo que tienes acceso a las tablas `ventas`, `productos` y `clientes`:

1. Carga la tabla `ventas` usando `spark.table()` y muéstrala con `display()`.
2. Imprime su schema y cuenta sus filas.
3. Usa `spark.sql()` para obtener las primeras 10 ventas de la región "Norte". Muéstralas.
4. Usa `spark.sql()` para contar cuántas ventas hay en cada país. Pista: necesitas `GROUP BY pais`.

<details>
<summary>Ver solución</summary>

```python
# 1. Cargar y mostrar la tabla
ventas = spark.table("ventas")
display(ventas)

# 2. Inspeccionar
ventas.printSchema()
print(f"Total de filas: {ventas.count():,}")

# 3. Primeras 10 ventas del Norte (usando SQL)
ventas_norte = spark.sql("""
    SELECT *
    FROM ventas
    WHERE region = 'Norte'
    LIMIT 10
""")
display(ventas_norte)

# 4. Conteo por país
ventas_por_pais = spark.sql("""
    SELECT pais, COUNT(*) AS num_ventas
    FROM ventas
    GROUP BY pais
    ORDER BY num_ventas DESC
""")
display(ventas_por_pais)
```

</details>

---

*Universidad Nexus — Curso de Python y Spark*
