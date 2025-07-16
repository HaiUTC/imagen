import { CustomInstructions } from '../entities/generate-image.entity';

export interface GenerateImagePort {
  user_prompt: string;
  custom_instructions: CustomInstructions;
}
