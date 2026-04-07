---
sidebar_position: 4
title: Sincronización de Archivos
---

# Sincronización de Archivos

Cuando trabajas con la extensión de Databricks en VSCode, hay dos modos principales de ejecutar tu código contra el cluster: **Databricks Connect** (que viste en la lección anterior) y **Sync + Run**, que es lo que vamos a cubrir aquí.

La sincronización es lo que hace que tus archivos locales aparezcan automáticamente en el workspace de Databricks, listos para ejecutarse o programarse como jobs.

---

## ¿Qué es la sincronización?

Imagina que tienes una carpeta local llamada `nexus_pilar4` con varios archivos:

```
nexus_pilar4/
├── carga_ventas.py
├── transformaciones.py
├── analisis_mensual.py
└── utils.py
```

Cuando configuras un destino de sincronización en Databricks (por ejemplo, `/Workspace/Users/tu_email/nexus_pilar4`), VSCode monitorea tu carpeta local y, cada vez que guardas un archivo, lo copia automáticamente al workspace de Databricks.

Es como tener una versión "espejo" de tu trabajo en la nube.

---

## ¿Por qué necesitas esto si ya tienes Databricks Connect?

Buena pregunta. Las dos opciones tienen casos de uso distintos:

| Característica | Databricks Connect | Sync de archivos |
|---|---|---|
| Velocidad de iteración | Más rápida (no copia archivos) | Más lenta (copia y ejecuta) |
| Debugging paso a paso | ✅ Sí | ❌ No |
| `dbutils.widgets` y similares | ❌ No | ✅ Sí |
| Programar como job | ❌ No | ✅ Sí |
| Ejecutar como notebook web | ❌ No | ✅ Sí |
| Compartir con el equipo | ❌ No directo | ✅ El archivo vive en el workspace |

> 💡 **Resumen:** Databricks Connect es para desarrollo y debugging. Sync es para llevar el código al workspace cuando ya está listo para correrse de verdad.

---

## Configurar la sincronización

Esto ya lo hiciste cuando configuraste la extensión por primera vez, pero vale la pena revisarlo en detalle.

### 1. Definir el destino

En el panel lateral de Databricks dentro de VSCode, hay una sección llamada "Sync Destination" (o "Workspace Folder", según versión). Click ahí para configurarlo.

VSCode te muestra una lista de carpetas disponibles en tu workspace. Elige una dentro de tu carpeta personal de usuario:

```
/Workspace/Users/tu_email@cbc.com/nexus_pilar4
```

Si la carpeta no existe, VSCode te ofrece crearla. Acepta.

### 2. Activar la sincronización

Una vez configurado el destino, hay un toggle o botón para "Start Sync". Actívalo. A partir de ese momento, cualquier cambio que guardes en archivos de tu carpeta local se copia automáticamente al destino remoto.

### 3. Verificar que funciona

Crea un archivo nuevo en tu carpeta local llamado `prueba_sync.py` con contenido:

```python
print("Sincronización funcionando correctamente")
```

Guarda. Ve al workspace de Databricks en el navegador (o al explorador del workspace dentro de VSCode), navega a tu carpeta destino, y verifica que el archivo apareció ahí.

---

## Tipos de archivos que se sincronizan

VSCode sincroniza casi todo lo que ponga en tu carpeta:

| Tipo | ¿Se sincroniza? |
|---|---|
| `.py` (Python scripts) | ✅ Sí |
| `.ipynb` (Jupyter notebooks) | ✅ Sí |
| `.sql` | ✅ Sí |
| `.md`, `.txt` | ✅ Sí |
| `.json`, `.yaml` | ✅ Sí |
| Imágenes (`.png`, `.jpg`) | ✅ Sí |
| `.venv/` y dependencias | ❌ No (exclusiones por defecto) |
| `__pycache__/` | ❌ No |
| Archivos `.gitignore` indicados | ❌ No |

> 💡 **Lo bueno:** la extensión es inteligente sobre qué excluir. No vas a sincronizar tu carpeta `.venv` con miles de archivos de librerías. Solo los archivos relevantes de tu proyecto.

---

## El archivo `.databrickscfg` y `.gitignore`

Hay algunos archivos que vale la pena conocer:

### `.databrickscfg`

Vive en tu carpeta personal del sistema (`~/.databrickscfg` en Mac/Linux, `%USERPROFILE%/.databrickscfg` en Windows). Contiene la configuración de tus conexiones a Databricks. Lo crea automáticamente la extensión cuando te autenticas.

> ⚠️ **Nunca compartas este archivo.** Contiene tokens y credenciales. Si trabajas con Git, asegúrate de que NO esté en tu repositorio.

### `.gitignore`

Si tu proyecto va a estar versionado con Git (lo verás en el siguiente pilar), conviene tener un `.gitignore` que excluya:

```
.venv/
__pycache__/
*.pyc
.databrickscfg
.databricks/
```

