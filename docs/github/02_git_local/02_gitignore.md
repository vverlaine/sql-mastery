---
sidebar_position: 3
title: .gitignore — Excluir Archivos de Git
---

# .gitignore — Excluir Archivos de Git

No todos los archivos en tu carpeta deberían ir a Git. Hay archivos que son temporales, generados automáticamente, sensibles, o demasiado grandes para versionar. El archivo **`.gitignore`** le dice a Git qué ignorar.

Esta lección es corta pero crítica: un `.gitignore` mal hecho es la causa #1 de problemas en repositorios reales.

---

## ¿Qué archivos NO deberían ir a Git?

Hay 4 categorías principales:

### 1. Archivos generados automáticamente

Son archivos que Python u otras herramientas crean cuando ejecutan tu código. Si los borras, se regeneran. No tienen valor histórico.

Ejemplos:

- `__pycache__/` (caché de Python)
- `*.pyc` (archivos compilados de Python)
- `.ipynb_checkpoints/` (checkpoints de Jupyter)
- `.DS_Store` (archivos de sistema en Mac)
- `Thumbs.db` (archivos de sistema en Windows)

### 2. Entornos virtuales y dependencias

Las carpetas de entornos virtuales pueden tener miles de archivos y pesar cientos de MB. NO se versionan.

Ejemplos:

- `.venv/`
- `venv/`
- `env/`
- `node_modules/` (en proyectos JavaScript)

### 3. Configuración local y secretos

Archivos con información personal, credenciales, o configuraciones que solo aplican a TU computadora.

Ejemplos:

- `.env` (variables de entorno con tokens)
- `.databrickscfg` (configuración de Databricks)
- `config.local.yaml`
- Cualquier archivo con contraseñas o API keys

> ⚠️ **CRÍTICO**: nunca commitees archivos con secretos. Una vez que un secreto está en el historial de Git, está expuesto incluso si lo borras después. Aprende a usar `.gitignore` ANTES de commitear cualquier cosa.

### 4. Archivos grandes y datos

Git no está diseñado para archivos grandes binarios o datos. Para análisis, los datos viven en Databricks o en el data lake, NO en el repositorio.

Ejemplos a ignorar:

- `*.csv` (a veces sí, depende del tamaño)
- `*.xlsx`
- `*.parquet`
- `*.zip`
- Imágenes y videos grandes
- Modelos de machine learning entrenados

---

## Crear un .gitignore

El archivo se llama exactamente `.gitignore` (con el punto al inicio, sin extensión). Vive en la raíz del repositorio.

### Modo línea de comandos

```bash
touch .gitignore
```

### Modo VSCode

1. Click en el icono "New File" en el explorador
2. Nombre: `.gitignore`

Ahora ábrelo y agrega las exclusiones.

---

## Sintaxis de .gitignore

Las reglas son simples:

```gitignore
# Esto es un comentario

# Ignorar un archivo específico
config.local.yaml

# Ignorar todos los archivos con cierta extensión
*.pyc
*.log

# Ignorar una carpeta completa
__pycache__/
.venv/
node_modules/

# Ignorar archivos en cualquier subcarpeta
**/temporal.txt

# Excepción: incluir un archivo aunque coincida con una regla anterior
*.log
!importante.log
```

Detalles importantes:

- `*` significa "cualquier secuencia de caracteres"
- `/` al final indica que es una carpeta
- `#` al inicio es un comentario
- `!` al inicio es una excepción (incluir aunque coincida con otra regla)

---

## .gitignore recomendado para análisis de datos

Aquí tienes un `.gitignore` completo para usar en tus proyectos de análisis en CBC. Cópialo tal cual:

```gitignore
# ====================
# Python
# ====================
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
*.egg-info/

# ====================
# Entornos virtuales
# ====================
.venv/
venv/
env/
ENV/

# ====================
# Jupyter Notebooks
# ====================
.ipynb_checkpoints/
*.ipynb_checkpoints

# ====================
# IDEs y editores
# ====================
.vscode/
.idea/
*.swp
*.swo
*~

# ====================
# Sistema operativo
# ====================
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# ====================
# Configuración de Databricks
# ====================
.databrickscfg
.databricks/

# ====================
# Variables de entorno y secretos
# ====================
.env
.env.local
.env.*.local
*.pem
*.key
secrets/

# ====================
# Datos (no versionar)
# ====================
*.csv
*.xlsx
*.xls
*.parquet
*.feather
data/raw/
data/processed/

# ====================
# Outputs y temporales
# ====================
*.log
*.tmp
*.bak
output/
tmp/

# ====================
# Modelos entrenados
# ====================
*.pkl
*.h5
*.pt
*.pth
models/

# ====================
# Documentación generada
# ====================
docs/_build/
site/
```

