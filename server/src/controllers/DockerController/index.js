import { DockerController } from './DockerController.js';
import { dockerService } from '../../services/DockerService/index.js';

export const dockerController = new DockerController(dockerService);
