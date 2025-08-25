import { create } from "zustand";

export interface ImagenDetailData {
  format: keyof ImagenValue;
  data: {
    prompt: string;
    n: number;
    aspect_ratio: string;
    style: string;
    reference?: string[];
    perspective?: {
      image: string;
      analytic: string;
    };
    magic_prompt: string;
  };
  taskId: string;
  imagens: string[];
  status: string;
}

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
  perspective?: File;
}

interface EditValue {
  prompt: string;
  image?: File[];
}

export type StreamingStep =
  | "analytic_request"
  | "magic_processing"
  | "generate_image"
  | "workflow";

export interface StreamingStatus {
  step: StreamingStep;
  type: "start" | "complete" | "progress";
  progress: number;
  message?: string;
  data?: any;
}

export interface ImagenStore {
  format: keyof ImagenValue;
  loadingGenerate: boolean;
  loadingDownload: boolean;
  loadingUpscale: boolean;
  taskIdGenerated: string;
  data: ImagenValue;
  errors: Record<string, string>;
  isDownloaded: boolean;
  generatedImages: GeneratedImagesValue;
  streamingStatus: StreamingStatus | null;
  isStreamingEnabled: boolean;
  setFormat: (format: keyof ImagenValue) => void;
  setLoadingGenerate: (loadingGenerate: boolean) => void;
  setTaskIdGenerated: (taskIdGenerated: string) => void;
  setLoadingDownload: (loadingDownload: boolean) => void;
  setErrors: (errors: Record<string, string>) => void;
  setIsDownloaded: (isDownloaded: boolean) => void;
  setLoadingUpscale: (loadingUpscale: boolean) => void;
  onChangeDataValue: (
    format: keyof ImagenValue,
    key: string,
    value: string | number | File[] | File
  ) => void;
  setGeneratedImages: (
    format: keyof GeneratedImagesValue,
    generatedImages: {
      images: string[];
      id: string;
      taskId: string;
    }
  ) => void;
  setStreamingStatus: (status: StreamingStatus | null) => void;
  setStreamingEnabled: (enabled: boolean) => void;
  clearData: () => void;
}

export const useImagenStore = create<ImagenStore>((set) => ({
  format: "generate",
  loadingGenerate: false,
  taskIdGenerated: "",
  loadingDownload: false,
  loadingUpscale: false,
  errors: {},
  isDownloaded: false,
  streamingStatus: null,
  isStreamingEnabled: true,
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
      perspective: undefined,
    },
    edit: {
      prompt: "",
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
  setLoadingUpscale: (loadingUpscale: boolean) => {
    set({ loadingUpscale });
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
    value: string | number | File[] | File
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
  setStreamingStatus: (status: StreamingStatus | null) => {
    set({ streamingStatus: status });
  },
  setStreamingEnabled: (enabled: boolean) => {
    set({ isStreamingEnabled: enabled });
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
          perspective: undefined,
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
      streamingStatus: null,
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

interface ImagenDetailStore {
  imagenDetail?: ImagenDetailData;
  loading: boolean;
  setImagenDetail: (template: ImagenDetailData) => void;
  setLoading: (loading: boolean) => void;
}

export const useImagenDetailStore = create<ImagenDetailStore>((set) => ({
  imagenDetail: undefined,
  loading: false,

  setImagenDetail: (template?: ImagenDetailData) => {
    set({ imagenDetail: template });
  },
  setLoading: (loading: boolean) => {
    set({ loading });
  },
}));
