export interface Template {
  _id: string;
  name: string;
  description: string;
  imagen: {
    _id: string;
    imagens: string[];
  };
}

export interface PaginatedImagen {
  _id: string;
  format: "generate" | "edit";
  imagen: string;
  status: string;
  updatedAt: string;
}

export interface PaginationResult<T> {
  data: T[];
  count: number;
  beforeId: string | null;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface TemplateServicePort {
  getAllTemplates: () => Promise<Template[]>;
  getImagensPaginated: (params: {
    templateId?: string;
    beforeId?: string;
  }) => Promise<PaginationResult<PaginatedImagen>>;
  addImagenToTemplate: (data: {
    imagenId: string;
    id?: string;
    name?: string;
    description?: string;
  }) => Promise<{ status: string }>;
}
