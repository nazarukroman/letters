import { wordsController } from '../controllers/WordsController/index.js';

export function registerWords(app) {
  app.get('/api/words/random', (context) => wordsController.getRandomWord(context));
  app.post('/api/words/pattern', (context) => wordsController.getWordByPattern(context));
  app.post('/api/words/pattern-without-repetitions', (context) =>
    wordsController.getWordByPatternWithoutRepetitions(context),
  );
}
