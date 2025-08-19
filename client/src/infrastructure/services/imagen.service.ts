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
    generateImageStreaming: async (data: FormData, onEvent: (event: any) => void) => {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BE_CDN}/generative/image/streaming`,
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.body) {
        throw new Error('Streaming not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = '';
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          
          // Process complete lines
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep incomplete line in buffer
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
                onEvent(data);
              } catch (e) {
                console.warn('Failed to parse streaming data:', e);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
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
