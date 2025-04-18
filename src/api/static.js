import { serveStatic } from '@hono/node-server/serve-static';

const clientFolderPath = './client/';

export function registerStatic(app) {
  app.use('*', serveStatic({ root: clientFolderPath }));
}
