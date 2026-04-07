---
sidebar_position: 4
title: Hábitos del Analista Profesional
---

# Hábitos del Analista Profesional

Las herramientas son solo la mitad de la ecuación. La otra mitad son los hábitos que practicas todos los días: cómo nombras las cosas, cómo escribes comentarios, cómo manejas tu tiempo, cómo colaboras con tu equipo. Esos hábitos, acumulados durante meses y años, son lo que separa a los analistas que crecen rápido de los que se estancan.

Esta lección recoge los hábitos más impactantes que verás en analistas senior dentro y fuera de CBC.

---

## Naming: el arte de poner nombres

Hay una cita famosa en programación: "There are only two hard things in Computer Science: cache invalidation and naming things." Ponerle nombre a las cosas es realmente difícil, y es lo que más impacta la legibilidad de tu código.

### Reglas básicas

**Variables y funciones en `snake_case`**:
```python
total_ventas = 1000        # ✅
ventasTotal = 1000         # ❌
TotalVentas = 1000         # ❌
```

**Constantes en `MAYUSCULAS_CON_GUIONES`**:
```python
TASA_IVA = 0.13
PAIS_DEFAULT = "Guatemala"
```

**Clases en `PascalCase`**:
```python
class AnalizadorDeVentas:
    pass
```

### Nombres descriptivos vs cortos

| Mal | Mejor |
|---|---|
| `x` | `monto_venta` |
| `data` | `transacciones_marzo` |
| `result` | `top_5_clientes_por_monto` |
| `tmp` | `ventas_filtradas_temporales` |
| `proc()` | `calcular_total_por_region()` |

> 💡 **El nombre debe responder qué contiene/hace, no cómo se llama internamente.** Un nombre mejor te ahorra el comentario que tendrías que poner para explicarlo.

### Nombres específicos del dominio

Usa el vocabulario del negocio. En CBC, vocabulario como "SKU", "PDV", "ruta", "GP" es parte del lenguaje del negocio. Úsalo en tu código:

```python
# ✅ Usa vocabulario del negocio
ventas_por_pdv = ventas.groupBy("punto_de_venta").sum("monto")

# ❌ No inventes vocabulario propio
ventas_por_lugar = ventas.groupBy("punto_de_venta").sum("monto")
```

Si alguien del negocio lee tu código, debe reconocer los términos.

### Evita las abreviaciones crípticas

```python
# ❌ Difícil de entender
v_x_r = vts.gb("rg").sm("mt")

# ✅ Cualquiera lo lee
ventas_por_region = ventas.groupBy("region").sum("monto")
```

La excepción son abreviaciones universalmente entendidas: `df` para DataFrame, `id` para identificador, `i` y `j` para índices de loops cortos. Pero cualquier abreviación específica del dominio debe escribirse completa.

---

## Comentarios: cuándo sí y cuándo no

Hay un mito que dice "comenta todo tu código". Eso es malo consejo. Los buenos comentarios son escasos y específicos.

### Cuándo SÍ comentar

**1. Decisiones de negocio que no son obvias del código**
```python
# Excluimos las ventas con monto = 0 porque son ajustes contables,
# no ventas reales (regla acordada con el equipo de finanzas, abril 2024)
ventas_validas = ventas.filter(F.col("monto") > 0)
```

**2. Workarounds o soluciones temporales**
```python
# WORKAROUND: la columna 'fecha_creacion' viene a veces con timestamp UTC
# y a veces con timestamp local. Lo normalizamos a UTC.
# TODO: pedir al equipo de ingestión que estandarice la fuente.
ventas = ventas.withColumn("fecha_creacion", F.to_utc_timestamp("fecha_creacion", "UTC"))
```

