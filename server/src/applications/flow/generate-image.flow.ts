import { GenerateImagePort } from '~/domains/ports/imagen.port';
import { imagenService } from '~/infrastructures/services/imagen.service';
import { uid } from '../utils/uid';
import { s3Service } from '~/infrastructures/services/s3.service';
import { imagenRepository } from '~/frame-works/database/repositories/imagen.repository';
import { ImagenValue } from '~/domains/entities/imagen.entity';

export const generateImageFlow = async (input: GenerateImagePort) => {
  try {
    const { user_prompt, custom_instructions } = input;
    const { n, images, aspect_ratio, perspectives } = custom_instructions;

    if (images && images.length) {
      const imageUploadS3s = await Promise.all(
        images.map(async image => {
          const imageUploadS3 = await s3Service.uploadImage(URL.createObjectURL(image as Blob), 'url', uid('reference_'));
          return imageUploadS3;
        }),
      );

      let perspectivePrompt = '';
      let perspectiveUploadS3 = '';

      if (perspectives && perspectives.length) {
        perspectiveUploadS3 = await s3Service.uploadImage(URL.createObjectURL(perspectives[0] as Blob), 'url', uid('perspective_'));

        perspectivePrompt = await imagenService.magicPromptPerspectives(perspectiveUploadS3);
      }

      const userMagicPrompt = await imagenService.magicPromptUserImageReference(user_prompt, perspectivePrompt, imageUploadS3s);

      const imagen = (await imagenRepository.create({
        format: 'generate',
        data: {
          prompt: input.user_prompt,
          aspectRatio: input.custom_instructions.aspect_ratio,
          n: input.custom_instructions.n,
          style: input.custom_instructions.style,
          reference: imageUploadS3s || [],
          perspective: {
            image: perspectiveUploadS3,
            analytic: perspectivePrompt,
          },
          magic_prompt: userMagicPrompt || '',
        },
        status: 'PROCESSING',
        taskId: '',
        imagens: [],
      })) as ImagenValue;

      const { images: imagesGenerated, taskId } = await imagenService.generateImagenMixed(userMagicPrompt, aspect_ratio, imageUploadS3s);

      return { images: imagesGenerated, reference: imageUploadS3s, taskId, id: imagen._id as string };
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
