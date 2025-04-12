export class WordsController {
  constructor(service) {
    this.service = service;
  }

  async getRandomWord(context) {
    const result = await this.service.getRandomWord();

    if (!result.isOk) {
      context.status(500);

      console.log('Result error', result.error);

      return context.json(result.error.message);
    }

    context.status(200);

    return context.json(result.data);
  }
}
