---
sidebar_position: 3
title: Introducción a la IA
---

# Módulo 3 — Introducción a la Inteligencia Artificial para Analistas

## Introducción

La inteligencia artificial dejó de ser ciencia ficción hace años. Hoy está en tu buscador, en tu correo, en las recomendaciones de tu plataforma de streaming. Y desde 2023, con la llegada de los modelos de lenguaje grandes (LLMs) como ChatGPT y Claude, también está en el escritorio de cualquier analista de datos.

Este módulo no busca convertirte en experto en IA. Busca darte el entendimiento suficiente para usarla bien: saber qué puede hacer, qué no puede hacer, cuándo usarla y cuándo no confiar en ella.

---

## 3.1 ¿Qué es la Inteligencia Artificial?

La inteligencia artificial (IA) es el campo de la computación que desarrolla sistemas capaces de realizar tareas que normalmente requieren inteligencia humana: reconocer imágenes, entender lenguaje, tomar decisiones, generar texto.

No es magia. Es matemática aplicada a grandes cantidades de datos.

### Tipos de IA que encontrarás

**IA tradicional / Machine Learning**
Modelos entrenados para tareas específicas: detectar fraude, predecir demanda, clasificar correos como spam. Aprenden patrones a partir de datos históricos.

**IA Generativa (GenAI)**
Modelos que pueden crear contenido nuevo: texto, código, imágenes, audio. Es la que más te interesa como analista.

**Modelos de Lenguaje Grande (LLMs)**
Un tipo específico de IA generativa entrenada con enormes volúmenes de texto. Son la base de herramientas como ChatGPT (OpenAI) y Claude (Anthropic). Pueden conversar, explicar, escribir código, resumir documentos y mucho más.

---

## 3.2 ¿Cómo funciona un LLM? (Sin matemáticas)

Un LLM aprendió a predecir qué texto viene a continuación de otro texto, entrenándose con una fracción enorme de internet: libros, artículos, código, foros, documentación técnica.

Después de ese entrenamiento, el modelo puede:
- Completar oraciones de forma coherente
- Responder preguntas sobre temas que "leyó" durante el entrenamiento
- Generar código en lenguajes de programación
- Seguir instrucciones complejas
- Adaptar su estilo de comunicación

> ⚠️ **Lo que NO hace un LLM:** No "piensa" como un humano. No tiene consciencia. No accede a internet en tiempo real (a menos que tenga herramientas para eso). No siempre sabe cuándo está equivocado. Puede generar respuestas convincentes pero incorrectas — a esto se le llama **alucinación**.

---

## 3.3 Herramientas de IA que usarás en este programa

### Claude (Anthropic)
Es el asistente que usarás principalmente en este programa. Está diseñado para ser honesto sobre sus limitaciones, útil para tareas complejas y seguro en su uso.

**Úsalo para:**
- Explicarte conceptos que no entiendes
- Revisar y depurar tu código SQL o Python
- Resumir documentación técnica
- Ayudarte a estructurar un análisis
- Generar borradores de código que luego tú ajustas

### ChatGPT (OpenAI)
El más conocido del mercado. Muy capaz y con una gran comunidad de usuarios. Similar en capacidades a Claude para la mayoría de tareas analíticas.

### GitHub Copilot
IA integrada directamente en VSCode que sugiere código mientras escribes. Lo verás en el Pilar 4.

### Databricks Assistant
IA integrada en Databricks que ayuda a escribir código y consultas directamente en el entorno. Lo verás en el Pilar 3.

### Power BI Copilot
IA de Microsoft integrada en Power BI que puede generar visualizaciones y narrativas automáticamente. Lo verás en el Pilar 5.

---

## 3.4 IA como copiloto, no como piloto

Esta distinción es fundamental para usar IA de forma efectiva y responsable.

**La IA como piloto** (❌ cómo NO usarla):
- Le pides que haga el análisis completo y copias el resultado sin revisarlo
- Confías ciegamente en el código que genera sin entender qué hace
- La usas para tomar decisiones sin validar sus respuestas
- Delega tu pensamiento crítico en la máquina

**La IA como copiloto** (✅ cómo SÍ usarla):
- Le pides que te explique un concepto y luego lo aplicas tú
- Usa el código que genera como punto de partida y lo adaptas
- Validas sus respuestas contra otras fuentes o tu propio criterio
- La usas para acelerar tu trabajo, no para reemplazar tu juicio

