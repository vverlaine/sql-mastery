---
sidebar_position: 2
title: ¿Qué es Spark y por qué lo usamos?
---

# ¿Qué es Spark y por qué lo usamos?

## El problema que Spark resuelve

Imagina que tienes una tabla de ventas con 500 millones de registros. Cada vez que quieres calcular las ventas totales por región del último año, ¿qué pasa?

- En Excel: imposible. Ni siquiera carga.
- En una base de datos tradicional: tarda horas. Y mientras tanto, bloquea recursos del sistema.
- En Spark: tarda minutos. Y se puede ejecutar en paralelo en muchas máquinas a la vez.

Spark fue creado exactamente para este escenario: procesar grandes volúmenes de datos de forma rápida y distribuida. Y lo hace usando un concepto simple pero poderoso.

---

## La idea central: procesamiento distribuido

Una computadora normal procesa los datos en secuencia: lee un registro, lo procesa, lee el siguiente, lo procesa, y así sucesivamente. Si tienes 500 millones de registros, eso toma mucho tiempo.

Spark divide el trabajo entre **muchas máquinas a la vez**. Cada máquina procesa una parte de los datos en paralelo, y al final combina los resultados. Es como si en lugar de tener un solo cajero atendiendo a 500 millones de clientes, tuvieras 100 cajeros trabajando simultáneamente.

```
Datos: 500 millones de filas
        ↓
Spark divide en bloques
        ↓
Bloque 1 → Máquina 1 → procesa
Bloque 2 → Máquina 2 → procesa
Bloque 3 → Máquina 3 → procesa
   ...        ...        ...
        ↓
Spark combina los resultados
        ↓
Resultado final
```

> 💡 **Lo importante para ti como analista:** No tienes que preocuparte por cómo Spark distribuye el trabajo. Eso lo hace automáticamente. Tú solo escribes el código como si trabajaras con una tabla normal, y Spark se encarga del resto.

---

## ¿Qué es Databricks?

Databricks es la plataforma que CBC usa para correr Spark. Piénsalo como un Excel evolucionado para datos masivos: te da un entorno web donde puedes escribir código, ejecutarlo y ver los resultados, sin tener que instalar nada en tu computadora.

En Databricks vas a trabajar con **notebooks**: documentos interactivos donde mezclas código con resultados y notas. Cada notebook tiene celdas, y en cada celda puedes ejecutar código de forma independiente.

```
┌────────────────────────────────────────┐
│  Mi Notebook de Análisis                │
├────────────────────────────────────────┤
│  Celda 1: [código Python]               │
│  → Resultado: muestra una tabla         │
├────────────────────────────────────────┤
│  Celda 2: [código SQL]                  │
│  → Resultado: muestra un gráfico        │
├────────────────────────────────────────┤
│  Celda 3: [texto explicativo]           │
└────────────────────────────────────────┘
```

Esta forma de trabajar es ideal para análisis: puedes probar una idea, ver el resultado al instante, ajustar y volver a probar. Es muy diferente a escribir un script completo y ejecutarlo de golpe.

---

## DataFrames: tu nuevo mejor amigo

En SQL trabajabas con **tablas**. En Spark vas a trabajar con **DataFrames**.

Un DataFrame es básicamente una tabla, pero con superpoderes:

- Tiene filas y columnas como una tabla.
- Cada columna tiene un tipo de dato definido.
- Puedes consultarla como en SQL.
- Pero también puedes manipularla con código Python.
- Y todo se ejecuta de forma distribuida.

Visualmente, un DataFrame se ve igual que una tabla:

```
+----+----------+----------+----------+--------+
| id | fecha    | producto | cantidad | monto  |
+----+----------+----------+----------+--------+
|  1 | 2024-01  | Galletas |       50 | 425.00 |
|  2 | 2024-01  | Refresco |       30 | 360.00 |
|  3 | 2024-01  | Snack    |      100 | 600.00 |
+----+----------+----------+----------+--------+
```

La diferencia está en cómo lo manipulas. Y eso es lo que vas a aprender en las próximas secciones.

---

## Spark SQL vs Spark DataFrames

Spark tiene dos formas principales de consultar datos:

### Opción 1: Spark SQL
Escribir consultas SQL exactamente como las aprendiste en el módulo anterior:

```python
spark.sql("SELECT region, SUM(monto) FROM ventas GROUP BY region")
```

### Opción 2: API de DataFrames
Usar funciones de Python encadenadas:

```python
spark.table("ventas") \
    .groupBy("region") \
    .sum("monto")
```

Ambas formas hacen exactamente lo mismo. Spark las traduce internamente al mismo plan de ejecución.

> 💡 **¿Cuál usar?** Depende del contexto. SQL es más natural para consultas simples y para gente que viene de bases de datos. La API de DataFrames es más poderosa cuando tienes que encadenar muchas transformaciones o cuando necesitas lógica compleja en Python. En este curso vas a aprender ambas, porque en el trabajo real vas a usar las dos según convenga.

---

## ¿Qué viene en este curso?

A partir de la siguiente lección vas a empezar a escribir código Spark de verdad. Vas a aprender, en orden:

1. Cómo cargar tablas en Spark (`spark.table()`, `spark.sql()`)
2. Cómo seleccionar columnas (`select()`)
3. Cómo filtrar filas (`filter()`, `where()`)
4. Cómo crear y modificar columnas (`withColumn()`)
5. Cómo agrupar y agregar (`groupBy()`, funciones de agregación)
6. Cómo combinar tablas (`join()`)

Si reconoces esos nombres, es porque son exactamente las mismas operaciones que aprendiste en SQL. Eso no es coincidencia: Spark fue diseñado para que cualquiera que sepa SQL pueda usarlo. Lo único nuevo es la sintaxis.

---

## 🎯 Reflexión

Antes de avanzar a la próxima lección, piensa en tu trabajo actual:

1. ¿Qué procesos haces hoy con archivos de Excel que tarda mucho tiempo?
2. ¿Con qué frecuencia te pasa que un archivo es "demasiado grande" para abrirlo?
3. ¿Qué análisis te gustaría hacer pero no puedes porque no tienes la herramienta adecuada?

Guarda esas respuestas. Al final del módulo vas a volver a leerlas y vas a tener una idea muy clara de cuáles puedes resolver con Spark.

---

*Universidad Nexus — Curso de Python y Spark*
