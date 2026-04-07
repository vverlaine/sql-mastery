---
sidebar_position: 4
title: Condicionales y Bucles
---

# Condicionales y Bucles

Hasta ahora has aprendido a guardar datos en variables y colecciones. Pero los datos sin lógica son inertes. Los condicionales y bucles son lo que le dan vida al código: la capacidad de tomar decisiones y de procesar muchas cosas a la vez.

Estos dos conceptos son la base de cualquier programa, y vas a verlos hasta en el código de Spark más simple.

---

## Condicionales: tomar decisiones con if

Un condicional ejecuta cierto código solo si una condición se cumple. La estructura básica es:

```python
ventas = 450000

if ventas > 400000:
    print("Excelente mes")
```

La línea con `if` verifica si la condición es verdadera. Si lo es, se ejecuta el código indentado debajo. Si no lo es, se salta.

> ⚠️ **La indentación importa:** Python usa la indentación (los espacios al inicio de la línea) para saber qué código pertenece al `if`. Es estricto: si no indentas correctamente, el código no funciona. Usa 4 espacios o un tabulador, sé consistente.

### if / else

A veces quieres ejecutar algo si la condición se cumple y otra cosa si no se cumple. Para eso existe `else`:

```python
ventas = 380000
objetivo = 400000

if ventas >= objetivo:
    print("Objetivo alcanzado")
else:
    print("Objetivo no alcanzado")
```

### if / elif / else

Cuando tienes más de dos casos, usas `elif` (else if):

```python
crecimiento = 8.5

if crecimiento >= 10:
    categoria = "Excelente"
elif crecimiento >= 5:
    categoria = "Bueno"
elif crecimiento >= 0:
    categoria = "Estable"
else:
    categoria = "En declive"

print(categoria)  # "Bueno"
```

Python evalúa las condiciones de arriba hacia abajo. Cuando encuentra una verdadera, ejecuta su bloque y se sale. Las demás se ignoran.

### Operadores de comparación

Son los mismos que ya viste en SQL, con una pequeña diferencia importante:

| Operador | Significado | Ejemplo |
|---|---|---|
| `==` | Igual a | `region == "Norte"` |
| `!=` | Distinto de | `region != "Sur"` |
| `<` | Menor que | `ventas < 100000` |
| `<=` | Menor o igual | `stock <= 0` |
| `>` | Mayor que | `monto > 5000` |
| `>=` | Mayor o igual | `edad >= 18` |

> ⚠️ **Cuidado:** Para igualdad se usa `==` (doble), no `=`. Un solo `=` se usa para asignar valores. Confundirlos es el error más común al empezar.

### Combinar condiciones con and, or, not

Igual que en SQL, puedes combinar condiciones:

```python
region = "Norte"
ventas = 450000

if region == "Norte" and ventas > 400000:
    print("Norte está performando bien")

if region == "Norte" or region == "Sur":
    print("Es región priorizada")

if not ventas < 100000:
    print("Las ventas son aceptables")
```

---

## Bucles: repetir acciones con for

Un bucle ejecuta el mismo bloque de código múltiples veces, una vez por cada elemento de una colección. La estructura más común es:

```python
regiones = ["Norte", "Sur", "Centro", "Este"]

for region in regiones:
    print(region)
```

Esto imprime cada región en una línea. La variable `region` toma cada valor de la lista, uno por uno.

### Bucles con cálculos

Los bucles son útiles para hacer cálculos sobre cada elemento:

```python
ventas_mensuales = [420000, 398000, 441000, 510000]

total = 0
for venta in ventas_mensuales:
    total = total + venta

print(f"Total del periodo: ${total:,}")
```

> 💡 **Atajo:** En el ejemplo anterior podrías usar directamente `sum(ventas_mensuales)`. Lo escribimos con bucle solo para mostrar el patrón. En la práctica, usa funciones nativas cuando existan.

### Bucles con condicionales adentro

Esta combinación es muy poderosa: recorrer una lista y procesar solo los elementos que cumplen una condición.

```python
ventas = [420000, 380000, 510000, 290000, 460000]

ventas_altas = []
for venta in ventas:
    if venta >= 400000:
        ventas_altas.append(venta)

print(ventas_altas)  # [420000, 510000, 460000]
```

Este patrón "recorre y filtra" es exactamente lo que vas a hacer en Spark, pero con una sintaxis mucho más concisa. Por ahora, basta con que lo entiendas en Python básico.

### Iterar sobre diccionarios

Cuando recorres un diccionario, por defecto iteras sobre las claves:

```python
producto = {"nombre": "Galletas", "precio": 8.50, "stock": 200}

for clave in producto:
    print(f"{clave}: {producto[clave]}")
```

Si quieres tanto la clave como el valor a la vez, usa `.items()`:

```python
for clave, valor in producto.items():
    print(f"{clave}: {valor}")
```

### Iterar sobre listas de diccionarios

Y aquí es donde todo se conecta. Recuerda que una lista de diccionarios es básicamente una tabla. Iterar sobre ella es como recorrer cada fila:

```python
ventas = [
    {"region": "Norte", "monto": 450000},
    {"region": "Sur", "monto": 380000},
    {"region": "Centro", "monto": 520000},
]

for venta in ventas:
    if venta["monto"] > 400000:
        print(f"{venta['region']}: ${venta['monto']:,}")
```

Este código recorre todas las ventas e imprime solo las que superan los 400,000. Es exactamente la lógica de un `WHERE` en SQL, pero escrito en Python paso a paso.

---

## 🎯 Ejercicio

Tienes la siguiente lista de productos:

```python
productos = [
    {"nombre": "Galletas", "precio": 8.50, "stock": 150},
    {"nombre": "Refresco", "precio": 12.00, "stock": 30},
    {"nombre": "Snack", "precio": 6.00, "stock": 0},
    {"nombre": "Chocolate", "precio": 15.00, "stock": 200},
    {"nombre": "Agua", "precio": 5.00, "stock": 25},
]
```

1. Recorre la lista e imprime solo los productos con stock menor a 50.
2. Para esos productos, indica si el stock es "Crítico" (0), "Bajo" (1-30) o "Reposición" (31-50).
3. Cuenta cuántos productos hay en cada categoría de stock.

<details>
<summary>Ver solución</summary>

```python
productos = [
    {"nombre": "Galletas", "precio": 8.50, "stock": 150},
    {"nombre": "Refresco", "precio": 12.00, "stock": 30},
    {"nombre": "Snack", "precio": 6.00, "stock": 0},
    {"nombre": "Chocolate", "precio": 15.00, "stock": 200},
    {"nombre": "Agua", "precio": 5.00, "stock": 25},
]

criticos = 0
bajos = 0
reposicion = 0

for producto in productos:
    if producto["stock"] < 50:
        if producto["stock"] == 0:
            estado = "Crítico"
            criticos += 1
        elif producto["stock"] <= 30:
            estado = "Bajo"
            bajos += 1
        else:
            estado = "Reposición"
            reposicion += 1
        print(f"{producto['nombre']}: {estado} ({producto['stock']} unidades)")

print(f"\nResumen: {criticos} crítico(s), {bajos} bajo(s), {reposicion} en reposición")
```

</details>

---

*Universidad Nexus — Curso de Python y Spark*
