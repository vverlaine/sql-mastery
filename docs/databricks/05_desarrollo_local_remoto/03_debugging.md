---
sidebar_position: 4
title: Debugging Avanzado
---

# Debugging Avanzado

Hasta ahora has visto debugging básico: poner un breakpoint y ver variables. Pero los problemas reales en análisis de datos rara vez son tan simples. Una columna que no debería ser nula lo es. Un conteo que no cuadra con lo que el negocio espera. Un join que duplica filas misteriosamente.

Esta lección te da el toolkit completo para investigar esos problemas con precisión, en lugar de adivinar.

---

## Los tres tipos de bugs en análisis de datos

Antes de las técnicas, conviene clasificar lo que estás buscando. La estrategia cambia según el tipo:

### 1. Bugs de sintaxis o errores claros
El código falla con un mensaje de error. Spark te dice "column not found" o "type mismatch". Son los más fáciles: el error te apunta al lugar.

### 2. Bugs de lógica
El código corre sin errores, pero el resultado es incorrecto. El total no cuadra. El conteo es el doble de lo esperado. Son los más comunes y los más difíciles de detectar porque "todo funciona".

### 3. Bugs de datos
El código es correcto, pero los datos están mal. Hay nulos donde no deberían, valores duplicados, fechas en formato inconsistente. El debugging es en realidad investigación de los datos.

> 💡 **Lección importante:** Antes de asumir que tu código está mal, considera que los datos pueden estar mal. En análisis de CBC, los problemas de datos son tan comunes como los problemas de código.

---

## Técnica 1: Breakpoints con Databricks Connect

Ya viste lo básico. Vamos a ver el uso avanzado.

### Breakpoints condicionales

Click derecho sobre un breakpoint → "Edit Breakpoint" → "Expression". Te permite escribir una condición para que el breakpoint solo se active cuando se cumpla.

Ejemplo: estás iterando sobre una lista de regiones y quieres detener el debugger solo cuando llegues a la región problemática:

```python
for region in regiones:
    procesar_region(region)  # ← breakpoint condicional: region == "Norte"
```

El debugger ignora todas las regiones excepto "Norte". Te ahorras parar 50 veces.

### Breakpoints en excepciones

En el panel de "Run and Debug", hay una sección "Breakpoints" con la opción "Raised Exceptions" o "Uncaught Exceptions". Si la activas, el debugger se detiene automáticamente cada vez que se lanza una excepción, sin que tengas que poner breakpoints manualmente.

Útil cuando sabes que algo lanza un error pero no sabes en qué línea exactamente.

### Inspeccionar DataFrames durante el debug

Cuando el debugger está pausado en un breakpoint, puedes ver cualquier variable en el panel "Variables". Pero los DataFrames muestran solo metadata, no las filas.

Para ver las filas, abre el "Debug Console" (panel inferior) y escribe expresiones Python:

```python
df.show(20)
df.count()
df.printSchema()
df.filter(F.col("region") == "Norte").show()
```

Cualquier operación que harías normalmente, puedes ejecutarla ahí mismo sin tener que detener el debug, modificar el código, y volver a empezar.

> 💡 **Esto es lo que más vas a usar.** El Debug Console convierte el momento de pausa en una sesión interactiva con todas tus variables vivas.

---

## Técnica 2: Debugging por bisección

Cuando un análisis grande da un resultado incorrecto y no tienes idea de en qué paso se rompió, la técnica más eficiente es **bisección**: divide el código en mitades y verifica cuál mitad tiene el problema.

### Cómo funciona

Imagina un análisis con 8 transformaciones encadenadas que da un resultado raro al final. En lugar de revisar las 8, haces esto:

1. Inserta un `print(f"Filas en paso 4: {df_paso_4.count():,}")` justo a la mitad
2. Ejecuta. ¿El conteo en el paso 4 es lo que esperas?
   - **Sí**: el problema está en los pasos 5-8. Repite la bisección con esos.
   - **No**: el problema está en los pasos 1-4. Repite la bisección con esos.
