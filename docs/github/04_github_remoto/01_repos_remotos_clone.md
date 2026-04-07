---
sidebar_position: 2
title: Repositorios Remotos y Clone
---

# Repositorios Remotos y Clone

Un **repositorio remoto** es una copia de tu repositorio que vive en un servidor (en nuestro caso, GitHub Enterprise de CBC). Es el "punto de encuentro" donde tu equipo sincroniza el trabajo.

Esta lección te enseña los conceptos fundamentales de los remotos y cómo clonar un repositorio existente.

---

## ¿Qué es un repositorio remoto?

Imagínate este escenario:

- Tú tienes un repo en tu Mac
- Tu colega María tiene una copia del mismo repo en su PC
- Carlos tiene otra copia en su laptop
- Hay UN repositorio "central" en GitHub Enterprise que todos comparten

```
                    ┌─────────────────┐
                    │ GitHub Enterprise│
                    │  (repo central) │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         ┌────▼───┐     ┌────▼───┐     ┌────▼───┐
         │ Tu Mac │     │ María  │     │ Carlos │
         └────────┘     └────────┘     └────────┘
```

Cada uno trabaja en su copia local, y periódicamente:

- **Sube** sus cambios al central (`git push`)
- **Baja** los cambios de los otros (`git pull`)

GitHub Enterprise es el lugar donde todos se sincronizan. Sin él, tendrían que mandarse archivos por Slack o correo, lo cual es un desastre.

---

## Origin: el remoto por defecto

Cuando trabajas con un repo remoto, Git le pone un nombre interno: el **alias del remoto**. Por convención, el remoto principal se llama **`origin`**.

Cuando ejecutas:

```bash
git push origin main
```

Le estás diciendo a Git: "sube los cambios de la branch `main` al remoto que se llama `origin`".

Puedes tener múltiples remotos (poco común), pero al inicio solo vas a tener `origin` y eso es todo lo que necesitas saber.

---

## Clonar un repositorio existente

Lo más común al unirte a un proyecto en CBC es **clonar** un repo que ya existe en GitHub Enterprise. Clonar significa "descargar una copia local del repo".

### Encontrar la URL del repositorio

En GitHub Enterprise:

1. Navega al repositorio
2. Click en el botón verde `<> Code`
3. Verás dos opciones: HTTPS y SSH
4. Copia la URL HTTPS (algo como `https://github.cbc.com/equipo-data/proyecto-ventas.git`)

### Modo línea de comandos

```bash
cd ~/Documents
git clone https://github.cbc.com/equipo-data/proyecto-ventas.git
```

Git va a:

1. Crear una carpeta llamada `proyecto-ventas`
2. Descargar todo el contenido del repo (incluyendo el historial completo)
3. Configurar `origin` automáticamente apuntando al remoto

Después puedes entrar a la carpeta:

```bash
cd proyecto-ventas
ls
git status
```

Vas a ver los archivos del proyecto y `git status` te dice "On branch main, nothing to commit, working tree clean". Estás listo para trabajar.

### Modo VSCode

1. Abre la paleta de comandos (`Cmd/Ctrl + Shift + P`)
2. Escribe "Git: Clone"
3. Pega la URL del repositorio
4. VSCode te pregunta dónde guardar la carpeta
5. Cuando termina, te ofrece abrirla automáticamente

### Cambiar el nombre de la carpeta al clonar

Por defecto, Git crea una carpeta con el mismo nombre del repo. Si quieres otro nombre:

```bash
git clone https://github.cbc.com/equipo-data/proyecto-ventas.git mi-carpeta-custom
```

---

## Verificar el remoto

Una vez clonado, puedes verificar a qué remoto está conectado tu repo:

```bash
git remote -v
```

Te muestra:

```
origin  https://github.cbc.com/equipo-data/proyecto-ventas.git (fetch)
origin  https://github.cbc.com/equipo-data/proyecto-ventas.git (push)
```

Hay dos líneas porque Git tiene URLs separadas para fetch (bajar) y push (subir). En la práctica casi siempre son la misma.

---

## Crear un repositorio nuevo en GitHub Enterprise

A veces no clonas, sino que creas un repo nuevo desde cero. Hay dos flujos comunes.

### Flujo 1: Crear primero en GitHub, luego clonar

1. Ve a GitHub Enterprise
2. Click en `+` arriba a la derecha → `New repository`
3. Llena los campos:
   - **Repository name**: nombre del repo (sin espacios, usa guiones)
   - **Description**: descripción corta del propósito
   - **Visibility**: Public, Internal o Private
   - **Initialize this repository with**: marca "Add a README file" si es nuevo
4. Click en `Create repository`
5. Copia la URL del repo
6. Clónalo a tu computadora:

```bash
git clone https://github.cbc.com/equipo-data/mi-nuevo-repo.git
```

Listo. Ya tienes el repo local conectado al remoto.

### Flujo 2: Crear local primero, luego conectar

A veces ya tienes una carpeta con código local y quieres convertirla en repo en GitHub.

```bash
# Estás en tu carpeta local
cd ~/Documents/mi-proyecto

# Inicializar Git
git init

# Crear .gitignore primero
# ... agregar exclusiones ...

# Hacer el primer commit
git add .
git commit -m "Initial commit"

# Renombrar branch a main (si está en master por defecto)
git branch -M main
```

Ahora ve a GitHub Enterprise y crea el repo (mismos pasos del flujo 1, pero **NO marques** "Add a README file"; el repo debe estar vacío).

Después, conecta tu local con el remoto:

```bash
git remote add origin https://github.cbc.com/equipo-data/mi-proyecto.git
git push -u origin main
```

