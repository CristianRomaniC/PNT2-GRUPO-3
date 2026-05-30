<template>
  <div class="pagina-login">
    <h1>Lavadero SPA</h1>

    <div class="tarjeta-login">
      <h3>{{ modoRegistro ? 'Crear Cuenta' : 'Iniciar Sesión' }}</h3>

      <div v-if="modoRegistro" class="campo-formulario">
        <label>Nombre:</label><br />
        <input
          v-model="nombre"
          type="text"
          placeholder="Tu nombre"
          class="entrada-texto"
        />
      </div>

      <div class="campo-formulario">
        <label>Email:</label><br />
        <input
          v-model="email"
          type="email"
          placeholder="cliente@test.com"
          class="entrada-texto"
        />
      </div>

      <div class="campo-formulario">
        <label>Contraseña:</label><br />
        <input
          v-model="password"
          type="password"
          placeholder="***"
          class="entrada-texto"
        />
      </div>

      <button @click="ejecutarAccion" class="boton-enviar">
        {{ modoRegistro ? 'REGISTRARSE' : 'INGRESAR' }}
      </button>

      <p class="pie-formulario">
        {{ modoRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?' }}
        <a href="#" @click.prevent="modoRegistro = !modoRegistro" class="enlace-toggle">
          {{ modoRegistro ? 'Inicia sesión' : 'Regístrate aquí' }}
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

<style scoped>
.pagina-login {
  text-align: center;
  margin-top: 50px;
  font-family: sans-serif;
}

.tarjeta-login {
  display: inline-block;
  text-align: left;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tarjeta-login h3 {
  margin-bottom: 20px;
}

.campo-formulario {
  margin-bottom: 10px;
}

.entrada-texto {
  width: 100%;
  box-sizing: border-box;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.boton-enviar {
  width: 100%;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: bold;
  border-radius: 4px;
}

.pie-formulario {
  margin-top: 15px;
  font-size: 14px;
  text-align: center;
}

.enlace-toggle {
  color: #3498db;
  text-decoration: none;
  font-weight: bold;
}
</style>