3. Sigue dividiendo hasta encontrar el paso exacto donde algo se rompe.

En 3-4 iteraciones encuentras el problema en código que tiene 16 pasos. Sin bisección, tendrías que revisar uno por uno.

### Validaciones intermedias como herramienta

Una versión más estructurada de la bisección es agregar validaciones intermedias en puntos clave:

```python
# Después de cargar
assert ventas.count() > 0, "La tabla está vacía"

ventas_filtradas = ventas.filter(F.col("monto") > 0)

# Después del filtro
filas_filtradas = ventas_filtradas.count()
print(f"Filas después del filtro de monto > 0: {filas_filtradas:,}")
assert filas_filtradas > 0, "El filtro eliminó todas las filas"

ventas_join = ventas_filtradas.join(productos, ...)

# Después del join
filas_join = ventas_join.count()
print(f"Filas después del join: {filas_join:,}")
assert filas_join >= filas_filtradas * 0.95, \
    "El join perdió más del 5% de filas — sospechoso"
```

Estos `assert` te avisan inmediatamente cuando algo se sale de lo esperado, y los `print` te dejan rastros de cómo evolucionan los datos a lo largo del pipeline.

---

## Técnica 3: Inspección estadística

Cuando el resultado final está mal pero no sabes por qué, antes de meterte al código, mira los datos.

### Distribución de valores

```python
# ¿Hay nulos donde no debería?
ventas.filter(F.col("monto").isNull()).count()

# ¿Hay valores extremos?
ventas.agg(
    F.min("monto").alias("min"),
    F.max("monto").alias("max"),
    F.avg("monto").alias("avg"),
    F.stddev("monto").alias("std")
).show()

# ¿Cuántos valores únicos hay?
ventas.select("region").distinct().count()
```

Estas tres consultas te dan un panorama rápido de la salud de los datos. Si descubres que hay 50 valores distintos en una columna que debería tener 5, ahí está tu pista.

### Detectar duplicados inesperados

Una de las causas más comunes de resultados raros: filas duplicadas que no esperabas.

```python
# ¿Cuántas filas hay vs cuántas filas únicas?
total = ventas.count()
unicas = ventas.distinct().count()
print(f"Total: {total:,}")
print(f"Únicas: {unicas:,}")
print(f"Duplicados: {total - unicas:,}")

# ¿Qué IDs aparecen más de una vez?
ventas.groupBy("id").count().filter(F.col("count") > 1).show()
```

Si después de un `join` el conteo se duplica, casi seguro tu join está produciendo filas extra porque la tabla derecha tiene varios matches por cada fila izquierda.

### Comparar contra una fuente de verdad

Si tienes una métrica que ya sabes que vale "X" según otro reporte, calcula esa métrica con tu código y compárala. Si no coincide, sabes que algo está mal en tu código (o el otro reporte estaba mal todo este tiempo, lo cual también es información valiosa).

---

## Técnica 4: Logging estratégico

Para procesos largos o jobs programados, no puedes estar parado mirando el debugger. Necesitas que el código se documente a sí mismo durante la ejecución.

### Print estructurado

```python
print(f"[INFO] Iniciando procesamiento de ventas para {mes_objetivo}")
print(f"[INFO] Filas cargadas: {ventas.count():,}")

ventas_validas = ventas.filter(F.col("monto") > 0)
print(f"[INFO] Filas válidas (monto > 0): {ventas_validas.count():,}")

# ... más pasos ...

print(f"[INFO] Procesamiento completado exitosamente")
```

Después, cuando el job falla a las 3 AM, abres los logs y ves exactamente hasta qué paso llegó antes de morir. Sin esto, estás adivinando.

### Usar el módulo `logging` de Python

Para procesos más serios, en lugar de `print` usa el módulo `logging`:

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

