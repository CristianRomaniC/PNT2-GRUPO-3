<template>
  <div class="admin-container">
    <header>
      <h1>Panel de Control - Administrador</h1>
      <button @click="salir">Cerrar Sesión</button>
    </header>

    <div class="card-estadistica">

      <div class="card">
        <h3>📅 Total de turnos</h3>
        <p>{{ totalTurnos }}</p>
      </div>

      <div class="card">
        <h3>🏆 Mejor Cliente</h3>
        <p v-if="clienteConMasReservas">
          <strong>{{ clienteConMasReservas.nombre }}</strong>
          <br>
          {{ clienteConMasReservas.cantidad }} reservas
        </p>

        <p v-else>
          No hay reservas registradas.
        </p>
      </div>

      <div class="card">
        <h3>👥 Clientes registrados</h3>
        <p>{{ totalClientes }}</p>
      </div>

      <div class="card">
          <h3>⏳ Esperando</h3>
          <p>{{ esperando }}</p>
        </div>

        <div class="card">
          <h3>🔄 En proceso</h3>
          <p>{{ proceso }}</p>
        </div>

        <div class="card">
          <h3>✅ Finalizados</h3>
          <p>{{ finalizados }}</p>
        </div>



    </div>

    <section class="estadisticas">
      <p>
        Total de servicios hoy: <strong>{{ store.turnos.length }}</strong>
      </p>
    </section>

    <table border="1" style="width: 100%; text-align: left; border-collapse: collapse">
      <thead style="background-color: #f2f2f2">
        <tr>
          <th>Cliente</th>
          <th>Patente</th>
          <th>Fecha/Hora</th>
          <th>Estado Actual</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="turno in store.turnos" :key="turno.id">
          <td>{{ turno.nombreCliente }}</td>
          <td>
            <strong>{{ turno.patente }}</strong>
          </td>
          <td>{{ new Date(turno.fecha).toLocaleString() }}</td>
          <td>
            <span :class="claseEstado(turno.estado)">{{ turno.estado }}</span>
          </td>
          <td>
            <!-- Botones para cambiar el estado -->
            <button v-if="turno.estado === 'Esperando el servicio'" @click="cambiar(turno.id, 'En proceso de lavado')"
              class="btn-proceso">
              Iniciar Lavado
            </button>

            <button v-if="turno.estado === 'En proceso de lavado'" @click="cambiar(turno.id, 'Lavado finalizado')"
              class="btn-fin">
              Finalizar
            </button>

            <span v-if="turno.estado === 'Lavado finalizado'">✅ Listo</span>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="store.turnos.length === 0" style="text-align: center; margin-top: 20px">
      No hay turnos registrados en el sistema.
    </div>
  </div>

  <hr style="margin: 40px 0" />

  <section style="background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
    <h2 style="color: #2c3e50;"> Gestión de Usuarios Registrados</h2>

    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <thead>
        <tr style="background: #f4f4f4; text-align: left;">
          <th style="padding: 10px; border-bottom: 2px solid #ddd;">Nombre</th>
          <th style="padding: 10px; border-bottom: 2px solid #ddd;">Email</th>
          <th style="padding: 10px; border-bottom: 2px solid #ddd;">Rol</th>
          <th style="padding: 10px; border-bottom: 2px solid #ddd;">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in store.usuarios" :key="u.id">
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            {{ u.nombre }}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">{{ u.email }}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <span :style="{ color: u.rol === 'admin' ? 'red' : 'blue', fontWeight: 'bold' }">
              {{ u.rol.toUpperCase() }}
            </span>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <!-- Botón Editar -->
            <button @click="prepararEdicion(u)"
              style="background: #f39c12; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">
              Editar
            </button>

            <!-- Botón Eliminar (solo si no es el admin actual) -->
            <button v-if="u.id !== store.usuarioLogueado?.id" @click="store.eliminarUsuario(u.id)"
              style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useLavaderoStore } from '../stores/lavadero'
import { useRouter } from 'vue-router'




const store = useLavaderoStore()
const router = useRouter()

//Propiedades computadas
// Calcula qué cliente tiene la mayor cantidad de reservas
const clienteConMasReservas = computed(() => {
  // Objeto para contar las reservas de cada cliente
  const contador = {}
  // Recorremos todos los turnos
  store.turnos.forEach(turno => {
    // Si el cliente no existe en el contador, lo inicializamos en 0
    if (!contador[turno.clienteId]) {
      contador[turno.clienteId] = 0
    }
    // Sumamos una reserva
    contador[turno.clienteId]++
  })
  let clienteId = null
  let maxReservas = 0

  // Buscamos el cliente con más reservas
  for (const id in contador) {
    if (contador[id] > maxReservas) {
      maxReservas = contador[id]
      clienteId = Number(id)
    }
  }
  // Buscamos el usuario correspondiente
  const cliente = store.usuarios.find(u => u.id === clienteId)
  if (!cliente) return null
  return {
    nombre: cliente.nombre,
    cantidad: maxReservas
  }
})

// Calcula el total de turnos
const totalTurnos = computed(() => {
  return store.turnos.length
})

// Calcula el total de clientes
const totalClientes = computed(() => {
  return store.usuarios.filter(u => u.rol === "user").length
})


const cambiar = (id, nuevoEstado) => {
  store.actualizarEstadoTurno(id, nuevoEstado)
}

const salir = () => {
  store.logout()
  router.push('/')
}

// Función simple para dar color según el estado
const claseEstado = (estado) => {
  if (estado === 'Esperando el servicio') return 'txt-espera'
  if (estado === 'En proceso de lavado') return 'txt-proceso'
  return 'txt-fin'
}


const esperando = computed(() => {
  return store.turnos.filter(
    t => t.estado === "Esperando el servicio"
  ).length
})

const proceso = computed(() => {
  return store.turnos.filter(
    t => t.estado === "En proceso de lavado"
  ).length
})

const finalizados = computed(() => {
  return store.turnos.filter(
    t => t.estado === "Lavado finalizado"
  ).length
})

const prepararEdicion = (usuario) => {
  const nuevoNombre = prompt("Editar nombre de " + usuario.nombre + ":", usuario.nombre)

  if (nuevoNombre !== null && nuevoNombre.trim() !== "") {
    store.editarUsuario(usuario.id, nuevoNombre)
  }
}

window.addEventListener('storage', () => {
  location.reload()
})
</script>

<style scoped>
.admin-container {
  padding: 20px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

table th,
table td {
  padding: 12px;
  border: 1px solid #ddd;
}

.btn-proceso {
  background: #3498db;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.btn-fin {
  background: #2ecc71;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.txt-espera {
  color: #f39c12;
  font-weight: bold;
}

.txt-proceso {
  color: #3498db;
  font-weight: bold;
}

.txt-fin {
  color: #2ecc71;
  font-weight: bold;
}

.card-estadistica {
    display: grid;

  grid-template-columns: repeat(auto-fit, minmax(220px,1fr));

  gap:20px;

  margin-bottom:30px;
}

.card{

  background:white;

  border-radius:10px;

  padding:20px;

  text-align:center;

  box-shadow:0 2px 8px rgba(0,0,0,.1);

}
</style>
