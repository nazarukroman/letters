<script setup>
import { ref } from 'vue';
import { keyboard } from '@/stores/keyboard.js';
import { STATE_TYPE } from '@/types.js';

const emit = defineEmits(['contextmenu']);

const CYRILLIC_REGEXP = /^[А-ЯЁ]$/;
const inputs = ref([]);

function findIndex(element) {
  return inputs.value.findIndex((index) => index === element);
}

function focusSibling(element, offset) {
  const index = findIndex(element);

  if (index < 0) {
    return;
  }

  const sibling = inputs.value[index + offset];

  if (sibling) {
    sibling.focus();
  }
}

function normalizeLetter(value) {
  const preparedValue = value.slice(-1).toUpperCase();

  return CYRILLIC_REGEXP.test(preparedValue) ? preparedValue : '';
}

function handleInput(rowIndex, cellIndex, event) {
  const element = event.currentTarget;
  const cell = keyboard[rowIndex][cellIndex];
  const letter = normalizeLetter(element.value);

  cell.letter = letter;
  cell.state = letter ? STATE_TYPE.FILLED : STATE_TYPE.EMPTY;

  if (letter) {
    focusSibling(element, 1);
  }
}

function handleBackspace(rowIndex, cellIndex, event) {
  const element = event.currentTarget;
  const cell = keyboard[rowIndex][cellIndex];

  cell.letter = '';
  cell.state = STATE_TYPE.EMPTY;

  focusSibling(element, -1);
}

function handleRight(event) {
  focusSibling(event.currentTarget, 1);
}

function handleLeft(event) {
  focusSibling(event.currentTarget, -1);
}

function handleContextMenu(rowIndex, cellIndex, event) {
  const element = event.currentTarget;

  if (!element.value) {
    return;
  }

  event.preventDefault();
  element.focus();
  emit('contextmenu', rowIndex, cellIndex, event);
}
</script>

<template>
  <section id="keyboard" class="keyboard">
    <div class="row" v-for="(row, rowIndex) in keyboard" :key="rowIndex">
      <input
        v-for="(cell, cellIndex) in row"
        :key="cellIndex"
        ref="inputs"
        class="input"
        :class="`input--${cell.state}`"
        type="text"
        maxLength="1"
        v-model="cell.letter"
        @input="handleInput(rowIndex, cellIndex, $event)"
        @keydown.delete.prevent="handleBackspace(rowIndex, cellIndex, $event)"
        @keydown.left="handleLeft"
        @keydown.right="handleRight"
        @contextmenu.prevent="handleContextMenu(rowIndex, cellIndex, $event)"
        @touchstart="handleContextMenu(rowIndex, cellIndex, $event)"
      />
    </div>
  </section>
</template>

<style>
.keyboard {
  display: grid;
  grid-template-rows: repeat(5, 1fr);
  gap: 0.5rem;
}

.row {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
}

.input {
  width: 100%;
  aspect-ratio: 1 / 1;
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  border: 1px solid var(--primary-color);
  border-radius: var(--border-radius);
  outline: none;
  color: var(--text-color);
  background-color: var(--bg-color);
  transition:
    background-color var(--transition-speed),
    border-color var(--transition-speed),
    color var(--transition-speed);
}

.input--correct {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--primary-text);
}

.input--present {
  background-color: color-mix(in srgb, var(--secondary-color) 70%, transparent);
  border-color: var(--secondary-color);
  color: var(--secondary-text);
}

.input--absent {
  background-color: var(--gray-color);
  border-color: var(--gray-color);
  color: var(--gray-text);
}
</style>
