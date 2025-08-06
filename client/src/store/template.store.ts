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
  setTemplates: (templates: Template[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useTemplateStore = create<TemplateStore>((set) => ({
  templates: [],
  loading: false,
  setTemplates: (templates: Template[]) => {
    set({ templates });
  },
  setLoading: (loading: boolean) => {
    set({ loading });
  },
}));
