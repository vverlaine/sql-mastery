---
sidebar_position: 6
title: Desafíos — Recuperación de Datos
---

# Desafíos: Recuperación de Datos

Has aprendido los bloques fundamentales: `SELECT`, `FROM`, `DISTINCT` y `LIMIT`. Ahora es momento de consolidar ese conocimiento enfrentándote a problemas por tu cuenta.

> 💡 **Consejo:** Intenta resolver cada desafío antes de ver la solución. La práctica deliberada es lo que convierte el conocimiento teórico en habilidad real.

---

## Desafío 1 — Población de los países

Recupera todos los valores de población registrados en la tabla. Este es el primer paso para entender la distribución demográfica.

<details>
<summary>Ver solución</summary>

```sql
SELECT population
FROM country;
```

</details>

---

## Desafío 2 — Nombres de todos los países

Recupera los nombres de todos los países. Conocer el universo de registros con el que trabajas es siempre el primer paso de cualquier análisis.

<details>
<summary>Ver solución</summary>

```sql
SELECT name
FROM country;
```

</details>

---

## Desafío 3 — Países con sus identificadores

:::note Concepto clave: Clave Primaria
La columna `id` funciona como identificador único de cada registro, también llamado **clave primaria** (primary key). Ningún dos registros pueden compartir el mismo `id`. Esto es fundamental porque te permite cruzar información entre tablas con precisión, sin riesgo de confundir registros que puedan tener nombres similares. Cuando trabajemos con múltiples tablas, entenderás por qué las claves primarias son la columna vertebral de cualquier base de datos relacional.
:::

Recupera el identificador y el nombre de cada país. Acostúmbrate a incluir el `id` cuando explores datos: te ayudará a referenciar registros específicos con exactitud.

<details>
<summary>Ver solución</summary>

```sql
SELECT id, name
FROM country;
```

</details>

---

## Desafío 4 — Capitales únicas

Recupera los valores únicos de la columna `capital`. En una tabla bien estructurada cada país tiene una capital diferente, pero en bases de datos reales es común encontrar duplicados o inconsistencias. `DISTINCT` es un buen hábito de validación.

<details>
<summary>Ver solución</summary>

```sql
SELECT DISTINCT capital
FROM country;
```

</details>

---

## Desafío 5 — Muestra de regiones

Recupera 4 valores únicos de la columna `region`. Este tipo de consulta es útil cuando quieres hacerte una idea rápida de cómo están categorizados los datos sin ver la lista completa.

<details>
<summary>Ver solución</summary>

```sql
SELECT DISTINCT region
FROM country
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
