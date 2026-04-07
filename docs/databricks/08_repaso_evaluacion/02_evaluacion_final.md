---
sidebar_position: 3
title: Evaluación Final
---

# Evaluación Final

Esta es tu evaluación del módulo. No es un examen tradicional con preguntas — es un **proyecto integrador** donde aplicas TODO lo que aprendiste para construir algo desde cero.

Si puedes completar este proyecto sin mirar las soluciones de las lecciones anteriores, estás listo para usar este flujo en tu trabajo diario en CBC.

---

## El caso

Eres analista en CBC. Tu jefe te pide construir un **proceso productivo** para analizar las ventas mensuales por categoría de producto y país. El proceso debe:

1. Ejecutarse mensualmente como un job programado
2. Recibir el mes como parámetro
3. Validar la calidad de los datos
4. Calcular métricas relevantes
5. Guardar el resultado en una tabla del catálogo
6. Estar bien estructurado, documentado y listo para que cualquier colega lo mantenga

Lo importante: NO solo el código debe funcionar. La estructura del proyecto, el README, los hábitos de trabajo, todo cuenta.

---

## Criterios de avance

Para considerarte listo en este módulo, deberías poder cumplir los siguientes 8 criterios:

1. **Configurar un proyecto local en VSCode** con estructura profesional y entorno virtual
2. **Conectar VSCode con Databricks** usando la extensión y verificar que ejecuta código remoto
3. **Trabajar con Unity Catalog** usando la sintaxis de tres niveles correctamente
4. **Crear un notebook productivo** con widgets, validaciones y estructura completa
5. **Extraer funciones reutilizables** a un módulo `lib/` y usarlas desde el notebook
6. **Programar el notebook como job** en Databricks con parámetros y notificaciones
7. **Aplicar buenas prácticas** de naming, comentarios y organización
8. **Documentar el proyecto** con README claro y comentarios donde corresponde

---

## Parte 1: Setup del proyecto

**Tarea 1.1**: Crea una carpeta local llamada `cbc_ventas_mensuales`. Ábrela en VSCode.

**Tarea 1.2**: Crea la estructura recomendada:

```
cbc_ventas_mensuales/
├── README.md
├── .gitignore
├── pyproject.toml
├── notebooks/
├── lib/
│   └── __init__.py
├── jobs/
└── config/
```

**Tarea 1.3**: Crea un entorno virtual (`.venv`) y actívalo. Instala `databricks-connect`, `black`, `ruff` y `python-dotenv`.

**Tarea 1.4**: Configura VSCode con:
- El intérprete del `.venv`
- La extensión Databricks conectada al workspace de CBC
- Settings para format on save con Black

**Tarea 1.5**: Escribe el README inicial con título, descripción y propósito del proyecto.

---

## Parte 2: Funciones reutilizables

**Tarea 2.1**: Crea `lib/carga_datos.py` con al menos dos funciones:

- `cargar_ventas() -> DataFrame`
- `cargar_productos() -> DataFrame`

Cada función debe:
- Tener type hints
- Tener un docstring
- Cargar la tabla correspondiente desde Unity Catalog (usa los nombres reales de CBC)

**Tarea 2.2**: Crea `lib/transformaciones.py` con al menos tres funciones:

- `limpiar_ventas(df) -> DataFrame`: filtra montos válidos y rellena nulos
- `filtrar_por_mes(df, mes) -> DataFrame`: filtra al mes objetivo (formato YYYY-MM)
- `enriquecer_con_productos(ventas, productos) -> DataFrame`: hace el join estándar

**Tarea 2.3**: Crea `lib/metricas.py` con al menos una función:

- `calcular_metricas_por_categoria_y_pais(df) -> DataFrame`: agrupa y calcula total, número de transacciones, ticket promedio y clientes únicos

---

## Parte 3: Notebook productivo

**Tarea 3.1**: Crea `jobs/analisis_ventas_mensuales.py` con la estructura completa de notebook productivo:

1. Encabezado markdown con título, autor, descripción
2. Imports y configuración de catálogo/schema
3. Definición de widgets (al menos: `mes` y `pais`)
4. Lectura de los parámetros con validación de formato
5. Carga de datos usando las funciones de `lib/carga_datos.py`
6. Validaciones iniciales con `assert` y prints informativos
7. Aplicación de las transformaciones de `lib/transformaciones.py`
8. Cálculo de métricas con `lib/metricas.py`
9. Guardado del resultado en una tabla `cbc_prod.analytics.<algo_descriptivo>`
10. Celda final de notas y referencias

**Tarea 3.2**: Asegúrate de que el archivo:
- Tiene `# Databricks notebook source` al inicio
- Usa `# COMMAND ----------` entre celdas
- Tiene celdas de markdown explicando cada sección con `# MAGIC %md`

**Tarea 3.3**: Sincroniza el archivo a tu workspace de Databricks. Ábrelo desde la interfaz web y verifica que se ve correctamente como notebook con celdas.

---

## Parte 4: Validación

**Tarea 4.1**: Ejecuta el notebook desde Databricks (web) con el mes "2024-03". Verifica:

- Los widgets están en la parte superior
- Los validaciones imprimen información útil
- El resultado final aparece con `display()`
- La tabla destino se creó correctamente

**Tarea 4.2**: Cambia el mes a uno que NO tenga datos (por ejemplo "1990-01"). Verifica que el notebook falla con un mensaje claro, no con un error críptico.

