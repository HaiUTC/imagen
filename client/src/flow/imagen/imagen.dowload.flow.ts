import { imagenService } from "../../infrastructure/services/imagen.service";
import { downloadImagesFromArray } from "../../libs/utils/download-image";
import { useImagenStore } from "../../store/imagen.store";

export const imagenDownloadFlow = async (taskId: string) => {
  const { loadingDownload, setLoadingDownload } = useImagenStore.getState();

  if (loadingDownload) return;

  setLoadingDownload(true);

  const { images } = await imagenService.downloadImageGenerated({
    option: "all",
    id: taskId,
  });
  downloadImagesFromArray(images);

  setLoadingDownload(false);
};
