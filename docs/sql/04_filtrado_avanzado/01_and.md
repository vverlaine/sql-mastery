---
sidebar_position: 2
title: El Operador AND
---

# El Operador AND

## Cuando todas las condiciones deben cumplirse

`AND` encadena condiciones de forma que un registro solo aparece en el resultado si **todas** se cumplen simultáneamente. Es el operador de la intersección.

```sql
SELECT name, population, region
FROM country
WHERE population >= 1000000 AND continent = 'Europe';
```

Esta consulta devuelve únicamente los países europeos con al menos un millón de habitantes. Un país europeo con 500,000 habitantes no aparece. Un país asiático con 5,000,000 tampoco.

---

## Puedes encadenar más de dos condiciones

```sql
SELECT name, population, region
FROM country
WHERE continent = 'Europe'
  AND population > 100000
  AND region = 'Western Europe';
```

Cada condición adicional con `AND` reduce el conjunto de resultados. Es como añadir filtros: cuantos más pones, más específica es tu pregunta.

---

## AND en análisis de negocio

Este patrón es el más común en análisis real:

- *"Clientes activos en Guatemala con más de 5 compras este mes"*
- *"Productos de la categoría X con margen mayor al 30% y stock disponible"*
- *"Empleados del área de ventas con más de 2 años en la empresa y metas cumplidas"*

Cada `AND` es una condición de negocio. Antes de escribirlo, asegúrate de que realmente todas las condiciones deben cumplirse. Si alguna es opcional, necesitarás `OR`.

---

## 🎯 Tarea

Obtén solo los nombres de los países (`name`) que se encuentran en `'Asia'` y tienen una población mayor a `1,000,000`.

<details>
<summary>Ver solución</summary>

```sql
SELECT name
FROM country
WHERE continent = 'Asia' AND population > 1000000;
```

</details>

---

## Desafío: Europa con filtros

Recupera `name`, `region`, `capital` y `population` de países europeos con más de 100,000 habitantes. Ordena primero por `region` ascendente y luego por `capital` ascendente.

<details>
<summary>Ver solución</summary>

```sql
SELECT name, region, capital, population
FROM country
WHERE continent = 'Europe' AND population > 100000
ORDER BY region ASC, capital ASC;
```

</details>

---

*Universidad Nexus — Curso de SQL*
