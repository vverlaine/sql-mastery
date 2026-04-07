---
sidebar_position: 3
title: Manejo de Nulos — coalesce() y fillna()
---

# Manejo de Nulos — coalesce() y fillna()

Los valores nulos son inevitables en datos reales. Un cliente sin email registrado, una venta sin región asignada, una fecha que no se capturó. Si no los manejas explícitamente, pueden romper tus análisis o, peor aún, dar resultados incorrectos sin que te des cuenta.

Spark te da varias herramientas para detectar, reemplazar y manejar nulos. En esta lección vas a aprender las más útiles.

---

## ¿Por qué los nulos son peligrosos?

Un valor nulo no es lo mismo que cero. No es lo mismo que un string vacío. Es la **ausencia de valor**. Y eso tiene consecuencias raras:

- `NULL + 100` da `NULL`, no `100`.
- `NULL == NULL` da `NULL`, no `True`.
- `SUM()` ignora los nulos en lugar de tratarlos como cero.
- `COUNT(*)` los cuenta, pero `COUNT(columna)` los ignora.

Por eso, antes de cualquier análisis serio, necesitas saber cuántos nulos tiene tu DataFrame y decidir qué hacer con ellos.

---

## Detectar nulos: cuántos hay

La forma más rápida de contar nulos en una columna específica:

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")

nulos_region = ventas.filter(F.col("region").isNull()).count()
print(f"Filas con region nula: {nulos_region}")
```

Si quieres ver cuántos nulos tiene cada columna, puedes recorrerlas:

```python
for columna in ventas.columns:
    nulos = ventas.filter(F.col(columna).isNull()).count()
    print(f"{columna}: {nulos} nulos")
```

Este pequeño bloque te da una radiografía completa de la calidad de tu tabla. Es el primer paso de cualquier análisis serio.

---

## fillna() — Reemplazar nulos con un valor fijo

`fillna()` reemplaza todos los nulos de una columna (o varias) con un valor que tú elijas:

```python
# Reemplazar nulos en region con "Desconocida"
ventas_limpias = ventas.fillna("Desconocida", subset=["region"])
```

El parámetro `subset` indica en qué columnas aplicar el reemplazo. Si no lo pasas, Spark intenta aplicarlo en todas las columnas compatibles con el tipo del valor.

### Reemplazar varios valores en varias columnas

Para casos más complejos, puedes pasar un diccionario donde cada clave es una columna y cada valor es lo que quieres usar para reemplazar:

```python
ventas_limpias = ventas.fillna({
    "region": "Desconocida",
    "monto": 0,
    "cantidad": 0
})
```

Esto reemplaza nulos en `region` con `"Desconocida"`, nulos en `monto` con `0`, y nulos en `cantidad` con `0`. Todo en una sola operación.

> ⚠️ **Cuidado con reemplazar montos por cero.** A veces es lo correcto, pero a veces oculta el problema. Si una venta tiene `monto` nulo, ¿realmente fue $0 o es un error de captura? Reemplazar con cero hace que tu suma total esté "bien" superficialmente, pero puede esconder un problema de datos. Piénsalo dos veces antes de hacerlo.

---

## coalesce() — El primer valor no nulo

`F.coalesce()` recibe varias columnas (o expresiones) y devuelve el primer valor que no sea nulo. Es como decir: "si esta columna tiene valor, úsalo; si no, prueba con la siguiente; si no, prueba con la siguiente; y si todas son nulas, devuelve null".

```python
from pyspark.sql import functions as F

