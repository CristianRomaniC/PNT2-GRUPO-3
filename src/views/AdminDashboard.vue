<template>
  <div class="min-vh-100 py-4 px-3" style="background-color: var(--color-bg);">
    <div class="container" style="max-width: 1000px;">

      <header class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="fs-4 fw-medium mb-0">Panel de control · Administrador</h1>
        <button @click="salir" class="btn btn-sm" style="border: 1px solid var(--color-border); color: var(--color-text-muted);">
          Cerrar sesión
        </button>
      </header>

      <!-- Tarjetas de estadísticas -->
      <div class="row g-2 mb-4">
        <div class="col-6 col-md-4 col-lg-2">
          <div class="stat-card h-100 text-center">
            <p class="stat-label mb-1">Total de turnos</p>
            <p class="stat-value stat-value-accent">{{ totalTurnos }}</p>
          </div>
        </div>

        <div class="col-6 col-md-4 col-lg-3">
          <div class="stat-card h-100 text-center">
            <p class="stat-label mb-1">Mejor cliente (último mes)</p>
            <template v-if="clienteConMasReservas">
              <p class="mb-0 fw-medium" style="font-size: 0.95rem;">{{ clienteConMasReservas.nombre }}</p>
              <p class="mb-0" style="font-size: 0.75rem; color: var(--color-violet-text);">{{ clienteConMasReservas.cantidad }} reservas</p>
              <p class="mb-0 mt-1" style="font-size: 0.8rem; color: var(--color-accent); font-weight: 600;">
                $ {{ clienteConMasReservas.importe.toLocaleString('es-AR') }}
              </p>
            </template>
            <p v-else class="mb-0" style="font-size: 0.8rem; color: var(--color-text-muted);">Sin datos</p>
          </div>
        </div>

        <div class="col-6 col-md-4 col-lg-2">
          <div class="stat-card h-100 text-center">
            <p class="stat-label mb-1">Clientes registrados</p>
            <p class="stat-value stat-value-accent">{{ totalClientes }}</p>
          </div>
        </div>

        <div class="col-6 col-md-4 col-lg-2">
          <div class="stat-card h-100 text-center">
            <p class="stat-label mb-1">Esperando</p>
            <p class="stat-value" style="color: var(--color-warning-text);">{{ esperando }}</p>
          </div>
        </div>

        <div class="col-6 col-md-4 col-lg-2">
          <div class="stat-card h-100 text-center">
            <p class="stat-label mb-1">En proceso</p>
            <p class="stat-value" style="color: var(--color-info-text);">{{ proceso }}</p>
          </div>
        </div>

        <div class="col-6 col-md-4 col-lg-2">
          <div class="stat-card h-100 text-center">
            <p class="stat-label mb-1">Finalizados</p>
            <p class="stat-value" style="color: var(--color-success-text);">{{ finalizados }}</p>
          </div>
        </div>
      </div>

      <!-- Sección de precios -->
      <div class="card-dark p-3 mb-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="fs-6 fw-medium mb-0">Precios por tipo de vehículo</h2>
          <div class="d-flex gap-2">
            <button
              v-if="!editandoPrecios"
              @click="abrirEdicionPrecios"
              class="btn btn-sm"
              style="border: 1px solid var(--color-border); color: var(--color-text);"
            >
              Editar precios
            </button>
            <template v-else>
              <button @click="guardarPrecios" class="btn btn-accent btn-sm">Guardar</button>
              <button
                @click="cancelarEdicionPrecios"
                class="btn btn-sm"
                style="border: 1px solid var(--color-border); color: var(--color-text-muted);"
              >
                Cancelar
              </button>
            </template>
          </div>
        </div>

        <div class="d-flex gap-3 flex-wrap">
          <div
            v-for="tipo in VEHICULOS"
            :key="tipo.key"
            class="d-flex flex-column align-items-center gap-1 px-4 py-3"
            style="background-color: var(--color-surface-alt); border: 1px solid var(--color-border); border-radius: 10px; min-width: 120px;"
          >
            <span style="font-size: 1.8rem;">{{ tipo.icono }}</span>
            <span style="font-size: 0.8rem; color: var(--color-text-muted);">{{ tipo.label }}</span>
            <template v-if="editandoPrecios">
              <div class="input-group input-group-sm mt-1" style="max-width: 130px;">
                <span class="input-group-text" style="background: var(--color-surface-strong); border-color: var(--color-border); color: var(--color-text-muted);">$</span>
                <input
                  v-model.number="preciosEditados[tipo.key]"
                  type="number"
                  min="0"
                  class="form-control form-control-dark"
                  style="border-left: none;"
                />
              </div>
            </template>
            <span v-else style="font-size: 1rem; font-weight: 600; color: var(--color-accent);">
              $ {{ store.precios[tipo.key].toLocaleString('es-AR') }}
            </span>
          </div>
        </div>
      </div>

      <!-- Tabla de turnos -->
      <div class="table-responsive table-dark-contrast mb-5">
        <table class="table mb-0" style="table-layout: fixed;">
          <colgroup>
            <col style="width: 18%;"><col style="width: 11%;"><col style="width: 11%;"><col style="width: 20%;"><col style="width: 16%;"><col style="width: 24%;">
          </colgroup>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Vehículo</th>
              <th>Patente</th>
              <th>Fecha/Hora</th>
              <th>Estado actual</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="turno in store.turnos" :key="turno.id" :class="claseFilaEstado(turno.estado)">
              <td>{{ turno.nombreCliente }}</td>
              <td>{{ getVehiculo(turno.tipoVehiculo)?.icono }} {{ getVehiculo(turno.tipoVehiculo)?.label }}</td>
              <td class="fw-medium">{{ turno.patente }}</td>
              <td style="color: var(--color-text-muted);">{{ new Date(turno.fecha).toLocaleString() }}</td>
              <td>
                <span class="badge rounded-pill" :class="claseBadgeEstado(turno.estado)">{{ turno.estado }}</span>
              </td>
              <td>
                <button
                  v-if="turno.estado === 'Esperando el servicio'"
                  @click="cambiar(turno.id, 'En proceso de lavado')"
                  class="btn btn-accent btn-sm"
                >
                  Iniciar lavado
                </button>
                <button
                  v-if="turno.estado === 'En proceso de lavado'"
                  @click="cambiar(turno.id, 'Lavado finalizado')"
                  class="btn btn-accent btn-sm"
                >
                  Finalizar
                </button>
                <span v-if="turno.estado === 'Lavado finalizado'" style="color: var(--color-accent); font-size: 0.85rem;">
                  ✓ Listo
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="store.turnos.length === 0" class="text-center py-4" style="color: var(--color-text-muted);">
          No hay turnos registrados en el sistema.
        </div>
      </div>

      <!-- Gestión de usuarios -->
      <section class="card-dark p-3">
        <h2 class="fs-5 fw-medium mb-3">Gestión de usuarios registrados</h2>

        <div class="table-responsive table-dark-contrast">
          <table class="table mb-0">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Contraseña</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in store.usuarios" :key="u.id">
                <td>{{ u.nombre }}</td>
                <td style="color: var(--color-text-muted);">{{ u.email }}</td>
                <td style="color: var(--color-text-muted);">{{ u.password }}</td>
                <td>
                  <span class="badge rounded-pill" :class="u.rol === 'admin' ? 'badge-espera' : 'badge-proceso'">
                    {{ u.rol.toUpperCase() }}
                  </span>
                </td>
                <td>
                  <div class="d-flex flex-wrap gap-1">
                    <button
                      @click="prepararEdicion(u)"
                      class="btn btn-sm"
                      style="border: 1px solid var(--color-border); color: var(--color-text);"
                    >
                      Editar
                    </button>
                    <button
                      v-if="u.rol !== 'admin'"
                    @click="store.eliminarTurnosDeCliente(u.id)"
                      class="btn btn-sm"
                      style="border: 1px solid var(--color-warning-text); color: var(--color-warning-text);"
                    >
                      Borrar turnos
                    </button>
                    <button
                      v-if="u.id !== store.usuarioLogueado?.id"
                      @click="store.eliminarUsuario(u.id)"
                      class="btn btn-sm"
                      style="background-color: #501313; color: #F7C1C1; border: none;"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLavaderoStore } from '../stores/lavadero'
