function main() {
  /**
   * @typedef {Object} KeyCell
   * @property {string} letter
   * @property {'empty' | 'filled' | 'correct' | 'present' | 'absent'} state
   *   Состояние ячейки:
   *   — «empty» – пустая,
   *   — «filled» – буква введена,
   *   — «correct» – буква на правильной позиции,
   *   — «present» – буква присутствует, но на другой позиции,
   *   — «absent» – буква отсутствует в слове.
   */

  /**
   *
   * @type {{PRESENT: string, CORRECT: string, ABSENT: string}}
   */
  const STATE_TYPE = {
    PRESENT: 'present',
    CORRECT: 'correct',
    ABSENT: 'absent',
  };

  /**
   * Двумерный массив 6×5, представляющий текущий стейт экранной клавиатуры/таблицы букв.
   * Каждая строка – массив из 5 ячеек {@link KeyCell}, и всего таких строк 6.
   *
   * @type {KeyCell[][]}
   */
  window.keyboardStore = Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, (_, index) => ({ letter: '', state: 'empty', position: index })),
  );
  window.STATE_TYPE = STATE_TYPE;
}

main();
