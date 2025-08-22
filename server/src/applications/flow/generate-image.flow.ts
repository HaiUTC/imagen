import { GenerateImagePort } from '~/domains/ports/imagen.port';
import { imagenService } from '~/infrastructures/services/imagen.service';
import { uid } from '../utils/uid';
import { s3Service } from '~/infrastructures/services/s3.service';
import { imagenRepository } from '~/frame-works/database/repositories/imagen.repository';
import { ImagenValue } from '~/domains/entities/imagen.entity';
import { StreamingEvent } from '../events/streaming-event.class';

export const generateImageFlow = async (input: GenerateImagePort, onEvent?: (event: StreamingEvent) => void) => {
  const emitEvent = (event: StreamingEvent) => {
    onEvent?.(event);
    return event;
  };

  try {
    const { user_prompt, custom_instructions } = input;
    const { n, images, aspect_ratio, perspectives } = custom_instructions;

    if (images && images.length) {
      // Step 1: Analytic Image (Upload to S3 and analyze perspective)
      emitEvent(StreamingEvent.stepStart('analytic_request'));

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

      // Step 2: Magic Processing (Generate magic prompt)
      emitEvent(StreamingEvent.stepStart('magic_processing'));

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

      // Step 3: Generate Image with progress tracking
      emitEvent(StreamingEvent.stepStart('generate_image'));

      const { images: imagesGenerated, taskId } = await imagenService.generateImagenMixed(
        `${userMagicPrompt} --ar ${aspect_ratio}`,
        imageUploadS3s,
        (process: number) => {
          emitEvent(StreamingEvent.stepProgress('generate_image', process));
        },
      );

      const imagesGeneratedUploadS3 = await Promise.all(
        imagesGenerated.map(async image => {
          const imageGeneratedUploadS3 = await s3Service.uploadImage(image.value, 'url', uid('reference_'));
          return imageGeneratedUploadS3;
        }),
      );

      emitEvent(
        StreamingEvent.stepComplete('generate_image', 100, {
          images: imagesGeneratedUploadS3,
          taskId,
          id: imagen._id as string,
        }),
      );

      return { images: imagesGeneratedUploadS3, reference: imageUploadS3s, taskId, id: imagen._id as string };
    } else {
      // Simple flow without streaming for text-only prompts
      emitEvent(StreamingEvent.stepStart('magic_processing', 0));

      const magicPrompt = await imagenService.magicPromptImageGenerate(user_prompt, custom_instructions);

      emitEvent(
        StreamingEvent.stepComplete('magic_processing', 50, {
          magicPrompt,
        }),
      );

      emitEvent(StreamingEvent.stepStart('generate_image', 50));

      const images = await imagenService.generateImagen(magicPrompt, aspect_ratio, n);

      emitEvent(
        StreamingEvent.stepComplete('generate_image', 100, {
          images,
        }),
      );

      return { images, magicPrompt, taskId: '', id: '' };
    }
  } catch (error) {
    console.log('Fail to generate image: ', error);
    return { image: [], taskId: '', magicPrompt: '' };
  }
};
