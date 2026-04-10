import { signal, computed, effect } from '@preact/signals';

const MARKED_STATES = ['correct', 'present', 'absent'];

function createGrid(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, (_, i) => signal({ letter: '', state: 'empty', position: i }))
  );
}

export const grid = signal(createGrid(6, 5));
export const words = signal([]);
export const loading = signal(false);
export const totalCount = signal(null);

export const activeConstraints = computed(() => {
  const list = [];
  for (const row of grid.value) {
    for (const cell of row) {
      const { letter, state, position } = cell.value;
      if (letter && MARKED_STATES.includes(state)) {
        list.push({ letter, state, position });
      }
    }
  }
  return list;
});

export function cycleState(rowIdx, colIdx) {
  const cell = grid.value[rowIdx][colIdx];
  const { letter, state } = cell.value;
  if (!letter) return;

  const cycle = ['filled', 'correct', 'present', 'absent'];
  const idx = cycle.indexOf(state);
  const next = cycle[(idx + 1) % cycle.length];
  cell.value = { ...cell.value, state: next };
}

export function setLetter(rowIdx, colIdx, letter) {
  const cell = grid.value[rowIdx][colIdx];
  cell.value = {
    ...cell.value,
    letter,
    state: letter ? 'filled' : 'empty',
  };
}

export function resetGrid() {
  grid.value = createGrid(6, 5);
  words.value = [];
  totalCount.value = null;
}

export async function toggleGuessed(word) {
  const current = words.value;
  const item = current.find((w) => w.word === word);
  if (!item) return;

  const isGuessed = item.guessed;

  if (isGuessed) {
    await fetch(`/api/words/guess/${encodeURIComponent(word)}`, { method: 'DELETE' });
  } else {
    await fetch('/api/words/guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word }),
    });
  }

  // Update local state: toggle guessed flag and re-sort (guessed first)
  const updated = current
    .map((w) => (w.word === word ? { ...w, guessed: isGuessed ? 0 : 1 } : w))
    .sort((a, b) => b.guessed - a.guessed || a.word.localeCompare(b.word));
  words.value = updated;
}

async function fetchWords(constraints) {
  if (constraints.length === 0) {
    words.value = [];
    totalCount.value = null;
    return;
  }

  loading.value = true;
  try {
    const res = await fetch('/api/words/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ list: constraints, random: false }),
    });
    if (res.ok) {
      const data = await res.json();
      totalCount.value = data.length;
      words.value = data;
    }
  } finally {
    loading.value = false;
  }
}

// Auto-search when constraints change
effect(() => {
  const constraints = activeConstraints.value;
  const timer = setTimeout(() => fetchWords(constraints), 150);
  return () => clearTimeout(timer);
});
