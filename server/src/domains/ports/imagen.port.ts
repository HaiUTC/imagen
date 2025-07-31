import { CustomInstructions } from '../entities/generate-image.entity';

export interface GenerateImagePort {
  user_prompt: string;
  custom_instructions: CustomInstructions;
}

export interface RemoveBackgroundPort {
  image: File;
}

export interface ReframeImagePort extends RemoveBackgroundPort {
  resolution: string;
  n: number;
}
