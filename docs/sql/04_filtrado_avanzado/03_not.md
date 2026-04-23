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

Ejemplo — todas las ventas excepto las del canal directo:

```sql
SELECT id_venta, canal
FROM cbc_cas_dev.universidad.fact_ventas
WHERE NOT canal = 'Directo';
```

---

## Cuándo NOT es la mejor opción

`NOT` brilla cuando la lista de lo que quieres incluir es larga, pero lo que quieres excluir es corto. En lugar de escribir:

```sql
WHERE canal = 'Online' OR canal = 'Distribuidor'
```

Puedes simplificar con:

```sql
WHERE NOT canal = 'Directo'
```

Si el resultado es el mismo, usa el que sea más claro y menos propenso a errores.

---

## 🎯 Tarea

Recupera las columnas `id_venta` y `total` de las ventas que **no** pertenecen al canal `'Distribuidor'`.

<details>
<summary>Ver solución</summary>

```sql
SELECT id_venta, total
FROM cbc_cas_dev.universidad.fact_ventas
WHERE NOT canal = 'Distribuidor';
```

</details>

---

## Desafío: Ventas fuera del canal Online

Recupera `id_venta`, `total` y `canal` de las ventas que no pertenecen al canal `'Online'`. Ordena el resultado por `total`.

<details>
<summary>Ver solución</summary>

```sql
SELECT id_venta, total, canal
FROM cbc_cas_dev.universidad.fact_ventas
WHERE NOT canal = 'Online'
ORDER BY total;
```

</details>

---

*Universidad Nexus — Curso de SQL*
