---
sidebar_position: 4
title: Jobs y Workflows
---

# Jobs y Workflows

Hasta ahora ejecutas tus notebooks manualmente: abres Databricks, abres el notebook, das clic en "Run all". Funciona perfectamente para análisis ad-hoc. Pero hay análisis que se ejecutan **todos los días, todas las semanas o todos los meses** sin que nadie los dispare. Para eso existen los **jobs**.

Un job es un notebook (o varios) que Databricks ejecuta automáticamente según un calendario. Y los **workflows** son la forma de organizar varios jobs en un flujo coordinado.

---

## ¿Qué problema resuelven los jobs?

Imagínate este escenario: tienes un notebook que calcula las ventas del mes anterior y publica el resultado en una tabla. Hoy lo ejecutas manualmente cada primer día del mes. ¿Qué pasa cuando estás de vacaciones? ¿O cuando se te olvida? ¿O cuando el equipo de BI necesita el resultado a las 5 AM antes de que llegues a la oficina?

Con un job, el mismo notebook se ejecuta solo:
- Todos los días 1 de mes a las 4 AM
- Sin que tú estés conectado
- Sin que nadie tenga que acordarse
- Con notificaciones automáticas si algo falla

Eso es la diferencia entre un análisis "que tú haces" y un proceso "que existe en CBC".

---

## Crear un job desde un notebook

Para convertir un notebook en un job programado, usa el menú **Workflows** en el lateral izquierdo de Databricks.

Pasos básicos:

1. **Click en `Workflows` → `Create Job`**
2. **Asigna un nombre claro** al job. Por ejemplo: `ventas_mensuales_por_region`. Nada de "test" o "job1".
3. **Crea una task** dentro del job. Una task es una unidad de ejecución. Para empezar, una sola task suele ser suficiente.
4. **Configura la task:**
   - **Type**: `Notebook`
   - **Source**: `Workspace` (si tu notebook está en la web) o `Git` (si viene de un repo)
   - **Path**: la ruta a tu notebook
   - **Cluster**: el cluster donde se va a ejecutar
   - **Parameters**: los valores para los widgets (si los hay)
5. **Guarda el job** con `Create`

Tu job ya está creado, pero todavía no se ejecuta automáticamente. Para eso necesitas configurar un trigger.

---

## Configurar el trigger (cuándo se ejecuta)

En la página de tu job, hay una sección llamada **Schedules & Triggers**. Ahí defines cuándo se dispara automáticamente.

### Opción 1: Schedule (programación periódica)

Eliges una frecuencia: diariamente, semanalmente, mensualmente, o un cron personalizado.

```
Every day at 4:00 AM
```

Esto ejecuta el job todos los días a las 4 AM. La hora es del huso horario configurado, generalmente UTC.

### Opción 2: File arrival (cuando llega un archivo)

Útil cuando el job depende de que llegue un archivo nuevo a una carpeta. Por ejemplo: ejecuta este notebook cada vez que aparezca un CSV nuevo en `/mnt/datalake/ventas/`.

### Opción 3: Manual / On-demand

El job no tiene trigger automático. Solo se ejecuta cuando alguien le da clic a "Run now" manualmente. Útil para procesos que se disparan bajo demanda pero quieres tener registrados como jobs.

> 💡 **Para empezar:** Schedule diaria o semanal cubre el 90% de los casos. Cron personalizado solo si necesitas algo muy específico como "los lunes a las 8:30 AM excepto si es feriado".

---

## Pasar parámetros a los widgets desde el job

Si tu notebook tiene widgets, el job los puede llenar automáticamente. En la sección **Parameters** de la task, agregas pares clave-valor:

```
mes_objetivo = {{job.start_time.iso_date}}
pais = Todos
monto_minimo = 1000
```

Las llaves dobles `{{...}}` son **variables dinámicas** de Databricks. Se reemplazan en tiempo de ejecución. Las más útiles:

| Variable | Devuelve |
|---|---|
| `{{job.start_time.iso_date}}` | Fecha ISO de cuando empezó el job (ej: 2024-04-06) |
| `{{job.start_time.iso_year_month}}` | Año-mes (ej: 2024-04) |
| `{{job.id}}` | ID único del job |
| `{{job.run_id}}` | ID único de esta ejecución específica |

Estas variables son lo que hace que un job sea verdaderamente automático. Tu notebook puede recibir "el mes actual" sin que tú lo escribas.

---

## Notificaciones: enterarte cuando algo falla

Por defecto, si tu job falla a las 4 AM, nadie se entera hasta el día siguiente. Para evitarlo, configura **notifications**:

En la sección **Notifications** del job, agregas:

- **Email** (los más usados): emails que reciben alertas
- **Slack / Microsoft Teams**: webhooks a canales del equipo
- **PagerDuty**: para sistemas críticos con escalado de alertas

