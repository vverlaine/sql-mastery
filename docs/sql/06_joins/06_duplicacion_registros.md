---
sidebar_position: 7
title: El Error más Peligroso — Duplicación
---

# El Error más Peligroso — Duplicación de Registros

Este es el error que puede destruir un análisis completo sin que te des cuenta. No genera un mensaje de error. No avisa. Simplemente te devuelve más filas de las que debería — y si no lo detectás, tus números están mal.

---

## ¿Cómo ocurre?

La duplicación ocurre cuando la **columna de unión no es única** en la tabla de la derecha.

Cuando SQL hace un JOIN, por cada fila de la tabla izquierda busca **todas** las filas de la tabla derecha que coincidan. Si encuentra una: perfecto, une las dos. Si encuentra cinco: une la fila izquierda con las cinco filas derechas, generando cinco filas en el resultado.

---

## El caso real: `hist_precios`

La tabla `hist_precios` guarda el historial de precios de cada producto. Eso significa que un mismo SKU puede tener múltiples filas — una por cada período de precio.

```sql
-- Miremos cuántos precios tiene un producto
SELECT id_producto, COUNT(*) AS versiones_de_precio
FROM cbc_cas_dev.universidad.hist_precios
GROUP BY id_producto
ORDER BY versiones_de_precio DESC
LIMIT 5;
```

Si un producto tiene 5 versiones de precio en la tabla, y hacemos un JOIN sin filtrar:

```
fact_ventas                    hist_precios
───────────                    ────────────
F-0001, SKU-0001, cantidad=10  SKU-0001, precio: 1.14
                               SKU-0001, precio: 1.17   ← 5 filas
                               SKU-0001, precio: 1.20      para el
                               SKU-0001, precio: 1.22      mismo SKU
                               SKU-0001, precio: 1.25

Resultado del JOIN sin filtro:
F-0001, SKU-0001, cantidad=10, precio=1.14
F-0001, SKU-0001, cantidad=10, precio=1.17   ← La venta F-0001
F-0001, SKU-0001, cantidad=10, precio=1.20      aparece 5 veces
F-0001, SKU-0001, cantidad=10, precio=1.22
F-0001, SKU-0001, cantidad=10, precio=1.25
```

Si ahora haces `SUM(cantidad)`, estás sumando la cantidad 5 veces. Tu total está inflado 5x. Y nadie te avisó.

---

## El JOIN malo

```sql
-- ❌ ESTO DUPLICA FILAS — no corras esto en producción
SELECT
    v.id_venta,
    v.id_producto,
    v.cantidad,
    h.precio
FROM cbc_cas_dev.universidad.fact_ventas     v
INNER JOIN cbc_cas_dev.universidad.hist_precios h
    ON v.id_producto = h.id_producto;
-- Falta el filtro de período → cada venta aparece N veces
```

---

## Cómo detectarlo

Antes de confiar en cualquier query con JOIN, ejecutá esta verificación:

```sql
-- Paso 1: contá las filas ANTES del JOIN
SELECT COUNT(*) AS filas_originales
FROM cbc_cas_dev.universidad.fact_ventas;

-- Paso 2: contá las filas DESPUÉS del JOIN
SELECT COUNT(*) AS filas_con_join
FROM cbc_cas_dev.universidad.fact_ventas      v
INNER JOIN cbc_cas_dev.universidad.hist_precios h
    ON v.id_producto = h.id_producto;
```

Si `filas_con_join > filas_originales`: **hay duplicación**. El factor de multiplicación te dice cuántas versiones promedio tiene cada SKU en `hist_precios`.

---

## Las dos soluciones correctas

### Solución A: Filtrar directamente en el ON

```sql
-- ✅ Solo el precio vigente
SELECT
    v.id_venta,
    v.id_producto,
    v.cantidad,
    h.precio
FROM cbc_cas_dev.universidad.fact_ventas     v
INNER JOIN cbc_cas_dev.universidad.hist_precios h
    ON  v.id_producto = h.id_producto
    AND h.es_actual   = TRUE;
```

### Solución B: Filtrar con un subquery antes de unir

```sql
-- ✅ Prepará la tabla de la derecha antes del JOIN
SELECT
    v.id_venta,
    v.id_producto,
    v.cantidad,
    precios.precio
FROM cbc_cas_dev.universidad.fact_ventas v
INNER JOIN (
    SELECT id_producto, precio
    FROM cbc_cas_dev.universidad.hist_precios
    WHERE es_actual = TRUE
) AS precios ON v.id_producto = precios.id_producto;
```

Ambas producen el mismo resultado. La Solución B es más legible cuando la lógica de filtro es compleja.

---

## La regla que siempre debés aplicar

> Antes de hacer un JOIN con una tabla que no conocés bien, verificá si la columna de unión es única.

```sql
-- ¿Es id_producto único en hist_precios?
SELECT id_producto, COUNT(*) AS veces
FROM cbc_cas_dev.universidad.hist_precios
GROUP BY id_producto
HAVING COUNT(*) > 1
LIMIT 10;
```

Si esta query devuelve filas: la columna **no es única** y tenés que filtrar antes de unir.

:::danger Este error es silencioso
SQL no va a decirte que duplicaste registros. Te va a devolver el resultado como si nada. La responsabilidad de detectarlo es tuya. Por eso el `COUNT(*)` antes y después del JOIN es una práctica que nunca deberías saltarte cuando trabajás con tablas nuevas.
:::

---

*Pilar 1 — SQL · Universidad Nexus · CBC*
