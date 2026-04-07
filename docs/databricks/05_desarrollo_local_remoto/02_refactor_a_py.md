---
sidebar_position: 3
title: Refactorizar Notebooks a Archivos .py
---

# Refactorizar Notebooks a Archivos .py

Llegaste al punto donde tu notebook de exploración ya hizo su trabajo: encontraste qué quieres calcular, validaste el resultado, y ahora necesitas convertirlo en algo que merezca vivir en producción. La pregunta es: **¿lo dejas como notebook o lo conviertes en archivo `.py`?**

La respuesta corta es: depende. Esta lección te ayuda a tomar esa decisión y a hacer la conversión cuando corresponde.

---

## Notebooks vs archivos .py: cuándo usar qué

Antes de refactorizar nada, conviene tener claro cuándo cada formato es la mejor opción.

### Mantén el formato notebook cuando:
- El análisis es exploratorio y puede cambiar pronto
- Vas a compartirlo con stakeholders no técnicos que necesitan ver gráficos
- El resultado principal es visual (tablas, charts) y se beneficia de `display()`
- El documento es más una narrativa que un proceso reutilizable
- Contiene celdas de markdown extensas explicando el análisis

### Convierte a archivo `.py` cuando:
- El código se va a ejecutar muchas veces sin cambios
- Vas a programarlo como job
- Contiene funciones que quieres reutilizar desde otros lugares
- Es lógica pura (transformaciones, cálculos) sin elementos visuales
- Vas a versionarlo con Git y necesitas diffs limpios
- El equipo va a colaborar editándolo

> 💡 **No es obligatorio elegir uno u otro.** Muchos proyectos en CBC tienen ambos: notebooks para análisis y reportes (`reportes/ventas_mensuales.ipynb`), y archivos `.py` con funciones compartidas (`lib/transformaciones.py`).

---

## El formato híbrido: archivo .py con celdas

Existe una opción intermedia muy útil: archivos `.py` que se comportan como notebooks. Se logran agregando comentarios especiales que Databricks reconoce.

### Estructura básica

```python
# Databricks notebook source

# COMMAND ----------

# MAGIC %md
# MAGIC # Análisis de Ventas Mensuales
# MAGIC
# MAGIC Este notebook calcula las métricas mensuales por región.

# COMMAND ----------

from pyspark.sql import functions as F

spark.sql("USE CATALOG cbc_prod")
spark.sql("USE SCHEMA ventas")

# COMMAND ----------

# MAGIC %md
# MAGIC ## Cargar datos

# COMMAND ----------

ventas = spark.table("transacciones")
print(f"Total de filas: {ventas.count():,}")

# COMMAND ----------

# MAGIC %md
# MAGIC ## Análisis

# COMMAND ----------

resultado = (
    ventas
    .groupBy("region")
    .agg(F.sum("monto").alias("total"))
    .orderBy(F.col("total").desc())
)

display(resultado)
```

Las dos cosas mágicas son:

1. **`# Databricks notebook source`** al inicio del archivo. Le dice a Databricks "esto es un notebook".
2. **`# COMMAND ----------`** entre cada celda. Define dónde empieza una celda nueva.
3. **`# MAGIC %md`** al inicio de líneas en una celda de markdown. Permite tener celdas de markdown dentro del archivo `.py`.

### ¿Qué ganas con este formato?

- **Editas en VSCode** con todas las ventajas: autocompletado, búsqueda, refactoring
- **Lo abres en Databricks como notebook** y se ve con celdas, igual que un `.ipynb`
- **Funciona con Git** porque es texto plano (los `.ipynb` son JSON, terribles para diffs)
- **Funciona con linters y formatters** de Python normales

> 💡 **Mi recomendación:** para la mayoría del trabajo en CBC, este formato es ideal. Te da lo mejor de los dos mundos.

---

## El proceso de refactorización paso a paso

Vamos a ver cómo convertir un notebook de exploración caótico en un archivo `.py` productivo. Imaginemos que tu notebook original se ve así:

