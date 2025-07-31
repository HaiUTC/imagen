interface ImagenServicePort {
  generateImage: (
    data: FormData
  ) => Promise<{ images: string[]; taskId: string }>;
  downloadImageGenerated: (data: {
    option: string;
    id: string;
  }) => Promise<{ images: string[] }>;
  removeBackground: (formData: FormData) => Promise<{ images: string[] }>;
  reframeImage: (formData: FormData) => Promise<{ images: string[] }>;
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
    removeBackground: async (formData: FormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BE_CDN}/remove-background`,
        {
          method: "POST",
          body: formData,
        }
      );

      return response.json();
    },
    reframeImage: async (formData: FormData) => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BE_CDN}/reframe`,
        {
          method: "POST",
          body: formData,
        }
      );

      return response.json();
    },
  };
};

export const imagenService = createImagenService();
