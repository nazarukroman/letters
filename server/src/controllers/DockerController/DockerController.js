export class DockerController {
  constructor(dockerService) {
    this.dockerService = dockerService;
  }

  async getRunningImages(context) {
    const result = await this.dockerService.getRunningImages();

    if (!result.isOk) {
      context.status(500);
      return context.json(result.error.message);
    }

    context.status(200);

    return context.json(result.data);
  }
}
