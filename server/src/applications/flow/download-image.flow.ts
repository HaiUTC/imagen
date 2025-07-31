import { imagenService } from '~/infrastructures/services/imagen.service';

export const downloadImageGeneratedFlow = async (option: string, id: string) => {
  let images: string[] = [];

  if (option === 'all') {
    images = await Promise.all([
      imagenService.downloadImageGenerated(id, 1),
      imagenService.downloadImageGenerated(id, 2),
      imagenService.downloadImageGenerated(id, 3),
      imagenService.downloadImageGenerated(id, 4),
    ]);
  } else {
    const image = await imagenService.downloadImageGenerated(id, 1);
    images.push(image);
  }

  return images;
};
