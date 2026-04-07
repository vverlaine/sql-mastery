---
sidebar_position: 1
title: Bienvenido al Curso de Databricks y VSCode
---

# Bienvenido al Curso de Databricks y VSCode

**De notebooks aislados a flujos de trabajo profesionales.**

En el módulo anterior aprendiste Python y Spark. Ya puedes consultar tablas, transformarlas, agruparlas y joinearlas. Pero todo eso lo hiciste dentro de notebooks sueltos en Databricks. Funciona, pero no es como trabaja un analista profesional en CBC.

Este módulo cierra esa brecha. Vas a aprender a usar Databricks como el entorno productivo que es, y a conectarlo con VSCode como tu editor de desarrollo local. El resultado: vas a poder escribir código en tu computadora con todas las ayudas modernas (autocompletado, debugging, búsqueda inteligente), ejecutarlo contra los datos de CBC, y dejar tu trabajo organizado para que tu equipo lo pueda revisar y reutilizar.

---

## ¿Qué aprenderás?

Al finalizar este curso serás capaz de:

- ✅ **Navegar Databricks** como entorno productivo: workspaces, clusters, catálogos
- ✅ **Trabajar con Unity Catalog** para acceder a las tablas de CBC de forma segura
- ✅ **Crear notebooks productivos** con widgets, parámetros y scheduling
- ✅ **Configurar VSCode** con las extensiones esenciales para análisis de datos
- ✅ **Conectar VSCode con Databricks** usando la extensión oficial
- ✅ **Sincronizar y ejecutar código** entre tu local y el cluster remoto
- ✅ **Organizar proyectos** con estructura profesional y módulos reutilizables
- ✅ **Aplicar buenas prácticas**: linting, formatting, secrets, atajos de productividad

---

## ¿Para quién es este curso?

Para analistas que ya completaron los módulos de SQL y Python/Spark y quieren llevar su trabajo al siguiente nivel: pasar de "ejecutar consultas" a "construir pipelines mantenibles que escalan".

No necesitas ser desarrollador. El enfoque sigue siendo analítico: te vas a llevar las herramientas que un analista usa todos los días, sin meterte en temas de ingeniería de software que no necesitas.

---

## Lo que cambia en este módulo

Hasta ahora trabajabas casi exclusivamente desde la web de Databricks. Eso es perfecto para empezar, pero tiene límites:

| Solo en Databricks | Con VSCode + Databricks |
|---|---|
| Editor básico, sin autocompletado profundo | Autocompletado inteligente, sugerencias en tiempo real |
| Difícil reutilizar código entre notebooks | Módulos compartidos entre múltiples archivos |
| Buscar texto en muchos notebooks es lento | Búsqueda global instantánea en todo el proyecto |
| Versionamiento limitado | Integración nativa con Git (que verás en el Pilar 5) |
| Trabajo individual | Colaboración real en equipo |

> 💡 **Importante:** No vas a abandonar Databricks. Vas a usarlo para lo que es bueno (ejecutar contra clusters, programar jobs, compartir resultados) y a usar VSCode para lo que VSCode es bueno (escribir, refactorizar y mantener código).

---

## Las tablas que seguiremos usando

Continuamos con los mismos datasets retail del Módulo 3 — `ventas`, `productos`, `clientes` y `tiendas` — pero ahora accedidos a través de Unity Catalog, que es como CBC los tiene en producción.

Eso significa que ya no escribirás solo `spark.table("ventas")`. Vas a aprender a usar la sintaxis completa de tres niveles que Unity Catalog requiere: `catalog.schema.table`. Tranquilo, es simple y vale la pena.

---

## Estructura del curso

| Sección | Tema |
|---|---|
| 1 | Databricks como entorno productivo |
| 2 | Notebooks productivos en Databricks |
| 3 | VSCode para análisis de datos |
| 4 | Conectar VSCode con Databricks |
| 5 | Desarrollo local + ejecución remota |
| 6 | Organización de proyectos |
| 7 | Buenas prácticas y productividad |
| 8 | Repaso y evaluación final |

---

*Universidad Nexus — Curso de Databricks y VSCode*
