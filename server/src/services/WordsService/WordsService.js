export class WordsService {
  constructor(repository) {
    this.repository = repository;
  }

  async getRandomWord() {
    return this.repository.getRandomWord();
  }
}