### Antes: notebook caótico

```python
# Celda 1
import pyspark.sql.functions as F
df = spark.table("ventas")
df.show(5)

# Celda 2
df2 = df.filter(df.region == "Norte")
df2.count()

# Celda 3
# probando otra cosa
df3 = df.filter(df.pais == "Guatemala")
df3.show()

# Celda 4
from datetime import datetime
df4 = df.filter(F.year("fecha") == 2024)
df4.show()

# Celda 5
result = df4.groupBy("region").sum("monto")
result.show()

# Celda 6
result2 = result.orderBy("sum(monto)", ascending=False)
display(result2)
```

Funciona, pero no es algo que querrías mostrar a tu equipo. Refactorizemoslo.

### Paso 1: Identificar qué se queda y qué se va

Después de leer el notebook, te das cuenta de que solo te interesa el análisis de ventas de 2024 por región. Las celdas 2 y 3 eran exploración que ya no necesitas.

### Paso 2: Crear el archivo .py con estructura

Crea un archivo nuevo `analisis_ventas_2024_por_region.py`:

```python
# Databricks notebook source
# MAGIC %md
# MAGIC # Análisis de Ventas 2024 por Región
# MAGIC
# MAGIC **Autor:** Tu Nombre
# MAGIC **Última actualización:** 2024-04-06
# MAGIC
# MAGIC ## Descripción
# MAGIC Calcula el total de ventas por región durante 2024 y las
# MAGIC ordena de mayor a menor.

# COMMAND ----------

# MAGIC %md
# MAGIC ## 1. Configuración

# COMMAND ----------

from pyspark.sql import functions as F

spark.sql("USE CATALOG cbc_prod")
spark.sql("USE SCHEMA ventas")

# COMMAND ----------

# MAGIC %md
# MAGIC ## 2. Carga y validación de datos

# COMMAND ----------

ventas = spark.table("transacciones")

total_filas = ventas.count()
print(f"Total de filas en transacciones: {total_filas:,}")

if total_filas == 0:
    raise ValueError("La tabla transacciones está vacía. Detener ejecución.")

# COMMAND ----------

# MAGIC %md
# MAGIC ## 3. Filtrado al año 2024

# COMMAND ----------

ventas_2024 = ventas.filter(F.year("fecha") == 2024)
print(f"Ventas en 2024: {ventas_2024.count():,}")

# COMMAND ----------

# MAGIC %md
# MAGIC ## 4. Agregación por región

# COMMAND ----------

ventas_por_region = (
    ventas_2024
    .groupBy("region")
    .agg(
        F.sum("monto").alias("total_ventas"),
        F.count("*").alias("num_transacciones")
    )
    .orderBy(F.col("total_ventas").desc())
)

display(ventas_por_region)

# COMMAND ----------

# MAGIC %md
# MAGIC ## 5. Notas
# MAGIC
# MAGIC - Este notebook se ejecuta mensualmente como parte del job `ventas_mensual_v2`
# MAGIC - El resultado alimenta el dashboard de Power BI "Ventas por Región"
```

### Paso 3: Verificar que sigue funcionando

Sincroniza el archivo a Databricks y ejecútalo como notebook. Verifica que da el mismo resultado que el original.

### Paso 4: Mejorar nombres y agregar comentarios

Lee el archivo de nuevo. ¿Hay nombres que se podrían mejorar? ¿Decisiones que merecen un comentario? Por ejemplo:

```python
# Filtramos al año 2024 porque el año anterior tuvo
# datos incompletos por la migración de sistema en agosto
ventas_2024 = ventas.filter(F.year("fecha") == 2024)
```

Comentarios como ese son oro para tu yo del futuro o para quien herede el código.

---

## Extraer funciones reutilizables

Si en tu notebook tienes lógica que podría reutilizarse en otros análisis, sácala a un archivo separado.

### Antes (todo en un solo archivo)

