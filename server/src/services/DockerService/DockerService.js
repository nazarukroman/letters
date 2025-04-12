import { ResponseFactory } from '../../lib/ResponseFactory.js';

export class DockerService {
  constructor(dockerRepository) {
    this.dockerRepository = dockerRepository;
  }

  async getContainers() {
    return this.dockerRepository.getContainers();
  }

  async getRunningImages() {
    const result = await this.getContainers();

    if (!result.isOk) {
      return result;
    }

    return ResponseFactory.createSuccess(result.data.filter((container) => container.State === 'running'));
  }
}
