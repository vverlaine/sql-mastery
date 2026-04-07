---
sidebar_position: 2
title: El Problema que Git Resuelve
---

# El Problema que Git Resuelve

Antes de aprender qué es Git, vale la pena entender por qué lo necesitamos. Si no entiendes el problema, la solución te va a parecer arbitraria y complicada. Pero cuando entiendes el problema, Git se vuelve la respuesta más obvia del mundo.

---

## El escenario que todos conocemos

Imagínate que estás trabajando en un análisis importante de ventas para CBC. Tienes un archivo `analisis_ventas.py`. Llevas una semana trabajando en él. Todo funciona bien.

Un viernes por la tarde, decides probar algo nuevo: una forma diferente de calcular el margen por producto. Modificas varias funciones, agregas una nueva, cambias los nombres de algunas variables. Te toma 3 horas. Cuando ejecutas el código... no funciona. Algo se rompió y no sabes qué.

¿Qué haces?

Si NO usas Git, tienes pocas opciones, y todas son malas:

- **Opción 1**: Pasar las próximas 2 horas tratando de revertir manualmente cada cambio. Pero ya no recuerdas exactamente qué tocaste.
- **Opción 2**: Empezar de cero. Pero perdiste 3 horas de trabajo.
- **Opción 3**: Llamar a un colega y rogarle que te ayude. Pero es viernes a las 6 PM.

Si SÍ usas Git, la solución es de un solo comando: `git checkout .` y todo vuelve al estado del último commit. Cero estrés. Cero tiempo perdido.

> 💡 **Esa diferencia es el primer valor de Git: una red de seguridad permanente sobre tu trabajo.**

---

## El problema de los nombres con sufijos

Sin Git, hay otro patrón muy común. Cuando quieres "guardar el progreso" antes de hacer cambios grandes, terminas creando archivos así:

```
analisis_ventas.py
analisis_ventas_v2.py
analisis_ventas_v3.py
analisis_ventas_FINAL.py
analisis_ventas_FINAL_corregido.py
analisis_ventas_FINAL_DEFINITIVO_este_si.py
```

¿Te suena familiar? A todos nos ha pasado. Y tiene varios problemas:

1. **Ocupan espacio** sin necesidad
2. **No sabes cuál es el "bueno"** después de unas semanas
3. **Cuando alguien más abre la carpeta**, no entiende nada
4. **Pierdes el contexto** de qué cambió entre cada versión
5. **Si quieres comparar dos versiones**, tienes que abrirlas lado a lado manualmente

Git resuelve esto de forma elegante: tienes UN SOLO archivo `analisis_ventas.py`, pero Git guarda automáticamente CADA versión por la que pasó, con su fecha, autor y descripción. Puedes ir a cualquier versión anterior cuando quieras.

> 💡 **Ese es el segundo valor de Git: historial completo y limpio sin contaminar tu carpeta.**

---

## El problema de la colaboración

Imagínate ahora que no estás solo. Tu colega María también está trabajando en el mismo análisis. Ambos modifican el mismo archivo desde sus computadoras.

Sin Git, las opciones son:

- **Mandarse el archivo por correo o Slack**: alguien siempre va a sobreescribir el trabajo del otro
- **Usar OneDrive o Google Drive**: dos personas editando el mismo archivo a la vez es un desastre
- **Coordinar por mensaje cada cambio**: imposible escalar a más de 2 personas

Con Git, María y tú pueden trabajar **al mismo tiempo, en el mismo archivo**, desde sus respectivas computadoras, sin pisarse el trabajo. Git se encarga de combinar los cambios cuando es posible, y avisarte cuando hay un conflicto que necesita decisión humana.

> 💡 **Ese es el tercer valor de Git: colaboración real entre múltiples personas.**

---

## El problema de saber qué cambió y por qué

Otro problema clásico: pasan 3 meses, tu jefe te pregunta "¿por qué decidimos calcular el IVA con esta tasa específica?" y tú no tienes idea. Estaba en el código pero ya no recuerdas el contexto.

Sin Git, no hay forma de saberlo. El código es el código.

Con Git, cada cambio queda registrado con un **mensaje explicativo** (commit message). Puedes ver exactamente:

