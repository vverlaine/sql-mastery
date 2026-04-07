---
sidebar_position: 4
title: CI/CD Básico con GitHub Actions
---

# CI/CD Básico con GitHub Actions

**CI/CD** son las siglas de Continuous Integration / Continuous Deployment. Suena complicado pero la idea es simple: cada vez que alguien hace un cambio en el repositorio, **automáticamente** se ejecutan validaciones, pruebas y (a veces) despliegues.

GitHub Actions es la herramienta que GitHub provee para hacer esto. Esta lección te da una introducción suave a CI/CD para que entiendas qué pasa cuando ves "Checks" en un PR y puedas leer (no necesariamente escribir) workflows básicos.

---

## ¿Qué problema resuelve CI/CD?

Imagina este escenario sin CI/CD:

- Tu colega abre un PR
- Tú lo apruebas porque "se ve bien"
- Mergea a main
- Al día siguiente descubren que el código no pasaba los tests
- Tienen que revertir, hacer cambios, re-mergear

Esto es estresante y caro. CI/CD lo evita:

- Tu colega abre un PR
- Automáticamente se ejecutan los tests, el linter, el formato
- Si algo falla, GitHub bloquea el merge
- Tu colega arregla, los checks corren de nuevo
- Cuando todo pasa, mergea con confianza

> 💡 **CI/CD es tu red de seguridad automatizada.** Lo que el humano olvida revisar, el sistema lo verifica siempre.

---

## Los conceptos básicos

### Workflow

Un **workflow** es un archivo YAML que describe una serie de acciones automatizadas. Vive en la carpeta `.github/workflows/` del repo.

Ejemplo: el workflow `lint.yml` ejecuta el linter cada vez que alguien hace push.

### Trigger (evento)

Un **trigger** es lo que dispara el workflow. Los más comunes:

- **`push`**: cuando alguien hace push a una branch
- **`pull_request`**: cuando alguien abre o actualiza un PR
- **`schedule`**: en horarios programados (como un cron)
- **`workflow_dispatch`**: manualmente desde la UI

### Job

Un **job** es una unidad de trabajo dentro de un workflow. Un workflow puede tener uno o varios jobs que corren en paralelo o en secuencia.

### Step

Un **step** es una acción específica dentro de un job. Por ejemplo: "checkout del código", "instalar Python", "ejecutar tests".

### Runner

Un **runner** es la máquina virtual donde se ejecuta el workflow. GitHub provee runners gratuitos con Linux, Windows o macOS.

---

## Tu primer workflow: linting automático

Vamos a ver un ejemplo simple. Crea este archivo en tu repo:

```yaml
# .github/workflows/lint.yml
name: Lint

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install ruff black
      
      - name: Run Ruff
        run: ruff check .
      
      - name: Run Black
        run: black --check .
```

Voy a explicar cada parte:

### `name: Lint`
El nombre del workflow. Lo vas a ver en GitHub cuando los checks corran.

### `on:`
Los triggers. En este caso, se ejecuta cuando hay push a `main` o cuando alguien abre/actualiza un PR contra `main`.

### `jobs:`
La lista de jobs. Aquí solo hay uno: `lint`.

### `runs-on: ubuntu-latest`
La máquina donde se ejecuta. Ubuntu es lo más común.

### `steps:`
Los pasos que se ejecutan en orden:

1. **Checkout code**: descarga el código del repo en la máquina del runner
2. **Set up Python**: instala Python 3.11
3. **Install dependencies**: instala Ruff y Black
4. **Run Ruff**: ejecuta el linter
5. **Run Black**: verifica formato

Si CUALQUIER step falla, el workflow falla y el PR no se puede mergear.

---

## Cómo se ve esto en GitHub

Después de crear el workflow y commitearlo, cada vez que alguien abra un PR vas a ver una sección de "Checks" en el PR:

```
✓ Lint / lint (pull_request)
  Successful in 2m 15s
```

O si falla:

```
✗ Lint / lint (pull_request)
  Failed in 1m 45s
```

Click en "Details" para ver exactamente qué falló.

> 💡 **Las validaciones automáticas son OBJETIVAS.** No dependen de quién te toque revisar el PR. Si pasa los checks, sabes que cumple los estándares mínimos.

---

## Workflow más completo: lint + tests

Vamos a ver un workflow más realista que incluye linting y tests:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install
        run: |
          pip install ruff black
      - name: Ruff
        run: ruff check .
      - name: Black
        run: black --check .

  test:
    runs-on: ubuntu-latest
    needs: lint  # solo correr si lint pasó
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-cov
      - name: Run tests
        run: pytest tests/ --cov=lib --cov-report=term
