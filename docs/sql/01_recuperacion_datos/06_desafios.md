---
sidebar_position: 6
title: Desafíos — Recuperación de Datos
---

# Desafíos: Recuperación de Datos

Has aprendido los bloques fundamentales: `SELECT`, `FROM`, `DISTINCT` y `LIMIT`. Ahora es momento de consolidar ese conocimiento enfrentándote a problemas por tu cuenta.

> 💡 **Consejo:** Intenta resolver cada desafío antes de ver la solución. La práctica deliberada es lo que convierte el conocimiento teórico en habilidad real.

---

## Desafío 1 — Totales de todas las ventas

Recupera todos los valores de `total` registrados en la tabla. Este es el primer paso para entender la distribución de los montos facturados.

<details>
<summary>Ver solución</summary>

```sql
SELECT total
FROM cbc_cas_dev.universidad.fact_ventas;
```

</details>

---

## Desafío 2 — Productos vendidos

Recupera el SKU de cada venta. Conocer el universo de productos con el que trabajas es siempre el primer paso de cualquier análisis de surtido.

<details>
<summary>Ver solución</summary>

```sql
SELECT id_producto
FROM cbc_cas_dev.universidad.fact_ventas;
```

</details>

---

## Desafío 3 — Ventas con su identificador

:::note Concepto clave: Clave Primaria
La columna `id_venta` funciona como identificador único de cada registro, también llamado **clave primaria** (primary key). Ningún dos registros pueden compartir el mismo `id_venta`. Esto es fundamental porque te permite cruzar información entre tablas con precisión, sin riesgo de confundir registros que puedan tener valores similares. Cuando trabajemos con múltiples tablas, entenderás por qué las claves primarias son la columna vertebral de cualquier base de datos relacional.
:::

Recupera el identificador y el producto de cada venta. Acostúmbrate a incluir el `id_venta` cuando explores datos: te ayudará a referenciar transacciones específicas con exactitud.

<details>
<summary>Ver solución</summary>

```sql
SELECT id_venta, id_producto
FROM cbc_cas_dev.universidad.fact_ventas;
```

</details>

---

## Desafío 4 — Tiendas únicas

Recupera los valores únicos de la columna `id_tienda`. En una tabla de ventas cada transacción está asociada a una tienda, pero varias ventas ocurren en la misma tienda. `DISTINCT` te permite ver cuántas tiendas distintas aparecen en tus datos.

<details>
<summary>Ver solución</summary>

```sql
SELECT DISTINCT id_tienda
FROM cbc_cas_dev.universidad.fact_ventas;
```

</details>

---

## Desafío 5 — Muestra de productos

Recupera 4 valores únicos de la columna `id_producto`. Este tipo de consulta es útil cuando quieres hacerte una idea rápida de cómo están categorizados los datos sin ver la lista completa.

<details>
<summary>Ver solución</summary>

```sql
SELECT DISTINCT id_producto
FROM cbc_cas_dev.universidad.fact_ventas
LIMIT 4;
```

</details>

---

## Resumen de la sección

| Concepto | Qué hace |
|---|---|
| `SELECT columna` | Recupera una columna específica |
| `SELECT col1, col2` | Recupera múltiples columnas |
| `SELECT *` | Recupera todas las columnas |
| `SELECT DISTINCT` | Elimina valores duplicados |
| `LIMIT n` | Restringe el resultado a n filas |

---

*Universidad Nexus — Curso de SQL*
