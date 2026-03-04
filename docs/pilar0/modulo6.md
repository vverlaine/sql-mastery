---
sidebar_position: 6
title: Desafíos y Proyecto Integrador
---

# Módulo 6 — Desafíos y Proyecto Integrador del Pilar 0

## Introducción

Has llegado al módulo final del Pilar 0. Este módulo no introduce conceptos nuevos: está diseñado para consolidar todo lo que aprendiste, enfrentarte a situaciones reales y demostrarte (y demostrarnos) que estás listo para avanzar al Pilar 1.

Un analista de datos no demuestra lo que sabe en un examen teórico. Lo demuestra resolviendo problemas reales. Eso es exactamente lo que harás aquí.

---

## Desafío 1 — Reportear vs. Analizar

### Contexto

Recibes el siguiente mensaje de tu manager:

> *"Oye, necesito que me des las ventas de este trimestre."*

### Tarea

1. **Escribe la versión reporte** de cómo presentarías esa información (solo descripción de lo que pasó).

2. **Escribe la versión análisis** de cómo presentarías esa información (qué pasó, por qué podría haber pasado, qué implica para el negocio, qué acción recomendarías).

Para esto, usa los siguientes datos ficticios:

| Mes | Ventas | vs. Mes Anterior |
|---|---|---|
| Enero | $420,000 | — |
| Febrero | $398,000 | -5.2% |
| Marzo | $441,000 | +10.8% |

**Notas contextuales:**
- En febrero hubo un problema logístico que afectó entregas en la región sur
- En marzo se lanzó una promoción de temporada
- El objetivo trimestral era $1,300,000

### Criterio de evaluación
- ¿La versión reporte solo describe?
- ¿La versión análisis explica causas, contexto e implicaciones?
- ¿La versión análisis incluye al menos una recomendación accionable?

---

## Desafío 2 — Identifica el problema de datos

### Contexto

Un compañero te pasa la siguiente tabla de clientes para que la analices:

| id | nombre | email | fecha_registro | segmento | monto_compras |
|---|---|---|---|---|---|
| 1 | Ana García | ana@email.com | 2023-01-15 | Premium | 1500.00 |
| 2 | CARLOS PEREZ | carlos@EMAIL.COM | 2023-02-20 | premium | 1200.00 |
| 3 | María López | maria@email.com | 2023-13-05 | Estandar | NULL |
| 4 | Ana García | ana@email.com | 2023-01-15 | Premium | 1500.00 |
| 5 | Jorge Ruiz | | 2023-04-10 | VIP | -500.00 |
| 6 | Laura Méndez | laura@email.com | 2023-05-22 | Estandar | 890.00 |

### Tarea

Identifica **todos los problemas de calidad de datos** que encuentras en esta tabla. Para cada problema:
1. Describe qué es el problema
2. En qué fila(s) ocurre
3. Qué impacto podría tener en un análisis
4. Cómo lo corregirías

### Solución esperada

<details>
<summary>Ver solución</summary>

| Problema | Fila(s) | Impacto | Corrección |
|---|---|---|---|
| Inconsistencia en mayúsculas (nombre) | 2 | Al agrupar por nombre, "CARLOS PEREZ" y "Carlos Perez" se tratarían como personas distintas | Estandarizar a Title Case |
| Inconsistencia en mayúsculas (email) | 2 | Mismo problema al buscar por email | Convertir todo a minúsculas |
| Inconsistencia en el campo segmento | 2 | "premium" y "Premium" son el mismo valor pero el sistema los cuenta por separado | Estandarizar valores del campo |
| Fecha imposible (mes 13) | 3 | Error de captura. Ningún mes tiene valor 13 | Investigar y corregir la fecha real |
| Valor NULL en monto_compras | 3 | Afecta cálculos de suma y promedio | Investigar: ¿no ha comprado? ¿error de registro? |
| Registro duplicado | 4 | Ana García aparece dos veces con los mismos datos. Inflará conteos y montos | Eliminar el duplicado |
| Email vacío | 5 | No se puede contactar al cliente ni identificarlo por email | Investigar y completar |
| Monto negativo | 5 | Un monto de -500 podría ser una devolución mal registrada o un error | Investigar: ¿es una devolución? ¿un error? |
| Inconsistencia ortográfica (segmento) | 3, 6 | "Estandar" vs. "Estándar" — depende de la convención, pero debe ser consistente | Estandarizar |

</details>

---

## Desafío 3 — Prompt Engineering en acción

### Tarea

Tienes la siguiente pregunta de negocio:

> *"¿Cuáles son los 5 clientes que más han gastado en el último año y cuánto representa su gasto del total?"*

Asume que tienes una tabla llamada `transacciones` con columnas: `cliente_id`, `cliente_nombre`, `fecha`, `monto`.

**Parte A:** Escribe el prompt que le darías a Claude o ChatGPT para que te genere la consulta SQL necesaria. Aplica todos los principios de prompt engineering del Módulo 4.

**Parte B:** Ejecuta ese prompt (usa Claude o ChatGPT) y documenta:
- ¿La consulta generada tiene sentido?
- ¿La entiendes completamente?
- ¿Hay algo que cambiarías?

**Parte C:** Itera el prompt al menos una vez para mejorar el resultado.

### Solución esperada (Parte A — ejemplo de buen prompt)

<details>
<summary>Ver ejemplo de prompt</summary>