Lo que hizo:

- **`git remote add origin <url>`**: agrega un remoto llamado `origin`
- **`git push -u origin main`**: sube la branch `main` al remoto. El `-u` configura el "tracking" para que en el futuro solo necesites `git push`

> 💡 **El flag `-u` es importante en el primer push.** Sin él, vas a tener que escribir `git push origin main` cada vez. Con él, basta con `git push`.

---

## Comparación: clonar vs init + push

| Cuándo usar | Comando |
|---|---|
| Te uniste a un proyecto existente | `git clone <url>` |
| Empiezas un proyecto nuevo en GitHub | Crear en GitHub → `git clone` |
| Tienes código local que quieres subir | `git init` → `git remote add` → `git push -u` |

En CBC, lo más común es el primer caso: clonas un repo existente del equipo y empiezas a trabajar.

---

## Estructura típica de un repo de CBC

Cuando clonas un repo de un equipo en CBC, vas a ver una estructura parecida a la que aprendiste en el Pilar 4:

```
proyecto-ventas/
├── README.md              ← qué hace el proyecto
├── .gitignore
├── pyproject.toml          ← configuración de Python
├── notebooks/              ← análisis exploratorios
│   ├── 01_exploracion.py
│   └── 02_validacion.py
├── lib/                    ← funciones reutilizables
│   ├── __init__.py
│   ├── carga_datos.py
│   └── transformaciones.py
├── jobs/                   ← notebooks programados
│   └── proceso_mensual.py
├── tests/                  ← pruebas
└── docs/                   ← documentación
```

> 💡 **Si el repo NO tiene esta estructura**, es probablemente uno viejo. La estructura del Pilar 4 es la convención moderna que estamos adoptando.

---

## Lo primero que haces al clonar un repo

Tienes un flujo recomendado al clonar un repo nuevo en CBC:

```bash
# 1. Clonar
git clone https://github.cbc.com/equipo/proyecto.git

# 2. Entrar
cd proyecto

# 3. Leer el README
cat README.md  # o ábrelo en VSCode

# 4. Crear el entorno virtual
python3 -m venv .venv
source .venv/bin/activate

# 5. Instalar dependencias (si hay requirements.txt o pyproject.toml)
pip install -r requirements.txt

# 6. Verificar que funciona
# ... ejecutar algún test simple del proyecto ...
```

Si seguiste estos 6 pasos y todo funciona, estás listo para trabajar en el proyecto.

---

## Errores comunes al clonar

### "Repository not found"

- La URL está mal escrita
- No tienes acceso al repo (es privado y no estás en el equipo)
- Estás autenticando con un usuario incorrecto

Verifica con tu lead que tienes acceso.

### "Authentication failed"

Las credenciales que diste son incorrectas o el token expiró. Vuelve a configurar la autenticación.

### "fatal: destination path already exists"

Ya existe una carpeta con ese nombre. Borra la carpeta o usa un nombre distinto:

```bash
git clone <url> nombre-distinto
```

### Clonaste pero no ves los archivos

Probablemente el repo está vacío o solo tiene branches diferentes a `main`. Ejecuta:

```bash
git branch -a
```

Para ver todas las branches disponibles, y cambia a la correcta con `git switch <branch>`.

---

## Trabajar con repos privados desde la primera vez

CBC usa repos internos/privados. La primera vez que clones uno, tu computadora necesita autenticarse contra GitHub Enterprise.

### Si configuraste credential manager

Git te va a pedir usuario y contraseña la primera vez. Después las guarda automáticamente. No te las pide más (a menos que cambies la contraseña).

### Si te pide contraseña múltiples veces

Esto significa que el credential manager no está funcionando. Posibles causas:

- No está configurado (`git config --global credential.helper`)
- En Windows, usa `manager-core` o `manager`
- En Mac, usa `osxkeychain`

Configura y vuelve a intentar.

### Personal Access Tokens (PATs)

GitHub Enterprise requiere usar **Personal Access Tokens** en lugar de tu contraseña normal. Para crear uno:

1. En GitHub Enterprise, click en tu avatar → `Settings`
2. `Developer settings` → `Personal access tokens` → `Tokens (classic)`
3. `Generate new token`
4. Dale un nombre descriptivo
5. Selecciona los scopes que necesitas (al inicio, marca `repo` que cubre todo)
6. Copia el token (solo se muestra UNA vez)
7. Usa ESE token como tu "contraseña" cuando Git la pida

> ⚠️ **Guarda tu token en un lugar seguro.** Si lo pierdes, no lo puedes recuperar; tienes que generar uno nuevo. Y NUNCA lo subas a un repo o lo pegues en código.

---

## 🎯 Tareas

**Tarea 1:** Pide a tu lead la URL de un repositorio de práctica en GitHub Enterprise de CBC al que tengas acceso de lectura.

**Tarea 2:** Clónalo a tu computadora con `git clone`.

**Tarea 3:** Verifica el remoto con `git remote -v`.

**Tarea 4:** Lee el README del repo. Entiende qué hace.

**Tarea 5:** Lista las branches disponibles con `git branch -a`.

**Tarea 6:** Crea un repositorio vacío en GitHub Enterprise de CBC (con permiso de tu lead). Pónle un nombre como `nexus-pilar5-pruebas`.

**Tarea 7:** Conecta tu repo de práctica local (el que vienes usando en este curso) con el remoto que acabas de crear, usando `git remote add origin <url>` y `git push -u origin main`.

**Tarea 8:** Verifica en GitHub Enterprise que tu repo aparece con todos los commits que hiciste localmente.

---

*Universidad Nexus — Curso de GitHub para Analistas*
