import { Types } from 'mongoose';
import { templateRepository } from '~/frame-works/database/repositories/template.repository';

const getAllTemplates = async () => {
  try {
    const templates = await templateRepository.findAll();
    return templates;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw new Error('Failed to fetch templates');
  }
};

const getTemplateById = async (id: string) => {
  try {
    const template = await templateRepository.findById(id);
    if (!template) {
      throw new Error('Template not found');
    }
    return template;
  } catch (error) {
    console.error('Error fetching template by ID:', error);
    throw new Error('Failed to fetch template');
  }
};

const addImagenToTemplate = async (data: { imagenId: string; id?: string; name?: string; description?: string }) => {
  try {
    if (data.name) {
      const template = await templateRepository.create({
        name: data.name,
        description: data.description || '',
        imagen: [new Types.ObjectId(data.imagenId)],
      });
      return template;
    } else if (data.id) {
      const template = await templateRepository.addImagenToTemplate(data.id, data.imagenId);
      return template;
    } else {
      throw new Error('Invalid request');
    }
  } catch (error) {
    console.error('Error updating template:', error);
    throw new Error('Failed to update template');
  }
};

const deleteImagenFromTemplate = async (id: string, imagenId: string) => {
  try {
    const template = await templateRepository.removeImagenFromTemplate(id, imagenId);
    return template;
  } catch (error) {
    console.error('Error deleting imagen from template:', error);
    throw new Error('Failed to delete imagen from template');
  }
};

const updateTemplate = async (id: string, name?: string, description?: string) => {
  try {
    const template = await templateRepository.update(id, { name, description });
    return template;
  } catch (error) {
    console.error('Error updating template:', error);
    throw new Error('Failed to update template');
  }
};

const deleteTemplate = async (id: string) => {
  try {
    const template = await templateRepository.delete(id);
    return template;
  } catch (error) {
    console.error('Error deleting template:', error);
    throw new Error('Failed to delete template');
  }
};

export const TemplateService = {
  getAllTemplates,
  getTemplateById,
  addImagenToTemplate,
  deleteImagenFromTemplate,
  updateTemplate,
  deleteTemplate,
};
