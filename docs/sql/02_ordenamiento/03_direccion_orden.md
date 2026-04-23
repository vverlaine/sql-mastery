---
sidebar_position: 4
title: Dirección de Ordenamiento — ASC y DESC
---

# Dirección de Ordenamiento: ASC y DESC

## Orden ascendente y descendente

Por defecto, `ORDER BY` ordena de menor a mayor (números) o de la A a la Z (texto). Esto se llama orden ascendente y equivale a escribir `ASC` explícitamente.

Pero muchas veces necesitas el orden inverso: las ventas más altas primero, los totales mayores al tope, las fechas más recientes antes. Para eso usas `DESC`:

```sql
SELECT canal
FROM cbc_cas_dev.universidad.fact_ventas
ORDER BY canal DESC;
```

---

## Mezclar ASC y DESC en la misma consulta

Puedes ordenar diferentes columnas en diferentes direcciones. La clave es que `DESC` (o `ASC`) se aplica a la columna que lo precede directamente:

```sql
SELECT id_venta, id_producto, canal
FROM cbc_cas_dev.universidad.fact_ventas
ORDER BY canal, id_producto DESC;
```

Aquí `canal` se ordena ascendente (por defecto) y `id_producto` se ordena descendente. Cada columna tiene su propia dirección independiente.

> ⚠️ **Error común:** Escribir un solo `DESC` al final esperando que aplique a todas las columnas. No funciona así. Si quieres que dos columnas sean descendentes, cada una necesita su propio `DESC`.

---

## ¿Cuándo usar DESC en análisis?

`DESC` es especialmente útil cuando buscas los valores más relevantes:

- **Top performers:** Las 10 ventas con mayor facturación → `ORDER BY total DESC LIMIT 10`
- **Alertas:** Las ventas con menor cantidad → `ORDER BY cantidad ASC LIMIT 5`
- **Recencia:** Las ventas más recientes → `ORDER BY fecha_venta DESC`

El orden descendente convierte una lista en un ranking, y los rankings son de las visualizaciones más directas para tomar decisiones.

---

## 🎯 Tarea

Escribe una consulta SQL para recuperar las columnas `id_venta`, `canal`, `id_tienda`, `total` e `id_producto` (en ese orden). Ordena el resultado primero por `canal` en orden descendente y luego por `total` en orden ascendente.

<details>
<summary>Ver solución</summary>

```sql
SELECT id_venta, canal, id_tienda, total, id_producto
FROM cbc_cas_dev.universidad.fact_ventas
ORDER BY canal DESC, total ASC;
```

</details>

---

## Desafíos

**Desafío 1:** Recupera `id_venta`, `id_tienda` e `id_producto`. Ordena primero por `id_tienda` descendente, luego por `id_producto` descendente.

<details>
<summary>Ver solución</summary>

```sql
SELECT id_venta, id_tienda, id_producto
FROM cbc_cas_dev.universidad.fact_ventas
ORDER BY id_tienda DESC, id_producto DESC;
```

</details>

**Desafío 2:** Recupera todos los valores de `id_producto` ordenados en forma descendente.

<details>
<summary>Ver solución</summary>

```sql
SELECT id_producto
FROM cbc_cas_dev.universidad.fact_ventas
ORDER BY id_producto DESC;
```

</details>

**Desafío 3:** Recupera todos los valores de `id_venta` ordenados en forma ascendente.

<details>
<summary>Ver solución</summary>

```sql
SELECT id_venta
FROM cbc_cas_dev.universidad.fact_ventas
ORDER BY id_venta ASC;
```

</details>

**Desafío 4:** Recupera `id_venta`, `id_producto` y `total` (en ese orden).

<details>
<summary>Ver solución</summary>

```sql
SELECT id_venta, id_producto, total
FROM cbc_cas_dev.universidad.fact_ventas;
```

</details>

**Desafío 5:** Recupera `id_venta`, `id_producto`, `total` y `id_tienda`. Ordena primero por `id_tienda` de la Z a la A, luego por `total` de menor a mayor.

<details>
<summary>Ver solución</summary>

```sql
SELECT id_venta, id_producto, total, id_tienda
FROM cbc_cas_dev.universidad.fact_ventas
ORDER BY id_tienda DESC, total ASC;
```

</details>

**Desafío 6:** Recupera los valores únicos de `canal` y muéstralos en orden ascendente.

<details>
<summary>Ver solución</summary>

```sql
SELECT DISTINCT canal
FROM cbc_cas_dev.universidad.fact_ventas
ORDER BY canal ASC;
```

</details>

---

*Universidad Nexus — Curso de SQL*
