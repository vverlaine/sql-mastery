---
sidebar_position: 3
title: Atajos y Productividad
---

# Atajos y Productividad

VSCode tiene cientos de funcionalidades. La mayoría de los usuarios usan menos del 10%. La diferencia entre alguien que usa el mouse para todo y alguien que domina los atajos puede ser de 2x o 3x en velocidad de trabajo.

Esta lección te da los atajos y técnicas que más impacto van a tener en tu día a día. No vas a memorizar todos en una semana — pero si los pones en práctica gradualmente, en un mes vas a ser notablemente más rápido.

---

## Los atajos esenciales (memorízalos primero)

Estos son los que vas a usar **todos los días, muchas veces al día**. Aprenderlos primero te da el mayor retorno.

| Atajo (Mac / Win-Linux) | Acción |
|---|---|
| `Cmd/Ctrl + P` | Abrir archivo por nombre (Quick Open) |
| `Cmd/Ctrl + Shift + P` | Paleta de comandos |
| `Cmd/Ctrl + S` | Guardar archivo |
| `Cmd/Ctrl + Shift + S` | Guardar todos los archivos |
| `Cmd/Ctrl + W` | Cerrar pestaña actual |
| `Cmd/Ctrl + Shift + T` | Reabrir pestaña cerrada |
| `Cmd/Ctrl + B` | Mostrar / ocultar Side Bar |
| `` Ctrl + ` `` | Abrir / cerrar terminal |
| `Cmd/Ctrl + F` | Buscar en archivo actual |
| `Cmd/Ctrl + Shift + F` | Buscar en todo el workspace |
| `Cmd/Ctrl + /` | Comentar / descomentar línea |

> 💡 **Estrategia para aprender:** No intentes usar los 11 a la vez. Toma 3 cada semana y forzate a usarlos. En 4 semanas los tienes automáticos.

---

## Edición multilinea: el game changer

Esta es la técnica que más te va a sorprender cuando la descubras. VSCode permite editar **muchas líneas a la vez** con múltiples cursores.

### Cursor adicional manual

Manten presionado `Alt` (Windows/Linux) o `Option` (Mac) y haz click en varios lugares. Ahora tienes múltiples cursores. Lo que escribas, se escribe en todos a la vez.

### Selección incremental con Cmd/Ctrl + D

Coloca el cursor sobre una palabra. Presiona `Cmd/Ctrl + D`. La palabra queda seleccionada. Vuelve a presionar `Cmd/Ctrl + D`: selecciona la siguiente ocurrencia. Y otra. Y otra.

Cada selección agregada es un cursor independiente. Cuando empiezas a escribir, modificas todas las selecciones a la vez.

**Caso real:** tienes que renombrar `df` a `ventas` en 10 lugares de tu archivo. En lugar de usar buscar-y-reemplazar:

1. Pones el cursor sobre `df`
2. Presionas `Cmd/Ctrl + D` diez veces
3. Escribes `ventas`
4. Listo, los 10 cambiaron a la vez

### Seleccionar todas las ocurrencias

Si quieres seleccionar TODAS las ocurrencias de una palabra de un solo golpe (no de a una):

- **Mac**: `Cmd + Shift + L`
- **Windows/Linux**: `Ctrl + Shift + L`

### Cursor en columnas (selección rectangular)

Útil cuando tienes datos alineados en columnas:

- **Mac**: `Option + Shift` + arrastrar con mouse
- **Windows/Linux**: `Alt + Shift` + arrastrar

Te permite seleccionar un bloque rectangular de texto y editar todas esas líneas al mismo tiempo.

> 💡 **Caso típico:** tienes una lista de columnas en una consulta SQL y quieres agregarles un alias. Con cursor en columna, agregas el `as ` a las 20 líneas en un solo movimiento.

---

## Refactoring asistido

VSCode tiene funcionalidades de refactoring que te ahorran horas. Las dos más útiles:

### Renombrar símbolos: F2

Coloca el cursor sobre cualquier variable, función o clase. Presiona `F2`. VSCode te pide el nuevo nombre. Cuando lo confirmas, **renombra TODAS las ocurrencias en todo el proyecto**, incluyendo otros archivos donde se importa.

A diferencia de buscar-y-reemplazar, F2 entiende el contexto: si tienes dos variables llamadas `total` en distintas funciones, solo renombra la que estás tocando.

### Extraer función

Selecciona un bloque de código. Click derecho → "Refactor" → "Extract to function". VSCode crea una nueva función con ese código, identifica los parámetros necesarios, y reemplaza el bloque por una llamada a la función.

Es la forma más rápida de refactorizar código duplicado a funciones reutilizables.

### Formatear con format on save

Ya lo configuraste en la lección anterior, pero vale la pena recordarlo: cada `Cmd/Ctrl + S` formatea automáticamente. Es refactoring continuo sin pensar.

---

## Navegación rápida

Moverte por archivos grandes sin scroll es otra habilidad clave.

### Saltar a una línea

`Cmd/Ctrl + G` te abre un input para saltar directamente a un número de línea. Útil cuando un error te dice "línea 247" y quieres ir directo allá.

### Ir a definición

Coloca el cursor sobre una función o variable. Presiona:

- **Mac**: `Cmd + Click` o `F12`
- **Windows/Linux**: `Ctrl + Click` o `F12`

VSCode salta a donde está definida esa función, incluso si está en otro archivo. Es la forma más rápida de entender código ajeno: "¿qué hace esta función? Click → la veo".

### Volver atrás

Después de saltar a definiciones, querrás volver al lugar donde estabas. Para eso:

- **Mac**: `Cmd + -` (Cmd y guión)
- **Windows/Linux**: `Alt + ←`

Y para ir hacia adelante después de retroceder:

- **Mac**: `Cmd + Shift + -`
- **Windows/Linux**: `Alt + →`

### Ver donde se usa

Click derecho sobre una función → "Find All References". VSCode te muestra TODOS los lugares donde esa función se llama, en todo el proyecto. Crítico cuando necesitas modificar algo crítico.

---

## Búsqueda potente

La búsqueda básica con `Cmd/Ctrl + F` está bien, pero tiene varias funcionalidades que pocos descubren.

### Búsqueda con regex

En la barra de búsqueda hay un icono `.*` que activa expresiones regulares. Útil para buscar patrones como:

- `def \w+_test` — todas las funciones cuyo nombre termina en `_test`
- `print\(.*\)` — todas las llamadas a print
- `# TODO:` — todos los comentarios pendientes