```
Soy analista de datos con conocimiento básico de SQL. 
Tengo una tabla llamada "transacciones" con estas columnas:
- cliente_id (INTEGER): identificador único del cliente
- cliente_nombre (VARCHAR): nombre del cliente
- fecha (DATE): fecha de la transacción
- monto (DECIMAL): valor de la transacción

Necesito una consulta SQL que:
1. Calcule el gasto total de cada cliente en el último año (desde hoy hacia atrás 365 días)
2. Muestre los 5 clientes con mayor gasto total
3. Calcule qué porcentaje representa ese gasto del gasto total de todos los clientes
4. Ordene los resultados de mayor a menor gasto

Por favor:
- Explica cada parte del código
- Usa comentarios dentro del SQL
- Indícame si necesito ajustar algo dependiendo del motor de base de datos que use
```

</details>

---

## Desafío 4 — Decisión ética

### Contexto

Tu manager te pide que prepares un análisis de productividad del equipo de ventas. Los datos disponibles incluyen:
- Número de llamadas realizadas por vendedor
- Número de ventas cerradas
- Monto total vendido
- Horas registradas en el sistema
- Datos de geolocalización de visitas a clientes

Algunos vendedores no saben que sus datos de geolocalización están siendo analizados.

### Tarea

Responde las siguientes preguntas:

1. ¿Qué datos de esta lista tienen implicaciones de privacidad o ética?
2. ¿Qué deberían saber los vendedores antes de que se realice este análisis?
3. ¿Cómo harías este análisis de forma ética y responsable?
4. Si descubrieras que los datos de geolocalización se recopilaron sin el conocimiento de los empleados, ¿qué harías?

No hay una única respuesta correcta. Lo que se evalúa es tu capacidad de razonar éticamente sobre datos.

---

## Proyecto Integrador: Mi Primer Análisis Conceptual

### Descripción

Este proyecto marca el cierre del Pilar 0. No requiere código ni herramientas técnicas: requiere pensar como analista.

### Instrucciones

Elige un área o proceso de tu trabajo actual (o uno que conozcas bien). Puede ser ventas, operaciones, servicio al cliente, recursos humanos, logística, etc.

Desarrolla un documento de máximo 2 páginas que responda:

**1. La pregunta de negocio**
¿Qué pregunta importante para el negocio podría responderse con datos? Sé específico.
> Ejemplo: "¿Por qué aumentaron las quejas de clientes en la región norte durante los últimos 3 meses?"

**2. Los datos que necesitarías**
¿Qué información necesitarías para responder esa pregunta?
- ¿En qué tablas o sistemas estarían esos datos?
- ¿Qué columnas serían relevantes?
- ¿Qué período de tiempo necesitarías?

**3. Posibles problemas de calidad**
¿Qué problemas de calidad de datos podrías encontrar?
- ¿Datos faltantes?
- ¿Inconsistencias?
- ¿Sesgos potenciales?

**4. El análisis**
¿Cómo abordarías el análisis? ¿Qué comparaciones harías? ¿Qué segmentaciones?

**5. La comunicación**
¿A quién presentarías los resultados? ¿Cómo lo harías? ¿Qué formato usarías?

**6. Las consideraciones éticas**
¿Hay datos sensibles involucrados? ¿Qué precauciones tomarías?

### Criterio de evaluación

| Aspecto | Indicador de éxito |
|---|---|
| Claridad de la pregunta | Es específica, medible y relevante para el negocio |
| Identificación de datos | Los datos identificados son suficientes para responder la pregunta |
| Consciencia de calidad | Identifica al menos 2 posibles problemas de calidad |
| Enfoque analítico | Va más allá de "reportear": busca causas e implicaciones |
| Consideraciones éticas | Identifica datos sensibles y propone cómo manejarlos |

---

## Autoevaluación del Pilar 0

Antes de avanzar al Pilar 1, responde honestamente:

| Capacidad | ¿Puedo hacerlo? |
|---|---|
| Explicar la diferencia entre reportear y analizar | ☐ Sí ☐ Necesito reforzar |
| Identificar los componentes de un ecosistema de datos | ☐ Sí ☐ Necesito reforzar |
| Describir qué es una clave primaria y para qué sirve | ☐ Sí ☐ Necesito reforzar |
| Usar Claude o ChatGPT para resolver una duda técnica | ☐ Sí ☐ Necesito reforzar |
| Escribir un prompt con contexto, tarea y formato definidos | ☐ Sí ☐ Necesito reforzar |
| Identificar qué datos NO debo compartir con IA externa | ☐ Sí ☐ Necesito reforzar |
| Identificar problemas de calidad en un conjunto de datos | ☐ Sí ☐ Necesito reforzar |
| Razonar éticamente sobre el uso de datos | ☐ Sí ☐ Necesito reforzar |

Si marcaste "Necesito reforzar" en más de 2 ítems, revisa los módulos correspondientes antes de avanzar.

---

## ¡Felicidades!

Has completado el Pilar 0 de Universidad Nexus. Ahora tienes los cimientos conceptuales, culturales y éticos para empezar a trabajar con datos de verdad.

En el **Pilar 1 — SQL**, empezarás a escribir consultas reales sobre bases de datos reales. Todo lo que aprendiste aquí te acompañará: la mentalidad analítica, el uso responsable de IA para aprender más rápido, y la consciencia de que detrás de cada dato hay una responsabilidad.

---

*Universidad Nexus — Módulo 6: Desafíos y Proyecto Integrador del Pilar 0*
