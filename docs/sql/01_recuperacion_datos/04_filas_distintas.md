---
sidebar_position: 4
title: Recuperación de Filas Distintas
---

# Recuperación de Filas Distintas

## El problema de los duplicados

Cuando ejecutas un `SELECT` sobre una columna, SQL devuelve todos los valores, incluyendo los repetidos. Si tienes 55,000 ventas y todas pasaron por uno de tres canales, verás "Directo", "Directo", "Distribuidor", "Online", "Directo"... repetido miles de veces.

Eso está bien cuando quieres contar registros. Pero si lo que necesitas es saber qué valores únicos existen en una columna, los duplicados solo añaden ruido y dificultan el análisis.

---

## DISTINCT: el filtro de unicidad

La palabra clave `DISTINCT` le indica a SQL que devuelva solo los valores únicos de una columna:

```sql
SELECT DISTINCT nombre_columna
FROM nombre_tabla;
```

Por ejemplo, para conocer todos los canales únicos por los que se vende:

```sql
SELECT DISTINCT canal
FROM cbc_cas_dev.universidad.fact_ventas;
```

En lugar de ver el mismo canal repetido para cada venta, obtienes cada canal exactamente una vez. Con 55,000 filas, el resultado son apenas 3 valores: `Directo`, `Distribuidor` y `Online`.

---

## Por qué DISTINCT es una herramienta analítica, no solo de limpieza

`DISTINCT` va mucho más allá de limpiar resultados. En análisis de datos tiene usos críticos:

**Exploración inicial:** Antes de analizar una columna categórica, necesitas saber qué valores contiene. ¿Cuántos canales hay? ¿Cuántas tiendas distintas? `DISTINCT` responde eso en segundos.

**Detección de inconsistencias:** Si una columna debería tener valores estandarizados y `DISTINCT` te devuelve "Online", "ONLINE" y "on-line", acabas de encontrar un problema de calidad de datos que puede arruinar cualquier análisis posterior.

**Validación de datos:** Puedes verificar que los valores de una columna corresponden exactamente a los que esperas antes de construir filtros o agrupaciones sobre ellos.

> 💡 **Regla de oro:** Antes de hacer cualquier análisis sobre una columna categórica, ejecuta `SELECT DISTINCT` sobre ella. Te ahorrará sorpresas desagradables más adelante.

---

## 🎯 Tarea

Escribe una consulta SQL para obtener los valores únicos de la columna `id_tienda` de la tabla `cbc_cas_dev.universidad.fact_ventas`.

<details>
<summary>Ver solución</summary>

```sql
SELECT DISTINCT id_tienda
FROM cbc_cas_dev.universidad.fact_ventas;
```

</details>

---

*Universidad Nexus — Curso de SQL*
