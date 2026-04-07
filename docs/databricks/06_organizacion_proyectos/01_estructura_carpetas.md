---
sidebar_position: 2
title: Estructura de un Proyecto
---

# Estructura de un Proyecto

¿Cómo debe verse una carpeta de proyecto bien organizada? No hay una sola respuesta correcta, pero hay convenciones que funcionan para casi todos los proyectos de análisis. Esta lección te muestra una estructura estándar que puedes adoptar y adaptar.

---

## El problema: la carpeta caótica

Antes de hablar de la solución, veamos el problema. Una carpeta de proyecto típica de un analista que nunca aprendió esto se ve así:

```
mis_analisis/
├── ventas_marzo.ipynb
├── ventas_marzo_v2.ipynb
├── ventas_marzo_FINAL.ipynb
├── ventas_marzo_FINAL_corregido.ipynb
├── prueba.py
├── prueba2.py
├── analisis_jose.ipynb
├── copia_de_analisis_jose.ipynb
├── datos.csv
├── datos_limpios.csv
├── temp.txt
├── notas.docx
├── grafico.png
└── otros_archivos_viejos/
    └── (50 archivos más)
```

¿Cuál es el archivo "real"? ¿Qué versión está en producción? ¿Quién es José? ¿Por qué hay un .docx en una carpeta de código?

Esta carpeta es lo opuesto de un proyecto. Es un basurero. Y sin embargo, el 80% de los analistas trabajan así.

---

## La estructura recomendada

Aquí está una estructura que escala bien para proyectos de análisis. No es la única, pero es un buen punto de partida:

```
proyecto_ventas_cbc/
├── README.md
├── .gitignore
├── .venv/                      ← entorno virtual (no se sube a Git)
│
├── notebooks/                  ← análisis exploratorio
│   ├── 01_exploracion_inicial.py
│   ├── 02_analisis_por_region.py
│   └── 03_validacion_resultados.py
│
├── lib/                        ← código reutilizable
│   ├── __init__.py
│   ├── carga_datos.py
│   ├── transformaciones.py
│   ├── metricas.py
│   └── utils.py
│
├── jobs/                       ← notebooks programados como jobs
│   ├── ventas_diarias.py
│   └── ventas_mensuales.py
│
├── sql/                        ← queries SQL puras (opcional)
│   ├── ventas_por_region.sql
│   └── top_productos.sql
│
├── config/                     ← configuración y parámetros
│   ├── catalogos.yaml
│   └── parametros.json
│
├── tests/                      ← pruebas (cuando avances)
│   └── test_transformaciones.py
│
└── docs/                       ← documentación adicional
    ├── arquitectura.md
    └── glosario.md
```

Vamos a desglosarla.

---

## Las carpetas explicadas

### `README.md`
Es el primer archivo que cualquiera ve cuando abre tu proyecto. Debe responder en menos de 30 segundos:

- **¿Qué hace este proyecto?**
- **¿Cómo se ejecuta?**
- **¿Quién es el dueño?**
- **¿Dónde está la documentación adicional?**

Un README mínimo:

```markdown
# Análisis de Ventas CBC

Pipeline de análisis mensual de ventas para los países donde opera CBC.

## ¿Qué hace?

Carga las transacciones del mes anterior desde Unity Catalog, las
enriquece con información de productos y clientes, y genera métricas
por región y categoría que alimentan el dashboard de Power BI
"Ventas Mensuales".

## Estructura

- `notebooks/`: análisis exploratorios
- `lib/`: módulos compartidos
- `jobs/`: procesos programados

## Cómo ejecutar

1. Activa el entorno virtual: `source .venv/bin/activate`
2. Verifica tu conexión a Databricks
3. Ejecuta el job desde `jobs/ventas_mensuales.py`

## Contacto

- Dueño: tu_nombre@cbc.com
- Equipo: Data & Analytics
```

> 💡 **El README es el frente de tu proyecto.** Un proyecto sin README se ve abandonado, aunque sea genial por dentro.

### `.gitignore`
Le dice a Git qué archivos ignorar (no versionar). Imprescindible. Tu `.gitignore` mínimo:

```
# Entornos virtuales
.venv/
venv/
env/

# Caché de Python
__pycache__/
*.pyc
*.pyo

# Configuración de Databricks
.databrickscfg
.databricks/

# Configuración de IDEs
.vscode/
.idea/

# Outputs temporales
*.log
*.tmp
.DS_Store
```

> ⚠️ **Crítico:** nunca subas `.databrickscfg` ni archivos con tokens. Pueden dar acceso completo a tu workspace a quien los obtenga.

### `notebooks/`
Análisis exploratorios e iterativos. Suele ser la carpeta más activa del proyecto. Convención de nombres:

- Empezar con número: `01_`, `02_`, `03_` para indicar orden lógico
- Nombre descriptivo: `01_exploracion_inicial.py` no `analisis1.py`
- Usar formato `.py` con `# COMMAND ----------` para mejor versionamiento

### `lib/`
Código compartido entre múltiples notebooks. Funciones, clases, utilidades. El directorio incluye un archivo vacío `__init__.py` para que Python lo trate como un módulo.

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