```

Notas:

- **`needs: lint`**: el job `test` solo se ejecuta si `lint` pasó. Si el linter falla, ni siquiera intenta correr los tests.
- **Tests con cobertura**: ejecuta pytest sobre la carpeta `tests/` y reporta cuánto del código `lib/` está cubierto por tests.

---

## Workflows comunes en CBC

Los repos de CBC suelen tener varios workflows. Los más típicos:

### 1. `lint.yml`
Verifica formato y linting. Corre en cada PR.

### 2. `tests.yml`
Ejecuta los tests automatizados. Corre en cada PR.

### 3. `security.yml`
Análisis de seguridad: detecta secretos hardcoded, dependencias vulnerables. Corre en cada PR.

### 4. `deploy.yml`
Despliega a producción. Corre cuando algo se mergea a main.

### 5. `scheduled.yml`
Tareas programadas: backups, validaciones de datos, reportes automatizados.

---

## Leer un workflow existente

Cuando llegas a un repo nuevo en CBC, vale la pena revisar qué workflows tiene. Vas a:

1. Abrir la carpeta `.github/workflows/`
2. Leer cada archivo `.yml`
3. Entender qué se valida, cuándo, y qué pasa si falla

Esto te dice qué estándares aplica el equipo y cómo es el proceso de calidad.

> 💡 **NO necesitas saber escribir workflows.** Eso lo hace típicamente el equipo de plataforma. Pero SÍ necesitas saber leerlos para entender qué pasa cuando un check falla.

---

## Cuando un check falla en tu PR

Es muy normal que tus PRs tengan checks que fallan, especialmente al principio. Es parte del proceso. La pregunta es: ¿qué hacer?

### Paso 1: Leer el detalle

Click en "Details" del check que falló. GitHub te muestra el log completo del workflow.

### Paso 2: Encontrar el error

Busca líneas con "Error", "Failed", "FAIL". El sistema te dice exactamente qué archivo y qué línea.

### Paso 3: Reproducir localmente

Si el check es de linting, ejecuta el linter en tu máquina:

```bash
ruff check .
black --check .
```

Vas a ver los mismos errores. Arreglas, commitees, pusheas.

### Paso 4: Verificar que el check pasa

Después del push, GitHub re-ejecuta automáticamente el workflow. Si esta vez pasa, el check se vuelve verde.

> 💡 **NUNCA pidas que se "ignore" un check fallido.** Si el check existe, es porque el equipo decidió que era importante. Si crees que el check es excesivo, discútelo con tu equipo, no lo evades.

---

## Buenas prácticas con CI/CD

### 1. Tu PR debe pasar TODOS los checks antes de pedir review

No le hagas perder tiempo a tus reviewers con un PR que falla los checks básicos. Arregla primero, luego pide review.

### 2. Los checks son rápidos: úsalos como feedback

Algunos checks tardan minutos, otros segundos. Pushea a menudo para tener feedback rápido del CI.

### 3. No bypasses los checks con `--no-verify`

Hay trucos para saltarse los checks (`git commit --no-verify`). NO los uses. Si los necesitas, algo está mal.

### 4. Si un check empieza a fallar inesperadamente, investiga

A veces los checks fallan por razones externas (un servicio caído, una dependencia rota). Antes de asumir que tu código está mal, lee el error.

### 5. Reporta workflows rotos al equipo de plataforma

Si descubres un workflow mal configurado o que falla por bugs del sistema, reporta. No es tu responsabilidad arreglarlo (a menos que sea tu equipo), pero sí avisar.

---

## Una mirada al futuro: deployment automático

Algunos repos en CBC tienen workflows que despliegan automáticamente:

```yaml
deploy:
  needs: [lint, test]
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
  
  steps:
    - uses: actions/checkout@v4
    - name: Deploy to Databricks
      run: |
        databricks workspace import_dir notebooks/ /Workspace/Production
```

Lo que hace:

- Solo corre si lint Y tests pasaron
- Solo corre cuando hay un push a main
- Despliega los notebooks automáticamente al workspace de producción de Databricks

Esto es lo más cercano a "magia": haces merge a main, y a los pocos minutos tu código está en producción. **Sin intervención humana adicional.**

> 💡 **El deployment automático requiere alta confianza en los tests y el CI.** Si tus tests son débiles, vas a desplegar bugs constantemente.

---

## Resumen de CI/CD para análisis de datos

Para que los conceptos queden claros:

| Concepto | En palabras simples |
|---|---|
| **Workflow** | Archivo YAML que describe qué pasa automáticamente |
| **Trigger** | El evento que dispara el workflow (push, PR, etc.) |
| **Job** | Una unidad de trabajo dentro del workflow |
| **Step** | Un paso específico dentro de un job |
| **Check** | El resultado visible en el PR (✓ o ✗) |
| **CI** | Ejecutar validaciones automáticas en cada cambio |
| **CD** | Desplegar cambios automáticamente cuando pasan validaciones |

---

## 🎯 Tareas

**Tarea 1:** En tu repo de práctica, crea un workflow simple `lint.yml` que ejecute Ruff y Black.

**Tarea 2:** Hazle commit y push. Verifica que el workflow se ejecuta automáticamente.

**Tarea 3:** Crea una branch con código que NO pasa el linter (líneas muy largas, imports sin usar). Abre un PR. Verifica que el check falla.

**Tarea 4:** Arregla el código en la misma branch. Pushea. Verifica que el check ahora pasa.

**Tarea 5:** Investiga si los repos del equipo en CBC tienen workflows configurados. Lee los archivos `.yml` y entiende qué validan.

**Tarea 6:** La próxima vez que un check falle en uno de tus PRs reales, dedícale tiempo a entender exactamente qué falló y por qué.

---

*Universidad Nexus — Curso de GitHub para Analistas*
