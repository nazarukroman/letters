<template>
  <div class="grid gap-2 p-2 rounded-lg" style="grid-template-columns: repeat(5, 60px)">
    <input
      v-for="(key, index) in keyboard"
      :key="index"
      :ref="(el) => setInputRef(index, el)"
      v-model="key.letter"
      maxlength="1"
      class="w-12 h-12 text-2xl font-bold uppercase text-center rounded"
      :class="getKeyClass(key)"
      @input="handleInput(index, $event)"
      @keydown="handleKeydown(index, $event)"
    />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'Keyboard',
  props: {
    keyboard: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const inputs = ref([]);

    const setInputRef = (index, el) => {
      inputs.value[index] = el;
    };

    const getKeyClass = (key) => {
      const state = key.state;

      return {
        'bg-green-500 text-white border-green-500': state === 'correct',
        'bg-yellow-500 text-white border-yellow-500': state === 'present',
        'bg-gray-500 text-white border-gray-500': state === 'absent',
        'bg-white': state === 'filled',
        'bg-gray-100': state === 'empty',
      };
    };

    const handleInput = (index, event) => {
      const value = event.target.value.toUpperCase();
      if (/^[А-Я]$/.test(value) || value === '') {
        props.keyboard[index].letter = value;
      } else {
        event.target.value = props.keyboard[index].letter;
      }
      if (value && index < props.keyboard.length - 1) {
        inputs.value[index + 1]?.focus();
      }
    };

    const handleKeydown = (index, event) => {
      if (event.key === 'Backspace' && !props.keyboard[index].letter && index > 0) {
        inputs.value[index - 1]?.focus();
      }
      if (event.key === 'ArrowRight' && index < props.keyboard.length - 1) {
        inputs.value[index + 1]?.focus();
      }
      if (event.key === 'ArrowLeft' && index > 0) {
        inputs.value[index - 1]?.focus();
      }
    };

    onMounted(() => {
      inputs.value = inputs.value.filter(Boolean);
    });

    return {
      setInputRef,
      getKeyClass,
      handleInput,
      handleKeydown,
    };
  },
});
</script>
