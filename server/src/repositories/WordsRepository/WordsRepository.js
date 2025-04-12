import { ResponseFactory } from '../../lib/ResponseFactory.js';

export class WordsRepository {
  constructor(dbAdapter) {
    this.db = dbAdapter;
  }

  async getRandomWord() {
    // const rows = await this.db.query(
    //   'SELECT word, gender, wcase FROM nouns WHERE CHAR_LENGTH(word) = 5 ORDER BY RAND() LIMIT 1',
    // );

    const rows = await this.db.query(
      `SELECT word, gender, wcase FROM nouns WHERE CHAR_LENGTH(word) = 5
                                        AND word NOT LIKE ?
                                        AND word NOT LIKE ?
                                        AND word NOT LIKE ?
                                        AND word NOT LIKE ?
                                        AND word NOT LIKE ?
                                        AND word LIKE ?
                                        `,
      [
        'ведро',
        'м_нго',
        'к__по',
        '__л_ш',
        '__йб_',
        'ша__а',
      ]
    );

    console.log('rows', rows);

    const word = rows[0]?.word;

    if (!word) {
      return ResponseFactory.createFailure('Cant get random word!');
    }

    return ResponseFactory.createSuccess(word);
  }
}
