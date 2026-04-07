---
sidebar_position: 4
title: Trabajando en Databricks
---

# Trabajando en Databricks

Antes de seguir aprendiendo funciones de Spark, conviene que conozcas el entorno donde vas a ejecutar todo: los notebooks de Databricks. Si entiendes bien cómo funcionan, vas a trabajar mucho más rápido.

---

## ¿Qué es un notebook?

Un notebook es un documento interactivo dividido en celdas. Cada celda puede contener código o texto. Y cada celda se ejecuta de forma independiente, mostrando su resultado justo debajo.

Esta forma de trabajar es muy diferente a escribir un script tradicional. En vez de escribir todo el código y ejecutarlo de golpe al final, en un notebook trabajas paso a paso: pruebas algo, ves el resultado, ajustas, sigues. Es mucho más natural para análisis de datos.

```
┌─────────────────────────────────────────────┐
│  Celda 1 (Python)                            │
│  ventas = spark.table("ventas")              │
│  ventas.count()                              │
├─────────────────────────────────────────────┤
│  → 1,500,000                                 │
├─────────────────────────────────────────────┤
│  Celda 2 (Markdown)                          │
│  ## Análisis por región                      │
├─────────────────────────────────────────────┤
│  Celda 3 (SQL)                               │
│  SELECT region, COUNT(*) FROM ventas         │
│  GROUP BY region                             │
├─────────────────────────────────────────────┤
│  → tabla con resultados                      │
└─────────────────────────────────────────────┘
```

---

## Tipos de celdas

En Databricks puedes mezclar varios tipos de contenido en un mismo notebook:

### Celdas de código Python
Son las más comunes. Ejecutan código Python y muestran el resultado debajo.

```python
ventas = spark.table("ventas")
display(ventas)
```

### Celdas de SQL
Puedes escribir SQL directamente sin tener que envolverlo en `spark.sql()`. Para eso, agregas `%sql` como primera línea de la celda:

```python
%sql
SELECT region, COUNT(*) AS num_ventas
FROM ventas
GROUP BY region
ORDER BY num_ventas DESC
```

> 💡 **Útil saber:** El comando `%sql` se llama "magic command". Le dice a Databricks que esa celda es SQL en lugar de Python. Hay otros como `%md` para markdown, `%python` para Python explícito, etc.

### Celdas de markdown
Para escribir explicaciones, encabezados, listas. No ejecutan código, solo muestran texto formateado. Perfecto para documentar tu análisis.

```python
%md
# Análisis de ventas trimestrales
Este notebook calcula las métricas principales por región.
```

---

## El flujo de trabajo recomendado

Cuando empieces a hacer análisis en notebooks, sigue este patrón:

### 1. Carga y exploración inicial
```python
ventas = spark.table("ventas")
ventas.printSchema()
print(f"Total de filas: {ventas.count():,}")
```

### 2. Vista rápida de los datos
```python
display(ventas)
```

### 3. Validación con DISTINCT
```python
%sql
SELECT DISTINCT region FROM ventas
```

### 4. Tu análisis
```python
%sql
SELECT region, SUM(monto) AS total
FROM ventas
GROUP BY region
ORDER BY total DESC
```

### 5. Documentación
Agrega celdas markdown explicando qué descubriste y cualquier consideración importante.

> 💡 **Tip de productividad:** Trata tu notebook como un análisis publicable. Si alguien más lo abre dentro de un mes, ¿podría entender qué hiciste y por qué? Si la respuesta es no, falta documentación.

---

## Atajos de teclado esenciales

Aprenderlos te ahorra muchísimo tiempo. Estos son los más útiles:

| Atajo | Acción |
|---|---|
| `Shift + Enter` | Ejecutar la celda actual y pasar a la siguiente |
| `Ctrl + Enter` (`Cmd + Enter` en Mac) | Ejecutar la celda actual sin moverse |
| `Esc + A` | Insertar una celda nueva arriba |
| `Esc + B` | Insertar una celda nueva abajo |
| `Esc + D + D` | Borrar la celda actual |
| `Esc + M` | Convertir celda a markdown |
| `Esc + Y` | Convertir celda a código |

> 💡 Practica estos atajos los primeros días, aunque al principio sea más lento que usar el mouse. En una semana vas a trabajar el doble de rápido.

---

## Buenas prácticas

### Una idea por celda
No metas 50 líneas de código en una sola celda. Si una celda hace cargar, transformar y mostrar, divídela en tres celdas. Así puedes ejecutar cada parte por separado y ver dónde algo falla.

### Nombra tus DataFrames con claridad
```python
# Mal
df = spark.table("ventas")
df2 = df.filter(...)
df3 = df2.groupBy(...)

# Bien
ventas = spark.table("ventas")
ventas_norte = ventas.filter(...)
ventas_norte_por_mes = ventas_norte.groupBy(...)
```

### Usa display() en vez de print() para DataFrames
`print(ventas)` te muestra una representación poco útil. `display(ventas)` te da una tabla interactiva. Siempre prefiere `display()` cuando estés en Databricks.

### Comenta tu código cuando no sea obvio
```python
# Filtramos solo ventas mayores a $1000 porque las menores son ruido del sistema
ventas_validas = ventas.filter(ventas.monto > 1000)
```

---

## Errores comunes al empezar

### 1. Olvidar ejecutar una celda
Si modificas una celda pero no la ejecutas, las celdas siguientes siguen usando la versión vieja. Cuando algo no funciona como esperas, lo primero es preguntarte: ¿ejecuté la celda donde lo cambié?

### 2. Variables que no existen porque no ejecutaste la celda anterior
```python
# Celda 1 (no la has ejecutado)
ventas = spark.table("ventas")

# Celda 2
ventas.count()  # Error: 'ventas' no está definido
```

Si abres un notebook por primera vez, lo más seguro es ejecutar todas las celdas en orden desde el principio.

### 3. Confiar en `print()` cuando tu objeto es un DataFrame
`print(ventas)` te muestra algo como `DataFrame[id: int, fecha: date, ...]`. No te muestra los datos. Para verlos, usa `display(ventas)` o `ventas.show()`.

---

## 🎯 Ejercicio

En un notebook nuevo de Databricks:

1. Crea una celda markdown con el título de tu análisis: "Mi primer análisis con Spark".
2. Crea una celda Python que cargue la tabla `ventas` y muestre las primeras 5 filas con `display()`.
3. Crea una celda SQL (con `%sql`) que cuente cuántas ventas hay por país.
4. Crea otra celda markdown explicando qué descubriste.
5. Practica los atajos: navegar entre celdas, insertar, borrar.

No hay solución única. La idea es que te familiarices con el entorno antes de pasar a la siguiente sección.

---

*Universidad Nexus — Curso de Python y Spark*
