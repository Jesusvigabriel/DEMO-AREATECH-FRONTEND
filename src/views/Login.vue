<template>
  <!-- Estructura principal de la aplicación -->
  <v-app>
    <!-- Contenedor principal con fondo gris claro -->
    <v-main class="login-bg">
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card class="elevation-6 login-card">
              <!-- Barra superior con título e icono -->
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title class="text-h5">Bienvenido</v-toolbar-title>
                <v-spacer />
                <v-icon large>mdi-forklift</v-icon>
              </v-toolbar>

              <!-- Cuerpo de la tarjeta con el formulario -->
              <v-card-text class="pa-6">
                <v-form
                  v-model="datosValidos"
                  ref="form"
                  @submit.prevent="iniciarSesion"
                >
                  <!-- Campo de usuario -->
                  <v-text-field
                    outlined
                    class="mb-4 input-field"
                    label="Usuario"
                    prepend-inner-icon="mdi-account-hard-hat"
                    v-model="username"
                    :rules="[rules.required, rules.min]"
                    hide-details="auto"
                    single-line
                    rounded
                  />

                  <!-- Campo de contraseña con toggle para mostrar/ocultar -->
                  <v-text-field
                    outlined
                    class="mb-6 input-field"
                    label="Contraseña"
                    prepend-inner-icon="mdi-lock"
                    v-model="password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show1 ? 'text' : 'password'"
                    :rules="[rules.required, rules.min]"
                    @click:append="show1 = !show1"
                    hide-details="auto"
                    single-line
                    rounded
                  />

                  <!-- Botón de Ingresar -->
                  <v-btn
                    block
                    x-large
                    color="primary"
                    @click="iniciarSesion"
                    class="login-btn mt-2"
                    :disabled="!datosValidos"
                    depressed
                    :loading="loading"
                  >
                    <span class="btn-text">INGRESAR</span>
                  </v-btn>

                  <!-- Divisor visual -->
                  <v-divider class="my-6" />

                  <!-- Opciones alternativas -->
                  <div class="text-center">
                    <p class="text-caption mb-3 secondary--text">
                      O ingresa con
                    </p>
                    <!-- Componente de login con Google -->
                    <LoginGoogle />
                    <!-- Enlace para recuperación de contraseña -->
                    <v-btn
                      text
                      small
                      color="primary"
                      class="mt-4 forgot-password"
                      @click="olvidePassword"
                    >
                      ¿Olvidaste tu contraseña?
                    </v-btn>
                  </div>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
// Importaciones
import store from '@/store'
import LoginGoogle from '@/components/LoginGoogle.vue'
import { auth, sendPasswordResetEmail } from '@/firebase-config'

export default {
  name: 'Login',
  components: { LoginGoogle },
  data() {
    return {
      username: '',       // Usuario ingresado
      password: '',       // Contraseña ingresada
      show1: false,       // Toggle para mostrar/ocultar contraseña
      loading: false,     // Estado de carga del botón
      datosValidos: false,// Estado de validación del formulario
      rules: {            // Reglas de validación
        required: v => !!v || 'Obligatorio',
        min:      v => v.length >= 3 || 'Mínimo 3 caracteres'
      }
    }
  },
  methods: {
    /**
     * 1) Valida el formulario
     * 2) Intenta despachar acción de login
     * 3) Si hay error, muestra modal con "Reintentar"/"Cancelar"
     */
    async iniciarSesion() {
      this.$refs.form.validate()
      if (!this.datosValidos) {
        store.dispatch('snackbar/mostrar', 'Datos incompletos')
        return
      }

      this.loading = true
      try {
        await store.dispatch('usuarios/intentarLoggearse', {
          Username: encodeURIComponent(this.username),
          Password: encodeURIComponent(this.password)
        })
      } catch (err) {
        console.error('Error al iniciar sesión:', err)
        // Mostrar diálogo de alerta para reintentar el login
        this.$store.dispatch('alertDialog/mostrar', {
          titulo:          'Error al iniciar sesión',
          mensaje:         err.message || 'No fue posible iniciar sesión.',
          botonPrimario:   'Reintentar',
          botonSecundario: 'Cancelar',
          callback: respuesta => {
            if (respuesta === 'Reintentar') {
              this.iniciarSesion()
            }
          }
        })
      } finally {
        this.loading = false
      }
    },

    /**
     * Flujo "Olvidaste tu contraseña":
     * a) Solicitar email con prompt
     * b) Enviar correo de restablecimiento
     * c) Mostrar diálogo con opciones Abrir Gmail / Volver al login
     * d) Si falla, mostrar diálogo con Reintentar/Cancelar
     */
    async olvidePassword() {
      // a) Pedir el email al usuario
      const email = prompt(
        'Por favor, ingresa tu correo registrado y luego revisa tu bandeja de mail'
      )
      if (!email) return

      // b) Configuración para Firebase
      const actionCodeSettings = {
        url: window.location.origin + '/reset-password',
        handleCodeInApp: true
      }

      try {
        // c) Intentar enviar el mail
        await sendPasswordResetEmail(auth, email, actionCodeSettings)

        // Mostrar diálogo de éxito con opción de abrir Gmail
        this.$store.dispatch('alertDialog/mostrar', {
          titulo:          'Revisa tu bandeja de entrada',
          mensaje:         `Hemos enviado un correo a <b>${email}</b>.<br>¿Quieres abrir tu Gmail ahora?`,
          botonPrimario:   'Abrir Gmail',
          botonSecundario: 'Volver al login',
          callback: respuesta => {
            if (respuesta === 'Abrir Gmail') {
              window.open('https://mail.google.com', '_blank')
            }
            this.$router.push('/login')
          }
        })
      } catch (err) {
        console.error('Error al enviar mail de restablecimiento:', err)
        // d) Si falla, mostrar diálogo de reintento
        this.$store.dispatch('alertDialog/mostrar', {
          titulo:          'Error al enviar correo',
          mensaje:         err.code === 'auth/user-not-found'
                             ? 'Email no registrado'
                             : 'Error al enviar el mail de restablecimiento',
          botonPrimario:   'Reintentar',
          botonSecundario: 'Cancelar',
          callback: respuesta => {
            if (respuesta === 'Reintentar') {
              this.olvidePassword()
            }
          }
        })
      }
    }
  },
  created() {
    // Ajustar título principal en el store
    store.dispatch('actualizarTituloPrincipal', 'Inicio de sesión')
  }
}
</script>

<style scoped>
/* Estilos Login.vue */

.login-bg {
  background-color: #f5f5f5;
}

.login-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
}

.input-field {
  border-radius: 8px !important;
}
.input-field >>> .v-input__slot {
  min-height: 48px !important;
}

.login-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  height: 48px !important;
}
.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0,0,0,0.15);
}
.login-btn:active {
  transform: translateY(0);
}

.forgot-password {
  letter-spacing: 0.3px;
}

.v-toolbar__title {
  letter-spacing: 0.5px;
}
</style>

<!-- Fuente Roboto -->
<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');
</style>
