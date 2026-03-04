---
sidebar_position: 1
title: Recuperación de Columnas Individuales
---

# Recuperación de Columnas Individuales

## ¿Qué es SQL y por qué te importa?

SQL (Structured Query Language) es el lenguaje estándar para comunicarse con bases de datos relacionales. Con él puedes consultar, insertar, modificar y eliminar datos, además de controlar quién tiene acceso a qué información.

Pero más allá de la definición técnica, SQL es el idioma con el que los analistas de datos le hacen preguntas a la información de una organización. Dominarlo no solo te permite extraer datos: te da el poder de ir directo a la fuente, en lugar de esperar que alguien más lo haga por ti.

---

## ¿Qué es una base de datos?

Una base de datos es una colección organizada de información, estructurada de forma que sea fácil de acceder, gestionar y actualizar. Piensa en ella como un Excel muy evolucionado: misma lógica de filas y columnas, pero capaz de manejar millones de registros, mantener relaciones entre distintos conjuntos de datos y garantizar que la información no se corrompa.

En el mundo real, las empresas almacenan en bases de datos todo lo que importa: ventas, clientes, inventarios, transacciones. Como analista, tu trabajo comienza aquí.

---

## Tu primera consulta: SELECT y FROM

Para recuperar datos de una tabla, SQL usa la sentencia `SELECT`. Su estructura más básica es:

```sql
SELECT nombre_columna
FROM nombre_tabla;
```

- `SELECT` indica **qué columnas** quieres ver.
- `FROM` indica **de dónde** vienen esos datos.

### Ejemplo

Para consultar el continente de cada país en nuestra tabla:

```sql
SELECT continent
FROM country;
```

Esta consulta le dice al motor de base de datos: *"Dame todos los valores de la columna `continent` de la tabla `country`."* El resultado es una lista con el continente de cada fila registrada.

> ⚠️ **Buena práctica:** Escribe siempre las palabras clave de SQL (`SELECT`, `FROM`, `WHERE`, etc.) en mayúsculas. No es obligatorio técnicamente, pero hace tu código mucho más legible para ti y para cualquier persona que lo revise después.

---

## ¿Por qué esto importa para un analista?

Puede parecer trivial recuperar una sola columna. Pero este es el fundamento de todo lo que viene. Cada análisis complejo que harás en el futuro empieza exactamente aquí: identificar qué dato necesitas y de dónde viene.

Un analista que sabe hacer esta pregunta de forma precisa ahorra tiempo, evita errores y comunica con claridad qué está buscando.

---

## 🎯 Tarea

Escribe una consulta SQL para recuperar la columna `capital` de la tabla `country`.

<details>
<summary>Ver solución</summary>

```sql
SELECT capital
FROM country;
```

</details>

---

*Universidad Nexus — Curso de SQL*
