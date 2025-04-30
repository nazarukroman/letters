import { ResponseFactory } from '@/utils/ResponseFactory.js';

export class ApiExecutor {
  async execute(url, options = {}) {
    try {
      const {
        method = 'GET',
        headers = { 'Content-Type': 'application/json', ...(options.headers || {}) },
        body,
      } = options;
      const response = await fetch(url, {
        method,
        headers,
        body: method !== 'GET' && body ? JSON.stringify(body) : null,
      });

      if (response.statusCode >= 400) {
        const errorText = await response.text();
        return ResponseFactory.createFailure(
          new Error(`HTTP error! Status: ${response.statusCode}, Message: ${errorText}`),
        );
      }

      const data = await response.json();
      return ResponseFactory.createSuccess(data);
    } catch (error) {
      return ResponseFactory.createFailure(error);
    }
  }
}

export const apiExecutor = new ApiExecutor();
