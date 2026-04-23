---
sidebar_position: 3
title: Recuperación de Todas las Columnas
---

# Recuperación de Todas las Columnas

## El asterisco: comodín poderoso

Cuando necesitas ver todas las columnas de una tabla de un solo vistazo, SQL ofrece un atajo: el asterisco `*`. En lugar de escribir el nombre de cada columna, lo usas como comodín:

```sql
SELECT *
FROM nombre_tabla;
```

En nuestro caso:

```sql
SELECT *
FROM cbc_cas_dev.universidad.fact_ventas;
```

Esto devuelve las 12 columnas completas (`id_venta`, `id_fecha`, `fecha_venta`, `id_tienda`, `id_cliente`, `id_vendedor`, `id_producto`, `cantidad`, `precio_unitario`, `descuento`, `total`, `canal`) para las 55,000 ventas.

---

## ¿Cuándo usar SELECT * y cuándo no?

Aquí viene una distinción que separa a un analista cuidadoso de uno descuidado.

**Úsalo cuando:**
- Estás explorando una tabla por primera vez y quieres entender su estructura.
- Trabajas en un entorno de desarrollo o pruebas.
- La tabla es pequeña y realmente necesitas todos sus datos.

**Evítalo cuando:**
- Trabajas con tablas de producción que tienen decenas de columnas: traer datos que no necesitas consume recursos innecesarios.
- Tu consulta será la base de un reporte o análisis: siempre es mejor ser explícito sobre qué columnas usas. Así tu código es más legible y mantenible.
- La tabla tiene columnas sensibles que no deberían aparecer en tu análisis.

> 💡 **Mentalidad analítica:** En el mundo real, las bases de datos pueden tener tablas con 50, 100 o más columnas. Usar `SELECT *` en esos casos es como pedir el menú completo de un restaurante cuando solo quieres el postre. Sé intencional con los datos que solicitas.

---

## 🎯 Tarea

Escribe una consulta SQL para recuperar todas las columnas de la tabla `cbc_cas_dev.universidad.fact_ventas`.

<details>
<summary>Ver solución</summary>

```sql
SELECT *
FROM cbc_cas_dev.universidad.fact_ventas;
```

</details>

---

*Universidad Nexus — Curso de SQL*
