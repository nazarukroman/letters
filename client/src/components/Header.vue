<script setup>
import { ref, toRaw } from 'vue';
import Button from '@/components/Button.vue';
import { apiService } from '@/api/service.js';
import { words } from '@/stores/words.js';
import { keyboard } from '@/stores/keyboard.js';

const loading = ref(false);

async function fetchRandomWords() {
  loading.value = true;
  const response = await apiService.getRandomWords(toRaw(keyboard));
  loading.value = false;

  if (!response.isOk) {
    return;
  }

  words.value = response.data;
}

async function fetchUniqueWords() {
  loading.value = true;
  const response = await apiService.getUniqueWords(toRaw(keyboard));
  loading.value = false;

  if (!response.isOk) {
    return;
  }

  words.value = response.data;
}
</script>

<template>
  <header class="header">
    <Button size="small" variant="secondary" @click="fetchUniqueWords" :disabled="loading"
      >Слова без повторов</Button
    >
    <Button size="small" variant="secondary" @click="fetchRandomWords" :disabled="loading"
      >Найти слова</Button
    >
  </header>
</template>

<style>
.header {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
