---
sidebar_position: 4
title: Configuración y Secretos
---

# Configuración y Secretos

Hay dos cosas que NUNCA deben vivir hardcoded en tu código: **valores que cambian entre ambientes** y **credenciales sensibles**. Esta lección te enseña cómo manejarlos correctamente.

---

## El problema con los valores hardcoded

Imagina este código:

```python
catalog = "cbc_prod"
schema = "ventas"
ventas = spark.table(f"{catalog}.{schema}.transacciones")

email_destino = "carlos@cbc.com"
api_token = "abc123xyz789..."
```

Hay varios problemas:

1. **No funciona en otros ambientes**: si quieres correr esto en `cbc_dev`, tienes que editar el código
2. **Datos personales en el código**: el email queda expuesto en el repo
3. **El token es una bomba**: si subes esto a Git, cualquiera con acceso al repo puede usarlo

La solución son las **configuraciones** y los **secretos**.

---

## Configuración: valores que cambian entre ambientes

Los valores de configuración son cosas como nombres de catálogos, schemas, rutas de archivos, parámetros de negocio. No son sensibles, pero pueden cambiar entre ambientes.

### Solución: archivos de configuración

Crea un archivo YAML o JSON con la configuración:

```yaml
# config/ambientes.yaml

prod:
  catalog: cbc_prod
  schema: ventas
  retencion_dias: 365
  
dev:
  catalog: cbc_dev
  schema: ventas_dev
  retencion_dias: 30

sandbox:
  catalog: cbc_sandbox
  schema: pruebas
  retencion_dias: 7
```

Y en tu código:

```python
import yaml
import os

# Determinar el ambiente actual
ambiente = os.getenv("AMBIENTE", "dev")  # default: dev

# Cargar la configuración
with open("config/ambientes.yaml") as f:
    config_completa = yaml.safe_load(f)

config = config_completa[ambiente]

# Usar los valores
catalog = config["catalog"]
schema = config["schema"]
spark.sql(f"USE CATALOG {catalog}")
spark.sql(f"USE SCHEMA {schema}")
```

Ahora tu mismo código corre en cualquier ambiente. Solo cambias la variable de entorno `AMBIENTE` y todo se ajusta.

> 💡 **Por qué YAML y no Python:** YAML es legible para humanos no programadores. Si tu lead necesita cambiar un parámetro, puede editar el YAML sin tocar código. Más seguro y más colaborativo.

### Configuración en el notebook con widgets

Para notebooks que se ejecutan como jobs, los widgets son tu sistema de configuración natural:

```python
dbutils.widgets.dropdown(
    "ambiente",
    "dev",
    ["prod", "dev", "sandbox"],
    "Ambiente"
)
ambiente = dbutils.widgets.get("ambiente")
```

El job que dispara el notebook le pasa el ambiente correcto, y el notebook se ajusta automáticamente.

---

## Secretos: lo que JAMÁS debe vivir en el código

Los secretos son cosas como:

- API tokens
- Contraseñas de bases de datos
- Llaves de servicios externos (AWS, Azure, Google)
- Tokens de Slack, Teams, etc.

Estas cosas NUNCA deben aparecer en archivos de código, ni siquiera por accidente. Si subes uno a Git por error, asume que ya está comprometido.

### Solución: Databricks Secrets

Databricks tiene un servicio nativo para guardar secretos de forma segura: **Secret Scopes**. Funciona así:

1. Un administrador crea un "scope" (un namespace para secretos): `cbc_secrets`
2. Dentro del scope, agrega secretos individuales: `slack_token`, `api_key_externa`, etc.
3. Tu código accede a ellos sin verlos directamente

### Acceder a secretos desde un notebook

```python
slack_token = dbutils.secrets.get(scope="cbc_secrets", key="slack_token")

# Usar el token sin imprimirlo
import requests
requests.post(
    "https://hooks.slack.com/services/...",
    json={"text": "Mensaje del job"},
    headers={"Authorization": f"Bearer {slack_token}"}
)
```

> ⚠️ **Importante:** `dbutils.secrets.get()` devuelve el valor del secreto como string. Pero si lo imprimes con `print(slack_token)`, Databricks lo enmascara en los logs por seguridad. Confía en eso, pero también evita imprimirlo deliberadamente.

### Crear un secret scope (típicamente lo hace el equipo de plataforma)

