<script setup>
import { onMounted } from 'vue';
import Button from '@/components/Button.vue';
import { STATE_TYPE } from '@/types.js';

const emit = defineEmits(['close', 'markLetter']);

defineProps({
  contextMenu: { open: Boolean, rawIndex: Number, cellIndex: Number },
});

onMounted(() => {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      emit('close');
    }
  });
});

function handleClose(event) {
  if (event.target === event.currentTarget) {
    emit('close');
  }
}
</script>

<template>
  <div class="overlay" :class="{ 'overlay--closed': !contextMenu.open }" @click="handleClose">
    <div class="popup">
      <Button @click="emit('markLetter', STATE_TYPE.CORRECT)">На текущей позиции</Button>
      <Button variant="secondary" @click="emit('markLetter', STATE_TYPE.PRESENT)"
        >На другой позиции</Button
      >
      <Button variant="gray" @click="emit('markLetter', STATE_TYPE.ABSENT)">Нет</Button>
    </div>
  </div>
</template>

<style>
.overlay {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay--closed {
  display: none;
}

.popup {
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
  gap: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  padding: 16px;
}
</style>
