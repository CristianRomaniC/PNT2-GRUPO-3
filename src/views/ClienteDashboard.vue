<template>
  <div class="min-vh-100 py-4 px-3" style="background-color: var(--color-bg);">
    <div class="container" style="max-width: 700px;">

      <nav class="d-flex justify-content-between align-items-center card-dark px-3 py-2 mb-4">
        <span style="font-size: 0.9rem;">
          Sesión de: <strong>{{ store.usuarioLogueado?.nombre }}</strong>
        </span>
        <button @click="cerrarSesion" class="btn btn-sm" style="background-color: #501313; color: #F7C1C1; border: none;">
          Salir
        </button>
      </nav>

      <h1 class="fs-4 fw-medium mb-1">Panel del cliente</h1>
      <p style="color: var(--color-text-muted);">
        Bienvenido: <strong style="color: var(--color-text);">{{ store.usuarioLogueado?.nombre || 'Invitado' }}</strong>
      </p>

      <div class="card-dark p-3 my-4">
        <h2 class="fs-6 fw-medium mb-3">Solicitar nuevo turno</h2>

        <!-- Tipo de vehículo -->
        <p class="form-label-dark mb-2">Tipo de vehículo</p>
        <div class="d-flex gap-2 mb-3 flex-wrap">
          <button
            v-for="tipo in VEHICULOS"
            :key="tipo.key"
            @click="tipoVehiculoSeleccionado = tipo.key"
            class="btn d-flex flex-column align-items-center gap-1 px-4 py-2"
            :style="tipoVehiculoSeleccionado === tipo.key
              ? 'background-color: var(--color-surface-strong); border: 2px solid var(--color-accent); border-radius: 10px; color: var(--color-text); min-width: 90px;'
              : 'background-color: var(--color-surface-alt); border: 1px solid var(--color-border); border-radius: 10px; color: var(--color-text); min-width: 90px;'"
          >
            <span style="font-size: 1.6rem; line-height: 1.2;">{{ tipo.icono }}</span>
            <span style="font-size: 0.8rem; font-weight: 500;">{{ tipo.label }}</span>
            <span style="font-size: 0.75rem; color: var(--color-accent);">$ {{ store.precios[tipo.key].toLocaleString('es-AR') }}</span>
          </button>
        </div>

        <div class="mb-3" style="max-width: 320px;">
          <label class="form-label-dark d-block mb-1">Patente del vehículo</label>
          <input
            v-model="nuevaPatente"
            type="text"
            placeholder="Ej: ABC 123 / AB 123 AB"
            class="form-control form-control-dark"
          />
          <p v-if="nuevaPatente && !patenteValida" class="mb-0 mt-1" style="color: #F09595; font-size: 0.8rem;">
            Patente inválida. Ej: ABC123 o AB123CD
          </p>
        </div>

        <p class="form-label-dark mb-2">Seleccioná un día</p>

        <WeatherGrid @seleccionar="seleccionarFecha" />

        <div class="my-3" style="max-width: 320px;">
          <label class="form-label-dark d-block mb-1">Horario</label>
          <select
            v-model="horaSeleccionada"
            class="form-select form-control-dark"
            :disabled="!fechaSeleccionada || horariosDisponibles.length === 0"
          >
            <option value="">
              {{
                !fechaSeleccionada
                  ? 'Seleccioná primero un día'
                  : horariosDisponibles.length === 0
                    ? 'No quedan horarios para ese día'
                    : 'Seleccione un horario'
              }}
            </option>
            <option v-for="hora in horariosDisponibles" :key="hora" :value="hora">
              {{ hora }}
            </option>
          </select>
        </div>

        <!-- Resumen del precio -->
        <div
          v-if="tipoVehiculoSeleccionado"
          class="d-inline-flex align-items-center gap-2 mb-3 px-3 py-2"
          style="background-color: var(--color-surface-alt); border: 1px solid var(--color-border); border-radius: 8px;"
        >
          <span style="color: var(--color-text-muted); font-size: 0.85rem;">Total a abonar:</span>
          <span style="color: var(--color-accent); font-weight: 600; font-size: 1rem;">
            $ {{ store.precios[tipoVehiculoSeleccionado].toLocaleString('es-AR') }}
          </span>
        </div>

        <div>
          <button
            @click="crearTurno"
            class="btn btn-accent"
            :disabled="!patenteValida || !fechaSeleccionada || !horaSeleccionada || !tipoVehiculoSeleccionado"
          >
            Reservar turno
          </button>
        </div>
      </div>

      <div class="card-dark p-3">
        <h2 class="fs-6 fw-medium mb-3">Mis turnos</h2>

        <ul v-if="misTurnos.length > 0" class="list-unstyled mb-0">
          <li
            v-for="turno in misTurnos"
            :key="turno.id"
            class="d-flex justify-content-between align-items-center py-2 px-2 mb-2"
            style="background-color: var(--color-surface-alt); border-radius: 8px;"
          >
            <span>
              {{ getVehiculo(turno.tipoVehiculo)?.icono }}
              <strong>{{ turno.patente }}</strong>
              <span style="color: var(--color-text-muted); font-size: 0.85rem;"> — {{ new Date(turno.fecha).toLocaleString() }}</span>
              <span v-if="turno.precio" style="color: var(--color-accent); font-size: 0.8rem; margin-left: 6px;">
                · $ {{ turno.precio.toLocaleString('es-AR') }}
              </span>
            </span>
            <span class="badge rounded-pill" :class="claseBadgeEstado(turno.estado)">
              {{ turno.estado }}
            </span>
          </li>
        </ul>
        <p v-else class="mb-0" style="color: var(--color-text-muted);">No tenés turnos registrados actualmente.</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLavaderoStore } from '../stores/lavadero'
