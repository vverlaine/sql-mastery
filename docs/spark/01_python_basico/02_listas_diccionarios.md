---
sidebar_position: 3
title: Listas y Diccionarios
---

# Listas y Diccionarios

Las variables guardan un solo valor a la vez. Pero como analista, casi siempre vas a trabajar con colecciones: listas de productos, conjuntos de regiones, mapas de configuración. Para eso existen las listas y los diccionarios.

Estas dos estructuras son la base de todo en Python. Si las dominas, todo lo demás fluye.

---

## Listas: colecciones ordenadas

Una lista es una colección de valores en un orden específico. Se crean con corchetes `[]` y los elementos se separan con comas:

```python
regiones = ["Norte", "Sur", "Centro", "Este", "Oeste"]
ventas_mensuales = [420000, 398000, 441000, 510000]
clientes_top = [1, 5, 12, 47, 89]
```

Una lista puede contener cualquier tipo de dato, e incluso mezclarlos (aunque no es recomendable).

### Acceder a elementos por su posición

Cada elemento de una lista tiene una posición llamada **índice**. Y aquí viene un detalle importante: **en Python las listas empiezan en 0**, no en 1.

```python
regiones = ["Norte", "Sur", "Centro", "Este", "Oeste"]

print(regiones[0])  # "Norte" (primer elemento)
print(regiones[1])  # "Sur"
print(regiones[2])  # "Centro"
print(regiones[-1]) # "Oeste" (último elemento)
```

> ⚠️ **Atención:** El índice negativo cuenta desde el final. `[-1]` es siempre el último elemento, sin importar el tamaño de la lista.

### Operaciones útiles con listas

```python
ventas = [420000, 398000, 441000, 510000]

# Cuántos elementos tiene
print(len(ventas))  # 4

# Suma total
print(sum(ventas))  # 1769000

# Valor máximo
print(max(ventas))  # 510000

# Valor mínimo
print(min(ventas))  # 398000

# Agregar un elemento al final
ventas.append(380000)
print(ventas)  # [420000, 398000, 441000, 510000, 380000]
```

Estas funciones (`len`, `sum`, `max`, `min`) son las que más vas a usar cuando explores datos rápidamente.

---

## Diccionarios: pares clave-valor

Un diccionario es como una lista, pero en lugar de usar índices numéricos, cada valor tiene una **clave** descriptiva. Se crean con llaves `{}` y los pares clave-valor se separan con dos puntos:

```python
producto = {
    "id": 42,
    "nombre": "Coca-Cola 600ml",
    "categoria": "Bebidas",
    "precio": 12.50,
    "stock": 1500
}
```

Acceder a un valor del diccionario es directo: usas la clave entre corchetes.

```python
print(producto["nombre"])    # "Coca-Cola 600ml"
print(producto["precio"])    # 12.50
print(producto["stock"])     # 1500
```

### ¿Cuándo usar diccionario y cuándo lista?

| Usa lista cuando... | Usa diccionario cuando... |
|---|---|
| El orden importa | Necesitas etiquetar cada valor |
| Todos los elementos son del mismo tipo | Cada valor representa algo diferente |
| Vas a iterar uno por uno | Vas a buscar por clave |
| Ej: lista de regiones | Ej: información de un producto |

---

## Listas de diccionarios: el patrón más común

En la práctica, vas a encontrarte muy seguido con listas de diccionarios. Es la forma más natural de representar varios registros que comparten la misma estructura:

```python
ventas = [
    {"id": 1, "fecha": "2024-01-05", "monto": 1500.00, "region": "Norte"},
    {"id": 2, "fecha": "2024-01-05", "monto": 2300.00, "region": "Sur"},
    {"id": 3, "fecha": "2024-01-06", "monto": 890.00, "region": "Centro"},
]
```

Esto es básicamente una tabla. Cada diccionario es una fila, cada clave es una columna. Y este patrón es importante porque cuando trabajes con DataFrames de Spark, internamente la idea es exactamente la misma.

### Acceder a valores en una lista de diccionarios

```python
# Primera venta
print(ventas[0])  # {"id": 1, "fecha": "2024-01-05", ...}

# Monto de la primera venta
print(ventas[0]["monto"])  # 1500.00

# Región de la tercera venta
print(ventas[2]["region"])  # "Centro"
```

> 💡 **Conexión con Spark:** Los DataFrames de Spark son básicamente esta misma idea pero optimizada para millones de registros y con una API mucho más poderosa para consultar, filtrar y transformar.

---

## Modificar diccionarios

Puedes cambiar valores existentes o agregar nuevas claves:

```python
producto = {"id": 42, "nombre": "Galletas", "precio": 8.50}

# Modificar un valor existente
producto["precio"] = 9.00

# Agregar una nueva clave
producto["categoria"] = "Snacks"

print(producto)
# {"id": 42, "nombre": "Galletas", "precio": 9.00, "categoria": "Snacks"}
```

---

## 🎯 Ejercicio

1. Crea una lista llamada `ventas_trimestrales` con los valores `[420000, 398000, 441000]`.
2. Calcula y muestra el total del trimestre.
3. Calcula y muestra el promedio mensual (total dividido entre 3).
4. Crea un diccionario llamado `cliente_top` con las claves `id`, `nombre` y `total_compras`. Asígnale valores ficticios.
5. Imprime el nombre del cliente usando un f-string: `"El cliente top es: Ana García"`.

<details>
<summary>Ver solución</summary>

```python
ventas_trimestrales = [420000, 398000, 441000]

total = sum(ventas_trimestrales)
promedio = total / 3
print(f"Total Q1: ${total:,}")
print(f"Promedio mensual: ${promedio:,.0f}")

cliente_top = {
    "id": 1,
    "nombre": "Ana García",
    "total_compras": 25000
}
print(f"El cliente top es: {cliente_top['nombre']}")
```

</details>

---

*Universidad Nexus — Curso de Python y Spark*
