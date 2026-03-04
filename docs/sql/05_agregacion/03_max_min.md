---
sidebar_position: 4
title: MAX y MIN — Extremos
---

# MAX() y MIN() — Los Extremos

## MAX(): el valor más alto

`MAX()` devuelve el valor más alto en una columna. Útil para encontrar el registro más grande, más reciente o más alto de cualquier métrica:

```sql
SELECT MAX(population)
FROM country;
```

---

## MIN(): el valor más bajo

`MIN()` devuelve el valor más pequeño. El complemento natural de `MAX()`:

```sql
SELECT MIN(population)
FROM country;
```

---

## El valor analítico de los extremos

`MAX()` y `MIN()` no solo dan un número: revelan los límites de tus datos.

- `MAX()` te muestra el techo: el mejor desempeño, el caso más extremo, el valor más reciente.
- `MIN()` te muestra el piso: el peor desempeño, el valor más antiguo, el registro más pequeño.

La brecha entre ambos — el rango — te dice cuánta variabilidad existe en tus datos. Un rango amplio entre `MAX` y `MIN` sugiere que el promedio puede no ser representativo.

---

## 🎯 Tareas

**Tarea 1:** Obtén el valor más grande de `SurfaceArea` en la tabla `country`.

<details>
<summary>Ver solución</summary>

```sql
SELECT MAX(SurfaceArea)
FROM country;
```

</details>

**Tarea 2:** Obtén el valor más pequeño de `SurfaceArea` en la tabla `country`.

<details>
<summary>Ver solución</summary>

```sql
SELECT MIN(SurfaceArea)
FROM country;
```

</details>

---

## Desafío

Obtén el promedio de `SurfaceArea` solo para los países cuya superficie sea estrictamente mayor a 300,000 km².

<details>
<summary>Ver solución</summary>

```sql
SELECT AVG(SurfaceArea)
FROM country
WHERE SurfaceArea > 300000;
```

</details>

---

*Universidad Nexus — Curso de SQL*