- **Qué línea cambió**
- **Cuándo cambió**
- **Quién la cambió**
- **Por qué cambió** (porque tú escribiste el mensaje cuando hiciste el commit)

> 💡 **Ese es el cuarto valor de Git: trazabilidad completa de las decisiones.**

---

## ¿Por qué Git y no otra cosa?

Existen otras herramientas de versionado (Subversion, Mercurial, Perforce). Pero Git domina la industria por varias razones:

- **Es gratis y open source**
- **Funciona offline**: puedes commitear sin conexión a internet
- **Es rápido**: opera sobre archivos locales, no depende de un servidor
- **Tiene un ecosistema gigante**: GitHub, GitLab, Bitbucket, Azure DevOps todos usan Git por debajo
- **Es el estándar de facto**: si trabajas en tech, vas a usar Git en algún momento

En CBC usamos **GitHub Enterprise**, que es la versión empresarial de GitHub. Pero por debajo, sigue siendo Git. Lo que aprendas aquí funciona en cualquier proveedor.

---

## Lo que NO es Git

Para evitar confusiones desde el inicio:

### Git NO es GitHub
- **Git** es la herramienta de versionado. Vive en tu computadora. Es de código abierto.
- **GitHub** es una plataforma web que usa Git por debajo. Permite hospedar repositorios remotos, hacer code reviews, gestionar issues, etc.

Puedes usar Git sin GitHub. No puedes usar GitHub sin Git.

### Git NO es un backup
Aunque te protege contra perder trabajo, su propósito principal NO es hacer backup. Es versionado: registrar cada cambio importante con su contexto. Para backup completo de tus archivos, usa otras herramientas (OneDrive, Time Machine, etc.).

### Git NO es solo para programadores
Cualquier archivo de texto puede versionarse con Git: código Python, SQL, Markdown, YAML, configuraciones, scripts SQL. Como analista, vas a versionar TODO esto.

> ⚠️ **Lo que NO funciona bien con Git**: archivos binarios grandes (imágenes, PDFs, Excel). Git puede manejarlos, pero no es eficiente. Para análisis de datos, esto rara vez es un problema porque trabajas principalmente con texto.

---

## La curva de aprendizaje (sé honesto contigo mismo)

Voy a ser directo: **Git tiene una curva de aprendizaje difícil al inicio**. Es de las herramientas más conceptualmente complejas que vas a aprender en este programa.

Los primeros días vas a sentir:

- **Confusión** sobre qué es un commit, un branch, un merge
- **Frustración** cuando un comando no hace lo que esperabas
- **Tentación** de volver al "guarda y mándame por Slack"

Eso es normal. TODO programador profesional pasó por ahí. La buena noticia: en 2 semanas de uso constante, los conceptos se asientan y el flujo se vuelve natural. En un mes, te preguntas cómo viviste sin Git.

> 💡 **Mi consejo:** No intentes memorizar todos los comandos al inicio. Concéntrate en entender los CONCEPTOS de esta sección. Los comandos se aprenden con la repetición diaria.

---

## Lo que viene en este pilar

En las próximas 7 sesiones vas a:

1. Aprender los conceptos fundamentales (esta sección)
2. Hacer tu primer commit local
3. Crear branches y mergearlas
4. Conectar con GitHub Enterprise de CBC
5. Hacer tu primer Pull Request real
6. Manejar conflictos como un profesional
7. Integrar todo con Databricks Repos
8. Construir un proyecto completo desde cero

Al final, vas a poder colaborar en cualquier repositorio de CBC con confianza.

---

## 🎯 Reflexión

Antes de avanzar a la siguiente lección, tómate 5 minutos y responde mentalmente:

1. ¿Cuántas veces has tenido que reconstruir trabajo perdido porque no tenías versionado?
2. ¿Tienes archivos con sufijos como `_v2`, `_FINAL`, `_corregido` en tus carpetas actuales?
3. ¿Cómo manejas cuando dos personas necesitan trabajar en el mismo análisis?
4. ¿Puedes recordar una decisión técnica que tomaste hace 6 meses y por qué?

Si alguna de estas preguntas te incomoda, estás en el lugar correcto. Git va a resolver esos problemas para ti.

---

*Universidad Nexus — Curso de GitHub para Analistas*
