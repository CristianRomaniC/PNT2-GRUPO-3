<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center px-3">
    <div class="card-dark p-4" style="width: 100%; max-width: 360px;">

      <div class="d-flex align-items-center gap-2 mb-1">
        <div
          class="d-flex align-items-center justify-content-center rounded"
          style="width: 36px; height: 36px; background-color: var(--color-accent);"
        >
          <span style="color: var(--color-accent-text); font-weight: 500;">🚗</span>
        </div>
        <span class="fw-medium fs-5">Lavadero SPA</span>
      </div>
      <p class="form-label-dark mb-4">
        {{ modoRegistro ? 'Crear cuenta' : 'Iniciar sesión' }}
      </p>

      <div v-if="modoRegistro" class="mb-3">
        <label class="form-label-dark d-block mb-1">Nombre</label>
        <input
          v-model="nombre"
          type="text"
          placeholder="Tu nombre"
          class="form-control form-control-dark"
        />
      </div>

      <div class="mb-3">
        <label class="form-label-dark d-block mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="cliente@test.com"
          class="form-control form-control-dark"
        />
      </div>

      <div class="mb-4">
        <label class="form-label-dark d-block mb-1">Contraseña</label>
        <input
          v-model="password"
          type="password"
          placeholder="••••••"
          class="form-control form-control-dark"
        />
      </div>

      <button @click="ejecutarAccion" class="btn btn-accent w-100">
        {{ modoRegistro ? 'Registrarse' : 'Ingresar' }}
      </button>

      <p class="text-center mt-3 mb-0" style="font-size: 0.85rem; color: var(--color-text-muted);">
        {{ modoRegistro ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?' }}
        <a href="#" @click.prevent="modoRegistro = !modoRegistro" class="link-accent">
          {{ modoRegistro ? 'Iniciá sesión' : 'Registrate aquí' }}
        </a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useLavaderoStore } from '../stores/lavadero'
import { useRouter } from 'vue-router'

const store = useLavaderoStore()
const router = useRouter()

// Variables reactivas
const email = ref('')
const password = ref('')
const nombre = ref('') // Para el registro
const modoRegistro = ref(false) // Controla qué formulario ver

const ejecutarAccion = () => {
  if (!email.value || !password.value) {
    alert('Por favor, completa email y contraseña.')
    return
  }

  if (modoRegistro.value) {
    if (!nombre.value) {
      alert('Por favor, ingresa tu nombre.')
      return
    }

    const exito = store.registrarse(nombre.value, email.value, password.value)

    if (exito) {
      alert('¡Cuenta creada con éxito! Entrando al sistema...')

      store.login(email.value, password.value)
      router.push('/cliente')
    } else {
      alert('Este correo ya está registrado.')
    }
  } else {
    const logueado = store.login(email.value, password.value)
    if (logueado) {
      if (store.usuarioLogueado.rol === 'admin') {
        router.push('/admin')
      } else {
        router.push('/cliente')
      }
    } else {
      alert('Credenciales incorrectas.')
    }
  }
}
</script>