import { ResponseFactory } from '../../lib/ResponseFactory.js';

export class WordsRepository {
  constructor(dbAdapter) {
    this.db = dbAdapter;
  }

  async getRandomWord() {
    const rows = await this.db.query(
      // 'SELECT word, gender, wcase FROM nouns WHERE CHAR_LENGTH(word) = 5 ORDER BY RAND() LIMIT 1',
      `
        SELECT word, gender, wcase
        FROM nouns
        WHERE CHAR_LENGTH(word) = 5
          AND word NOT LIKE '%р%'
          AND word NOT LIKE '%а%'
          AND word NOT LIKE '%д%'
          AND word NOT LIKE '%и%'
          AND word NOT LIKE '%б%'
          AND word NOT LIKE '%у%'
          AND word NOT LIKE '%т%'
          AND word NOT LIKE '%н%'
          AND word NOT LIKE '%в%'
          AND word NOT LIKE '%е%'
          AND word NOT LIKE '%с%'
          AND word NOT LIKE '%к%'
          AND word NOT LIKE '__л_п'
          AND word LIKE '_о_о_'
          AND word LIKE '%л%'
          AND word LIKE '%п%'
          `,
    );

    console.log('rows', rows);

    const word = rows[0]?.word;

    if (!word) {
      return ResponseFactory.createFailure('Cant get random word!');
    }

    return ResponseFactory.createSuccess(word);
  }
}
