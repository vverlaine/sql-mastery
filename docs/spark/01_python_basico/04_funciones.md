---
sidebar_position: 5
title: Funciones
---

# Funciones

Una función es un bloque de código que tiene un nombre y se puede reutilizar. En lugar de escribir el mismo cálculo cinco veces, lo escribes una vez en una función y la llamas cinco veces.

Las funciones son uno de los conceptos más útiles de la programación. Y la buena noticia es que ya las has estado usando: `print()`, `len()`, `sum()`, `type()` son funciones que vienen incluidas en Python.

---

## Anatomía de una función

Una función tiene tres partes:

1. **Nombre**: cómo se llama
2. **Parámetros**: qué información necesita para trabajar
3. **Cuerpo**: qué hace con esa información

```python
def calcular_iva(monto):
    iva = monto * 0.13
    return iva
```

Desglosándolo:

- `def` le dice a Python "voy a definir una función"
- `calcular_iva` es el nombre que le pones
- `(monto)` es el parámetro: el dato que recibe
- `return iva` es lo que la función devuelve

### Llamar a una función

Una vez definida, la usas pasándole un valor:

```python
total_iva = calcular_iva(1000)
print(total_iva)  # 130.0

otro_iva = calcular_iva(500)
print(otro_iva)  # 65.0
```

Cada vez que la llamas con un valor diferente, te devuelve un resultado diferente. Sin reescribir la lógica.

---

## ¿Por qué importan las funciones?

Imagina que tienes que calcular el IVA en 20 lugares diferentes de tu código. Sin funciones:

```python
ventas_norte = 450000 * 0.13
ventas_sur = 380000 * 0.13
ventas_centro = 520000 * 0.13
# ...y así 20 veces
```

Con funciones:

```python
def calcular_iva(monto):
    return monto * 0.13

ventas_norte = calcular_iva(450000)
ventas_sur = calcular_iva(380000)
ventas_centro = calcular_iva(520000)
```

¿Y si mañana cambia la tasa del IVA? Sin funciones, tienes que cambiar 20 líneas. Con función, cambias UNA línea: la del cuerpo de la función. Todo el resto sigue funcionando.

> 💡 **Regla de oro:** Si te encuentras escribiendo el mismo código más de dos veces, probablemente debería ser una función.

---

## Funciones con múltiples parámetros

Las funciones pueden recibir varios parámetros, separados por comas:

```python
def calcular_total(precio_unitario, cantidad):
    subtotal = precio_unitario * cantidad
    iva = subtotal * 0.13
    total = subtotal + iva
    return total

total = calcular_total(50, 10)
print(total)  # 565.0
```

El orden importa: el primer valor que pasas se asigna al primer parámetro, el segundo al segundo, etc.

### Parámetros con nombre

Para mayor claridad, puedes pasar los parámetros usando sus nombres explícitamente:

```python
total = calcular_total(precio_unitario=50, cantidad=10)
```

Esto es especialmente útil cuando una función tiene muchos parámetros y no quieres confundirte con el orden.

---

## Parámetros con valores por defecto

Puedes darle a un parámetro un valor por defecto. Si quien llama a la función no especifica ese parámetro, se usa el valor por defecto:

```python
def aplicar_descuento(monto, porcentaje=10):
    descuento = monto * (porcentaje / 100)
    return monto - descuento

# Usa el descuento por defecto del 10%
print(aplicar_descuento(1000))  # 900.0

# Especifica un descuento del 25%
print(aplicar_descuento(1000, porcentaje=25))  # 750.0
```

Esto hace que tus funciones sean más flexibles sin perder simplicidad.

---

## Funciones que devuelven más de un valor

Una función puede devolver varios valores a la vez separándolos con comas. Quien la llama recibe una tupla con todos:

```python
def estadisticas_basicas(numeros):
    total = sum(numeros)
    promedio = total / len(numeros)
    maximo = max(numeros)
    minimo = min(numeros)
    return total, promedio, maximo, minimo

ventas = [420000, 398000, 441000, 510000]
total, promedio, maximo, minimo = estadisticas_basicas(ventas)

print(f"Total: ${total:,}")
print(f"Promedio: ${promedio:,.0f}")
print(f"Máximo: ${maximo:,}")
print(f"Mínimo: ${minimo:,}")
```

Este patrón es muy útil para construir funciones de análisis que devuelven varias métricas a la vez.

---

## Funciones que no devuelven nada

No todas las funciones tienen que devolver un valor. Algunas solo hacen algo, como imprimir un reporte:

```python
def imprimir_reporte(region, ventas, objetivo):
    cumplimiento = (ventas / objetivo) * 100
    print(f"--- Reporte {region} ---")
    print(f"Ventas: ${ventas:,}")
    print(f"Objetivo: ${objetivo:,}")
    print(f"Cumplimiento: {cumplimiento:.1f}%")

imprimir_reporte("Norte", 450000, 400000)
```

Esta función no tiene `return`. Solo imprime. Es perfectamente válida y muy útil para tareas de reporte.

---

## Buenas prácticas para nombrar funciones

- **Usa verbos**: `calcular_total`, `obtener_clientes`, `validar_email`. Una función hace algo, así que su nombre debe ser una acción.
- **Sé descriptivo**: `calcular_iva` es mejor que `iva` o `calc`.
- **Una función, una responsabilidad**: si tu función hace 5 cosas, probablemente deberían ser 5 funciones.

---

## 🎯 Ejercicio

1. Escribe una función llamada `clasificar_venta` que reciba un monto y devuelva:
   - `"Pequeña"` si es menor a 100,000
   - `"Mediana"` si está entre 100,000 y 500,000
   - `"Grande"` si es mayor a 500,000

2. Pruébala con tres montos diferentes.

3. Escribe otra función llamada `procesar_ventas` que reciba una lista de montos e imprima cada uno con su clasificación.

<details>
<summary>Ver solución</summary>

```python
def clasificar_venta(monto):
    if monto < 100000:
        return "Pequeña"
    elif monto <= 500000:
        return "Mediana"
    else:
        return "Grande"

def procesar_ventas(ventas):
    for venta in ventas:
        clasificacion = clasificar_venta(venta)
        print(f"${venta:,} → {clasificacion}")

# Pruebas
print(clasificar_venta(50000))   # Pequeña
print(clasificar_venta(250000))  # Mediana
print(clasificar_venta(750000))  # Grande

# Procesar lista
ventas = [80000, 350000, 620000, 95000, 450000]
procesar_ventas(ventas)
```

</details>

---

## Resumen de la sección

Has aprendido lo esencial de Python:

| Concepto | Para qué sirve |
|---|---|
| Variables | Guardar valores con un nombre |
| Tipos de datos | int, float, string, bool |
| Listas | Colecciones ordenadas |
| Diccionarios | Pares clave-valor |
| Condicionales | Tomar decisiones (`if`/`elif`/`else`) |
| Bucles | Repetir acciones (`for`) |
| Funciones | Reutilizar lógica con un nombre |

Con esto ya tienes todas las herramientas básicas para empezar con Spark. En la siguiente sección verás cómo Spark toma estas mismas ideas y las potencia para trabajar con millones de registros.

---

*Universidad Nexus — Curso de Python y Spark*
