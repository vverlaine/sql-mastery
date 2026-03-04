---
sidebar_position: 2
title: El Ecosistema de Datos
---

# Módulo 2 — El Ecosistema de Datos

## Introducción

Un analista de datos no trabaja en el vacío. Trabaja dentro de un ecosistema: un conjunto de herramientas, sistemas y procesos que juntos hacen posible que los datos lleguen desde su origen hasta tu análisis.

Entender ese ecosistema no es opcional. Si no sabes de dónde vienen los datos, no puedes confiar en ellos. Si no sabes cómo están almacenados, no puedes consultarlos bien. Y si no sabes qué herramientas existen, no puedes elegir la correcta para cada problema.

Este módulo te da el mapa del territorio.

---

## 2.1 ¿Qué es una base de datos?

Una base de datos es una colección organizada de información que puede ser consultada, actualizada y gestionada de forma eficiente. Es la forma en que las organizaciones almacenan sus datos de manera estructurada.

Piensa en ella como un archivo Excel muy evolucionado: en lugar de una hoja con filas y columnas, tienes múltiples tablas relacionadas entre sí, capaces de manejar millones de registros sin perder rendimiento.

### Tipos de bases de datos que encontrarás

**Bases de datos relacionales (SQL)**
Organizan los datos en tablas con filas y columnas. Las tablas se relacionan entre sí a través de claves. Son el estándar para la mayoría de sistemas transaccionales.

Ejemplos: PostgreSQL, MySQL, SQL Server, Oracle.

```
Tabla: clientes          Tabla: pedidos
┌────┬──────────┐        ┌────┬────────────┬──────────┐
│ id │ nombre   │        │ id │ cliente_id │ monto    │
├────┼──────────┤        ├────┼────────────┼──────────┤
│  1 │ Ana      │        │  1 │          1 │  150.00  │
│  2 │ Carlos   │        │  2 │          1 │   89.50  │
│  3 │ María    │        │  3 │          2 │  320.00  │
└────┴──────────┘        └────┴────────────┴──────────┘
```

**Bases de datos no relacionales (NoSQL)**
Almacenan datos en formatos distintos a tablas: documentos JSON, pares clave-valor, grafos, etc. Son útiles para datos no estructurados o de alta velocidad.

Ejemplos: MongoDB, Redis, Cassandra.

**Data Warehouses (Almacenes de datos)**
Bases de datos diseñadas específicamente para análisis. Almacenan grandes volúmenes de datos históricos optimizados para consultas analíticas, no para transacciones.

Ejemplos: Snowflake, BigQuery, Redshift, Azure Synapse.

**Data Lakes**
Repositorios que almacenan datos en su formato crudo (sin estructura previa), ya sean archivos CSV, JSON, imágenes, logs, etc. Son flexibles pero requieren más trabajo para analizarlos.

> 💡 **¿Cuál vas a usar tú?** En este programa trabajarás principalmente con bases de datos relacionales (SQL), Databricks (que combina Data Lake y Data Warehouse) y Power BI para visualización.

---

## 2.2 ¿Cómo viajan los datos? El pipeline de datos

Los datos rara vez llegan listos para analizarse. Pasan por un proceso llamado **pipeline de datos** antes de estar disponibles para ti.

```
FUENTES DE DATOS
(sistemas transaccionales, APIs, archivos, formularios)
        ↓
INGESTA
(los datos se extraen y se mueven al almacén)
        ↓
TRANSFORMACIÓN
(se limpian, normalizan y estructuran)
        ↓
ALMACENAMIENTO
(Data Warehouse / Data Lake)
        ↓
ANÁLISIS Y VISUALIZACIÓN
(SQL, Python, Power BI — aquí entras tú)
        ↓
DECISIÓN DE NEGOCIO
```

Este proceso se conoce también como **ETL**: Extract, Transform, Load (Extraer, Transformar, Cargar). O en arquitecturas más modernas, **ELT**: primero se carga todo y luego se transforma.

### ¿Por qué te importa esto como analista?

Porque cuando encuentras un dato raro o incorrecto, necesitas poder rastrear de dónde vino. ¿Fue un error en la fuente? ¿En la transformación? ¿En el almacenamiento? Sin entender el pipeline, no puedes responder esa pregunta.

---

## 2.3 Tablas, filas y columnas: el lenguaje básico

Toda base de datos relacional organiza sus datos en **tablas**. Una tabla es simplemente un conjunto de datos organizados en:

- **Filas (registros):** cada fila representa una entidad única. Un cliente, una venta, un producto.
- **Columnas (campos):** cada columna representa un atributo de esa entidad. El nombre del cliente, el monto de la venta, el precio del producto.

```
Tabla: ventas
┌────┬────────────┬───────────┬──────────┬──────────────┐
│ id │ fecha      │ producto  │ cantidad │ monto_total  │
├────┼────────────┼───────────┼──────────┼──────────────┤
│  1 │ 2024-01-05 │ Laptop    │        2 │    1,800.00  │
│  2 │ 2024-01-05 │ Mouse     │        5 │       75.00  │
│  3 │ 2024-01-06 │ Teclado   │        3 │      120.00  │
└────┴────────────┴───────────┴──────────┴──────────────┘
```

### Tipos de datos en columnas

No todos los datos son iguales. Las columnas tienen tipos:

| Tipo | Descripción | Ejemplos |
|---|---|---|
| `INTEGER` | Números enteros | 1, 42, -5 |
| `DECIMAL / FLOAT` | Números con decimales | 3.14, 1500.50 |
| `VARCHAR / TEXT` | Texto | "Guatemala", "Laptop" |
| `DATE / DATETIME` | Fechas y horas | 2024-01-05, 2024-01-05 14:30:00 |
| `BOOLEAN` | Verdadero o falso | TRUE, FALSE |

