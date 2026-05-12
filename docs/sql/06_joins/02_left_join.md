---
sidebar_position: 3
title: LEFT JOIN
---

# LEFT JOIN — Conservar todo lo de la izquierda

## La regla

El LEFT JOIN es el más usado en análisis de datos del día a día:

> **Devuelve todas las filas de la tabla de la izquierda (la que está en el FROM), aunque no encuentre pareja en la tabla de la derecha. Donde no hay pareja, rellena con `NULL`.**

```
Tabla A (dim_cliente)        Tabla B (fact_ventas)

  ┌─────────────────────────────────────────────┐
  │  TODOS los clientes                         │
  │  (con o sin ventas)     │                   │
  │  ┌──────────────────────┼──────────────┐    │
  │  │  clientes            │ clientes     │    │
  │  │  SIN ventas          │ CON ventas   │    │
  │  │  → columnas de       │              │    │
  │  │    ventas = NULL     │              │    │
  │  └──────────────────────┼──────────────┘    │
  └─────────────────────────────────────────────┘

  LEFT JOIN = todo A + área del medio
```

---

## Sintaxis

```sql
SELECT columnas
FROM tabla_principal        -- ← esta es "la izquierda"
LEFT JOIN tabla_secundaria
    ON tabla_principal.columna = tabla_secundaria.columna;
```

---

## Ejemplo 1: Ventas y sus devoluciones

Queremos ver todas las ventas, y si tienen devolución, mostrar el detalle. Muchas ventas no tienen devolución — y eso también es información valiosa.

```sql
SELECT
    v.id_venta,
    v.fecha_venta,
    v.total,
    d.id_devolucion,
    d.monto_devuelto,
    d.motivo
FROM cbc_cas_dev.universidad.fact_ventas         v
LEFT JOIN cbc_cas_dev.universidad.fact_devoluciones d
    ON v.id_venta = d.id_venta
LIMIT 20;
```

**Interpretando el resultado:**

| id_venta | monto_total | id_devolucion | monto_devuelto | motivo |
|----------|-------------|---------------|----------------|--------|
| F-001234 | 125.50 | D-000891 | 12.50 | Error de pedido |
| F-001235 | 88.00 | `NULL` | `NULL` | `NULL` |
| F-001236 | 210.00 | `NULL` | `NULL` | `NULL` |
| F-001237 | 45.75 | D-000892 | 45.75 | Vencimiento próximo |

Las filas con `NULL` son ventas que **nunca fueron devueltas**. Son la mayoría, y eso es exactamente lo que queremos ver.

---

## Ejemplo 2: Vendedores con su conteo de ventas

```sql
SELECT
    vend.nombre_vendedor,
    vend.id_region_actual,
    COUNT(v.id_venta) AS total_ventas
FROM cbc_cas_dev.universidad.dim_vendedor   vend
LEFT JOIN cbc_cas_dev.universidad.fact_ventas v
    ON vend.id_vendedor = v.id_vendedor
GROUP BY vend.nombre_vendedor, vend.id_region_actual
ORDER BY total_ventas DESC;
```

Los vendedores con `total_ventas = 0` son vendedores que existen en el sistema pero aún no tienen ventas registradas. Con INNER JOIN, esos vendedores desaparecerían del reporte — y nunca los verías.

---

## El truco más poderoso del LEFT JOIN: encontrar "los que no tienen"

Hay un patrón clásico en análisis de datos que vas a usar constantemente:

**LEFT JOIN + WHERE columna_derecha IS NULL = "Dame todos los que NO tienen X"**

```sql
-- Ventas que NUNCA tuvieron devolución
SELECT
    v.id_venta,
    v.fecha_venta,
    v.total
FROM cbc_cas_dev.universidad.fact_ventas         v
LEFT JOIN cbc_cas_dev.universidad.fact_devoluciones d
    ON v.id_venta = d.id_venta
WHERE d.id_devolucion IS NULL;
```

```sql
-- Productos del catálogo que nunca se han vendido
SELECT
    p.id_producto,
    p.nombre_producto,
    p.presentacion
FROM cbc_cas_dev.universidad.dim_producto   p
LEFT JOIN cbc_cas_dev.universidad.fact_ventas v
    ON p.id_producto = v.id_producto
WHERE v.id_venta IS NULL;
```

:::tip ¿Por qué filtramos por IS NULL y no por otra cosa?
Porque cuando no hay pareja en la tabla de la derecha, todas sus columnas vienen como `NULL`. Filtrar por `IS NULL` en cualquiera de esas columnas nos da exactamente los registros sin pareja.
:::

---

## Cuándo usar LEFT JOIN

Usá LEFT JOIN cuando:

- Querés **conservar todos los registros de tu tabla principal** sin importar si tienen pareja.
- Estás agregando información **opcional** que puede o no existir.
- Necesitás encontrar **"los que no tienen"** algo (con el patrón IS NULL).
- Estás construyendo un reporte donde **cada fila de la izquierda debe aparecer**, incluso si no tiene datos en la tabla de la derecha.

---

*Pilar 1 — SQL · Universidad Nexus · CBC*