import { useRouter } from 'vue-router'
import { VEHICULOS, getVehiculo } from '../composables/vehiculos.js'

const store = useLavaderoStore()
const router = useRouter()

// Edición de precios
const editandoPrecios = ref(false)
const preciosEditados = ref({ moto: 0, auto: 0, camioneta: 0 })

const abrirEdicionPrecios = () => {
  preciosEditados.value = { ...store.precios }
  editandoPrecios.value = true
}
const guardarPrecios = () => {
  store.actualizarPrecios({ ...preciosEditados.value })
  editandoPrecios.value = false
}
const cancelarEdicionPrecios = () => {
  editandoPrecios.value = false
}

// Mejor cliente del último mes
const clienteConMasReservas = computed(() => {
  const ahora = new Date()
  const hace30Dias = new Date(ahora)
  hace30Dias.setDate(ahora.getDate() - 30)

  const turnosUltimoMes = store.turnos.filter(t => new Date(t.fecha) >= hace30Dias)
  if (turnosUltimoMes.length === 0) return null

  const resumen = {}
  turnosUltimoMes.forEach(turno => {
    if (!resumen[turno.clienteId]) resumen[turno.clienteId] = { cantidad: 0, importe: 0 }
    resumen[turno.clienteId].cantidad++
    resumen[turno.clienteId].importe += turno.precio || 0
  })

  let mejorId = null
  let maxCantidad = 0
  for (const id in resumen) {
    if (resumen[id].cantidad > maxCantidad) {
      maxCantidad = resumen[id].cantidad
      mejorId = Number(id)
    }
  }

  const cliente = store.usuarios.find(u => u.id === mejorId)
  if (!cliente) return null

  return {
    nombre: cliente.nombre,
    cantidad: resumen[mejorId].cantidad,
    importe: resumen[mejorId].importe,
  }
})

