import { wordsController } from '../controllers/WordsController/index.js';

export function registerWords(app) {
  app.get('/words/random', (context) => wordsController.getRandomWord(context));
}
