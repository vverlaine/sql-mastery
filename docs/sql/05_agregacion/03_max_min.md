---
sidebar_position: 4
title: MAX y MIN — Extremos
---

# MAX() y MIN() — Los Extremos

## MAX(): el valor más alto

`MAX()` devuelve el valor más alto en una columna. Útil para encontrar el registro más grande, más reciente o más alto de cualquier métrica:

```sql
SELECT MAX(total)
FROM cbc_cas_dev.universidad.fact_ventas;
```

Esto te da el total de la venta más alta registrada en toda la tabla.

---

## MIN(): el valor más bajo

`MIN()` devuelve el valor más pequeño. El complemento natural de `MAX()`:

```sql
SELECT MIN(total)
FROM cbc_cas_dev.universidad.fact_ventas;
```

---

## El valor analítico de los extremos

`MAX()` y `MIN()` no solo dan un número: revelan los límites de tus datos.

- `MAX()` te muestra el techo: la venta más alta, la cantidad más grande, la fecha más reciente.
- `MIN()` te muestra el piso: la venta más baja, la cantidad mínima, la fecha más antigua.

La brecha entre ambos — el rango — te dice cuánta variabilidad existe en tus datos. Un rango amplio entre `MAX` y `MIN` sugiere que el promedio puede no ser representativo.

---

## 🎯 Tareas

**Tarea 1:** Obtén el valor más grande de `total` en la tabla `cbc_cas_dev.universidad.fact_ventas`.

<details>
<summary>Ver solución</summary>

```sql
SELECT MAX(total)
FROM cbc_cas_dev.universidad.fact_ventas;
```

</details>

**Tarea 2:** Obtén el valor más pequeño de `total` en la tabla `cbc_cas_dev.universidad.fact_ventas`.

<details>
<summary>Ver solución</summary>

```sql
SELECT MIN(total)
FROM cbc_cas_dev.universidad.fact_ventas;
```

</details>

---

## Desafío

Obtén el promedio de `total` solo para las ventas cuyo total sea estrictamente mayor a 30.

<details>
<summary>Ver solución</summary>

```sql
SELECT AVG(total)
FROM cbc_cas_dev.universidad.fact_ventas
WHERE total > 30;
```

</details>

---

*Universidad Nexus — Curso de SQL*
