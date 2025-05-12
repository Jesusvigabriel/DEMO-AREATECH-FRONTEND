
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { colors } from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
          light: {
            primary: colors.indigo,
            secondary: colors.indigo.lighten4,
            accent: colors.indigo.darken4,
            error: colors.red,
            info: colors.blue,
            success: colors.green,
            warning: colors.yellow,
            home: colors.green,
            ingresos: colors.blue,
            egresos: colors.cyan,
            configuracion: colors.blueGrey,
            estadisticas: colors.lime,
            cerrarSesion: colors.red
          },
        },
      },
  });
