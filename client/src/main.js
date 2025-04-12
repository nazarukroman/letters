import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Material from '@primeuix/themes/material';
import Nora from '@primeuix/themes/nora';

import App from './App.vue';

createApp(App)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
    },
  })
  .mount('#app');
