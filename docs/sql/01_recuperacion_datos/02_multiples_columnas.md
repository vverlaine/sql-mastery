---
sidebar_position: 2
title: Recuperación de Múltiples Columnas
---

# Recuperación de Múltiples Columnas

## Conociendo nuestra tabla: `country`

Antes de escribir consultas más complejas, conviene entender con qué datos estamos trabajando. Un buen analista siempre inspecciona su fuente antes de comenzar a analizarla.

La tabla `country` contiene 15 filas — cada una representa un país distinto — y 7 columnas:

| Columna | Descripción |
|---|---|
| `id` | Identificador único de cada registro |
| `name` | Nombre del país |
| `continent` | Continente donde se ubica |
| `region` | Región específica dentro del continente |
| `SurfaceArea` | Superficie total en km² |
| `capital` | Ciudad capital |
| `population` | Número de habitantes |

> 💡 **Mentalidad analítica:** Antes de responder cualquier pregunta de negocio, pregúntate: ¿qué columnas son realmente relevantes para lo que quiero analizar? No siempre necesitas todos los datos. Seleccionar solo lo necesario hace tus consultas más eficientes y tus resultados más claros.

---

## Seleccionando múltiples columnas

En la práctica, casi siempre necesitarás varias columnas al mismo tiempo para que el resultado tenga contexto. Una sola columna rara vez cuenta la historia completa.

Para recuperar múltiples columnas, enuméralas después de `SELECT` separadas por comas:

```sql
SELECT columna1, columna2, columna3
FROM nombre_tabla;
```

Por ejemplo, para ver el nombre de cada país junto con su continente y región:

```sql
SELECT name, continent, region
FROM country;
```

El resultado mostrará exactamente esas tres columnas para los 15 países, sin información innecesaria.

> ⚠️ **Ojo con el orden:** Las columnas aparecen en el resultado en el mismo orden en que las escribes en el `SELECT`. Esto es útil cuando quieres presentar la información de una manera específica para un reporte o dashboard.

---

## La diferencia entre datos y contexto

Imagina que solo recuperas la columna `population`. Obtienes una lista de números. ¿Qué significan? No lo sabes.

Ahora recuperas `name` y `population` juntos. De repente cada número tiene un nombre, un contexto, una historia. Eso es lo que hace un buen analista: no solo extrae datos, construye contexto.

---

## 🎯 Tarea

Escribe una consulta SQL para obtener las columnas `continent` y `population` de la tabla `country`.

> 💡 Pista: Las columnas deben estar separadas por comas.

<details>
<summary>Ver solución</summary>

```sql
SELECT continent, population
FROM country;
```

</details>

---

*Universidad Nexus — Curso de SQL*
