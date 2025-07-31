import { GenerateImagePort } from '~/domains/ports/imagen.port';
import { imagenService } from '~/infrastructures/services/imagen.service';
import { uid } from '../utils/uid';
import { supabaseService } from '~/infrastructures/services/supabase.service';
import { imageURLToBase64 } from '../utils/image-converter.util';

export const generateImageFlow = async (input: GenerateImagePort) => {
  try {
    const { user_prompt, custom_instructions } = input;
    const { n, images, aspect_ratio } = custom_instructions;

    if (images) {
      const imageUploadSupaBases = await Promise.all(
        images.map(async image => {
          const imageUploadSupaBase = await supabaseService.uploadImageToSupabase(URL.createObjectURL(image as Blob), 'url', uid());
          return imageUploadSupaBase;
        }),
      );

      const imagesBase64Reference = await Promise.all(
        imageUploadSupaBases.map(async image => {
          const imageBase64 = await imageURLToBase64(image);
          return imageBase64;
        }),
      );

      const userMagicPrompt = await imagenService.magicPromptUserImageReference(user_prompt, imageUploadSupaBases);

      const { images: imagesGenerated, taskId } = await imagenService.generateImagenMixed(
        userMagicPrompt,
        aspect_ratio,
        imagesBase64Reference,
      );

      return { images: imagesGenerated, reference: imageUploadSupaBases, taskId };
    } else {
      const magicPrompt = await imagenService.magicPromptImageGenerate(user_prompt, custom_instructions);
      const images = await imagenService.generateImagen(magicPrompt, aspect_ratio, n);
      return { images };
    }
  } catch (error) {
    console.log('Fail to generate image: ', error);
    return { image: [] };
  }
};
