---
sidebar_position: 5
title: Regulaciones y Seguridad
---

# Módulo 5 — Regulaciones, Seguridad y Ética en Datos

## Introducción

Los datos no son solo números en una pantalla. Detrás de cada registro hay personas reales: clientes, empleados, proveedores. Trabajar con datos conlleva una responsabilidad que va más allá de la técnica.

Este módulo cubre tres dimensiones que todo analista debe entender: las regulaciones legales sobre datos, las prácticas de seguridad de la información, y la ética en el uso de datos. Ignorar cualquiera de estas tres puede tener consecuencias graves: legales, económicas y reputacionales para tu organización y para ti.

---

## 5.1 ¿Por qué le importa esto a un analista?

Podrías pensar que la seguridad y las regulaciones son responsabilidad del área legal o de IT. Error.

Como analista de datos, tú:
- Accedes a bases de datos con información sensible
- Usas herramientas externas (incluida la IA) en tu trabajo
- Produces reportes y dashboards que otros consumen
- Puedes ser el primero en detectar un problema de datos

Eso te convierte en un actor clave de la cadena de seguridad de datos de tu organización. Un error tuyo puede tener consecuencias reales.

---

## 5.2 GDPR: El estándar global de privacidad de datos

El **GDPR** (General Data Protection Regulation) es la ley de privacidad de datos de la Unión Europea, vigente desde mayo de 2018. Aunque es una ley europea, su impacto es global: cualquier organización que maneje datos de ciudadanos europeos debe cumplirla, independientemente de dónde esté ubicada.

Aunque tu organización no opere en Europa, el GDPR se ha convertido en el **estándar de referencia mundial** para la gestión responsable de datos personales. Muchas empresas lo adoptan como buena práctica incluso sin obligación legal.

### ¿Qué son los datos personales según el GDPR?

Cualquier información que pueda identificar a una persona, directa o indirectamente:

| Categoría | Ejemplos |
|---|---|
| Identificadores directos | Nombre, número de identificación, correo electrónico |
| Identificadores indirectos | Dirección IP, ubicación, cookies |
| Datos sensibles (categoría especial) | Salud, religión, orientación sexual, origen étnico, datos biométricos |

### Los principios clave del GDPR

**1. Licitud y transparencia**
Los datos solo pueden procesarse si hay una razón legal válida. La persona debe saber qué datos se recopilan y para qué.

**2. Limitación de propósito**
Los datos recopilados para un propósito no pueden usarse para otro diferente sin justificación.

**3. Minimización de datos**
Solo recopilar los datos estrictamente necesarios para el propósito definido.

**4. Exactitud**
Los datos deben mantenerse actualizados y corregidos cuando sean incorrectos.

**5. Limitación del almacenamiento**
Los datos no pueden guardarse indefinidamente. Deben eliminarse cuando ya no sean necesarios.

**6. Integridad y confidencialidad**
Los datos deben protegerse contra accesos no autorizados, pérdidas o daños.

### Los derechos de las personas

Bajo el GDPR, las personas tienen derechos sobre sus datos:
- **Acceso:** Saber qué datos tiene la organización sobre ellas
- **Rectificación:** Corregir datos incorrectos
- **Supresión ("derecho al olvido"):** Pedir que se eliminen sus datos
- **Portabilidad:** Recibir sus datos en formato utilizable
- **Objeción:** Oponerse a ciertos usos de sus datos

### Las multas

El GDPR tiene dientes. Las sanciones pueden llegar a:
- **Hasta €10 millones** o el **2% de la facturación global anual** para infracciones menores
- **Hasta €20 millones** o el **4% de la facturación global anual** para infracciones graves

Empresas como Meta, Google y Amazon han recibido multas de cientos de millones de euros.

---

## 5.3 Otras regulaciones relevantes

El GDPR no es la única ley que debes conocer:

| Regulación | Ámbito | Qué regula |
|---|---|---|
| **GDPR** | Unión Europea | Protección de datos personales en general |
| **CCPA** | California, EE.UU. | Derechos de privacidad de consumidores |
| **HIPAA** | EE.UU. | Datos de salud y registros médicos |
| **PCI-DSS** | Global | Datos de tarjetas de pago |
| **Ley de Protección de Datos** | Varios países de LATAM | Variaciones locales de protección de datos personales |

