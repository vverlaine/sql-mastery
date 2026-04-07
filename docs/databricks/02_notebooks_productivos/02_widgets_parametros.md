---
sidebar_position: 3
title: Widgets y Parámetros
---

# Widgets y Parámetros

Imagínate que tienes un notebook que calcula las ventas por región, pero filtrado a un mes específico. Cada vez que lo necesitas para un mes diferente, ¿editas el código y cambias `"2024-03"` por `"2024-04"`? Eso funciona, pero es frágil: te puedes equivocar al editar, no queda registrado qué mes ejecutaste, y otras personas tienen que entender tu código para usarlo.

Los **widgets** resuelven esto. Son controles que aparecen en la parte superior del notebook (un input de texto, un dropdown, un calendario) y permiten pasar parámetros sin tocar el código.

---

## ¿Para qué sirven los widgets?

Los widgets convierten un notebook en una pequeña aplicación interactiva. Su valor real está en tres escenarios:

1. **Notebooks reutilizables**: el mismo notebook ejecutado con diferentes parámetros (mes, región, categoría)
2. **Notebooks programados (jobs)**: el job pasa parámetros al notebook automáticamente
3. **Notebooks compartidos**: otros colegas usan tu notebook sin tener que entender el código

En CBC, prácticamente todos los notebooks productivos usan widgets para sus parámetros principales.

---

## Crear un widget de texto

El más simple. Crea un input donde el usuario escribe un valor:

```python
dbutils.widgets.text(
    "mes_objetivo",        # nombre del widget (interno)
    "2024-03",             # valor por defecto
    "Mes objetivo (YYYY-MM)"  # etiqueta visible
)
```

Después de ejecutar esa celda, en la parte superior del notebook aparece un campo de texto con la etiqueta "Mes objetivo (YYYY-MM)" y el valor `2024-03` precargado.

### Leer el valor del widget

Para usar el valor en tu código:

```python
mes_objetivo = dbutils.widgets.get("mes_objetivo")
print(f"Procesando datos del mes: {mes_objetivo}")
```

`dbutils.widgets.get()` devuelve el valor actual del widget como string. Si el usuario lo cambió en la interfaz, devuelve el nuevo valor; si no, devuelve el default.

---

## Tipos de widgets disponibles

Databricks tiene cuatro tipos de widgets, cada uno con su propio caso de uso:

### 1. Text — entrada libre

```python
dbutils.widgets.text("region", "Norte", "Región")
```

Útil cuando: el valor puede ser cualquier cosa y no quieres limitar opciones.

### 2. Dropdown — lista cerrada de opciones

```python
dbutils.widgets.dropdown(
    "pais",
    "Guatemala",
    ["Guatemala", "Honduras", "Nicaragua"],
    "País"
)
```

Útil cuando: hay un set fijo de opciones válidas y quieres evitar errores de tipeo.

### 3. Combobox — dropdown editable

```python
dbutils.widgets.combobox(
    "categoria",
    "Bebidas",
    ["Bebidas", "Snacks", "Lácteos"],
    "Categoría"
)
```

Útil cuando: hay opciones comunes pero el usuario puede escribir una nueva si quiere.

### 4. Multiselect — múltiples valores a la vez

```python
dbutils.widgets.multiselect(
    "regiones",
    "Norte",
    ["Norte", "Sur", "Centro", "Este", "Oeste"],
    "Regiones a incluir"
)
```

Devuelve los valores seleccionados separados por comas. Para usarlo:

```python
regiones_str = dbutils.widgets.get("regiones")
regiones_lista = regiones_str.split(",")
```

> 💡 **¿Cuál usar?** Empieza con `text` y `dropdown`. Cubren el 90% de los casos. `multiselect` es útil para análisis flexibles donde el usuario quiere comparar varios valores.

---

## Ejemplo completo: notebook parametrizado

Vamos a juntar todo en un notebook completo de análisis mensual de ventas:

```python
# Celda 1: Imports y configuración
from pyspark.sql import functions as F

spark.sql("USE CATALOG cbc_prod")
spark.sql("USE SCHEMA ventas")

# Celda 2: Definir widgets
dbutils.widgets.text("mes_objetivo", "2024-03", "Mes objetivo (YYYY-MM)")
dbutils.widgets.dropdown(
    "pais",
    "Guatemala",
    ["Guatemala", "Honduras", "Nicaragua", "Todos"],
    "País"
)
dbutils.widgets.text("monto_minimo", "1000", "Monto mínimo")

# Celda 3: Leer parámetros
mes_objetivo = dbutils.widgets.get("mes_objetivo")
pais = dbutils.widgets.get("pais")
monto_minimo = float(dbutils.widgets.get("monto_minimo"))

print(f"Parámetros recibidos:")
print(f"  Mes: {mes_objetivo}")
print(f"  País: {pais}")
print(f"  Monto mínimo: {monto_minimo:,}")

# Celda 4: Cargar y filtrar
ventas = spark.table("transacciones")

ventas_filtradas = ventas.filter(
    (F.date_format("fecha", "yyyy-MM") == mes_objetivo) &
    (F.col("monto") >= monto_minimo)
)

if pais != "Todos":
    ventas_filtradas = ventas_filtradas.filter(F.col("pais") == pais)

# Celda 5: Análisis
resultado = (
    ventas_filtradas
    .groupBy("region")
    .agg(
        F.sum("monto").alias("total_ventas"),
        F.count("*").alias("num_transacciones"),
        F.avg("monto").alias("ticket_promedio")
    )
    .orderBy(F.col("total_ventas").desc())
)

display(resultado)
```

