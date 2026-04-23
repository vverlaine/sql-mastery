---
sidebar_position: 3
title: COUNT — Contar Registros
---

# COUNT() — Contar Registros

## ¿Qué hace COUNT()?

`COUNT()` cuenta el número de filas que cumplen una condición. Es indispensable para responder preguntas como: *¿cuántos clientes tenemos? ¿cuántas transacciones hubo este mes? ¿cuántos productos están agotados?*

```sql
SELECT COUNT(id_cliente)
FROM cbc_cas_dev.universidad.fact_ventas;
```

Para contar todas las filas sin importar el valor de ninguna columna específica:

```sql
SELECT COUNT(*)
FROM cbc_cas_dev.universidad.fact_ventas;
```

---

## COUNT con filtros

La combinación de `COUNT()` y `WHERE` es una de las más útiles en análisis:

```sql
SELECT COUNT(*)
FROM cbc_cas_dev.universidad.fact_ventas
WHERE canal = 'Online' AND total > 20;
```

Esto responde: *¿cuántas ventas online tuvieron un total mayor a 20?*

---

## COUNT(*) vs COUNT(columna)

Hay una diferencia importante:

- `COUNT(*)` cuenta **todas** las filas, incluyendo las que tienen valores nulos.
- `COUNT(columna)` cuenta solo las filas donde esa columna **no es nula**.

Cuando necesitas saber cuántos registros tienen un dato específico, usa `COUNT(columna)`. Cuando quieres el total de filas, usa `COUNT(*)`.

> 💡 **En `fact_ventas`:** `COUNT(*)` te dará 55,000 (todas las filas). Pero `COUNT(id_cliente)` será menor, porque algunas ventas no tienen cliente registrado. La diferencia entre ambos te dice exactamente cuántas ventas anónimas hay.

---

## 🎯 Tarea

Escribe una consulta para obtener el número de filas de la tabla `cbc_cas_dev.universidad.fact_ventas` donde el canal es `'Online'` y el total es superior a 15.

<details>
<summary>Ver solución</summary>

```sql
SELECT COUNT(*)
FROM cbc_cas_dev.universidad.fact_ventas
WHERE canal = 'Online' AND total > 15;
```

</details>

---

## Desafío: Conteo por canal

Obtén el número de ventas que pertenecen al canal `'Directo'` o `'Distribuidor'`.

<details>
<summary>Ver solución</summary>

```sql
SELECT COUNT(*)
FROM cbc_cas_dev.universidad.fact_ventas
WHERE canal = 'Directo' OR canal = 'Distribuidor';
```

</details>

---

*Universidad Nexus — Curso de SQL*
