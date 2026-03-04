---
sidebar_position: 3
title: Ordenación por Múltiples Columnas
---

# Ordenación por Múltiples Columnas

## Cuando una columna no es suficiente

Ordenar por una sola columna funciona bien hasta que encuentras empates. Si ordenas por continente y varios países comparten el mismo, ¿en qué orden aparecen entre sí? Sin una segunda columna de orden, el resultado es arbitrario.

La solución es ordenar por múltiples columnas: la primera tiene prioridad, y cuando hay empate, la segunda desempata.

---

## Sintaxis

```sql
SELECT columnas
FROM tabla
ORDER BY columna_prioridad, columna2, ...;
```

Por ejemplo, para ordenar primero por población y luego por capital como desempate:

```sql
SELECT id, population, capital
FROM country
ORDER BY population, capital;
```

La lógica es: primero agrupa por población. Si dos países tienen la misma población, los ordena alfabéticamente por capital.

---

## Aplicación analítica

Este patrón es muy común en reportes reales:

- Ordenar por región y luego por nombre del cliente dentro de cada región.
- Ordenar por mes y luego por monto de venta dentro de cada mes.
- Ordenar por categoría de producto y luego por precio.

Siempre que tengas una jerarquía natural en tus datos, el ordenamiento múltiple la hace visible.

---

## 🎯 Tarea

Escribe una consulta SQL para recuperar las columnas `continent`, `region`, `population` y `capital` (en ese orden). Ordena el resultado primero por `continent` y luego por `population`.

<details>
<summary>Ver solución</summary>

```sql
SELECT continent, region, population, capital
FROM country
ORDER BY continent, population;
```

</details>

---

## Desafío: Doble Ordenamiento

Escribe una consulta SQL para recuperar las columnas `region` y `capital`. Ordena el resultado primero por `region` y luego por `capital`.

<details>
<summary>Ver solución</summary>

```sql
SELECT region, capital
FROM country
ORDER BY region, capital;
```

</details>

---

*Universidad Nexus — Curso de SQL*