Mira lo que conseguiste con esto:

- Cualquier persona puede ejecutar el notebook para distintos meses, países y montos mínimos sin tocar código
- Los parámetros quedan visibles arriba del notebook como "configuración"
- Si lo programas como un job, puedes pasar los parámetros desde el job

---

## Convertir un widget en una celda Python equivalente

Cuando empiezas a usar widgets, te puede confundir la equivalencia entre lo que el widget devuelve y los tipos de Python. Estas son las conversiones más comunes:

```python
# String (default)
mes = dbutils.widgets.get("mes_objetivo")

# Número entero
limite = int(dbutils.widgets.get("limite"))

# Número decimal
monto = float(dbutils.widgets.get("monto_minimo"))

# Booleano (cuidado, viene como string)
incluir_pruebas = dbutils.widgets.get("incluir_pruebas").lower() == "true"

# Lista (cuando es multiselect)
regiones = dbutils.widgets.get("regiones").split(",")

# Fecha
from datetime import datetime
fecha = datetime.strptime(dbutils.widgets.get("fecha"), "%Y-%m-%d")
```

> ⚠️ **Cuidado con los strings vacíos:** Si un widget tiene valor por defecto vacío y el usuario no lo llena, `dbutils.widgets.get()` devuelve `""`, no `None`. Tu código debe manejar este caso si es relevante.

---

## Eliminar widgets

Si renombras o eliminas widgets, los antiguos pueden quedar visibles en la interfaz. Para limpiarlos:

```python
# Eliminar uno específico
dbutils.widgets.remove("nombre_del_widget")

# Eliminar todos los widgets
dbutils.widgets.removeAll()
```

> 💡 **Buen hábito:** Cuando refactorices un notebook, ejecuta `dbutils.widgets.removeAll()` y vuelve a definir solo los widgets que necesites. Mantiene la interfaz limpia.

---

## Buenas prácticas con widgets

### 1. Pon los widgets al inicio del notebook
La sección de widgets debe estar entre los imports y la carga de datos. Cualquier persona que abra el notebook debe ver los parámetros antes que el código.

### 2. Define defaults útiles
El valor por defecto debe ser el caso más común. Si el 80% de las veces se ejecuta para Guatemala, ese debe ser el default.

### 3. Usa nombres claros y etiquetas en español
La etiqueta visible debe ser entendible para alguien que NO programa. "mes_objetivo (YYYY-MM)" es mejor que "param1".

### 4. Valida los valores recibidos
No confíes ciegamente en lo que viene del widget. Valida formato, rango, y maneja errores con mensajes claros:

```python
mes_objetivo = dbutils.widgets.get("mes_objetivo")

# Validar formato
import re
if not re.match(r"^\d{4}-\d{2}$", mes_objetivo):
    raise ValueError(f"Formato inválido: '{mes_objetivo}'. Debe ser YYYY-MM.")
```

### 5. Imprime los parámetros recibidos
Antes de empezar el procesamiento, imprime un resumen de los parámetros. Cuando algo falla, esto es lo primero que vas a querer ver en los logs.

---

## 🎯 Tareas

**Tarea 1:** Crea un notebook nuevo. Define tres widgets: un texto para el mes (default "2024-03"), un dropdown para el país (Guatemala, Honduras, Nicaragua), y un texto para el monto mínimo (default "1000").

**Tarea 2:** Lee los tres valores y conviértelos a sus tipos correctos (string, string, float). Imprímelos.

**Tarea 3:** Carga la tabla de ventas y filtra usando los tres parámetros. Cuenta cuántas filas resultan.

**Tarea 4:** Cambia los valores de los widgets desde la interfaz superior y vuelve a ejecutar el notebook. Verifica que el resultado cambia según los nuevos parámetros.

**Tarea 5:** Agrega validación: si el formato del mes no es `YYYY-MM`, lanza un error claro con `raise ValueError(...)`.

---

*Universidad Nexus — Curso de Databricks y VSCode*
