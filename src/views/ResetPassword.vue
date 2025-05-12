<template>
  <v-app>
    <v-main class="login-bg">
      <v-container fill-height>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card class="elevation-6 login-card">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title class="text-h5">Restablecer contraseña</v-toolbar-title>
              </v-toolbar>
              <v-card-text class="pa-6">
                <v-form v-model="formValid" ref="form" @submit.prevent="onSubmit">

                  <!-- Campo de contraseña con validación en tiempo real -->
                  <div class="input-field mb-4">
                    <v-text-field
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      label="Nueva contraseña"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="showPassword = !showPassword"
                      @input="evaluatePassword"
                      :rules="[rules.required, rules.minLen]"
                      outlined
                      rounded
                    >
                    </v-text-field>
                  </div>

                  <!-- Listado dinámico de reglas que marca ✔️ o ❌ -->
                  <ul class="password-rules mb-6">
                    <li v-for="rule in passwordRules" :key="rule.text">
                      <v-icon small :color="rule.ok ? 'success' : 'error'">
                        {{ rule.ok ? 'mdi-check-circle' : 'mdi-close-circle' }}
                      </v-icon>
                      {{ rule.text }}
                    </li>
                  </ul>

                  <!-- Confirmar contraseña -->
                  <div class="input-field mb-6">
                    <v-text-field
                      v-model="confirmPassword"
                      :type="showConfirm ? 'text' : 'password'"
                      label="Confirmar contraseña"
                      :append-icon="showConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="showConfirm = !showConfirm"
                      :rules="[rules.required, matchPassword]"
                      outlined
                      rounded
                    >
                    </v-text-field>
                  </div>

                  <!-- Botón deshabilitado hasta cumplir todas las reglas -->
                  <v-btn
                    block
                    color="primary"
                    :loading="loading"
                    :disabled="!formValid || !allRulesOk"
                    @click="onSubmit"
                    depressed
                  >
                    Actualizar contraseña
                  </v-btn>

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
import { auth } from '@/firebase-config'
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth'
import axios from 'axios'
import store from '@/store'

// Aseguramos baseURL HTTPS para axios
const envUrl = process.env.VUE_APP_API_URL || ''
if (envUrl) axios.defaults.baseURL = envUrl.replace(/^http:/, 'https:')

export default {
  name: 'ResetPassword',
  data() {
    return {
      oobCode: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirm: false,
      formValid: false,
      loading: false,
      // Reglas básicas para el v-text-field
      rules: {
        required: v => !!v || 'Obligatorio',
        minLen: v => v.length >= 8 || 'Mínimo 8 caracteres'
      },
      // Estado y test de cada regla
      passwordRules: [
        { text: 'Al menos 8 caracteres',          ok: false, test: v => v.length >= 8 },
        { text: 'Al menos una mayúscula',         ok: false, test: v => /[A-Z]/.test(v) },
        { text: 'Al menos una minúscula',         ok: false, test: v => /[a-z]/.test(v) },
        { text: 'Al menos un número',             ok: false, test: v => /\d/.test(v) },
        { text: 'Al menos un carácter especial',  ok: false, test: v => /[!@#$%^&*(),.?":{}|<>]/.test(v) }
      ]
    }
  },
  computed: {
    matchPassword() {
      return v => v === this.password || 'Las contraseñas no coinciden'
    },
    // Todas las reglas deben pasar para habilitar el botón
    allRulesOk() {
      return this.passwordRules.every(r => r.ok)
    }
  },
  methods: {
    // Evalúa cada regla al tipear
    evaluatePassword() {
      this.passwordRules.forEach(r => {
        r.ok = r.test(this.password)
      })
    },
    async onSubmit() {
      if (!this.$refs.form.validate()) return
      this.loading = true

      try {
        // 1) Confirma el reset en Firebase
        await confirmPasswordReset(auth, this.oobCode, this.password)

        // 2) Recupera usuario y actualiza en backend
        const { data: { data: user } } = await axios.get(
          `/usuarios/getByEmail/${encodeURIComponent(this.email)}`
        )
        await axios.patch(
          `/usuarios/editOneById/${user.Id}`,
          { Password: encodeURIComponent(this.password) }
        )

        // 3) Muestra éxito y redirige al login usando snack global
        store.dispatch('snackbar/mostrar', {
          texto: '✅ Contraseña restablecida correctamente. Serás redirigido al login…',
          color: 'success',
          timeout: 3000
        })
        setTimeout(() => {
          this.$router.replace({ name: 'Login' })
        }, 3000)
      } catch (err) {
        console.error('Reset error:', err)
        store.dispatch('snackbar/mostrar', {
          texto: err.code === 'auth/invalid-action-code'
            ? 'Enlace inválido o expirado'
            : 'Error al actualizar contraseña',
          color: 'error',
          timeout: 5000
        })
      } finally {
        this.loading = false
      }
    }
  },
  async created() {
    // Título y captura de parámetros
    this.$store.dispatch('actualizarTituloPrincipal', 'Restablecer contraseña')
    this.oobCode = this.$route.query.oobCode || ''
    if (this.$route.query.email) {
      this.email = this.$route.query.email
    } else {
      try {
        this.email = await verifyPasswordResetCode(auth, this.oobCode)
      } catch {
        store.dispatch('snackbar/mostrar', {
          texto: 'Enlace inválido o expirado',
          color: 'error',
          timeout: 5000
        })
      }
    }
  }
}
</script>

<style scoped>
.login-bg {
  background-color: #f5f5f5;
}
.login-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
}

/* Estilos para el listado de reglas */
.password-rules {
  list-style: none;
  padding: 0;
  margin: 4px 0 16px;
}
.password-rules li {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
}
.password-rules v-icon {
  margin-right: 4px;
}
</style>