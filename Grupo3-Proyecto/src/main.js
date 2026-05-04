import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importamos el archivo que creamos

const app = createApp(App);

app.use(router); // <-- Aquí le decimos a Vue que use el router
app.mount('#app');