import { generateImageFlow } from '~/applications/flow/generate-image.flow';
import { uid } from '~/applications/utils/uid';
import { GenerateImagePort } from '~/domains/ports/generate-image.port';
import { imagenRepository } from '~/frame-works/database/repositories/imagen.repository';
import { supabaseService } from '~/infrastructures/services/supabase.service';

const generateImage = async (input: GenerateImagePort) => {
  const { image, reference } = await generateImageFlow(input);

  const uniqueId = uid();
  const imagePublicUrls: string[] = [];

  if (Array.isArray(image)) {
    await Promise.all(
      image.map(async item => {
        const uniqueId = uid();
        const imagePublicUrl = await supabaseService.uploadImageToSupabase(item, 'url', uniqueId);
        imagePublicUrls.push(imagePublicUrl);
      }),
    );
  } else if (image.value) {
    const imagePublicUrl = await supabaseService.uploadImageToSupabase(image.value, image.type, uniqueId);
    imagePublicUrls.push(imagePublicUrl);
  }

  await imagenRepository.create({
    prompt: input.user_prompt,
    model: input.custom_instructions.model,
    aspectRatio: input.custom_instructions.aspect_ratio,
    style: input.custom_instructions.style,
    reference: reference || undefined,
    imagens: imagePublicUrls,
  });

  return imagePublicUrls;
};

export const GenerateImageService = {
  generateImage,
};
