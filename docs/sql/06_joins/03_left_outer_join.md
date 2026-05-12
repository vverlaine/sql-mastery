---
sidebar_position: 4
title: LEFT OUTER JOIN
---

# LEFT OUTER JOIN — El sinónimo que debés conocer

## La respuesta corta

`LEFT JOIN` y `LEFT OUTER JOIN` son exactamente lo mismo.

```sql
-- Estas dos queries son 100% idénticas:

SELECT v.id_venta, p.nombre_producto
FROM cbc_cas_dev.universidad.fact_ventas    v
LEFT JOIN cbc_cas_dev.universidad.dim_producto p
    ON v.id_producto = p.id_producto;

SELECT v.id_venta, p.nombre_producto
FROM cbc_cas_dev.universidad.fact_ventas    v
LEFT OUTER JOIN cbc_cas_dev.universidad.dim_producto p
    ON v.id_producto = p.id_producto;
```

El `OUTER` es opcional. No cambia el comportamiento. No cambia el resultado. No agrega nada.

---

## ¿Por qué existe entonces?

El estándar SQL fue diseñado para ser explícito. La palabra `OUTER` existe para dejar en claro que es un "outer join" (unión exterior) en contraste con un "inner join" (unión interior).

Con el tiempo, la industria adoptó la versión corta:

| Lo que verás en documentación antigua | Lo que usarás en práctica |
|---------------------------------------|---------------------------|
| `LEFT OUTER JOIN` | `LEFT JOIN` |
| `RIGHT OUTER JOIN` | `RIGHT JOIN` |
| `FULL OUTER JOIN` | `FULL JOIN` |

---

## ¿Por qué te lo mencionamos?

Porque vas a ver código así. Inevitablemente.

Cuando heredes una query de alguien más, cuando leas documentación técnica, cuando busques ejemplos en internet — vas a encontrar `LEFT OUTER JOIN`. Y si no sabés que es lo mismo que `LEFT JOIN`, podés creer que es algo diferente y distinto.

Ahora ya sabés: no lo es.

:::note La regla práctica
En Universidad Nexus usamos `LEFT JOIN` (sin el OUTER). Es más limpio, más corto y es lo que usa la industria hoy. Si ves `LEFT OUTER JOIN` en código ajeno, leelo como `LEFT JOIN` y seguí adelante.
:::

---

*Pilar 1 — SQL · Universidad Nexus · CBC*
