import { imagenService } from "../../infrastructure/services/imagen.service";
import { useImagenDetailStore } from "../../store/imagen.store";

export const getImagenFlow = async (id: string) => {
  const { setLoading, setImagenDetail } = useImagenDetailStore.getState();

  setLoading(true);

  try {
    const imagen = await imagenService.getImagen(id);
    setImagenDetail(imagen);
  } catch (error) {
    console.error("Failed to fetch imagen:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};
