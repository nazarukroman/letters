export function buildSQLFromPattern(pattern) {
  const likeMask = pattern.map((p) => (p.status === 'correct' ? p.letter : '_')).join('');

  const mustInclude = new Set();
  const mustExclude = new Set();
  const notOnPosition = [];

  pattern.forEach((p, i) => {
    if (p.status === 'present') {
      mustInclude.add(p.letter);
      notOnPosition.push({ letter: p.letter, index: i });
    }
    if (p.status === 'absent') {
      mustExclude.add(p.letter);
    }
  });

  let sql = `SELECT word FROM nouns WHERE CHAR_LENGTH(word) = 5 AND word LIKE ?`;
  const params = [likeMask];

  for (const letter of mustInclude) {
    sql += ` AND word LIKE ?`;
    params.push(`%${letter}%`);
  }

  for (const { letter, index } of notOnPosition) {
    const mask = Array(5).fill('_');
    mask[index] = letter;
    sql += ` AND word NOT LIKE ?`;
    params.push(mask.join(''));
  }

  for (const letter of mustExclude) {
    sql += ` AND word NOT LIKE ?`;
    params.push(`%${letter}%`);
  }

  sql += ` LIMIT 50`;

  return { sql, params };
}
