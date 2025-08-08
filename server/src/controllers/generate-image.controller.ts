import { downloadImageGeneratedFlow } from '~/applications/flow/download-image.flow';
import { editImageFlow } from '~/applications/flow/edit-image.flow';
import { generateImageFlow } from '~/applications/flow/generate-image.flow';
import { uid } from '~/applications/utils/uid';
import { GenerateImagePort } from '~/domains/ports/imagen.port';
import { imagenRepository } from '~/frame-works/database/repositories/imagen.repository';
import { supabaseService } from '~/infrastructures/services/supabase.service';

const generateImage = async (input: GenerateImagePort) => {
  const { images, reference, taskId, magicPrompt } = await generateImageFlow(input);
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

  const imagen = await imagenRepository.create({
    format: 'generate',
    data: {
      prompt: input.user_prompt,
      aspectRatio: input.custom_instructions.aspect_ratio,
      n: input.custom_instructions.n,
      style: input.custom_instructions.style,
      reference: reference || [],
      magic_prompt: magicPrompt || '',
    },
    taskId: taskId || '',
    imagens: imagePublicUrls,
  });

  return { images: imagePublicUrls, taskId, id: imagen._id as string };
};

const editImage = async (prompt: string, images: File[]) => {
  const { images: imagesEdited, reference, taskId } = await editImageFlow(prompt, images);

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

  const imagen = await imagenRepository.create({
    format: 'edit',
    data: {
      prompt: prompt,
      reference: reference || [],
    },
    taskId,
    imagens: imagePublicUrls,
  });

  return { images: imagePublicUrls, taskId, id: imagen._id as string };
};

const downloadImageGenerated = async ({ option, id }: { option: string; id: string }) => {
  const imagePublicUrls: string[] = [];

  const images = await downloadImageGeneratedFlow(option, id);

  if (Array.isArray(images)) {
    await Promise.all(
      images.map(async item => {
        const uniqueId = uid();
        const imagePublicUrl = await supabaseService.uploadImageToSupabase(item, 'url', uniqueId);
        imagePublicUrls.push(imagePublicUrl);
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
