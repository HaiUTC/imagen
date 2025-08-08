import { imagenService } from "../../infrastructure/services/imagen.service";
import { useImagenStore } from "../../store/imagen.store";

export const editImageFlow = async () => {
  const { data, setLoadingGenerate, setGeneratedImages, setTaskIdGenerated } =
    useImagenStore.getState();
  setLoadingGenerate(true);

  try {
    const formData = new FormData();

    formData.append("prompt", data.edit.prompt);
    data.edit.image?.forEach((image) => {
      formData.append("images", image);
    });

    const { images, taskId, id } = await imagenService.editImage(formData);
    setTaskIdGenerated(taskId);
    setGeneratedImages("edit", {
      images,
      id,
      taskId,
    });
  } catch (error) {
    console.error("Error in editImageFlow:", error);
    throw error; // Re-throw so the calling code can handle it
  } finally {
    setLoadingGenerate(false);
  }
};
