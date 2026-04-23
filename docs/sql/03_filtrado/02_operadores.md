---
sidebar_position: 3
title: Operadores de Comparación
---

# Operadores de Comparación

## Más allá de la igualdad

La igualdad (`=`) es solo uno de los operadores disponibles en `WHERE`. SQL ofrece un conjunto completo para expresar cualquier condición numérica o textual:

| Operador | Significado |
|---|---|
| `=` | Igual a |
| `<>` | Distinto de |
| `<` | Menor que |
| `<=` | Menor o igual que |
| `>` | Mayor que |
| `>=` | Mayor o igual que |
| `BETWEEN` | Entre dos valores (inclusive) |
| `IS NULL` | Es un valor nulo |

---

## Ejemplos en acción

**Menor que:** Ventas con total menor a 5:

```sql
SELECT id_venta, total
FROM cbc_cas_dev.universidad.fact_ventas
WHERE total < 5;
```

**Menor o igual que:**

```sql
SELECT id_venta, total
FROM cbc_cas_dev.universidad.fact_ventas
WHERE total <= 5;
```

**Distinto de:** Ventas que no son del canal directo:

```sql
SELECT id_venta, canal
FROM cbc_cas_dev.universidad.fact_ventas
WHERE canal <> 'Directo';
```

---

## El operador BETWEEN

Para verificar si un valor está dentro de un rango, usa `BETWEEN` con `AND`:

```sql
SELECT columnas
FROM tabla
WHERE columna BETWEEN valor_inicial AND valor_final;
```

Ejemplo — ventas con total entre 10 y 30:

```sql
SELECT id_venta, total
FROM cbc_cas_dev.universidad.fact_ventas
WHERE total BETWEEN 10 AND 30;
```

`BETWEEN` es inclusivo: incluye los valores del límite inferior y superior.

---

## Valores NULL: el caso especial

Si una columna no contiene ningún dato, su valor es `NULL`. Para verificar si un valor es nulo, no uses `= NULL` — eso no funciona en SQL. Usa `IS NULL`:

```sql
SELECT columnas
FROM tabla
WHERE nombre_columna IS NULL;
```

Ejemplo — ventas que no tienen cliente registrado:

```sql
SELECT id_venta, total
FROM cbc_cas_dev.universidad.fact_ventas
WHERE id_cliente IS NULL;
```

> 💡 **Por qué importa:** Los valores NULL son una fuente frecuente de errores en análisis. En `fact_ventas` hay ventas sin `id_cliente` y sin `id_vendedor` — si no los identificas antes de calcular promedios, sumas o conteos, tus resultados pueden ser incorrectos sin que lo notes.

---

## 🎯 Tareas

**Tarea 1:** Recupera `id_venta`, `total`, `canal` e `id_producto`, solo para ventas del canal `'Distribuidor'`.

<details>
<summary>Ver solución</summary>

```sql
SELECT id_venta, total, canal, id_producto
FROM cbc_cas_dev.universidad.fact_ventas
WHERE canal = 'Distribuidor';
```

</details>

**Tarea 2:** Recupera `id_venta`, `total`, `canal` e `id_producto`, solo para ventas con total mayor o igual a 20.

<details>
<summary>Ver solución</summary>

```sql
SELECT id_venta, total, canal, id_producto
FROM cbc_cas_dev.universidad.fact_ventas
WHERE total >= 20;
```

</details>

**Tarea 3:** Recupera `id_venta`, `id_producto` y `total`, para ventas con total entre 5 y 15. Ordena por `id_producto` de la A a la Z.

<details>
<summary>Ver solución</summary>

```sql
SELECT id_venta, id_producto, total
FROM cbc_cas_dev.universidad.fact_ventas
WHERE total BETWEEN 5 AND 15
ORDER BY id_producto ASC;
```

</details>

**Tarea 4:** Recupera `id_venta` e `id_producto` de las ventas que no tienen vendedor registrado.

<details>
<summary>Ver solución</summary>

```sql
SELECT id_venta, id_producto
FROM cbc_cas_dev.universidad.fact_ventas
WHERE id_vendedor IS NULL;
```

</details>

---

*Universidad Nexus — Curso de SQL*
