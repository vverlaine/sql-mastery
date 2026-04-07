---
sidebar_position: 4
title: Instalación y Configuración Inicial
---

# Instalación y Configuración Inicial

Antes de hacer tu primer commit, necesitas tener Git instalado y configurado correctamente. Esta lección es 100% práctica: vas a instalar Git, configurar tu identidad, y verificar que todo está listo para empezar.

---

## Verificar si ya tienes Git instalado

En muchas computadoras, Git ya viene preinstalado o llegó con otras herramientas. Antes de instalar nada, vamos a verificar.

Abre la terminal:

- **Mac**: abre Terminal o usa la terminal integrada de VSCode (`Ctrl + backtick`)
- **Windows**: abre PowerShell o usa la terminal integrada de VSCode
- **Linux**: usa tu terminal favorita

Ejecuta este comando:

```bash
git --version
```

Si Git está instalado, verás algo como:

```
git version 2.43.0
```

Si NO está instalado, verás un mensaje de "command not found" o similar. En ese caso, sigue los pasos de instalación abajo.

> 💡 **Si la versión es muy vieja** (anterior a 2.30), te conviene actualizar. Las versiones modernas tienen funcionalidades importantes y mejor seguridad.

---

## Instalar Git

### En Mac

La forma más fácil es con Homebrew. Si no tienes Homebrew, instálalo desde https://brew.sh primero. Después:

```bash
brew install git
```

Verifica:

```bash
git --version
```

Alternativa: descarga el instalador desde https://git-scm.com/download/mac

### En Windows

Descarga Git for Windows desde https://git-scm.com/download/win

Durante la instalación:

- **Editor por defecto**: elige "Use Visual Studio Code as Git's default editor"
- **Línea de comandos**: elige "Git from the command line and also from 3rd-party software"
- **HTTPS**: elige "Use the OpenSSL library"
- **Line endings**: elige "Checkout Windows-style, commit Unix-style line endings"
- **Terminal emulator**: elige "Use Windows' default console window"
- **Credential helper**: elige "Git Credential Manager"
- El resto, deja las opciones por defecto

Después de instalar, abre PowerShell y verifica:

```powershell
git --version
```

### En Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install git
```

Verifica:

```bash
git --version
```

---

## Configurar tu identidad

Git necesita saber QUIÉN eres para registrar los commits con tu nombre. Esta configuración se hace UNA SOLA VEZ por computadora.

```bash
git config --global user.name "Tu Nombre Completo"
git config --global user.email "tu.email@cbc.com"
```

Ejemplo:

```bash
git config --global user.name "Victor Verlaine"
git config --global user.email "vverlaine@cbc.com"
```

> ⚠️ **MUY IMPORTANTE:** usa tu email corporativo de CBC, NO tu email personal. Cuando trabajes con repositorios de CBC, ese email tiene que coincidir con tu cuenta de GitHub Enterprise. Si usas un email distinto, los commits no se asociarán correctamente con tu usuario.

### Verificar la configuración

```bash
git config --global user.name
git config --global user.email
```

Debe devolverte exactamente lo que configuraste.

### Otros ajustes recomendados

Estos son opcionales pero altamente recomendados:

```bash
# Configurar el editor por defecto (VSCode)
git config --global core.editor "code --wait"

# Branch principal por defecto en repos nuevos
git config --global init.defaultBranch main

# Mostrar colores en la terminal
git config --global color.ui auto

