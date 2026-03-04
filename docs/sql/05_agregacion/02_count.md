---
sidebar_position: 3
title: COUNT — Contar Registros
---

# COUNT() — Contar Registros

## ¿Qué hace COUNT()?

`COUNT()` cuenta el número de filas que cumplen una condición. Es indispensable para responder preguntas como: *¿cuántos clientes tenemos? ¿cuántas transacciones hubo este mes? ¿cuántos productos están agotados?*

```sql
SELECT COUNT(name)
FROM country;
```

Para contar todas las filas sin importar el valor de ninguna columna específica:

```sql
SELECT COUNT(*)
FROM country;
```

---

## COUNT con filtros

La combinación de `COUNT()` y `WHERE` es una de las más útiles en análisis:

```sql
SELECT COUNT(*)
FROM country
WHERE continent = 'Asia' AND population > 1000000;
```

Esto responde: *¿cuántos países asiáticos tienen más de un millón de habitantes?*

---

## COUNT(*) vs COUNT(columna)

Hay una diferencia importante:

- `COUNT(*)` cuenta **todas** las filas, incluyendo las que tienen valores nulos.
- `COUNT(columna)` cuenta solo las filas donde esa columna **no es nula**.

Cuando necesitas saber cuántos registros tienen un dato específico, usa `COUNT(columna)`. Cuando quieres el total de filas, usa `COUNT(*)`.

---

## 🎯 Tarea

Escribe una consulta para obtener el número de filas de la tabla `country` donde el continente es `'Asia'` y la población es superior a 1,000,000.

<details>
<summary>Ver solución</summary>

```sql
SELECT COUNT(*)
FROM country
WHERE continent = 'Asia' AND population > 1000000;
```

</details>

---

## Desafío: Conteo continental

Obtén el número de países que pertenecen a `'Europe'` o `'Asia'`.

<details>
<summary>Ver solución</summary>

```sql
SELECT COUNT(*)
FROM country
WHERE continent = 'Europe' OR continent = 'Asia';
```

</details>

---

*Universidad Nexus — Curso de SQL*
