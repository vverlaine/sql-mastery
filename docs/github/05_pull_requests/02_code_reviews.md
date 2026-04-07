---
sidebar_position: 3
title: Code Reviews — Revisando el Código de Otros
---

# Code Reviews — Revisando el Código de Otros

Hasta ahora viste cómo crear PRs. Pero la mitad de tu vida con GitHub va a ser **revisar PRs de tus colegas**. Es una habilidad crítica: un buen reviewer mejora la calidad del equipo entero. Un mal reviewer la destruye.

Esta lección te enseña cómo dar y recibir code reviews de forma profesional.

---

## ¿Por qué hacer reviews?

Los code reviews tienen varios propósitos al mismo tiempo:

### 1. Detectar bugs antes de producción
Una segunda persona ve cosas que el autor no vio. Tipos incorrectos, edge cases olvidados, lógica sutilmente incorrecta.

### 2. Compartir conocimiento del equipo
Cuando revisas el código de un colega, aprendes cómo trabaja. Cuando alguien revisa el tuyo, aprende cómo trabajas tú. El equipo se vuelve más cohesionado.

### 3. Mantener consistencia de estilo
El código del equipo se ve uniforme: mismos patrones, mismas convenciones. Reduces la carga mental al leer código ajeno.

### 4. Mejorar la calidad del diseño
Un reviewer puede sugerir un enfoque mejor que no se le había ocurrido al autor. Las decisiones técnicas mejoran con perspectivas múltiples.

### 5. Crear documentación implícita
Las discusiones del PR son documentación. En 6 meses, alguien va a poder leer "¿por qué decidieron hacer X aquí?" y encontrar la respuesta en el PR.

---

## Cómo hacer un buen review

Cuando te asignan un PR para revisar, sigue estos pasos:

### Paso 1: Lee la descripción primero

Antes de mirar el código, lee qué dice el autor que hizo y por qué. Esto te da contexto. Si la descripción está vacía o incomprensible, **comenta pidiendo más contexto** antes de revisar el código.

### Paso 2: Mira el "Files changed"

Ve a la tab "Files changed" del PR. Revisa cada archivo modificado. Lee con calma:

- ¿El cambio hace lo que la descripción dice?
- ¿Hay errores obvios?
- ¿Los nombres son claros?
- ¿Las funciones están bien estructuradas?
- ¿Hay validaciones donde corresponde?
- ¿La lógica es correcta?

### Paso 3: Deja comentarios específicos

GitHub te permite comentar líneas específicas del código. Click en el número de línea (aparece un icono **+**), escribe tu comentario.

Tipos de comentarios útiles:

#### Sugerencia constructiva

```
Sugerencia: este filtro se podría hacer más eficiente usando 
F.col('region').isin(['Norte', 'Sur']) en lugar de dos condiciones 
separadas.
```

#### Pregunta para entender

```
¿Por qué decidiste usar inner join aquí? Si una venta no tiene 
producto correspondiente, ¿la perdemos a propósito o es accidental?
```

#### Bug encontrado

```
🚨 Bug: este `if` está al revés. Debería ser >= en lugar de >, 
si no excluye el caso de exactamente 1000.
```

#### Reconocimiento positivo

```
👍 Me gusta cómo extrajiste esta lógica a una función. 
Hace el código mucho más legible.
```

### Paso 4: Marcar el review

Una vez que dejaste comentarios, ve arriba al botón "Review changes". Tienes tres opciones:

- **Comment**: dejas comentarios sin aprobar ni rechazar
- **Approve**: el código está bien, puede mergearse
- **Request changes**: hay cosas que deben cambiar antes de mergear

> 💡 **Cuándo usar cada una:**
> - **Comment**: cuando solo tienes preguntas o sugerencias menores
> - **Approve**: cuando estás seguro que el código está listo
> - **Request changes**: cuando hay bugs o problemas que NO pueden quedar sin resolver

### Paso 5: Submit review

GitHub envía todos tus comentarios al autor de una vez. Hasta que no hagas submit, los comentarios solo los ves tú.

