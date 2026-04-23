---
sidebar_position: 2
title: Ordenar Datos con ORDER BY
---

# Ordenar Datos con ORDER BY

## ¿Por qué ordenar?

Imagina que recuperas el total de 55,000 ventas. Obtienes una lista. Pero, ¿cuál es la más alta? ¿Cuál la más baja? Sin orden, tendrías que leerlas todas para saberlo.

`ORDER BY` resuelve eso: organiza los resultados según la columna que elijas, ya sea en orden ascendente (de menor a mayor, o de la A a la Z) o descendente.

---

## Sintaxis básica

```sql
SELECT columnas
FROM tabla
ORDER BY nombre_columna;
```

Por ejemplo, para recuperar los canales ordenados alfabéticamente:

```sql
SELECT canal
FROM cbc_cas_dev.universidad.fact_ventas
ORDER BY canal;
```

> ⚠️ **Posición importante:** `ORDER BY` siempre va después de `FROM` y antes de `LIMIT` si usas ambas cláusulas.

Para columnas numéricas, el orden por defecto es ascendente (de menor a mayor). Para columnas de texto, es alfabético (de la A a la Z).

---

## El valor analítico del orden

Ordenar no es solo presentación. En análisis de datos, el orden revela cosas:

- Ordenar ventas por `total` de mayor a menor te muestra inmediatamente cuáles son las transacciones de mayor valor.
- Ordenar por `fecha_venta` te permite ver tendencias temporales y detectar patrones de estacionalidad.
- Ordenar por error o excepción (valores nulos al final o al inicio) te ayuda a detectar problemas de calidad.

Un resultado bien ordenado comunica. Uno sin orden obliga al lector a hacer el trabajo que tú debiste hacer.

---

## 🎯 Tarea

Escribe una consulta SQL para recuperar la columna `id_producto` de la tabla `cbc_cas_dev.universidad.fact_ventas` y ordenar los resultados alfabéticamente.

<details>
<summary>Ver solución</summary>

```sql
SELECT id_producto
FROM cbc_cas_dev.universidad.fact_ventas
ORDER BY id_producto;
```

</details>

---

## Desafío: Ordenación por Total

Escribe una consulta SQL para recuperar la columna `total` de la tabla `cbc_cas_dev.universidad.fact_ventas` y ordenarla en orden ascendente.

<details>
<summary>Ver solución</summary>

```sql
SELECT total
FROM cbc_cas_dev.universidad.fact_ventas
ORDER BY total;
```

</details>

---

*Universidad Nexus — Curso de SQL*
