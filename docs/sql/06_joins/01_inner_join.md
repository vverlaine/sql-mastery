---
sidebar_position: 2
title: INNER JOIN
---

# INNER JOIN — Solo lo que existe en ambas tablas

## La regla de oro

El INNER JOIN es el más estricto de todos. Su regla es simple:

> **Si un registro no tiene pareja en la otra tabla, desaparece del resultado. No aparece en ningún lado.**

```
Tabla A (fact_ventas)        Tabla B (dim_producto)

  ┌─────────────┐               ┌─────────────┐
  │  ventas sin │               │  productos  │
  │  producto   │               │  sin venta  │
  │  válido     │               │             │
  │  ┌──────────┼───────────────┼──────────┐  │
  │  │          │ INNER JOIN    │          │  │
  │  │  ventas con producto válido         │  │
  │  │                                     │  │
  │  └──────────┼───────────────┼──────────┘  │
  └─────────────┘               └─────────────┘

  INNER JOIN = solo el área del medio
```

---

## Sintaxis

```sql
SELECT columnas
FROM tabla_a
INNER JOIN tabla_b
    ON tabla_a.columna_comun = tabla_b.columna_comun;
```

La parte `ON` es donde le decís a SQL **cuál es la columna que conecta las dos tablas**. Esa columna tiene que existir en ambas y tener los mismos valores.

---

## Tu primer INNER JOIN

Queremos ver las ventas con el nombre real del producto:

```sql
SELECT
    v.id_venta,
    v.fecha_venta,
    p.nombre_producto,
    p.presentacion,
    v.cantidad,
    v.total
FROM cbc_cas_dev.universidad.fact_ventas  v
INNER JOIN cbc_cas_dev.universidad.dim_producto p
    ON v.id_producto = p.id_producto
LIMIT 10;
```

:::note ¿Qué es la `v` y la `p` después del nombre de tabla?
Se llaman **alias**. Son apodos para no escribir el nombre completo cada vez. En lugar de `cbc_cas_dev.universidad.fact_ventas.id_venta`, simplemente escribís `v.id_venta`.

Siempre usá alias cuando trabajés con más de una tabla. Es práctica estándar en el mundo real.
:::

---

## Cuándo usar INNER JOIN

Usá INNER JOIN cuando:

- **Solo querés filas completas** — registros que tienen información en ambas tablas.
- **Tenés certeza de que la relación siempre existe** — por ejemplo, toda venta debe tener un producto válido.
- **Querés filtrar implícitamente** los registros huérfanos (sin pareja).

---

## Verificando el resultado

Después de cualquier JOIN, es buena práctica verificar que el número de filas tiene sentido:

```sql
-- ¿Cuántas ventas hay en total?
SELECT COUNT(*) FROM cbc_cas_dev.universidad.fact_ventas;

-- ¿Cuántas ventas quedan después del JOIN?
SELECT COUNT(*)
FROM cbc_cas_dev.universidad.fact_ventas      v
INNER JOIN cbc_cas_dev.universidad.dim_producto p
    ON v.id_producto = p.id_producto;
```

Si el segundo número es **igual al primero**: perfecto, todos los productos en ventas existen en el catálogo.

Si el segundo número es **menor**: hay ventas con `id_producto` que no existe en `dim_producto`. Eso merece una investigación.

:::warning Si el resultado tiene más filas que la tabla original
Eso es una señal de alerta grave. Significa que la columna de unión no es única en una de las tablas y estás generando duplicados. Verás esto en detalle en la lección 06.
:::

---

*Pilar 1 — SQL · Universidad Nexus · CBC*
