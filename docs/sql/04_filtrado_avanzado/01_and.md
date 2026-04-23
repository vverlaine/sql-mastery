---
sidebar_position: 2
title: El Operador AND
---

# El Operador AND

## Cuando todas las condiciones deben cumplirse

`AND` encadena condiciones de forma que un registro solo aparece en el resultado si **todas** se cumplen simultáneamente. Es el operador de la intersección.

```sql
SELECT id_venta, total, canal
FROM cbc_cas_dev.universidad.fact_ventas
WHERE total >= 20 AND canal = 'Online';
```

Esta consulta devuelve únicamente las ventas online con total de al menos 20. Una venta online con total de 5 no aparece. Una venta directa con total de 100 tampoco.

---

## Puedes encadenar más de dos condiciones

```sql
SELECT id_venta, total, canal
FROM cbc_cas_dev.universidad.fact_ventas
WHERE canal = 'Online'
  AND total > 10
  AND cantidad >= 12;
```

Cada condición adicional con `AND` reduce el conjunto de resultados. Es como añadir filtros: cuantos más pones, más específica es tu pregunta.

---

## AND en análisis de negocio

Este patrón es el más común en análisis real:

- *"Ventas del canal Online con total mayor a 20"*
- *"Transacciones del distribuidor con cantidad mayor a 12 unidades y descuento aplicado"*
- *"Ventas directas realizadas por un vendedor específico durante el 2024"*

Cada `AND` es una condición de negocio. Antes de escribirlo, asegúrate de que realmente todas las condiciones deben cumplirse. Si alguna es opcional, necesitarás `OR`.

---

## 🎯 Tarea

Obtén solo los identificadores de venta (`id_venta`) del canal `'Distribuidor'` con un total mayor a `20`.

<details>
<summary>Ver solución</summary>

```sql
SELECT id_venta
FROM cbc_cas_dev.universidad.fact_ventas
WHERE canal = 'Distribuidor' AND total > 20;
```

</details>

---

## Desafío: Ventas Online con filtros

Recupera `id_venta`, `id_tienda`, `id_producto` y `total` de ventas del canal `'Online'` con total mayor a 10. Ordena primero por `id_tienda` ascendente y luego por `id_producto` ascendente.

<details>
<summary>Ver solución</summary>

```sql
SELECT id_venta, id_tienda, id_producto, total
FROM cbc_cas_dev.universidad.fact_ventas
WHERE canal = 'Online' AND total > 10
ORDER BY id_tienda ASC, id_producto ASC;
```

</details>

---

*Universidad Nexus — Curso de SQL*
