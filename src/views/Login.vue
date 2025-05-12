<template>
  <!-- Estructura principal de la aplicación -->
  <v-app>
    <!-- Contenedor principal con fondo gris claro -->
    <v-main class="login-bg">
      <v-container fill-height>
        <v-row align="center" justify="center">
          <!-- Columnas responsivas para diferentes tamaños de pantalla -->
          <v-col cols="12" sm="8" md="6" lg="4">
            <!-- Tarjeta de login con sombra elevada -->
            <v-card class="elevation-6 login-card">
              <!-- Barra de herramientas superior -->
              <v-toolbar color="primary" dark flat>
                <!-- Título sin negrita como solicitaste -->
                <v-toolbar-title class="text-h5">Bienvenido</v-toolbar-title>
                <v-spacer />
                <!-- Icono de montacargas en lugar del de usuario -->
                <v-icon large>mdi-forklift</v-icon>
              </v-toolbar>

              <!-- Contenido del formulario -->
              <v-card-text class="pa-6">
                <!-- Formulario con validación -->
                <v-form v-model="datosValidos" ref="form" @submit.prevent="iniciarSesion">
                  <!-- Campo de usuario con icono de casco de obrero -->
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

                  <!-- Botón de ingreso con efectos hover -->
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

                  <!-- Opciones alternativas de login -->
                  <div class="text-center">
                    <p class="text-caption mb-3 secondary--text">O ingresa con</p>
                    <!-- Componente para login con Google -->
                    <LoginGoogle />
                    <!-- Enlace para recuperar contraseña -->
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
// Importación de dependencias
import store from '../store'
import LoginGoogle from '@/components/LoginGoogle.vue'
import { auth, sendPasswordResetEmail } from '@/firebase-config'

export default {
  name: 'Login',
  components: {
    LoginGoogle
  },
  data() {
    return {
      username: '',     // Almacena el nombre de usuario
      password: '',     // Almacena la contraseña
      show1: false,     // Controla si se muestra la contraseña
      loading: false,   // Estado de carga del botón
      // Reglas de validación
      rules: {
        required: v => !!v || 'Obligatorio',
        min: v => v.length >= 3 || 'Mínimo 3 caracteres'
      },
      datosValidos: false // Estado de validación del formulario
    }
  },
  methods: {
    // Método para iniciar sesión
    async iniciarSesion() {
      this.validar()
      if (!this.datosValidos) {
        store.dispatch("snackbar/mostrar", "Datos incompletos")
        return
      }
      
      this.loading = true
      try {
        await store.dispatch('usuarios/intentarLoggearse', {
          Username: encodeURIComponent(this.username),
          Password: encodeURIComponent(this.password)
        })
      } finally {
        this.loading = false
      }
    },
    // Valida el formulario
    validar() {
      this.$refs.form.validate()
    },
    // Método para manejar olvido de contraseña
    async olvidePassword() {
      // Pedir al usuario su email
      const email = prompt("Por favor, ingresa tu correo registrado y luego revisa tu bandeja de mail")
      if (!email) return

      const actionCodeSettings = {
        url: `${window.location.origin}/reset-password`,
        handleCodeInApp: true
      }

      try {
        await sendPasswordResetEmail(auth, email, actionCodeSettings)
        this.$store.dispatch('snackbar/mostrar', {
          texto: 'Revisa tu correo para restablecer tu contraseña',
          color: 'success',
          timeout: 5000
        })
      } catch (err) {
        console.error("Error al enviar mail de restablecimiento:", err)
        this.$store.dispatch('snackbar/mostrar', {
          texto: err.code === 'auth/user-not-found'
            ? 'Email no registrado'
            : 'Error al enviar el mail de restablecimiento',
          color: 'error',
          timeout: 5000
        })
      }
    }
  },
  // Hook de ciclo de vida
  created() {
    store.dispatch('actualizarTituloPrincipal', 'Inicio de sesión')
  }
}
</script>

<!-- Estilos con scope para este componente -->
<style scoped>
/* Fondo gris claro para el área de login */
.login-bg {
  background-color: #f5f5f5;
}

/* Estilos para la tarjeta de login */
.login-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
}

/* Estilos para los campos de entrada */
.input-field {
  border-radius: 8px !important;
}

.input-field >>> .v-input__slot {
  min-height: 48px !important;
}

/* Estilos para el botón de login */
.login-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  height: 48px !important;
}

/* Efecto hover para el botón */
.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0,0,0,0.15);
}

/* Efecto al hacer click */
.login-btn:active {
  transform: translateY(0);
}

/* Texto dentro del botón */
.login-btn .btn-text {
  letter-spacing: 0.8px;
}

/* Estilo para el enlace de "Olvidaste tu contraseña" */
.forgot-password {
  letter-spacing: 0.3px;
}

/* Ajuste para el título de la toolbar */
.v-toolbar__title {
  letter-spacing: 0.5px;
}
</style>

<!-- Importación de la fuente Roboto -->
<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');
</style>
