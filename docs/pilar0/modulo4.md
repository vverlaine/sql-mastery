---
sidebar_position: 4
title: Prompt Engineering
---

# Módulo 4 — Prompt Engineering: Cómo Hablarle a una IA

## Introducción

Un prompt es la instrucción o pregunta que le das a una IA. La calidad de la respuesta que obtengas depende directamente de la calidad del prompt que escribas.

Esto no es exageración. El mismo modelo de IA puede darte una respuesta vaga e inútil o una respuesta precisa y accionable dependiendo de cómo le preguntes. El Prompt Engineering es la habilidad de formular esas instrucciones de manera efectiva.

No necesitas ser programador para hacer esto bien. Es más parecido a saber comunicarse claramente que a escribir código.

---

## 4.1 ¿Por qué importa el prompt?

Compara estos dos prompts para la misma tarea:

**Prompt malo:**
> "Dame algo sobre SQL"

**Prompt bueno:**
> "Soy analista de datos sin experiencia técnica. Explícame qué es SQL, para qué sirve en el análisis de datos y dame un ejemplo simple de consulta con una tabla de ventas. Usa lenguaje sencillo, sin jerga técnica."

El segundo prompt especifica: quién eres, qué quieres, el contexto, el formato y el nivel de dificultad. El resultado será radicalmente mejor.

---

## 4.2 Los componentes de un buen prompt

Un prompt efectivo tiene algunos o todos estos elementos:

### 1. Rol o contexto
Dile a la IA quién eres o qué rol debe asumir.

> "Eres un instructor de SQL para analistas sin experiencia técnica..."
> "Soy analista de datos y necesito entender..."

### 2. Tarea clara
Especifica exactamente qué quieres que haga.

> "Explícame...", "Escribe una consulta SQL que...", "Revisa este código y dime qué está mal...", "Resume en 3 puntos..."

### 3. Contexto relevante
Proporciona la información necesaria para que la IA entienda tu situación.

> "Tengo una tabla llamada `ventas` con columnas: id, fecha, producto, monto, region..."

### 4. Formato de salida
Dile cómo quieres que te responda.

> "...en forma de tabla", "...con ejemplos de código", "...en máximo 5 puntos", "...con una explicación para cada parte"

### 5. Restricciones o tono
Indica límites o el estilo que necesitas.

> "...sin jerga técnica", "...de forma concisa", "...asume que no sé nada de estadística"

---

## 4.3 Prompts para análisis de datos: ejemplos reales

### Para aprender un concepto

```
Explícame qué es un JOIN en SQL como si nunca hubiera programado antes. 
Usa una analogía de la vida cotidiana y luego muéstrame un ejemplo 
simple con una tabla de clientes y una tabla de pedidos.
```

### Para generar código

```
Tengo una tabla en SQL llamada "ventas" con estas columnas:
- id (INTEGER)
- fecha (DATE)
- producto (VARCHAR)
- cantidad (INTEGER)
- precio_unitario (DECIMAL)
- region (VARCHAR)

Escríbeme una consulta que muestre el total de ventas (cantidad × precio_unitario) 
por región, ordenado de mayor a menor. Explica cada parte del código.
```

### Para depurar un error

```
Este código SQL me da el siguiente error: [pega el error aquí]

El código es:
[pega tu código aquí]

La tabla tiene estas columnas: [lista las columnas]

¿Qué está mal y cómo lo corrijo?
```

### Para entender datos

```
Tengo este resultado de una consulta SQL:

[pega los resultados]

¿Qué insights puedo extraer de estos datos? ¿Qué preguntas adicionales 
debería hacerme como analista?
```

### Para revisar tu trabajo

```
Revisa esta consulta SQL y dime:
1. ¿Tiene errores de sintaxis?
2. ¿Hay alguna forma más eficiente de escribirla?
3. ¿Los resultados que espero son los que obtendrá esta consulta?

[pega tu consulta]
```

---

## 4.4 Técnicas avanzadas de prompting

### Chain of Thought (Paso a paso)
Pídele a la IA que razone paso a paso antes de darte la respuesta final. Esto mejora la calidad de respuestas en problemas complejos.

```
Analiza paso a paso este problema de datos y luego dame tu conclusión:
[describe el problema]
```

### Few-shot prompting (Con ejemplos)
Dale ejemplos de lo que quieres antes de pedirle que lo haga.