> 💡 **Tip:** este archivo debe ser uno de los primeros que crees en cualquier repositorio nuevo. Incluso antes de empezar a programar.

---

## El timing importa: .gitignore antes de commitear

Aquí viene el detalle CRÍTICO: `.gitignore` solo afecta a archivos que **todavía no están siendo rastreados** por Git.

### Escenario malo

Si commiteas un archivo y DESPUÉS lo agregas al `.gitignore`, **Git va a seguir rastreando ese archivo**. Las exclusiones no aplican retroactivamente.

```bash
git add config.local.yaml
git commit -m "Agregar configuración"

# Te das cuenta de que era un error, agregas al .gitignore
echo "config.local.yaml" >> .gitignore
git add .gitignore
git commit -m "Agregar gitignore"

# El archivo SIGUE en el historial. Sigue siendo rastreado.
```

Para sacarlo, necesitas el comando especial:

```bash
git rm --cached config.local.yaml
git commit -m "Dejar de rastrear configuración local"
```

> ⚠️ **Lección clave:** crea el `.gitignore` ANTES de hacer tu primer commit. Si te das cuenta tarde, todavía puedes resolverlo, pero es más doloroso.

---

## Verificar qué archivos están siendo ignorados

A veces dudas si tu `.gitignore` está funcionando bien. Para verificar:

```bash
git status --ignored
```

Te muestra los archivos que Git está ignorando. Si esperabas que un archivo se ignorara y no lo ves ahí, tu regla del `.gitignore` está mal escrita.

Otro comando útil:

```bash
git check-ignore -v archivo_problematico.csv
```

Te dice exactamente qué línea del `.gitignore` está excluyendo ese archivo. Súper útil para debuggear.

---

## .gitignore globales (para tu computadora completa)

Si hay archivos que SIEMPRE quieres ignorar en TODOS tus repositorios (como `.DS_Store` en Mac, o `Thumbs.db` en Windows), puedes configurarlos a nivel global:

```bash
git config --global core.excludesFile ~/.gitignore_global
```

Y crea el archivo:

```bash
touch ~/.gitignore_global
```

Edítalo con las exclusiones que apliquen a todos tus proyectos:

```gitignore
# Archivos de sistema
.DS_Store
Thumbs.db

# Editores
*.swp
.vscode/
.idea/
```

> 💡 **Ventaja:** no tienes que repetir estas reglas en cada `.gitignore` de cada proyecto.

---

## Errores comunes con .gitignore

### El archivo no se ignora aunque está en .gitignore

Causa más común: el archivo ya estaba siendo rastreado antes de agregarlo al `.gitignore`. Solución: `git rm --cached archivo` y commitea.

### Toda una carpeta se ignora pero quiero incluir UN archivo

Usa la sintaxis de excepción:

```gitignore
data/*
!data/README.md
```

Ignora todo lo de `data/` excepto el `README.md`.

### Olvidé .gitignore y subí secretos al repo

Si SOLO está en tu local: `git rm --cached`, agrega al `.gitignore`, commitea.

Si ya hiciste push al remoto y otros pueden verlo: el secreto está comprometido. **Cámbialo inmediatamente**. Limpiar el historial de Git es complicado y no garantiza que nadie haya visto el secreto.

---

## 🎯 Tareas

**Tarea 1:** En tu repositorio de práctica, crea un archivo `.gitignore` con las exclusiones recomendadas para análisis de datos.

**Tarea 2:** Crea un archivo de prueba `secret.txt` con cualquier contenido. Verifica que NO aparece en `git status` (porque está siendo ignorado).

**Tarea 3:** Crea una carpeta `.venv` vacía. Verifica que tampoco aparece.

**Tarea 4:** Crea un archivo `notas.md` (que NO esté en el `.gitignore`). Verifica que SÍ aparece en `git status`.

**Tarea 5:** Configura un `.gitignore` global para tu sistema operativo con los archivos típicos.

**Tarea 6:** Investiga: si CBC tiene un `.gitignore` estándar para proyectos de datos, intégralo a tu repo. Si no, propónselo a tu lead.

---

*Universidad Nexus — Curso de GitHub para Analistas*
