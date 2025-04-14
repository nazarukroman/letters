import { registerWords } from './api/words.js';

export function registerRoutes(app) {
  registerWords(app);
}
