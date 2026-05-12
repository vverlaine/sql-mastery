---
sidebar_position: 8
title: Otros Errores Comunes
---

# Otros Errores Comunes al Hacer JOINs

La duplicación de registros es el error más peligroso, pero no el único. Estos son los que aparecen con más frecuencia en el trabajo diario.

---

## Error 1: Confundir qué tabla va a la izquierda

En un LEFT JOIN, el **orden importa**. La tabla en el `FROM` es la que conserva todas sus filas. La tabla en el `JOIN` es la que puede quedar con `NULL`.

```sql
-- ¿Cuál es cuál?

-- Versión A: conserva TODOS los vendedores (aunque no tengan ventas)
SELECT vend.nombre_vendedor, COUNT(v.id_venta) AS total_ventas
FROM cbc_cas_dev.universidad.dim_vendedor   vend
LEFT JOIN cbc_cas_dev.universidad.fact_ventas v
    ON vend.id_vendedor = v.id_vendedor
GROUP BY vend.nombre_vendedor;

-- Versión B: conserva TODAS las ventas (y pierde vendedores sin ventas)
SELECT vend.nombre_vendedor, COUNT(v.id_venta) AS total_ventas
FROM cbc_cas_dev.universidad.fact_ventas    v
LEFT JOIN cbc_cas_dev.universidad.dim_vendedor vend
    ON v.id_vendedor = vend.id_vendedor
GROUP BY vend.nombre_vendedor;
```

Las dos queries se ven casi iguales. Las dos corren sin error. Pero devuelven resultados diferentes.

**La pregunta clave antes de escribir el FROM:**
> *¿Cuál es la tabla de la que no quiero perder ningún registro?*

Esa va en el `FROM`.

---

## Error 2: Filtrar en WHERE lo que debería ir en el ON

Este error convierte silenciosamente un LEFT JOIN en un INNER JOIN.

```sql
-- ❌ Parece LEFT JOIN pero actúa como INNER JOIN
SELECT
    v.id_venta,
    d.motivo
FROM cbc_cas_dev.universidad.fact_ventas         v
LEFT JOIN cbc_cas_dev.universidad.fact_devoluciones d
    ON v.id_venta = d.id_venta
WHERE d.motivo = 'Error de pedido';
-- ↑ Esta línea elimina todas las filas donde d.motivo es NULL
--   Es decir, elimina todas las ventas sin devolución
--   Ya no es un LEFT JOIN real
```

¿Por qué pasa esto? Porque el `WHERE` se aplica **después** del JOIN. Las ventas sin devolución ya entraron con `d.motivo = NULL`, y el filtro `WHERE d.motivo = 'Error de pedido'` las elimina todas.

```sql
-- ✅ Correcto: filtrar devoluciones específicas en el ON
SELECT
    v.id_venta,
    d.motivo
FROM cbc_cas_dev.universidad.fact_ventas         v
LEFT JOIN cbc_cas_dev.universidad.fact_devoluciones d
    ON  v.id_venta = d.id_venta
    AND d.motivo   = 'Error de pedido';
-- Ahora: ventas sin devolución por "Error de pedido" aparecen con NULL en motivo
-- Y ventas sin devolución del todo también aparecen con NULL
-- Ninguna desaparece
```

**La regla:**
- Condiciones sobre **cómo se unen las tablas** → van en el `ON`.
- Condiciones sobre **qué filas querés del resultado final** → van en el `WHERE`.

---

## Error 3: Usar columnas ambiguas sin alias de tabla

Cuando dos tablas tienen una columna con el mismo nombre, SQL no sabe a cuál te referís. Eso genera un error o, peor, silenciosamente usa la columna equivocada.

```sql
-- ❌ ¿A cuál id_producto se refiere el SELECT?
SELECT
    id_producto,        -- ¿de fact_ventas o de dim_producto?
    nombre_producto,
    cantidad
FROM cbc_cas_dev.universidad.fact_ventas  v
INNER JOIN cbc_cas_dev.universidad.dim_producto p
    ON v.id_producto = p.id_producto;
```

```sql
-- ✅ Siempre especificá la tabla con el alias
SELECT
    v.id_producto,      -- explícito: viene de fact_ventas
    p.nombre_producto,
    v.cantidad
FROM cbc_cas_dev.universidad.fact_ventas  v
INNER JOIN cbc_cas_dev.universidad.dim_producto p
    ON v.id_producto = p.id_producto;
```

**La práctica recomendada:** Desde el momento en que usás más de una tabla, **siempre** ponés el alias antes de cada columna. Sin excepción.

---

## Error 4: Tipos de datos diferentes en el ON

El JOIN une por valor. Si `id_tienda` es texto (`STRING`) en una tabla y número entero (`INT`) en otra, el JOIN puede fallar o producir resultados incorrectos dependiendo del motor.

```sql
-- Antes de hacer un JOIN con tablas nuevas, verificá los tipos
DESCRIBE TABLE cbc_cas_dev.universidad.fact_ventas;
DESCRIBE TABLE cbc_cas_dev.universidad.dim_tienda;
```

Buscá las columnas que vas a usar en el `ON` y verificá que tengan el mismo tipo. Si no coinciden, podés hacer una conversión explícita:

```sql
-- Si id_tienda es INT en fact_ventas y STRING en dim_tienda:
ON CAST(v.id_tienda AS STRING) = t.id_tienda
```

---

## Checklist antes de correr un JOIN

Antes de ejecutar cualquier JOIN con tablas que no conocés perfectamente, pasá por esta lista:

```
☐ ¿La columna de unión es única en la tabla de la derecha?
  → Si no, vas a duplicar filas

☐ ¿La tabla correcta está en el FROM?
  → La tabla de la que no querés perder registros

☐ ¿Los filtros opcionales están en el ON, no en el WHERE?
  → Si van en el WHERE, convertís LEFT en INNER

☐ ¿Todos los nombres de columna llevan alias de tabla?
  → Evitá ambigüedad desde el inicio

☐ ¿Los tipos de datos en las columnas de unión son iguales?
  → Hacé DESCRIBE si tenés dudas

☐ ¿Contaste filas antes y después del JOIN?
  → Es la verificación final de sanidad
```

---

*Pilar 1 — SQL · Universidad Nexus · CBC*
