---
sidebar_position: 4
title: Dirección de Ordenamiento — ASC y DESC
---

# Dirección de Ordenamiento: ASC y DESC

## Orden ascendente y descendente

Por defecto, `ORDER BY` ordena de menor a mayor (números) o de la A a la Z (texto). Esto se llama orden ascendente y equivale a escribir `ASC` explícitamente.

Pero muchas veces necesitas el orden inverso: los países más poblados primero, las ventas más altas al tope, las fechas más recientes antes. Para eso usas `DESC`:

```sql
SELECT continent
FROM country
ORDER BY continent DESC;
```

---

## Mezclar ASC y DESC en la misma consulta

Puedes ordenar diferentes columnas en diferentes direcciones. La clave es que `DESC` (o `ASC`) se aplica a la columna que lo precede directamente:

```sql
SELECT id, name, region
FROM country
ORDER BY region, name DESC;
```

Aquí `region` se ordena ascendente (por defecto) y `name` se ordena descendente. Cada columna tiene su propia dirección independiente.

> ⚠️ **Error común:** Escribir un solo `DESC` al final esperando que aplique a todas las columnas. No funciona así. Si quieres que dos columnas sean descendentes, cada una necesita su propio `DESC`.

---

## ¿Cuándo usar DESC en análisis?

`DESC` es especialmente útil cuando buscas los valores más relevantes:

- **Top performers:** Los 10 vendedores con mayor facturación → `ORDER BY ventas DESC LIMIT 10`
- **Alertas:** Los productos con menor stock → `ORDER BY stock ASC LIMIT 5`
- **Recencia:** Los pedidos más recientes → `ORDER BY fecha DESC`

El orden descendente convierte una lista en un ranking, y los rankings son de las visualizaciones más directas para tomar decisiones.

---

## 🎯 Tarea

Escribe una consulta SQL para recuperar las columnas `name`, `continent`, `region`, `population` y `capital` (en ese orden). Ordena el resultado primero por `continent` en orden descendente y luego por `population` en orden ascendente.

<details>
<summary>Ver solución</summary>

```sql
SELECT name, continent, region, population, capital
FROM country
ORDER BY continent DESC, population ASC;
```

</details>

---

## Desafíos

**Desafío 1:** Recupera `name`, `region` y `capital`. Ordena primero por `region` descendente, luego por `capital` descendente.

<details>
<summary>Ver solución</summary>

```sql
SELECT name, region, capital
FROM country
ORDER BY region DESC, capital DESC;
```

</details>

**Desafío 2:** Recupera todos los valores de `capital` ordenados en forma descendente.

<details>
<summary>Ver solución</summary>

```sql
SELECT capital
FROM country
ORDER BY capital DESC;
```

</details>

**Desafío 3:** Recupera todos los valores de `name` ordenados en forma ascendente.

<details>
<summary>Ver solución</summary>

```sql
SELECT name
FROM country
ORDER BY name ASC;
```

</details>

**Desafío 4:** Recupera `id`, `name` y `population` (en ese orden).

<details>
<summary>Ver solución</summary>

```sql
SELECT id, name, population
FROM country;
```

</details>

**Desafío 5:** Recupera `id`, `name`, `population` y `region`. Ordena primero por `region` de la Z a la A, luego por `population` de menor a mayor.

<details>
<summary>Ver solución</summary>

```sql
SELECT id, name, population, region
FROM country
ORDER BY region DESC, population ASC;
```

</details>

**Desafío 6:** Recupera los valores únicos de `continent` y muéstralos en orden ascendente.

<details>
<summary>Ver solución</summary>

```sql
SELECT DISTINCT continent
FROM country
ORDER BY continent ASC;
```

</details>

---

*Universidad Nexus — Curso de SQL*
