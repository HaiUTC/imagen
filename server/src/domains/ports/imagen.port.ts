import { CustomInstructions } from '../entities/imagen.entity';

export interface GenerateImagePort {
  user_prompt: string;
  custom_instructions: CustomInstructions;
}
