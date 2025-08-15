import { GenerateImagePort } from '~/domains/ports/imagen.port';
import { imagenService } from '~/infrastructures/services/imagen.service';
import { uid } from '../utils/uid';
import { supabaseService } from '~/infrastructures/services/supabase.service';
import { imagenRepository } from '~/frame-works/database/repositories/imagen.repository';
import { ImagenValue } from '~/domains/entities/imagen.entity';

export const generateImageFlow = async (input: GenerateImagePort) => {
  try {
    const { user_prompt, custom_instructions } = input;
    const { n, images, aspect_ratio, perspectives } = custom_instructions;

    if (images && images.length) {
      const imageUploadSupaBases = await Promise.all(
        images.map(async image => {
          const imageUploadSupaBase = await supabaseService.uploadImageToSupabase(URL.createObjectURL(image as Blob), 'url', uid());
          return imageUploadSupaBase;
        }),
      );

      let perspectivePrompt = '';
      let perspectiveUploadSupaBase = '';

      if (perspectives && perspectives.length) {
        perspectiveUploadSupaBase = await supabaseService.uploadImageToSupabase(URL.createObjectURL(perspectives[0] as Blob), 'url', uid());

        perspectivePrompt = await imagenService.magicPromptPerspectives(perspectiveUploadSupaBase);
      }

      const userMagicPrompt = await imagenService.magicPromptUserImageReference(user_prompt, perspectivePrompt, imageUploadSupaBases);

      const imagen = (await imagenRepository.create({
        format: 'generate',
        data: {
          prompt: input.user_prompt,
          aspectRatio: input.custom_instructions.aspect_ratio,
          n: input.custom_instructions.n,
          style: input.custom_instructions.style,
          reference: imageUploadSupaBases || [],
          perspective: {
            image: perspectiveUploadSupaBase,
            analytic: perspectivePrompt,
          },
          magic_prompt: userMagicPrompt || '',
        },
        status: 'PROCESSING',
        taskId: '',
        imagens: [],
      })) as ImagenValue;

      const { images: imagesGenerated, taskId } = await imagenService.generateImagenMixed(
        userMagicPrompt,
        aspect_ratio,
        imageUploadSupaBases,
      );

      return { images: imagesGenerated, reference: imageUploadSupaBases, taskId, id: imagen._id as string };
    } else {
      const magicPrompt = await imagenService.magicPromptImageGenerate(user_prompt, custom_instructions);
      const images = await imagenService.generateImagen(magicPrompt, aspect_ratio, n);
      return { images, magicPrompt, taskId: '', id: '' };
    }
  } catch (error) {
    console.log('Fail to generate image: ', error);
    return { image: [], taskId: '', magicPrompt: '' };
  }
};
