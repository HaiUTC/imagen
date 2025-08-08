export interface CustomInstructions {
  prompt: string;
  n: number;
  aspect_ratio: string;
  style: string;
  images: File[] | null;
}

export interface ImagenValue {
  _id?: string;
  format: string;
  taskId: string;
  imagens: string[];
  data: {
    prompt?: string;
    aspectRatio?: string;
    n?: number;
    style?: string;
    magic_prompt?: string;
    reference?: string[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}
