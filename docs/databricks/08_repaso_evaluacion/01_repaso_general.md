---
sidebar_position: 2
title: Repaso General
---

# Repaso General

Esta página es tu cheat sheet del módulo completo. Tenla a la mano cuando empieces a trabajar en proyectos reales.

---

## 1. Workspace y entorno de Databricks

- **Workspace**: tu espacio de trabajo personal y compartido en Databricks
- **Compute → Clusters**: las máquinas que ejecutan tu código
- **Catalog**: explorador de tablas (Unity Catalog)
- **Workflows**: jobs programados
- **SQL Editor**: editor de queries SQL puras

**Atajo clave**: `Cmd/Ctrl + P` para buscar archivos y tablas rápidamente.

---

## 2. Unity Catalog y la sintaxis de tres niveles

```python
# Sintaxis completa
ventas = spark.table("cbc_prod.ventas.transacciones")

# Configurar catálogo y schema por defecto
spark.sql("USE CATALOG cbc_prod")
spark.sql("USE SCHEMA ventas")

# Después puedes usar solo el nombre de la tabla
ventas = spark.table("transacciones")
```

**Exploración**:
```python
spark.sql("SHOW CATALOGS").show()
spark.sql("SHOW SCHEMAS IN cbc_prod").show()
spark.sql("SHOW TABLES IN cbc_prod.ventas").show()
spark.sql("DESCRIBE TABLE cbc_prod.ventas.transacciones").show()
```

---

## 3. Notebooks productivos: estructura

```
1. Encabezado (markdown con título, autor, descripción)
2. Imports y configuración
3. Definición de widgets
4. Carga de datos
5. Validaciones iniciales
6. Transformaciones
7. Análisis / agregaciones
8. Resultado final (write o display)
9. Notas de cierre
```

---

## 4. Widgets

```python
# Crear widgets
dbutils.widgets.text("mes", "2024-03", "Mes (YYYY-MM)")
dbutils.widgets.dropdown("pais", "Guatemala", ["Guatemala", "Honduras", "Nicaragua"], "País")
dbutils.widgets.combobox("categoria", "Bebidas", ["Bebidas", "Snacks"], "Categoría")
dbutils.widgets.multiselect("regiones", "Norte", ["Norte", "Sur", "Centro"], "Regiones")

# Leer valores
mes = dbutils.widgets.get("mes")
pais = dbutils.widgets.get("pais")
monto = float(dbutils.widgets.get("monto_minimo"))

# Eliminar widgets
dbutils.widgets.removeAll()
```

---

## 5. Jobs y workflows

**Crear un job**: `Workflows → Create Job`

**Configuración mínima**:
- Name del job (descriptivo)
- Task con type `Notebook` y path al archivo
- Cluster (preferentemente job cluster)
- Parameters para los widgets

**Triggers**:
- Schedule (cron o periódico)
- File arrival
- Manual / On-demand

**Notificaciones**: SIEMPRE configura "On failure" por email o Slack.

**Reintentos recomendados**: 2 reintentos con 5 minutos entre cada uno.

---

## 6. VSCode setup

**Extensiones esenciales**:
- Python (Microsoft)
- Pylance
- Jupyter
- Databricks
- SQLTools

