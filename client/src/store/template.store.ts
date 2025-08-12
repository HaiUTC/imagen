import { create } from "zustand";
import type {
  Template,
  PaginatedImagen,
} from "../domain/ports/template-service.port";

// Re-export types for convenience
export type { Template, PaginatedImagen };

export interface PaginationState {
  data: PaginatedImagen[];
  count: number;
  beforeId: string | null;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface TemplateStore {
  templates: Template[];
  paginatedImages: PaginationState;
  loading: boolean;
  paginationLoading: boolean;
  status: string;
  currentTemplateId: string | null;
  setTemplates: (templates: Template[]) => void;
  setPaginatedImages: (pagination: PaginationState) => void;
  appendPaginatedImages: (pagination: PaginationState) => void;
  setLoading: (loading: boolean) => void;
  setPaginationLoading: (loading: boolean) => void;
  setStatus: (status: string) => void;
  setCurrentTemplateId: (templateId: string | null) => void;
  clearPaginatedImages: () => void;
}

export const useTemplateStore = create<TemplateStore>((set, get) => ({
  templates: [],
  paginatedImages: {
    data: [],
    count: 0,
    beforeId: null,
    hasNext: false,
    hasPrevious: false,
  },
  loading: false,
  paginationLoading: false,
  status: "",
  currentTemplateId: null,
  setTemplates: (templates: Template[]) => {
    set({ templates });
  },
  setPaginatedImages: (pagination: PaginationState) => {
    set({ paginatedImages: pagination });
  },
  appendPaginatedImages: (pagination: PaginationState) => {
    const currentImages = get().paginatedImages.data;
    set({
      paginatedImages: {
        ...pagination,
        data: [...currentImages, ...pagination.data],
      },
    });
  },
  setLoading: (loading: boolean) => {
    set({ loading });
  },
  setPaginationLoading: (loading: boolean) => {
    set({ paginationLoading: loading });
  },
  setStatus: (status: string) => {
    set({ status });
  },
  setCurrentTemplateId: (templateId: string | null) => {
    set({ currentTemplateId: templateId });
  },
  clearPaginatedImages: () => {
    set({
      paginatedImages: {
        data: [],
        count: 0,
        beforeId: null,
        hasNext: false,
        hasPrevious: false,
      },
    });
  },
}));