> 💡 **Analogía:** Un copiloto ayuda al piloto a navegar, comunicarse y gestionar sistemas. Pero el piloto es el responsable del vuelo. Si el copiloto se equivoca, el piloto lo detecta y corrige. Lo mismo aplica con la IA.

---

## 3.5 Qué puede y qué no puede hacer la IA por ti

### Lo que la IA hace bien:

| Tarea | Ejemplo |
|---|---|
| Explicar conceptos | "¿Qué es un LEFT JOIN y cuándo usarlo?" |
| Generar código de ejemplo | "Escríbeme una consulta SQL que agrupe ventas por mes" |
| Depurar errores | "Este código me da error, ¿qué está mal?" |
| Resumir documentación | "Resume esta documentación técnica en 5 puntos clave" |
| Sugerir estructuras | "¿Cómo debería estructurar este análisis?" |
| Traducir entre lenguajes | "Convierte esta consulta SQL a Python con Pandas" |

### Lo que la IA hace mal (o no debes dejarle hacer sola):

| Tarea | Por qué es riesgoso |
|---|---|
| Interpretar el contexto de negocio | No conoce tu empresa, tu industria ni tu audiencia |
| Validar si los datos son correctos | No tiene acceso a tus datos reales |
| Tomar decisiones finales | La responsabilidad siempre es tuya |
| Trabajar con datos confidenciales | Riesgo de seguridad (lo veremos en el Módulo 5) |
| Garantizar que el código funciona | Puede generar código plausible pero incorrecto |

---

## 3.6 El fenómeno de las alucinaciones

Las alucinaciones son uno de los aspectos más importantes de entender sobre los LLMs. Ocurren cuando el modelo genera una respuesta que suena completamente correcta y confiable, pero es factualmente incorrecta.

**Ejemplos típicos:**
- Citar una función de Python que no existe
- Inventar estadísticas o estudios que no existen
- Dar una respuesta incorrecta sobre una fecha o evento histórico
- Generar código que parece correcto pero tiene un error lógico sutil

**¿Por qué ocurre?**
Los LLMs no "saben" en el sentido humano. Predicen el texto más probable basándose en patrones. A veces ese texto más probable es incorrecto.

**Cómo protegerte:**
- Siempre valida la información importante en fuentes primarias
- Prueba el código antes de usarlo en producción
- Sé especialmente escéptico con números, fechas y nombres específicos
- Pregúntale al modelo su nivel de confianza sobre algo importante

> ⚠️ **Regla crítica:** Nunca presentes un análisis a tu jefe o cliente basado únicamente en lo que te dijo una IA sin haberlo validado tú mismo. La responsabilidad del análisis es tuya, no de la herramienta.

---

## 3.7 IA y el futuro del analista de datos

¿La IA va a reemplazar a los analistas de datos? Es la pregunta que muchos se hacen.

La respuesta corta: no. Pero sí va a cambiar profundamente el trabajo.

Lo que la IA está automatizando:
- Partes rutinarias de la limpieza de datos
- Generación de código básico
- Creación de reportes estándar
- Resúmenes de dashboards

Lo que la IA no puede reemplazar:
- Formular las preguntas de negocio correctas
- Entender el contexto y las implicaciones de un hallazgo
- Comunicar insights de forma persuasiva a una audiencia
- Validar si un análisis tiene sentido en el mundo real
- La responsabilidad ética de las decisiones

**Conclusión:** Los analistas que usen IA como herramienta serán más productivos que los que no la usen. Pero los analistas que entiendan el negocio, piensen críticamente y comuniquen bien seguirán siendo irremplazables.

---

## Resumen del Módulo

- La IA generativa (LLMs como Claude y ChatGPT) es una herramienta poderosa para analistas de datos.
- Funciona prediciendo texto a partir de patrones aprendidos, no "pensando" como un humano.
- Úsala como copiloto: acelera tu trabajo, pero tú mantienes el juicio crítico.
- Las alucinaciones son reales: siempre valida la información importante.
- El analista que usa IA bien es más productivo, pero el pensamiento crítico sigue siendo irremplazable.

---

## 🎯 Ejercicio Práctico

Abre Claude (claude.ai) o ChatGPT y realiza las siguientes tareas:

1. Pídele que te explique qué es un Data Warehouse en términos simples.
2. Pídele que te dé un ejemplo de correlación vs. causalidad en un contexto de negocios.
3. Pídele que genere una consulta SQL falsa (inventada) para ver si detectas algo raro.

Anota qué respuestas te parecieron útiles, cuáles dudosas y por qué.

---

*Universidad Nexus — Módulo 3: Introducción a la IA para Analistas*
