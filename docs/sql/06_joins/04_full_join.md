---
sidebar_position: 5
title: FULL JOIN
---

# FULL JOIN — Auditoría completa de dos fuentes

## La regla

El FULL JOIN es el más inclusivo de todos:

> **Devuelve todas las filas de ambas tablas. Si hay pareja, las une. Si no hay pareja en ninguna dirección, rellena con `NULL` del lado que falta.**

```
Tabla A (dim_producto)       Tabla B (fact_ventas)

  ┌─────────────────────────────────────────────────┐
  │                                                 │
  │  productos    │ productos     │  ventas con     │
  │  sin ninguna  │ con ventas    │  SKU que no     │
  │  venta        │ (ambos lados  │  existe en      │
  │  → ventas=NULL│  tienen datos)│  catálogo       │
  │               │               │  → producto=NULL│
  └─────────────────────────────────────────────────┘

  FULL JOIN = todo A + área del medio + todo B
```

---

## Cuándo usar FULL JOIN

El FULL JOIN no es para reportes cotidianos. Es para **auditoría y diagnóstico de datos**:

- Comparar dos fuentes de datos y encontrar discrepancias en ambas direcciones.
- Detectar registros huérfanos de cualquier lado.
- Verificar integridad entre tablas antes de construir un modelo.

---

## Ejemplo: Auditoría de productos vs ventas

¿Hay productos que nunca se vendieron? ¿Hay ventas con un SKU que no existe en el catálogo?

```sql
SELECT
    p.id_producto       AS id_en_catalogo,
    p.nombre_producto,
    v.id_producto       AS id_en_ventas,
    COUNT(v.id_venta)   AS total_ventas
FROM cbc_cas_dev.universidad.dim_producto   p
FULL JOIN cbc_cas_dev.universidad.fact_ventas v
    ON p.id_producto = v.id_producto
GROUP BY 1, 2, 3
ORDER BY total_ventas DESC;
```

**Cómo leer el resultado:**

| id_en_catalogo | nombre_producto | id_en_ventas | total_ventas | Diagnóstico |
|----------------|-----------------|--------------|--------------|-------------|
| SKU-0001 | Pilsener 350ml | SKU-0001 | 4,280 | ✅ Todo bien |
| SKU-0015 | Producto Nuevo | `NULL` | 0 | ⚠️ Producto sin ventas |
| `NULL` | `NULL` | SKU-9999 | 12 | 🔴 SKU fantasma en ventas |

Las tres situaciones dicen cosas diferentes:

- **Ambas columnas tienen valor** → la relación existe, todo normal.
- **`id_en_ventas` es NULL** → hay un producto en el catálogo que nunca se vendió. Puede ser nuevo, descontinuado o simplemente inactivo.
- **`id_en_catalogo` es NULL** → hay ventas con un SKU que no existe en el catálogo. Eso es un problema de datos que alguien tiene que investigar.

---

## Ejemplo: Auditoría de clientes vs tiendas

```sql
SELECT
    t.id_tienda,
    t.nombre_tienda,
    c.id_cliente,
    c.razon_social
FROM cbc_cas_dev.universidad.dim_tienda  t
FULL JOIN cbc_cas_dev.universidad.dim_cliente c
    ON t.id_tienda = c.id_tienda
WHERE t.id_tienda IS NULL OR c.id_cliente IS NULL
ORDER BY t.id_tienda;
```

Esta query muestra solo los casos con discrepancias: tiendas sin clientes registrados, o clientes asignados a una tienda que no existe.

:::tip El FULL JOIN como herramienta de calidad de datos
En proyectos reales, antes de construir cualquier modelo de datos, es buena práctica hacer un FULL JOIN entre las tablas principales para detectar problemas antes de que contaminen los análisis.
:::

---

## Resumen de todos los JOINs

| JOIN | Regla | Úsalo para |
|------|-------|-----------|
| **INNER JOIN** | Solo filas con pareja en ambas tablas | Reportes limpios, datos confiables |
| **LEFT JOIN** | Todas las filas de la izquierda + pareja si existe | Mantener tabla principal completa |
| **LEFT OUTER JOIN** | Idéntico a LEFT JOIN | Lo mismo (es un sinónimo) |
| **FULL JOIN** | Todas las filas de ambas tablas | Auditoría, comparación de fuentes |

---

*Pilar 1 — SQL · Universidad Nexus · CBC*