Y eliges en qué eventos disparar las notificaciones:

- **On start**: cuando el job empieza (raramente útil)
- **On success**: cuando termina bien (útil para reportes que esperas confirmar)
- **On failure**: cuando falla (esto es lo más importante)
- **On duration warning**: cuando tarda más de lo esperado

> ⚠️ **Configura SIEMPRE notificaciones de "On failure".** Es la diferencia entre enterarte de un problema en 5 minutos vs enterarte cuando alguien del negocio te pregunta por qué el reporte está vacío.

---

## Reintentos automáticos

A veces los jobs fallan por razones temporales: el cluster se demoró, una tabla estaba siendo actualizada, hubo un problema de red. Para esto Databricks tiene **retries**:

En la configuración de la task, puedes definir:

- **Maximum retries**: cuántas veces reintentar antes de fallar definitivamente (típico: 2 o 3)
- **Min retry interval**: tiempo entre reintentos (típico: 5 minutos)
- **Retry on timeout**: si reintentar cuando hay timeout

> 💡 **Buen default:** 2 reintentos con 5 minutos entre cada uno. Cubre la mayoría de los problemas temporales sin esconder problemas reales.

---

## Workflows con múltiples tasks

Cuando tu proceso tiene varios pasos relacionados, en lugar de ponerlos todos en un solo notebook gigante, los divides en varios notebooks y los conectas en un workflow.

### Ejemplo: pipeline de ventas mensuales

```
Task 1: cargar_y_limpiar_ventas
   ↓
Task 2: calcular_metricas_por_region
   ↓
Task 3: calcular_metricas_por_categoria
   ↓
Task 4: enviar_reporte_por_email
```

En el workflow, defines que Task 2 depende de Task 1, Task 3 depende de Task 1 también (puede correr en paralelo con Task 2), y Task 4 depende de las dos anteriores.

Si una task falla, las que dependen de ella no se ejecutan. Los datos quedan en estado conocido.

> 💡 **¿Por qué dividir?** Porque cada task se vuelve más simple, más mantenible y más reutilizable. La Task 1 (cargar y limpiar) puede ser usada por OTROS workflows que también necesiten datos limpios de ventas.

---

## Ver el historial y los logs

Cada vez que un job se ejecuta, queda registrado en el historial. Puedes ver:

- **Run history**: todas las ejecuciones pasadas con su estado (success / failed)
- **Duration**: cuánto tardó cada ejecución
- **Logs**: los prints, errores y warnings de la ejecución
- **Output**: el resultado de los notebooks que corrieron

Cuando algo falla, lo primero que haces es entrar al historial, encontrar la ejecución fallida, y leer los logs. El 90% de las veces el error está claramente identificado en los logs y no necesitas investigar nada más.

---

## Buenas prácticas con jobs

### 1. Nombra los jobs con un patrón consistente
`<dominio>_<frecuencia>_<que_hace>`. Por ejemplo: `ventas_diario_metricas_por_region`. Cuando tengas 50 jobs, va a ser fácil encontrar el que buscas.

### 2. Documenta el job en el notebook que ejecuta
En el encabezado markdown del notebook, indica que es un job, su frecuencia, y qué tablas afecta. Cualquiera que abra el notebook entiende el contexto.

### 3. Usa job clusters para producción
Los jobs deben correr sobre **job clusters**, no sobre clusters compartidos. Razones: aislamiento, costo, predictibilidad.

### 4. No metas "Run all" celdas con `display()` enormes
Cuando un notebook se ejecuta como job, cada `display()` se guarda en el output. Si imprimes millones de filas, los logs se vuelven gigantes. Limita tus prints en jobs a información útil para diagnosticar.

### 5. Configura siempre notificaciones de fallo
Sin excepciones. Un job sin notificaciones de fallo es un job que nadie va a saber cuándo se rompió.

---

## 🎯 Tareas

**Tarea 1:** Toma uno de tus notebooks parametrizados (con widgets) y créale un job. Configúralo para que se ejecute manualmente por ahora (sin schedule).

**Tarea 2:** Pasa parámetros desde la sección Parameters del job al notebook. Por ejemplo, define `mes_objetivo = 2024-03` desde el job.

**Tarea 3:** Ejecuta el job manualmente con "Run now" y verifica que terminó exitosamente. Mira el historial.

**Tarea 4:** Configura una notificación por email para "On failure". Cambia algo del notebook para que falle adrede (ej: una columna que no existe), ejecuta el job, y verifica que llega el email.

**Tarea 5:** Programa el job para que se ejecute cada lunes a las 6 AM. Dejalo activo si vas a usarlo, o desactívalo si era solo práctica.

---

*Universidad Nexus — Curso de Databricks y VSCode*
