---
sidebar_position: 3
title: Databricks Connect — Ejecución Remota
---

# Databricks Connect — Ejecución Remota

En la lección anterior viste cómo enviar un archivo desde VSCode al cluster de Databricks. Eso ya es útil, pero hay algo aún más poderoso: **Databricks Connect**. Es una librería que te permite ejecutar código Spark desde tu computadora local **como si tuvieras un cluster local**, pero internamente se conecta al cluster remoto.

La diferencia es enorme: puedes hacer debugging paso a paso, ver los DataFrames con autocompletado de Pylance, e iterar sin tener que sincronizar archivos cada vez.

---

## ¿Qué es Databricks Connect exactamente?

Es una librería de Python que reemplaza al PySpark normal. Cuando la usas, todas las operaciones de Spark que escribes en tu computadora se ejecutan en realidad en el cluster remoto. Tu computadora solo coordina; el procesamiento real ocurre en Databricks.

```
Tu código en VSCode (Mac/Windows)
        ↓
   databricks-connect
        ↓
   ┌─────────────┐
   │   Cluster   │
   │   remoto    │ → procesa los datos
   │ (Databricks)│
   └─────────────┘
        ↓
   Resultado de vuelta a tu pantalla
```

Para ti, escribir código se siente igual que cualquier código Python. La magia ocurre detrás.

---

## Por qué Databricks Connect es importante

Compáralo con las dos alternativas:

### Opción A: Trabajar solo en notebooks de Databricks (web)
- ✅ Funciona, pero sin las ventajas de un editor moderno
- ❌ Sin debugging real
- ❌ Sin autocompletado profundo
- ❌ Sin búsqueda global entre archivos

### Opción B: Sincronizar archivos a Databricks (lo que hiciste antes)
- ✅ Editas localmente con todas las ventajas de VSCode
- ✅ Ejecutas en el cluster remoto
- ❌ Tienes que sincronizar antes de ejecutar
- ❌ No puedes pausar la ejecución a mitad para inspeccionar variables

### Opción C: Databricks Connect (lo que verás ahora)
- ✅ Editas localmente con todas las ventajas de VSCode
- ✅ Ejecutas directamente sin sincronizar (la conexión es transparente)
- ✅ Debugging paso a paso real con breakpoints
- ✅ Autocompletado de Pylance funciona con tu DataFrame

> 💡 **En la práctica:** Vas a usar las dos. Para desarrollo iterativo y debugging, usas Databricks Connect. Para correr un script de un tirón o programar como job, sincronizas el archivo al workspace.

---

## Instalar Databricks Connect

Necesitas instalar la librería en tu entorno Python local. Lo más limpio es hacerlo dentro de un entorno virtual dedicado al proyecto.

### Crear un entorno virtual

