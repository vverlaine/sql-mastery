---
sidebar_position: 3
title: Clusters — El Motor de Spark
---

# Clusters — El Motor de Spark

Tu código de Spark no se ejecuta mágicamente. Necesita un **cluster**: un conjunto de máquinas (virtuales) trabajando en paralelo para procesar tus datos. En el módulo anterior, los clusters estaban ahí pero no les prestaste atención. En este pilar, vas a empezar a entenderlos porque van a determinar qué tan rápido o lento corre tu código.

---

## ¿Qué es exactamente un cluster?

Un cluster es un grupo de máquinas conectadas que actúan como una sola. Cuando ejecutas `display(ventas)`, Databricks toma tu código, lo divide en tareas, y reparte esas tareas entre las máquinas del cluster. Cada máquina hace su parte en paralelo, y al final se combinan los resultados.

```
Tu código
    ↓
Driver (la "cabeza")
    ↓
Workers (las máquinas que hacen el trabajo)
    ├── Worker 1 → procesa partición 1
    ├── Worker 2 → procesa partición 2
    └── Worker N → procesa partición N
    ↓
Resultado combinado
```

- **Driver**: la máquina principal que coordina todo. Recibe tu código, lo planifica y reparte el trabajo.
- **Workers**: las máquinas que hacen el procesamiento real de los datos.

Cuantos más workers tenga un cluster, más trabajo puede hacer en paralelo. Pero también cuesta más dinero por hora. Por eso entender clusters es importante: el balance entre velocidad y costo es parte de tu trabajo como analista responsable.

---

## Tipos de clusters en Databricks

Hay dos tipos principales que vas a encontrar:

### All-purpose clusters (interactivos)
Son los que usas cuando estás trabajando en notebooks de forma interactiva. Los enciendes, trabajas, los apagas. Sirven para exploración, desarrollo y análisis ad-hoc.

**Características:**
- Se inician manualmente
- Múltiples personas pueden compartirlos
- Quedan corriendo hasta que los apagas (o hasta que se apagan solos por inactividad)
- Más caros porque están encendidos esperándote

### Job clusters (efímeros)
Son clusters que se crean automáticamente cuando se ejecuta un job programado, hacen su trabajo, y se destruyen cuando terminan.

**Características:**
- Se crean automáticamente al disparar el job
- Una persona o un proceso los usa, no se comparten
- Solo viven mientras corre el job
- Más baratos porque solo existen cuando se necesitan

> 💡 **Regla simple:** Para tu trabajo diario interactivo, usas all-purpose. Para procesos automáticos que corren en horarios definidos, usas job clusters. La distinción importa porque afecta el costo y la disponibilidad.

---

## El runtime: la "versión" del cluster

Cada cluster corre con un **runtime**: la versión de Spark, Python, Scala y librerías que tiene instalada. Lo verás como algo así:

```
Databricks Runtime 14.3 LTS (Apache Spark 3.5.0, Scala 2.12)
```

Hay tres cosas que importan:

### 1. La versión del runtime
Las versiones LTS (Long Term Support) son las recomendadas para producción porque tienen soporte por más tiempo. Las versiones más nuevas tienen funciones más recientes pero pueden ser inestables.

### 2. Variantes del runtime
Existen variantes como ML, Photon, y otras. Las que más vas a ver:

- **Standard**: la más común, para uso general
- **ML**: incluye librerías de Machine Learning preinstaladas (scikit-learn, TensorFlow, etc.)
- **Photon**: motor optimizado para SQL, mucho más rápido para queries

### 3. Librerías personalizadas
Sobre el runtime base, los administradores pueden instalar librerías adicionales (por ejemplo, una librería interna de CBC). Para saber qué hay instalado en tu cluster, vas a `Compute → tu cluster → Libraries`.

---

## Tamaño del cluster: drivers y workers

Cuando creas un cluster (si tienes permisos), eliges:

