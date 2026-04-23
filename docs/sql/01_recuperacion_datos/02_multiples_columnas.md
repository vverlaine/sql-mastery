---
sidebar_position: 2
title: Recuperación de Múltiples Columnas
---

# Recuperación de Múltiples Columnas

## Conociendo nuestra tabla: `fact_ventas`

Antes de escribir consultas más complejas, conviene entender con qué datos estamos trabajando. Un buen analista siempre inspecciona su fuente antes de comenzar a analizarla.

La tabla `cbc_cas_dev.universidad.fact_ventas` contiene 55,000 filas — cada una representa una transacción de venta individual — y 12 columnas:

| Columna | Descripción |
|---|---|
| `id_venta` | Identificador único de la venta (ej. `F-0000001`) |
| `id_fecha` | Fecha de la venta en formato entero `yyyyMMdd` (ej. `20250916`) |
| `fecha_venta` | Fecha de la venta en formato `DATE` |
| `id_tienda` | Identificador de la tienda donde ocurrió la venta |
| `id_cliente` | Identificador del cliente (puede ser nulo) |
| `id_vendedor` | Identificador del vendedor (puede ser nulo) |
| `id_producto` | SKU del producto vendido |
| `cantidad` | Unidades vendidas en la transacción |
| `precio_unitario` | Precio por unidad del producto |
| `descuento` | Monto de descuento aplicado |
| `total` | Monto total cobrado por la venta |
| `canal` | Canal de venta: `Directo`, `Distribuidor` u `Online` |

> 💡 **Mentalidad analítica:** Antes de responder cualquier pregunta de negocio, pregúntate: ¿qué columnas son realmente relevantes para lo que quiero analizar? No siempre necesitas todos los datos. Seleccionar solo lo necesario hace tus consultas más eficientes y tus resultados más claros.

---

## Seleccionando múltiples columnas

En la práctica, casi siempre necesitarás varias columnas al mismo tiempo para que el resultado tenga contexto. Una sola columna rara vez cuenta la historia completa.

Para recuperar múltiples columnas, enuméralas después de `SELECT` separadas por comas:

```sql
SELECT columna1, columna2, columna3
FROM nombre_tabla;
```

Por ejemplo, para ver el identificador de cada venta junto con su canal y la tienda donde ocurrió:

```sql
SELECT id_venta, canal, id_tienda
FROM cbc_cas_dev.universidad.fact_ventas;
```

El resultado mostrará exactamente esas tres columnas para las 55,000 ventas, sin información innecesaria.

> ⚠️ **Ojo con el orden:** Las columnas aparecen en el resultado en el mismo orden en que las escribes en el `SELECT`. Esto es útil cuando quieres presentar la información de una manera específica para un reporte o dashboard.

---

## La diferencia entre datos y contexto

Imagina que solo recuperas la columna `total`. Obtienes una lista de números. ¿Qué significan? ¿De qué ventas son? ¿De qué canal? No lo sabes.

Ahora recuperas `id_venta`, `canal` y `total` juntos. De repente cada número tiene un identificador, un canal, una historia. Eso es lo que hace un buen analista: no solo extrae datos, construye contexto.

---

## 🎯 Tarea

Escribe una consulta SQL para obtener las columnas `id_producto` y `cantidad` de la tabla `cbc_cas_dev.universidad.fact_ventas`.

> 💡 Pista: Las columnas deben estar separadas por comas.

<details>
<summary>Ver solución</summary>

```sql
SELECT id_producto, cantidad
FROM cbc_cas_dev.universidad.fact_ventas;
```

</details>

---

*Universidad Nexus — Curso de SQL*