```python
# analisis_ventas_2024.py

# ... mucho código ...

ventas = ventas.filter(F.col("monto") > 0)
ventas = ventas.fillna({"region": "Sin asignar"})
ventas = ventas.dropna(subset=["fecha"])

# ... más código ...
```

### Después (función en archivo separado)

Crea `lib/utils_ventas.py`:

```python
# lib/utils_ventas.py

from pyspark.sql import DataFrame
from pyspark.sql import functions as F


def limpiar_ventas(df: DataFrame) -> DataFrame:
    """
    Aplica las limpiezas estándar a un DataFrame de ventas:
    - Elimina ventas con monto 0 o negativo
    - Asigna 'Sin asignar' a regiones nulas
    - Elimina filas sin fecha (no se pueden analizar temporalmente)
    """
    return (
        df
        .filter(F.col("monto") > 0)
        .fillna({"region": "Sin asignar"})
        .dropna(subset=["fecha"])
    )
```

Y en tu notebook principal:

```python
# analisis_ventas_2024.py

import sys
sys.path.append("/Workspace/Users/tu_email/lib")

from utils_ventas import limpiar_ventas

# ... código ...

ventas = spark.table("transacciones")
ventas = limpiar_ventas(ventas)

# ... resto del análisis ...
```

Ahora si mañana descubres que necesitas otra limpieza más, la agregas en `utils_ventas.py` una sola vez y todos los notebooks que la usan la heredan automáticamente.

> 💡 **Esta es la diferencia entre código copiado y código compartido.** Al inicio toma un poco más de tiempo extraer una función, pero a las semanas ahorras horas de mantenimiento y evitas inconsistencias.

---

## Cuándo NO refactorizar

Refactorizar tiene sus costos. Hay situaciones donde no vale la pena:

### 1. El notebook es desechable
Si es un análisis puntual que vas a usar una sola vez y luego olvidar, no inviertas tiempo en estructura.

### 2. Solo hay UN caso de uso
Si una función la vas a usar en un solo lugar, no la extraigas a un archivo separado. Mantenla inline para facilitar la lectura.

### 3. El equipo no tiene madurez para mantener archivos
Si tu equipo todavía no usa Git ni tiene procesos para revisar código compartido, los archivos `.py` reutilizables se vuelven una fuente de problemas. Espera a tener esa base.

### 4. Estás demostrando algo a un stakeholder
Para presentaciones o demos, el formato notebook web suele ser más apropiado por la visualización inmediata.

---

## Checklist de refactorización

Antes de considerar un archivo `.py` listo para producción, revisa esto:

- [ ] Tiene encabezado con título, autor, descripción
- [ ] Imports están todos al inicio, organizados
- [ ] Configuración de catálogo/schema está clara
- [ ] Hay validaciones iniciales para fallar temprano si algo está mal
- [ ] Nombres de variables son descriptivos (no `df`, `df2`, `result`)
- [ ] Hay comentarios donde el código no es obvio
- [ ] Funciones complejas están extraídas a archivos `lib/`
- [ ] Se ejecuta de inicio a fin sin errores
- [ ] Da el mismo resultado que el notebook original
- [ ] Tiene celda final con notas o referencias a documentación

Cuando puedes marcar todos estos items, el archivo está listo.

---

## 🎯 Tareas

**Tarea 1:** Toma uno de tus notebooks del módulo anterior. Conviértelo a formato `.py` con el header `# Databricks notebook source` y `# COMMAND ----------` entre celdas.

**Tarea 2:** Aplícale la estructura completa: encabezado, validaciones, nombres claros. Sincronízalo a Databricks y verifica que sigue funcionando.

**Tarea 3:** Identifica una función que podrías extraer (algo que harías más de una vez). Créala en un archivo `lib/utils.py` separado.

**Tarea 4:** Importa esa función desde tu notebook principal. Verifica que el resultado es idéntico.

**Tarea 5:** Pasa el checklist de refactorización por tu nuevo archivo. ¿Hay items que no cumple? Resuélvelos.

---

*Universidad Nexus — Curso de Databricks y VSCode*
