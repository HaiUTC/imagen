import { create } from "zustand";
export interface ImagenValue {
  generate: GenerateValue;
  edit: EditValue;
}

interface GeneratedImagesValue {
  generate: {
    images: string[];
    id: string;
    taskId: string;
  };
  edit: {
    images: string[];
    id: string;
    taskId: string;
  };
}

interface GenerateValue {
  prompt: string;
  n: number;
  aspect_ratio: string;
  style: string;
  image?: File[];
}

interface EditValue {
  prompt: string;
  image?: File[];
}

export interface ImagenStore {
  format: keyof ImagenValue | null;
  loadingGenerate: boolean;
  taskIdGenerated: string;
  loadingDownload: boolean;
  data: ImagenValue;
  errors: Record<string, string>;
  isDownloaded: boolean;
  generatedImages: GeneratedImagesValue;
  setFormat: (format: keyof ImagenValue | null) => void;
  setLoadingGenerate: (loadingGenerate: boolean) => void;
  setTaskIdGenerated: (taskIdGenerated: string) => void;
  setLoadingDownload: (loadingDownload: boolean) => void;
  setErrors: (errors: Record<string, string>) => void;
  setIsDownloaded: (isDownloaded: boolean) => void;
  onChangeDataValue: (
    format: keyof ImagenValue,
    key: string,
    value: string | number | File[]
  ) => void;
  setGeneratedImages: (
    format: keyof GeneratedImagesValue,
    generatedImages: {
      images: string[];
      id: string;
      taskId: string;
    }
  ) => void;

  clearData: () => void;
}

export const useImagenStore = create<ImagenStore>((set) => ({
  format: null,
  loadingGenerate: false,
  taskIdGenerated: "",
  loadingDownload: false,
  errors: {},
  isDownloaded: false,
  generatedImages: {
    generate: {
      images: [],
      id: "",
      taskId: "",
    },
    edit: {
      images: [],
      id: "",
      taskId: "",
    },
  },
  data: {
    generate: {
      prompt: "",
      n: 1,
      aspect_ratio: "3:4",
      style: "realistic",
      image: [],
    },
    edit: {
      prompt: "",
      image: [],
    },
  },
  setFormat: (format: keyof ImagenValue | null) => {
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
  setErrors: (errors: Record<string, string>) => {
    set({ errors });
  },
  setIsDownloaded: (isDownloaded: boolean) => {
    set({ isDownloaded });
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
    generatedImages: {
      images: string[];
      id: string;
      taskId: string;
    }
  ) => {
    set((state) => ({
      generatedImages: { ...state.generatedImages, [format]: generatedImages },
    }));
  },
  clearData: () => {
    set({
      data: {
        generate: {
          prompt: "",
          n: 1,
          aspect_ratio: "3:4",
          style: "realistic",
          image: [],
        },
        edit: {
          prompt: "",
          image: [],
        },
      },
      loadingGenerate: false,
      taskIdGenerated: "",
      loadingDownload: false,
      errors: {},
      isDownloaded: false,
      generatedImages: {
        generate: {
          images: [],
          id: "",
          taskId: "",
        },
        edit: {
          images: [],
          id: "",
          taskId: "",
        },
      },
    });
  },
}));
