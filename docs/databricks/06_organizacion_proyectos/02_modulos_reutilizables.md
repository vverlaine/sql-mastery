---
sidebar_position: 3
title: Módulos Reutilizables
---

# Módulos Reutilizables

En la lección anterior viste que el código compartido vive en `lib/`. Pero ¿cómo se diseña ese código para que realmente sea útil? ¿Cuándo extraer una función? ¿Cómo organizarlas dentro de archivos? ¿Cómo importarlas desde notebooks?

Esta lección te da las herramientas para construir tu propia biblioteca interna que crece con tu carrera.

---

## La regla de las dos veces

Hay una regla simple para decidir cuándo extraer código a un módulo:

> **Si vas a usar el mismo código DOS veces, extráelo a una función.**

No "tres veces". No "cuando me canse". Dos veces. Por dos razones:

1. **Consistencia**: si la lógica vive en un solo lugar, no puedes tener dos versiones que divergen
2. **Mantenimiento**: si hay un bug, lo arreglas una vez y se arregla en todas partes

Algunos analistas siguen una regla aún más estricta: extrae cualquier código que tenga lógica de negocio significativa, incluso si solo lo usas una vez. La razón: probablemente lo vas a necesitar en otro lugar pronto, y tener funciones bien nombradas hace tu código de notebook mucho más legible.

---

## Cómo escribir una buena función

No todas las funciones son iguales. Una función bien escrita ahorra horas de debugging. Una mal escrita las multiplica.

### Una función, una responsabilidad

Cada función debe hacer **una cosa** y hacerla bien. Si tu función "carga datos, los limpia, los enriquece y los guarda", no es una función — son cuatro funciones que deberían vivir separadas.

### Mal ejemplo:

```python
def procesar_ventas(mes):
    # Cargar
    ventas = spark.table("transacciones")
    productos = spark.table("productos")
    
    # Limpiar
    ventas = ventas.filter(F.col("monto") > 0)
    ventas = ventas.fillna({"region": "Sin asignar"})
    
    # Filtrar al mes
    ventas = ventas.filter(F.date_format("fecha", "yyyy-MM") == mes)
    
    # Joinear
    enriquecidas = ventas.join(productos, ventas.producto_id == productos.id)
    
    # Agregar
    resultado = enriquecidas.groupBy("region").sum("monto")
    
    # Guardar
    resultado.write.saveAsTable("cbc_prod.analytics.ventas_resumen")
```

### Mejor ejemplo:

```python
def cargar_ventas() -> DataFrame:
    return spark.table("cbc_prod.ventas.transacciones")


def limpiar_ventas(df: DataFrame) -> DataFrame:
    return (
        df
        .filter(F.col("monto") > 0)
        .fillna({"region": "Sin asignar"})
    )


def filtrar_por_mes(df: DataFrame, mes: str) -> DataFrame:
    return df.filter(F.date_format("fecha", "yyyy-MM") == mes)


def enriquecer_con_productos(ventas: DataFrame, productos: DataFrame) -> DataFrame:
    return ventas.join(
        productos,
        ventas.producto_id == productos.id,
        "left"
    )


def calcular_total_por_region(df: DataFrame) -> DataFrame:
    return (
        df
        .groupBy("region")
        .agg(F.sum("monto").alias("total"))
    )
```

Y en tu notebook:

```python
ventas = cargar_ventas()
ventas = limpiar_ventas(ventas)
ventas = filtrar_por_mes(ventas, "2024-03")

productos = spark.table("productos")
enriquecidas = enriquecer_con_productos(ventas, productos)

resultado = calcular_total_por_region(enriquecidas)
display(resultado)
```

¿Notas la diferencia? El segundo:

- Cada paso es independiente y reusable
- Puedes probar cada uno por separado
- El notebook se lee como prosa: "carga, limpia, filtra, enriquece, calcula"
- Si cambias `enriquecer_con_productos`, todos los notebooks que la usan se benefician

### Nombres descriptivos

El nombre de una función debe contar qué hace. Si tu función se llama `procesar()` o `func1()` o `helper()`, no se llama nada.

| Nombre malo | Nombre bueno |
|---|---|
| `procesar_datos` | `limpiar_y_estandarizar_ventas` |
| `obtener` | `obtener_clientes_activos_por_region` |
| `validar` | `validar_no_hay_montos_negativos` |
| `helper1` | `convertir_fecha_a_anio_mes` |

> 💡 **Si tu nombre es muy largo**, eso a veces es una señal de que la función está haciendo demasiado y debería dividirse.

### Type hints

En Python moderno, usa **type hints** para indicar qué tipo de datos espera y devuelve cada función:

```python
def filtrar_por_mes(df: DataFrame, mes: str) -> DataFrame:
    return df.filter(F.date_format("fecha", "yyyy-MM") == mes)
```

Los `: DataFrame`, `: str` y `-> DataFrame` no son obligatorios, pero hacen tu código mucho más fácil de entender y de validar. Pylance los usa para darte mejor autocompletado.

### Docstrings

Para funciones que vivirán en `lib/`, incluye un **docstring** que explique qué hace, qué recibe y qué devuelve:

```python
def filtrar_por_mes(df: DataFrame, mes: str) -> DataFrame:
    """
    Filtra un DataFrame al mes indicado en formato YYYY-MM.
    
    Args:
        df: DataFrame con una columna 'fecha' de tipo date.
        mes: Mes objetivo en formato 'YYYY-MM' (ej: '2024-03').
    
    Returns:
        DataFrame filtrado al mes indicado.
    
    Raises:
        ValueError: si el formato de mes es inválido.
    """
    import re
    if not re.match(r"^\d{4}-\d{2}$", mes):
        raise ValueError(f"Formato inválido: {mes}. Debe ser YYYY-MM.")
    
    return df.filter(F.date_format("fecha", "yyyy-MM") == mes)
```

Cuando alguien usa tu función, el editor le muestra el docstring como ayuda en línea. Es la mejor forma de documentar.

---

## Organizar funciones en archivos

Cuando tu carpeta `lib/` empieza a tener muchas funciones, agrúpalas en archivos por dominio:

```
lib/
├── __init__.py
├── carga_datos.py          ← funciones para cargar tablas
├── limpieza.py             ← validaciones y limpieza
├── transformaciones.py     ← lógica de transformación
├── metricas.py             ← cálculos de KPIs
├── exportacion.py          ← guardar resultados
└── utils.py                ← funciones genéricas (fechas, formatos)
```

La regla: si una función responde a "qué hace?" con un dominio claro, ese dominio es su archivo.

---

## El archivo `__init__.py`

Cuando creas una carpeta con código Python que quieres importar, necesitas un archivo `__init__.py` (puede estar vacío) para que Python la trate como un módulo.

### Versión mínima

```python
# lib/__init__.py
# (archivo vacío)
```

Eso ya permite hacer:

```python
from lib.transformaciones import limpiar_ventas
```

### Versión más útil

Puedes usar `__init__.py` para reexportar las funciones más usadas:

```python
# lib/__init__.py

from lib.carga_datos import cargar_ventas, cargar_productos, cargar_clientes
from lib.transformaciones import limpiar_ventas, enriquecer_con_productos
from lib.metricas import calcular_total_por_region, calcular_top_productos
```

Después puedes hacer:

```python
from lib import cargar_ventas, limpiar_ventas, calcular_total_por_region
```

En lugar de:

```python
from lib.carga_datos import cargar_ventas
from lib.transformaciones import limpiar_ventas
from lib.metricas import calcular_total_por_region
```

> 💡 **Recomendación:** empieza con `__init__.py` vacío. Cuando tengas claras cuáles son tus funciones más usadas, agrégalas al `__init__.py` para acceso rápido.

---

## Importar desde notebooks de Databricks

En tu local con VSCode, los imports funcionan automáticamente. Pero cuando ejecutas el notebook desde Databricks (web), Python necesita saber dónde encontrar tu carpeta `lib/`.

### Opción 1: Sincronizar lib a tu workspace y usar sys.path

```python
import sys
sys.path.append("/Workspace/Users/tu_email/proyecto_ventas")

from lib.transformaciones import limpiar_ventas
```

Esto le dice a Python "también busca módulos en esta ruta". Funciona perfecto cuando tu proyecto está sincronizado.

### Opción 2: Usar Repos de Databricks

Si tu proyecto está en un repositorio Git clonado en Databricks Repos, los imports funcionan automáticamente sin `sys.path`. Es lo más limpio para producción, pero requiere tener Git configurado (que verás en el siguiente pilar).

### Opción 3: %run

Para casos simples, puedes ejecutar otro notebook con `%run`:

```python
%run "/Workspace/Users/tu_email/proyecto_ventas/lib/transformaciones"
```

Esto carga todas las funciones definidas en ese notebook en el namespace actual. Útil pero menos elegante que los imports normales.

---

## Versionar funciones que están en producción

Cuando una función `lib/transformaciones.py` la están usando 5 jobs de producción, modificarla es delicado. Cualquier cambio puede romper esos jobs.

Algunas estrategias:

### 1. No hagas cambios que rompan compatibilidad

Si una función recibía 2 parámetros y agregas un tercero, hazlo opcional con un valor por defecto. Así los códigos que ya la llamaban siguen funcionando:

```python
# Antes
def filtrar_por_mes(df, mes):
    ...

# Después (compatible)
def filtrar_por_mes(df, mes, incluir_dia_actual=False):
    ...
```

### 2. Crea una función nueva en lugar de modificar la existente

Si necesitas cambiar el comportamiento drásticamente, crea `filtrar_por_mes_v2` y deja la original. Migra los notebooks uno por uno y elimina la vieja cuando ya nadie la use.

### 3. Avisa al equipo antes de tocar funciones críticas

Si vas a modificar algo que está en producción, avisa primero. Una revisión de 5 minutos puede ahorrar horas de incidentes.

---

## 🎯 Tareas

**Tarea 1:** En tu carpeta `lib/`, crea un archivo `transformaciones.py` con al menos 3 funciones que sean útiles para tu trabajo en CBC. Usa type hints y docstrings.

**Tarea 2:** Crea un `__init__.py` (vacío al principio) en `lib/` para que sea importable.

**Tarea 3:** Importa una de tus funciones desde un notebook y úsala. Verifica que funciona.

**Tarea 4:** Sincroniza la carpeta a Databricks. Desde un notebook web de Databricks, importa la misma función usando `sys.path` o `%run`. Verifica que funciona también desde allí.

**Tarea 5:** Toma una función larga (de las que hacen muchas cosas) y divídela en 3-4 funciones pequeñas con responsabilidades claras.

---

*Universidad Nexus — Curso de Databricks y VSCode*
