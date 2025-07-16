import { generateImageFlow } from '~/applications/flow/generate-image.flow';
import { uid } from '~/applications/utils/uid';
import { GenerateImagePort } from '~/domains/ports/generate-image.port';
import { supabaseService } from '~/infrastructures/services/supabase.service';

const generateImage = async (input: GenerateImagePort) => {
  const data = await generateImageFlow(input);

  const uniqueId = uid();

  if (Array.isArray(data)) {
    const imagePublicUrls: string[] = [];
    await Promise.all(
      data.map(async item => {
        const uniqueId = uid();
        const imagePublicUrl = await supabaseService.uploadImageToSupabase(item, 'url', uniqueId);
        imagePublicUrls.push(imagePublicUrl);
      }),
    );
    return imagePublicUrls;
  } else if (data.value) {
    const imagePublicUrl = await supabaseService.uploadImageToSupabase(data.value, data.type, uniqueId);

    return [imagePublicUrl];
  }

  return [];
};

export const GenerateImageService = {
  generateImage,
};
