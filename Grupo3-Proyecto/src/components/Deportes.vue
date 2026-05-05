<template>
    <div class="deportes">
    
        <h2>Lista de Deportes</h2>
        <p v-if="isLoading" class="loading">Cargando deportes...</p>
        <div v-else-if="isError" class="error-box">
            <p>Hubo un problema al cargar los datos.</p>
            <button @click="recargar">Reintentar</button>
        </div>
    
        <div v-else>
            <div class="controles">
                <input v-model="searchQuery" placeholder="Buscar por nombre o categoría..." />
                <button @click="quitarUltimo" :disabled="deportes.length === 0">
                Quitar último deporte
            </button>
            </div>
            <div class="filtros">
                <span>Filtrar por categoría:</span>
                <button :class="{ active: categoriaSeleccionada === '' }" @click="categoriaSeleccionada = ''">Todas
            </button>
                <button v-for="categoria in categoriasUnicas" :key="categoria" :class="{ active: categoriaSeleccionada === categoria }" @click="categoriaSeleccionada = categoria">
                {{ categoria }}
            </button>
            </div>
            <h3>Deportes encontrados: {{ deportesFiltrados.length }}</h3>
            <ul>
                <li v-for="deporte in deportesFiltrados" :key="deporte.id">
                    <span>{{ deporte.name }} <small>{{ deporte.category }}</small></span>
                </li>
            </ul>
        </div>
    
    </div>
</template>

<script setup>
    import { ref, computed, onMounted } from 'vue'

    const deportes = ref([])
    const searchQuery = ref('')
    const categoriaSeleccionada = ref('')
    const isLoading = ref(false)
    const isError = ref(false)
    const fetchDeportes = async () => {
        
    try {
        isError.value = false
        isLoading.value = true
        const response = await fetch('https://www.mockachino.com/2b19cd5b-49e3-48/deportes')
        const data = await response.json()
        await new Promise(resolve => setTimeout(resolve, 2000))
        deportes.value = data.deportes.map((deporte, index) => ({
            id: index,
            name: deporte.Nombre,
            category: deporte.Categoria
        }))
    } catch (error) {
        console.error('Error fetching deportes:', error)
        isError.value = true
    } finally {
        isLoading.value = false
    }
}

const categoriasUnicas = computed(() => [
    ...new Set(deportes.value.map(deporte => deporte.category))
])

const deportesFiltrados = computed(() => {
    const term = searchQuery.value.trim().toLowerCase()
    return deportes.value.filter(deporte => {
        const matchesSearch = !term ||
            deporte.name.toLowerCase().includes(term) ||
            deporte.category.toLowerCase().includes(term)

        const matchesCategory = !categoriaSeleccionada.value || deporte.category === categoriaSeleccionada.value

        return matchesSearch && matchesCategory
    })
})

const quitarUltimo = () => {
    if (deportes.value.length > 0) {
        deportes.value.pop()
    }
}

const recargar = () => fetchDeportes()

onMounted(() => {
    fetchDeportes()
})
</script>

<style scoped>
.deportes {
    max-width: 700px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f0f0f0;
    border-radius: 10px;
    border: 1px solid #ddd;
}

.loading {
    color: #333;
    margin-bottom: 16px;
}

.error-box {
    background: #ffe4e6;
    border: 1px solid #f5c2c7;
    padding: 16px;
    margin-bottom: 16px;
}

.controles,
.filtros {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 16px;
    align-items: center;
}

input {
    flex: 1;
    min-width: 220px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
}

button {
    padding: 8px 14px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    background: #1976d2;
    color: white;
}

button:hover {
    opacity: 0.9;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

button.active {
    background: #0d47a1;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    padding: 12px 10px;
    border-bottom: 1px solid #eee;
}

li small {
    color: #555;
    margin-left: 10px;
}
</style>