def enriquecer_con_productos(ventas: DataFrame, productos: DataFrame) -> DataFrame:
    """Hace el join estándar entre ventas y productos."""
    return ventas.join(
        productos,
        ventas.producto_id == productos.id,
        "left"
    )
```

Después puedes importarlo desde cualquier notebook:

```python
from lib.transformaciones import limpiar_ventas, enriquecer_con_productos

ventas_limpias = limpiar_ventas(ventas)
ventas_enriquecidas = enriquecer_con_productos(ventas_limpias, productos)
```

### `jobs/`
Notebooks que se ejecutan automáticamente como jobs programados en Databricks. Suelen ser más estables y tener más validaciones que los de `notebooks/`.

### `sql/`
Si tienes queries SQL puras que se reutilizan, ponlas aquí. Pueden ejecutarse desde Python:

```python
with open("sql/top_productos.sql") as f:
    query = f.read()

resultado = spark.sql(query)
```

### `config/`
Parámetros del proyecto que pueden cambiar sin tocar el código. Por ejemplo, `config/catalogos.yaml`:

```yaml
ambientes:
  prod:
    catalog: cbc_prod
    schema: ventas
  dev:
    catalog: cbc_dev
    schema: ventas_dev
```

Tu código lee este YAML y usa los valores correspondientes según el ambiente.

### `tests/`
Pruebas automatizadas. No las vas a usar al inicio, pero es buena práctica reservar la carpeta. Las verás más a fondo en pilares posteriores.

### `docs/`
Documentación adicional al README: diagramas, glosarios, decisiones técnicas, manuales de usuario. Markdown es el formato estándar.

---

## Las reglas de oro

### 1. Cada cosa tiene UN lugar

Un archivo no debe poder vivir en dos carpetas. Si dudas dónde poner algo, esa es una señal de que la estructura necesita ajustarse, no que tienes que poner el archivo en la que "más o menos" cabe.

### 2. Si lo haces más de una vez, va a `lib/`

Cualquier código que copies y pegues entre notebooks debe vivir en `lib/`. Sin excepciones. Es la única forma de evitar inconsistencias cuando hay cambios.

### 3. Los notebooks de exploración son temporales

`notebooks/` es donde va lo experimental. Si algo se vuelve permanente y crítico, gradúalo: muévelo a `jobs/` con la estructura completa de notebook productivo.

### 4. La estructura es para el equipo, no para ti

La pregunta correcta no es "¿yo entiendo dónde está cada cosa?" sino "¿alguien que se une al equipo mañana, entendería la estructura en 5 minutos?" Si la respuesta es no, simplifica.

### 5. No metas datos en el repo

Las tablas y archivos CSV NO van en la carpeta del proyecto. Los datos viven en Databricks (Unity Catalog) o en el data lake. Tu repo solo tiene código.

---

## El proyecto evoluciona

No tienes que crear toda esta estructura desde el día 1. Empieza simple:

```
mi_proyecto/
├── README.md
├── notebooks/
│   └── 01_exploracion.py
└── lib/
    └── utils.py
```

A medida que el proyecto crece, agregas las carpetas que necesites:

- ¿Tienes 5 notebooks y empiezas a ver código duplicado? → expande `lib/`
- ¿Vas a programar uno como job? → crea `jobs/`
- ¿Empiezan a haber parámetros de configuración? → crea `config/`

La estructura es una respuesta a las necesidades del proyecto, no una imposición desde el día 1.

---

## Lo que NO debes hacer

### ❌ Carpetas con nombres genéricos
`misc/`, `varios/`, `temp/`, `otros/`. Si tu carpeta se llama así, es porque no tienes claro qué va ahí. Decídelo.

### ❌ Archivos con sufijos de versión
`reporte_v1.py`, `reporte_v2.py`, `reporte_FINAL.py`, `reporte_FINAL_de_verdad.py`. Para versiones, usa Git (lo verás en el siguiente pilar). El versionado en el nombre del archivo es señal de que no estás usando Git.

### ❌ Archivos con espacios o caracteres especiales
`Mi Análisis (corregido).py`. Esto da problemas con scripts, comandos de terminal y URLs. Usa solo letras, números, guiones bajos y guiones medios.

### ❌ Mezcla de idiomas
Decide si tu proyecto está en español o inglés y sé consistente. `analisis_sales.py` es lo peor de los dos mundos.

### ❌ README desactualizado
Un README que dice cosas que ya no son verdad es peor que no tener README. Si modificas la estructura, actualiza el README inmediatamente.

---

## 🎯 Tareas

**Tarea 1:** Toma uno de tus proyectos actuales (o crea uno nuevo) y aplica la estructura recomendada. Crea las carpetas, mueve los archivos a su lugar.

**Tarea 2:** Escribe un README completo para ese proyecto: qué hace, cómo se ejecuta, quién es el dueño.

**Tarea 3:** Crea un `.gitignore` con las exclusiones recomendadas.

**Tarea 4:** Identifica si tienes código duplicado entre notebooks. Extrae al menos una función a `lib/utils.py` y úsala en lugar del código duplicado.

**Tarea 5:** Comparte la nueva estructura con un colega y pídele feedback: ¿en 5 minutos entiende dónde está cada cosa?

---

*Universidad Nexus — Curso de Databricks y VSCode*
