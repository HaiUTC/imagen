export interface CustomInstructions {
  prompt: string;
  n: number;
  aspect_ratio: string;
  style: string;
  images: File[] | null;
}
