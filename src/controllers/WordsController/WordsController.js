export class WordsController {
  constructor(service) {
    this.service = service;
  }

  async getRandomWord(context) {
    const count = context.req.query('count');
    const result = await this.service.getRandomWord(count);

    if (!result.isOk) {
      context.status(500);

      return context.json(result.error.message);
    }

    context.status(200);

    return context.json(result.data);
  }

  async getWordByPattern(context) {
    const body = await context.req.json();
    const result = await this.service.getWordByPattern(body.list);

    if (!result.isOk) {
      context.status(500);

      return context.json(result.error.message);
    }

    context.status(200);

    return context.json(result.data);
  }

  async getWordByPatternWithoutRepetitions(context) {
    const body = await context.req.json();
    const result = await this.service.getWordByPatternWithoutRepetitions(body.list);

    if (!result.isOk) {
      context.status(500);

      return context.json(result.error.message);
    }

    context.status(200);

    return context.json(result.data);
  }
}
