---
sidebar_position: 2
title: Ordenar Datos con ORDER BY
---

# Ordenar Datos con ORDER BY

## ¿Por qué ordenar?

Imagina que recuperas la población de 15 países. Obtienes una lista. Pero, ¿cuál es el más poblado? ¿Cuál el menos? Sin orden, tienes que leerlos todos para saberlo.

`ORDER BY` resuelve eso: organiza los resultados según la columna que elijas, ya sea en orden ascendente (de menor a mayor, o de la A a la Z) o descendente.

---

## Sintaxis básica

```sql
SELECT columnas
FROM tabla
ORDER BY nombre_columna;
```

Por ejemplo, para recuperar los continentes ordenados alfabéticamente:

```sql
SELECT continent
FROM country
ORDER BY continent;
```

> ⚠️ **Posición importante:** `ORDER BY` siempre va después de `FROM` y antes de `LIMIT` si usas ambas cláusulas.

Para columnas numéricas, el orden por defecto es ascendente (de menor a mayor). Para columnas de texto, es alfabético (de la A a la Z).

---

## El valor analítico del orden

Ordenar no es solo presentación. En análisis de datos, el orden revela cosas:

- Ordenar ventas de mayor a menor te muestra inmediatamente quiénes son tus mejores clientes.
- Ordenar fechas te permite ver tendencias temporales.
- Ordenar por error o excepción (valores nulos al final o al inicio) te ayuda a detectar problemas de calidad.

Un resultado bien ordenado comunica. Uno sin orden obliga al lector a hacer el trabajo que tú debiste hacer.

---

## 🎯 Tarea

Escribe una consulta SQL para recuperar la columna `capital` de la tabla `country` y ordenar los resultados alfabéticamente.

<details>
<summary>Ver solución</summary>

```sql
SELECT capital
FROM country
ORDER BY capital;
```

</details>

---

## Desafío: Ordenación por Población

Escribe una consulta SQL para recuperar la columna `population` de la tabla `country` y ordenarla en orden ascendente.

<details>
<summary>Ver solución</summary>

```sql
SELECT population
FROM country
ORDER BY population;
```

</details>

---

*Universidad Nexus — Curso de SQL*