---

## Cómo dar feedback respetuoso (lo más importante)

Esta es la parte que más cuesta al inicio y la que más impacta la salud del equipo. Hay reglas básicas para dar feedback que ayuda en lugar de lastimar.

### Regla 1: Critica el código, no a la persona

```
❌ MAL: "Esto está mal escrito, ¿en qué pensabas?"
✅ BIEN: "Veo que usaste un loop aquí. ¿Consideraste usar 
        groupBy directamente? Sería más idiomático en Spark."
```

### Regla 2: Distingue entre "debe cambiar" y "sugerencia"

Marca claramente la severidad:

```
🛑 BLOQUEANTE: este código tiene un bug que va a producir 
   resultados incorrectos.

💡 SUGERENCIA: este nombre podría ser más descriptivo, 
   pero el código funciona como está.

❓ DUDA: ¿podrías explicar por qué tomaste este enfoque? 
   No estoy seguro si es lo mejor pero quizás se me escapa algo.
```

Sin marcar la severidad, el autor no sabe qué cambios son obligatorios y cuáles son opcionales.

### Regla 3: Pregunta antes de afirmar

```
❌ MAL: "Esto está mal."
✅ BIEN: "¿Por qué decidiste hacerlo así? Estoy viendo que 
        pasa X y me preocupa Y. Quizás hay algo que no entiendo."
```

A veces lo que parece un error es una decisión consciente que tú no entendiste.

### Regla 4: Reconoce lo bueno

Si el código tiene una buena estructura, una función bien nombrada, o una validación pensada, **dilo**. El feedback positivo es información tan valiosa como el feedback negativo. Y es muchísimo más motivador.

### Regla 5: No nitpickees

"Nitpicking" es comentar cada detalle minúsculo: un espacio, un punto y coma, un nombre que tú habrías escrito distinto. Eso desgasta al autor y no agrega valor.

Reglas:

- **Si es algo de formato que el linter puede arreglar**: no comentes, mejora el linter
- **Si es algo de estilo subjetivo que tú habrías hecho distinto**: déjalo pasar
- **Si afecta la legibilidad o correctitud**: ahí sí comenta

### Regla 6: Sé oportuno

Cuando te asignan un PR, revísalo en menos de 24 horas. Los PRs que se quedan esperando 3 días bloquean al autor y al equipo. Si no puedes revisar pronto, dilo: "No voy a poder revisar hoy, mañana lo veo."

---

## Cómo recibir feedback

Recibir reviews es tan importante como darlos. Y cuesta más, porque el ego se mete.

### Regla 1: No te tomes los comentarios personalmente

El reviewer está criticando el código, no a ti. Si comenta "esta lógica es confusa", no significa "eres mal analista". Significa "esta lógica es confusa, vamos a hacerla más clara".

### Regla 2: Si no entiendes un comentario, pregunta

```
"¿Podrías explicarme con más detalle qué problema ves aquí?"
```

Es mejor preguntar y entender que cambiar algo a ciegas.

### Regla 3: Si estás en desacuerdo, justifica

Si crees que tu enfoque es correcto y el reviewer está sugiriendo algo que no te convence, **discútelo con argumentos**:

```
"Entiendo el punto. Lo hice así porque [razón]. ¿Crees que 
es suficiente o ves algún caso donde mi enfoque falle?"
```

Está bien defender tus decisiones. Está mal defenderlas con orgullo en lugar de con razones.

### Regla 4: Agradece los reviews

Aunque sean críticos. La persona dedicó tiempo a leer tu código. Un simple "Gracias por el review, hago los cambios" cierra el ciclo profesionalmente.

### Regla 5: Resuelve los comentarios

Cuando arregles algo que un reviewer comentó, **márcalo como resuelto** (botón "Resolve conversation" en GitHub). Eso cierra visualmente el comentario y ayuda al reviewer a saber qué falta revisar.

---

## El concepto de "approval"

Cuando un reviewer hace "Approve", significa: "estoy de acuerdo con que este código se mergee a main".

