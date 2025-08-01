import { imagenService } from "../infrastructure/services/imagen.service";
import { downloadImagesFromArray } from "../libs/utils/download-image";
import { useImagenStore } from "../store/imagen.store";

export const imagenDownloadFlow = async (option: string) => {
  const { setLoadingDownload, taskIdGenerated, format, generatedImages } =
    useImagenStore.getState();

  setLoadingDownload(true);

  if (format === "generate_v2") {
    if (option === "all") {
      downloadImagesFromArray(generatedImages.generate_v2);
    } else {
      downloadImagesFromArray([generatedImages.generate_v2[+option - 1]]);
    }
  } else {
    const { images } = await imagenService.downloadImageGenerated({
      option,
      id: taskIdGenerated,
    });
    console.log("images", images);
    downloadImagesFromArray(images);
  }

  setLoadingDownload(false);
};
