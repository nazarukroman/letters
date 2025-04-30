<script setup>
import { ref } from 'vue';
import Header from '@/components/Header.vue';
import InfoBlock from '@/components/InfoBlock.vue';
import Keyboard from '@/components/Keyboard.vue';
import ContextMenu from '@/components/ContextMenu.vue';
import { keyboard } from '@/stores/keyboard.js';

const contextMenu = ref({
  open: false,
  rawIndex: -1,
  cellIndex: -1,
});

function handleContextMenuOpen(rawIndex, cellIndex) {
  contextMenu.value = { open: true, rawIndex, cellIndex };
}

function handleContextMenuClose() {
  contextMenu.value = { open: false, rawIndex: -1, cellIndex: -1 };
}

function handleMarkLetter(state) {
  const { rawIndex, cellIndex } = contextMenu.value;
  keyboard[rawIndex][cellIndex].state = state;
  handleContextMenuClose();
}
</script>

<template>
  <div class="page-wrapper">
    <Header />
    <InfoBlock />
    <Keyboard @contextmenu="handleContextMenuOpen" />

    <ContextMenu :contextMenu @close="handleContextMenuClose" @markLetter="handleMarkLetter" />
  </div>
</template>

<style>
.page-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: 390px;
  height: 100%;
  overflow-y: auto;
  margin: 0 auto;
}
</style>
