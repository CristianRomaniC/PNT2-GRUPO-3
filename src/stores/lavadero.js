import { defineStore } from 'pinia'

export const useLavaderoStore = defineStore('lavadero', {
  state: () => ({
    usuarioLogueado: null,
    usuarios: [
      { id: 1, email: 'admin@test.com', password: '123', rol: 'admin', nombre: 'Admin Lavadero' },
      { id: 2, email: 'cliente@test.com', password: '123', rol: 'user', nombre: 'Juan Perez' },
    ],
    turnos: [],
    precios: {
      moto: 5000,
      auto: 8000,
      camioneta: 12000,
    },
  }),
  
  actions: {
    login(email, password) {
      const user = this.usuarios.find((u) => u.email === email && u.password === password)
      let estaLogueado = false
      if (user) {
        this.usuarioLogueado = user
        estaLogueado = true
      }
      return estaLogueado
    },

    registrarse(nombre, email, password) {
      const existe = this.usuarios.find((u) => u.email === email)
      if (existe) return false

      const nuevoUsuario = {
        id: Date.now(),
        email: email,
        password: password,
        rol: 'user',
        nombre: nombre,
      }

      this.usuarios.push(nuevoUsuario)
      return true
    },

    logout() {
      this.usuarioLogueado = null
    },

    agendarTurno(patente, fecha, tipoVehiculo) {
      if (!this.usuarioLogueado) return

      const nuevoTurno = {
        id: Date.now(),
        clienteId: this.usuarioLogueado.id,
        nombreCliente: this.usuarioLogueado.nombre,
        patente: patente.toUpperCase(),
        fecha: fecha,
        tipoVehiculo: tipoVehiculo,
        precio: this.precios[tipoVehiculo],
        estado: 'Esperando el servicio',
      }
      this.turnos.push(nuevoTurno)
    },

    actualizarEstadoTurno(turnoId, nuevoEstado) {
      const turno = this.turnos.find((t) => t.id === turnoId)
      if (turno) {
        turno.estado = nuevoEstado
      }
    },

    editarUsuario(id, nuevoNombre) {
      const usuario = this.usuarios.find(u => u.id === id)
      if (usuario) {
        usuario.nombre = nuevoNombre
      }
    },

    eliminarUsuario(id) {
      if (this.usuarioLogueado && this.usuarioLogueado.id === id) {
        alert("No puedes eliminar tu propia cuenta de administrador.")
        return
      }
      
      if (confirm("¿Estás seguro de eliminar este usuario? También se perderán sus turnos.")) {
        this.usuarios = this.usuarios.filter(u => u.id !== id)
        this.turnos = this.turnos.filter(t => t.clienteId !== id)
      }
    },

    actualizarPrecios(nuevosPrecios) {
      this.precios = { ...this.precios, ...nuevosPrecios }
    },
  },
  
  persist: true,
})