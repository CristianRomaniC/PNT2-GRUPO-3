<template>
  <div class="tarjeta">
    <h2>Mi Perfil Profesional</h2>
    
    <p v-if="loading">Cargando mis habilidades desde el servidor...</p>

    <div v-else>
      <p>Habilidades actuales:</p>
      <ul>
        <li v-for="skill in skills" :key="skill.id">
          {{ skill.name }} - <strong>{{ skill.level }}</strong>
        </li>
      </ul>

      <div class="stats">
        <p>Total de habilidades: {{ totalSkills }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 1. Estados
const skills = ref([]);
const loading = ref(true);

// 2. Promesa: Simulamos una petición a una API (Node.js)
const fetchSkills = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Vue.js', level: 'Principiante' },
        { id: 2, name: 'Node.js', level: 'Intermedio' },
        { id: 3, name: 'CSS/HTML', level: 'Experto' }
      ]);
    }, 4500); // Simulamos 1.5 segundos de espera
  });
};

// 3. Ejecutar promesa al montar el componente
onMounted(async () => {
  skills.value = await fetchSkills();
  loading.value = false;
});

// 4. Propiedad Computada: Calcula algo basado en los datos
const totalSkills = computed(() => {
  return skills.value.length;
});
</script>

<style scoped>
.tarjeta { padding: 20px; background-color: #f0f0f0; border-radius: 10px; border: 1px solid #ddd; }
.stats { margin-top: 15px; font-weight: bold; color: #42b983; }
</style>