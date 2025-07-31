import { imagenService } from "../infrastructure/services/imagen.service";
import { useImagenStore } from "../store/imagen.store";

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
      const { images, taskId } = await imagenService.generateImage(formData);
      setTaskIdGenerated(taskId);
      setGeneratedImages("generate", images);
    } else if (format === "remove_background") {
      if (
        !data.remove_background?.image ||
        data.remove_background.image.length === 0
      ) {
        throw new Error("No image selected for background removal");
      }

      const selectedImage = data.remove_background.image[0];
      if (!selectedImage) {
        throw new Error("Selected image is invalid");
      }

      formData.append("image", selectedImage);
      const { images } = await imagenService.removeBackground(formData);
      setGeneratedImages("remove_background", images);
    } else if (format === "reframe") {
      formData.append("image", data.reframe.image[0]);
      formData.append("resolution", data.reframe.resolution);
      formData.append("n", data.reframe.n.toString());
      const { images } = await imagenService.reframeImage(formData);
      setGeneratedImages("reframe", images);
    }
  } catch (error) {
    console.error("Error in imagenSubmitFlow:", error);
    throw error; // Re-throw so the calling code can handle it
  } finally {
    setLoadingGenerate(false);
  }
};
