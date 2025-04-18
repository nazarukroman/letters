export function buildSQLLikePartFromPattern(list) {
  const correctLetters = new Map();
  const presentLetters = new Map();
  const absentLetters = new Set();

  const likePart = [];
  const paramsPart = [];

  for (const { letter, state, position } of list) {
    const preparedLetter = letter.toLowerCase();

    if (state === 'correct') {
      if (!correctLetters.has(position)) correctLetters.set(position, new Set());
      correctLetters.get(position).add(preparedLetter);
    }

    if (state === 'present') {
      if (!presentLetters.has(position)) presentLetters.set(position, new Set());
      presentLetters.get(position).add(preparedLetter);
    }

    if (state === 'absent') {
      absentLetters.add(preparedLetter);
    }
  }

  for (const [position, letterSet] of correctLetters) {
    const { head, tail } = createPatternMask(position);

    for (const letter of letterSet) {
      likePart.push('AND word LIKE ?');
      paramsPart.push(head + letter + tail);
    }
  }

  for (const [position, letterSet] of presentLetters) {
    const { head, tail } = createPatternMask(position);

    for (const letter of letterSet) {
      likePart.push('AND word NOT LIKE ?');
      paramsPart.push(head + letter + tail);

      likePart.push('AND word LIKE ?');
      paramsPart.push(createAnyLetterMask(letter));
    }
  }

  for (const letter of absentLetters) {
    likePart.push('AND word NOT LIKE ?');
    paramsPart.push(createAnyLetterMask(letter));
  }

  return { likePart: likePart.join(' '), paramsPart };
}

function createAnyLetterMask(letter) {
  return `%${letter}%`;
}

function createPatternMask(position) {
  return { head: '_'.repeat(position), tail: '_'.repeat(4 - position) };
}
