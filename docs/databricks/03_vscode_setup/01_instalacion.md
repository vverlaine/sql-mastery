---
sidebar_position: 2
title: Instalación y Primeros Pasos
---

# Instalación y Primeros Pasos

Antes de poder hacer cualquier cosa en VSCode, necesitas tenerlo instalado y entender cómo se mueve. Esta lección cubre exactamente eso: instalación, primer recorrido por la interfaz, y los conceptos básicos para no sentirte perdido.

---

## Descargar e instalar

VSCode es gratis y funciona en Windows, Mac y Linux. La forma oficial de descargarlo es desde:

**https://code.visualstudio.com/**

El sitio detecta tu sistema operativo automáticamente y te ofrece el instalador correcto. Descárgalo, ejecútalo y sigue los pasos del instalador. No hay configuraciones complicadas que elegir.

> 💡 **En Windows:** Cuando te pregunte por opciones adicionales durante la instalación, marca "Add to PATH" y "Open with Code" para archivos y directorios. Te van a ahorrar tiempo después.

> 💡 **En Mac:** Después de instalar, abre VSCode y presiona `Cmd + Shift + P`, escribe "shell command" y selecciona "Install 'code' command in PATH". Esto te permite abrir VSCode desde la terminal con el comando `code`.

---

## El primer arranque

Cuando abres VSCode por primera vez, ves una pantalla de bienvenida que te ofrece configuraciones rápidas. Puedes ignorarla y cerrarla con la X de su pestaña. Vamos a configurar las cosas en orden propio.

Lo que ves entonces es la interfaz vacía. Tómate un momento para identificar las cuatro zonas principales:

```
┌──────────────────────────────────────────────┐
│ [Activity Bar]                               │
│ [Side]    [Editor Area]                      │
│ [Bar]                                        │
│           [Editor Area]                      │
│                                              │
│ [Status Bar]                                 │
└──────────────────────────────────────────────┘
```

### 1. Activity Bar (barra lateral izquierda)
Los iconos verticales del extremo izquierdo. Cada uno cambia lo que muestra el Side Bar. Los principales son:

- **Explorer**: archivos del proyecto abierto
- **Search**: búsqueda global en todos los archivos
- **Source Control**: control de versiones (Git)
- **Run and Debug**: para ejecutar y debuggear código
- **Extensions**: para instalar extensiones

### 2. Side Bar (panel lateral)
Muestra el contenido de la opción seleccionada en la Activity Bar. Si elegiste Explorer, ves los archivos. Si elegiste Search, ves la barra de búsqueda.

### 3. Editor Area (área central)
Donde editas el código. Puedes tener múltiples archivos abiertos simultáneamente como pestañas, y dividir la zona en columnas para ver dos archivos lado a lado.

### 4. Status Bar (barra inferior)
Información del archivo actual: lenguaje detectado, encoding, posición del cursor, branch de Git, errores y warnings.

---

## El concepto fundamental: workspaces y carpetas

VSCode no abre "archivos sueltos" como otros editores. Trabaja con **carpetas**. Cuando abres una carpeta en VSCode, esa carpeta se convierte en tu "workspace": el contexto de trabajo que VSCode usa para indexar archivos, ejecutar búsquedas, sugerir completados y aplicar configuraciones.

### Abrir una carpeta

Hay tres formas:

1. **Menú File → Open Folder** (Mac: `Cmd + O`, Windows: `Ctrl + K Ctrl + O`)
2. **Desde la terminal**: `code mi_carpeta` (después de instalar el comando `code` en PATH)
3. **Desde el explorador del sistema operativo**: click derecho sobre una carpeta → "Open with Code"

> 💡 **Costumbre desde el inicio:** Cuando empieces un proyecto nuevo, crea una carpeta dedicada y ábrela en VSCode. No abras archivos sueltos del escritorio. La carpeta es tu unidad de trabajo.

### Crear archivos dentro del workspace

Una vez que tienes una carpeta abierta, en el Explorer puedes crear archivos nuevos haciendo clic derecho en la carpeta → "New File", o usando los iconos en la parte superior del panel.

---

## La paleta de comandos: tu mejor amigo

Esta es probablemente la funcionalidad más importante de VSCode. Se activa con:

- **Mac**: `Cmd + Shift + P`
- **Windows/Linux**: `Ctrl + Shift + P`

Te abre un buscador donde puedes ejecutar **cualquier comando de VSCode** escribiendo su nombre. Cualquiera. Desde "abrir archivo" hasta "instalar extensión" hasta "cambiar tema".

Algunos comandos útiles para conocer desde el inicio:

```
> Open Folder
> Format Document
> Toggle Terminal
> Change Color Theme
> Preferences: Open User Settings
> File: Save All
```

> 💡 **Si no sabes cómo hacer algo en VSCode**, lo más probable es que escribir su nombre en la paleta de comandos te lo encuentre. Antes de buscar en Google, prueba con la paleta.

---

## La terminal integrada

VSCode tiene una terminal incorporada que se abre dentro del mismo editor. No necesitas alt-tab a otra aplicación.

