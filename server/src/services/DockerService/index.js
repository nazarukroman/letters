import { DockerService } from './DockerService.js';
import { dockerRepository } from '../../repositories/DockerRepository/index.js';

export const dockerService = new DockerService(dockerRepository);
