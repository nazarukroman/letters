import { WordsRepository } from './WordsRepository.js';
import { mariadbAdapter } from '../../adapters/MariadbAdapter/index.js';

export const wordsRepository = new WordsRepository(mariadbAdapter);
