---
sidebar_position: 2
title: Linting y Formatting Automático
---

# Linting y Formatting Automático

Hay dos preguntas que un analista NO debería estar respondiéndose nunca:

1. "¿Pongo este espacio aquí o no?"
2. "¿Esta variable está mal escrita o no se está usando?"

Para ambas existen herramientas que las responden automáticamente, sin que tú tengas que pensar en eso. Se llaman **formatters** y **linters**, y son la diferencia entre código que se ve profesional sin esfuerzo y código que se ve descuidado.

---

## La diferencia entre formatter y linter

Antes de instalar nada, conviene saber qué hace cada uno.

### Formatter
Reorganiza el aspecto visual de tu código según un estándar. Ajusta espacios, saltos de línea, indentación, longitud de líneas. **No cambia lo que el código hace, solo cómo se ve**.

El más usado en Python es **Black**. Es agresivo: aplica el mismo estilo siempre, sin opciones para personalizarlo. Eso es deliberado: elimina las discusiones de "¿2 o 4 espacios?" porque Black ya decidió por ti.

### Linter
Revisa tu código en busca de problemas: variables sin usar, imports innecesarios, funciones demasiado complejas, errores potenciales. **No cambia el código, te avisa de problemas**.

El más usado moderno es **Ruff**. Es rapidísimo y reemplaza a varias herramientas viejas (flake8, isort, pylint) en una sola.

> 💡 **Black + Ruff** es la combinación estándar de la industria moderna en Python. Si los configuras una vez, te ahorran horas en el resto de tu carrera.

---

## Instalar Black y Ruff

Ambas son librerías de Python que se instalan con pip. En tu entorno virtual:

```bash
pip install black ruff
```

Eso es todo. Ya las tienes disponibles.

Ahora necesitas configurar VSCode para que las use automáticamente.

---

## Configurar VSCode para usar Black

En la lección de extensiones ya instalaste el "Black Formatter". Ahora vamos a activarlo correctamente.

Abre tu `settings.json` (paleta de comandos → `Preferences: Open User Settings (JSON)`) y agrega o verifica que tienes esta sección:

```json
{
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": "explicit"
    }
  }
}
```

Qué hace cada línea:

- `editor.defaultFormatter`: cuando guardes un archivo Python, Black es el que lo formatea
- `editor.formatOnSave`: formatea automáticamente cada vez que guardas
- `source.organizeImports`: reorganiza los imports al inicio del archivo en orden alfabético

### Probarlo

Crea un archivo Python con código intencionalmente feo:

```python
import sys
import os
from pyspark.sql import functions as F
import re
def      mi_funcion(   x,   y,z=10  ):
    return x+y    +    z
resultado=mi_funcion(   1   ,   2   )
print(   resultado   )
```

Guarda con `Cmd/Ctrl + S`. El archivo se transforma automáticamente:

```python
import os
import re
import sys

from pyspark.sql import functions as F


def mi_funcion(x, y, z=10):
    return x + y + z


resultado = mi_funcion(1, 2)
print(resultado)
```

Imports ordenados alfabéticamente, espacios consistentes, líneas en blanco entre funciones, todo sin que tú levantes un dedo.

> 💡 **Si no funciona:** verifica que la extensión "Black Formatter" esté instalada (`Cmd/Ctrl + Shift + X` y busca "Black Formatter"). A veces VSCode pregunta cuál formatter usar la primera vez — selecciona Black.

---

## Configurar Ruff como linter

Black formatea, Ruff detecta problemas. Vamos a activarlo.

Primero, instala la extensión "Ruff" en VSCode si no lo hiciste antes (paleta → `Extensions: Install Extensions` → busca "Ruff" del autor `charliermarsh`).

Luego, agrega en tu `settings.json`:

```json
{
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": "explicit",
      "source.fixAll.ruff": "explicit"
    }
  },
  "ruff.organizeImports": false
}
```

Notas:

- Agregamos `"source.fixAll.ruff": "explicit"` para que Ruff arregle automáticamente lo que pueda al guardar
- `"ruff.organizeImports": false` evita que Ruff y Black peleen por organizar imports (dejamos a Black hacerlo)

### Probarlo

Abre cualquier archivo Python y agrega código con problemas:

```python
import os
import sys
import json  # ← este import no se usa

def calcular(x):
    resultado = x * 2  # ← variable que no se usa
    return x + 1
```

Verás subrayados de colores:

- `import json` aparece tachado o subrayado en gris (es un warning de "imported but unused")
- `resultado` también aparece marcado (variable asignada pero no usada)

Pasa el cursor sobre el problema y verás el mensaje de Ruff explicando qué está mal. Click derecho → "Source Action" → puedes pedirle que lo arregle automáticamente.

---

## Configurar reglas específicas de Ruff

Ruff tiene cientos de reglas. Por defecto activa solo las básicas. Para personalizar qué reglas quieres, crea un archivo `pyproject.toml` en la raíz de tu proyecto:

