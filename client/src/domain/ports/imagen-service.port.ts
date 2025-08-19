export interface ImagenServicePort {
  generateImage: (
    data: FormData
  ) => Promise<{ images: string[]; taskId: string; id: string }>;
  generateImageStreaming: (
    data: FormData,
    onEvent: (event: any) => void
  ) => Promise<void>;
  editImage: (
    data: FormData
  ) => Promise<{ images: string[]; taskId: string; id: string }>;
  downloadImageGenerated: (data: {
    option: string;
    id: string;
  }) => Promise<{ images: string[] }>;
}
