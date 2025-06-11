<template>
  <v-btn 
    block 
    large 
    class="google-btn"
    @click="loginWithGoogle"
    depressed
    height="48"
    :disabled="loading"
    :loading="loading"
  >
    <div class="btn-content">
      <img 
        src="https://developers.google.com/identity/images/g-logo.png"
        class="google-logo"
        alt="Google Logo"
      >
      <span class="btn-text">Cuenta de Google</span>
    </div>
    
    <template v-slot:loader>
      <v-progress-circular
        indeterminate
        size="24"
        color="primary"
      ></v-progress-circular>
    </template>
  </v-btn>
</template>

<script>
import { auth, provider } from '@/firebase-config'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

export default {
  data: () => ({
    loading: false
  }),
  methods: {
    async loginWithGoogle() {
      this.loading = true
      try {
        const result = await signInWithPopup(auth, provider)
        const credential = GoogleAuthProvider.credentialFromResult(result)
        
        if (!credential) {
          throw new Error('No se pudo obtener credencial de Google')
        }

        const token = await result.user.getIdToken()
        
        if (!token) {
          throw new Error('Error al generar token de autenticación')
        }

        await this.$store.dispatch('usuarios/loginWithGoogle', token)
        
      } catch (error) {
        let errorMessage = 'Error al iniciar sesión con Google'
        
        // Manejo específico de errores de Firebase
        if (error.code) {
          switch (error.code) {
            case 'auth/popup-closed-by-user':
              errorMessage = 'El popup de autenticación se cerró antes de completar el login'
              break
            case 'auth/network-request-failed':
              errorMessage = 'Error de red. Verifica tu conexión a internet'
              break
            case 'auth/account-exists-with-different-credential':
              errorMessage = 'Este email ya está registrado con otro método de autenticación'
              break
          }
        }
        
        // Log para desarrollo
        console.error('Error Google Auth:', {
          code: error.code,
          message: error.message,
          email: error.customData?.email
        })

        this.$store.dispatch('snackbar/mostrar', {
          mensaje: errorMessage,
          color: 'error',
          timeout: 5000
        })
        
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.google-btn {
  background-color: #ffffff !important;
  border: 1px solid #dadce0 !important;
  border-radius: 4px !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.google-btn:hover {
  box-shadow: 0 2px 6px rgba(0,0,0,0.18) !important;
  background-color: #f8f9fa !important;
}

.google-btn:active {
  transform: translateY(1px);
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 16px;
}

.google-logo {
  width: 20px;
  height: 20px;
  margin-right: 12px;
}

.btn-text {
  color: #3c4043;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.25px;
}
</style>