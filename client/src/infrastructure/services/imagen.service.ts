interface ImagenServicePort {
  generateImage: (
    data: FormData
  ) => Promise<{ images: string[]; taskId: string }>;
  downloadImageGenerated: (data: {
    option: string;
    id: string;
  }) => Promise<{ images: string[] }>;
  generateImageWithImagen: (data: FormData) => Promise<{ images: string[] }>;
}

const createImagenService = (): ImagenServicePort => {
  return {
    generateImage: async (data: FormData) => {
      const response = await fetch(`${import.meta.env.VITE_APP_BE_CDN}/image`, {
        method: "POST",
        body: data,
      });

      return response.json();
    },
    downloadImageGenerated: async (data: { option: string; id: string }) => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BE_CDN}/image/download`,
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
    generateImageWithImagen: async (data: FormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BE_CDN}/image/advanced`,
        {
          method: "POST",
          body: data,
        }
      );

      return response.json();
    },
  };
};

export const imagenService = createImagenService();
