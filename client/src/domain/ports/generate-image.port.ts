export interface GenerateImageServicePort {
  generateImage: (data: FormData) => Promise<string[]>;
}