En CBC, los repos importantes requieren al menos **1 approval** antes de poder mergear. Algunos requieren 2. Esa configuración la define el equipo.

> 💡 **Importante:** una aprobación NO es una validación de cada línea. Es una declaración de "confío en que este código está bien para mergear". El reviewer revisó lo que pudo, hizo las preguntas que tenía, y ahora confía en el resto.

---

## Mergear el PR

Cuando todas las validaciones pasan y tienes las aprobaciones necesarias, puedes mergear el PR.

En GitHub Enterprise, abajo del PR aparece un botón verde "Merge pull request". Tienes tres opciones de merge:

### Create a merge commit

Crea un commit de merge en main que combina los commits del PR. Mantiene todos los commits individuales del feature.

```
main:    A---B---C---M
                    /
feature:    D---E---'
```

### Squash and merge

Combina TODOS los commits del PR en UN solo commit en main. Pierde el detalle de los commits intermedios pero deja el historial de main más limpio.

```
ANTES:
feature: A---B---C---D---E

DESPUÉS en main:
main:    ...---X (un solo commit con todos los cambios de A-E)
```

### Rebase and merge

Aplica los commits del PR uno por uno encima de main, sin crear un commit de merge.

```
ANTES:
main:    A---B---C
              \
feature:       D---E

DESPUÉS:
main:    A---B---C---D---E
```

### ¿Cuál usar?

Esto depende de la convención del equipo. Las más comunes en CBC:

- **Squash and merge** para features pequeños (la mayoría de los casos)
- **Create merge commit** para features grandes o cambios importantes que merece preservar el historial

Tu lead te va a decir cuál usa el equipo. Adopta esa convención.

---

## Después del merge

Una vez mergeado el PR:

1. **GitHub borra automáticamente la branch del remoto** (si está configurado así)
2. **El PR queda en estado "Merged"** (no se puede reabrir)
3. **Tu cambio es parte de main**

En tu computadora local, también debes limpiar:

```bash
git switch main
git pull
git branch -d feature/agregar-metricas-roi
```

Ahora `main` tiene tus cambios y la branch local ya no es necesaria.

---

## Lo que NO debes hacer en code reviews

### ❌ Aprobar sin leer el código

"LGTM" sin haber abierto los archivos es una falta de respeto al autor y al equipo.

### ❌ Bloquear sin explicar

Si haces "Request changes", deja comentarios explicando QUÉ debe cambiar. Sin eso, el autor no sabe qué hacer.

### ❌ Discutir en privado y no en el PR

Si tienes una conversación importante sobre el PR por chat, **copia los puntos clave a los comentarios del PR**. La discusión queda como documentación.

### ❌ Hacerle al autor "death by 1000 cuts"

Comentar 50 nitpicks pequeños es desmoralizante. Identifica los 5-10 puntos importantes y enfócate en esos.

### ❌ Pedir cambios masivos sin contexto

"Reescribe esta función de cero" sin explicar por qué es injusto. Si crees que necesita reescritura, sugiere CÓMO y por qué.

---

## 🎯 Tareas

**Tarea 1:** Pídele a un colega que cree un PR en su repo y te asigne como reviewer.

**Tarea 2:** Lee la descripción del PR completa antes de abrir los archivos.

**Tarea 3:** Revisa cada archivo modificado en la tab "Files changed". Toma notas mentales de qué te llama la atención.

**Tarea 4:** Deja al menos un comentario constructivo en una línea específica.

**Tarea 5:** Si encuentras un problema real, déjalo como comentario claro. Si todo se ve bien, deja un comentario positivo reconociéndolo.

**Tarea 6:** Submit el review. Elige "Approve" si está bien, "Request changes" si hay algo bloqueante, o "Comment" si solo tienes sugerencias.

**Tarea 7 (recibiendo feedback):** Cuando alguien revise un PR tuyo, agradece el review y responde a cada comentario, aunque sea para decir "ya lo arreglé".

---

*Universidad Nexus — Curso de GitHub para Analistas*
