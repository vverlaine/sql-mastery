---
sidebar_position: 2
title: Variables y Tipos de Datos
---

# Variables y Tipos de Datos

## ¿Qué es una variable?

Una variable es un nombre que le pones a un valor para poder reutilizarlo después. Es exactamente lo que parece: una caja con etiqueta donde guardas algo.

```python
ventas_enero = 420000
nombre_pais = "Guatemala"
porcentaje_crecimiento = 5.2
```

Después de declarar una variable, puedes usarla en cualquier parte del código:

```python
ventas_febrero = 398000
diferencia = ventas_febrero - ventas_enero
print(diferencia)
```

> 💡 **Buenas prácticas para nombres:** Usa nombres descriptivos en español o inglés (sin tildes ni espacios), separados por guiones bajos. `total_ventas` es mucho mejor que `tv` o `x1`. El nombre de la variable debe contar qué contiene.

---

## Los 4 tipos de datos que usarás todos los días

Python tiene muchos tipos de datos, pero como analista vas a usar principalmente estos cuatro:

### 1. Enteros (int)
Números sin decimales. Para conteos, identificadores, cantidades.

```python
numero_clientes = 1500
id_producto = 42
```

### 2. Decimales (float)
Números con decimales. Para precios, porcentajes, métricas con precisión.

```python
precio_unitario = 12.50
margen_porcentaje = 0.32
```

### 3. Texto (string)
Cualquier cosa entre comillas. Para nombres, categorías, identificadores de texto.

```python
nombre_cliente = "Carlos Pérez"
categoria = "Electrónica"
region = "Centro"
```

> ⚠️ **Importante:** Las comillas pueden ser simples (`'`) o dobles (`"`), pero deben ser consistentes. `'Guatemala'` y `"Guatemala"` son lo mismo en Python.

### 4. Booleanos (bool)
Solo dos valores: `True` o `False`. Para condiciones, flags, sí/no.

```python
es_cliente_activo = True
tiene_descuento = False
```

---

## Verificar el tipo de una variable

A veces necesitas saber qué tipo de dato contiene una variable. Para eso usas `type()`:

```python
edad = 25
print(type(edad))  # <class 'int'>

precio = 99.99
print(type(precio))  # <class 'float'>

nombre = "Ana"
print(type(nombre))  # <class 'str'>
```

Esto es útil cuando trabajas con datos que vienen de una fuente externa y quieres asegurarte de que están en el formato correcto antes de operar con ellos.

---

## Operaciones básicas con números

```python
# Suma
total = 1500 + 2300

# Resta
diferencia = 2300 - 1500

# Multiplicación
total_con_iva = 1000 * 1.13

# División
promedio = total / 2

# División entera (sin decimales)
filas_por_pagina = 100 // 3

# Módulo (resto de la división)
resto = 100 % 3
```

---

## Concatenar texto

Para unir strings, simplemente úsalos con el signo `+`:

```python
nombre = "María"
apellido = "López"
nombre_completo = nombre + " " + apellido
print(nombre_completo)  # María López
```

Pero hay una forma más moderna y legible llamada **f-strings**, que vas a usar mucho:

```python
ventas = 450000
mes = "marzo"
mensaje = f"Las ventas de {mes} fueron ${ventas:,}"
print(mensaje)  # Las ventas de marzo fueron $450,000
```

El prefijo `f` antes de las comillas le dice a Python que reemplace cualquier `{variable}` con su valor real. Es la forma estándar de construir mensajes con datos.

---

## 🎯 Ejercicio

Crea las siguientes variables y combínalas:

1. Una variable `ventas_q1` con el valor `1259000`
2. Una variable `objetivo_q1` con el valor `1300000`
3. Calcula la diferencia y guárdala en `cumplimiento`
4. Crea un mensaje con f-string que diga: `"Cumplimiento Q1: -$41,000"`

<details>
<summary>Ver solución</summary>

```python
ventas_q1 = 1259000
objetivo_q1 = 1300000
cumplimiento = ventas_q1 - objetivo_q1
mensaje = f"Cumplimiento Q1: ${cumplimiento:,}"
print(mensaje)
```

</details>

---

*Universidad Nexus — Curso de Python y Spark*
