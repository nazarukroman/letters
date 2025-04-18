import { registerWords } from './api/words.js';
import { registerStatic } from './api/static.js';

export function registerRoutes(app) {
  registerStatic(app);
  registerWords(app);
}
