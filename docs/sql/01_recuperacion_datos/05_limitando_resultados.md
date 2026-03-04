---
sidebar_position: 5
title: Limitando Resultados
---

# Limitando Resultados

## ¿Por qué limitar?

En la práctica, las tablas reales no tienen 15 filas: tienen miles, millones o incluso miles de millones de registros. Traer todos esos datos cada vez que ejecutas una consulta no solo es innecesario, sino que puede ser costoso en tiempo y recursos computacionales.

La cláusula `LIMIT` te permite controlar exactamente cuántas filas quieres recibir:

```sql
SELECT columnas
FROM tabla
LIMIT cantidad_de_filas;
```

Por ejemplo, para ver solo las primeras 7 capitales:

```sql
SELECT capital
FROM country
LIMIT 7;
```

`LIMIT` siempre va al final de la consulta.

---

## Usos reales de LIMIT en análisis

**Exploración rápida:** Cuando te conectas a una tabla desconocida, un `SELECT * FROM tabla LIMIT 10` te da una muestra representativa sin saturar tu pantalla ni tu conexión.

**Verificar antes de ejecutar:** Antes de correr una consulta compleja sobre millones de registros, pruébala con `LIMIT 100` para confirmar que el resultado tiene el aspecto que esperas. Es como revisar el borrador antes de enviar.

**Top N:** Combinado con `ORDER BY` (que veremos en la siguiente sección), `LIMIT` te permite obtener los 5 productos más vendidos, los 10 clientes con mayor facturación o las 3 regiones con mayor crecimiento.

> ⚠️ **Importante:** Sin `ORDER BY`, `LIMIT` devuelve las primeras filas en el orden en que están almacenadas internamente, lo cual no siempre es predecible. Para resultados significativos como "los 3 países más poblados", siempre combina `LIMIT` con `ORDER BY`.

---

## Combinando DISTINCT y LIMIT

Las cláusulas se pueden combinar. Por ejemplo, para ver solo 3 regiones únicas:

```sql
SELECT DISTINCT region
FROM country
LIMIT 3;
```

El orden de ejecución importa: primero SQL obtiene los valores únicos con `DISTINCT`, luego recorta el resultado a 3 filas con `LIMIT`.

---

## 🎯 Tarea

Escribe una consulta SQL para obtener 3 valores distintos de `continent` de la tabla `country`.

<details>
<summary>Ver solución</summary>

```sql
SELECT DISTINCT continent
FROM country
LIMIT 3;
```

</details>

---

*Universidad Nexus — Curso de SQL*
