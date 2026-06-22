<template>
    <div class="row row-cols-2 row-cols-md-4 g-2">

        <div v-for="dia in dias" :key="dia.fecha" class="col">
            <div
                class="weather-card text-center h-100"
                :class="{ seleccionado: fechaSeleccionada === dia.fechaCompleta }"
                @click="seleccionarDia(dia)"
            >
                <p class="mb-1 text-capitalize" style="font-size: 0.85rem; color: var(--color-text-muted);">{{ dia.dia }}</p>

                <div class="icono">
                    {{ dia.icono }}
                </div>

                <p class="mb-0 fw-medium">{{ dia.temperatura }}°C</p>
                <small style="color: var(--color-text-muted);">{{ dia.fecha }}</small>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { obtenerPronostico, obtenerIconoClima } from '../composables/useClima'

const emit = defineEmits(['seleccionar'])

const fechaSeleccionada = ref('')

const dias = ref([])

const seleccionarDia = (dia) => {

    fechaSeleccionada.value = dia.fechaCompleta

    // Le pasamos al padre la fecha Y el código de clima de ese día,
    // así no tiene que volver a consultar la API para saber si llueve.
    emit('seleccionar', { fecha: dia.fechaCompleta, codigoClima: dia.codigoClima })

}

const cargarClima = async () => {

    const datos = await obtenerPronostico({ dias: 7 })

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

        codigoClima: datos.daily.weather_code[index],

        icono: obtenerIconoClima(datos.daily.weather_code[index])

    }))

}

onMounted(() => {

cargarClima()

})

</script>

<style scoped>
.weather-card {
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 12px 8px;
    cursor: pointer;
    transition: border-color .2s, transform .2s;
    background: var(--color-surface);
}

.weather-card:hover {
    transform: scale(1.03);
    border-color: var(--color-border-strong);
}

.seleccionado {
    border: 2px solid var(--color-accent);
}

.icono {
    font-size: 32px;
    line-height: 1.2;
}
</style>