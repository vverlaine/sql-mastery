---
sidebar_position: 2
title: Estructura de un Notebook Productivo
---

# Estructura de un Notebook Productivo

Un notebook de exploración y un notebook productivo se ven diferentes. El de exploración puede ser caótico: celdas en cualquier orden, código comentado, pruebas aquí y allá. Está bien — es como tu cuaderno de borradores.

Un notebook productivo es lo opuesto: tiene una estructura consistente, está documentado, y cualquier persona del equipo puede abrirlo y entender qué hace. En esta lección vas a aprender la estructura estándar que usa un analista profesional.

---

## La estructura recomendada

Casi todos los notebooks productivos siguen este orden:

```
1. Encabezado: título y descripción
2. Imports y configuración
3. Parámetros (widgets)
4. Carga de datos
5. Validación inicial
6. Transformaciones
7. Análisis / agregaciones
8. Resultado final
9. Cierre / observaciones
```

Vamos a desglosar cada sección con ejemplos.

---

## 1. Encabezado

La primera celda siempre es markdown con título, descripción y metadata. Sirve para que cualquiera que abra el notebook entienda en 10 segundos qué hace.

```markdown
%md
# Análisis de Ventas Mensuales por Región

**Autor:** Tu Nombre
**Última actualización:** 2024-04-06
**Frecuencia de ejecución:** Mensual (primer día del mes)

## Descripción
Calcula el total de ventas, ticket promedio y número de transacciones
por región y país, para el mes anterior. Genera un reporte que se
publica al canal de Slack del equipo de comercial.

## Inputs
- Tabla: `cbc_prod.ventas.transacciones`
- Parámetro: `mes_objetivo` (formato YYYY-MM)

## Output
- Tabla: `cbc_prod.analytics.ventas_mensuales_por_region`
```

> 💡 **Por qué importa:** Tu yo del futuro o un colega va a abrir este notebook en 6 meses cuando algo falle. El encabezado le dice todo lo que necesita saber sin tener que leer el código línea por línea.

---

## 2. Imports y configuración

La segunda celda agrupa TODAS las importaciones y configuraciones de Spark. Nunca dispersas imports en medio del notebook.

```python
from pyspark.sql import functions as F
from pyspark.sql.types import IntegerType, StringType, DateType
from datetime import datetime, timedelta

# Configurar catálogo y schema por defecto
spark.sql("USE CATALOG cbc_prod")
spark.sql("USE SCHEMA ventas")
```

> 💡 **Convención:** Si necesitas importar algo a mitad del notebook, mueve esa importación al bloque inicial. Mantener todos los imports juntos hace el código más fácil de mantener.

---

## 3. Parámetros (widgets)

Los **widgets** son la forma de hacer que tu notebook reciba parámetros desde fuera, sin tener que editar el código. Por ahora, solo nombrémoslos:

```python
dbutils.widgets.text("mes_objetivo", "2024-03", "Mes objetivo (YYYY-MM)")
mes_objetivo = dbutils.widgets.get("mes_objetivo")
```

Vamos a ver widgets en detalle en la siguiente lección. Por ahora basta con saber que es la sección donde defines qué inputs necesita tu notebook para correr.

---

## 4. Carga de datos

Carga las tablas que vas a usar, y solo esas. Ponles nombres claros.

```python
transacciones = spark.table("transacciones")
productos = spark.table("productos")
clientes = spark.table("clientes")
```

> 💡 **Buena práctica:** Si una tabla viene de otro catálogo, escribe el path completo. La consistencia entre nombres de variables y nombres de tablas hace el código más fácil de seguir.

---

## 5. Validación inicial

Antes de transformar nada, valida que los datos están como esperas. Si algo está mal, mejor fallar temprano con un mensaje claro:

```python
total_filas = transacciones.count()
print(f"Filas en transacciones: {total_filas:,}")

if total_filas == 0:
    raise ValueError("La tabla transacciones está vacía. Detener ejecución.")

# Verificar que el mes objetivo tiene datos
filas_del_mes = (
    transacciones
    .filter(F.date_format("fecha", "yyyy-MM") == mes_objetivo)
    .count()
)
print(f"Filas en {mes_objetivo}: {filas_del_mes:,}")

if filas_del_mes == 0:
    raise ValueError(f"No hay datos para el mes {mes_objetivo}")
```

> 💡 **Filosofía "fail fast":** Es mejor que tu notebook falle al inicio con un mensaje claro que continuar y dar resultados incorrectos. Validar al inicio toma 10 líneas y te ahorra horas de debugging después.

---

## 6. Transformaciones

Aquí va el grueso del trabajo: filtrar, transformar columnas, hacer joins, limpiar nulos. Mantén cada transformación enfocada en una cosa, y nombra los DataFrames intermedios de forma descriptiva:

