import { render } from 'preact';
import { Grid } from './components/Grid.jsx';
import { Results } from './components/Results.jsx';
import { resetGrid, totalCount, loading } from './state.js';
import './styles.css';

function App() {
  const count = totalCount.value;
  const isLoading = loading.value;

  return (
    <div class="app">
      <header class="header">
        <h1>Letters</h1>
        <div class="header-actions">
          {count !== null && !isLoading && (
            <span class="badge">{count} {pluralize(count)}</span>
          )}
          <button class="btn-reset" onClick={resetGrid}>
            Сброс
          </button>
        </div>
      </header>
      <div class="content">
        <Grid />
        <Results />
      </div>
    </div>
  );
}

function pluralize(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return 'слов';
  if (mod10 === 1) return 'слово';
  if (mod10 >= 2 && mod10 <= 4) return 'слова';
  return 'слов';
}

render(<App />, document.getElementById('app'));
