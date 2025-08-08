export interface ImagenServicePort {
  generateImage: (
    data: FormData
  ) => Promise<{ images: string[]; taskId: string; id: string }>;
  editImage: (
    data: FormData
  ) => Promise<{ images: string[]; taskId: string; id: string }>;
  downloadImageGenerated: (data: {
    option: string;
    id: string;
  }) => Promise<{ images: string[] }>;
}
