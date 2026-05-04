
import { createRouter, createWebHistory } from 'vue-router';
// Importamos el componente que acabamos de crear
import ComponenteBase from '../components/ComponenteBase.vue';
import TarjetaPresentacion from '../components/TarjetaPresentacion.vue';

const routes = [
  { path: '/', component: ComponenteBase },
  { path: '/tarjeta', component: TarjetaPresentacion },
  //{ path: '/comp-3', component: Componente3 },
  //{ path: '/comp-4', component: Componente4 },
  // Un extra: si alguien entra a la raíz '/', redirigimos a la tarjeta
  //{ path: '/', redirect: '/tarjeta' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;