> 💡 **Para tu organización:** Consulta con tu área legal o de cumplimiento qué regulaciones aplican específicamente a los datos que manejas. Las obligaciones varían según el tipo de datos, la industria y los países donde operas.

---

## 5.4 Seguridad de la información: conceptos fundamentales

### La tríada CIA

La seguridad de la información se construye sobre tres pilares conocidos como la tríada CIA:

**Confidencialidad (Confidentiality)**
Solo las personas autorizadas pueden acceder a los datos. Ejemplo: los datos de salario de los empleados solo deben ser visibles para RRHH y nómina.

**Integridad (Integrity)**
Los datos son exactos y no han sido modificados sin autorización. Ejemplo: los registros de ventas no deben poder ser alterados retroactivamente.

**Disponibilidad (Availability)**
Los datos están accesibles cuando se necesitan para las personas autorizadas. Ejemplo: el dashboard de ventas debe estar disponible para el equipo comercial en todo momento.

### Clasificación de datos

No todos los datos requieren el mismo nivel de protección. Una clasificación típica:

| Nivel | Descripción | Ejemplos | Restricciones |
|---|---|---|---|
| **Público** | Puede compartirse libremente | Comunicados de prensa, precios de catálogo | Ninguna |
| **Interno** | Solo para uso interno de la organización | Procedimientos internos, métricas generales | No compartir externamente |
| **Confidencial** | Acceso restringido a roles específicos | Datos de clientes, contratos, estrategia | Solo personal autorizado |
| **Secreto / Crítico** | Máxima protección | Datos financieros sensibles, datos biométricos, secretos comerciales | Acceso mínimo, controles estrictos |

> ⚠️ **Tu responsabilidad:** Antes de incluir datos en un análisis o dashboard, identifica su nivel de clasificación. ¿Puede verlos quien va a recibir el reporte? ¿Puede almacenarse en la herramienta que vas a usar?

---

## 5.5 IA y seguridad de datos: reglas críticas

Este es el tema más relevante para tu trabajo diario como analista que usa herramientas de IA.

### ¿Qué pasa cuando usas Claude o ChatGPT?

Cuando escribes un prompt en una herramienta de IA como Claude o ChatGPT, ese texto se envía a los servidores del proveedor (Anthropic u OpenAI). Dependiendo de la configuración:
- El texto puede ser usado para mejorar los modelos
- Puede ser revisado por personas del equipo del proveedor
- Puede almacenarse durante períodos variables

**Esto significa que si pegas datos de clientes, empleados o información confidencial de tu empresa en un prompt, esos datos salen de tu organización.**

### Lo que NUNCA debes pegar en una IA externa

| ❌ Nunca compartas | Por qué |
|---|---|
| Nombres, correos o teléfonos de clientes | Datos personales identificables |
| Números de identificación o documentos | Datos sensibles |
| Datos de tarjetas de crédito o información financiera personal | Datos financieros críticos |
| Información salarial de empleados | Datos confidenciales internos |
| Contratos o acuerdos legales completos | Información privilegiada |
| Credenciales, contraseñas o tokens de acceso | Riesgo de seguridad inmediato |
| Estrategia de negocio no pública | Secreto comercial |
| Datos médicos o de salud | Datos sensibles de categoría especial |

### Cómo usar IA de forma segura con datos

**Anonimiza antes de compartir:**
En lugar de pegar datos reales, usa datos ficticios o anonimizados que mantengan la estructura del problema.

❌ Mal:
```
Tengo esta tabla con clientes:
Ana García, ana@email.com, $5,000 de deuda
Carlos Pérez, carlos@email.com, $12,000 de deuda
```

✅ Bien:
```
Tengo una tabla con columnas: nombre_cliente, email, monto_deuda
¿Cómo puedo calcular el promedio de deuda por segmento?
```

**Describe la estructura, no los datos:**
Puedes compartir el esquema de una tabla (nombres de columnas y tipos de datos) sin compartir los datos en sí.

**Usa datos sintéticos:**
Para practicar o hacer demostraciones, genera datos de ejemplo ficticios en lugar de usar datos reales.

**Verifica la política de tu organización:**
Algunas empresas tienen políticas específicas sobre el uso de herramientas de IA. Conoce y cumple las políticas de tu empresa.

---

## 5.6 Ética en el análisis de datos