import { useRouter } from 'vue-router'
import WeatherGrid from '../components/WeatherGrid.vue'
import { esCodigoLluvia } from '../composables/useClima'
import { VEHICULOS, getVehiculo } from '../composables/vehiculos.js'

const store = useLavaderoStore()
const router = useRouter()

const nuevaPatente = ref('')
const fechaSeleccionada = ref('')
const horaSeleccionada = ref('')
const tipoVehiculoSeleccionado = ref('')
const codigoClimaSeleccionado = ref(null)

const seleccionarFecha = ({ fecha, codigoClima }) => {
  fechaSeleccionada.value = fecha
  codigoClimaSeleccionado.value = codigoClima
  horaSeleccionada.value = ''
}

const misTurnos = computed(() =>
  store.turnos.filter((t) => t.clienteId === store.usuarioLogueado?.id)
)

const generarHorariosBase = () => {
  const horarios = []
  for (let h = 8; h <= 17; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === 17 && m > 0) break
      const hh = String(h).padStart(2, '0')
      const mm = String(m).padStart(2, '0')
      horarios.push(`${hh}:${mm}`)
    }
  }
  return horarios
}

const horariosBase = generarHorariosBase()

const fechaHoyLocal = () => {
  const hoy = new Date()
  const yyyy = hoy.getFullYear()
  const mm = String(hoy.getMonth() + 1).padStart(2, '0')
  const dd = String(hoy.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const horariosDisponibles = computed(() => {
  if (!fechaSeleccionada.value) return []

  const bloqueados = new Set()

  store.turnos
    .filter((t) => t.fecha.startsWith(fechaSeleccionada.value))
    .forEach((t) => {
      const hora = t.fecha.split('T')[1]
      const [h, m] = hora.split(':').map(Number)
      const inicioEnMinutos = h * 60 + m
      const duracion = getVehiculo(t.tipoVehiculo)?.duracion ?? 15
      const slotsOcupados = duracion / 15

      for (let i = 0; i < slotsOcupados; i++) {
        const minutoSlot = inicioEnMinutos + i * 15
        const hh = String(Math.floor(minutoSlot / 60)).padStart(2, '0')
        const mm = String(minutoSlot % 60).padStart(2, '0')
        bloqueados.add(`${hh}:${mm}`)
      }
    })

  const esHoy = fechaSeleccionada.value === fechaHoyLocal()
  const ahora = new Date()

  return horariosBase.filter((hora) => {
    if (bloqueados.has(hora)) return false

    if (esHoy) {
      const [h, m] = hora.split(':').map(Number)
      const horaSlot = new Date()
      horaSlot.setHours(h, m, 0, 0)
      if (horaSlot <= ahora) return false
    }

    return true
  })
})

const validarPatente = (patente) => {
  const textoNormalizado = patente.trim().toUpperCase().replace(/\s+/g, ' ')
  const regexPatente = /^([A-Z]{3}\s?\d{3}|[A-Z]{2}\s?\d{3}\s?[A-Z]{2})$/
  return regexPatente.test(textoNormalizado)
}

const patenteValida = computed(() => {
  if (!nuevaPatente.value) return false
  return validarPatente(nuevaPatente.value)
})

const crearTurno = () => {
  if (!nuevaPatente.value || !fechaSeleccionada.value || !horaSeleccionada.value || !tipoVehiculoSeleccionado.value) {
    alert('Por favor completa todos los campos')
    return
  }
  if (!patenteValida.value) {
    alert('Ingrese una patente válida')
    return
  }

  const fechaHora = fechaSeleccionada.value + 'T' + horaSeleccionada.value

  if (esCodigoLluvia(codigoClimaSeleccionado.value)) {
    const deseaContinuar = confirm(
      '⚠️ ¡Atención! Hay pronóstico de lluvia en Caballito para el día seleccionado.\n\n¿Deseas registrar el turno de todas formas?'
    )
    if (!deseaContinuar) return
  }

  store.agendarTurno(nuevaPatente.value, fechaHora, tipoVehiculoSeleccionado.value)
  nuevaPatente.value = ''
  fechaSeleccionada.value = ''
  horaSeleccionada.value = ''
  tipoVehiculoSeleccionado.value = ''
  codigoClimaSeleccionado.value = null
}

const claseBadgeEstado = (estado) => {
  if (estado === 'Esperando el servicio') return 'badge-espera'
  if (estado === 'En proceso de lavado') return 'badge-proceso'
  return 'badge-fin'
}

const cerrarSesion = () => {
  store.logout()
  router.push('/')
}
</script>