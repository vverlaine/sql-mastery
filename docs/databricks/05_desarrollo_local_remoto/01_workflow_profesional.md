---
sidebar_position: 2
title: El Workflow Profesional
---

# El Workflow Profesional

Saber instalar VSCode y conectarlo a Databricks no es lo mismo que saber **trabajar profesionalmente** con esa configuración. La diferencia está en los pequeños hábitos y decisiones del día a día. Esta lección te muestra cómo organiza su trabajo un analista que ya tiene este flujo dominado.

---

## La sesión de trabajo típica

Veamos cómo se ve un día normal de un analista en CBC usando este flujo. No es una receta rígida, pero captura los patrones más comunes.

### 1. Abrir el proyecto en VSCode

En lugar de abrir Databricks en el navegador, abres VSCode y abres la carpeta del proyecto en el que estás trabajando. Esa carpeta tiene tus archivos, tu `.venv`, tu `.gitignore` y tu configuración.

```bash
cd ~/proyectos/cbc_analytics_ventas
code .
```

> 💡 **El comando `code .` te abre VSCode con la carpeta actual.** Es uno de los atajos más usados en el día a día.

### 2. Activar el entorno virtual

En la terminal integrada de VSCode:

```bash
source .venv/bin/activate
```

VSCode detecta el `.venv` automáticamente y te pregunta si quieres usar ese intérprete. Acepta. A partir de ahora, todo el código Python que ejecutes localmente usa ese entorno aislado.

### 3. Verificar el estado de la conexión

En el panel lateral de Databricks (icono en la Activity Bar), verifica:

- ✅ Workspace conectado
- ✅ Cluster en estado "Running"
- ✅ Sync activo si lo necesitas

Si algo está rojo o desconectado, lo arreglas antes de empezar a trabajar. Es el equivalente de "encender el motor" antes de manejar.

### 4. Empezar a trabajar

Aquí es donde decides el modo de trabajo según lo que vas a hacer:

- ¿Estoy explorando datos nuevos? → uso un notebook web de Databricks
- ¿Estoy refactorizando código existente? → trabajo en VSCode con Databricks Connect
- ¿Estoy escribiendo lógica compleja con muchas funciones? → archivos `.py` en VSCode
- ¿Necesito debugging paso a paso? → VSCode con breakpoints

No hay una sola "forma correcta". Hay la forma correcta para **lo que estás haciendo en ese momento**.

---

## El patrón más usado: explorar en notebook, refactorizar a .py

Este es el patrón que vas a usar más en CBC. Vale la pena entenderlo bien.

### Fase 1: Exploración (en notebook web)

Cuando empiezas un análisis nuevo, lo más útil es trabajar en un notebook web de Databricks. Por qué:

- Cargas datos rápidamente con `display()`
- Pruebas ideas, las descartas, pruebas otras
- Iteras visualmente con resultados inmediatos
- No necesitas pensar en "estructura" todavía

El notebook de exploración suele ser caótico, y eso está bien. Es tu cuaderno de borradores.

### Fase 2: Limpieza y estructura (en VSCode)

Una vez que sabes qué quieres hacer, descargas el notebook a tu computadora (o lo creas como `.py` directamente) y lo refactorizas en VSCode:

- Aplicas la estructura de notebook productivo (encabezado, imports, validaciones, etc.)
- Renombras variables a nombres descriptivos
- Eliminas celdas de prueba que ya no sirven
- Extraes funciones reutilizables a un archivo `utils.py` separado
- Agregas comentarios donde el código no es obvio

Aquí es donde las ventajas de VSCode brillan: autocompletado, búsqueda multi-archivo, refactoring asistido (renombrar todas las ocurrencias de una variable con `F2`).

### Fase 3: Validación (con Databricks Connect o sync)

Antes de considerar el código terminado, lo ejecutas contra el cluster real para verificar que sigue dando los mismos resultados que en el notebook original.

Si usas Databricks Connect, ejecutas el archivo localmente y observas el resultado.

Si usas sync, sincronizas el archivo al workspace y lo ejecutas allá.

### Fase 4: Producción (job o notebook compartido)

Cuando todo está validado, el código vive en una carpeta compartida del workspace o en un repositorio Git. Puedes programarlo como job, que tu equipo lo use, o que sea importado desde otros notebooks.

---

## Cuándo usar cada herramienta

Esta tabla te puede servir como guía mental:

| Situación | Mejor herramienta |
|---|---|
| Explorar una tabla nueva por primera vez | Notebook web de Databricks |
| Probar una idea rápida con `display()` | Notebook web de Databricks |
| Escribir código que vas a mantener por meses | Archivo `.py` en VSCode |
| Crear funciones reutilizables (`utils.py`) | Archivo `.py` en VSCode |
| Debuggear un error complejo | VSCode + Databricks Connect + breakpoints |
| Buscar texto en muchos archivos | VSCode con búsqueda global (`Cmd/Ctrl + Shift + F`) |
| Renombrar una variable en varias partes | VSCode con `F2` |
| Comparar dos versiones del mismo archivo | VSCode con vista de comparación |
| Programar un proceso para que corra solo | Sync + Job en Databricks |
| Compartir un análisis con stakeholders no técnicos | Notebook web de Databricks |

