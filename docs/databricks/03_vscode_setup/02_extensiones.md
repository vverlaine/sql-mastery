---
sidebar_position: 3
title: Extensiones Esenciales
---

# Extensiones Esenciales

VSCode "vacío" es un buen editor de texto. VSCode con las extensiones correctas es una herramienta poderosa para análisis de datos. La diferencia está en saber qué instalar (y qué NO instalar — el exceso de extensiones también es un problema).

En esta lección vas a instalar el set mínimo recomendado para trabajar con Python, SQL y datos. Nada más, nada menos.

---

## Cómo instalar extensiones

Hay dos formas principales:

### Desde la Activity Bar
Click en el icono de Extensions (cuatro cuadritos) en la barra lateral izquierda. Te abre el marketplace dentro de VSCode. Buscas la extensión por nombre y haces clic en "Install".

### Desde la paleta de comandos
```
> Extensions: Install Extensions
```

Te abre la misma vista. Es lo mismo, solo otro camino.

> 💡 **Atajo:** `Cmd/Ctrl + Shift + X` te lleva directo al panel de extensiones.

---

## Las 5 extensiones esenciales (instálalas todas)

Estas son obligatorias. Sin ellas, te estás perdiendo el 80% del valor de VSCode para análisis.

### 1. Python (oficial de Microsoft)

**ID:** `ms-python.python`

La extensión oficial de Python. Incluye:

- Sintaxis y resaltado
- Autocompletado básico
- Detección de errores en tiempo real
- Formato de código
- Debugging
- Soporte para entornos virtuales

Sin esta extensión, VSCode no entiende Python. Es lo primero que instalas.

### 2. Pylance (oficial de Microsoft)

**ID:** `ms-python.vscode-pylance`

Extiende la extensión de Python con autocompletado profundo, sugerencias inteligentes y verificación de tipos. Si la extensión Python te dice "esta función existe", Pylance te dice "esta función existe, recibe estos parámetros, y devuelve esto".

> 💡 **Por qué importa:** Pylance es lo que hace que VSCode se sienta "mágico" cuando escribes código. Te sugiere métodos al escribir un punto, te muestra documentación al pasar el mouse, y detecta errores de tipo antes de ejecutar.

### 3. Jupyter (oficial de Microsoft)

**ID:** `ms-toolsai.jupyter`

Te permite abrir y editar archivos `.ipynb` (notebooks de Jupyter) directamente en VSCode. Puedes ejecutar celdas, ver resultados, crear nuevas celdas — todo lo que harías en Jupyter o Databricks, pero dentro de VSCode.

Es importante porque vas a poder trabajar con notebooks de Databricks localmente, no solo con archivos `.py`.

### 4. Databricks (oficial de Databricks)

**ID:** `databricks.databricks`

La extensión que conecta VSCode con Databricks. Te permite:

- Sincronizar archivos entre tu computadora local y un workspace de Databricks
- Ejecutar código local contra clusters remotos de Databricks
- Ver el resultado en VSCode
- Navegar el workspace de Databricks sin salir de VSCode

Esta es LA extensión que hace que todo el módulo tenga sentido. La vamos a configurar en detalle en la siguiente sección.

### 5. SQLTools

**ID:** `mtxr.sqltools`

Editor de SQL con soporte para múltiples motores de base de datos. Te permite escribir SQL con autocompletado, formatear queries, y conectarte a fuentes de datos directamente desde VSCode.

Útil para preparar queries antes de pegarlas en Databricks, o para conectarte a otras bases de datos de CBC.

---

## Extensiones recomendadas (instala según necesites)

Estas son útiles pero no críticas. Instálalas si tu trabajo lo amerita.

### 6. Black Formatter

**ID:** `ms-python.black-formatter`

Formatea código Python automáticamente según el estándar Black. Activa "format on save" en settings.json y olvídate para siempre de pelearte con espacios y saltos de línea.

### 7. Ruff

**ID:** `charliermarsh.ruff`

Linter (revisor de calidad) de Python súper rápido. Te marca errores comunes, código innecesario, y problemas de estilo en tiempo real mientras escribes.

> 💡 **Black + Ruff** es la combinación moderna estándar para Python profesional. Negro formatea, Ruff revisa. Juntos te ahorran horas de "limpieza de código".

### 8. GitLens

**ID:** `eamodio.gitlens`

