import { create } from "zustand";
import type { GenerateImageEntity } from "../domain/entities/generate-image.entity";

export interface ImageGenerated {
  id: number;
  url: string;
}

export interface GenerateImageStore {
  userPrompt: string;
  customInstructions: GenerateImageEntity.CustomInstructions;
  loadingGenerateImage: boolean;
  imageGeneratedUrl: ImageGenerated[];
  errorGenerateImage: string;
  onChangeUserPrompt: (userPrompt: string) => void;
  setLoadingGenerateImage: (loadingGenerateImage: boolean) => void;
  onChangeCustomInstructions: (
    customInstructions: GenerateImageEntity.CustomInstructions
  ) => void;
  setImageGeneratedUrl: (imageGeneratedUrl: ImageGenerated[]) => void;
  setErrorGenerateImage: (errorGenerateImage: string) => void;
  clearData: () => void;
}

export const useGenerateImageStore = create<GenerateImageStore>((set) => ({
  userPrompt: "",
  referenceImage: null,
  customInstructions: {
    model: "plus",
    // theme_type: 'e-commerce',
    // section_type: 'hero',
    aspect_ratio: "4:3",
    number_output: "1",
    style: "realistic",
    reference_image: null,
  },
  loadingGenerateImage: false,
  imageGeneratedUrl: [
    {
      id: 1,
      url: "https://mbosethldhseoyvfihje.supabase.co/storage/v1/object/public/images//screenshot_mcx631wf1jzv.jpeg",
    },
  ],
  errorGenerateImage: "",
  setLoadingGenerateImage: (loadingGenerateImage: boolean) => {
    set({ loadingGenerateImage });
  },
  onChangeUserPrompt: (userPrompt: string) => {
    set({ userPrompt });
  },
  onChangeCustomInstructions: (
    customInstructions: GenerateImageEntity.CustomInstructions
  ) => {
    set({ customInstructions });
  },
  setImageGeneratedUrl: (imageGeneratedUrl: ImageGenerated[]) => {
    set({ imageGeneratedUrl });
  },
  setErrorGenerateImage: (errorGenerateImage: string) => {
    set({ errorGenerateImage });
  },
  clearData: () => {
    set({
      userPrompt: "",
      customInstructions: {
        model: "normal",
        aspect_ratio: "4:3",
        number_output: "1",
        style: "realistic",
        reference_image: null,
      },
      loadingGenerateImage: false,
      imageGeneratedUrl: [],
      errorGenerateImage: "",
    });
  },
}));
