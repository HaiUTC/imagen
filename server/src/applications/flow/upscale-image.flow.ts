import { imagenService } from '~/infrastructures/services/imagen.service';
import { StreamingEvent } from '../events/streaming-event.class';
import { uid } from '../utils/uid';
import { s3Service } from '~/infrastructures/services/s3.service';

export const upscaleImageGeneratedFlow = async (id: string, onEvent?: (event: StreamingEvent) => void) => {
  const emitEvent = (event: StreamingEvent) => {
    onEvent?.(event);
    return event;
  };

  let images: string[] = [];
  const imageUpscale1 = await imagenService.upscaleImage(id, 1, process.env.VISION_DOWLOAD_API_KEY1!);
  const uniqueId = uid('generate_');
  const imageUpscalePublicUrl1 = await s3Service.uploadImage(imageUpscale1, 'url', uniqueId);
  emitEvent(StreamingEvent.stepStart('upscale_image', 100, imageUpscalePublicUrl1));
  images.push(imageUpscalePublicUrl1);

  const imageUpscale2 = await imagenService.upscaleImage(id, 2, process.env.VISION_DOWLOAD_API_KEY2!);
  const uniqueId2 = uid('generate_');
  const imageUpscalePublicUrl2 = await s3Service.uploadImage(imageUpscale2, 'url', uniqueId2);
  emitEvent(StreamingEvent.stepStart('upscale_image', 100, imageUpscalePublicUrl2));
  images.push(imageUpscalePublicUrl2);

  const imageUpscale3 = await imagenService.upscaleImage(id, 3, process.env.VISION_DOWLOAD_API_KEY3!);
  const uniqueId3 = uid('generate_');
  const imageUpscalePublicUrl3 = await s3Service.uploadImage(imageUpscale3, 'url', uniqueId3);
  emitEvent(StreamingEvent.stepStart('upscale_image', 100, imageUpscalePublicUrl3));
  images.push(imageUpscalePublicUrl3);

  const imageUpscale4 = await imagenService.upscaleImage(id, 4, process.env.VISION_DOWLOAD_API_KEY4!);
  const uniqueId4 = uid('generate_');
  const imageUpscalePublicUrl4 = await s3Service.uploadImage(imageUpscale4, 'url', uniqueId4);
  emitEvent(StreamingEvent.stepStart('upscale_image', 100, imageUpscalePublicUrl4));
  images.push(imageUpscalePublicUrl4);

  return images;
};