### Búsqueda case-sensitive

Otro icono activa la sensibilidad a mayúsculas/minúsculas. Útil cuando `Total` y `total` significan cosas distintas y no quieres encontrar las dos.

### Buscar palabra completa

Hay un icono que busca solo palabras completas, no fragmentos. Por ejemplo, si buscas `id`, no te encuentra `valid` o `consider` — solo `id` exacta.

### Búsqueda y reemplazo en todo el workspace

`Cmd/Ctrl + Shift + H` te abre un panel donde puedes buscar y reemplazar en TODO el proyecto. Útil para refactorizaciones grandes.

> ⚠️ **Cuidado:** antes de reemplazar masivamente, presiona "Replace" línea por línea para verificar que cada cambio es lo que quieres. Un reemplazo masivo mal hecho puede romper muchísimo código en segundos.

---

## Snippets: código que se autoescribe

VSCode te permite definir **snippets**: pedazos de código predefinidos que se insertan al escribir un atajo corto.

### Crear un snippet personal

Paleta de comandos → `Snippets: Configure Snippets` → elige `python.json`.

Te abre un archivo donde puedes definir snippets. Por ejemplo:

```json
{
  "Spark imports": {
    "prefix": "spkimp",
    "body": [
      "from pyspark.sql import functions as F",
      "from pyspark.sql import DataFrame",
      "from pyspark.sql.types import IntegerType, StringType, DateType"
    ],
    "description": "Imports comunes de PySpark"
  },
  
  "Notebook header": {
    "prefix": "nbhead",
    "body": [
      "# Databricks notebook source",
      "# MAGIC %md",
      "# MAGIC # ${1:Título del notebook}",
      "# MAGIC",
      "# MAGIC **Autor:** ${2:Tu Nombre}",
      "# MAGIC **Última actualización:** ${3:YYYY-MM-DD}",
      "# MAGIC",
      "# MAGIC ## Descripción",
      "# MAGIC ${4:Descripción del notebook}",
      "",
      "# COMMAND ----------",
      ""
    ],
    "description": "Encabezado de notebook productivo"
  }
}
```