Para abrirla:

- **Atajo**: `` Ctrl + ` `` (Ctrl + tecla del backtick) en cualquier sistema
- **Menú**: `View → Terminal`
- **Paleta de comandos**: `> Toggle Terminal`

La terminal aparece en la parte inferior. Es una terminal real (bash, zsh, PowerShell, dependiendo de tu sistema) y puedes ejecutar cualquier comando: `ls`, `python`, `git`, lo que sea.

> 💡 **Por qué importa:** Vas a usar la terminal mucho cuando trabajes con Databricks, especialmente para sincronizar archivos y ejecutar scripts. Tener una terminal a un atajo de distancia es uno de los grandes valores de VSCode.

---

## Atajos de teclado esenciales

Aprenderlos te va a hacer 5 veces más rápido. Empieza con estos:

| Atajo (Mac / Windows) | Acción |
|---|---|
| `Cmd/Ctrl + P` | Abrir archivo por nombre (Quick Open) |
| `Cmd/Ctrl + Shift + P` | Paleta de comandos |
| `Cmd/Ctrl + B` | Mostrar / ocultar Side Bar |
| `Cmd/Ctrl + S` | Guardar archivo |
| `Cmd/Ctrl + ,` | Abrir preferencias |
| `Cmd/Ctrl + /` | Comentar / descomentar línea |
| `Cmd/Ctrl + D` | Seleccionar siguiente ocurrencia de la palabra |
| `Cmd/Ctrl + F` | Buscar en archivo actual |
| `Cmd/Ctrl + Shift + F` | Buscar en todo el workspace |
| `` Ctrl + ` `` | Abrir / cerrar terminal |
| `F2` | Renombrar variable / función |

> 💡 **Consejo:** No intentes memorizar todos a la vez. Pega esta tabla en algún lado visible y úsala como referencia. En 2 semanas vas a tenerlos todos automatizados.

---

## Configuración inicial recomendada

VSCode funciona bien por defecto, pero hay algunas opciones que vale la pena ajustar desde el inicio. Abre la paleta de comandos y escribe:

```
> Preferences: Open User Settings (JSON)
```

Te abre un archivo `settings.json`. Pega esta configuración básica (o agrégala a la que ya exista):

```json
{
  "editor.fontSize": 14,
  "editor.tabSize": 4,
  "editor.insertSpaces": true,
  "editor.formatOnSave": true,
  "editor.minimap.enabled": false,
  "editor.renderWhitespace": "boundary",
  "editor.rulers": [88],
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "workbench.colorTheme": "Default Dark Modern"
}
```

Qué hace cada opción:

- `fontSize`: tamaño cómodo de fuente
- `tabSize` y `insertSpaces`: 4 espacios por tab (estándar de Python)
- `formatOnSave`: formatea el código automáticamente al guardar
- `minimap.enabled: false`: oculta el minimapa lateral (lo encuentro distractor)
- `rulers: [88]`: línea vertical en el caracter 88 como guía de longitud máxima
- `autoSave`: guarda automáticamente al pasar 1 segundo sin escribir
- `trimTrailingWhitespace`: elimina espacios al final de las líneas al guardar
- `insertFinalNewline`: asegura que cada archivo termine con una línea en blanco
- `colorTheme`: tema oscuro moderno

Guarda el archivo (`Cmd/Ctrl + S`). Los cambios aplican inmediatamente.

---

## Temas y personalización visual

Si no te gusta el tema por defecto, prueba otros con:

```
> Preferences: Color Theme
```

Algunos populares para análisis de datos:

- **Default Dark Modern**: el oscuro nuevo de VSCode, balanceado
- **One Dark Pro**: oscuro con buen contraste de colores
- **GitHub Dark Default**: el de GitHub, muy limpio
- **Solarized Light**: claro pero descansado para los ojos

> 💡 La elección del tema parece trivial pero afecta tu fatiga visual después de horas de uso. Prueba varios y quédate con el que te canse menos los ojos.

---

## 🎯 Tareas

**Tarea 1:** Descarga e instala VSCode desde el sitio oficial. Confirma que abre correctamente.

**Tarea 2:** Crea una carpeta vacía llamada `nexus_pilar4` en tu computadora y ábrela en VSCode con `File → Open Folder`.

**Tarea 3:** Crea un archivo nuevo dentro de la carpeta llamado `prueba.py`. Escribe `print("Hola Nexus")`. Guárdalo.

**Tarea 4:** Abre la terminal integrada (`` Ctrl + ` ``) y ejecuta `python prueba.py`. Verifica que imprime "Hola Nexus".

**Tarea 5:** Practica los atajos esenciales: abre la paleta de comandos, busca "format document", busca un archivo con `Cmd/Ctrl + P`, comenta una línea con `Cmd/Ctrl + /`.

**Tarea 6:** Aplica la configuración recomendada en `settings.json`. Verifica que el tema cambió y que el editor formatea al guardar.

---

*Universidad Nexus — Curso de Databricks y VSCode*
