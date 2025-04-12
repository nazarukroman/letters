import { WordsService } from './WordsService.js';
import { wordsRepository } from '../../repositories/WordsRepository/index.js';

export const wordsService = new WordsService(wordsRepository);
