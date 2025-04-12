import { WordsController } from './WordsController.js';
import { wordsService } from '../../services/WordsService/index.js';

export const wordsController = new WordsController(wordsService);
