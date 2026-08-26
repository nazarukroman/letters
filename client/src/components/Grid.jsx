import { useRef, useCallback } from 'preact/hooks';
import { grid, setLetter, cycleState } from '../state.js';

const CYRILLIC = /^[А-ЯЁа-яё]$/;

export function Grid() {
  const refs = useRef([]);

  const focusCell = useCallback((rowIdx, colIdx) => {
    refs.current[rowIdx * 5 + colIdx]?.focus();
  }, []);

  const handleInput = useCallback(
    (rowIdx, colIdx, e) => {
      const raw = e.target.value.slice(-1).toUpperCase();
      const letter = CYRILLIC.test(raw) ? raw : '';

      setLetter(rowIdx, colIdx, letter);
      e.target.value = letter;

      if (letter) {
        if (colIdx < 4) focusCell(rowIdx, colIdx + 1);
        else if (rowIdx < 5) focusCell(rowIdx + 1, 0);
      }
    },
    [focusCell],
  );

  const handleKeyDown = useCallback(
    (rowIdx, colIdx, e) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        const cell = grid.value[rowIdx][colIdx];
        if (cell.value.letter) {
          setLetter(rowIdx, colIdx, '');
          e.target.value = '';
        } else if (colIdx > 0) {
          setLetter(rowIdx, colIdx - 1, '');
          const prev = refs.current[rowIdx * 5 + colIdx - 1];
          if (prev) {
            prev.value = '';
            prev.focus();
          }
        } else if (rowIdx > 0) {
          setLetter(rowIdx - 1, 4, '');
          const prev = refs.current[(rowIdx - 1) * 5 + 4];
          if (prev) {
            prev.value = '';
            prev.focus();
          }
        }
      } else if (e.key === 'ArrowLeft') {
        if (colIdx > 0) focusCell(rowIdx, colIdx - 1);
        else if (rowIdx > 0) focusCell(rowIdx - 1, 4);
      } else if (e.key === 'ArrowRight') {
        if (colIdx < 4) focusCell(rowIdx, colIdx + 1);
        else if (rowIdx < 5) focusCell(rowIdx + 1, 0);
      } else if (e.key === 'ArrowUp' && rowIdx > 0) {
        focusCell(rowIdx - 1, colIdx);
      } else if (e.key === 'ArrowDown' && rowIdx < 5) {
        focusCell(rowIdx + 1, colIdx);
      } else if (e.key === ' ') {
        e.preventDefault();
        cycleState(rowIdx, colIdx);
      }
    },
    [focusCell],
  );

  const handleClick = useCallback((rowIdx, colIdx, e) => {
    const cell = grid.value[rowIdx][colIdx];
    const { letter, state } = cell.value;
    if (letter && state !== 'empty') {
      cycleState(rowIdx, colIdx);
      e.preventDefault();
    }
  }, []);

  return (
    <div class="grid-section">
      <div class="grid">
        {grid.value.map((row, rowIdx) => (
          <div class="grid-row" key={rowIdx}>
            {row.map((cell, colIdx) => (
              <input
                key={colIdx}
                ref={(el) => {
                  refs.current[rowIdx * 5 + colIdx] = el;
                }}
                class={`cell cell--${cell.value.state}`}
                type="text"
                maxLength="2"
                value={cell.value.letter}
                onInput={(e) => handleInput(rowIdx, colIdx, e)}
                onKeyDown={(e) => handleKeyDown(rowIdx, colIdx, e)}
                onMouseDown={(e) => handleClick(rowIdx, colIdx, e)}
                autocomplete="off"
                autocorrect="off"
                autocapitalize="off"
                spellcheck={false}
              />
            ))}
          </div>
        ))}
      </div>
      <div class="legend">
        <div class="legend-item">
          <span class="legend-dot legend-dot--correct" />
          <span>верно</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot legend-dot--present" />
          <span>не там</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot legend-dot--absent" />
          <span>нет</span>
        </div>
      </div>
    </div>
  );
}
