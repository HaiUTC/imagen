import { imagenService } from "../../infrastructure/services/imagen.service";
import { useImagenStore } from "../../store/imagen.store";

export const imagenSubmitFlow = async () => {
  const {
    format,
    data,
    setLoadingGenerate,
    setGeneratedImages,
    setTaskIdGenerated,
  } = useImagenStore.getState();

  const formData = new FormData();

  setLoadingGenerate(true);

  try {
    if (format === "generate") {
      formData.append("prompt", data.generate.prompt);
      formData.append("n", data.generate.n.toString());
      formData.append("aspect_ratio", data.generate.aspect_ratio);
      formData.append("style", data.generate.style);
      if (data.generate.image) {
        data.generate.image.forEach((image) => {
          formData.append("images", image);
        });
      }
      const { images, taskId, id } = await imagenService.generateImage(
        formData
      );
      setTaskIdGenerated(taskId);
      setGeneratedImages("generate", {
        images,
        id,
        taskId,
      });
    }
  } catch (error) {
    console.error("Error in imagenSubmitFlow:", error);
    throw error; // Re-throw so the calling code can handle it
  } finally {
    setLoadingGenerate(false);
  }
};
