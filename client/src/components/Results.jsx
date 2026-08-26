import { words, loading, totalCount, toggleGuessed } from '../state.js';

export function Results() {
  const count = totalCount.value;
  const isLoading = loading.value;
  const list = words.value;

  return (
    <div class="results-section">
      <div class="results-header">
        <span class="results-title">Подходящие слова</span>
        <span class="results-count">{isLoading ? <span class="spinner" /> : count !== null ? `${count}` : null}</span>
      </div>
      <div class="results-list">
        {list.length > 0 ? (
          <div class="results-grid">
            {list.map((w) => (
              <div
                class={`word-item ${w.guessed ? 'word-item--guessed' : ''}`}
                key={w.word}
                onClick={() => toggleGuessed(w.word)}
              >
                <span class="word-text">{w.word}</span>
                <span class="word-gender">{w.gender}</span>
              </div>
            ))}
          </div>
        ) : (
          <div class="results-empty">{count === 0 ? 'Ничего не найдено' : 'Отметьте буквы для поиска'}</div>
        )}
      </div>
    </div>
  );
}
