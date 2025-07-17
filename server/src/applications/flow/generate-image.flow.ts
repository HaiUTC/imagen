import { GenerateImagePort } from '~/domains/ports/generate-image.port';
import { imagenService } from '~/infrastructures/services/imagen.service';
import { uid } from '../utils/uid';
import { supabaseService } from '~/infrastructures/services/supabase.service';

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
        const imageUploadSupaBase = await supabaseService.uploadImageToSupabase(
          URL.createObjectURL(custom_instructions.reference_image as Blob),
          'url',
          uid(),
        );
        const promptEnrichment = await imagenService.enrichUserPromptGenerateImageReference(
          user_prompt,
          imageUploadSupaBase,
          custom_instructions.style,
        );
        console.log('promptEnrichment', promptEnrichment);
        const image = await imagenService.generateImagenMixed(promptEnrichment, imageUploadSupaBase);
        console.log('Image: ', image);
        return { image, reference: imageUploadSupaBase };
      } else {
        const image = await imagenService.generateImagePro(user_prompt, custom_instructions);
        return { image };
      }
    } else {
      const magicPrompt = await imagenService.magicPromptImageGenerate(user_prompt, custom_instructions);
      const image = await imagenService.generateImagen(magicPrompt, custom_instructions.aspect_ratio, getModel(model));
      return { image };
    }
  } catch (error) {
    console.log('Fail to generate image: ', error);
    return { image: [] };
  }
};
