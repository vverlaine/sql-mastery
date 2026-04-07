---
sidebar_position: 2
title: Configurar la Extensión de Databricks
---

# Configurar la Extensión de Databricks

En la sección anterior instalaste la extensión Databricks. Ahora vas a configurarla para que se conecte a tu workspace real de CBC. Es un proceso de tres pasos: autenticarte, elegir el workspace, y verificar que todo funciona.

---

## Antes de empezar: lo que necesitas tener

Para conectar VSCode con Databricks de CBC, necesitas:

1. **La URL del workspace** (algo como `https://adb-1234567890.12.azuredatabricks.net`). Pídesela a tu lead si no la tienes.
2. **Acceso de usuario al workspace** (deberías tenerlo si ya usaste Databricks en el módulo anterior).
3. **VSCode con la extensión Databricks instalada**.
4. **Una carpeta abierta en VSCode** donde vas a trabajar localmente. No funciona sin una carpeta abierta.

Verifica los cuatro puntos antes de continuar. Si te falta alguno, resuélvelo primero.

---

## Paso 1: Activar la extensión

Cuando tienes una carpeta abierta y la extensión instalada, en la Activity Bar de VSCode aparece un nuevo icono: el logo de Databricks.

Click en ese icono. Te abre el panel lateral con las opciones de Databricks. Si es la primera vez, vas a ver botones como "Configure Databricks" o "Connect to Databricks workspace".

> 💡 Si NO ves el icono de Databricks en la Activity Bar, la extensión no está activa. Reinicia VSCode (`> Reload Window` desde la paleta de comandos) y vuelve a verificar.

---

## Paso 2: Conectar al workspace

Haz click en el botón de configuración. VSCode te va a guiar paso a paso. Lo importante es saber qué seleccionar en cada pantalla:

### 2.1 Ingresar la URL del workspace

Te pide la URL completa de tu workspace de Databricks. Pega la que te dieron, por ejemplo:

```
https://adb-1234567890.12.azuredatabricks.net
```

Asegúrate de incluir `https://` al inicio. Sin el protocolo no funciona.

### 2.2 Elegir el método de autenticación

VSCode te ofrece varios métodos. El más recomendado para uso individual es **OAuth (U2M)** — User to Machine.

- **OAuth (U2M)**: te abre el navegador, te pide que inicies sesión en Databricks (con las credenciales corporativas), y guarda el token automáticamente. Es lo más simple y seguro.
- **Personal Access Token (PAT)**: generas un token desde Databricks y lo pegas en VSCode. Es válido pero requiere que renueves el token periódicamente.
- **Azure CLI**: solo si trabajas con Azure y ya tienes el CLI configurado.

> 💡 **Recomendación:** Empieza con OAuth U2M. Si tu organización tiene políticas estrictas que lo bloquean, usa PAT como alternativa.

### 2.3 Completar la autenticación

Si elegiste OAuth, VSCode abre tu navegador con la página de login de Databricks. Inicia sesión normalmente con tu cuenta corporativa. Después de iniciar sesión, te aparece una pantalla de "Authorization successful". Cierra esa pestaña y regresa a VSCode.

VSCode debería mostrar ahora "Connected" en el panel lateral, con tu nombre de usuario y el workspace.

---

## Paso 3: Elegir un cluster

Una vez conectado, VSCode necesita saber a qué **cluster** ejecutar tu código. En el panel lateral de Databricks, busca la sección "Cluster".

Click en "Configure cluster" o el icono de engrane. Se abre una lista con todos los clusters disponibles en tu workspace. Elige uno que esté corriendo (estado "Running") o uno que normalmente uses para análisis.

> 💡 **Si no hay clusters corriendo**, puedes iniciar uno desde la interfaz web de Databricks. Espera a que pase a estado "Running" (3-5 minutos) y luego refresca la lista en VSCode.

> ⚠️ **Importante:** Para que VSCode pueda ejecutar tu código en el cluster, el cluster debe tener instalada la librería `databricks-connect`. Los clusters compartidos en CBC ya la tienen. Si usas un cluster nuevo y no funciona, pide al equipo de plataforma que lo verifique.

---

## Paso 4: Configurar la carpeta destino

Cuando trabajes con archivos en VSCode, esos archivos viven en tu computadora. Pero necesitas decirle a Databricks dónde guardarlos también en su workspace para poder ejecutarlos.

En el panel de Databricks, busca la sección "Sync Destination" o "Workspace folder". Configura una carpeta destino, por ejemplo:

```
/Workspace/Users/tu_email@cbc.com/nexus_pilar4
```

