import { registerImages } from './api/images.js';
import { registerWords } from './api/words.js';

export function registerRoutes(app) {
  registerImages(app);
  registerWords(app);
}
