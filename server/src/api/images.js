import { dockerController } from '../controllers/DockerController/index.js';

export function registerImages(app) {
  app.get('/images', (context) => dockerController.getRunningImages(context));
}
