export interface TemplateServicePort {
  getAllTemplates: () => Promise<any[]>;
  addImagenToTemplate: (data: {
    imagenId: string;
    id?: string;
    name?: string;
    description?: string;
  }) => Promise<any>;
}