**Configuración mínima** (`settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.tabSize": 4,
  "editor.rulers": [88],
  "files.autoSave": "afterDelay",
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter"
  }
}
```

**Atajos esenciales**:
- `Cmd/Ctrl + P`: abrir archivo
- `Cmd/Ctrl + Shift + P`: paleta de comandos
- `Cmd/Ctrl + Shift + F`: buscar en todo el workspace
- `` Ctrl + ` ``: terminal integrada
- `F2`: renombrar símbolo
- `F12`: ir a definición
- `Cmd/Ctrl + D`: seleccionar siguiente ocurrencia

---

## 7. Conectar VSCode con Databricks

**Pasos**:
1. Instalar extensión Databricks
2. Configurar workspace URL
3. Autenticar con OAuth U2M
4. Seleccionar cluster
5. Configurar carpeta destino para sync

**Verificación**: ejecutar `prueba_databricks.py` con el botón "Run on Databricks".

---

## 8. Databricks Connect (ejecución remota)

**Setup**:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install databricks-connect==14.3
```

**Uso en código**:
```python
from databricks.connect import DatabricksSession
from pyspark.sql import functions as F

spark = DatabricksSession.builder.getOrCreate()
ventas = spark.table("cbc_prod.ventas.transacciones")
ventas.show()
```

**Cuándo usar**: desarrollo iterativo, debugging paso a paso, autocompletado profundo.
**Cuándo NO**: jobs en producción, demos, conexión inestable.

---

## 9. Sincronización de archivos

**Activar sync**: panel de Databricks → "Sync Destination" → seleccionar carpeta.

**Header para que Databricks reconozca celdas**:
```python
# Databricks notebook source

# COMMAND ----------

# MAGIC %md
# MAGIC ## Sección 1

# COMMAND ----------

# código aquí
```

**Reglas de oro**:
- Edita siempre desde un lado (no desde web Y VSCode al mismo tiempo)
- No subas `.databrickscfg` a Git
- Usa `.gitignore` con exclusiones estándar

---

## 10. Estructura de proyecto recomendada

```
mi_proyecto/
├── README.md
├── .gitignore
├── .venv/
├── pyproject.toml
├── notebooks/
│   ├── 01_exploracion.py
│   └── 02_validacion.py
├── lib/
│   ├── __init__.py
│   ├── carga_datos.py
│   └── transformaciones.py
├── jobs/
│   └── proceso_mensual.py
├── config/
│   └── ambientes.yaml
└── docs/
    └── arquitectura.md
```

---

## 11. Funciones reutilizables

**Patrón básico**:
```python
# lib/transformaciones.py
from pyspark.sql import DataFrame
from pyspark.sql import functions as F

def limpiar_ventas(df: DataFrame) -> DataFrame:
    """Aplica las limpiezas estándar a un DataFrame de ventas."""
    return (
        df
        .filter(F.col("monto") > 0)
        .fillna({"region": "Sin asignar"})
    )
```

**Importar desde notebook**:
```python
import sys
sys.path.append("/Workspace/Users/tu_email/proyecto")
from lib.transformaciones import limpiar_ventas
```

---

## 12. Configuración y secretos

**YAML para configuración entre ambientes**:
```yaml
prod:
  catalog: cbc_prod
dev:
  catalog: cbc_dev
```

**Secretos en Databricks**:
```python
token = dbutils.secrets.get(scope="cbc_secrets", key="slack_token")
```

**Variables de entorno locales** (`.env`):
```bash
DATABRICKS_TOKEN=...
SLACK_WEBHOOK_URL=...
```

```python
from dotenv import load_dotenv
load_dotenv()
token = os.getenv("DATABRICKS_TOKEN")
```

---

## 13. Linting y formatting

**Instalar**:
```bash
pip install black ruff
```

**Configuración** (`pyproject.toml`):
```toml
[tool.black]
line-length = 88

[tool.ruff.lint]
select = ["E", "W", "F", "I", "B", "UP"]
```

**Comportamiento esperado**: cada `Cmd/Ctrl + S` formatea automáticamente con Black y arregla problemas con Ruff.

---

## 14. Debugging

**Técnicas**:
1. **Breakpoints + Debug Console**: pausar y explorar variables interactivamente
2. **Bisección**: dividir el código a la mitad y verificar dónde está el problema
3. **Validaciones intermedias**: `assert` y `print` en puntos clave
4. **Inspección estadística**: revisar distribuciones, nulos, duplicados
5. **DataFrames sintéticos**: crear datos de prueba pequeños y controlados

---

## 15. Hábitos del analista profesional

- Nombres descriptivos en `snake_case`
- Comentarios para decisiones, no para describir código obvio
- Una función, una responsabilidad
- Refactorizar mientras avanzas, no al final
- Validar siempre antes de reportar
- Documentar decisiones importantes en el momento
- Trata cada pieza de código como si alguien más tuviera que mantenerla mañana

---

## El esqueleto de un proyecto completo

Casi cualquier análisis productivo en CBC sigue esta estructura:

```python
# Databricks notebook source
# MAGIC %md
# MAGIC # [Título del análisis]
# MAGIC
# MAGIC **Autor:** Tu Nombre
# MAGIC **Última actualización:** YYYY-MM-DD
# MAGIC **Frecuencia:** [Diaria/Mensual/etc]

# COMMAND ----------

# MAGIC %md
# MAGIC ## 1. Configuración

# COMMAND ----------

from pyspark.sql import functions as F
import sys
sys.path.append("/Workspace/Users/tu_email/proyecto")

from lib.transformaciones import limpiar_ventas, enriquecer_con_productos

spark.sql("USE CATALOG cbc_prod")
spark.sql("USE SCHEMA ventas")

# COMMAND ----------

# MAGIC %md
# MAGIC ## 2. Parámetros

# COMMAND ----------

dbutils.widgets.text("mes", "2024-03", "Mes objetivo")
mes = dbutils.widgets.get("mes")
print(f"Procesando: {mes}")

# COMMAND ----------

# MAGIC %md
# MAGIC ## 3. Carga y validación

# COMMAND ----------

ventas = spark.table("transacciones")
productos = spark.table("productos")

assert ventas.count() > 0, "Tabla vacía"
print(f"Filas cargadas: {ventas.count():,}")

# COMMAND ----------

# MAGIC %md
# MAGIC ## 4. Transformaciones

# COMMAND ----------

ventas_limpias = limpiar_ventas(ventas)
ventas_filtradas = ventas_limpias.filter(F.date_format("fecha", "yyyy-MM") == mes)
ventas_enriquecidas = enriquecer_con_productos(ventas_filtradas, productos)

# COMMAND ----------

# MAGIC %md
# MAGIC ## 5. Análisis

# COMMAND ----------

resultado = (
    ventas_enriquecidas
    .groupBy("region", "categoria")
    .agg(
        F.sum("monto").alias("total"),
        F.count("*").alias("transacciones")
    )
    .orderBy(F.col("total").desc())
)

display(resultado)

# COMMAND ----------

# MAGIC %md
# MAGIC ## 6. Guardar resultado

# COMMAND ----------

(
    resultado
    .write
    .mode("overwrite")
    .saveAsTable("cbc_prod.analytics.ventas_mensuales_por_region_categoria")
)

print(f"✓ Tabla actualizada para mes {mes}")
```

Si interiorizas esta estructura, el 90% de tus análisis productivos en CBC van a fluir naturalmente.

---

*Universidad Nexus — Curso de Databricks y VSCode*