Solo para referencia, los secretos se crean con el CLI de Databricks o con la API:

```bash
databricks secrets create-scope --scope cbc_secrets
databricks secrets put --scope cbc_secrets --key slack_token
```

Como analista normalmente NO vas a crear scopes — los crea el equipo de plataforma. Tú solo los consumes en tu código.

---

## Variables de entorno locales

Para desarrollo local con Databricks Connect, los secretos de Databricks no funcionan (no estás conectado al servicio de secretos directamente). En ese caso usas **variables de entorno**.

### Crear un archivo `.env`

```bash
# .env (NUNCA subas este archivo a Git)
DATABRICKS_HOST=https://adb-1234567890.12.azuredatabricks.net
DATABRICKS_TOKEN=dapi_xyz123abc...
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

### Cargarlo en tu código

Instala la librería `python-dotenv`:

```bash
pip install python-dotenv
```

Y úsala así:

```python
from dotenv import load_dotenv
import os

load_dotenv()  # carga el .env

token = os.getenv("DATABRICKS_TOKEN")
slack_url = os.getenv("SLACK_WEBHOOK_URL")
```

### Excluirlo de Git

Tu `.gitignore` debe tener:

```
.env
.env.local
.env.*.local
```

Sin esto, cualquier `git add .` incluiría el archivo de secretos. Es uno de los errores más comunes y peligrosos.

### Compartir un .env.example

Para que otros del equipo sepan qué variables necesitan, crea un `.env.example` con los nombres pero sin valores:

```bash
# .env.example
DATABRICKS_HOST=
DATABRICKS_TOKEN=
SLACK_WEBHOOK_URL=
```

Este archivo SÍ se sube a Git. Es el "manual" de qué variables se necesitan, sin exponer los valores reales.

---

## Buenas prácticas resumidas

### ✅ Lo que SÍ debes hacer

- Usar archivos YAML/JSON para configuración entre ambientes
- Usar `dbutils.secrets` en notebooks de Databricks
- Usar variables de entorno con `.env` para desarrollo local
- Excluir `.env`, `.databrickscfg` y otros archivos sensibles del repo
- Crear `.env.example` documentando qué variables se necesitan
- Usar widgets en notebooks productivos para parámetros comunes

### ❌ Lo que NUNCA debes hacer

- Hardcodear tokens, contraseñas o credenciales
- Subir un `.env` real a Git
- Imprimir secretos con `print()` en logs públicos
- Compartir secretos por chat o email (siempre por canales seguros)
- Reutilizar el mismo token entre ambientes diferentes
- Asumir que un repo "privado" es seguro para guardar secretos

---

## Qué hacer si filtras un secreto por accidente

A veces pasa: subes un archivo con un token a Git por error. Si te das cuenta:

1. **Revoca el token inmediatamente** desde el sistema que lo emitió. Considéralo comprometido.
2. **Genera uno nuevo** y configúralo correctamente esta vez (en variables de entorno o secrets).
3. **Limpia el historial de Git** si es necesario (esto es complicado y requiere ayuda).
4. **Reporta a tu lead** lo que pasó. No por castigo, sino para que evalúen el impacto y aprendan del incidente.

> 💡 **Cero blame, mucho aprendizaje.** Filtrar secretos es uno de los errores más comunes en la industria. Lo importante no es no haberlo hecho — es saber qué hacer cuando pasa.

---

## 🎯 Tareas

**Tarea 1:** Crea un archivo `config/ambientes.yaml` con los valores de catálogo y schema para `prod` y `dev`.

**Tarea 2:** Modifica uno de tus notebooks para que lea el ambiente desde el YAML en lugar de tener los valores hardcoded.

**Tarea 3:** Investiga si tu equipo en CBC ya tiene un Secret Scope creado en Databricks. Si sí, identifica cuáles secretos están disponibles para tu equipo.

**Tarea 4:** Crea un `.env` en tu proyecto local con al menos 2 variables (puedes inventarlas para esta práctica). Crea también un `.env.example` correspondiente. Verifica que `.env` está en tu `.gitignore`.

**Tarea 5:** Lee las variables del `.env` desde un script Python usando `python-dotenv`. Imprime una de ellas para verificar que se cargó correctamente.

---

*Universidad Nexus — Curso de Databricks y VSCode*
