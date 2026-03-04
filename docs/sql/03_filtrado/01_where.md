---
sidebar_position: 2
title: La Cláusula WHERE
---

# La Cláusula WHERE

## Filtrar es hacer preguntas precisas

Sin filtros, SQL te da todo. Con filtros, SQL te da exactamente lo que necesitas. La cláusula `WHERE` define las condiciones que debe cumplir un registro para aparecer en el resultado.

```sql
SELECT columnas
FROM tabla
WHERE condición;
```

`WHERE` aparece inmediatamente después del nombre de la tabla. Cuando el valor que buscas es texto, debe ir entre comillas simples:

```sql
SELECT name, continent
FROM country
WHERE continent = 'Europe';
```

Esta consulta devuelve solo los países cuyo continente es Europa. El motor evalúa fila por fila: si la condición se cumple, la incluye; si no, la descarta.

---

## WHERE + ORDER BY

Cuando usas ambas cláusulas, el orden importa: `WHERE` siempre va antes de `ORDER BY`:

```sql
SELECT capital, continent
FROM country
WHERE continent = 'Asia'
ORDER BY continent DESC;
```

La regla mnemónica: primero filtras (WHERE), luego ordenas (ORDER BY), luego limitas (LIMIT).

---

## ¿Por qué el filtrado es una habilidad analítica?

Cualquiera puede recuperar todos los datos. Lo valioso es saber qué condición aplicar para que el resultado responda la pregunta correcta.

Antes de escribir un `WHERE`, pregúntate: *¿qué pregunta de negocio estoy respondiendo?* Esa pregunta define la condición. No al revés.

> ⚠️ **Atención con las mayúsculas:** SQL distingue entre `'Europe'` y `'europe'`. El valor debe coincidir exactamente con cómo está almacenado en la base de datos.

---

## 🎯 Tarea

Escribe una consulta SQL para recuperar las columnas `id`, `name` y `region` de la tabla `country`, devolviendo solo las filas cuyo `continent` sea `'North America'`.

<details>
<summary>Ver solución</summary>

```sql
SELECT id, name, region
FROM country
WHERE continent = 'North America';
```

</details>

---

## Desafío: Población de Norteamérica ordenada

Recupera `id`, `name`, `population` y `continent`, solo para países de `'North America'`, ordenados por `population` de mayor a menor.

<details>
<summary>Ver solución</summary>

```sql
SELECT id, name, population, continent
FROM country
WHERE continent = 'North America'
ORDER BY population DESC;
```

</details>

---

*Universidad Nexus — Curso de SQL*
