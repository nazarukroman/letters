import { ApiExecutor } from '@/utils/ApiExecutor.js';

export class ApiRepository extends ApiExecutor {
  async getRandomWords({ random, count, list = [] }) {
    return await this.execute(`/api/words/search`, {
      method: 'POST',
      body: {
        count,
        random,
        list,
      },
    });
  }

  async getUniqueWords({ count, list = [] }) {
    return await this.execute(`/api/words/unique`, {
      method: 'POST',
      body: {
        count,
        list,
      },
    });
  }
}

export const apiRepository = new ApiRepository();
