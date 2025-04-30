import { ApiExecutor } from '@/utils/ApiExecutor.js';

export class ApiRepository extends ApiExecutor {
  async getRandomWords({ unique, random, count, list = [] }) {
    return await this.execute(`/api/words/search`, {
      method: 'POST',
      body: {
        count,
        unique,
        random,
        list,
      },
    });
  }
}

export const apiRepository = new ApiRepository();