```python
# Filtrar al mes objetivo
ventas_mes = transacciones.filter(
    F.date_format("fecha", "yyyy-MM") == mes_objetivo
)

# Enriquecer con info de producto
ventas_enriquecidas = (
    ventas_mes
    .join(productos, ventas_mes.producto_id == productos.id, "left")
    .select(
        ventas_mes.id,
        ventas_mes.region,
        ventas_mes.pais,
        ventas_mes.monto,
        ventas_mes.cantidad,
        productos.categoria
    )
)
```

---

## 7. Análisis / Agregaciones

La sección donde calculas las métricas finales:

```python
metricas_por_region = (
    ventas_enriquecidas
    .groupBy("pais", "region")
    .agg(
        F.sum("monto").alias("total_ventas"),
        F.avg("monto").alias("ticket_promedio"),
        F.count("*").alias("num_transacciones"),
        F.countDistinct("id").alias("ventas_unicas")
    )
    .orderBy(F.col("total_ventas").desc())
)

display(metricas_por_region)
```

---

## 8. Resultado final

Si tu notebook necesita guardar su resultado en otra tabla o exportarlo, hazlo aquí. Una sola operación de escritura, claramente identificada:

```python
(
    metricas_por_region
    .write
    .mode("overwrite")
    .saveAsTable("cbc_prod.analytics.ventas_mensuales_por_region")
)

print(f"✓ Tabla guardada exitosamente para mes {mes_objetivo}")
```

> ⚠️ **Cuidado con `mode("overwrite")`:** Sobreescribe la tabla destino completa. Asegúrate de que es lo que quieres antes de ejecutar. Si solo quieres agregar filas, usa `mode("append")`.

---

## 9. Cierre / observaciones

La última celda es markdown con notas sobre la ejecución, dependencias o cosas a considerar:

```markdown
%md
## Notas

- Esta tabla es leída por el dashboard de Power BI "Ventas Mensuales"
- Si cambias las columnas, avisa al equipo de BI antes
- El job está programado en Workflows como `ventas_mensuales_job`
- En caso de fallo, revisar primero la disponibilidad de la tabla `transacciones`
```

---

## Comparación visual: notebook caótico vs estructurado

### Notebook caótico (qué evitar)

```
Celda 1: import pyspark.sql.functions as F
Celda 2: df = spark.sql("SELECT * FROM ventas")
Celda 3: df.show()
Celda 4: from datetime import datetime
Celda 5: df2 = df.filter(...)
Celda 6: # prueba
Celda 7: df.count()
Celda 8: df3 = df2.groupBy(...)
Celda 9: import pandas as pd
Celda 10: display(df3)
```

Problemas: imports dispersos, sin contexto, sin validación, nombres genéricos (`df`, `df2`, `df3`), no documentado.

### Notebook estructurado (qué buscar)

```
Celda 1: [markdown] Título, autor, descripción, inputs, output
Celda 2: [python] Todos los imports y configuración de catálogo
Celda 3: [python] Definición de widgets
Celda 4: [python] Carga de tablas con nombres claros
Celda 5: [python] Validaciones iniciales con mensajes
Celda 6: [python] Filtrado y transformación
Celda 7: [python] Joins y enriquecimiento
Celda 8: [python] Agregaciones finales
Celda 9: [python] Guardar resultado
Celda 10: [markdown] Notas finales
```

La diferencia entre los dos es la diferencia entre un script desechable y un activo del equipo.

---

## Reglas de oro para notebooks productivos

### 1. Una celda, una idea
Si una celda hace 5 cosas distintas, divídela en 5 celdas. Es más fácil debuggear, leer y modificar.

### 2. Nombres descriptivos
`ventas_norte_2024` es mejor que `df1`. Tu yo del futuro te lo agradece.

### 3. Imprime contadores en pasos clave
`print(f"Filas después del filtro: {df.count():,}")` después de operaciones críticas. Te permite confirmar que el flujo va bien.

### 4. Documenta decisiones, no obviedades
No comentes `# sumar la columna monto`. Comenta `# Excluimos las ventas con monto = 0 porque son ajustes contables, no ventas reales`.

### 5. Si lo vas a usar más de una vez, parametrízalo
Si copiarías y pegarías el mismo notebook para distintos meses solo cambiando un valor, ese valor debe ser un widget.

---

## 🎯 Tareas

**Tarea 1:** Abre uno de tus notebooks del módulo anterior (cualquiera). Evalúa honestamente: ¿tiene encabezado? ¿tiene validaciones iniciales? ¿los nombres son claros? Anota qué le falta para ser un "notebook productivo".

**Tarea 2:** Crea un notebook nuevo siguiendo la estructura completa que aprendiste, con un análisis simple: total de ventas por país. Pon todas las secciones aunque algunas tengan poco contenido — es para practicar la estructura.

**Tarea 3:** Comparte tu notebook estructurado con un colega y pídele feedback: ¿entiende qué hace solo leyendo el encabezado?

---

*Universidad Nexus — Curso de Databricks y VSCode*
