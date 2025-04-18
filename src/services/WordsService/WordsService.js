import { ResponseFactory } from '../../lib/ResponseFactory.js';

export class WordsService {
  constructor(repository) {
    this.repository = repository;
  }

  #createList(data) {
    return { list: data };
  }

  async getRandomWord(count) {
    const result = await this.repository.getRandomWord(count);

    if (!result.isOk) {
      return ResponseFactory.createSuccess(this.#createList(null));
    }

    return ResponseFactory.createSuccess(this.#createList(result.data));
  }

  async getWordByPattern(list) {
    const result = await this.repository.getWordByPattern(list);

    if (!result.isOk) {
      return ResponseFactory.createSuccess(this.#createList(null));
    }

    return ResponseFactory.createSuccess(this.#createList(result.data));
  }

  async getWordByPatternWithoutRepetitions(list) {
    const result = await this.repository.getWordByPatternWithoutRepetitions(list);

    if (!result.isOk) {
      return ResponseFactory.createSuccess(this.#createList(null));
    }

    return ResponseFactory.createSuccess(this.#createList(result.data));
  }
}
