---
sidebar_position: 4
title: Unity Catalog y la Sintaxis de Tres Niveles
---

# Unity Catalog y la Sintaxis de Tres Niveles

Hasta ahora, cada vez que cargabas una tabla escribías algo como `spark.table("ventas")`. Funcionaba en los ejemplos del curso, pero en producción CBC usa **Unity Catalog**, y eso cambia un poco la forma de referenciar las tablas.

No te asustes: el cambio es pequeño y vale la pena entenderlo bien. Una vez que lo internalizas, todo fluye igual.

---

## ¿Qué es Unity Catalog?

Unity Catalog es la solución de gobernanza de datos de Databricks. En palabras simples: es el sistema que organiza, protege y controla el acceso a TODAS las tablas de CBC en un solo lugar.

Antes de Unity Catalog, las tablas vivían en espacios separados por workspace. Si tenías dos workspaces (uno de desarrollo y uno de producción), las tablas no se compartían fácilmente. Cada equipo tenía sus propias tablas duplicadas, y nadie tenía una vista global.

Unity Catalog resuelve esto: todas las tablas viven en un solo catálogo central, con permisos centralizados y trazabilidad completa.

---

## Por qué importa para ti como analista

Para ti, los beneficios concretos son:

- **Acceso unificado**: las tablas están en un solo lugar, no las buscas por todos lados
- **Permisos claros**: sabes exactamente a qué tienes acceso y a qué no
- **Trazabilidad (lineage)**: puedes ver qué tablas alimentan a qué reportes
- **Descubrimiento**: puedes buscar tablas, ver sus columnas, sus descripciones, sus dueños
- **Seguridad**: las columnas sensibles pueden estar enmascaradas según tu rol

> 💡 **En la práctica:** Unity Catalog convierte el "data swamp" (pantano de datos desorganizados) en un "data lake" verdadero, organizado y gobernado. Es la diferencia entre buscar un archivo en un escritorio caótico y buscarlo en un sistema de carpetas bien estructurado.

---

## La estructura de tres niveles

Esta es la idea más importante de toda la lección. En Unity Catalog, una tabla se identifica con TRES niveles, no uno:

```
catalog.schema.table
```

Veamos qué es cada nivel:

### 1. Catalog (catálogo)
Es el nivel más alto. Agrupa schemas relacionados. Típicamente representa un dominio de negocio o un ambiente. Por ejemplo:

- `prod` — datos de producción
- `dev` — datos de desarrollo
- `sandbox` — espacio para pruebas
- `analytics` — catálogo para analítica

En CBC podrías ver catálogos como `cbc_prod`, `cbc_dev`, etc.

### 2. Schema (esquema, antes llamado "database")
Dentro de cada catálogo, los schemas agrupan tablas relacionadas. Típicamente representa un sistema fuente, un equipo o un proceso. Por ejemplo:

- `ventas` — todas las tablas relacionadas con ventas
- `marketing` — tablas del equipo de marketing
- `finanzas` — tablas financieras

### 3. Table (tabla)
El nivel más bajo: la tabla específica que quieres consultar.

### Ejemplo completo

Si quieres acceder a las ventas en producción:

```python
ventas = spark.table("cbc_prod.ventas.transacciones")
```

Eso significa: catálogo `cbc_prod`, schema `ventas`, tabla `transacciones`.

> ⚠️ **Importante:** Los nombres exactos de catálogos y schemas en CBC pueden ser distintos a los del ejemplo. Pregúntale a tu lead cuáles son los correctos para tu equipo. La estructura de tres niveles siempre aplica, solo cambian los nombres.

---

## Cargar tablas con la nueva sintaxis

Todo lo que aprendiste en el módulo anterior funciona igual, solo cambia cómo te refieres a la tabla:

### Antes (ejemplos del curso)
```python
ventas = spark.table("ventas")
productos = spark.table("productos")
```

### Ahora (con Unity Catalog en CBC)
```python
ventas = spark.table("cbc_prod.ventas.transacciones")
productos = spark.table("cbc_prod.productos.catalogo")
```

El resto de las operaciones que aprendiste — `select`, `filter`, `groupBy`, `join` — funcionan exactamente igual.

### Lo mismo aplica para spark.sql()

```python
resultado = spark.sql("""
    SELECT region, SUM(monto) AS total
    FROM cbc_prod.ventas.transacciones
    WHERE pais = 'Guatemala'
    GROUP BY region
""")
```

---

## Configurar el catálogo y schema por defecto

Escribir `cbc_prod.ventas.transacciones` cada vez se vuelve tedioso. Por eso Spark te permite establecer un catálogo y schema por defecto al inicio de tu notebook:

