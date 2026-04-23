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
SELECT id_venta, canal
FROM cbc_cas_dev.universidad.fact_ventas
WHERE canal = 'Online';
```

Esta consulta devuelve solo las ventas cuyo canal es Online. El motor evalúa fila por fila: si la condición se cumple, la incluye; si no, la descarta.

---

## WHERE + ORDER BY

Cuando usas ambas cláusulas, el orden importa: `WHERE` siempre va antes de `ORDER BY`:

```sql
SELECT id_venta, total, canal
FROM cbc_cas_dev.universidad.fact_ventas
WHERE canal = 'Distribuidor'
ORDER BY total DESC;
```

La regla mnemónica: primero filtras (WHERE), luego ordenas (ORDER BY), luego limitas (LIMIT).

---

## ¿Por qué el filtrado es una habilidad analítica?

Cualquiera puede recuperar todos los datos. Lo valioso es saber qué condición aplicar para que el resultado responda la pregunta correcta.

Antes de escribir un `WHERE`, pregúntate: *¿qué pregunta de negocio estoy respondiendo?* Esa pregunta define la condición. No al revés.

> ⚠️ **Atención con las mayúsculas:** SQL distingue entre `'Online'` y `'online'`. El valor debe coincidir exactamente con cómo está almacenado en la base de datos.

---

## 🎯 Tarea

Escribe una consulta SQL para recuperar las columnas `id_venta`, `id_producto` y `total` de la tabla `cbc_cas_dev.universidad.fact_ventas`, devolviendo solo las filas cuyo `canal` sea `'Directo'`.

<details>
<summary>Ver solución</summary>

```sql
SELECT id_venta, id_producto, total
FROM cbc_cas_dev.universidad.fact_ventas
WHERE canal = 'Directo';
```

</details>

---

## Desafío: Ventas online ordenadas por total

Recupera `id_venta`, `id_producto`, `total` y `canal`, solo para ventas del canal `'Online'`, ordenadas por `total` de mayor a menor.

<details>
<summary>Ver solución</summary>

```sql
SELECT id_venta, id_producto, total, canal
FROM cbc_cas_dev.universidad.fact_ventas
WHERE canal = 'Online'
ORDER BY total DESC;
```

</details>

---

*Universidad Nexus — Curso de SQL*
