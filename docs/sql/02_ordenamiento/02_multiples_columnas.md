---
sidebar_position: 3
title: Ordenación por Múltiples Columnas
---

# Ordenación por Múltiples Columnas

## Cuando una columna no es suficiente

Ordenar por una sola columna funciona bien hasta que encuentras empates. Si ordenas por canal y miles de ventas comparten el mismo, ¿en qué orden aparecen entre sí? Sin una segunda columna de orden, el resultado es arbitrario.

La solución es ordenar por múltiples columnas: la primera tiene prioridad, y cuando hay empate, la segunda desempata.

---

## Sintaxis

```sql
SELECT columnas
FROM tabla
ORDER BY columna_prioridad, columna2, ...;
```

Por ejemplo, para ordenar primero por canal y luego por total como desempate:

```sql
SELECT id_venta, canal, total
FROM cbc_cas_dev.universidad.fact_ventas
ORDER BY canal, total;
```

La lógica es: primero agrupa las ventas por canal alfabéticamente (`Directo`, `Distribuidor`, `Online`). Dentro de cada canal, ordena de menor a mayor total.

---

## Aplicación analítica

Este patrón es muy común en reportes reales:

- Ordenar por canal y luego por total para ver las ventas más pequeñas y más grandes dentro de cada canal.
- Ordenar por tienda y luego por fecha para ver la secuencia de ventas de cada punto.
- Ordenar por producto y luego por cantidad para ver los movimientos más representativos por SKU.

Siempre que tengas una jerarquía natural en tus datos, el ordenamiento múltiple la hace visible.

---

## 🎯 Tarea

Escribe una consulta SQL para recuperar las columnas `canal`, `id_tienda`, `total` e `id_venta` (en ese orden). Ordena el resultado primero por `canal` y luego por `total`.

<details>
<summary>Ver solución</summary>

```sql
SELECT canal, id_tienda, total, id_venta
FROM cbc_cas_dev.universidad.fact_ventas
ORDER BY canal, total;
```

</details>

---

## Desafío: Doble Ordenamiento

Escribe una consulta SQL para recuperar las columnas `id_tienda` e `id_producto`. Ordena el resultado primero por `id_tienda` y luego por `id_producto`.

<details>
<summary>Ver solución</summary>

```sql
SELECT id_tienda, id_producto
FROM cbc_cas_dev.universidad.fact_ventas
ORDER BY id_tienda, id_producto;
```

</details>

---

*Universidad Nexus — Curso de SQL*
