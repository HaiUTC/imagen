import type { GenerateImageEntity } from "../domain/entities/generate-image.entity";
import { useGenerateImageStore } from "../store/generate-image.store";
import { generateUniqueNumericId } from "../libs/utils/id-generator";
import { generateImageService } from "../infrastructure/services/generate-image.service";

export const generateImageFlow = async (
  input: GenerateImageEntity.GenerateImageInput
) => {
  const { prompt, customInstructions } = input;
  const {
    setLoadingGenerateImage,
    setImageGeneratedUrl,
    setErrorGenerateImage,
  } = useGenerateImageStore.getState();

  try {
    setLoadingGenerateImage(true);

    const formData = new FormData();

    if (customInstructions.reference_image) {
      formData.append("user_prompt", prompt);
      formData.append("reference_image", customInstructions.reference_image);

      const customInstructionsWithoutImage = {
        ...customInstructions,
        reference_image: undefined,
      };
      formData.append(
        "custom_instructions",
        JSON.stringify(customInstructionsWithoutImage)
      );
    } else {
      formData.append("user_prompt", prompt);
      formData.append(
        "custom_instructions",
        JSON.stringify(customInstructions)
      );
    }

    const images = await generateImageService.generateImage(formData);

    const imagesMap = images.map((image) => ({
      id: generateUniqueNumericId(),
      url: image,
    }));

    console.log("imagesMap", imagesMap);

    setImageGeneratedUrl(imagesMap);

    setLoadingGenerateImage(false);
  } catch (error) {
    setErrorGenerateImage(
      (error as Error).message as string | "Failed to generate image"
    );
  }
};
