export namespace GenerateImageEntity {
  export interface CustomInstructions {
    model: string;
    number_output: string;
    // theme_type: string;
    // section_type: string;
    aspect_ratio: string;
    style: string;
    reference_image: File | null;
  }

  export interface GenerateImageInput {
    prompt: string;
    customInstructions: CustomInstructions;
  }
}
