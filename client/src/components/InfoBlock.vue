<script setup>
import { words } from '@/stores/words.js';
</script>

<template>
  <article id="info" class="info">
    <ul class="word-list" v-if="words.length > 0">
      <li class="word-list-item" v-for="cell of words">
        <span class="word">
          {{ cell.word }}
        </span>
        <sup class="gender">{{ cell.gender }}</sup>
      </li>
    </ul>
  </article>
</template>

<style>
.info {
  display: flex;
  flex-wrap: wrap;
  max-height: 320px;
  overflow-y: auto;
  gap: 1rem;
}

.word-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  column-gap: 1.7rem;
  width: 100%;
  list-style: none;
  margin: 0 auto;
  padding: 8px 0;
}

.word-list-item {
  break-inside: avoid;
  line-height: 1.5;
}

.word {
  font-size: 20px;
  font-weight: bold;
  color: var(--text-color);
}

.gender {
  color: var(--secondary-color);
  font-size: smaller;
  font-style: italic;
  margin-left: 0.2rem;
}
</style>
