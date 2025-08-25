import type {
  TemplateServicePort,
  PaginationResult,
  PaginatedImagen,
} from "../../domain/ports/template-service.port";

const createTemplateService = (): TemplateServicePort => {
  return {
    getAllTemplates: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BE_CDN}/templates`
      );
      return response.json();
    },
    getImagensPaginated: async (params: {
      templateId?: string;
      beforeId?: string;
    }): Promise<PaginationResult<PaginatedImagen>> => {
      const searchParams = new URLSearchParams();

      if (params.templateId) {
        searchParams.append("template", params.templateId);
      }

      if (params.beforeId) {
        searchParams.append("before", params.beforeId);
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_APP_BE_CDN
        }/templates/imagens?${searchParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch paginated images: ${response.statusText}`
        );
      }

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
