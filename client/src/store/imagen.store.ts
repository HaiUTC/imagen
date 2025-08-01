import { create } from "zustand";

// type Format =
//   | "generate"
//   | "upscale"
//   | "remove-background"
//   | "resize"
//   | "shadow"
//   | "fashion"
//   | "video";

interface ImagenValue {
  generate: GenerateValue;
  generate_v2: GenerateValue;
}

interface GeneratedImagesValue {
  generate: string[];
  generate_v2: string[];
}

interface GenerateValue {
  prompt: string;
  n: number;
  aspect_ratio: string;
  style: string;
  image?: File[];
}

export interface ImagenStore {
  format: keyof ImagenValue;
  loadingGenerate: boolean;
  taskIdGenerated: string;
  loadingDownload: boolean;
  data: ImagenValue;
  generatedImages: GeneratedImagesValue;
  setFormat: (format: keyof ImagenValue) => void;
  setLoadingGenerate: (loadingGenerate: boolean) => void;
  setTaskIdGenerated: (taskIdGenerated: string) => void;
  setLoadingDownload: (loadingDownload: boolean) => void;
  onChangeDataValue: (
    format: keyof ImagenValue,
    key: string,
    value: string | number | File[]
  ) => void;
  setGeneratedImages: (
    format: keyof GeneratedImagesValue,
    generatedImages: string[]
  ) => void;
}

export const useImagenStore = create<ImagenStore>((set) => ({
  format: "generate",
  loadingGenerate: false,
  taskIdGenerated: "",
  loadingDownload: false,
  generatedImages: {
    generate: [],
    generate_v2: [],
  },
  data: {
    generate: {
      prompt: "",
      n: 1,
      aspect_ratio: "3:4",
      style: "realistic",
      image: [],
    },
    generate_v2: {
      prompt: "",
      n: 1,
      aspect_ratio: "3:4",
      style: "realistic",
      image: [],
    },
  },
  setFormat: (format: keyof ImagenValue) => {
    set({ format });
  },
  setLoadingGenerate: (loadingGenerate: boolean) => {
    set({ loadingGenerate });
  },
  setTaskIdGenerated: (taskIdGenerated: string) => {
    set({ taskIdGenerated });
  },
  setLoadingDownload: (loadingDownload: boolean) => {
    set({ loadingDownload });
  },
  onChangeDataValue: (
    format: keyof ImagenValue,
    key: string,
    value: string | number | File[]
  ) => {
    set((state) => ({
      data: {
        ...state.data,
        [format]: { ...state.data[format as keyof ImagenValue], [key]: value },
      },
    }));
  },
  setGeneratedImages: (
    format: keyof GeneratedImagesValue,
    generatedImages: string[]
  ) => {
    set((state) => ({
      generatedImages: { ...state.generatedImages, [format]: generatedImages },
    }));
  },
}));
