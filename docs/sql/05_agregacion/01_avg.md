---
sidebar_position: 2
title: AVG — Promedio
---

# AVG() — El Promedio

## ¿Qué hace AVG()?

`AVG()` calcula el valor promedio de una columna numérica. Es una de las funciones más usadas en análisis porque resume la tendencia central de un conjunto de datos.

```sql
SELECT AVG(total)
FROM cbc_cas_dev.universidad.fact_ventas;
```

Este resultado te da el ticket promedio de todas las ventas en la tabla.

---

## AVG con filtros

Puedes combinar `AVG()` con `WHERE` para calcular el promedio de un subconjunto específico:

```sql
SELECT AVG(total)
FROM cbc_cas_dev.universidad.fact_ventas
WHERE canal = 'Online';
```

Esto calcula el ticket promedio solo de las ventas online — útil cuando quieres el promedio de un segmento, no de toda la tabla.

---

## Cuidado con los promedios

`AVG()` es poderoso pero puede engañar. Un promedio alto puede ser empujado por un solo valor extremo. Antes de presentar un promedio, pregúntate:

- ¿Hay valores atípicos que distorsionen el resultado? (una venta con cantidad de 24 unidades puede jalar el promedio arriba)
- ¿El promedio representa bien a la mayoría, o hay mucha dispersión entre canales?
- ¿Sería más útil calcular el promedio por segmento (con GROUP BY) en lugar de para toda la tabla?

> 💡 Un promedio sin contexto puede ser tan engañoso como no tener el dato. Siempre acompáñalo de información sobre la distribución.

---

## 🎯 Tarea

Escribe una consulta SQL para obtener el valor promedio de la columna `total` de la tabla `cbc_cas_dev.universidad.fact_ventas`.

<details>
<summary>Ver solución</summary>

```sql
SELECT AVG(total)
FROM cbc_cas_dev.universidad.fact_ventas;
```

</details>

---

## Desafío

Obtén el promedio de `total` solo para las ventas cuyo total sea mayor a 10.

<details>
<summary>Ver solución</summary>

```sql
SELECT AVG(total)
FROM cbc_cas_dev.universidad.fact_ventas
WHERE total > 10;
```

</details>

---

*Universidad Nexus — Curso de SQL*
