---
sidebar_position: 2
title: AVG — Promedio
---

# AVG() — El Promedio

## ¿Qué hace AVG()?

`AVG()` calcula el valor promedio de una columna numérica. Es una de las funciones más usadas en análisis porque resume la tendencia central de un conjunto de datos.

```sql
SELECT AVG(population)
FROM country;
```

Este resultado te da la población promedio de los países en la tabla.

---

## AVG con filtros

Puedes combinar `AVG()` con `WHERE` para calcular el promedio de un subconjunto específico:

```sql
SELECT AVG(population)
FROM country
WHERE population < 4478500;
```

Esto calcula el promedio solo de los países con población menor a 4,478,500 — útil cuando quieres el promedio de un segmento, no de toda la tabla.

---

## Cuidado con los promedios

`AVG()` es poderoso pero puede engañar. Un promedio alto puede ser empujado por un solo valor extremo. Antes de presentar un promedio, pregúntate:

- ¿Hay valores atípicos que distorsionen el resultado?
- ¿El promedio representa bien a la mayoría, o hay mucha dispersión?
- ¿Sería más útil calcular el promedio por segmento (con GROUP BY) en lugar de para todos?

> 💡 Un promedio sin contexto puede ser tan engañoso como no tener el dato. Siempre acompáñalo de información sobre la distribución.

---

## 🎯 Tarea

Escribe una consulta SQL para obtener el valor promedio de la columna `SurfaceArea` de la tabla `country`.

<details>
<summary>Ver solución</summary>

```sql
SELECT AVG(SurfaceArea)
FROM country;
```

</details>

---

## Desafío

Obtén el promedio de `SurfaceArea` solo para los países cuya superficie sea mayor a 1,000,000 km².

<details>
<summary>Ver solución</summary>

```sql
SELECT AVG(SurfaceArea)
FROM country
WHERE SurfaceArea > 1000000;
```

</details>

---

*Universidad Nexus — Curso de SQL*
