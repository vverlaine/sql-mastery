---
sidebar_position: 6
title: JOINs Encadenados
---

# JOINs Encadenados — Unir más de dos tablas

## El concepto

En la realidad, rara vez unís solo dos tablas. Un reporte típico de ventas necesita el nombre del producto, la tienda, la región, el país y el vendedor — todos en simultáneo. Para eso encadenás JOINs.

La lógica es simple: **cada JOIN agrega una tabla nueva al resultado anterior**. El resultado de los dos primeros JOINs se convierte en la "tabla izquierda" del tercer JOIN, y así sucesivamente.

```sql
FROM tabla_principal
JOIN tabla_b ON ...     -- resultado: A + B
JOIN tabla_c ON ...     -- resultado: (A + B) + C
JOIN tabla_d ON ...     -- resultado: ((A + B) + C) + D
```

---

## Ejemplo: La cadena geográfica completa

Ventas → Tienda → Región → País

```sql
SELECT
    v.id_venta,
    v.fecha_venta,
    v.total,
    t.nombre_tienda,
    t.tipo_tienda,
    r.nombre_region,
    p.nombre_pais
FROM cbc_cas_dev.universidad.fact_ventas      v
INNER JOIN cbc_cas_dev.universidad.dim_tienda  t ON v.id_tienda = t.id_tienda
INNER JOIN cbc_cas_dev.universidad.dim_region  r ON t.id_region = r.id_region
INNER JOIN cbc_cas_dev.universidad.dim_pais    p ON r.id_pais   = p.id_pais
LIMIT 20;
```

Notá la cadena:
- `fact_ventas` conecta a `dim_tienda` por `id_tienda`
- `dim_tienda` conecta a `dim_region` por `id_region`
- `dim_region` conecta a `dim_pais` por `id_pais`

Así se navega el modelo de datos, tabla por tabla.

---

## Ejemplo: El reporte completo de ventas

```sql
SELECT
    v.id_venta,
    v.fecha_venta,
    p.nombre_pais,
    r.nombre_region,
    t.nombre_tienda,
    vend.nombre_vendedor,
    prod.nombre_producto,
    cat.nombre_categoria,
    v.cantidad,
    v.total
FROM cbc_cas_dev.universidad.fact_ventas        v
INNER JOIN cbc_cas_dev.universidad.dim_tienda   t    ON v.id_tienda    = t.id_tienda
INNER JOIN cbc_cas_dev.universidad.dim_region   r    ON t.id_region    = r.id_region
INNER JOIN cbc_cas_dev.universidad.dim_pais     p    ON r.id_pais      = p.id_pais
INNER JOIN cbc_cas_dev.universidad.dim_vendedor vend ON v.id_vendedor  = vend.id_vendedor
INNER JOIN cbc_cas_dev.universidad.dim_producto prod ON v.id_producto  = prod.id_producto
INNER JOIN cbc_cas_dev.universidad.dim_categoria cat ON prod.id_categoria = cat.id_categoria
LIMIT 50;
```

Con 6 JOINs tenemos un reporte completamente enriquecido. Este tipo de query es la base de la mayoría de análisis reales.

---

## Mezclando tipos de JOIN

Podés combinar INNER y LEFT JOINs en la misma query. De hecho, es muy común:

```sql
-- Ventas con toda la info geográfica (INNER) 
-- y con devoluciones si existen (LEFT)
SELECT
    v.id_venta,
    v.fecha_venta,
    t.nombre_tienda,
    r.nombre_region,
    v.total,
    d.monto_devuelto,
    d.motivo
FROM cbc_cas_dev.universidad.fact_ventas         v
INNER JOIN cbc_cas_dev.universidad.dim_tienda    t ON v.id_tienda = t.id_tienda
INNER JOIN cbc_cas_dev.universidad.dim_region    r ON t.id_region = r.id_region
LEFT  JOIN cbc_cas_dev.universidad.fact_devoluciones d ON v.id_venta = d.id_venta
LIMIT 30;
```

La lógica: queremos que cada venta tenga su tienda y región (por eso INNER), pero la devolución es opcional (por eso LEFT).

---

## Buenas prácticas al encadenar JOINs

**1. Alineá los ON verticalmente**

```sql
-- ✅ Fácil de leer
INNER JOIN dim_tienda   t    ON v.id_tienda   = t.id_tienda
INNER JOIN dim_region   r    ON t.id_region   = r.id_region
INNER JOIN dim_pais     p    ON r.id_pais     = p.id_pais

-- ❌ Difícil de seguir
INNER JOIN dim_tienda t ON v.id_tienda = t.id_tienda
INNER JOIN dim_region r ON t.id_region = r.id_region
INNER JOIN dim_pais p ON r.id_pais = p.id_pais
```

**2. Usá siempre alias cortos y consistentes**

```sql
-- ✅ Alias claros
FROM fact_ventas      v
JOIN dim_tienda       t
JOIN dim_region       r
JOIN dim_producto     prod
JOIN dim_categoria    cat
```

**3. Construí el JOIN paso a paso**

Si tenés dudas, empezá con dos tablas, verificá el resultado, luego agregá una tercera, verificá, y así. No escribas 6 JOINs de golpe sin validar.

---

*Pilar 1 — SQL · Universidad Nexus · CBC*