```
Quiero que clasifiques comentarios de clientes como Positivo, Negativo o Neutral.
Ejemplos:
- "El servicio fue excelente" → Positivo
- "Tardaron mucho en responder" → Negativo
- "El producto llegó a tiempo" → Neutral

Ahora clasifica estos comentarios:
[lista de comentarios]
```

### Role prompting (Asignación de rol)
Asignarle un rol específico mejora la calidad de respuestas especializadas.

```
Eres un experto en SQL con 10 años de experiencia en análisis de datos 
para empresas de retail. Necesito que...
```

### Iteración y refinamiento
El primer prompt rara vez es el mejor. Aprende a refinar:

```
[después de una respuesta]
"Bien, ahora hazlo más conciso"
"Explica solo la parte del GROUP BY con más detalle"
"Dame otro ejemplo pero con datos de recursos humanos"
```

---

## 4.5 Prompts para el trabajo diario de un analista

Aquí tienes una biblioteca de prompts útiles que puedes adaptar:

### Exploración de datos
```
Tengo una tabla con los siguientes datos de muestra: [pega 5-10 filas]
¿Qué tipo de análisis podrías hacer con estos datos?
¿Qué problemas de calidad de datos detectas?
```

### Interpretación de resultados
```
Obtuve estos resultados de mi análisis: [resultados]
Estoy presentando esto a [directores / equipo operativo / cliente].
¿Cómo debería comunicar estos hallazgos de forma clara y accionable?
```

### Preparación de presentaciones
```
Tengo estos datos: [datos o insights]
Necesito presentarlos a [audiencia] en [tiempo disponible].
Ayúdame a estructurar la narrativa de forma que genere impacto.
```

### Aprendizaje guiado
```
Quiero aprender [concepto específico].
Soy analista de datos con conocimiento básico de [lo que sabes].
Enséñame usando ejemplos progresivos, del más simple al más complejo.
```

---

## 4.6 Errores comunes en prompting

**Ser demasiado vago**
❌ "Dame información sobre datos"
✅ "Explícame qué son los datos NULL en SQL y cómo manejarlos en una consulta"

**No dar contexto**
❌ "¿Cómo calculo el promedio?"
✅ "Tengo una tabla de ventas en SQL con columna 'monto'. ¿Cómo calculo el promedio de ventas por mes?"

**Pedir demasiado en un solo prompt**
❌ "Explícame SQL, Python, Power BI y cómo hacer análisis de datos"
✅ Divide en prompts específicos para cada tema

**No iterar**
Si la primera respuesta no es lo que necesitas, no te rindas. Pide aclaraciones, ajusta, refina.

**Copiar sin entender**
Si la IA te da código, no lo copies sin entender qué hace cada parte. Pídele que te lo explique línea por línea.

---

## 4.7 Límites éticos del prompting

Hay cosas que no debes pedirle a una IA en el contexto de tu trabajo:

- ❌ Pegar datos personales de clientes o empleados
- ❌ Compartir información financiera confidencial de la empresa
- ❌ Pedir que genere análisis falsos o manipulados
- ❌ Usar respuestas de IA como si fueran tuyas sin revisarlas

Esto no es solo ético: en muchos casos también es un riesgo legal y de seguridad. Lo profundizaremos en el Módulo 5.

---

## Resumen del Módulo

- Un prompt bien construido incluye: rol/contexto, tarea clara, contexto relevante, formato de salida y restricciones.
- La calidad de la respuesta depende directamente de la calidad del prompt.
- Técnicas como Chain of Thought, Few-shot prompting y Role prompting mejoran significativamente los resultados.
- Siempre itera: el primer prompt rara vez es el mejor.
- Nunca copies código o análisis de IA sin entenderlo y validarlo primero.

---

## 🎯 Ejercicio Práctico

Usando Claude o ChatGPT, practica estos prompts y documenta los resultados:

**Ejercicio 1:** Escribe un prompt para que la IA te explique qué es un GROUP BY en SQL. Primero hazlo mal (vago), luego hazlo bien (con todos los componentes). Compara las respuestas.

**Ejercicio 2:** Tienes esta pregunta de negocio: *"¿Cuáles son los 3 productos que más se venden en la región norte?"* Escribe un prompt para que la IA te genere la consulta SQL necesaria, asumiendo que tienes una tabla `ventas` con columnas `producto`, `region`, `cantidad`.

**Ejercicio 3:** Toma la respuesta del Ejercicio 2 y pídele a la IA que te explique cada línea del código generado.

---

*Universidad Nexus — Módulo 4: Prompt Engineering*