// Estadísticas generales
const totalTurnos = computed(() => store.turnos.length)
const totalClientes = computed(() => store.usuarios.filter(u => u.rol === 'user').length)
const esperando = computed(() => store.turnos.filter(t => t.estado === 'Esperando el servicio').length)
const proceso = computed(() => store.turnos.filter(t => t.estado === 'En proceso de lavado').length)
const finalizados = computed(() => store.turnos.filter(t => t.estado === 'Lavado finalizado').length)

// Acciones
const cambiar = (id, nuevoEstado) => store.actualizarEstadoTurno(id, nuevoEstado)

const salir = () => {
  store.logout()
  router.push('/')
}

const claseFilaEstado = (estado) => {
  if (estado === 'Esperando el servicio') return 'row-espera'
  if (estado === 'En proceso de lavado') return 'row-proceso'
  return 'row-fin'
}

const claseBadgeEstado = (estado) => {
  if (estado === 'Esperando el servicio') return 'badge-espera'
  if (estado === 'En proceso de lavado') return 'badge-proceso'
  return 'badge-fin'
}

const prepararEdicion = (usuario) => {
  const nuevoNombre = prompt('Editar nombre de ' + usuario.nombre + ':', usuario.nombre)
  if (nuevoNombre !== null && nuevoNombre.trim() !== '') {
    store.editarUsuario(usuario.id, nuevoNombre)
  }
}
</script>