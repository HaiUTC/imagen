export class GenerateImageError extends Error {
  constructor(public cause?: Error) {
    super();
    this.name = "GenerateImageError";
    this.message = "Failed to generate image";
  }
}
