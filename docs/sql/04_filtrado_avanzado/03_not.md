---
sidebar_position: 4
title: El Operador NOT
---

# El Operador NOT

## Excluir en lugar de incluir

A veces es más fácil definir lo que **no** quieres que lo que sí quieres. `NOT` invierte una condición: en lugar de filtrar los registros que la cumplen, filtra los que no la cumplen.

```sql
SELECT columnas
FROM tabla
WHERE NOT condición;
```

Ejemplo — todos los países excepto los asiáticos:

```sql
SELECT name, capital
FROM country
WHERE NOT continent = 'Asia';
```

---

## Cuándo NOT es la mejor opción

`NOT` brilla cuando la lista de lo que quieres incluir es larga, pero lo que quieres excluir es corto. En lugar de escribir:

```sql
WHERE continent = 'Europe' OR continent = 'Asia' OR continent = 'Africa' OR continent = 'Oceania'
```

Puedes simplificar con:

```sql
WHERE NOT continent = 'North America'
```

Si el resultado es el mismo, usa el que sea más claro y menos propenso a errores.

---

## 🎯 Tarea

Recupera las columnas `name` y `capital` de los países que **no** pertenecen al continente `'South America'`.

<details>
<summary>Ver solución</summary>

```sql
SELECT name, capital
FROM country
WHERE NOT continent = 'South America';
```

</details>

---

## Desafío: Capitales fuera de Europa

Recupera `name`, `capital` y `continent` de los países que no pertenecen a `'Europe'`. Ordena el resultado por `capital`.

<details>
<summary>Ver solución</summary>

```sql
SELECT name, capital, continent
FROM country
WHERE NOT continent = 'Europe'
ORDER BY capital;
```

</details>

---

*Universidad Nexus — Curso de SQL*