```toml
# pyproject.toml

[tool.ruff]
line-length = 88
target-version = "py310"

[tool.ruff.lint]
select = [
    "E",   # pycodestyle errors
    "W",   # pycodestyle warnings
    "F",   # pyflakes
    "I",   # isort
    "B",   # bugbear
    "UP",  # pyupgrade
]
ignore = [
    "E501",  # línea muy larga (Black ya lo maneja)
]

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
```

Qué activa esta configuración:

- **E, W**: estilo PEP 8 (la convención oficial de Python)
- **F**: detecta variables no usadas, imports no usados, código muerto
- **I**: ordena imports
- **B**: detecta bugs comunes (loops mal escritos, conversiones extrañas, etc.)
- **UP**: sugiere usar funcionalidades modernas de Python

> 💡 **No te asustes con las reglas.** Empieza con esta configuración base y solo ajusta si Ruff te está dando muchos warnings que consideras innecesarios. La mayoría son reglas sensatas.

---

## Configurar Black con pyproject.toml

Black también respeta `pyproject.toml`. Agrega esta sección al mismo archivo:

```toml
[tool.black]
line-length = 88
target-version = ["py310"]
```

Eso es prácticamente todo lo que se puede configurar de Black. Su filosofía es "una sola forma correcta", así que las opciones son mínimas.

> 💡 **`line-length = 88`** es el default de Black y la convención más común en Python moderno. Es un poco más larga que las 79 del PEP 8 original, pero más legible para código real.

---

## Pre-commit hooks (opcional pero útil)

Si quieres ir un paso más allá, puedes configurar **pre-commit hooks**: scripts que se ejecutan automáticamente antes de cada commit de Git, asegurando que el código está bien formateado y no tiene errores de linting.

Aunque todavía no usas Git formalmente, vale la pena conocer la idea para cuando llegues al pilar de GitHub.

Instalación básica:

```bash
pip install pre-commit
```

Crea un archivo `.pre-commit-config.yaml` en tu proyecto:

```yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.4.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
```

Actívalo:

```bash
pre-commit install
```

A partir de ese momento, cada vez que hagas `git commit`, los hooks corren Ruff y Black automáticamente. Si encuentran problemas, el commit se cancela hasta que los arregles.

> 💡 **Por qué importa:** Los pre-commit hooks aseguran que NUNCA llega código mal formateado al repositorio. Es la red de seguridad final.

---

## Beneficios concretos

¿Vale la pena todo este setup? Sí. Algunos beneficios concretos:

### 1. Acabas con las discusiones de estilo
"¿Pongo coma final en este array?" "¿Cuántos espacios después del operador?" Black decide, no tú. Adiós a las reuniones donde dos personas discuten el formato.

### 2. Tu código se lee igual en todo el equipo
Cuando todos usan Black, leer código de un colega se siente como leer el tuyo. La cohesión visual baja la carga cognitiva.

### 3. Detectas errores antes de ejecutar
Variable no usada, import roto, función con bug obvio: Ruff te lo avisa mientras escribes. Sin tener que ejecutar el código.

### 4. Los reviews de código son sobre lo que importa
En lugar de comentarios como "agrega un espacio aquí", los reviews se enfocan en lógica de negocio, decisiones de arquitectura, mejoras reales.

### 5. Te haces buen Python developer sin estudiar reglas
Cuando Ruff te marca el mismo error 10 veces, terminas aprendiendo la regla. Es educación pasiva.

---

## Errores comunes al empezar

### 1. Pelear con Black
La primera vez que Black formatea algo "feo" (a tu gusto), la tentación es desactivarlo. **Resiste**. Black tiene razón el 99% de las veces. Tu sentido estético se va a alinear con el suyo en una semana.

### 2. Ignorar warnings de Ruff
Cada warning de Ruff es una oportunidad de aprender. Léelos, entiende qué dice, arréglalo. Después de un mes ya no vas a generar esos warnings porque tu código va a ser mejor.

### 3. Configurar demasiado al inicio
No empieces tuneando 50 reglas. Usa los defaults. Solo personaliza cuando una regla específica te esté dando problemas reales.

### 4. No comitear `pyproject.toml`
El `pyproject.toml` debe vivir en el repo (sí se sube a Git) para que todo el equipo tenga la misma configuración. Sin él, cada quien tiene un setup distinto.

---

## 🎯 Tareas

**Tarea 1:** Instala Black y Ruff en tu entorno virtual: `pip install black ruff`.

**Tarea 2:** Configura VSCode con las settings que vimos para que formatee al guardar y lintee con Ruff.

**Tarea 3:** Crea un `pyproject.toml` en la raíz de tu proyecto con las configuraciones recomendadas para Black y Ruff.

**Tarea 4:** Toma uno de tus archivos Python existentes. Guárdalo. Observa qué cambia automáticamente.

**Tarea 5:** Intencionalmente rompe alguna regla simple (deja un import sin usar, una variable sin asignar, una línea muy larga). Verifica que Ruff la detecta y te muestra el warning.

---

*Universidad Nexus — Curso de Databricks y VSCode*
