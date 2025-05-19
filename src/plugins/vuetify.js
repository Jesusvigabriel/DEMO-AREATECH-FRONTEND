// vuetify.js
// (Configuración de Vuetify con soporte para tema claro y oscuro y paleta personalizada de AreaTech)
//
// NOTA: Los colores están basados en la imagen de referencia, y el degradado se usa para la barra azul en ambos modos.
// Si querés usar colores en CSS: var(--v-primary-base), etc.

import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: false, // Arranca en modo claro. Se puede cambiar por código o por UI
    themes: {
      light: {
        // -------- Tema claro (fondo blanco) --------
        primary:    '#0374e4',       // Azul claro principal
        secondary:  '#0557c1',       // Azul medio
        accent:     '#032284',       // Azul oscuro para resaltar
        error:      '#ff5252',       // Rojo de error
        info:       '#888888',       // Gris para iconos/estados
        success:    '#5beb51',       // Verde claro para "en uso"
        warning:    '#ffe082',       // Amarillo para advertencias
        background: '#ffffff',       // Fondo general blanco
        surface:    '#f4f6fa',       // Para tarjetas, tablas, paneles
        menubar:    'linear-gradient(115deg, #0374e4 65%, #032284 98%)', // Degradado barra azul (para ambas)
        card:       '#ffffff',       // Fondo blanco tarjetas (por defecto)
        // Colores adicionales a mano para usar en dark también:
        darkblue:   '#1e2b36',       // Para algún widget, footer o detalles
      },
      dark: {
        // -------- Tema oscuro (fondo oscuro) --------
        primary:    '#0374e4',       // Mismo azul para consistencia
        secondary:  '#0557c1',
        accent:     '#032284',
        error:      '#ff5252',
        info:       '#888888',       // Gris para iconos
        success:    '#5beb51',
        warning:    '#ffe082',
        background: '#101415',       // Fondo general negro
        surface:    '#1e2b36',       // Para tarjetas, paneles, tablas
        menubar:    'linear-gradient(115deg, #0374e4 65%, #032284 98%)', // Misma barra azul degradada
        card:       '#1e2b36',       // Fondo para cards oscuro
        darkblue:   '#1e2b36',       // Fondo para widgets especiales
      }
    },
    options: {
      customProperties: true // Permite usar colores como variables CSS (var(--v-primary-base))
    }
  }
})
