import { downloadImageGeneratedFlow } from '~/applications/flow/download-image.flow';
import { editImageFlow } from '~/applications/flow/edit-image.flow';
import { generateImageFlow } from '~/applications/flow/generate-image.flow';
import { uid } from '~/applications/utils/uid';
import { GenerateImagePort } from '~/domains/ports/imagen.port';
import { imagenRepository } from '~/frame-works/database/repositories/imagen.repository';
import { supabaseService } from '~/infrastructures/services/supabase.service';

const generateImage = async (input: GenerateImagePort) => {
  const { images, taskId, id: imagenId } = await generateImageFlow(input);
  const imagePublicUrls: string[] = [];

  if (Array.isArray(images)) {
    await Promise.all(
      images.map(async item => {
        const uniqueId = uid();
        const imagePublicUrl = await supabaseService.uploadImageToSupabase(item.value, 'url', uniqueId);
        imagePublicUrls.push(imagePublicUrl);
      }),
    );
  }

  await imagenRepository.updateOne(imagenId as string, {
    taskId: taskId || '',
    imagens: imagePublicUrls,
    status: 'SUCCESS',
  });

  return { images: imagePublicUrls, taskId, id: imagenId as string };
};

const editImage = async (prompt: string, images: File[]) => {
  const { images: imagesEdited, taskId, id: imagenId } = await editImageFlow(prompt, images);

  const imagePublicUrls: string[] = [];

  if (Array.isArray(imagesEdited)) {
    await Promise.all(
      imagesEdited.map(async item => {
        const uniqueId = uid();
        const imagePublicUrl = await supabaseService.uploadImageToSupabase(item.value, 'url', uniqueId);
        imagePublicUrls.push(imagePublicUrl);
      }),
    );
  }

  await imagenRepository.updateOne(imagenId as string, {
    taskId: taskId || '',
    imagens: imagePublicUrls,
    status: 'SUCCESS',
  });

  return { images: imagePublicUrls, taskId, id: imagenId as string };
};

const downloadImageGenerated = async ({ option, id }: { option: string; id: string }) => {
  const imagePublicUrls: string[] = [];

  const images = await downloadImageGeneratedFlow(option, id);

  if (Array.isArray(images)) {
    await Promise.all(
      images.map(async item => {
        if (item) {
          const uniqueId = uid();
          const imagePublicUrl = await supabaseService.uploadImageToSupabase(item, 'url', uniqueId);
          imagePublicUrls.push(imagePublicUrl);
        }
      }),
    );
  }

  await imagenRepository.update(id, imagePublicUrls);

  return { images: imagePublicUrls };
};

export const GenerateImageService = {
  generateImage,
  editImage,
  downloadImageGenerated,
};