**Driver type**: el tamaño de la máquina coordinadora. No necesita ser muy grande a menos que estés trayendo mucha información al driver con `.collect()`.

**Worker type**: el tamaño de cada máquina worker. Mayor tamaño = más memoria y CPU por máquina.

**Min/Max workers**: si activas autoescalado, el cluster ajusta el número de workers automáticamente según la carga de trabajo.

> ⚠️ **Importante para CBC:** Como analista normalmente NO vas a crear clusters tú mismo. Vas a usar clusters compartidos que el equipo de plataforma ya configuró. Lo que sí vas a hacer es ELEGIR a qué cluster conectar tu notebook, y para eso te conviene entender qué significa cada uno.

---

## Conectar un notebook a un cluster

En la parte superior derecha de cualquier notebook hay un selector que dice algo como `Connect` o muestra el nombre de un cluster. Ahí eliges contra qué cluster ejecutar tu código.

Pasos:
1. Abre el notebook
2. Click en el selector de cluster (arriba a la derecha)
3. Elige uno de la lista
4. Espera unos segundos a que se conecte
5. Listo, ya puedes ejecutar celdas

Si el cluster está apagado, tendrás que iniciarlo (toma 3-5 minutos típicamente) o elegir uno que ya esté corriendo.

> 💡 **Hábito útil:** Antes de empezar a trabajar, conecta tu notebook a un cluster que ya esté corriendo. Te ahorras los minutos de espera del arranque. Si todos están apagados, enciende uno y aprovecha esos minutos para revisar tus pendientes.

---

## Estados de un cluster

Cuando miras la lista de clusters en `Compute`, verás distintos estados:

| Estado | Significado |
|---|---|
| **Running** | Está activo y listo para recibir código |
| **Pending** | Se está iniciando, espera unos minutos |
| **Terminating** | Se está apagando |
| **Terminated** | Apagado, hay que reiniciarlo para usar |
| **Error** | Algo salió mal, contacta a tu lead |

Los clusters apagados no consumen recursos ni dinero. Por eso muchos clusters tienen configurada una **terminación automática por inactividad**: si nadie los usa por 30 o 60 minutos, se apagan solos. Esto es bueno: evita gastar recursos en clusters olvidados.

---

## Buenas prácticas con clusters

### 1. Usa clusters compartidos cuando puedas
Si tu equipo ya tiene un cluster corriendo, conéctate a ese en lugar de iniciar uno nuevo. Reduce el costo total para CBC.

### 2. No dejes clusters corriendo innecesariamente
Si terminaste tu trabajo y nadie más lo va a usar, considera apagarlo (si tienes permisos). Cada hora cuenta.

### 3. Si tu código es lento, no asumas que es el cluster
La mayoría de las veces, el código lento es por código mal escrito, no por falta de recursos. Antes de pedir un cluster más grande, revisa:

- ¿Estás filtrando lo más temprano posible?
- ¿Estás haciendo `.collect()` sobre datos grandes?
- ¿Tus joins están optimizados?
- ¿Estás reutilizando un DataFrame en lugar de re-calcularlo?

### 4. Reporta clusters con problemas
Si un cluster se cuelga o da errores raros repetidamente, repórtalo al equipo de plataforma. No lo "arregles" tú solo cambiando configuraciones que no entiendes.

---

## 🎯 Tareas

**Tarea 1:** Entra a `Compute` en Databricks y mira los clusters disponibles. Identifica:
- Cuáles están en estado Running
- Cuál es el runtime de cada uno
- Cuáles son all-purpose y cuáles son job clusters

**Tarea 2:** Conecta uno de tus notebooks del módulo anterior a un cluster que esté corriendo. Ejecuta una celda simple para confirmar que funciona.

**Tarea 3:** Pregúntale a tu lead cuál es el cluster recomendado para tu trabajo diario en CBC. Anótalo y úsalo de forma consistente.

---

*Universidad Nexus — Curso de Databricks y VSCode*
