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
actual de una orden o guía. A continuación se describen las clases
devueltas por `getStatusChipClassTextual` para colorear el fondo de cada
chip:

| Estado (Órdenes)      | Clases del chip |
|-----------------------|-----------------|
| Pendiente             | `chip-pendiente` |
| Preparado             | `chip-preparada` |
| A distribución        | `chip-despachada` |
| Anulado               | `error lighten-2 white--text` |
| Retira Cliente        | `chip-despachada` |

| Estado (Guías)        | Clases del chip |
|-----------------------|-----------------|
| Pedido en preparación, Pedido preparado, En CD, En Planchada, Ruteado, DESPACHADO, En distribución, Entregado, Pedido retirado | `success lighten-2 white--text` |
| No entregado, ANULADO | `error lighten-2 white--text` |
| Entrega parcial       | `warning lighten-2 white--text` |
| Otros                 | `secondary lighten-2 white--text` |

