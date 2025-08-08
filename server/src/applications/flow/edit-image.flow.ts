import { supabaseService } from '~/infrastructures/services/supabase.service';
import { uid } from '../utils/uid';
import { imagenService } from '~/infrastructures/services/imagen.service';

export const editImageFlow = async (prompt: string, images: File[]) => {
  try {
    const imageUploadSupaBases = await Promise.all(
      images.map(async image => {
        const imageUploadSupaBase = await supabaseService.uploadImageToSupabase(URL.createObjectURL(image as Blob), 'url', uid());
        return imageUploadSupaBase;
      }),
    );

    const { images: imagesGenerated, taskId } = await imagenService.editImage(prompt, imageUploadSupaBases[0]);

    return { images: imagesGenerated, reference: imageUploadSupaBases, taskId };
  } catch (error) {
    console.log('Fail to edit image: ', error);
    return { image: [] };
  }
};