---

## Hábitos que separan a un buen analista de uno mediocre

### 1. Guarda en commits pequeños y frecuentes

Aunque todavía no estés usando Git formalmente, ya puedes empezar el hábito mental: "voy a hacer un cambio pequeño y verificable, lo pruebo, y luego paso al siguiente". Evita escribir 200 líneas de código sin ejecutar nada en el medio.

### 2. Lee tu propio código antes de pasar al siguiente paso

Después de escribir una función o un bloque, léelo como si fueras otra persona. ¿Se entiende qué hace? ¿Los nombres tienen sentido? ¿Falta algún comentario clave? Si no, refactoriza ahora antes de seguir.

### 3. Mantén tu carpeta limpia

No dejes archivos `prueba1.py`, `prueba2_funciona.py`, `temp_borrar_despues.py` flotando. Si algo no sirve, bórralo. Si sirve para algo específico, ponle un nombre claro.

### 4. Usa la búsqueda global agresivamente

Cuando necesites entender cómo se usa una función o variable en tu proyecto, usa `Cmd/Ctrl + Shift + F`. Es una de las funcionalidades más poderosas de VSCode y la mayoría de los analistas la subutilizan.

### 5. Cierra archivos que no estás usando

Tener 30 pestañas abiertas en VSCode es una señal de que perdiste el foco. Mantén abiertos solo los archivos relevantes para lo que estás haciendo en este momento.

### 6. Reinicia el cluster cuando algo se comporta extraño

Si Spark empieza a comportarse de forma inconsistente (resultados raros, errores que no entiendes), antes de pasar horas debuggeando, prueba reiniciar el cluster. A veces el estado se corrompe y un reinicio limpio resuelve el 50% de los problemas.

---

## Anti-patrones comunes (qué NO hacer)

### 1. Trabajar 4 horas sin ejecutar el código una sola vez

Es tentador escribir todo de un tirón y "después lo pruebo". No lo hagas. Ejecuta cada bloque en cuanto lo termines. Cuanto más código sin probar acumulas, más difícil es encontrar dónde está el error si algo falla.

### 2. Tener el cluster encendido toda la noche por descuido

Olvidaste apagar el cluster ayer y siguió corriendo 16 horas. Eso le cuesta a CBC dinero real. Configura el auto-shutdown del cluster a 30 o 60 minutos de inactividad para evitarlo.

### 3. Editar el mismo archivo desde la web y desde VSCode al mismo tiempo

Sincronización con conflictos garantizados. Decide en cuál vas a trabajar y mantente en ese.

### 4. Acumular notebooks "temporales" que nunca borras

`prueba_jueves.ipynb`, `nueva_idea_v2.ipynb`, `copia_del_principal.ipynb`... después de 3 meses tienes 80 notebooks de los que nadie sabe cuáles importan. Borra agresivamente.

### 5. Copiar y pegar código entre notebooks

Si te das cuenta de que estás copiando el mismo bloque de código entre varios notebooks, ese código debe ser una función en un archivo `utils.py` compartido. Vamos a ver eso en la siguiente sección.

---

## El cierre del día

Antes de cerrar VSCode al final del día, dedica 2 minutos a:

1. **Guardar todo** (`Cmd/Ctrl + K, S` para "save all")
2. **Cerrar archivos que no necesitas mañana**
3. **Verificar que el sync está al día** (sin archivos pendientes)
4. **Apagar el cluster si fuiste el último en usarlo** y no se va a usar en horas

Estos pequeños hábitos hacen que mañana puedas retomar el trabajo sin fricción.

---

## 🎯 Tareas

**Tarea 1:** Reflexiona sobre tu workflow actual. Antes de este pilar, ¿cómo trabajabas? ¿Qué fricciones tenías? Anota 3 cosas concretas.

**Tarea 2:** Diseña tu propio "workflow ideal" para el tipo de análisis que haces más seguido en CBC. ¿Qué herramienta usarías para qué? Escríbelo en una nota personal.

**Tarea 3:** Hoy, cuando trabajes en algo, prueba el flujo "exploración en notebook → refactorización en VSCode". Aunque sea con un análisis pequeño. Anota qué te resultó cómodo y qué no.

**Tarea 4:** Identifica un anti-patrón que tú haces actualmente (de la lista de arriba o uno propio). Comprométete a cambiarlo durante la próxima semana.

---

*Universidad Nexus — Curso de Databricks y VSCode*
