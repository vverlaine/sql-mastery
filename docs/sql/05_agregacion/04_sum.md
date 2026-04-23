---
sidebar_position: 5
title: SUM — Suma Total
---

# SUM() — La Suma Total

## ¿Qué hace SUM()?

`SUM()` suma todos los valores de una columna numérica. Es la función de agregación más directamente relacionada con preguntas de negocio como: *¿cuánto vendimos en total? ¿cuál es el ingreso acumulado del trimestre? ¿cuántos productos salieron del almacén?*

```sql
SELECT SUM(total)
FROM cbc_cas_dev.universidad.fact_ventas
WHERE canal = 'Online';
```

Esta consulta calcula la facturación total de todas las ventas online en la tabla.

---

## SUM vs COUNT: la diferencia clave

Es fácil confundirlos, pero hacen cosas distintas:

- `COUNT(*)` te dice **cuántos registros** hay.
- `SUM(columna)` te dice **cuánto suman** los valores de esa columna.

*¿Cuántas ventas hubo online?* → `COUNT(*)` filtrado por `canal = 'Online'`
*¿Cuánto facturamos en online?* → `SUM(total)` filtrado por `canal = 'Online'`

Ambas preguntas son válidas y complementarias. Un buen análisis generalmente responde las dos.

---

## 🎯 Tarea

Escribe una consulta que devuelva la facturación total (`SUM(total)`) de las ventas del canal `'Directo'`.

<details>
<summary>Ver solución</summary>

```sql
SELECT SUM(total)
FROM cbc_cas_dev.universidad.fact_ventas
WHERE canal = 'Directo';
```

</details>

---

## Resumen de funciones de agregación

| Función | Qué calcula | Pregunta típica |
|---|---|---|
| `AVG(col)` | Promedio de los valores | ¿Cuál es el ticket promedio? |
| `COUNT(*)` | Número total de filas | ¿Cuántas ventas hubo? |
| `COUNT(col)` | Filas con valor no nulo | ¿Cuántas ventas tienen cliente identificado? |
| `MAX(col)` | El valor más alto | ¿Cuál fue la venta más alta? |
| `MIN(col)` | El valor más bajo | ¿Cuál fue la venta más baja? |
| `SUM(col)` | Suma de todos los valores | ¿Cuánto facturamos en total? |

> 💡 **Para el analista:** Estas funciones son el puente entre tener datos y tener métricas. Una métrica es un dato resumido que responde una pregunta de negocio. Dominar estas funciones te permite construir cualquier KPI directamente desde SQL.

---

*Universidad Nexus — Curso de SQL*