resultado = ventas.withColumn(
    "region_final",
    F.coalesce(F.col("region"), F.col("pais"), F.lit("Sin clasificar"))
)
```

En este ejemplo, la columna `region_final` toma el valor de `region` si no es nulo. Si lo es, toma el valor de `pais`. Si ese también es nulo, usa el literal `"Sin clasificar"`.

### ¿Cuándo usar coalesce()?

`coalesce()` brilla cuando tienes varias columnas que representan información similar y quieres usar la "mejor disponible":

```python
# Usar el email principal si existe, si no el secundario, si no el corporativo
clientes.withColumn(
    "email_contacto",
    F.coalesce(F.col("email_principal"), F.col("email_secundario"), F.col("email_corporativo"))
)
```

```python
# Usar la fecha de cierre si existe, si no la fecha de creación
ordenes.withColumn(
    "fecha_relevante",
    F.coalesce(F.col("fecha_cierre"), F.col("fecha_creacion"))
)
```

Es el reemplazo elegante de cadenas largas de `when()` cuando solo quieres "el primero que no sea nulo".

---

## fillna() vs coalesce(): cuándo usar cada uno

| Usa `fillna()` cuando... | Usa `coalesce()` cuando... |
|---|---|
| Quieres reemplazar nulos con un valor fijo | Quieres usar el primer valor no nulo de varias opciones |
| Es una operación de "limpieza" | Es una operación de "fallback" |
| Aplicas el mismo valor a muchas filas | El valor de reemplazo viene de otra columna |

```python
# fillna: reemplaza todos los nulos con un literal
ventas.fillna(0, subset=["monto"])

# coalesce: usa otra columna como respaldo
ventas.withColumn("monto_final", F.coalesce(F.col("monto"), F.col("monto_estimado")))
```

---

## dropna() — Eliminar filas con nulos

A veces no quieres reemplazar los nulos: simplemente quieres eliminar las filas que los contienen. Para eso usas `dropna()`:

```python
# Eliminar filas con CUALQUIER nulo
ventas_completas = ventas.dropna()
```

```python
# Eliminar filas donde 'monto' sea nulo
ventas_con_monto = ventas.dropna(subset=["monto"])
```

```python
# Eliminar filas donde 'monto' Y 'cantidad' sean nulos
ventas_validas = ventas.dropna(how="all", subset=["monto", "cantidad"])
```

El parámetro `how="all"` significa "elimina solo si TODAS las columnas en subset son nulas". Por defecto es `how="any"`, que elimina si CUALQUIERA es nula.

> ⚠️ **Última opción.** Eliminar filas pierde información. Hazlo solo cuando los nulos hacen que esa fila no sirva para tu análisis. Y siempre cuenta cuántas filas perdiste:

```python
antes = ventas.count()
ventas_limpias = ventas.dropna(subset=["monto"])
despues = ventas_limpias.count()
print(f"Eliminadas {antes - despues} filas con monto nulo")
```

---

## Caso real: limpiar una tabla antes de analizar

Este es el patrón completo que vas a usar al inicio de muchos análisis:

```python
from pyspark.sql import functions as F

# 1. Cargar
ventas = spark.table("ventas")

# 2. Diagnóstico
print(f"Total filas: {ventas.count():,}")
for col in ["region", "monto", "cantidad", "pais"]:
    nulos = ventas.filter(F.col(col).isNull()).count()
    print(f"  {col}: {nulos} nulos")

# 3. Limpieza
ventas_limpias = (
    ventas
    .fillna("Desconocida", subset=["region", "pais"])
    .dropna(subset=["monto"])  # eliminar las que NO tengan monto
    .fillna(0, subset=["cantidad"])  # cantidad nula = 0
)

# 4. Verificación
print(f"\nDespués de limpieza: {ventas_limpias.count():,} filas")
```

Diagnóstico → limpieza → verificación. Siempre los tres pasos. Y siempre documenta qué decisión tomaste y por qué.

---

## 🎯 Tareas

**Tarea 1:** Cuenta cuántas filas tienen `region` nula en la tabla `ventas`.

<details>
<summary>Ver solución</summary>

```python
from pyspark.sql import functions as F

ventas = spark.table("ventas")
nulos = ventas.filter(F.col("region").isNull()).count()
print(f"Filas con region nula: {nulos}")
```

</details>

**Tarea 2:** Reemplaza los valores nulos de `region` con `"Sin asignar"` y los de `cantidad` con `0`.

<details>
<summary>Ver solución</summary>

```python
ventas_limpias = ventas.fillna({
    "region": "Sin asignar",
    "cantidad": 0
})
ventas_limpias.show()
```

</details>

**Tarea 3:** Crea una columna `monto_final` que use `monto` si no es nulo, y `0` en su lugar. Hazlo con `coalesce()`.

<details>
<summary>Ver solución</summary>

```python
ventas.withColumn(
    "monto_final",
    F.coalesce(F.col("monto"), F.lit(0))
).show()
```

</details>

---

*Universidad Nexus — Curso de Python y Spark*