Esto evita que subas archivos generados, credenciales o entornos virtuales a tu repositorio.

---

## Ejecutar archivos sincronizados desde el workspace

Una vez que tu archivo está sincronizado, puedes ejecutarlo de varias formas:

### 1. Como notebook desde la web
Abre Databricks en el navegador, navega a la carpeta destino, y abre el archivo. Si es un `.py`, Databricks lo abre como notebook con celdas separadas por `# COMMAND ----------`.

> 💡 **Tip:** Para que Databricks reconozca tu archivo `.py` como notebook con celdas, agrega esta línea al inicio:
> ```python
> # Databricks notebook source
> ```
> Y separa secciones con:
> ```python
> # COMMAND ----------
> ```
> Esto te permite tener el mejor de los dos mundos: trabajas con un archivo `.py` plano en VSCode (con todas sus ventajas), pero Databricks lo ejecuta como notebook con celdas.

### 2. Como tarea de un Job
En la configuración de tu job, eliges como source `Workspace` y apuntas al archivo sincronizado. Cada vez que el job corra, ejecuta la última versión sincronizada.

### 3. Importarlo desde otro notebook
Si tu archivo es un módulo Python con funciones, puedes importarlo desde otros notebooks:

```python
%run "/Workspace/Users/tu_email/nexus_pilar4/utils"
```

O de forma más moderna:

```python
import sys
sys.path.append("/Workspace/Users/tu_email/nexus_pilar4")
from utils import limpiar_ventas
```

---

## Sincronización bidireccional vs unidireccional

Por defecto, la extensión de Databricks sincroniza **de tu local hacia el workspace remoto**. Es unidireccional: tú editas localmente y los cambios viajan a Databricks.

¿Qué pasa si modificas un archivo en el workspace web de Databricks directamente? Esos cambios NO bajan automáticamente a tu local. Pueden quedar desincronizados.

> ⚠️ **Regla práctica:** Mientras estés trabajando con sync activo, edita los archivos SOLO desde VSCode. No los toques desde la interfaz web de Databricks porque vas a perder esos cambios la próxima vez que sincronices.

Si necesitas traer cambios del workspace al local (porque alguien más editó algo, por ejemplo), tendrás que descargar manualmente esos archivos y reemplazarlos en tu local.

---

## Resolver conflictos de sincronización

A veces VSCode detecta que el archivo en el workspace remoto es diferente al local (porque alguien lo editó allá). Te lo dice con un icono de advertencia.

Tienes dos opciones:

1. **Sobrescribir remoto con local**: tu versión local pisa la del workspace. Útil si tú estás escribiendo el código autoritativo.
2. **Descargar remoto y reemplazar local**: la versión del workspace pisa tu local. Útil si quieres traer cambios que alguien más hizo.

No hay merge automático. Por eso es mejor evitar editar el mismo archivo desde dos lados al mismo tiempo.

---

## Buenas prácticas de sincronización

### 1. Usa una carpeta de destino exclusiva
No sincronices a una carpeta que ya tiene archivos de otros proyectos. Puedes pisar trabajo accidentalmente.

### 2. Excluye archivos sensibles
Configura las exclusiones de la extensión (settings.json) para evitar sincronizar credenciales, tokens o archivos temporales.

### 3. Verifica el estado del sync regularmente
La extensión te muestra el estado en su panel: "Synced", "Syncing", "Error". Si ves errores, resuélvelos antes de seguir trabajando.

### 4. No edites desde dos lados
Decide tu fuente de verdad (VSCode local), y mantén Databricks como espejo de solo lectura mientras editas.

### 5. Apaga el sync cuando termines
Si dejas el sync corriendo todo el día, consume ancho de banda innecesario. Apágalo cuando no estés trabajando activamente.

---

## 🎯 Tareas

**Tarea 1:** Verifica que tu sync destination está configurado correctamente. Si no lo está, configúralo a una carpeta dentro de tu directorio personal en Databricks.

**Tarea 2:** Crea un archivo `prueba_sync.py` localmente, guárdalo, y verifica que aparece en el workspace de Databricks.

**Tarea 3:** Agrega al archivo el header `# Databricks notebook source` y separa el contenido en dos celdas con `# COMMAND ----------`. Sincronízalo y ábrelo en la web. Verifica que se ve como notebook con celdas.

**Tarea 4:** Crea un `.gitignore` en tu proyecto local que excluya `.venv/`, `__pycache__/`, `.databrickscfg` y `.databricks/`. (Aunque todavía no uses Git, es buena costumbre tenerlo desde el inicio.)

**Tarea 5:** Modifica el archivo desde Databricks web a propósito. Vuelve a VSCode y observa el estado del sync. ¿Te muestra el conflicto? ¿Cómo lo resuelves?

---

*Universidad Nexus — Curso de Databricks y VSCode*
