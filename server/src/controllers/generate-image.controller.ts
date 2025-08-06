import { downloadImageGeneratedFlow } from '~/applications/flow/download-image.flow';
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

  const { _id } = await imagenRepository.create({
    format: 'generate',
    data: {
      prompt: input.user_prompt,
      aspectRatio: input.custom_instructions.aspect_ratio,
      n: input.custom_instructions.n,
      style: input.custom_instructions.style,
      reference: reference || undefined,
      magic_prompt: magicPrompt || undefined,
    },
    taskId,
    imagens: imagePublicUrls,
  });

  return { images: imagePublicUrls, taskId, id: _id };
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
  downloadImageGenerated,
};
