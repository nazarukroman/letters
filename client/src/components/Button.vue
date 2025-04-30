<script setup>
defineProps({
  size: { type: String, default: 'medium' },
  variant: { type: String, default: 'primary' },
});
</script>

<template>
  <button class="button" :class="`button--${size} button--${variant}`" type="button">
    <slot></slot>
  </button>
</template>

<style>
.button {
  display: inline-block;
  padding: 0.6em 1.2em;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition:
    background-color var(--transition-speed),
    color var(--transition-speed);
}

.button--small {
  padding: 0.4em 1em;
  font-size: 0.8rem;
}

.button--medium {
  padding: 0.6em 1.2em;
  font-size: 1rem;
}

.button--large {
  padding: 0.8em 1.6em;
  font-size: 1.25rem;
}

.button--primary {
  background-color: var(--primary-color);
  color: var(--primary-text);
}

.button--primary:hover:not(:disabled) {
  background-color: var(--primary-hover);
}

.button--primary:active:not(:disabled) {
  background-color: var(--primary-active);
}

.button--secondary {
  background-color: var(--secondary-color);
  color: var(--secondary-text);
}

.button--secondary:hover:not(:disabled) {
  background-color: var(--secondary-hover);
}

.button--secondary:active:not(:disabled) {
  background-color: var(--secondary-active);
}

.button--gray {
  background-color: var(--gray-color);
  color: var(--gray-text);
}

.button--gray:hover:not(:disabled) {
  background-color: var(--gray-hover);
}

.button--gray:active:not(:disabled) {
  background-color: var(--gray-active);
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
