<template>
    <div class="weather-grid">

        <div v-for="dia in dias" :key="dia.fecha" class="weather-card"
            :class="{ seleccionado: fechaSeleccionada === dia.fechaCompleta }" @click="seleccionarDia(dia.fechaCompleta)">
            <h5>{{ dia.dia }}</h5>

            <div class="icono">
                {{ dia.icono }}
            </div>

            <p>{{ dia.temperatura }}°C</p>
            <small>{{ dia.fecha }}</small>

        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['seleccionar'])

const fechaSeleccionada = ref('')

const dias = ref([])

const seleccionarDia = (fecha) => {

    fechaSeleccionada.value = fecha

    emit('seleccionar', fecha)

}

const cargarClima = async () => {

    // Coordenadas de Caballito
    const lat = -34.6186
    const lon = -58.4418

    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max&forecast_days=7&timezone=America/Argentina/Buenos_Aires`

    const respuesta = await fetch(url)

    const datos = await respuesta.json()

    dias.value = datos.daily.time.map((fecha, index) => ({

        fechaCompleta: fecha,

        // Nombre del día (lun, mar, mié...)
        dia: new Date(fecha + "T00:00:00").toLocaleDateString('es-AR', {
            weekday: 'short'
        }),

        // Fecha corta (17/06)
        fecha: new Date(fecha + "T00:00:00").toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit'
        }),

        temperatura: datos.daily.temperature_2m_max[index],

        icono: obtenerIcono(datos.daily.weather_code[index])

    }))



}

const obtenerIcono = (codigo) => {

    if (codigo === 0)
        return "☀️"

    if ([1, 2, 3].includes(codigo))
        return "☁️"

    if ([51, 53, 55, 61, 63, 65, 66, 67, 80, 81, 82].includes(codigo))
        return "🌧️"

    return "⛅"

}

onMounted(() => {

cargarClima()

})



</script>

<style scoped>
.weather-grid {

    display: grid;

    grid-template-columns: repeat(4, 1fr);

    gap: 15px;

}

.weather-card {

    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    cursor: pointer;
    transition: .3s;
    background: white;
}

.weather-card:hover {

    transform: scale(1.05);
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);

}

.seleccionado {

    border: 3px solid #0d6efd;

}

.icono {

    font-size: 40px;

}
</style>