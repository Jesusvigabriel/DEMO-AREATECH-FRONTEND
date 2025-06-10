# a54gestion

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Colores de chips de estado

Los componentes de seguimiento utilizan `v-chip` para mostrar el estado
actual de una orden o guía. A continuación se describen los colores
asignados a cada estado por la función `getStatusChipColor`:

| Estado (Órdenes)      | Color background | Color texto |
|-----------------------|------------------|-------------|
| Pendiente             | amber lighten-4  | amber darken-3 |
| Preparado             | blue lighten-4   | blue darken-2 |
| A distribución        | green lighten-4  | green darken-2 |
| Anulado               | red lighten-4    | red darken-2 |
| Retira Cliente        | deep-purple lighten-4 | deep-purple darken-2 |

| Estado (Guías)        | Color background | Color texto |
|-----------------------|------------------|-------------|
| Pedido en preparación, Pedido preparado, En CD, En Planchada, Ruteado, DESPACHADO, En distribución, Entregado, Pedido retirado | green lighten-4 | green darken-2 |
| No entregado, ANULADO | red lighten-4    | red darken-2 |
| Entrega parcial       | orange lighten-4 | orange darken-2 |
| Otros                 | grey lighten-4   | grey darken-1 |