En la terminal integrada de VSCode (`` Ctrl + ` ``), dentro de tu carpeta de proyecto:

```bash
python3 -m venv .venv
```

Esto crea una carpeta `.venv` en tu proyecto con un Python aislado.

### Activar el entorno

```bash
# En Mac/Linux
source .venv/bin/activate

# En Windows (PowerShell)
.venv\Scripts\Activate.ps1
```

Cuando está activo, ves `(.venv)` al inicio de tu prompt de la terminal.

### Instalar databricks-connect

Con el entorno activo:

```bash
pip install databricks-connect==14.3
```

> ⚠️ **La versión importa.** `databricks-connect` debe coincidir con la versión del runtime del cluster. Si tu cluster usa Databricks Runtime 14.3 LTS, instalas `databricks-connect==14.3`. Pregúntale a tu lead cuál es la versión correcta para CBC.

### Verificar la instalación

```bash
python -c "from databricks.connect import DatabricksSession; print('OK')"
```

Si imprime "OK", está instalado correctamente.

---

## Configurar el intérprete de VSCode

Después de crear el entorno virtual, dile a VSCode que use ese Python en lugar del global del sistema:

1. Abre la paleta de comandos (`Cmd/Ctrl + Shift + P`)
2. Escribe `Python: Select Interpreter`
3. Elige el que está dentro de `.venv` de tu proyecto

Ahora cuando ejecutes archivos Python desde VSCode, va a usar el entorno virtual con databricks-connect instalado.

---

## Tu primer script con Databricks Connect

Crea un archivo llamado `analisis_local.py` con este contenido:

```python
from databricks.connect import DatabricksSession
from pyspark.sql import functions as F

# Crear la sesión de Spark conectada al cluster remoto
spark = DatabricksSession.builder.getOrCreate()

# Configurar el catálogo y schema (ajusta según CBC)
spark.sql("USE CATALOG cbc_prod")
spark.sql("USE SCHEMA ventas")

# Cargar la tabla
ventas = spark.table("transacciones")

# Inspeccionar
print(f"Total de filas: {ventas.count():,}")
ventas.printSchema()

# Una agregación simple
resultado = (
    ventas
    .groupBy("region")
    .agg(F.sum("monto").alias("total"))
    .orderBy(F.col("total").desc())
)

resultado.show()
```

### Ejecutarlo

Hay dos formas:

**Opción 1: Botón Run de VSCode** (arriba a la derecha del editor cuando tienes un .py abierto)

**Opción 2: Desde la terminal**
```bash
python analisis_local.py
```

Cualquiera de las dos ejecuta tu script. Pero observa lo importante: el script está corriendo en TU computadora, pero las operaciones de Spark se procesan en el cluster remoto. Cuando hace `count()` o `show()`, Databricks Connect envía esa operación al cluster y trae el resultado de vuelta.

---

## Debugging paso a paso

Aquí está la magia real. Con Databricks Connect, puedes usar el debugger de VSCode normalmente sobre código Spark.

### Poner un breakpoint

En tu archivo Python, click a la izquierda de un número de línea. Aparece un punto rojo. Eso es un **breakpoint**: la ejecución se va a pausar ahí cuando ejecutes el archivo en modo debug.

### Ejecutar en modo debug

Click derecho sobre el archivo → "Debug Python File", o usa la pestaña "Run and Debug" de la Activity Bar.

Cuando la ejecución llega a tu breakpoint, se pausa. En el panel izquierdo de VSCode aparecen:

- **Variables**: todas las variables actuales y sus valores
- **Watch**: variables que decidiste observar
- **Call Stack**: dónde está el código en este momento

Puedes inspeccionar tu DataFrame, ver cuántas filas tiene, ver sus columnas, todo sin escribir más código. Y luego puedes seguir ejecutando paso a paso (`Step Over`, `Step Into`).

> 💡 **Esto es lo que cambia el juego.** En notebooks de Databricks no puedes hacer esto. En VSCode con Databricks Connect, sí. Es la herramienta que separa al analista que "espera resultados" del que "investiga problemas con precisión".

---

## Cuándo usar Databricks Connect y cuándo no

### Usa Databricks Connect cuando:
- Estás desarrollando código nuevo iterativamente
- Quieres debuggear un problema complejo paso a paso
- Necesitas autocompletado profundo mientras escribes
- Estás refactorizando código existente

### NO uses Databricks Connect cuando:
- El código ya está terminado y solo quieres ejecutarlo (mejor sincronizarlo y correrlo en el cluster directamente)
- Es un job programado (los jobs corren en clusters dedicados, no necesitan tu computadora)
- Estás haciendo demos o presentaciones (ahí es mejor el notebook web)
- Tienes una conexión a internet inestable (Databricks Connect requiere conectividad constante)

---

## Limitaciones a tener en cuenta

Databricks Connect es excelente, pero tiene algunas limitaciones que conviene conocer:

1. **No funciona con `dbutils` completo**: la mayoría de las funciones de `dbutils` (como `widgets`) son específicas del entorno de notebook y no están disponibles localmente.
2. **`display()` no funciona**: usa `.show()` en su lugar para ver DataFrames en la terminal.
3. **Autenticación puede expirar**: si llevas mucho tiempo sin ejecutar, tendrás que re-autenticarte. La extensión de Databricks lo maneja por ti.
4. **No es para producción**: jobs y procesos críticos no deben usar Databricks Connect. Es solo para desarrollo.

---

## 🎯 Tareas

**Tarea 1:** Crea un entorno virtual `.venv` en tu carpeta de proyecto y actívalo.

**Tarea 2:** Instala `databricks-connect` con la versión correcta para CBC (pregúntale a tu lead si no la sabes).

**Tarea 3:** Configura VSCode para usar el intérprete de tu `.venv`. Verifica con `Python: Select Interpreter`.

**Tarea 4:** Crea un script `analisis_local.py` que cargue una tabla real de CBC, haga una agregación simple, y muestre el resultado. Ejecútalo desde VSCode.

**Tarea 5:** Pon un breakpoint dentro del script, justo después de cargar la tabla. Ejecuta en modo debug. Inspecciona el DataFrame en el panel de Variables.

**Tarea 6:** Compara: ejecuta el mismo análisis (1) en un notebook web de Databricks y (2) localmente con Databricks Connect. ¿Cuál te resulta más cómodo para iterar? Anota tus observaciones.

---

*Universidad Nexus — Curso de Databricks y VSCode*
