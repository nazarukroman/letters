import { Agent } from 'undici';
import { apiExecutor } from './apiExecutor.js';

export async function dockerExecutor(url, options) {
  return apiExecutor(url, {
    ...options,
    dispatcher: new Agent({
      connect: {
        socketPath: '/var/run/docker.sock',
      },
    }),
  });
}
