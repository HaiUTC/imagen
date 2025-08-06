import { templateService } from "../../infrastructure/services/template.service";
import { useTemplateStore } from "../../store/template.store";

export const getTemplatesFlow = async () => {
  const { setLoading, setTemplates } = useTemplateStore.getState();

  setLoading(true);

  const templates = await templateService.getAllTemplates();
  setTemplates(templates);

  setLoading(false);
};
