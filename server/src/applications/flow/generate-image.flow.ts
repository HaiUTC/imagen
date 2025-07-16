import { GenerateImagePort } from '~/domains/ports/generate-image.port';
import { imagenService } from '~/infrastructures/services/imagen.service';

const getModel = (level: string) => {
  if (level === 'normal') return 'imagen-3.0-generate-002';
  if (level === 'plus') return 'imagen4';
  if (level === 'pro') return 'ideogram-generate-v3';
  if (level === 'ultra') return 'imagen4-ultra';
};

export const generateImageFlow = async (input: GenerateImagePort) => {
  try {
    const { user_prompt, custom_instructions } = input;
    const { model } = custom_instructions;

    if (model === 'pro') {
      if (custom_instructions.reference_image) {
        const image = await imagenService.generateImagenMixed(user_prompt, custom_instructions);
        return image;
      } else {
        const image = await imagenService.generateImagePro(user_prompt, custom_instructions);
        return image;
      }
    } else {
      const magicPrompt = await imagenService.magicPromptImageGenerate(user_prompt, custom_instructions);
      const image = await imagenService.generateImagen(magicPrompt, custom_instructions.aspect_ratio, getModel(model));
      return image;
    }
  } catch (error) {
    console.log('Fail to generate image: ', error);
  }
};