Esa va a ser tu zona de trabajo en Databricks: cuando sincronices, los archivos de tu carpeta local se copian ahí.

> 💡 **Convención:** Usa una carpeta dentro de tu carpeta personal de usuario (`/Workspace/Users/tu_email`). Así no afectas el trabajo de otros mientras estás aprendiendo.

---

## Verificación: ejecutar el primer archivo

Para confirmar que todo funciona, vamos a ejecutar un archivo Python simple desde VSCode contra el cluster remoto.

### 1. Crear el archivo

En tu carpeta local abierta en VSCode, crea un archivo nuevo llamado `prueba_databricks.py` con este contenido:

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder.getOrCreate()

print("Conexión exitosa con Spark")
print(f"Versión de Spark: {spark.version}")

# Crear un DataFrame de prueba
data = [("Norte", 1500), ("Sur", 2300), ("Centro", 890)]
df = spark.createDataFrame(data, ["region", "monto"])

df.show()
```

### 2. Ejecutarlo en el cluster

En la barra de herramientas de VSCode (arriba a la derecha cuando tienes un archivo Python abierto), debería aparecer un botón con el logo de Databricks que dice "Run on Databricks".

Click en ese botón. VSCode va a:

1. Sincronizar tu archivo con el workspace de Databricks
2. Ejecutarlo en el cluster que configuraste
3. Mostrar el output en una terminal integrada de VSCode

Si todo está bien, vas a ver:

```
Conexión exitosa con Spark
Versión de Spark: 3.5.0
+------+-----+
|region|monto|
+------+-----+
| Norte| 1500|
|   Sur| 2300|
|Centro|  890|
+------+-----+
```

¡Felicidades! Si llegaste hasta aquí, tu setup está funcionando.

---

## Errores comunes y soluciones

### "Cluster not running"
El cluster que elegiste está apagado. Inícialo desde Databricks o elige uno que esté corriendo.

### "Authentication failed"
El token expiró o las credenciales son incorrectas. Vuelve a configurar la conexión desde cero. Si usas OAuth, simplemente vuelve a hacer login.

### "Workspace folder not configured"
No definiste la carpeta destino. Configúrala en el panel de Databricks → Sync Destination.

### "Permission denied" al escribir en el workspace
La carpeta destino que elegiste no te da permisos de escritura. Cambia a una carpeta dentro de tu directorio personal (`/Workspace/Users/tu_email/...`).

### "Module 'pyspark' not found"
Falta instalar `databricks-connect` en tu entorno local de Python. Esto es el siguiente paso (lo veremos en la próxima lección).

### El botón "Run on Databricks" no aparece
La extensión de Databricks no está activa o la carpeta no está conectada. Verifica el panel lateral de Databricks: debe mostrar "Connected" con tu workspace.

---

## El estado del panel lateral

Cuando todo está bien configurado, el panel lateral de Databricks debe mostrar varias secciones expandidas con información clara:

```
DATABRICKS

  CONFIGURATION
    ✓ Workspace: adb-1234567890.12.azuredatabricks.net
    ✓ Auth: OAuth U2M
    ✓ User: tu_email@cbc.com

  CLUSTER
    ✓ shared-cluster-prod (Running)

  SYNC DESTINATION
    ✓ /Workspace/Users/tu_email/nexus_pilar4

  WORKSPACE BROWSER
    > nexus_pilar4
    > otros_proyectos
```

Si alguna sección tiene una X en lugar de un check, hay algo mal configurado en ese paso. Click en la sección y resuelve el problema antes de continuar.

---

## 🎯 Tareas

**Tarea 1:** Pide a tu lead la URL del workspace de Databricks de CBC. Anótala en un lugar seguro.

**Tarea 2:** Configura la extensión de Databricks en VSCode usando OAuth U2M. Verifica que el panel lateral muestra "Connected" con tu usuario.

**Tarea 3:** Selecciona un cluster del workspace y configúralo en la extensión. Verifica que su estado es "Running".

**Tarea 4:** Configura una carpeta destino dentro de tu directorio personal en Databricks (`/Workspace/Users/tu_email/...`).

**Tarea 5:** Crea el archivo `prueba_databricks.py` con el código de la verificación, ejecútalo desde VSCode, y verifica que ves el DataFrame impreso.

**Tarea 6:** Si algo falla, identifica en qué paso estás atascado y resuélvelo usando la sección de errores comunes. Si no encuentras la solución, anota el error exacto y pídele ayuda a tu lead.

---

*Universidad Nexus — Curso de Databricks y VSCode*
