---
sidebar_position: 9
title: Desafíos
---

# Desafíos — JOINs

Cuatro ejercicios progresivos. Del más directo al más abierto. Intentá cada uno antes de ver la solución.

---

## Desafío 1 — Reporte de ventas enriquecido

Traé las primeras 50 ventas mostrando: `id_venta`, `fecha`, nombre del vendedor, nombre del producto, nombre de la categoría y `monto_total`. Usá solo INNER JOINs.

<details>
<summary>Ver solución</summary>

```sql
SELECT
    v.id_venta,
    v.fecha_venta,
    vend.nombre_vendedor,
    prod.nombre_producto,
    cat.nombre_categoria,
    v.total
FROM cbc_cas_dev.universidad.fact_ventas       v
INNER JOIN cbc_cas_dev.universidad.dim_vendedor  vend ON v.id_vendedor  = vend.id_vendedor
INNER JOIN cbc_cas_dev.universidad.dim_producto  prod ON v.id_producto  = prod.id_producto
INNER JOIN cbc_cas_dev.universidad.dim_categoria cat  ON prod.id_categoria = cat.id_categoria
ORDER BY v.fecha_venta DESC
LIMIT 50;
```

</details>

---

## Desafío 2 — Productos sin ventas

Encontrá todos los productos del catálogo que **nunca han tenido una venta**. Mostrá `id_producto`, `nombre_producto` y `presentacion`. Ordená por `id_producto`.

*Pista: el patrón LEFT JOIN + IS NULL.*

<details>
<summary>Ver solución</summary>

```sql
SELECT
    p.id_producto,
    p.nombre_producto,
    p.presentacion
FROM cbc_cas_dev.universidad.dim_producto   p
LEFT JOIN cbc_cas_dev.universidad.fact_ventas v
    ON p.id_producto = v.id_producto
WHERE v.id_venta IS NULL
ORDER BY p.id_producto;
```

</details>

---

## Desafío 3 — Tasa de devolución por tienda

Para cada tienda, calculá: total de ventas, total de devoluciones y el porcentaje de ventas que tuvo al menos una devolución. Ordená de mayor a menor tasa.

*Necesitás: `fact_ventas`, `fact_devoluciones` y `dim_tienda`.*

<details>
<summary>Ver solución</summary>

```sql
SELECT
    t.nombre_tienda,
    COUNT(DISTINCT v.id_venta)                              AS total_ventas,
    COUNT(DISTINCT d.id_devolucion)                         AS total_devoluciones,
    ROUND(
        COUNT(DISTINCT d.id_devolucion) * 100.0
        / COUNT(DISTINCT v.id_venta)
    , 2)                                                    AS pct_con_devolucion
FROM cbc_cas_dev.universidad.fact_ventas             v
INNER JOIN cbc_cas_dev.universidad.dim_tienda        t ON v.id_tienda = t.id_tienda
LEFT  JOIN cbc_cas_dev.universidad.fact_devoluciones d ON v.id_venta  = d.id_venta
GROUP BY t.nombre_tienda
ORDER BY pct_con_devolucion DESC;
```

</details>

---

## Desafío 4 — El experimento de la duplicación

Este desafío no tiene una respuesta única — tiene una observación.

Ejecutá estas dos queries y anotá los resultados:

```sql
-- Query A: sin filtro (el malo)
SELECT COUNT(*) AS filas_sin_filtro
FROM cbc_cas_dev.universidad.fact_ventas    v
INNER JOIN cbc_cas_dev.universidad.hist_precios h
    ON v.id_producto = h.id_producto;

-- Query B: con filtro (el bueno)
SELECT COUNT(*) AS filas_con_filtro
FROM cbc_cas_dev.universidad.fact_ventas    v
INNER JOIN cbc_cas_dev.universidad.hist_precios h
    ON  v.id_producto = h.id_producto
    AND h.es_actual   = TRUE;
```

Calculá: `filas_sin_filtro / filas_con_filtro`

Ese número es el **promedio de versiones de precio por producto** en el historial. ¿Tenía sentido usar el JOIN sin filtro? ¿Qué habría pasado si calculabas `SUM(monto_total)` con la Query A?

---

*Pilar 1 — SQL · Universidad Nexus · CBC*
