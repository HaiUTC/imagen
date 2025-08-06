import { templateService } from "../../infrastructure/services/template.service";

export const addImagenToTemplateFlow = async (data: {
  imagenId: string;
  id?: string;
  name?: string;
  description?: string;
}) => {
  const template = await templateService.addImagenToTemplate(data);
};
