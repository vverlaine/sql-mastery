---
sidebar_position: 2
title: El Workspace de Databricks
---

# El Workspace de Databricks

El **workspace** es tu espacio de trabajo en Databricks. Es lo que ves cuando entras a la plataforma: un menú lateral, una zona central donde se abren tus archivos, y todo lo demás. Pero detrás de esa interfaz simple hay una organización pensada que vale la pena entender.

---

## La estructura del workspace

Cuando abres Databricks, ves un menú lateral con varias opciones. Estas son las que más vas a usar:

| Sección | Para qué sirve |
|---|---|
| **Workspace** | Tus notebooks, archivos y carpetas personales |
| **Catalog** | Las bases de datos y tablas (Unity Catalog) |
| **Compute** | Los clusters donde se ejecuta tu código |
| **Workflows** | Jobs programados que corren automáticamente |
| **SQL Editor** | Editor para escribir SQL puro |
| **Recents** | Acceso rápido a lo que abriste recientemente |

> 💡 **Un buen hábito desde el inicio:** Organiza tu carpeta personal en `Workspace`. Crea subcarpetas por proyecto, por mes o por cliente. Si tu carpeta tiene 50 notebooks sueltos, encontrar algo después es una pesadilla.

---

## Tu carpeta personal vs carpetas compartidas

Dentro de **Workspace**, hay dos tipos de espacios:

### Carpeta personal (`/Users/tu_email`)
Es tu espacio privado. Solo tú ves lo que pongas ahí. Úsala para:

- Pruebas, exploraciones, borradores
- Notebooks personales que no necesitas compartir
- Trabajo en progreso que aún no está listo para el equipo

### Carpetas compartidas (`/Workspace/Shared`)
Son espacios que múltiples personas pueden ver. Aquí va el trabajo del equipo:

- Notebooks de producción
- Análisis recurrentes que ejecuta el equipo
- Plantillas reutilizables

> ⚠️ **Cuidado:** Cualquier cosa que pongas en una carpeta compartida puede ser modificada o borrada por otras personas con permisos. Si estás experimentando con algo, mantenlo en tu carpeta personal hasta que esté listo.

---

## Tipos de archivos en el workspace

Databricks soporta varios tipos de archivos, no solo notebooks:

| Extensión | Tipo | Uso típico |
|---|---|---|
| `.ipynb` o sin extensión | Notebook | Análisis interactivo, exploración |
| `.py` | Script Python | Módulos reutilizables, lógica común |
| `.sql` | Script SQL | Consultas SQL puras |
| `.md` | Markdown | Documentación |
| `.json`, `.yaml` | Configuración | Parámetros de notebooks o jobs |

> 💡 **Por qué importa esto:** En el módulo anterior solo trabajaste con notebooks. Pero cuando empieces a construir proyectos serios, vas a necesitar separar tu código en archivos `.py` reutilizables. Saber que Databricks soporta esto te abre la puerta a organizar mejor tu trabajo.

---

## Importar y exportar contenido

Hay tres formas comunes de mover contenido al workspace:

### 1. Subir un archivo manualmente
Click derecho sobre una carpeta → `Import` → seleccionas el archivo. Útil para subir notebooks que recibiste por email o que descargaste de algún lado.

### 2. Clonar desde Git
Si tu equipo usa Git (cosa que vas a aprender en el Pilar 5), puedes clonar un repositorio completo dentro de Databricks usando **Repos**. Esto es lo más usado en producción.

### 3. Sincronizar desde VSCode
Esta es la opción más poderosa, y es exactamente lo que vas a aprender en este curso. Editas el código en tu computadora con VSCode y se sincroniza automáticamente con Databricks.

---

## Navegación rápida: la barra de comandos

Databricks tiene un atajo muy útil que pocos descubren al inicio: la **barra de comandos**. Se activa con:

- En Windows/Linux: `Ctrl + P`
- En Mac: `Cmd + P`

Te abre un buscador donde puedes escribir el nombre de cualquier notebook, archivo o tabla y saltar directamente a él. Es como Spotlight en Mac, pero para Databricks.

> 💡 **Esto solo te ahorra muchísimo tiempo.** Cuando tu workspace tenga 200 notebooks, este atajo va a ser tu mejor amigo. Empieza a usarlo desde el inicio.

---

## Configuración personal: lo mínimo que vale la pena ajustar

Databricks tiene muchas opciones de configuración, pero al inicio basta con estas tres:

### 1. Tema oscuro
`Settings → Theme → Dark`. Más cómodo para los ojos, especialmente si trabajas muchas horas seguidas.

### 2. Tamaño de fuente del editor
`Settings → Editor → Font size`. Súbelo si la fuente por defecto te queda chica. 14 o 15 suele ser cómodo.

### 3. Auto-save
Por defecto Databricks guarda automáticamente. Verifica que esté activado en `Settings → Notebook → Auto-save`. Es tu seguro contra perder trabajo si se cierra el navegador.

---

## 🎯 Tareas

**Tarea 1:** Entra a Databricks, navega a tu carpeta personal en Workspace y crea una carpeta llamada `universidad_nexus_pilar4`.

**Tarea 2:** Activa el tema oscuro y ajusta la fuente del editor a un tamaño cómodo.

**Tarea 3:** Practica el atajo de la barra de comandos (`Ctrl/Cmd + P`) buscando uno de tus notebooks recientes.

**Tarea 4:** Identifica en qué carpeta compartida vive tu equipo en CBC y verifica que tienes acceso de lectura. (Si no estás seguro, pregúntale a tu lead.)

---

*Universidad Nexus — Curso de Databricks y VSCode*
