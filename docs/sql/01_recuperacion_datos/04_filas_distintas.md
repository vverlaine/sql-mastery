---
sidebar_position: 4
title: Recuperación de Filas Distintas
---

# Recuperación de Filas Distintas

## El problema de los duplicados

Cuando ejecutas un `SELECT` sobre una columna, SQL devuelve todos los valores, incluyendo los repetidos. Si tienes 15 países y varios pertenecen al mismo continente, verás "Europe", "Europe", "Europe"... tantas veces como países europeos existan.

Eso está bien cuando quieres contar registros. Pero si lo que necesitas es saber qué valores únicos existen en una columna, los duplicados solo añaden ruido y dificultan el análisis.

---

## DISTINCT: el filtro de unicidad

La palabra clave `DISTINCT` le indica a SQL que devuelva solo los valores únicos de una columna:

```sql
SELECT DISTINCT nombre_columna
FROM nombre_tabla;
```

Por ejemplo, para conocer todos los continentes únicos de nuestra tabla:

```sql
SELECT DISTINCT continent
FROM country;
```

En lugar de ver el mismo continente repetido para cada país, obtienes cada continente exactamente una vez.

---

## Por qué DISTINCT es una herramienta analítica, no solo de limpieza

`DISTINCT` va mucho más allá de limpiar resultados. En análisis de datos tiene usos críticos:

**Exploración inicial:** Antes de analizar una columna categórica, necesitas saber qué valores contiene. ¿Cuántos continentes hay? ¿Qué tipos de regiones existen? `DISTINCT` responde eso en segundos.

**Detección de inconsistencias:** Si una columna debería tener valores estandarizados y `DISTINCT` te devuelve "Guatemala", "GUATEMALA" y "Guat.", acabas de encontrar un problema de calidad de datos que puede arruinar cualquier análisis posterior.

**Validación de datos:** Puedes verificar que los valores de una columna corresponden exactamente a los que esperas antes de construir filtros o agrupaciones sobre ellos.

> 💡 **Regla de oro:** Antes de hacer cualquier análisis sobre una columna categórica, ejecuta `SELECT DISTINCT` sobre ella. Te ahorrará sorpresas desagradables más adelante.

---

## 🎯 Tarea

Escribe una consulta SQL para obtener los valores únicos de la columna `continent` de la tabla `country`.

<details>
<summary>Ver solución</summary>

```sql
SELECT DISTINCT continent
FROM country;
```

</details>

---

*Universidad Nexus — Curso de SQL*
