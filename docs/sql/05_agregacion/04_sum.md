---
sidebar_position: 5
title: SUM — Suma Total
---

# SUM() — La Suma Total

## ¿Qué hace SUM()?

`SUM()` suma todos los valores de una columna numérica. Es la función de agregación más directamente relacionada con preguntas de negocio como: *¿cuánto vendimos en total? ¿cuál es el ingreso acumulado del trimestre? ¿cuántos productos salieron del almacén?*

```sql
SELECT SUM(population)
FROM country
WHERE continent = 'Asia';
```

Esta consulta calcula la población total de todos los países asiáticos en la tabla.

---

## SUM vs COUNT: la diferencia clave

Es fácil confundirlos, pero hacen cosas distintas:

- `COUNT(*)` te dice **cuántos registros** hay.
- `SUM(columna)` te dice **cuánto suman** los valores de esa columna.

*¿Cuántos pedidos hubo?* → `COUNT(*)`
*¿Cuánto fue el valor total de esos pedidos?* → `SUM(monto)`

Ambas preguntas son válidas y complementarias. Un buen análisis generalmente responde las dos.

---

## 🎯 Tarea

Escribe una consulta que devuelva la suma total de `SurfaceArea` de los países de `'Europe'`.

<details>
<summary>Ver solución</summary>

```sql
SELECT SUM(SurfaceArea)
FROM country
WHERE continent = 'Europe';
```

</details>

---

## Resumen de funciones de agregación

| Función | Qué calcula | Pregunta típica |
|---|---|---|
| `AVG(col)` | Promedio de los valores | ¿Cuál es el ticket promedio? |
| `COUNT(*)` | Número total de filas | ¿Cuántos registros hay? |
| `COUNT(col)` | Filas con valor no nulo | ¿Cuántos tienen ese dato? |
| `MAX(col)` | El valor más alto | ¿Cuál es el máximo? |
| `MIN(col)` | El valor más bajo | ¿Cuál es el mínimo? |
| `SUM(col)` | Suma de todos los valores | ¿Cuánto es el total? |

> 💡 **Para el analista:** Estas funciones son el puente entre tener datos y tener métricas. Una métrica es un dato resumido que responde una pregunta de negocio. Dominar estas funciones te permite construir cualquier KPI directamente desde SQL.

---

*Universidad Nexus — Curso de SQL*
