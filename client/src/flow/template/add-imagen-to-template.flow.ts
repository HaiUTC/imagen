import { templateService } from "../../infrastructure/services/template.service";
import { useTemplateStore } from "../../store/template.store";

export const addImagenToTemplateFlow = async (data: {
  imagenId: string;
  id?: string;
  name?: string;
  description?: string;
}) => {
  const { setLoading, setStatus } = useTemplateStore.getState();

  setLoading(true);

  const { status } = await templateService.addImagenToTemplate(data);

  setStatus(status);
  setLoading(false);
};
