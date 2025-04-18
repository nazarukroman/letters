function main() {
  const indexNameAttribute = 'data-test-index';
  const keyboardSection = document.getElementById('keyboard');

  initializeKeyboard();

  function initializeKeyboard() {
    for (let rowIndex = 0; rowIndex < keyboardStore.length; rowIndex += 1) {
      const container = document.createElement('div');

      container.classList.add('row');
      container.setAttribute('data-test-index', String(rowIndex));

      for (let inputIndex = 0; inputIndex < keyboardStore[rowIndex].length; inputIndex += 1) {
        const input = document.createElement('input');

        input.classList.add('input');
        input.setAttribute('maxLength', '1');
        input.setAttribute('type', 'text');
        input.setAttribute(indexNameAttribute, String(inputIndex));

        input.addEventListener('input', handleInput);
        input.addEventListener('keydown', handleKeyDown);
        input.addEventListener('contextmenu', handleContextMenu);
        input.addEventListener('touchstart', handleContextMenu);
        // input.addEventListener('touchstart', handleTouchStart, false);
        // input.addEventListener('touchend', handleTouchEnd, false);

        // let onLongTouch;
        // let timer;
        // const touchDuration = 300;

        // function handleTouchStart(event) {
        //   if (!timer) {
        //     timer = setTimeout(() => onLongTouch(event), touchDuration);
        //   }
        // }

        // function handleTouchEnd() {
        //   if (timer) {
        //     clearTimeout(timer);
        //     timer = null;
        //   }
        // }

        // onLongTouch = (event) => {
        //   timer = null;
        //   handleContextMenu.call(this, event);
        // };

        container.appendChild(input);
      }

      keyboardSection.appendChild(container);
    }
  }

  function handleInput() {
    const cyrillicRegexp = /^[А-яЁё]?$/;
    const value = this.value;

    if (!cyrillicRegexp.test(value)) {
      this.value = '';
      return;
    }

    setInputValue.call(this, value.toUpperCase(), 'filled');

    const nextElement = this.nextElementSibling;

    if (nextElement && value) {
      nextElement.focus();
    }
  }

  function handleKeyDown(event) {
    const previousElement = this.previousElementSibling;
    const nextElement = this.nextElementSibling;

    if (event.key === 'Backspace') {
      event.preventDefault();

      setInputValue.call(this, '', 'empty');

      if (previousElement) {
        previousElement.focus();
      }
    }

    if (event.key === 'ArrowRight' && nextElement) {
      event.preventDefault();
      nextElement.focus();
    }

    if (event.key === 'ArrowLeft' && previousElement) {
      event.preventDefault();
      previousElement.focus();
    }
  }

  function setInputValue(newValue, newState) {
    const rowIndex = this.parentElement.getAttribute(indexNameAttribute);
    const inputIndex = this.getAttribute(indexNameAttribute);
    const currentInput = keyboardStore[rowIndex][inputIndex];

    keyboardStore[rowIndex][inputIndex] = Object.assign(currentInput, { letter: newValue, state: newState });
    this.value = newValue;
  }

  function setInputState(newState) {
    const rowIndex = this.parentElement.getAttribute(indexNameAttribute);
    const inputIndex = this.getAttribute(indexNameAttribute);
    const currentInput = keyboardStore[rowIndex][inputIndex];

    keyboardStore[rowIndex][inputIndex] = Object.assign(currentInput, { state: newState });
  }

  function handleContextMenu(event) {
    if (!this.value) {
      return;
    }

    event.preventDefault();

    this.focus();

    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    const popup = document.createElement('div');
    popup.classList.add('popup');

    [
      { text: 'На текущей позиции', variant: 'primary', state: STATE_TYPE.CORRECT },
      { text: 'На другой позиции', variant: 'secondary', state: STATE_TYPE.PRESENT },
      { text: 'Нет', variant: 'gray', state: STATE_TYPE.ABSENT },
    ].forEach((option) => {
      const button = document.createElement('button');

      button.classList.add('button');
      button.classList.add(`button--${option.variant}`);
      button.textContent = option.text;

      button.addEventListener('click', () => {
        setInputState.call(this, option.state);

        Object.values(STATE_TYPE).forEach(
          (state) => this.classList.contains(`input--${state}`) && this.classList.remove(`input--${state}`),
        );

        this.classList.toggle(`input--${option.state}`);

        document.body.removeChild(overlay);
      });

      popup.appendChild(button);
    });

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', main);
