import { request } from 'undici';
import { ResponseFactory } from './ResponseFactory.js';

export async function apiExecutor(url, options = {}) {
  try {
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    };
    const response = await request(url, requestOptions);

    if (response.statusCode >= 400) {
      const errorText = await response.body.text();
      throw new Error(`HTTP error! Status: ${response.statusCode}, Message: ${errorText}`);
    }

    // Парсим JSON из ответа
    const data = await response.body.json();
    return ResponseFactory.createSuccess(data);
  } catch (error) {
    return ResponseFactory.createFailure(error);
  }
}
