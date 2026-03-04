---
sidebar_position: 3
title: Operadores de Comparación
---

# Operadores de Comparación

## Más allá de la igualdad

La igualdad (`=`) es solo uno de los operadores disponibles en `WHERE`. SQL ofrece un conjunto completo para expresar cualquier condición numérica o textual:

| Operador | Significado |
|---|---|
| `=` | Igual a |
| `<>` | Distinto de |
| `<` | Menor que |
| `<=` | Menor o igual que |
| `>` | Mayor que |
| `>=` | Mayor o igual que |
| `BETWEEN` | Entre dos valores (inclusive) |
| `IS NULL` | Es un valor nulo |

---

## Ejemplos en acción

**Menor que:** Países con población menor a 2,424,200:

```sql
SELECT name, population
FROM country
WHERE population < 2424200;
```

**Menor o igual que:**

```sql
SELECT name, population
FROM country
WHERE population <= 2424200;
```

**Distinto de:** Países que no son asiáticos:

```sql
SELECT name, continent
FROM country
WHERE continent <> 'Asia';
```

---

## El operador BETWEEN

Para verificar si un valor está dentro de un rango, usa `BETWEEN` con `AND`:

```sql
SELECT columnas
FROM tabla
WHERE columna BETWEEN valor_inicial AND valor_final;
```

Ejemplo — países con población entre 100,000 y 3,000,000:

```sql
SELECT name, population
FROM country
WHERE population BETWEEN 100000 AND 3000000;
```

`BETWEEN` es inclusivo: incluye los valores del límite inferior y superior.

---

## Valores NULL: el caso especial

Si una columna no contiene ningún dato, su valor es `NULL`. Para verificar si un valor es nulo, no uses `= NULL` — eso no funciona en SQL. Usa `IS NULL`:

```sql
SELECT columnas
FROM tabla
WHERE nombre_columna IS NULL;
```

Ejemplo:

```sql
SELECT name
FROM country
WHERE region IS NULL;
```

> 💡 **Por qué importa:** Los valores NULL son una fuente frecuente de errores en análisis. Si no los identificas y manejas antes de calcular promedios, sumas o conteos, tus resultados pueden ser incorrectos sin que lo notes.

---

## 🎯 Tareas

**Tarea 1:** Recupera `name`, `population`, `region` y `capital`, solo para países de la región `'Southern Europe'`.

<details>
<summary>Ver solución</summary>

```sql
SELECT name, population, region, capital
FROM country
WHERE region = 'Southern Europe';
```

</details>

**Tarea 2:** Recupera `name`, `population`, `region` y `capital`, solo para países con población mayor o igual a 300,000.

<details>
<summary>Ver solución</summary>

```sql
SELECT name, population, region, capital
FROM country
WHERE population >= 300000;
```

</details>

**Tarea 3:** Recupera `name`, `capital` y `population`, para países con población entre 6,000,000 y 80,000,000. Ordena por `capital` de la A a la Z.

<details>
<summary>Ver solución</summary>

```sql
SELECT name, capital, population
FROM country
WHERE population BETWEEN 6000000 AND 80000000
ORDER BY capital ASC;
```

</details>

**Tarea 4:** Recupera `name` y `capital` de los países que no tienen valor en la columna `population`.

<details>
<summary>Ver solución</summary>

```sql
SELECT name, capital
FROM country
WHERE population IS NULL;
```

</details>

---

*Universidad Nexus — Curso de SQL*
