import { apiRepository } from '@/api/repository.js';
import { ResponseFactory } from '@/utils/ResponseFactory.js';
import { STATE_TYPE } from '@/types.js';

export class ApiService {
  COUNT = 30;

  constructor(apiRepository) {
    this.apiRepository = apiRepository;
  }

  #flatKeyboardStore(pattern) {
    return pattern
      .reduce((acc, curr) => acc.concat(curr), [])
      .filter(
        (item) =>
          item.state === STATE_TYPE.CORRECT ||
          item.state === STATE_TYPE.PRESENT ||
          item.state === STATE_TYPE.ABSENT,
      );
  }

  async getRandomWords(pattern) {
    const result = await this.apiRepository.getRandomWords({
      count: this.COUNT,
      random: true,
      list: this.#flatKeyboardStore(pattern),
    });

    if (!result.isOk) {
      return ResponseFactory.createSuccess([]);
    }

    return result;
  }

  async getUniqueWords(pattern) {
    const result = await this.apiRepository.getRandomWords({
      random: false,
      unique: true,
      list: this.#flatKeyboardStore(pattern),
    });

    if (!result.isOk) {
      return ResponseFactory.createSuccess([]);
    }

    return result;
  }
}

export const apiService = new ApiService(apiRepository);
