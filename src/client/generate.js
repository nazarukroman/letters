function main() {
  const WORDS_COUNT = 30;
  const API = {
    GET_RANDOM: `/api/words/random?count=${WORDS_COUNT}`,
    GET_BY_PATTERN: '/api/words/pattern',
    GET_BY_PATTERN_WITHOUT_REPETITIONS: '/api/words/pattern-without-repetitions',
  };
  const generateUnusedButton = document.getElementById('generate-unused-btn');
  const generateRandomButton = document.getElementById('generate-random-btn');
  const infoBlock = document.getElementById('info');

  function handleGeneratePatternButtonClick() {
    const flattenStore = flatKeyboardStore(keyboardStore)
      .filter((item) => item.letter !== '')
      .map((item) => ({ ...item, state: 'absent' }));

    fetchWordsByPattern(API.GET_BY_PATTERN_WITHOUT_REPETITIONS, flattenStore);
  }

  function handleGenerateRandomButtonClick() {
    const flattenStore = flatKeyboardStore(keyboardStore).filter((item) =>
      Object.values(STATE_TYPE).includes(item.state),
    );

    flattenStore.length === 0
      ? fetch(API.GET_RANDOM)
          .then((response) => response.json())
          .then((result) => {
            renderWords(result.list || []);
          })
      : fetchWordsByPattern(API.GET_BY_PATTERN, flattenStore);
  }

  function fetchWordsByPattern(apiUrl, list) {
    return fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ list }),
    })
      .then((response) => response.json())
      .then((result) => {
        renderWords(result.list || []);
      });
  }

  function renderWords(rows) {
    const ul = document.createElement('ul');

    ul.classList.add('word-list');

    for (const row of rows) {
      const li = document.createElement('li');
      const wordElement = document.createElement('span');
      const genderElement = document.createElement('sup');

      wordElement.textContent = row.word;
      wordElement.classList.add('word');

      genderElement.textContent = `(${row.gender})`;
      genderElement.classList.add('gender');

      li.classList.add('word-list-item');

      li.appendChild(wordElement);
      li.appendChild(genderElement);

      ul.appendChild(li);
    }

    infoBlock.replaceChildren(ul);
  }

  function flatKeyboardStore(store) {
    return store.reduce((acc, curr) => acc.concat(curr), []);
  }

  generateUnusedButton.addEventListener('click', handleGeneratePatternButtonClick);
  generateRandomButton.addEventListener('click', handleGenerateRandomButtonClick);
}

document.addEventListener('DOMContentLoaded', main);