```python
spark.sql("USE CATALOG cbc_prod")
spark.sql("USE SCHEMA ventas")
```

Después de esas dos líneas, puedes referirte a la tabla solo por su nombre:

```python
transacciones = spark.table("transacciones")  # equivale a cbc_prod.ventas.transacciones
```

> 💡 **Buen hábito:** Configura el catálogo y schema al inicio de cada notebook con celdas dedicadas. Hace tu código mucho más legible y evita errores de tipeo en nombres largos.

### Equivalente desde celdas SQL

Si trabajas en celdas `%sql`, lo escribes así:

```sql
%sql
USE CATALOG cbc_prod;
USE SCHEMA ventas;

SELECT * FROM transacciones LIMIT 10;
```

---

## Explorar el catálogo desde la interfaz

Databricks te da una forma visual de explorar Unity Catalog. En el menú lateral izquierdo, click en **Catalog**.

Vas a ver una vista de árbol con todos los catálogos a los que tienes acceso. Puedes navegar:

```
cbc_prod
├── ventas
│   ├── transacciones
│   ├── productos
│   └── clientes
├── marketing
│   └── campanias
└── finanzas
    └── facturacion
```

Click en cualquier tabla para ver:

- **Schema**: las columnas con sus tipos
- **Sample Data**: un preview de los datos
- **Details**: dueño, fecha de creación, ubicación de almacenamiento
- **Permissions**: quién tiene acceso
- **Lineage**: de qué tablas viene y a qué tablas alimenta

> 💡 **Esto es oro para un analista:** En vez de adivinar qué columnas tiene una tabla, vas al Catalog Explorer y las ves directamente. En vez de preguntar de dónde vienen los datos, miras el lineage. Te ahorra muchísimas reuniones y mensajes.

---

## Listar lo que tienes disponible desde código

A veces necesitas explorar mediante código en lugar de usar la interfaz. Spark te permite hacerlo con SQL puro:

### Ver todos los catálogos
```python
spark.sql("SHOW CATALOGS").show()
```

### Ver todos los schemas de un catálogo
```python
spark.sql("SHOW SCHEMAS IN cbc_prod").show()
```

### Ver todas las tablas de un schema
```python
spark.sql("SHOW TABLES IN cbc_prod.ventas").show()
```

### Ver las columnas de una tabla específica
```python
spark.sql("DESCRIBE TABLE cbc_prod.ventas.transacciones").show()
```

Estas consultas son útiles cuando estás escribiendo código que necesita adaptarse dinámicamente a las tablas disponibles, o cuando estás documentando un proceso.

---

## Permisos: qué puedes y qué no puedes hacer

Unity Catalog tiene un sistema de permisos detallado. Como analista, los más relevantes para ti son:

| Permiso | Qué te permite hacer |
|---|---|
| `USE CATALOG` | Ver el catálogo en la lista |
| `USE SCHEMA` | Ver el schema dentro del catálogo |
| `SELECT` | Leer datos de una tabla |
| `MODIFY` | Modificar datos (insertar, actualizar, borrar) |
| `CREATE TABLE` | Crear nuevas tablas |
| `ALL PRIVILEGES` | Todo lo anterior |

Como analista típicamente vas a tener `SELECT` sobre las tablas de tu dominio, y posiblemente `CREATE TABLE` sobre un schema específico para guardar resultados intermedios.

> ⚠️ **Si te da un error de permisos**, no asumas que el sistema está roto. Probablemente realmente no tienes ese permiso. Reporta a tu lead qué tabla intentaste acceder y qué operación querías hacer. Con esa info te puede dar acceso o explicarte por qué no.

---

## 🎯 Tareas

**Tarea 1:** Abre el Catalog Explorer en Databricks y explora los catálogos disponibles. Identifica cuál es el de producción de CBC.

**Tarea 2:** Encuentra la tabla de ventas reales en CBC. Anota su path completo en formato `catalog.schema.table`.

**Tarea 3:** Carga esa tabla en un notebook usando la sintaxis de tres niveles. Ejecuta `printSchema()` y `count()`.

**Tarea 4:** Configura el catálogo y schema por defecto al inicio del notebook con `USE CATALOG` y `USE SCHEMA`. Después carga la misma tabla solo por su nombre y verifica que funciona igual.

**Tarea 5:** Usa `SHOW TABLES IN <tu_schema>` para listar todas las tablas disponibles en tu schema de trabajo. ¿Hay alguna que no conocías?

---

*Universidad Nexus — Curso de Databricks y VSCode*
