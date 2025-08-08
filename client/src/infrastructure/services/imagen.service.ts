import type { ImagenServicePort } from "../../domain/ports/imagen-service.port";

const createImagenService = (): ImagenServicePort => {
  return {
    generateImage: async (data: FormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BE_CDN}/generative/image`,
        {
          method: "POST",
          body: data,
        }
      );

      return response.json();
    },
    editImage: async (data: FormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BE_CDN}/generative/edit`,
        {
          method: "POST",
          body: data,
        }
      );
      return response.json();
    },
    downloadImageGenerated: async (data: { option: string; id: string }) => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BE_CDN}/generative/image/download`,
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

export const imagenService = createImagenService();
