import { imagenService } from '~/infrastructures/services/imagen.service';

export const downloadImageGeneratedFlow = async (option: string, id: string) => {
  let images: string[] = [];

  if (option === 'all') {
    // Batch 1: Download images 1 and 2 concurrently
    const [image1, image2] = await Promise.all([
      imagenService.downloadImageGenerated(id, 1, process.env.VISION_DOWLOAD_API_KEY1!),
      imagenService.downloadImageGenerated(id, 2, process.env.VISION_DOWLOAD_API_KEY2!),
    ]);
    images.push(image1, image2);

    // Batch 2: Download images 3 and 4 concurrently
    const [image3, image4] = await Promise.all([
      imagenService.downloadImageGenerated(id, 3, process.env.VISION_DOWLOAD_API_KEY3!),
      imagenService.downloadImageGenerated(id, 4, process.env.VISION_DOWLOAD_API_KEY4!),
    ]);
    images.push(image3, image4);
  } else {
    const image = await imagenService.downloadImageGenerated(id, +option, process.env.VISION_DOWLOAD_API_KEY1!);
    images.push(image);
  }

  return images;
};
