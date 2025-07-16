import { GenerateImageError } from "../../domain/errors/generate-image.error";
import type { GenerateImageServicePort } from "../../domain/ports/generate-image.port";

const createGenerateImageService = (): GenerateImageServicePort => ({
  generateImage: async (formData) => {
    try {
      const data = (await fetch(`${import.meta.env.BE_CDN}/generative/image`, {
        method: "POST",
        body: formData,
      }).then(async (res) => await res.json())) as string[];

      return data;
    } catch (error) {
      throw new GenerateImageError(error as Error);
    }
  },
});

export const generateImageService = createGenerateImageService();