Ahora cuando escribes `spkimp` y presionas Tab, VSCode inserta los tres imports completos. Cuando escribes `nbhead`, inserta el encabezado del notebook con campos editables (`${1:...}`) que puedes llenar tabulando entre ellos.

> 💡 **Crea un snippet por cada cosa repetitiva.** Si te das cuenta de que escribes la misma estructura dos veces al día, un snippet te ahorra horas al mes.

---

## Configurar tu propio teclado

Cualquier acción de VSCode puede tener su propio atajo personalizado. Paleta de comandos → `Preferences: Open Keyboard Shortcuts`.

Te abre una vista con TODOS los atajos. Click derecho en cualquiera → "Change Keybinding" para reasignar.

Casos típicos donde vale la pena personalizar:

- Activar/desactivar el sync de Databricks con un atajo
- Ejecutar el archivo actual en Databricks con una sola tecla
- Abrir tu archivo `lib/utils.py` con un atajo que te lleve directo

---

## Hábitos de productividad (no atajos, pero igual de importantes)

### 1. Cierra archivos que no estás usando
Más pestañas abiertas = más distracciones. Cierra las que no necesites con `Cmd/Ctrl + W`.

### 2. Usa el zoom estratégicamente
`Cmd/Ctrl + +` y `Cmd/Ctrl + -` cambian el tamaño de la fuente al instante. Útil cuando estás cansado y quieres más letra grande, o cuando quieres ver más código en pantalla.

### 3. Pin pestañas importantes
Click derecho en una pestaña → "Pin Tab". La pestaña queda fija al inicio y no se mueve cuando abres más archivos. Útil para tu archivo principal del día.

### 4. Usa breadcrumbs
Arriba del editor hay una "miga de pan" mostrando la jerarquía: `proyecto > lib > transformaciones.py > limpiar_ventas`. Click en cualquier nivel para navegar rápidamente.

### 5. Toma descansos
Tu productividad real con VSCode depende de tu energía, no de tu velocidad. 50 minutos enfocado y 10 de descanso vale más que 90 minutos cansado.

---

## La curva de aprendizaje

Probablemente al final de esta lección estés pensando "son demasiados atajos". Es normal. Aquí está el ritmo realista:

- **Semana 1**: usa solo `Cmd/Ctrl + P`, `Cmd/Ctrl + S`, `Cmd/Ctrl + F` y la terminal integrada
- **Semana 2**: agrega multi-cursor con `Cmd/Ctrl + D`
- **Semana 3**: agrega `F2` para renombrar y `F12` para ir a definición
- **Semana 4**: agrega búsqueda global y refactoring
- **Mes 2**: empiezas a crear tus propios snippets

En 2 meses estás trabajando significativamente más rápido sin que se sienta como un esfuerzo.

---

## 🎯 Tareas

**Tarea 1:** Imprime (o guarda en una nota visible) la tabla de atajos esenciales. Tenla a la mano la primera semana.

**Tarea 2:** Practica multi-cursor: abre un archivo Python y usa `Cmd/Ctrl + D` para seleccionar todas las ocurrencias de una variable. Renómbrala.

**Tarea 3:** Practica refactoring: en uno de tus archivos, renombra una función con `F2`. Verifica que todos los usos en el proyecto se actualizaron.

**Tarea 4:** Crea tu primer snippet personal en `python.json`. Algo que escribas seguido. Pruébalo escribiendo el prefijo + Tab.

**Tarea 5:** Configura un atajo personalizado para una acción que uses mucho. Por ejemplo, "Run Python File" si todavía no tiene atajo.

---

*Universidad Nexus — Curso de Databricks y VSCode*