logger.info(f"Iniciando procesamiento de {mes_objetivo}")
logger.info(f"Filas cargadas: {ventas.count():,}")
```

`logging` tiene niveles (DEBUG, INFO, WARNING, ERROR, CRITICAL) que te permiten filtrar lo que quieres ver. En desarrollo activas DEBUG; en producción solo INFO y arriba.

---

## Técnica 5: Aislar el problema con datos pequeños

Cuando trabajas con tablas de millones de filas, cada iteración del debugging es lenta. Una técnica útil es: **crear una versión pequeña del problema** que se ejecuta en segundos.

### Filtrar a un subconjunto representativo

```python
# En lugar de trabajar con 50 millones de filas
ventas = spark.table("transacciones")

# Trabajas con un subconjunto que reproduce el problema
ventas_test = ventas.filter(
    (F.col("region") == "Norte") &
    (F.col("fecha") >= "2024-03-01") &
    (F.col("fecha") <= "2024-03-07")
)

# Iteras rápido sobre estas pocas filas
ventas_test.show(50)
```

### Crear DataFrames de prueba con datos sintéticos

A veces es más rápido construir un DataFrame pequeño con datos inventados que reproduzcan exactamente el caso problemático:

```python
data = [
    ("Norte", 1500, "2024-03-15"),
    ("Norte", 2300, None),  # caso con fecha nula
    ("Sur", 0, "2024-03-15"),  # caso con monto cero
    ("Centro", 500, "2024-03-15"),
]

df_test = spark.createDataFrame(
    data,
    ["region", "monto", "fecha"]
)
```

Con este DataFrame pequeño puedes probar tus transformaciones y ver inmediatamente si manejan correctamente los casos problemáticos.

---

## Cómo pedir ayuda cuando estás atascado

Después de todas las técnicas anteriores, hay momentos en que sigues atascado. Pedir ayuda es válido — pero hay forma de hacerlo bien para no desperdiciar el tiempo de tu equipo.

### Información que SIEMPRE debes incluir

1. **Qué intentabas hacer** (1 frase)
2. **Qué esperabas que pasara**
3. **Qué pasó en realidad** (mensaje de error completo, o resultado inesperado)
4. **Qué ya intentaste** para resolverlo
5. **Una versión mínima del código** que reproduce el problema

### Ejemplo de mensaje bueno

> "Estoy haciendo un join entre `transacciones` y `clientes`. Espero obtener 1.2M filas pero estoy obteniendo 2.4M (el doble). Ya verifiqué que `transacciones` tiene 1.2M y que el `cliente_id` no se repite en `clientes`. ¿Alguien tiene idea de qué podría estar pasando?
>
> ```python
> resultado = transacciones.join(
>     clientes,
>     transacciones.cliente_id == clientes.id,
>     'inner'
> )
> ```"

### Ejemplo de mensaje malo

> "Mi join no funciona, ¿alguien puede ayudarme?"

La diferencia es enorme: el primero permite a alguien diagnosticar el problema sin necesidad de hacerte 5 preguntas más. El segundo requiere una conversación completa solo para entender qué pasa.

---

## 🎯 Tareas

**Tarea 1:** Toma un análisis tuyo que ya esté funcionando. Agrégale 3-4 validaciones intermedias con `print` y `assert` en puntos clave. Verifica que sigue funcionando.

**Tarea 2:** Practica el Debug Console: pon un breakpoint en medio de un análisis. Cuando se pause, escribe expresiones en el Debug Console para inspeccionar el DataFrame: `count()`, `show()`, filtros.

**Tarea 3:** Crea un DataFrame pequeño con datos sintéticos que incluya casos problemáticos (nulos, ceros, fechas raras). Ejecuta tus transformaciones sobre él y verifica cómo se comportan.

**Tarea 4:** Intencionalmente introduce un bug en uno de tus análisis (ej: filtro al revés, columna mal escrita). Practica encontrarlo usando bisección con prints intermedios.

---

*Universidad Nexus — Curso de Databricks y VSCode*
