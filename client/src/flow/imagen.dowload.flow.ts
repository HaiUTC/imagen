import { imagenService } from "../infrastructure/services/imagen.service";
import { downloadImagesFromArray } from "../libs/utils/download-image";
import { useImagenStore } from "../store/imagen.store";

export const imagenDownloadFlow = async (option: string) => {
  const { setLoadingDownload, taskIdGenerated } = useImagenStore.getState();

  setLoadingDownload(true);

  const { images } = await imagenService.downloadImageGenerated({
    option,
    id: taskIdGenerated,
  });
  console.log("images", images);

  setLoadingDownload(false);
  downloadImagesFromArray(images);
};
