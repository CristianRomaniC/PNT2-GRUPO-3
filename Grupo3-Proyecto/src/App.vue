<template>
  <div id="app">
    <nav class="sidebar">
      <h2>Trabajo practico PNT2</h2>
      <h3>Componentes:</h3>
      <ul>
        <li v-for="item in menuItems" :key="item.path">
          <router-link :to="item.path">{{ item.name }}</router-link>
        </li>
      </ul>
    </nav>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// Aquí definimos la lista de componentes de nuestro catálogo
const menuItems = [
  { name: 'Inicio (Base)', path: '/' },
  { name: 'Componente de prueba Nicolas', path: '/tarjeta' },
  //{ name: 'Componente 3', path: '/comp-3' },
  //{ name: 'Componente 4', path: '/comp-4' }
];
</script>

<style scoped>
/* Estilos sencillos para que se vea ordenado */
#app { display: flex; font-family: 'Segoe UI', sans-serif; }
.sidebar { width: 250px; padding: 20px; border-right: 2px solid #eee; height: 100vh; }
.sidebar ul { list-style: none; padding: 0; }
.sidebar li { margin-bottom: 10px; }
.sidebar ul li a {
  display: block; /* Para que el botón ocupe todo el ancho */
  text-align: center;
  padding: 12px 20px;
  margin: 10px 0;
  background-color: #f0f0f0; /* Color gris suave */
  color: #333;
  text-decoration: none;
  border-radius: 8px; /* Bordes redondeados */
  transition: all 0.3s ease; /* Suaviza el cambio al pasar el mouse */
  font-weight: 500;
}

/* Efecto al pasar el mouse */
.sidebar ul li a:hover {
  background-color: #42b983;
  color: white;
  transform: translateY(-2px); /* Un pequeño salto hacia arriba */
}

/* Estilo cuando el botón está "activo" (es decir, cuando estás en esa página) */
.router-link-active {
  background-color: #42b983 !important;
  color: white !important;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.content { padding: 40px; flex-grow: 1; }
.router-link-active { color: #42b983; font-weight: bold; border-left: 4px solid #42b983; padding-left: 10px; }
</style>