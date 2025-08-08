import type { TemplateServicePort } from "../../domain/ports/template-service.port";

const createTemplateService = (): TemplateServicePort => {
  return {
    getAllTemplates: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BE_CDN}/templates`
      );
      return response.json();
    },
    addImagenToTemplate: async (data: {
      imagenId: string;
      id?: string;
      name?: string;
      description?: string;
    }) => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BE_CDN}/templates/imagen`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      return response.json();
    },
  };
};

export const templateService = createTemplateService();
