import { ResponseFactory } from '../../lib/ResponseFactory.js';
import { buildSQLLikePartFromPattern } from '../../lib/buildSQLLikePartFromPattern.js';

export class WordsRepository {
  #baseFiveWordSql = 'SELECT word, gender FROM nouns WHERE 1=1 AND CHAR_LENGTH(word) = 5 AND wcase = "им"';

  constructor(dbAdapter) {
    this.db = dbAdapter;
  }

  async getRandomWord(count = 1) {
    const rows = await this.db.query(this.#baseFiveWordSql + `ORDER BY RAND() LIMIT ${count};`);

    if (!rows.length) {
      return ResponseFactory.createFailure('Cant get random word!');
    }

    return ResponseFactory.createSuccess(rows);
  }

  async getWordByPattern(list) {
    const { likePart, paramsPart } = buildSQLLikePartFromPattern(list);

    const rows = await this.db.query(this.#baseFiveWordSql + ' ' + likePart + ';', paramsPart);

    if (!rows.length) {
      return ResponseFactory.createFailure('Cant get word by pattern!');
    }

    return ResponseFactory.createSuccess(rows);
  }

  async getWordByPatternWithoutRepetitions(list) {
    const { likePart, paramsPart } = buildSQLLikePartFromPattern(list);

    const rows = await this.db.query(
      `SELECT word, gender
        FROM nouns
        WHERE CHAR_LENGTH(word) = 5
          AND wcase = 'им'
          ${likePart}
          AND CHAR_LENGTH(word) = (
          SELECT COUNT(DISTINCT SUBSTRING(word, n, 1))
          FROM (
                 SELECT a.N + b.N * 10 + 1 AS n
                 FROM
                     (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) a,
                     (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4) b
                 ORDER BY n
               ) numbers
          WHERE n <= CHAR_LENGTH(word)
      );`,
      paramsPart,
    );

    if (!rows.length) {
      return ResponseFactory.createFailure('Cant get word by pattern!');
    }

    return ResponseFactory.createSuccess(rows);
  }
}