# Auto-corregir errores de tipeo en comandos
git config --global help.autocorrect 1
```

Cada una de estas opciones la vas a apreciar más adelante. La primera (`core.editor "code --wait"`) hace que cuando Git necesite que escribas un mensaje largo, te abra VSCode en lugar de un editor de terminal anticuado.

---

## Configurar VSCode para Git

VSCode tiene soporte nativo de Git: no necesitas instalar nada extra. Pero hay algunas configuraciones que valen la pena ajustar.

Abre `settings.json` desde la paleta de comandos (`Cmd/Ctrl + Shift + P` → `Preferences: Open User Settings (JSON)`) y agrega:

```json
{
  "git.enableSmartCommit": true,
  "git.confirmSync": false,
  "git.autofetch": true,
  "git.autofetchPeriod": 180,
  "git.suggestSmartCommit": false,
  "scm.defaultViewMode": "tree"
}
```

Qué hace cada opción:

- **`enableSmartCommit`**: cuando no has hecho `git add` pero quieres commitear, VSCode te commitea todo lo modificado automáticamente
- **`confirmSync`**: evita el diálogo de confirmación cada vez que sincronizas
- **`autofetch`**: cada 3 minutos, verifica si hay cambios nuevos en el remoto
- **`scm.defaultViewMode: tree`**: muestra los archivos cambiados en árbol (por carpetas) en lugar de lista plana

Guarda el archivo. Los cambios aplican inmediatamente.

---

## El panel de Source Control de VSCode

VSCode tiene un panel dedicado a Git. Lo activas con:

- **Atajo**: `Cmd/Ctrl + Shift + G`
- **Click**: en el icono de Source Control en la Activity Bar (parece una bifurcación de ramas)

Por ahora el panel está casi vacío. Eso es normal: no tienes ningún repositorio abierto. Cuando empieces a trabajar con Git, este panel se va a llenar de información: archivos modificados, branches, commits.

> 💡 **Doble vista del curso:** durante todo el curso, voy a mostrarte cómo hacer cada cosa en LÍNEA DE COMANDOS y en el PANEL DE VSCODE. Tú decides cuál usar en cada momento.

---

## Configurar autenticación con GitHub Enterprise

Para conectarte al GitHub Enterprise de CBC, necesitas autenticación. Hay dos métodos comunes:

### Método 1: HTTPS con credential manager (recomendado para empezar)

Cuando hagas tu primer `git push` o `git clone` a un repo de CBC, Git te va a pedir credenciales. Las ingresas una vez, y el credential manager las guarda automáticamente. Después no te las pide más.

Para verificar que el credential manager está configurado:

```bash
git config --global credential.helper
```

Debería devolverte algo como:

- **Mac**: `osxkeychain`
- **Windows**: `manager-core` o `manager`
- **Linux**: `cache` o `store`

Si no devuelve nada, puedes activarlo con:

```bash
# Mac
git config --global credential.helper osxkeychain

# Windows (ya viene activado por defecto)
git config --global credential.helper manager

# Linux
git config --global credential.helper cache
```

### Método 2: SSH (para usuarios avanzados)

SSH es más seguro y más rápido, pero requiere generar y configurar llaves criptográficas. No es necesario para empezar; lo puedes configurar más adelante cuando ya domines el flujo básico.

> 💡 **Recomendación:** empieza con HTTPS. SSH es una optimización opcional, no un requisito.

---

## Configurar el acceso a GitHub Enterprise de CBC

CBC usa GitHub Enterprise, que es la versión empresarial de GitHub hospedada con un dominio propio. La URL será algo como `https://github.cbc.com` (pídela a tu lead si no la conoces).

Para verificar tu acceso:

1. Abre la URL del GitHub Enterprise de CBC en tu navegador
2. Inicia sesión con tu cuenta corporativa (típicamente SSO con Office 365)
3. Confirma que ves tu perfil

Si no puedes acceder, contacta al equipo de plataforma. Sin acceso a GitHub Enterprise no puedes avanzar en este pilar.

---

## Primer test: clonar un repositorio público

Vamos a hacer un primer test para confirmar que Git funciona. Vamos a clonar un repositorio público (no de CBC, solo para probar):

```bash
cd ~/Documents
git clone https://github.com/octocat/Hello-World.git
```

Si todo está bien:

- Git descarga el repositorio
- Te crea una carpeta `Hello-World`
- Adentro de la carpeta hay archivos del proyecto

Verifica:

```bash
cd Hello-World
ls
```

Debes ver al menos un archivo `README`. Si lo ves, **felicitaciones: tu Git funciona correctamente**.

Puedes borrar esa carpeta cuando quieras, fue solo un test.

---

## Errores comunes en la configuración

### "Git is not recognized as a command"
Git no está en el PATH del sistema. En Windows, reinstala Git asegurándote de marcar "Git from the command line". En Mac/Linux, verifica con `which git`.

### "Permission denied" al clonar
Probablemente intentaste clonar usando SSH sin tener llaves configuradas. Usa HTTPS en lugar.

### "Authentication failed"
Tu credential manager no está guardando bien las credenciales o las que ingresaste son incorrectas. Verifica con tu lead que tu cuenta tiene acceso al repositorio.

### Los commits aparecen sin tu nombre
Ejecutaste `git config user.name` SIN el flag `--global`. Eso solo configura para el repositorio actual. Vuelve a ejecutar con `--global`.

---

## 🎯 Tareas

**Tarea 1:** Verifica que Git está instalado con `git --version`. Si no lo está, instálalo.

**Tarea 2:** Configura tu identidad con tu nombre y email corporativo de CBC.

**Tarea 3:** Configura VSCode como editor por defecto de Git con `git config --global core.editor "code --wait"`.

**Tarea 4:** Aplica las configuraciones recomendadas en `settings.json` de VSCode.

**Tarea 5:** Verifica que puedes acceder a la URL del GitHub Enterprise de CBC desde tu navegador.

**Tarea 6:** Clona el repositorio de prueba `octocat/Hello-World` y verifica que la carpeta se crea correctamente.

---

*Universidad Nexus — Curso de GitHub para Analistas*
