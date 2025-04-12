import { dockerExecutor } from '../../lib/dockerExecutor.js';

export class DockerRepository {
  async getContainers() {
    return dockerExecutor('http://localhost/containers/json');
  }
}
