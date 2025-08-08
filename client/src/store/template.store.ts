import { create } from "zustand";

export interface Template {
  _id: string;
  name: string;
  description: string;
  imagen: {
    _id: string;
    imagens: string[];
  };
}

interface TemplateStore {
  templates: Template[];
  loading: boolean;
  status: string;
  setTemplates: (templates: Template[]) => void;
  setLoading: (loading: boolean) => void;
  setStatus: (status: string) => void;
}

export const useTemplateStore = create<TemplateStore>((set) => ({
  templates: [],
  loading: false,
  status: "",
  setTemplates: (templates: Template[]) => {
    set({ templates });
  },
  setLoading: (loading: boolean) => {
    set({ loading });
  },
  setStatus: (status: string) => {
    set({ status });
  },
}));