La ética en datos va más allá de cumplir la ley. Se trata de usar los datos de forma responsable, justa y transparente.

### Sesgos en los datos y el análisis

Los datos pueden contener sesgos que, si no se detectan, se amplifican en los análisis y las decisiones.

**Sesgo de selección:** Los datos no representan a toda la población. Ejemplo: encuestar solo a clientes satisfechos para medir la satisfacción general.

**Sesgo de confirmación:** Buscar en los datos solo la evidencia que confirma lo que ya creemos. Ejemplo: analizar solo el período donde las ventas crecieron para reportar éxito.

**Sesgo histórico:** Los datos históricos pueden reflejar discriminaciones pasadas que se perpetúan. Ejemplo: modelos de crédito entrenados con datos históricos que penalizan ciertos grupos demográficos.

Como analista, tu responsabilidad es:
- Identificar y reportar posibles sesgos en los datos
- No manipular el análisis para mostrar solo lo que conviene
- Ser transparente sobre las limitaciones de tu análisis

### Transparencia y reproducibilidad

Un análisis ético es:
- **Reproducible:** Otro analista con los mismos datos debería llegar al mismo resultado
- **Documentado:** Las decisiones y transformaciones deben estar registradas
- **Honesto sobre las limitaciones:** Si los datos no son suficientes para una conclusión, dilo

### El uso responsable de los insights

Los análisis pueden tener impacto real en personas: decisiones de crédito, contrataciones, precios, acceso a servicios. Pregúntate siempre:

- ¿Este análisis podría perjudicar injustamente a algún grupo?
- ¿Estoy presentando los datos completos o solo los que convienen?
- ¿Las personas afectadas por esta decisión saben que se están usando sus datos?

---

## 5.7 Buenas prácticas diarias de seguridad para analistas

Lista de hábitos que debes adoptar desde el primer día:

**Control de acceso:**
- [ ] Usa solo las credenciales que te han asignado
- [ ] No compartas tus contraseñas ni tokens de acceso
- [ ] Si accidentalmente accedes a datos a los que no deberías, reporta el incidente

**Manejo de datos:**
- [ ] Trabaja con el mínimo de datos necesario para tu análisis
- [ ] Elimina archivos locales con datos sensibles cuando ya no los necesites
- [ ] No almacenes datos en lugares no autorizados (USB personal, Google Drive personal, etc.)

**Herramientas externas:**
- [ ] Antes de usar una herramienta nueva, verifica si está aprobada por tu organización
- [ ] Nunca introduzcas datos sensibles en herramientas no aprobadas
- [ ] Anonimiza los datos antes de usar herramientas de IA externas

**Reportes y dashboards:**
- [ ] Configura correctamente los permisos de acceso (RLS en Power BI, por ejemplo)
- [ ] No envíes reportes con datos sensibles por canales no seguros (correo no cifrado, WhatsApp)
- [ ] Verifica que solo las personas autorizadas puedan ver el dashboard que publicas

---

## Resumen del Módulo

- El GDPR es el estándar global de privacidad de datos. Sus principios aplican como buena práctica aunque no haya obligación legal directa.
- Los datos tienen niveles de clasificación: no todos pueden compartirse ni usarse de la misma manera.
- Nunca introduzcas datos personales, financieros o confidenciales en herramientas de IA externas.
- Los sesgos en datos son reales y como analista tienes la responsabilidad de identificarlos y reportarlos.
- La transparencia, la reproducibilidad y la honestidad sobre las limitaciones son pilares de un análisis ético.

---

## 🎯 Ejercicio Práctico

Responde las siguientes preguntas basándote en tu contexto actual:

1. **Clasificación de datos:** Haz una lista de 5 tipos de datos que maneja tu área o empresa. ¿Cuál sería el nivel de clasificación de cada uno (Público / Interno / Confidencial / Crítico)?

2. **Evaluación de riesgo:** Tu manager te pide ayuda para analizar datos de salarios de empleados usando ChatGPT. ¿Qué harías? ¿Cómo lo harías de forma segura?

3. **Detección de sesgo:** Imagina que te piden analizar la satisfacción de clientes, pero los datos solo provienen de clientes que respondieron una encuesta voluntaria. ¿Qué sesgo podría existir? ¿Cómo lo comunicarías en tu análisis?

---

*Universidad Nexus — Módulo 5: Regulaciones, Seguridad y Ética en Datos*
