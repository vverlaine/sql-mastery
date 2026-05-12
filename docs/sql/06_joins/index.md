---
sidebar_position: 1
title: JOINs — Conectando el Mundo
---

# 🔗 JOINs — Conectando el Mundo

> *"Un analista que no domina los JOINs está condenado a trabajar con una sola tabla a la vez. Y en CBC, los datos nunca viven en una sola tabla."*

---

## ¿Por qué necesitamos los JOINs?

Una base de datos bien diseñada **no repite información**. En lugar de escribir "Pilsener 350ml Botella" en cada una de las 200,000 filas de ventas, guardamos solo `SKU-0001` y dejamos que `dim_producto` tenga el nombre completo. Eso ahorra espacio, evita inconsistencias y hace que los datos sean confiables.

El problema: cuando necesitás analizar, necesitás toda la información junta.

Ahí entran los **JOINs**.

```
fact_ventas              dim_producto
───────────              ────────────
id_venta                 id_producto   ← clave en común
id_producto  ──────────► nombre_producto
cantidad                 presentacion
monto_total              precio_lista
```

Un JOIN le dice a SQL: *"conecta estas dos tablas usando la columna que tienen en común"*.

---

## El modelo de datos que vamos a usar

Antes de escribir un solo JOIN, tenés que entender cómo están conectadas nuestras tablas. Este es el modelo completo:

```
              dim_pais
                 │ id_pais
                 │
              dim_region
                 │ id_region
              ┌──┴────────────────────┐
         dim_tienda              dim_vendedor
              │ id_tienda
              │
┌─────────────────────────────────────────────────┐
│                  fact_ventas                     │
│  id_venta · id_fecha · id_producto · id_tienda  │
│  id_cliente · id_vendedor · fecha_venta · total │
└─────────────────────────────────────────────────┘
      │              │                │
 dim_fecha      dim_producto      dim_cliente
                     │
               dim_categoria
```

Todas las tablas viven en: `cbc_cas_dev.universidad`

---

## Lo que vas a aprender en esta sección

| Lección | Concepto |
|---------|----------|
| 01 | INNER JOIN — Solo lo que existe en ambas tablas |
| 02 | LEFT JOIN — Conservar todo lo de la izquierda |
| 03 | LEFT OUTER JOIN — El sinónimo que debés conocer |
| 04 | FULL JOIN — Auditoría completa de dos fuentes |
| 05 | JOINs encadenados — Unir más de dos tablas |
| 06 | El error más peligroso — Duplicación de registros |
| 07 | Otros errores comunes al hacer JOINs |
| 08 | Desafíos |

---

:::tip Para recordar siempre
Antes de escribir un JOIN preguntate: **¿Qué tabla es mi verdad principal?** Esa va en el `FROM`.
:::

---

*Pilar 1 — SQL · Universidad Nexus · CBC*
