<template>
  <div class="flex flex-col justify-center items-center h-screen bg-gray-900">
    <div v-for="(key, index) in keyboard" :key="index" class="flex items-center justify-center">
      <Keyboard :keyboard="key" />
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import Keyboard from './components/Keyboard.vue';

export default {
  name: 'App',
  components: { Keyboard },
  setup() {
    const keyboard = ref(
      Array(6)
        .fill()
        .map(() =>
          Array(5)
            .fill()
            .map(() => ({ letter: '', state: 'empty' })),
        ),
    );

    onMounted(() => {});

    return {
      keyboard,
    };
  },
};
</script>
