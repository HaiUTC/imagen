import { imagenService } from "../../infrastructure/services/imagen.service";
import { downloadImagesFromArray } from "../../libs/utils/download-image";
import { useImagenStore } from "../../store/imagen.store";

export const upscaleImageFlow = async (taskId: string) => {
  const { loadingUpscale, setLoadingUpscale, setGeneratedImages } =
    useImagenStore.getState();

  if (loadingUpscale) return;

  setLoadingUpscale(true);

  try {
    await imagenService.upscaleImageStreaming(taskId, (event) => {
      if (event.type === "upscale_image") {
        const { format, generatedImages } = useImagenStore.getState();
        setGeneratedImages(format, {
          ...generatedImages[format],
          images: [...generatedImages[format].images, event.data],
        });
        downloadImagesFromArray([event.data]);
      }
    });
  } catch (error) {
  } finally {
    setLoadingUpscale(false);
  }
};