Mejora masivamente la experiencia de Git en VSCode. Te muestra quién escribió cada línea (blame inline), historial de cambios por línea, comparaciones visuales entre commits.

Es opcional para este pilar pero será muy útil cuando llegues al pilar de GitHub.

### 9. Material Icon Theme

**ID:** `pkief.material-icon-theme`

Reemplaza los iconos de archivos del Explorer con un set mucho más bonito y reconocible. Puramente estético, pero hace que el panel se vea mejor.

### 10. Indent-Rainbow

**ID:** `oderwat.indent-rainbow`

Colorea las indentaciones del código con colores alternados. Especialmente útil en Python, donde la indentación define la estructura.

---

## Lo que NO debes instalar

Aquí va un consejo contraintuitivo: **ten cuidado con instalar demasiadas extensiones**.

Cada extensión consume memoria, alenta el arranque de VSCode, y a veces entran en conflicto entre sí. Más no es mejor.

### Reglas prácticas

1. **No instales una extensión "por si acaso"**. Espera a tener una necesidad real.
2. **Si una extensión hace lo mismo que otra, escoge una**. No instales tres formatters de Python.
3. **Revisa tus extensiones cada cierto tiempo** y desinstala las que no usaste en el último mes.
4. **Prefiere las extensiones oficiales** de Microsoft, Databricks y autores conocidos. Menos sorpresas.

---

## Configuración mínima después de instalar

Después de instalar las extensiones esenciales, hay un par de cosas que vale la pena ajustar en tu `settings.json`. Abre la paleta de comandos:

```
> Preferences: Open User Settings (JSON)
```

Y agrega lo siguiente al objeto JSON existente:

```json
{
  // ... configuraciones anteriores ...

  "python.defaultInterpreterPath": "/usr/bin/python3",

  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": "explicit"
    }
  },

  "jupyter.askForKernelRestart": false,

  "files.associations": {
    "*.py": "python",
    "*.sql": "sql"
  }
}
```

Lo que hace cada cosa:

- **`python.defaultInterpreterPath`**: define qué Python usar por defecto. Ajusta la ruta según tu sistema (en Mac suele ser `/usr/bin/python3`, en Windows puede ser distinto).
- **`[python]` section**: configuraciones específicas para archivos Python. Activa el formato automático con Black y organiza imports al guardar.
- **`jupyter.askForKernelRestart: false`**: evita que Jupyter pregunte cada vez que reinicias el kernel.
- **`files.associations`**: asocia extensiones de archivo con lenguajes específicos para mejor soporte.

---

## Verificar que todo funciona

Después de instalar las extensiones y configurar:

### 1. Abrir un archivo Python
Crea o abre un `.py`. En la esquina inferior derecha del status bar, debe aparecer "Python" con la versión detectada. Si no aparece, hay algo mal con la extensión Python o el intérprete.

### 2. Probar autocompletado
Escribe `import pandas as pd` y luego en otra línea `pd.`. Debe aparecer un menú con todas las funciones de pandas (necesitas tenerlo instalado para ver el listado completo).

### 3. Probar formato al guardar
Escribe código Python con formato feo (espacios extras, indentación rara) y guarda con `Cmd/Ctrl + S`. Si Black está activo, el código se reformatea automáticamente.

### 4. Abrir un notebook
Abre cualquier `.ipynb` que tengas (puedes descargar uno de Databricks). Debe abrirse con el editor de notebooks integrado, no como texto plano.

Si los 4 puntos funcionan, tienes VSCode listo para empezar a trabajar.

---

## 🎯 Tareas

**Tarea 1:** Instala las 5 extensiones esenciales: Python, Pylance, Jupyter, Databricks, SQLTools.

**Tarea 2:** Aplica la configuración recomendada en tu `settings.json`. Si no sabes cuál es tu ruta de Python, abre una terminal y ejecuta `which python3` (Mac/Linux) o `where python` (Windows).

**Tarea 3:** Crea un archivo `test.py` con código Python intencionalmente mal formateado. Guarda y verifica que se formatea automáticamente.

**Tarea 4:** Importa una librería que NO existe (ej: `import xyzfoobar`). Verifica que VSCode te marca el error subrayado en rojo.

**Tarea 5:** Abre la lista de tus extensiones instaladas (`Cmd/Ctrl + Shift + X`). Identifica si tienes alguna que no usas y desinstálala.

---

*Universidad Nexus — Curso de Databricks y VSCode*
