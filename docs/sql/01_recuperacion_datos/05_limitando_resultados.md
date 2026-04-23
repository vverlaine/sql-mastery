---
sidebar_position: 5
title: Limitando Resultados
---

# Limitando Resultados

## ¿Por qué limitar?

En la práctica, las tablas reales no tienen 100 filas: tienen miles, millones o incluso miles de millones de registros. Nuestra tabla de ventas ya tiene 55,000 filas — traer todas esas cada vez que ejecutas una consulta no solo es innecesario, sino que puede ser costoso en tiempo y recursos computacionales.

La cláusula `LIMIT` te permite controlar exactamente cuántas filas quieres recibir:

```sql
SELECT columnas
FROM tabla
LIMIT cantidad_de_filas;
```

Por ejemplo, para ver solo las primeras 7 ventas:

```sql
SELECT id_venta, total
FROM cbc_cas_dev.universidad.fact_ventas
LIMIT 7;
```

`LIMIT` siempre va al final de la consulta.

---

## Usos reales de LIMIT en análisis

**Exploración rápida:** Cuando te conectas a una tabla desconocida, un `SELECT * FROM tabla LIMIT 10` te da una muestra representativa sin saturar tu pantalla ni tu conexión.

**Verificar antes de ejecutar:** Antes de correr una consulta compleja sobre 55,000 registros (o millones en tablas reales), pruébala con `LIMIT 100` para confirmar que el resultado tiene el aspecto que esperas. Es como revisar el borrador antes de enviar.

**Top N:** Combinado con `ORDER BY` (que veremos en la siguiente sección), `LIMIT` te permite obtener las 10 ventas más altas, los 5 productos más cotizados o las 3 tiendas con mayor volumen.

> ⚠️ **Importante:** Sin `ORDER BY`, `LIMIT` devuelve las primeras filas en el orden en que están almacenadas internamente, lo cual no siempre es predecible. Para resultados significativos como "las 3 ventas más altas", siempre combina `LIMIT` con `ORDER BY`.

---

## Combinando DISTINCT y LIMIT

Las cláusulas se pueden combinar. Por ejemplo, para ver solo 3 tiendas únicas:

```sql
SELECT DISTINCT id_tienda
FROM cbc_cas_dev.universidad.fact_ventas
LIMIT 3;
```

El orden de ejecución importa: primero SQL obtiene los valores únicos con `DISTINCT`, luego recorta el resultado a 3 filas con `LIMIT`.

---

## 🎯 Tarea

Escribe una consulta SQL para obtener 3 valores distintos de `canal` de la tabla `cbc_cas_dev.universidad.fact_ventas`.

<details>
<summary>Ver solución</summary>

```sql
SELECT DISTINCT canal
FROM cbc_cas_dev.universidad.fact_ventas
LIMIT 3;
```

</details>

---

*Universidad Nexus — Curso de SQL*