**3. Lógica compleja que merece explicación**
```python
# La regla de cálculo del bonus es: 5% sobre las ventas que excedan
# el objetivo, pero solo si el cumplimiento es >= 90%. Si es menor,
# no aplica el bonus aunque haya excedido en algunos productos.
def calcular_bonus(ventas, objetivo):
    cumplimiento = ventas / objetivo
    if cumplimiento < 0.90:
        return 0
    excedente = max(0, ventas - objetivo)
    return excedente * 0.05
```

**4. Referencias a documentos externos**
```python
# Los códigos de región siguen la nomenclatura del documento
# "Estructura Comercial CBC v3" disponible en SharePoint
REGIONES_VALIDAS = ["NOR", "SUR", "CEN", "ESTE", "OESTE"]
```

### Cuándo NO comentar

**1. Cuando el código ya lo dice**
```python
# ❌ Comentario inútil
# Sumar la columna monto
total = ventas.agg(F.sum("monto"))

# ✅ El código habla por sí solo
total = ventas.agg(F.sum("monto"))
```

**2. Cuando deberías cambiar el código en lugar de comentar**
```python
# ❌ Comentar código malo
# x es el monto total
x = sum_all(d)

# ✅ Mejorar el código directamente
monto_total = calcular_monto_total(ventas)
```

**3. Comentarios desactualizados**
Los comentarios que no se actualizan junto con el código son peores que no tener comentarios. Si modificas el código, actualiza el comentario (o bórralo si ya no aplica).

---

## El review de código: pedir y dar feedback

Cuando trabajas en equipo, otras personas van a leer tu código. Y tú vas a leer el de ellos. Cómo se hacen esos reviews afecta directamente la calidad del trabajo y la salud del equipo.

### Pedir review: qué incluir

Cuando le pidas a alguien que revise tu código, incluye:

1. **Contexto**: qué problema estás resolviendo
2. **Decisión**: qué enfoque tomaste y por qué
3. **Áreas de duda**: qué partes te gustaría que mire con más atención
4. **Tiempo estimado**: si el cambio es grande o pequeño

Ejemplo:

> "Hola Carlos, necesito tu review en este notebook que calcula el ranking de productos por categoría. Probé dos enfoques: usar window functions vs hacer dos joins. Me decidí por window functions porque es más limpio, pero no estoy 100% seguro de que sea más eficiente con nuestros volúmenes. ¿Le puedes echar un ojo a la sección de ranking? Son ~50 líneas, te toma 15 minutos."

### Dar review: cómo no ser el malo

Reglas básicas para dar feedback útil sin lastimar:

**1. Critica el código, no a la persona**
```
❌ "Esto está mal escrito, ¿en qué pensabas?"
✅ "Veo que usaste un loop aquí. ¿Consideraste usar una expresión de groupBy directamente? Sería más idiomático en Spark."
```

**2. Distingue entre "debe cambiar" y "sugerencia"**
```
🛑 BLOQUEANTE: este código tiene un bug que va a producir resultados incorrectos
💡 SUGERENCIA: este nombre podría ser más descriptivo, pero el código funciona
```

Marcar la severidad evita que el autor cambie cosas innecesarias o ignore cosas críticas.

**3. Pregunta antes de afirmar**
```
❌ "Esto está mal."
✅ "¿Por qué decidiste hacerlo así? Estoy viendo X y me preocupa Y."
```

A veces lo que parece un error es una decisión consciente que tú no entendiste.

**4. Reconoce lo bueno**
Si el código tiene una buena estructura, una función bien nombrada o una validación pensada, dilo. El feedback positivo es información tan valiosa como el feedback negativo.

---

## Los rituales diarios de un buen analista

Hay rituales pequeños que, repetidos cada día, marcan una diferencia enorme a largo plazo.

### El ritual de inicio del día (5 minutos)

1. Abre VSCode con el proyecto del día
2. Activa el entorno virtual
3. Verifica que la conexión a Databricks está activa
4. Pull de los últimos cambios si trabajas con Git
5. Lee tus notas de "qué dejaste pendiente ayer"

### El ritual de cierre del día (5 minutos)

