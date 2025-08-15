import { s3Service } from '~/infrastructures/services/s3.service';
import { uid } from '../utils/uid';
import { imagenService } from '~/infrastructures/services/imagen.service';
import { imagenRepository } from '~/frame-works/database/repositories/imagen.repository';
import { ImagenValue } from '~/domains/entities/imagen.entity';

export const editImageFlow = async (prompt: string, images: File[]) => {
  try {
    const imageUploadSupaBases = await Promise.all(
      images.map(async image => {
        const imageUploadSupaBase = await s3Service.uploadImage(URL.createObjectURL(image as Blob), 'url', uid());
        return imageUploadSupaBase;
      }),
    );

    const imagen = (await imagenRepository.create({
      format: 'edit',
      data: {
        prompt: prompt,
        reference: imageUploadSupaBases || [],
      },
      taskId: '',
      imagens: [],
      status: 'PROCESSING',
    })) as ImagenValue;

    const { images: imagesGenerated, taskId } = await imagenService.editImage(prompt, imageUploadSupaBases[0]);

    return { images: imagesGenerated, taskId, id: imagen._id as string };
  } catch (error) {
    console.log('Fail to edit image: ', error);
    return { image: [], taskId: '' };
  }
};