> 💡 **¿Por qué importa el tipo de dato?** Porque no puedes sumar texto, ni comparar fechas como si fueran números. Conocer el tipo de dato de cada columna evita errores en tus análisis.

---

## 2.4 Claves primarias y foráneas: cómo se relacionan las tablas

Las bases de datos relacionales deben su nombre a que las tablas se **relacionan** entre sí. Esto se hace a través de claves.

### Clave Primaria (Primary Key)
Es el identificador único de cada registro en una tabla. No puede repetirse ni estar vacío.

```
Tabla: productos
┌────┬───────────────┬────────┐
│ id │ nombre        │ precio │  ← 'id' es la clave primaria
├────┼───────────────┼────────┤
│  1 │ Laptop        │ 900.00 │
│  2 │ Mouse         │  15.00 │
│  3 │ Teclado       │  40.00 │
└────┴───────────────┴────────┘
```

### Clave Foránea (Foreign Key)
Es una columna en una tabla que referencia la clave primaria de otra tabla, creando la relación entre ambas.

```
Tabla: ventas
┌────┬────────────┬─────────────┬──────────┐
│ id │ fecha      │ producto_id │ cantidad │
├────┼────────────┼─────────────┼──────────┤
│  1 │ 2024-01-05 │           1 │        2 │  ← producto_id 1 = Laptop
│  2 │ 2024-01-05 │           2 │        5 │  ← producto_id 2 = Mouse
└────┴────────────┴─────────────┴──────────┘
```

Esta es la base de los **JOINs** que aprenderás en el Pilar 1: cruzar información de múltiples tablas usando estas relaciones.

---

## 2.5 El stack tecnológico de datos moderno

En el mundo real, un ecosistema de datos moderno combina varias herramientas. Aquí están las que usarás en este programa y cómo encajan:

```
┌─────────────────────────────────────────────────────┐
│                  FUENTES DE DATOS                   │
│   (ERP, CRM, APIs, archivos, formularios web)       │
└───────────────────────┬─────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              DATABRICKS (Pilar 3)                   │
│   Almacenamiento + Procesamiento + Notebooks        │
│   Delta Lake · Spark · SQL · Python                 │
└───────────────────────┬─────────────────────────────┘
                        ↓
┌───────────────────────┴──────────────────┐
│         ANÁLISIS Y DESARROLLO            │
│   SQL (Pilar 1) · Python (Pilar 2)       │
│   VSCode · GitHub (Pilares 3 y 4)        │
└───────────────────────┬──────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│               POWER BI (Pilar 5)                    │
│   Dashboards · Reportes · Storytelling              │
└─────────────────────────────────────────────────────┘
```

---

## 2.6 Datos estructurados vs. no estructurados

No todos los datos tienen la misma forma:

| Tipo | Descripción | Ejemplos | ¿Puedes analizarlos con SQL? |
|---|---|---|---|
| **Estructurados** | Organizados en tablas con esquema fijo | Bases de datos, Excel | Sí, directamente |
| **Semi-estructurados** | Tienen cierta estructura pero flexible | JSON, XML, logs | Con transformación previa |
| **No estructurados** | Sin formato definido | Imágenes, videos, correos, PDFs | No directamente |

> 💡 **En tu día a día:** La mayoría de tu trabajo será con datos estructurados. Pero cada vez más, las organizaciones necesitan analistas que puedan trabajar también con datos semi-estructurados, especialmente logs y datos de APIs.

---

## 2.7 Calidad de datos: el problema más común

Antes de analizar cualquier dato, debes preguntarte: ¿son confiables?

Los problemas de calidad de datos más comunes son:

**Datos faltantes (NULL)**
Registros sin valor en una o más columnas. Pueden ocurrir por errores en la captura, sistemas que no registraron el dato, o por diseño.

**Datos duplicados**
El mismo registro aparece más de una vez. Común cuando se integran datos de múltiples fuentes.

**Datos inconsistentes**
El mismo valor representado de formas distintas: "Guatemala", "GUATEMALA", "Guat.", "GT" — todos representan lo mismo pero el sistema los trata como diferentes.

**Datos erróneos**
Valores que son técnicamente válidos pero incorrectos: una fecha de nacimiento en el año 1800, un precio negativo, una edad de 200 años.

**Datos desactualizados**
Información que fue correcta en su momento pero ya no lo es: un cliente con dirección antigua, un producto descontinuado sin actualizar.

> ⚠️ **Regla fundamental:** Nunca confíes ciegamente en los datos. Siempre valida antes de analizar. Un análisis basado en datos de mala calidad puede llevar a decisiones peores que no tener análisis del todo.

---

## Resumen del Módulo

- Las bases de datos organizan datos en tablas relacionadas entre sí mediante claves primarias y foráneas.
- Los datos pasan por un pipeline (ETL/ELT) antes de estar disponibles para análisis.
- El stack tecnológico de este programa incluye Databricks, SQL, Python, VSCode, GitHub y Power BI.
- Los datos pueden ser estructurados, semi-estructurados o no estructurados.
- La calidad de datos es un desafío constante: siempre valida antes de analizar.

---

## 🎯 Ejercicio Práctico

Sin usar ninguna herramienta, responde en papel o texto:

1. En tu trabajo actual, ¿dónde crees que se almacenan los datos que usas? ¿En Excel, en un sistema, en una base de datos?
2. ¿Has encontrado alguna vez datos duplicados, faltantes o inconsistentes? ¿Qué hiciste con ellos?
3. Si tuvieras que describir el "pipeline" de datos de tu área actual, ¿cómo sería? ¿Desde dónde vienen los datos hasta dónde llegan?

---

*Universidad Nexus — Módulo 2: El Ecosistema de Datos*