1. Guarda todo el trabajo
2. Verifica que el sync con Databricks está al día
3. Apaga clusters que no estén siendo usados por nadie más
4. Escribe 2-3 líneas en una nota personal: qué dejaste pendiente y qué retomas mañana
5. Cierra VSCode

> 💡 **Por qué importan estas rutinas:** porque mañana retomas el trabajo sin fricción. Sin tener que recordar dónde estabas, qué cluster usabas, qué archivo quedó a medias.

### El ritual semanal (15 minutos los viernes)

1. Revisa tus jobs programados: ¿alguno fallando esta semana?
2. Limpia notebooks experimentales que ya no necesitas
3. Revisa tu carpeta de proyecto: ¿está organizada o se está volviendo caótica?
4. Actualiza el README de algún proyecto donde haya cambiado algo
5. Anota lo que aprendiste esta semana (puede ser literalmente una línea por día)

---

## Errores que cuesta caro aprender

Algunas cosas no las vas a entender hasta que te pasen. Pero si te las cuentan ahora, quizás puedas ahorrarte el dolor:

### 1. Borrar algo que no debías
Una vez en su carrera, todo analista borra accidentalmente algo importante: una tabla, un notebook, una columna. La lección no es "no cometer errores" — es **siempre tener forma de recuperarse**:

- Versionado con Git para código
- Backups o time travel para tablas
- Documentación de qué cambió y cuándo

### 2. Confiar en datos que no validaste
Un día vas a presentar un análisis con un número incorrecto porque "asumiste" que la fuente estaba bien. Vas a quedar mal frente a stakeholders. **Siempre valida los datos antes de reportarlos**, especialmente los números clave.

### 3. Sobrescribir el trabajo de otro
Si dos personas editan el mismo archivo desde lados distintos sin coordinación, alguien va a perder su trabajo. **Comunica antes de editar archivos compartidos**, o usa Git correctamente.

### 4. Postergar el cleanup
"Después limpio esto" es la mentira más común en código. Después no llega. El código temporal se vuelve permanente. **Limpia mientras avanzas, no al final**.

### 5. No documentar decisiones importantes
"Lo voy a recordar" es la otra gran mentira. En 6 meses no te vas a acordar por qué tomaste una decisión clave. **Escríbelo en el momento**, aunque sea una línea en el README.

---

## El hábito más importante de todos

Si tuviera que resumir todos los hábitos de este pilar en uno solo:

> **Trata cada pieza de código como si alguien más tuviera que mantenerla mañana — porque probablemente sea verdad.**

Esa persona puede ser un colega, tu reemplazo, o incluso tú mismo en 6 meses sin recordar el contexto. Si escribes pensando en esa persona, automáticamente:

- Pones nombres claros
- Documentas decisiones
- Estructuras tus proyectos
- Validas tus datos
- Refactorizas el código duplicado

Es la diferencia entre escribir código "para que funcione hoy" y escribir código "que valga la pena mantener". La segunda es lo que define a un analista profesional.

---

## 🎯 Tareas

**Tarea 1:** Revisa uno de tus notebooks viejos. Identifica al menos 3 nombres de variables que podrían ser mejores. Renómbralos.

**Tarea 2:** Encuentra un comentario inútil en tu código y bórralo. Encuentra una decisión sin documentar que merezca un comentario y agrégalo.

**Tarea 3:** Diseña tu propio "ritual de inicio" y "ritual de cierre" del día. Escríbelo en una nota personal y aplícalo durante una semana.

**Tarea 4:** La próxima vez que pidas un review a un colega, sigue la estructura recomendada: contexto, decisión, áreas de duda, tiempo estimado. Observa la diferencia en la calidad del feedback que recibes.

**Tarea 5:** Identifica el hábito MÁS IMPORTANTE que quieres adoptar de este módulo. Comprométete a practicarlo durante el próximo mes. Anótalo en un lugar visible.

---

*Universidad Nexus — Curso de Databricks y VSCode*