**Tarea 4.3**: Ejecuta el mismo notebook con `databricks-connect` desde tu local en VSCode. Pon un breakpoint en medio y usa el Debug Console para inspeccionar un DataFrame.

---

## Parte 5: Programar como job

**Tarea 5.1**: En Databricks, crea un job nuevo llamado `ventas_mensuales_por_categoria_pais`. Configura:

- Una task que apunte al notebook sincronizado
- Cluster compartido o job cluster
- Parámetros: pasa `mes = {{job.start_time.iso_year_month}}` para que reciba el mes actual automáticamente

**Tarea 5.2**: Configura una notificación "On failure" que envíe email a tu cuenta personal.

**Tarea 5.3**: Ejecuta el job manualmente con "Run now". Verifica que termina exitosamente. Mira el historial.

**Tarea 5.4** (opcional): Programa el job para que se ejecute mensualmente el día 1 a las 4 AM.

---

## Parte 6: Calidad del código

**Tarea 6.1**: Aplica el linter y formatter a todo tu proyecto. Resuelve cualquier warning que Ruff te muestre.

**Tarea 6.2**: Revisa los nombres de tus variables y funciones. ¿Son descriptivos? Renombra los que no lo sean.

**Tarea 6.3**: Verifica que tus funciones en `lib/` tienen type hints y docstrings.

**Tarea 6.4**: Lee tu README. ¿Si alguien lo abriera ahora mismo, entendería qué hace el proyecto y cómo ejecutarlo?

---

## Parte 7: Documentación final

**Tarea 7.1**: Actualiza el README con la información completa:

- Qué hace el proyecto
- Estructura de carpetas
- Dependencias necesarias
- Cómo ejecutar localmente
- Cómo ejecutar como job
- Tablas que produce
- Contacto del dueño

**Tarea 7.2**: Crea un archivo `docs/decisiones.md` donde documentes al menos 3 decisiones que tomaste durante el desarrollo. Por ejemplo:

- "Decidí usar left join en vez de inner para no perder ventas con productos no encontrados"
- "Excluí montos = 0 porque son ajustes contables, no ventas reales"
- "Uso ticket promedio en vez de mediana porque el negocio reporta promedios"

---

## Pregunta final: tu propio análisis

La última parte de la evaluación es la más importante.

**Tarea 8**: Inventa una pregunta de negocio relevante para CBC que NO está cubierta en este caso. Algunas ideas:

- ¿Cuál es la región con mayor crecimiento mes a mes?
- ¿Qué categoría tiene el ticket promedio más alto?
- ¿Cuántos clientes nuevos compraron en los últimos 30 días?
- ¿Qué día de la semana se vende más por país?
- ¿Hay alguna región con muchas transacciones pero bajo monto promedio?

**Crea un nuevo notebook en `notebooks/`** que responda esa pregunta usando todo lo que aprendiste:

- Estructura completa de notebook productivo
- Funciones de `lib/` cuando aplique
- Validaciones e impresiones útiles
- Resultado claro y visualizable
- Documentación de la pregunta y la respuesta

---

## Checklist de entrega

Cuando termines, valida que tu proyecto cumple esto:

- [ ] Estructura de carpetas correcta
- [ ] README completo y actualizado
- [ ] `.gitignore` con exclusiones estándar
- [ ] `pyproject.toml` con configuración de Black y Ruff
- [ ] Entorno virtual `.venv` funcionando
- [ ] Funciones en `lib/` con type hints y docstrings
- [ ] Notebook productivo con estructura completa
- [ ] Widgets configurados y validados
- [ ] Job programado en Databricks con notificaciones
- [ ] Sincronización funcionando entre local y workspace
- [ ] Resultado guardado en tabla del catálogo
- [ ] Notebook adicional respondiendo tu propia pregunta

---

## Cierre

Si llegaste hasta aquí, completaste el módulo entero. **Reconoce el logro**.

Hace 8 sesiones no sabías la diferencia entre un workspace y un cluster. Hoy puedes:

- Navegar Databricks como entorno productivo
- Trabajar con Unity Catalog y la sintaxis de tres niveles
- Crear notebooks productivos con widgets y validaciones
- Configurar VSCode con todas las extensiones esenciales
- Conectar VSCode con Databricks y ejecutar código remoto
- Sincronizar archivos y debuggear con breakpoints
- Organizar proyectos profesionales con estructura clara
- Extraer funciones reutilizables a módulos compartidos
- Aplicar linting, formatting y buenas prácticas automáticamente
- Programar notebooks como jobs con notificaciones

Esto NO es poco. Es la base completa para trabajar como analista profesional en CBC.

---

## Lo que viene

En el siguiente módulo (**Pilar 5: GitHub**) vas a aprender a versionar tu código con Git. Eso significa:

- Guardar cada cambio importante con su contexto
- Trabajar en equipo sin pisar el código de otros
- Recuperar versiones anteriores cuando algo se rompe
- Tener un historial completo de todas las decisiones

Es la pieza que te falta para que tu trabajo sea verdaderamente colaborativo. Y se conecta directamente con todo lo que aprendiste aquí: los proyectos que ya estructuraste son los proyectos que vas a versionar.

Y después, en el **Pilar 6: Power BI**, cierras el círculo completo: tomas los DataFrames que generas en Spark y los conviertes en dashboards que el negocio usa para tomar decisiones.

Cada pieza encaja con la siguiente. Estás construyendo el toolkit completo del analista moderno en CBC.

---

*Universidad Nexus — Curso de Databricks y VSCode*
